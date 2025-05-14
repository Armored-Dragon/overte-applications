//
//  more.js
//
//  Created by Armored Dragon on 5 May 2025.
//  Copyright 2025 Overte e.V contributors.
//
//  ---
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
		deactivateToolbarButton();
	}
}

function deactivateToolbarButton() {
	if (app.active === false) return; // Already inactive, ignore.

	app.active = false;
	app.tablet.gotoHomeScreen();
	app.toolbarAppButton.editProperties({ isActive: false });
	app.tablet.screenChanged.disconnect(onTabletScreenChanged);
}

function activateToolbarButton() {
	if (app.active) return; // Already active, ignore.

	app.tablet.loadQMLSource(appSettings.url);
	app.active = true;
	app.toolbarAppButton.editProperties({ isActive: true });
	app.tablet.screenChanged.connect(onTabletScreenChanged);

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

Script.scriptEnding.connect(appShuttingDown);

app.add();

function appShuttingDown() {
	console.log("Shutting down more.js application");
	app.remove();
}

function onMessageFromQML(event) {
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
		repos.loadRepositoriesFromStorage();
		repos.applications = [];

		for (let i = 0; repos.repositories.length > i; i++) {
			const targetRepository = repos.repositories[i];
			const rawRepositoryContent = await repos.fetchRepositoryContent(targetRepository);
			rawRepositoryContent.application_list.forEach((entry) => { debugLog(entry); repos.applications.push(entry) });
		}

		ui.sendAppListToQML(repos.applications);
		ui.sendRepositoryListToQML(repos.applications);
		debugLog(repos.applications)
		debugLog(`Finished fetching all saved repositories.`);
	},
	fetchRepositoryContent: async (url) => {
		let repositoryContent = await util.request(url);
		repositoryContent = util.toJSON(repositoryContent);

		// TODO: Versioning

		const formattedArrayOfApplicationsFromRepository = repositoryContent.application_list.map((applicationEntry, index) => {
			if (util.isValidUrl(applicationEntry.appIcon) === false) {
				debugLog(`${applicationEntry.appName} icon is relative.`);
				applicationEntry.appIcon = `${repositoryContent.base_url}/${applicationEntry.appBaseDirectory}/${applicationEntry.appIcon}`;
			}
			return {
				...applicationEntry,
				appRepositoryName: repositoryContent.title,
				appRepositoryUrl: repositoryContent.base_url,
			}
		});

		repositoryContent.application_list = formattedArrayOfApplicationsFromRepository;

		debugLog(repositoryContent);

		return repositoryContent;
	},
	installRepository: async (url) => {
		debugLog(`Installing repository: ${url}`);

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

		Settings.setValue(settingsRepositoryListName, repos.repositories);

		repositoryContent.applications.forEach((entry) => repos.applications.push(entry));

		debugLog(repos.applications);
		ui.sendAppListToQML(repos.applications);
	},
	removeRepository: (url) => {
		// Check if we have the repository in settings
		// Remove from settings
		// Remove apps from repo from displayed apps

	},
	isRepositoryValid: (repositoryObject) => {
		if (!repositoryObject.VERSION || repositoryObject.VERSION > repos.maxVersion) return false;
		if (!repositoryObject.title) return false;
		if (!repositoryObject.base_url) return false;
		if (!repositoryObject.application_list) return false;

		return true;
	},
	doWeHaveThisRepositorySaved: (url) => {
		return repos.repositories.indexOf(url) > -1;
	},
	loadRepositoriesFromStorage: () => {
		repos.repositories = Settings.getValue(settingsRepositoryListName, []);
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
			// console.log(`Error parsing ${input} to JSON.`)
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
		apps.installedApps = Settings.getValue(settingsAppListName, []);
		return apps.installedApps;
	},
	install: (url, baseUrl) => {
		debugLog(`Installing "${url}".`);

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
		return apps.installedApps.indexOf(url) > -1;
	}
}

let ui = {
	sendAppListToQML: (appList) => {
		sendMessageToQML({ type: "appList", appList: appList });
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

let versioning = {
	app: (appData, repositoryVersion) => {
		if (!repositoryVersion) {
			// Assume version 1.


		}
	}
}

repos.fetchAllAppsFromSavedRepositories();