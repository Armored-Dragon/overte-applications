import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.3
import "."
import "./widgets"
import "./pages"

ColumnLayout {
	width: parent.width;
	height: parent.height;
	spacing: 10;

	signal sendToScript(var message);

	Colors {
		id: colors;
	}

	Rectangle {
		color: colors.darkBackground2;
		width: parent.width;
		height: parent.height;

		// Header
		// Header {}

		// Avatar info
		CurrentAvatar {
			// visible: false;
		}

		// Avatar list
		AvatarList {
			visible: false;
		}
	}

}