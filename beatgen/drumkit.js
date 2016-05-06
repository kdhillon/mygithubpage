var snareRes = 16;
var kickRes = 16;
var hatRes = 32;

var hatVol = 0;
var snareVol = 0;
var kickVol = 0;

// This represents the drum pad for playing the drum beat
// Everything is represented as arrays of binary values (1 or 0).
// For example, the snare array is length 16, one for each eigth note in a two measure block.
// Example: kick = [1, 0, 0, 0, 0, 0, 0, 0
//					0, 0, 0, 0, 0, 0, 0, 0]
// High hat is double the resolution (length 32).
document.body.style.backgroundColor = "magenta"

var change = false; // generate completely new beat every 2 bars 
var mutate = true; // mutate previous two bars

var currentBeatPart;

var hatObject = new sample('http://kyledhillon.com/beatgen/server/hi hat (1).WAV');
var kickObject = new sample('http://kyledhillon.com/beatgen/server/kick (2).wav');
var snareObject = new sample('http://kyledhillon.com/beatgen/server/snare (1).WAV');

function initKit() {
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

	var londonMode = false;
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
		
	muteKick = false;
	// muteKick = Math.random() < 0.1;	
	
	if (Math.random() < 0.2) kick[1] = 1;
	if (Math.random() < 0.5) kick[3] = 1;
	if (Math.random() < 0.5) kick[6] = 1;
	if (Math.random() < 0.5) kick[13] = 1;
	if (Math.random() < 0.3) {
		kick[9] = 1;
		kick[10] = 1;
	}
	return kick;
}

function mutateHat(hat) {
	var ret = [];
	for (var i = 0; i < hatRes; i++) {
		ret[i] = hat[i];
	}

	// if cut out, always cut back in after.
	muteHat = Math.random() < 0.1;

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
			ret[i] = 0;
		}

		for (var i = 0; i < hatRes; i++) {
			if ((i % (hatTime * 2) == 0 || (Math.random() < 0.1 / hatTime))) ret[i] = 1;
		}
	}

	for (var i = 0; i < hatRes; i++) {
		if ((i % (hatTime * 2) != 0 && (Math.random() < 0.1 / hatTime))) ret[i] = !ret[i];
	}
	return ret;
}

function mutateSnare(snare) {
	var ret = [];
	for (var i = 0; i < snareRes; i++) {
		ret[i] = snare[i];
	}
	
	muteSnare = Math.random() < 0.1;

	if (Math.random() < 0.1) {
		invert(ret, 7);
	}
	if (Math.random() < 0.1) {
		invert(ret, 9);
	}
	if (Math.random() < 0.1) {
		invert(ret, 15);
	}
	
	return ret;
}

function mutateKick(kick) {
	var ret = [];
	for (var i = 0; i < kickRes; i++) {
		ret[i] = kick[i];
	}	
	
	if (Math.random() < 0.1) invert(ret, 3);
	if (Math.random() < 0.1) invert(ret, 6);
	if (Math.random() < 0.1) invert(ret, 13);
	if (Math.random() < 0.1) invert(ret, 9)
	if (Math.random() < 0.1) invert(ret, 10);
	mutateBass(currentBeatPart);
	
	return ret;
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
	//var newBeatPart = new BeatPart();
	if (change) {
		currentBeatPart._hat = genHat();
		currentBeatPart._kick = genKick();
		currentBeatPart._snare = genSnare();
	}
	else if (mutate && measureCounter % 2 == 1) {
		console.log("mutating");
		currentBeatPart._hat = mutateHat(currentBeatPart._hat);
		currentBeatPart._kick = mutateKick(currentBeatPart._kick);
		currentBeatPart._snare = mutateSnare(currentBeatPart._snare);
	}
}

function playBeat(beat) {
	if (beat % 2 == 0) {
		playSnare(beat / 2);
	}
	if (beat % 2 == 0) {
		playKick(beat / 2);
	}

	playHat(beat);
}

// play all instruments at this resolution
function playSnare(beat) {
	if (!muteSnare && currentBeatPart._snare[beat] != 0) {
		playSound(snareObject, 1, snareVol);
	}
}

function playKick(beat) {
	if (!muteKick && currentBeatPart._kick[beat] != 0) {
		playSound(kickObject, bass[beat], kickVol);
	}
}

function playHat(beat) {
	if (!muteHat && currentBeatPart._hat[beat] != 0) {
		playSound(hatObject, 1, hatVol);
	}
}