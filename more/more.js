//
//  more.js
//
//  Created by Armored Dragon on 5 May 2025.
//  Copyright 2025 Overte e.V contributors.
//
//  This interface application allows users to manage and install apps provided by third party repositories easily.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

// -------------------------------------------
// app.js
const appSettings = {
	name: "MORE",
	icon: Script.resolvePath("./img/icon_white.png"),
	activeIcon: Script.resolvePath("./img/icon_black.png"),
	url: Script.resolvePath("./qml/More.qml")
}

let app = {
	toolbarAppButton: null,
	tablet: null,
	active: false,
	add: () => {
		app.tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");

		addAppToToolbar();

		app.tablet.fromQml.connect(onMessageFromQML);
	},
	remove: () => {
		app.tablet.fromQml.disconnect(onMessageFromQML);
		removeAppFromToolbar();
	}
}

ScriptDiscoveryService.scriptCountChanged.connect(() => {
	repos.updateIfAppIsInstalled();
	ui.sendAppListToQML();
});

function addAppToToolbar() {
	// Check if app is on toolbar

	app.toolbarAppButton = app.tablet.addButton({
		icon: appSettings.icon,
		activeIcon: appSettings.activeIcon,
		text: appSettings.name,
		isActive: app.active,
	});

	app.toolbarAppButton.clicked.connect(toolbarButtonClicked);
}
function removeAppFromToolbar() {
	if (app.toolbarAppButton) {
		app.tablet.removeButton(app.toolbarAppButton);
	}
}

function toolbarButtonClicked() {
	if (app.active) {
		deactivateToolbarButton();
	}
	else {
		activateToolbarButton();
	}
}

function onTabletScreenChanged(type, newURL) {
	if (appSettings.url === newURL) {
		activateToolbarButton();
	}
	else {
		deactivateToolbarButton(false);
	}
}

function deactivateToolbarButton(goToHomeScreen = true) {
	if (app.active === false) return; // Already inactive, ignore.

	app.tablet.screenChanged.disconnect(onTabletScreenChanged);
	app.active = false;
	if (goToHomeScreen) app.tablet.gotoHomeScreen();
	app.toolbarAppButton.editProperties({ isActive: false });
}

function activateToolbarButton() {
	if (app.active) return; // Already active, ignore.

	app.tablet.loadQMLSource(appSettings.url);
	app.active = true;
	app.toolbarAppButton.editProperties({ isActive: true });
	app.tablet.screenChanged.connect(onTabletScreenChanged);

	repos.fetchAllAppsFromSavedRepositories();
	ui.sendRepositoryListToQML();
	ui.sendAppListToQML(repos.applications);
}
// -------------------------------------------

// const { app } = Script.require("./lib/app.js");
const format = Script.require("./lib/format.js");
const io = Script.require("./lib/io.js");
// const { repos } = Script.require("./lib/repos.js");
// const { util } = Script.require("./lib/util.js");

const settingsRepositoryListName = "overte.more.repositories";
const settingsAppListName = "overte.more.app";
const settingsIsFirstRun = "overte.more.isFirstRun";

Script.scriptEnding.connect(appShuttingDown);

app.add();

function appShuttingDown() {
	console.log("Shutting down more.js application");
	app.remove();
}

function onMessageFromQML(event) {
	debugLog(event);
	switch (event.type) {
		case "addNewRepositoryButtonClicked":
			let newRepositoryUrl = Window.prompt("Enter the URL of the repository metadata.json file.", "");
			repos.installRepository(newRepositoryUrl);
			break;
		case "installApp":
			apps.install(event.appUrl, event.baseUrl);
			break;
		case "uninstallApp":
			apps.remove(event.appUrl, event.baseUrl);
			break;
		case "openAppRepository":
			Window.openUrl(event.repositoryUrl);
			break;
		case "removeRepository":
			repos.removeRepository(event.entryUrl);
			break;
	}
}

function sendMessageToQML(message) {
	app.tablet.sendToQml(message);
}

function debugLog(content) {
	if (typeof content === "object") content = JSON.stringify(content, null, 4);

	console.log(`[ Debug ] ${content}`);
}

