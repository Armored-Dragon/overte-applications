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
subscribeToMessages();

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

function subscribeToMessages() {
	Messages.subscribe("overte.notification");
	Messages.subscribe("Floof-Notif");
}

Messages.messageReceived.connect(receivedMessage);

const notification = {
	system: (title = "No title", description = "No further information.") => {
		// Add the announcement to our history
		// TODO

		// Tell QML to render the announcement
		sendMessageToQML({ type: "addSystemNotification", title, description });

		// Play a sound
		playSound.system();

	},
	connection: (text = "") => {
		// Add the announcement to our history
		// TODO

		// Tell QML to render the announcement
		// TODO
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
	}
}

function receivedMessage(channel, message) {
	if (channel !== "overte.notification") return;

	message = util.toJSON(message);
	if (!message) return debugLog(`Failed to parse message to JSON.`);

	if (message.type === "system") {
		notification.system(message.title, message.description);
		return;
	}

	if (message.type === "connection") {
		// TODO
		return;
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


function debugLog(content) {
	if (typeof content === "object") content = JSON.stringify(content, null, 4);

	console.log(`[ Debug ] ${content}`);
}
