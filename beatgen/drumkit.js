// This represents the drum pad for playing the drum beat
// Everything is represented as arrays of binary values (1 or 0).
// For example, the snare array is length 16, one for each eigth note in a two measure block.
// Example: kick = [1, 0, 0, 0, 0, 0, 0, 0
//					0, 0, 0, 0, 0, 0, 0, 0]
// High hat is double the resolution (length 32).

console.log("loaded kit");

var snareRes = 16;
var kickRes = 16;
var hatRes = 32;

var context = new AudioContext();

var change = false;
var mutate = true;

var currentBeatPart;

var hatObject = new sample('http://localhost:8000/hi hat (1).wav');
var kickObject = new sample('http://localhost:8000/kick (2).wav');
var snareObject = new sample('http://localhost:8000/snare (1).wav');

function initKit() {
	console.log("generating hat");
	mainPart = new BeatPart();
	currentBeatPart = mainPart;
}

function BeatPart() {
	this._kick = genKick();
	this._snare = genSnare();
	this._hat = genHat();
}

function genHat() {
	var hat = [];
	hatTime = 1;

	if (Math.random() < 0.3) hatTime = 2;
	else if (Math.random() < 0.3) hatTime = 4;

	var londonMode = true;
	if (londonMode) hatTime = 4;

	muteHat = Math.random() < 0.1;

	for (var i = 0; i < hatRes; i++) {
		hat[i] = 0;
	}

	for (var i = 0; i < hatRes; i++) {
		if ((i % (hatTime * 2) == 0 || (Math.random() < 0.1 / hatTime))) hat[i] = 1;
	}
	return hat;
}

function genSnare() {
	var snare = [];

	muteSnare = Math.random() < 0.1;
	muteSnare = true;

	snare = [0, 0, 0, 0, 1, 0, 0, 0,
		0, 0, 0, 0, 1, 0, 0, 0];
	if (Math.random() < 0.1) {
		snare[7] = 1;
	}
	else if (Math.random() < 0.1) {
		snare[9] = 1;
	}
	else if (Math.random() < 0.2) {
		snare[15] = 1;
	}
	return snare;
}

function genKick() {
	var kick = [];
	for (var i = 0; i < kickRes; i++) {
		kick[i] = 0;
	}
	kick = [1, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0];

	if (Math.random() < 0.8) kick[3] = 1;
	if (Math.random() < 0.8) kick[6] = 1;
	if (Math.random() < 0.8) kick[13] = 1;
	if (Math.random() < 0.3) {
		kick[9] = 1;
		kick[10] = 1;
	}
	return kick;
}

function mutateHat() {
	var hat = currentBeatPart._hat;

	// if cut out, always cut back in after.
	if (muteHat == true) {
		muteHat = false;
		return;
	}

	if (Math.random() < 0.1) {
		console.log("changing hat situation")
		if (hatTime == 1) {
			if (Math.random() < 0.5) hatTime = 2;
			else hatTime = 4;
		}
		else if (hatTime == 2) {
			if (Math.random() < 0.5) hatTime = 1;
			else hatTime = 4;
		}
		else if (hatTime == 4) {
			if (Math.random() < 0.5) hatTime = 1;
			else hatTime = 2;
		}

		if (Math.random() < 0.3) muteHat = true;

		for (var i = 0; i < hatRes; i++) {
			hat[i] = 0;
		}

		for (var i = 0; i < hatRes; i++) {
			if ((i % (hatTime * 2) == 0 || (Math.random() < 0.1 / hatTime))) hat[i] = 1;
		}
	}

	for (var i = 0; i < hatRes; i++) {
		if ((i % (hatTime * 2) != 0 && (Math.random() < 0.1 / hatTime))) hat[i] = !hat[i];
	}
	currentBeatPart._hat = hat;
}

function mutateSnare() {
	var snare = currentBeatPart._snare;

	muteSnare = Math.random() < 0.1;

	if (Math.random() < 0.1) {
		snare[7] = !snare[7];
		snare[9] = !snare[9];
	}
	else if (Math.random() < 0.1) {
		snare[15] = !snare[15];
	}
	currentBeatPart._snare = snare;
}

function mutateKick() {
	var kick = currentBeatPart._kick;
	if (Math.random() < 0.1) invert(kick, 3);
	if (Math.random() < 0.1) invert(kick, 6);
	if (Math.random() < 0.1) invert(kick, 13);
	if (Math.random() < 0.1) invert(kick, 9)
	if (Math.random() < 0.1) invert(kick, 10);
	currentBeatPart._kick = kick;
	console.log(currentBeatPart._kick);
	mutateBass(currentBeatPart);
}

function invert(array, index) {
	if (array[index] == 0) {
		array[index] = 1;
	}
	else {
		array[index] = 0;
	}
}

function nextPart() {
	console.log("next part");
	//var newBeatPart = new BeatPart();
	if (change) {
		currentBeatPart._hat = genHat();
		currentBeatPart._kick = genKick();
		currentBeatPart._snare = genSnare();
	}
	else if (mutate) {
		mutateHat();
		mutateKick();
		mutateSnare();
	}
}

function playBeat(beat) {
	if (beat % 2 == 0) {
		quarter = true;
		playSnare(beat / 2);

	}
	if (beat % 2 == 0) {
		eigth = true;
		playKick(beat / 2);
	}

	playHat(beat);
}

// play all instruments at this resolution
function playSnare(beat) {
	if (!muteSnare && currentBeatPart._snare[beat] != 0) {
		playSound(snareObject, 1);
	}
}

function playKick(beat) {
	if (currentBeatPart._kick[beat] != 0) {
		playSound(kickObject, 1);
	}
}

function playHat(beat) {
	if (!muteHat && currentBeatPart._hat[beat] != 0) {
		playSound(hatObject, 1);
	}
}