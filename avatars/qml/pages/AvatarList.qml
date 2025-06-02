import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.3
import "."

ColumnLayout {
	width: parent.width;
	Layout.fillHeight: true;
	Layout.margins: 10;
	spacing: 0;

	// Avatar entry
	Rectangle {
		Layout.fillWidth: true;
		color: colors.darkBackground2;
		height: 70;

		MouseArea {
			anchors.fill: parent;
			hoverEnabled: true;
			propagateComposedEvents: true;	

			RowLayout {
				width: parent.width - 10;
				height: parent.height;
				spacing: 10;
				anchors.centerIn: parent;

				// Profile picture
				Rectangle {
					width: 60;
					height: 60;
					color: "gray";
				}

				// Avatar name
				Text {
					text: "Avatar Entry";
					Layout.fillWidth: true;
					color: "white";
					font.pixelSize: 20;
				}
			}

			onPressed: {

			}

			onEntered: {
				parent.color = colors.darkBackground3;
			}

			onExited: {
				parent.color = colors.darkBackground2;
			}
		}
	}
}