let repos = {
	maxVersion: 2,
	repositories: [],
	applications: [],

	fetchAllAppsFromSavedRepositories: async () => {
		debugLog(`Fetching all saved repositories.`);
		let isLegacyInstalled = false;
		repos.loadRepositoriesFromStorage();
		repos.applications = [];

		const indexOfLegacyRepository = repos.repositories.indexOf("https://raw.githubusercontent.com/overte-org/community-apps/refs/heads/master/applications/metadata.js")
		if (indexOfLegacyRepository > -1) {
			// We remove the legacy url here to prevent any further action being taken using this.
			// This will be inserted back into the array just before we send the list of repositories to the UI
			isLegacyInstalled = true;
			await legacy.requestCommunityApps();
			repos.repositories.splice(indexOfLegacyRepository, 1);
		}

		for (let i = 0; repos.repositories.length > i && 99999 > i; i++) {
			// For each repository we have saved...
			let repositoryMetadata = await repos.fetchRepositoryContent(repos.repositories[i]);

			for (let i = 0; repositoryMetadata.applicationList.length > i && 9999999 > i; i++) {
				// For each app in the repository...
				let app = repositoryMetadata.applicationList[i];

				app = repos._embedRepositoryConstants(app, repositoryMetadata);
				app = repos._formatAppUrls(app);
				app = repos._checkIfInstalled(app);

				repos.applications.push(app);
			}
			debugLog(`Finished formatting repository "${repositoryMetadata.title}".`);
		}
		debugLog(`Finished fetching all repositories.`);

		if (isLegacyInstalled) {
			repos.repositories.push(`https://raw.githubusercontent.com/overte-org/community-apps/refs/heads/master/applications/metadata.js`);
		}

		ui.sendAppListToQML();
		ui.sendRepositoryListToQML();

		// debugLog(repos.applications);

		debugLog(`Finished sending repositories to UI.`);
		return true;
	},
	fetchRepositoryContent: async (url) => {
		let repositoryContent = await util.request(url);
		repositoryContent = util.toJSON(repositoryContent);

		// TODO: Versioning

		return repositoryContent;
	},
	installRepository: async (url) => {
		if (!url) {
			debugLog(`No URL provided! Nothing to do.`);
			return;
		}

		debugLog(`Installing repository: ${url}`);

		if (url === `https://raw.githubusercontent.com/overte-org/community-apps/refs/heads/master/applications/metadata.js`) {
			// Trying to install the legacy metadata.js repository
			repos.repositories.push("https://raw.githubusercontent.com/overte-org/community-apps/refs/heads/master/applications/metadata.js");
			repos._saveRepositoriesToSettings();
			ui.sendAppListToQML();
			ui.sendRepositoryListToQML();
			repos.fetchAllAppsFromSavedRepositories();
			return;
		}

		url = util.extractUrlFromString(url);
		if (url === null) {
			debugLog(`Failed to extract url from string.`);
			return;
		}

		if (repos.doWeHaveThisRepositorySaved(url)) {
			debugLog(`Repository is already saved.`);
			return null;
		}

		let repositoryContent = await repos.fetchRepositoryContent(url);

		if (!repositoryContent) {
			debugLog(`Repository does not contain valid JSON.`);
			return null;
		}

		if (repos.isRepositoryValid(repositoryContent) === false) {
			debugLog(`Repository is not valid.`);
			return null;
		}

		repos.repositories.push(url);

		repos._saveRepositoriesToSettings();
		repositoryContent.applicationList.forEach((entry) => repos.applications.push(entry));

		ui.sendAppListToQML();
		ui.sendRepositoryListToQML();
		repos.fetchAllAppsFromSavedRepositories();

	},
	removeRepository: (url) => {
		if (repos.doWeHaveThisRepositorySaved(url) === false) {
			debugLog(`"${url}" is not saved in our settings. Doing nothing.`);
			return;
		}

		const indexOfRepositoryInSettings = repos.repositories.indexOf(url);

		repos.repositories.splice(indexOfRepositoryInSettings, 1);
		repos._saveRepositoriesToSettings();
		repos.fetchAllAppsFromSavedRepositories();

		ui.sendRepositoryListToQML();
	},
	isRepositoryValid: (repositoryObject) => {
		if (!repositoryObject.version || repositoryObject.version > repos.maxVersion) return false;
		if (!repositoryObject.title) return false;
		if (!repositoryObject.baseApiUrl) return false;
		if (!repositoryObject.applicationList) return false;

		return true;
	},
	doWeHaveThisRepositorySaved: (url) => {
		return repos.repositories.indexOf(url) > -1;
	},
	loadRepositoriesFromStorage: () => {
		repos.repositories = Settings.getValue(settingsRepositoryListName, []);
	},
	_embedRepositoryConstants: (app, repositoryMetadata) => {
		app.repository = {};

		app.repository.baseApiUrl = repositoryMetadata.baseApiUrl;
		app.repository.baseRepositoryUrl = repositoryMetadata.baseRepositoryUrl; // TODO: Change this back to repository homepage
		app.repository.title = repositoryMetadata.title;

		return app;
	},
	_formatAppUrls: (app) => {
		if (util.isValidUrl(app.appIcon) === false) {
			// Application Icon
			debugLog(`"${app.appName}" icon is relative.`);
			app.appIcon = `${app.repository.baseApiUrl}/${app.appBaseDirectory}/${app.appIcon}`;
		}

		Object.keys(app.appScriptVersions).forEach((appVersion) => {
			// Application versions
			let appVersionUrl = app.appScriptVersions[appVersion];
			if (util.isValidUrl(appVersionUrl) === false) {
				debugLog(`"${appVersionUrl}" is relative.`);
				app.appScriptVersions[appVersion] = `${app.repository.baseApiUrl}/${app.appBaseDirectory}/${appVersionUrl}`;
			}
		});

		return app;
	},
	_saveRepositoriesToSettings: () => {
		debugLog(`Saving repositories list to settings.`)
		Settings.setValue(settingsRepositoryListName, repos.repositories);
	},
	_checkIfInstalled: (app) => {
		debugLog(`Checking if ${app.appName} is installed.`)
		app.installedUrl = null;
		app.isInstalled = false;  // Assume the app is not installed.

		const runningScripts = ScriptDiscoveryService.getRunning();
		for (let i = 0; Object.keys(app.appScriptVersions).length > i; i++) {
			// For each of the app versions...
			const appVersionUrl = app.appScriptVersions[Object.keys(app.appScriptVersions)[i]];
			for (let k = 0; runningScripts.length > k; k++) {
				if (appVersionUrl === runningScripts[k].url) {
					app.installedUrl = appVersionUrl;
					app.isInstalled = true;
					break;
				}
			}
			if (app.isInstalled) break;
		}

		return app;
	},
	updateIfAppIsInstalled: () => {
		// Parse through the existing applications array and just checks to see if an app is installed
		const runningScripts = ScriptDiscoveryService.getRunning().map((item) => item.url);
		debugLog(runningScripts)

		for (let i = 0; repos.applications.length > i; i++) {
			// For each application in the array...
			let app = repos.applications[i];
			debugLog(`Checking if ${app.appName} is installed...`);

			app.installedUrl = null;
			app.isInstalled = false;  // Assume the app is not installed.

			for (let k = 0; Object.keys(app.appScriptVersions).length > k; k++) {
				// For each of the app versions...
				const appVersionUrl = app.appScriptVersions[Object.keys(app.appScriptVersions)[k]];
				if (runningScripts.indexOf(appVersionUrl) > -1) {
					app.installedUrl = appVersionUrl;
					app.isInstalled = true;
					break;
				}
			}
			if (app.isInstalled) break;
		}

		return true;
	}
}

