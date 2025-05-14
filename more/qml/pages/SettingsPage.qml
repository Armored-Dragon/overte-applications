import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.11
import "../widgets/"
import "../widgets/CustomListView"

Item {
	width: parent.width;
	height: parent.height;
	property var entryList: [""];

	ColumnLayout {
		width: parent.width - 10;
		height: parent.height - 10;
		anchors.centerIn: parent;

		CustomButton {
			height: 40;
			Layout.fillWidth: true;

			buttonText: "Back";

			onClickedFunc: () => { showAppListPage() }
		}

		CustomListView {
			Layout.fillHeight: true;
			onAddEntryButtonClickedFunc: () => {toScript({type: "addNewRepositoryButtonClicked"})}; 
			entries: entryList;
		}
	}
}