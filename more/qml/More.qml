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
				appUrl: appList[index].appUrl;
				}
			}

			// ApplicationListEntry {
			// 	appName: "Test App";
			// 	appIcon: "https://adragon.dev/img/logos/armoreddragonpfp.png";
			// 	appAuthor: "Armored Dragon";
			// 	appCodeMaturity: "STABLE";
			// 	appCategory: "Building";
			// 	appAgeMaturity: "EVERYONE";
			// 	appDescription: "This is my amazing and awesome description for this awesome and amazing application.";
			// 	appRepositoryName: "Overte-Applications";
			// 	appRepositoryUrl: "https://github.com/Armored-Dragon/overte-applications";
			// }

			// ApplicationListEntry {
			// 	appName: "Test App";
			// 	appIcon: "https://adragon.dev/img/logos/armoreddragonpfp.png";
			// 	appAuthor: "Armored Dragon";
			// 	appCodeMaturity: "BETA";
			// 	appCategory: "Software";
			// 	appAgeMaturity: "TEEN";
			// 	appDescription: "This is my amazing and awesome description for this awesome and amazing application.";
			// 	appRepositoryName: "Overte-Applications";
			// 	appRepositoryUrl: "https://github.com/Armored-Dragon/overte-applications";
			// }

			// ApplicationListEntry {
			// 	appName: "Test App";
			// 	appIcon: "https://adragon.dev/img/logos/armoreddragonpfp.png";
			// 	appAuthor: "Armored Dragon";
			// 	appCodeMaturity: "ALPHA";
			// 	appCategory: "Sexy Kinky Time";
			// 	appAgeMaturity: "ADULT";
			// 	appDescription: "This is my amazing and awesome description for this awesome and amazing application.";
			// 	appRepositoryName: "Overte-Applications";
			// 	appRepositoryUrl: "https://github.com/Armored-Dragon/overte-applications";
			// }
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
				appUrl) 
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
		applicationDetailPage.appUrl = appUrl,

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

	function installApp(appUrl) {
		toScript({type: "installApp", appUrl: appUrl});
	}

	function uninstallApp(appUrl) {
		toScript({type: "uninstallApp", appUrl: appUrl});
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

