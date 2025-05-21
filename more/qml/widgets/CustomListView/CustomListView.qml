import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.3
import "../."

Item {
	width: parent.width;

	property var entries: [];

	property bool canAddEntries: true;
	property bool canDeleteEntries: true;

	property var onAddEntryButtonClickedFunc;

	Column {
		width: parent.width;
		height: parent.height;

		Flickable {
			contentHeight: Math.min(entryListElement.height, 200);
			height: 200;
			width: parent.width;
			clip: true;

			Column {
				width: parent.width - 10;
				id: entryListElement;

				Repeater {
					model: entries.length;
					delegate: CustomListElement {
						entryText: entries[index].entryText;
						canAddEntries: canAddEntries;
						canDeleteEntries: canDeleteEntries;
					}
				}
			}

			ScrollBar.vertical: ScrollBar {
				policy: Qt.ScrollBarAlwaysOn;

				background: Rectangle {
					color: "transparent";
					radius: 5;
					visible: scrollBar.visible;
				}
			}
		}

		CustomButton {
			height: 25;
			width: parent.width;
			buttonText: "Add Entry";

			onClickedFunc: onAddEntryButtonClickedFunc;
		}
	}
}