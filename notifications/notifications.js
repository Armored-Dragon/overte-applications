//
//  more.js
//
//  Created by Armored Dragon on 3 June 2025.
//  Copyright 2025 Overte e.V contributors.
//
//  This interface script provides a basic interface for displaying notifications 
// 	and in a neat manner to present them to the user.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

// TODO: Keep history of notifications
// TODO: Focus on notifications (Click / hover?)
// TODO: Bind notifications with system settings?
// TODO: Timestamp notifications

let app = {
	_config: {
		enabled: true,				// Global enable / disable
		maximumNotifications: 20
	},
	_ui: {
		overlay: null
	}
}
addNotificationUIToInterface();
function addNotificationUIToInterface() {
	// Generates the QML element(s) required to present the notifications to the screen
	app._ui.overlay = new OverlayWindow({
		source: Script.resolvePath("./qml/Notifications.qml"),
	});

	app._ui.overlay.fromQml.connect(onMessageFromQML);
}

function removeNotificationUIFromInterface() {
	// Removes all QML elements from the screen

	// Smoothly force remove all active notifications (trigger fade out immediately)

	// After X seconds, force remove all interface elements
}

const notification = {
	system: (title = "No title", description = "No further information.") => {
		// Add the announcement to our history

		// Tell QML to render the announcement

	},
	connection: (text = "") => {
		// Add the announcement to our history

		// Tell QML to render the announcement
	}
}

const playSound = {
	system: () => {
		playSound._playSound(Script.resolvePath("./sound/systemNotification.mp3"));
	},
	connection: () => {
		playSound._playSound(Script.resolvePath("./sound/connectionNotification.mp3"));
	},
	_playSound: (url) => {
		const sound = SoundCache.getSound(url);
		Audio.playSystemSound(sound, { volume: 0.5 });
	}
}

function onMessageFromQML(event) {
	debugLog(event);
	switch (event.type) {
		case "addNewRepositoryButtonClicked":
			break;
	}
}

function sendMessageToQML(message) {
	app._ui.overlay.sendToQml(message);
}

sendMessageToQML({ type: "addSystemNotification", title: "This is a test" })


function debugLog(content) {
	if (typeof content === "object") content = JSON.stringify(content, null, 4);

	console.log(`[ Debug ] ${content}`);
}
