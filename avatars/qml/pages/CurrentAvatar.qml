import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.3
import "."
import "../widgets"

ColumnLayout {
	width: parent.width;
	Layout.fillHeight: true;
	spacing: 0;

	// Avatar display
	RowLayout {
		Layout.margins: 10;
		width: parent.width - 10;
		anchors.horizontalCenter: parent.horizontalCenter;

		Rectangle {
			color: "gray";
			width: 150;
			height: 150;
			Layout.alignment: Qt.AlignVCenter
		}

		// TODO: Selectable text
		Column {
			Layout.fillWidth: true;
			Layout.fillHeight: true;

			Text {
				text: "Avatar Name";
				color: "white";
				font.pixelSize: 20;
			}

			Text {
				text: "avatar_file_name.fst";
				color: "white";
				font.pixelSize: 16;
			}
		}
	}

	// Option selection
	Item {
		width: parent.width - 10;
		anchors.horizontalCenter: parent.horizontalCenter;
		Layout.margins: 10;

		GridLayout {
			columns: 2;
			columnSpacing: 10;
			rowSpacing: 10;
			anchors.fill: parent;

			CustomButton {
				Layout.fillWidth: true;
				buttonText: "Switch Avatar";
				implicitWidth: 0;
			}
			CustomButton {
				Layout.fillWidth: true;
				buttonText: "Switch Outfit";
				implicitWidth: 0;
			}
		}

	}

	
}