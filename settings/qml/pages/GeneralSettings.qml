import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.3
import "../"

Flickable {
    property var verticalScrollBarWidth: 20;
    property bool hasPresetBeenModified: false;
    property bool isChangingPreset: false;

    id: generalPage;
    visible: currentPage == "General New";
    width: parent.width;
    Layout.fillHeight: true;
    y: header.height + 10;
    contentWidth: parent.width;
    contentHeight: columnRoot.height;
    clip: true;
    flickDeceleration: 4000;

    Timer {
        id: verticalScrollBarInitialVisibilityTimer;
        interval: 200;
        running: false;
        repeat: false;

        onTriggered: {
            verticalScrollBarWidth = 15;
        }
    }

    onVisibleChanged: {
        // Set the initial values for the variables.
        verticalScrollBarWidth = 20;

        // We are leaving the page, don't animate. 
        if (!visible) return;

        // We have opened the page
        // Start the visibility effect timers.
        verticalScrollBarInitialVisibilityTimer.running = true;
    }

    ScrollBar.vertical: ScrollBar {
        id: scrollBar;
        policy: Qt.ScrollBarAlwaysOn;

        background: Rectangle {
            implicitWidth: verticalScrollBarWidth;
            color: "transparent";
            radius: 5;
            visible: scrollBar.visible;

            Behavior on implicitWidth {
                NumberAnimation {
                    duration: 300;
                    easing.type: Easing.InOutCubic;
                }
            }
        }
    }

    Column {
        id: columnRoot;
        width: parent.width - 20;
        anchors.horizontalCenterOffset: -5
        anchors.horizontalCenter: parent.horizontalCenter;
        spacing: 10;


        // Application theme
        SettingComboBox {
            settingText: "Theme";
            optionIndex: 0;
            options: ["Light", "Dark"];

            onValueChanged: { }
        }

        // Toolbar constraints
        SettingBoolean {
            settingText: "Lock toolbar horizontally";
            settingEnabledCondition: function () {  }

            onSettingEnabledChanged: {
            }
        }

        // No HMD, auto away
        SettingBoolean {
            settingText: "Away when headset is removed";
            settingEnabledCondition: function () {  }

            onSettingEnabledChanged: {
            }
        }

        // No HMD, auto away
        SettingBoolean {
            settingText: "Away when headset is removed";
            settingEnabledCondition: function () {  }

            onSettingEnabledChanged: {
            }
        }

		// TODO: Get default values from current settings page
		// Desktop tablet scale
		SettingNumber {
			settingText: "Desktop Tablet scale";
			minValue: 20;
			maxValue: 200;
			suffixText: "%";
			settingValue: 5;

			onValueChanged: {
			}
		}

        // Use mouse cursor in VR
        SettingBoolean {
            settingText: "VR Mouse cursor";
            settingEnabledCondition: function () {  }

            onSettingEnabledChanged: {
            }
        }

        // Use reticle instead of arrow
        SettingBoolean {
            settingText: "Use reticle instead of arrow";
            settingEnabledCondition: function () {  }

            onSettingEnabledChanged: {
            }
        }

        // Use minitablet
        SettingBoolean {
            settingText: "Use minitablet";
            settingEnabledCondition: function () {  }

            onSettingEnabledChanged: {
            }
        }

        // Use virtual Keyboard
        SettingBoolean {
            settingText: "Use virtual keyboard";
            settingEnabledCondition: function () {  }

            onSettingEnabledChanged: {
            }
        }

        // Virtual keyboard input method
        SettingComboBox {
            settingText: "Keyboard input";
            optionIndex: 0;
            options: ["Lasers", "Mallets", "Avatar fingers"];

            onValueChanged: { }
        }

		// Laser smoothing
		SettingNumber {
			settingText: "Laser smoothing";
			minValue: 20;
			maxValue: 200;
			suffixText: "";
			settingValue: 5;

			onValueChanged: {
			}
		}

		// FIXME: Do we need the option to show the settings on the toolbar? Maybe just don't have it there to begin with?

		// TODO: Advanced settings, allow individual mouse adjustments
		// Mouse sensitivity
		SettingNumber {
			settingText: "Mouse sensitivity";
			minValue: 20;
			maxValue: 200;
			suffixText: "";
			settingValue: 5;

			onValueChanged: {
			}
		}

		// TODO: Settings text input / Filepicker?

		// Snapshot save format
        SettingComboBox {
            settingText: "Snapshot format";
            optionIndex: 0;
            options: ["PNG", "JPG", "WebP"];

            onValueChanged: { }
        }

		// Animated snapshot save format
        SettingComboBox {
            settingText: "Animated snapshot";
            optionIndex: 0;
            options: ["GIF"];

            onValueChanged: { }
        }

		// Mouse sensitivity
		SettingNumber {
			settingText: "Animated duration";
			minValue: 1;
			maxValue: 10;
			suffixText: "";
			settingValue: 5;

			onValueChanged: {
			}
		}


        // Send usage data
        SettingBoolean {
            settingText: "Send usage data to Overte";
            settingEnabledCondition: function () {  }

            onSettingEnabledChanged: {
            }
        }


        // Use virtual Keyboard
        SettingBoolean {
            settingText: "Send crash reports to Overte";
            settingEnabledCondition: function () {  }

            onSettingEnabledChanged: {
            }
        }
    }

    function recursivelyUpdateAllSettings(item){
        // In order to update all settings based on current values, 
        // we need to go through all children elements and re-evaluate their settingEnabled value

        // Update all settings options visually to reflect settings
        for (let i = 0; item.children.length > i; i++) {
            var child = item.children[i];

            child.update();

            // Run this function on all of this elements children.
            recursivelyUpdateAllSettings(child);
        }
    }
}