let util = {
	toJSON: (input) => {
		if (!input) {
			// Nothing.
			return null;
		}

		if (typeof input === "object") {
			// Already JSON.
			return input;
		}

		try {
			// Convert to JSON.
			let inputJSON = JSON.parse(input);
			return inputJSON;
		}
		catch (error) {
			// Failed to convert to JSON, fail gracefully.
			debugLog(`Error parsing ${input} to JSON.`);
			debugLog(error);
			return null;
		}
	},
	request: (url, method = "GET") => {
		return new Promise((resolve) => {
			debugLog(`Making "${method}" request to "${url}"`);
			if (util.isValidUrl(url) === false) return resolve(null);

			let req = new XMLHttpRequest();

			req.onreadystatechange = function () {
				if (req.readyState === req.DONE) {
					if (req.status === 200) {
						debugLog(`${method} request to ${url} succeeded.`)
						resolve(req.responseText);
					}
					else {
						debugLog("Error", req.status, req.statusText);
						return resolve(null);
					}
				}
			};

			req.open(method, url);
			req.send();
		})
	},
	isValidUrl: (string) => {
		const urlFromString = util.extractUrlFromString(string);
		if (!urlFromString) return false;

		const isHttpProtocol = urlFromString.substring(0, 4) === "http";

		return isHttpProtocol;
	},
	extractUrlFromString: (string) => {
		if (!string) {
			debugLog(`String is null. Can not extract URL.`)
			return;
		}

		string = string.trim();

		const urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/g;
		const doesStringHaveUrl = urlRegex.test(string);
		if (doesStringHaveUrl === false) return null;

		const urlFromString = string.match(urlRegex)[0];

		return urlFromString;
	}
}

