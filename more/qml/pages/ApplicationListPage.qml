import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.3
import "../widgets"

ColumnLayout {
	width: parent.width;
	height: parent.height;
	id: applicationListPage;

	// Header
	RowLayout {
		width: parent.width - 10;
		x: 5;
		Layout.alignment: Qt.AlignVCenter;
		height: 60;

		Rectangle {
			color: "white";
			Layout.fillWidth: true;
			height: parent.height - 20;
			radius: 10;

			TextField {
				placeholderText: "Search...";
				color: "black";
				anchors.fill: parent;

				background: Rectangle { // Custom background for the TextField
					color: "transparent" // Make it transparent
				}
			}
		}

		CustomButton {
			height: parent.height - 20;
			width: 60;
			buttonText: " O ";

			onClickedFunc: () => { showSettingsPage() }
		}
	}

	// Scroll area
	Flickable {
		width: parent.width - 10;
		Layout.fillHeight: true;
		x: 5;
		contentHeight: appListColumn.height;
		clip: true;
		
		Column {
			id: appListColumn
			width: parent.width - 10;
			x: 5;

			Repeater {
				model: appList.length;
				delegate: ApplicationListEntry { }
			}
		}
	}
}
