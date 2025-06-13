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

Script.include('./lib/utility.js');
Script.include('./lib/io.js');
Script.include('./lib/sound.js');

let app = {
	_config: {
		enabled: true,				// Global enable / disable
		maximumSavedSystemNotifications: 20,
		maximumSavedConnectionNotifications: 20,
	},
	_ui: {
		overlay: null,
		notificationPopout: null
	},
	_data: {
		systemNotifications: [],
		connectionNotifications: [],
	}
}
addNotificationUIToInterface();
subscribeToMessages();
io.getNotifications();

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
		// Tell QML to render the announcement
		sendMessageToQML({ type: "addSystemNotification", title, description });

		// Play a sound
		playSound.system();

	},
	connection: (text = "") => {
		// Tell QML to render the announcement
		// TODO

		// Play a sound
		// TODO: 
	}
}

function receivedMessage(channel, message) {
	// TODO: Generate and save UUID as ID for notification.
	if (channel !== "overte.notification") return;

	message = util.toJSON(message);
	if (!message) return debugLog(`Failed to parse message to JSON.`);

	io.saveNotification(message);

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
		case "openNotificationFromOverlay":
			debugLog(app._ui.notificationPopout)
			if (app._ui.notificationPopout === null) {
				app._ui.notificationPopout = new OverlayWindow({ source: Script.resolvePath("./qml/PopoutWindow.qml"), title: "Notifications", width: 400, height: 600 });
				app._ui.notificationPopout.sendToQml({ type: "notificationList", messages: [...app._data.connectionNotifications, ...app._data.systemNotifications] });
				app._ui.notificationPopout.closed.connect(() => { app._ui.notificationPopout = null })
			}
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
