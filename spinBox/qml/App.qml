import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.3

import "."
import controlsUit 1.0 as HifiControlsUit
import Hifi 1.0 as Hifi

Rectangle {
    id: root;
	signal sendToScript(var message);
	width: parent.width;
	height: parent.height;
	color: "lightgray";

	Column {
		width: parent.width - 20;
		height: parent.height - 20;
		anchors.centerIn: parent;
		spacing: 6;

		Text {
			text: "Master SpinBox:";
			font.pixelSize: 20;
			color: "Black";
		}
		HifiControlsUit.SpinBox {
			realValue: 5
			realFrom: 0
			realTo: 10
			decimals: 2
			realStepSize: 0.5

			width: 100
			height: 30

			// onFocusChanged: { }

			onRealValueChanged: {
				print(`[Master] - on real value changed: ${value}`);
			}
			Component.onCompleted: {
				print(`[Master] - on Completed: ${value}`);
				print(`[Master] - Minimum Value: ${minimumValue}`);
				print(`[Master] - Real From: ${realFrom}`);
				print(`[Master] - Real To: ${realTo}`);
			}
			onEditingFinished: {
				print(`[Master] - on editing finished: ${value}`);
			}
		}

		Text {
			text: "Work in progress SpinBox:";
			font.pixelSize: 20;
			color: "Black";
		}
		SpinBoxBF {
			realValue: 5
			realFrom: 0
			realTo: 10
			decimals: 2
			realStepSize: 0.5

			width: 100
			height: 30

			// onFocusChanged: { }

			onRealValueChanged: {
				print(`[Work] - on real value changed: ${value}`);
			}
			Component.onCompleted: {
				print(`[Work] - on Completed: ${value}`);
				print(`[Work] - Minimum Value: ${minimumValue}`);
				print(`[Work] - Real From: ${realFrom}`);
				print(`[Work] - Real To: ${realTo}`);
			}
			onEditingFinished: {
				print(`[Work] - on editing finished: ${value}`);
			}
		}
	}

	function fromScript(message) {
		print(JSON.stringify(message));
		switch (message.type){
			case "notificationList":
				notificationList = message.messages;
				break;
		}
	}
}

