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
	property string appUrl: "";
	property string appIcon: "";

	width: parent.width;
	height: parent.height;
	color: "transparent";

	Item {
		width: parent.width - 10;
		height: parent.height - 10;
		anchors.centerIn: parent;

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
				}
				CustomButton {
					buttonText: "Remove";
					buttonColor: colors.buttonDanger;
				}
				CustomButton {
					buttonText: "View Repository";
					buttonColor: colors.button;
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

}
