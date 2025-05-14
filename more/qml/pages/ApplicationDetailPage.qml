import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.11
import "../widgets/"

Rectangle {
	property string appName: "";
	property string appCategory: "";
	property string appCodeMaturity: "";
	property string appAgeMaturity: "";
	property string appDescription: "";
	property string appAuthor: "";
	property string appRepositoryName: "";
	property string appRepositoryUrl: "";
	property var appVersions: {};
	property string appIcon: "";

	width: parent.width;
	height: parent.height;
	color: "transparent";

	Item {
		visible: false;
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
					icon: appIcon;
				}

				Column {
					width: parent.width;
					Text {
						text: appName;
						color: "white";
						font.pixelSize: 20;
					}
					Text {
						text: appCategory;
						color: "gray";
						font.pixelSize: 16;
					}
					Text {
						text: appAgeMaturity;
						color: "gray";
						font.pixelSize: 16;
					}
					Text {
						text: appCodeMaturity;
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
					// onClickedFunc: () => { installApp(appVersions.stable, appRepositoryUrl) }
				}
				CustomButton {
					buttonText: "Remove";
					buttonColor: colors.buttonDanger;
					onClickedFunc: () => { uninstallApp(appVersions.stable, appRepositoryUrl) }
				}
				CustomButton {
					buttonText: "View Repository";
					buttonColor: colors.button;
					// TODO
				}
			}

			Item {
				width: parent.width;
				height: 1;

				Text {
					text: appDescription;
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
		visible: true;
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
						model: Object.keys(appVersions).length;
						delegate: Rectangle {
							property string appVersion: Object.keys(appVersions)[index];
							property string appUrl: appVersions[Object.keys(appVersions)[index]];
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
									installApp(appVersions.stable, appRepositoryUrl)
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
		return Object.keys(appVersions).length;
	}
	function getVersionInformation(index) {
		return {
			name: Object.keys(appVersions)[index],
			url: appVersions[Object.keys(appVersions)[index]]
		}
	}
}
