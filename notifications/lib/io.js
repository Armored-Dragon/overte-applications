const io = {
	saveNotification: (messageJSON) => {
		if (messageJSON.type === "system") {
			app._data.systemNotifications.push(messageJSON);
			app._data.systemNotifications = clampArrayLengthToMaximumLength(app._data.systemNotifications, app._config.maximumSavedSystemNotifications)
			return;
		}

		if (messageJSON.type === "connection") {
			app._data.connectionNotifications.push(messageJSON);
			app._data.connectionNotifications = clampArrayLengthToMaximumLength(app._data.connectionNotifications, app._config.maximumSavedConnectionNotifications)
			return;
		}

		debugLog(`Unknown message type '${messageJSON.type}'. Not saving notification.`)
	}
}

function clampArrayLengthToMaximumLength(arr, length) {
	const arrayOverflowAmount = arr.length - length;

	if (arrayOverflowAmount > 0) {
		arr.splice(0, arrayOverflowAmount);
	}

	return arr;
}