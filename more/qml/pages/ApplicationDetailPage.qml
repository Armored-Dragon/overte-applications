import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.11
import "../widgets/"

Rectangle {
	width: parent.width;
	height: parent.height;
	color: "transparent";

	Item {
		visible: true;
		width: parent.width - 10;
		height: parent.height - 10;
		anchors.centerIn: parent;
		id: appDetailsElement;

		Column {
			width: parent.width;
			height: parent.height;
			spacing: 10;

			CustomButton {
				width: parent.width;

				buttonText: "Back";

				onClickedFunc: () => { showAppListPage() }
			}

			Row {
				width: parent.width;
				height: 100;

				AppImage {
					imageSize: 100;
					icon: appList[focusedAppIndex] && appList[focusedAppIndex].appIcon || "";
				}

				Item {
					width: 10;
					height: 1;
				}

				Column {
					width: parent.width;

					Text {
						text: appList[focusedAppIndex] && appList[focusedAppIndex].appName || "";
						color: "white";
						font.pixelSize: 20;
					}
					Text {
						text: appList[focusedAppIndex] && appList[focusedAppIndex].appCategory || "";
						color: "gray";
						font.pixelSize: 16;
					}
					Text {
						text: appList[focusedAppIndex] && appList[focusedAppIndex].appAgeMaturity || "";
						color: "gray";
						font.pixelSize: 16;
					}
				}
			}

			Row {
				spacing: 10;
				CustomButton {
					buttonText: "Install";
					buttonColor: colors.buttonSafe;
					onClickedFunc: () => { appVersionsElement.visible = true; appDetailsElement.visible = false; }
				}
				CustomButton {
					buttonText: "Remove";
					buttonColor: colors.buttonDanger;
					onClickedFunc: () => { uninstallApp(appList[focusedAppIndex].installedUrl) }
				}
				CustomButton {
					buttonText: "View Repository";
					buttonColor: colors.button;
					onClickedFunc: () => { openAppRepository(appList[focusedAppIndex].appHomeUrl || appList[focusedAppIndex].repository.baseRepositoryUrl) }
				}
			}

			Item {
				width: parent.width;
				height: 1;

				Text {
					text: appList[focusedAppIndex] && appList[focusedAppIndex].appDescription || "";
					color: "gray";
					font.pixelSize: 16;
					wrapMode: Text.Wrap;
					width: parent.width;
				}
			}
		}
	}

	// App version selection
	Item {
		visible: false;
		width: parent.width - 10;
		height: parent.height - 10;
		anchors.centerIn: parent;
		id: appVersionsElement;

		ColumnLayout {
			width: parent.width;
			height: parent.height;

			CustomButton {
				width: parent.width;
				buttonText: "Go Back";
				buttonColor: colors.button;
				onClickedFunc: () => { appVersionsElement.visible = false; appDetailsElement.visible = true; }
			}
			
			Item {
				width: parent.width;
				Layout.fillHeight: true;

				Column {
					width: parent.width;
					height: parent.height;

					Repeater {
						model: Object.keys(appList[focusedAppIndex] && appList[focusedAppIndex].appScriptVersions || []).length;
						delegate: Rectangle {
							property string appVersion: Object.keys(appList[focusedAppIndex].appScriptVersions)[index];
							property string appUrl: appList[focusedAppIndex].appScriptVersions[Object.keys(appList[focusedAppIndex].appScriptVersions)[index]];
							width: parent.width;
							height: 50;
							color: colors.darkBackground2;

							RowLayout {
								width: parent.width;
								height: 50;

								Text {
									text: appVersion;
									color: "white";
								}

								Text {
									text: appUrl;
									color: "orange";
									font.pixelSize: 20;
								}
							}

							MouseArea {
								anchors.fill: parent;
								hoverEnabled: true;
								propagateComposedEvents: true;	

								onPressed: {
									installApp(appList[focusedAppIndex], appVersion)
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
				}
			}
		}
	}


	function getVersionsCount() {
		// print(Object.keys(appVersions))
		return Object.keys(appList[focusedAppIndex].appVersions).length;
	}
	function getVersionInformation(index) {
		return {
			name: Object.keys(appVersions)[index],
			url: appVersions[Object.keys(appVersions)[index]]
		}
	}
}
