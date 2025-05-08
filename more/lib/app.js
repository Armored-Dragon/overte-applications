//
//  app.js
//
//  Created by Armored Dragon on 5 May 2025.
//  Copyright 2025 Overte e.V contributors.
//
//  ---
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

const appSettings = {
	name: "MORE",
	icon: Script.resolvePath("./img/icon_white.png"),
	activeIcon: Script.resolvePath("./img/icon_black.png"),
	url: Script.resolvePath("../qml/More.qml")
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
		activateToolbarButton()
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
}


module.exports = { app }