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

	Rectangle {
		color: colors.darkBackground2;
		anchors.fill: parent;

		Column {
			width: parent.width;
			height: 120;

			// Entry list
			Column {
				width: parent.width;
				height: parent.height - 25;

				Repeater {
					model: entries.length;
					delegate: CustomListElement {
						entryText: entries[index].entryText;
						canAddEntries: canAddEntries;
						canDeleteEntries: canDeleteEntries;
					}
				}
			}

			// Add a entry to the list
			CustomButton {
				height: 25;
				width: parent.width;
				buttonText: "Add Entry";

				onClickedFunc: onAddEntryButtonClickedFunc;
			}
		}
	}
}