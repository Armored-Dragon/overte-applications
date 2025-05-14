import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.3
import "."
import "./widgets"
import "./widgets/CustomListView"
import "./pages"

Rectangle {
	signal sendToScript(var message);
	property var appList: [];
	property var repositoryList: [];

	Colors {
		id: colors;
	}

	width: parent.width;
	height: parent.height;
	color: colors.darkBackground1;

	// App list page
	Column {
		id: applicationListPage;
		width: parent.width;

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

		// Application list
		Column {
			width: parent.width - 10;
			x: 5;

			Repeater {
				model: appList.length;
				delegate: ApplicationListEntry {
				appName: appList[index].appName;
				appIcon: appList[index].appIcon;
				appAuthor: appList[index].appAuthor;
				appCodeMaturity: appList[index].appCodeMaturity;
				appCategory: appList[index].appCategory;
				appAgeMaturity: appList[index].appAgeMaturity;
				appDescription: appList[index].appDescription;
				appRepositoryName: appList[index].appRepositoryName;
				appRepositoryUrl: appList[index].appRepositoryUrl;
				appVersions: appList[index].appScriptVersions;
				}
			}
		}
	}

	// App detail page
	ApplicationDetailPage {
		id: applicationDetailPage;
		visible: false;
	}

	// App settings page
	SettingsPage {
		id: settingsPage;
		visible: false;
		entryList: repositoryList;
	}

	function showAppDetailPage(
				appName,
				appCategory,
				appCodeMaturity,
				appAgeMaturity,
				appDescription,
				appAuthor,
				appRepositoryName,
				appRepositoryUrl,
				appIcon,
				appVersions) 
	{
		applicationDetailPage.appName = appName;
		applicationDetailPage.appCategory = appCategory;
		applicationDetailPage.appCodeMaturity = appCodeMaturity;
		applicationDetailPage.appAgeMaturity = appAgeMaturity;
		applicationDetailPage.appDescription = appDescription;
		applicationDetailPage.appAuthor = appAuthor;
		applicationDetailPage.appRepositoryName = appRepositoryName;
		applicationDetailPage.appRepositoryUrl = appRepositoryUrl;
		applicationDetailPage.appIcon = appIcon;
		applicationDetailPage.appVersions = appVersions,

		hideAllPages();
		applicationDetailPage.visible = true;
	}

	function showAppListPage() {
		hideAllPages();
		applicationListPage.visible = true;
	}

	function showSettingsPage() {
		hideAllPages();
		settingsPage.visible = true;
	}

	function hideAllPages() {
		applicationListPage.visible = false;
		applicationDetailPage.visible = false;
		settingsPage.visible = false;
	}

	function installApp(appUrl, baseUrl) {
		toScript({type: "installApp", appUrl, baseUrl});
	}

	function uninstallApp(appUrl, baseUrl) {
		toScript({type: "uninstallApp", appUrl, baseUrl});
	}

	// Messages from script
	function fromScript(message) {
		switch (message.type) {
			case "appList": 
				appList = message.appList;
				break;
			case "repositoryList":
				repositoryList = message.repositoryList;
				break;
		}
	}

	// Send message to script
	function toScript(packet){
		sendToScript(packet)
	}
}

