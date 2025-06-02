//
//  avatars.js
//
//  Created by Armored Dragon on 5 May 2025.
//  Copyright 2025 Overte e.V contributors.
//
//  Avatar application. Gives a user the ability to change avatars, and adjust avatar wearables.
// 	This application also provides ways to explore avatars from third-party repositories
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

// TODO: Avatar loading
// TODO: Avatar saving
// TODO: Avatar JSON Export
// TODO: Avatar wearables list
// TODO: Avatar wearables editing
// TODO: Avatar wearables locking/unlocking

let app = {
	_config: {
		name: "AVATAR",
		icon: Script.resolvePath("./img/icon_white.svg"),
		activeIcon: Script.resolvePath("./img/icon_black.svg"),
		url: Script.resolvePath("./qml/Avatar.qml")
	},
	toolbarAppButton: null,
	tablet: null,
	active: false,
	initialized: false,
	add: () => {
		if (app.initialized === true) {
			debugLog(`Application is already initialized.`);
			return false;
		}


		app.tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");

		app.tablet.fromQml.connect(onMessageFromQML);
		Script.scriptEnding.connect(app.remove);

		app.initialized = true;
	},
	remove: () => {
		app.tablet.fromQml.disconnect(onMessageFromQML);
		app.removeFromToolbar();
	},
	addToToolbar: () => {
		if (app.initialized === false) {
			debugLog(`Application not initialized, not adding to toolbar.`);
			return false;
		}

		app.toolbarAppButton = app.tablet.addButton({
			icon: app._config.icon,
			activeIcon: app._config.activeIcon,
			text: app._config.name,
			isActive: app.active,
		});

		app.toolbarAppButton.clicked.connect(app.toolbarButtonClicked);
	},
	removeFromToolbar: () => {
		if (app.toolbarAppButton) {
			app.tablet.removeButton(app.toolbarAppButton);
		}
	},
	toolbarButtonClicked: () => {
		if (app.active) {
			app.deactivateToolbarButton();
		}
		else {
			app.activateToolbarButton();
		}
	},
	activateToolbarButton: () => {
		if (app.active) return; // Already active, ignore.

		app.tablet.loadQMLSource(app._config.url);
		app.active = true;
		app.toolbarAppButton.editProperties({ isActive: true });
		app.tablet.screenChanged.connect(app.onTabletScreenChanged);

	},
	deactivateToolbarButton: () => {
		if (app.active === false) return; // Already inactive, ignore.

		app.active = false;
		app.tablet.gotoHomeScreen();
		app.toolbarAppButton.editProperties({ isActive: false });
		app.tablet.screenChanged.disconnect(app.onTabletScreenChanged);
	},
	onTabletScreenChanged: (type, newUrl) => {
		if (app._config.url === newUrl) {
			app.activateToolbarButton();
		}
		else {
			app.deactivateToolbarButton();
		}
	}
}

function debugLog(content) {
	if (typeof content === "object") content = JSON.stringify(content, null, 4);

	console.log(`[ Debug ] ${content}`);
}

function onMessageFromQML(event) {
	switch (event.type) {
		case "addNewRepositoryButtonClicked":
			break;
	}
}

app.add();
app.addToToolbar();