import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.11

Rectangle {
	property bool isActive: false;
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

	readonly property var maturityColors: {
		"STABLE": "gray",
		"BETA": "lightblue",
		"ALPHA": "yellow"
	}  


	width: parent.width;
	height: 75;

	color: colors.darkBackground2;

	RowLayout {
		anchors.fill: parent;

		// Application icon
		AppImage {
			Layout.leftMargin: 10;
			icon: appIcon;
		}

		// Application information
		ColumnLayout {
			Layout.fillWidth: true;
			height: parent.height - 50;
			Layout.leftMargin: 10;

			Text {
				text: appName;
				color: "white";
				font.pixelSize: 20;
			}

			Text {
				text: "By: " + appAuthor;
				color: "gray";
				font.pixelSize: 18;
			}

			// Pad
			Item {
				Layout.fillHeight: true;
			}
		}

		// Pad
		Item {
			Layout.fillHeight: true;
			Layout.fillWidth: true;
		}

		ColumnLayout {
			Layout.fillWidth: true;
			Layout.fillHeight: true;
			Layout.leftMargin: 10;
			height: parent.height - 50;

			Text {
				text: appCodeMaturity;
				font.pixelSize: 16;
				color: maturityColors[appCodeMaturity];
			}

			// Pad
			Item {
				Layout.fillHeight: true;
			}
		}

		Item {
			Layout.fillHeight: true;
			width: 10;
		}
	}

	MouseArea {
		anchors.fill: parent;
		hoverEnabled: true;
		propagateComposedEvents: true;	

		onPressed: {
			showAppDetailPage(
				appName,
				appCategory,
				appCodeMaturity,
				appAgeMaturity,
				appDescription,
				appAuthor,
				appRepositoryName,
				appRepositoryUrl,
				appIcon,
				appUrl
			)
		}

		onEntered: {
			parent.color = colors.darkBackground3;

		}

		onExited: {
			parent.color = colors.darkBackground2;
		}
	}

	Behavior on color {
		ColorAnimation {
			duration: 50
			easing.type: Easing.InOutCubic
		}
	}
}