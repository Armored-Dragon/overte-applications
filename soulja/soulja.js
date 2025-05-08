function _emitSound() {
	let newPollSound = SoundCache.getSound(`https://armored-dragon.github.io/overte-thirdparty-test-repo/solja/you.mp3`);
	var injectorOptions = {
		position: MyAvatar.position,
		volume: 0.25
	};
	Audio.playSound(newPollSound, injectorOptions);
}

Controller.keyPressEvent.connect(function (event) {
	if (event.text == "x" && !event.isAutoRepeat) {
		_emitSound()
	}
});