let apps = {
	installedApps: [],
	getInstalledApps: () => {
		const runningScripts = ScriptDiscoveryService.getRunning().map((item) => item.url);

		// Get the list of apps we are supposed to have installed 
		apps.installedApps = runningScripts;

		return apps.installedApps;
	},
	install: (app, version) => {
		let url = app.appScriptVersions[version];

		debugLog(`"${version}".`);
		debugLog(`Installing "${url}".`);

		if (util.isValidUrl(url) === false) {
			// Not a url, handle this as a relative path.
			debugLog(`Handling link as a relative url.`);
			url = `${app.appRepositoryUrl}/${app.appBaseDirectory}/${url}`;
			debugLog(`Url was changed to "${url}`);
		}

		url = util.extractUrlFromString(url);
		if (!url) {
			debugLog(`Provided url was invalid.`);
			return null
		}

		if (apps.isAppAlreadyInstalled(url)) {
			debugLog(`App is already installed.`);
			return null;
		}

		// TODO: Check if app is loaded

		ScriptDiscoveryService.loadScript(url, true);
		apps.installedApps.push(url);
		Settings.setValue(settingsAppListName, apps.installedApps);

		return true;
	},
	remove: (url, baseUrl) => {
		debugLog(`Removing ${url}.`);

		if (util.isValidUrl(url) === false) {
			// Not a url, handle this as a relative path.
			debugLog(`Handling link as a relative url.`);
			url = `${baseUrl}/${url}`;
			debugLog(`Url was changed to "${url}`);
		}

		url = util.extractUrlFromString(url);
		if (!url) {
			debugLog(`Provided url was invalid.`);
			return null
		}

		if (apps.isAppAlreadyInstalled(url) === false) {
			debugLog(`"${url}" is not installed.`);
			return null;
		}

		ScriptDiscoveryService.stopScript(url, false);
		const indexOfApp = apps.installedApps.indexOf(url);
		apps.installedApps.splice(indexOfApp, 1);
		Settings.setValue(settingsAppListName, apps.installedApps);

		return true;
	},
	isAppAlreadyInstalled: (url) => {
		apps.getInstalledApps();
		return apps.installedApps.indexOf(url) > -1;
	}
}

let ui = {
	sendAppListToQML: () => {
		sendMessageToQML({ type: "appList", appList: repos.applications });
		return;
	},
	sendRepositoryListToQML: () => {
		let formattedListOfRepositories = repos.repositories.map((entry) => { return { entryText: entry } });

		sendMessageToQML({
			type: "repositoryList", repositoryList: formattedListOfRepositories
		});
		return;
	}
}

let legacy = {
	requestCommunityApps: async () => {
		const repoHeader = {
			title: "Overte Community Apps",
			version: 2,
			baseApiUrl: "https://more.overte.org/applications",
			baseRepositoryUrl: "https://github.com/overte-org/community-apps"
		}

		let response = await util.request(`https://more.overte.org/applications/metadata.js`, "GET");
		response = _trimMetadataVariable(response);
		response = util.toJSON(response);

		for (let i = 0; response.applications.length > i; i++) {
			// For each application returned through the response...
			const app = response.applications[i];

			let formattedApplication = {
				appName: app.name,
				appBaseDirectory: null, 			// Set later
				appScriptVersions: null,			// Set later
				appIcon: app.icon,					// Adjusted / formatted later
				appDescription: app.description,
				appAuthor: "Overte",
				appAgeMaturity: null,				// null will be treaded as "unrated"
				appCategory: null,					// null will be treated as "uncategorized"
			}

			// Format the base directory
			let splitDirectory = app.jsfile.split('/');
			splitDirectory.pop();
			formattedApplication.appBaseDirectory = splitDirectory.join('/');

			// Format the app Icon URL
			if (formattedApplication.appIcon.indexOf(formattedApplication.appBaseDirectory) > -1) {
				let appIconSplit = formattedApplication.appIcon.split('/');
				appIconSplit.shift();
				formattedApplication.appIcon = appIconSplit.join(`/`);
			}

			// Format the appScriptVersions
			let splitJavascriptFile = app.jsfile.split('/');
			splitJavascriptFile.shift();

			formattedApplication.appScriptVersions = {
				stable: splitJavascriptFile.join('/')
			};

			formattedApplication = repos._embedRepositoryConstants(formattedApplication, repoHeader);
			formattedApplication = repos._formatAppUrls(formattedApplication);
			formattedApplication = repos._checkIfInstalled(formattedApplication);

			repos.applications.push(formattedApplication);
		}

		return;

		function _trimMetadataVariable(response) {
			if (response.indexOf("var metadata") == -1) {
				debugLog(`Community Apps repo does not have the var head`);
				return response;
			}

			response = response.substring(15, response.length);
			response = response.slice(0, -1);

			return response;
		}
	}
}

let versioning = {
	// Format the response and upgrade to a understood format as needed.
	// If we have a older version, upgrade the format of the response to prevent errors later 
	repository: (repositoryData) => {
		if (repositoryData.version === 2) {
			// Version 2 is the first version supported by this application due to version 1 not being in a valid JSON format.
			// We have to have a separate request for the legacy overte/community-apps repository.
			return repositoryData;
		}
	}
}

repos.fetchAllAppsFromSavedRepositories();

if (Settings.getValue(settingsIsFirstRun, true) === true) {
	// First run. Install the overte repository.
	// NOTE: The url provided is parsed and handled differently using the legacy.requestCommunityApps() function.
	repos.repositories.push("https://raw.githubusercontent.com/overte-org/community-apps/refs/heads/master/applications/metadata.js");
	repos._saveRepositoriesToSettings();
}