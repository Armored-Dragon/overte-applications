//
//  spinbox_debug.js
//
//  Created by Armored Dragon on 5 May 2025.
//  Copyright 2025 Overte e.V contributors.
//
//  Made to help debug the spinbox control widget.
// 	See https://github.com/overte-org/overte/issues/921 for more information
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

const APP_SETTINGS = {
	name: "SPN_DB",
	icon: Script.resolvePath("./img/icon_white.png"),
	activeIcon: Script.resolvePath("./img/icon_black.png"),
	url: Script.resolvePath("./qml/App.qml")
}

Script.scriptEnding.connect(appStop);

let app = {
	toolbarAppButton: null,
	tablet: null,
	active: false,
	add: () => {
		app.tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");

		app.addAppToToolbar();

		app.tablet.fromQml.connect(onMessageFromQML);
	},
	remove: () => {
		app.tablet.fromQml.disconnect(onMessageFromQML);
		app.removeAppFromToolbar();
	},
	addAppToToolbar: () => {
		// Check if app is on toolbar

		app.toolbarAppButton = app.tablet.addButton({
			icon: APP_SETTINGS.icon,
			activeIcon: APP_SETTINGS.activeIcon,
			text: APP_SETTINGS.name,
			isActive: app.active,
		});

		app.toolbarAppButton.clicked.connect(onToolbarButtonClicked);
	},
	removeAppFromToolbar: () => {
		if (app.toolbarAppButton) {
			app.tablet.removeButton(app.toolbarAppButton);
		}
	},
	deactivateToolbarButton: (goToHomeScreen = true) => {
		if (app.active === false) return; // Already inactive, ignore.

		app.tablet.screenChanged.disconnect(onTabletScreenChanged);
		app.active = false;
		if (goToHomeScreen) app.tablet.gotoHomeScreen();
		app.toolbarAppButton.editProperties({ isActive: false });
	},

	activateToolbarButton: () => {
		if (app.active) return; // Already active, ignore.

		app.tablet.loadQMLSource(APP_SETTINGS.url);
		app.active = true;
		app.toolbarAppButton.editProperties({ isActive: true });
		app.tablet.screenChanged.connect(onTabletScreenChanged);
	}
}

app.add();

function appStop() {
	app.remove();
}
function onToolbarButtonClicked() {
	if (app.active) {
		app.deactivateToolbarButton();
	}
	else {
		app.activateToolbarButton();
	}
}
function openOverlay() {

}
function onTabletScreenChanged(type, newURL) {
	if (APP_SETTINGS.url === newURL) {
		app.activateToolbarButton();
	}
	else {
		app.deactivateToolbarButton(false);
	}
}
function onMessageFromQML(event) {
	debugLog(event);
	switch (event.type) {
		case "":
			break;
	}
}