// Fun variables
var londonMode = false;

var snareRes = 16;
var kickRes = 16;
var hatRes = 32;

var hatVol = 0;
var snareVol = 0;
var kickVol = 0;

var kickProbs = []

// This represents the drum pad for playing the drum beat
// Everything is represented as arrays of binary values (1 or 0).
// For example, the snare array is length 16, one for each eigth note in a two measure block.
// Example: kick = [1, 0, 0, 0, 0, 0, 0, 0
//					0, 0, 0, 0, 0, 0, 0, 0]
// High hat is double the resolution (length 32).
// document.body.style.backgroundColor = "magenta"

var change = false; // generate completely new beat every 2 bars 
var mutate = true; // mutate previous two bars
var bars = 2;

var currentBeatPart;

var hatObject = new sample(getFileName("hat", 10));
var kickObject = new sample(getFileName("kick", 3));
var snareObject = new sample(getFileName("snare", 3));

function initKit() {
	mainPart = new BeatPart();
	currentBeatPart = mainPart;
	scheduleBeatPart(currentBeatPart);
}

// schedule this beat part to be played for x bars
function scheduleBeatPart(beatPart) {
	console.log("scheduling");
	for (var i = 0; i < bars; i++) {
		// schedule hat
		for (var j = 0; j < hatRes; j++) {
			if (beatPart._hat[j] > 0) {
				playHat(j + i * 32);
			}
		}
		
		// schedule kick
		for (var j = 0; j < kickRes; j++) {
			if (beatPart._kick[j] == 1) {
				playKick(j * 2 + i * 32);
			}
		}
		
		// schedule snare
		for (var j = 0; j < snareRes; j++) {
			if (beatPart._snare[j] == 1) {
				playSnare(j * 2 + i * 32);
			}
		}
	}
}

function BeatPart() {
	this._kick = genKick();
	this._snare = genSnare();
	this._hat = genHat();
}

// [1] is regular beat
// [2] is half time triplet
// [3] is triplet
function genHat() {
	var hat = new Array(hatRes).fill(0);;
	
	hatTime = 1;

	if (Math.random() < 0.3) hatTime = 2;
	else if (Math.random() < 0.5) hatTime = 4;
	if (londonMode) hatTime = 4;

	muteHat = Math.random() < 0.1;
	hat  = mutateHat(hat);
	
	return hat;
}

function addTriplets(hat, index) {
	if (hatTime == 4) {
		hat[i] = 2; // triplet
		hat[(i + 1) % hatRes] = 0; // make the next one 0	
		hat[(i + 2) % hatRes] = 0; // make the next one 0			
		hat[(i + 3) % hatRes] = 0; // make the next one 0			
		hat[(i + 4) % hatRes] = 0; // make the next one 1
		hat[(i + 5) % hatRes] = 0; // make the next one 1
		hat[(i + 6) % hatRes] = 0; // make the next one 1
		hat[(i + 7) % hatRes] = 1; // make the next one 1
	}
	if (hatTime == 1 || hatTime == 2) {
		hat[i] = 3;
		hat[(i + 1) % hatRes] = 0; // make the next one 0			
		hat[(i + 2) % hatRes] = 0; // make the next one 0			
		hat[(i + 3) % hatRes] = 0; // make the next one 0			
		hat[(i + 4) % hatRes] = 1; // make the next one 1			
	}
}

function genSnare() {
	var snare = [];

	muteSnare = Math.random() < 0.1 || (muteKick && Math.random() < 0.3);
	muteSnare = true;

	snare = [0, 0, 0, 0, 1, 0, 0, 0,
			 0, 0, 0, 0, 1, 0, 0, 0];
	
	snare = mutateSnare(snare);
	return snare;
}

function genKick() {
	var kick = [1, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0];
		
	muteKick = false;
	muteKick = Math.random() < 0.3;	
	kick = mutateKick(kick);
	
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
			if (Math.random() < 0.2) hatTime = 2;
			else hatTime = 4;
		}
		else if (hatTime == 2) {
			if (Math.random() < 0.2) hatTime = 1;
			else hatTime = 4;
		}
		else if (hatTime == 4) {
			if (Math.random() < 0.2) hatTime = 1;
			else hatTime = 2;
		}

		if (Math.random() < 0.3) muteHat = true;

		for (var i = 0; i < hatRes; i++) {
			ret[i] = 0;
		}

		for (var i = 0; i < hatRes; i++) {
			if ((i % (hatTime * 2) == 0 || (Math.random() < 0.1 / hatTime))) ret[i] = 1;
			
			if (hat[i] == 1 && Math.random() < 0.1) {
				// addTriplets(hat, i);
			}	
		}
	}

	for (var i = 0; i < hatRes; i++) {
		if ((i % (hatTime * 2) != 0 && (Math.random() < 0.1 / hatTime))) invert(ret, i);
		if (i % (hatTime * 2) == 0) ret[i] = 1; 
	}
	
	// console.log(ret);
	return ret;
}

function mutateSnare(snare) {
	var ret = [];
	for (var i = 0; i < snareRes; i++) {
		ret[i] = snare[i];
	}
	
	muteSnare = Math.random() < 0.1;

	if (Math.random() < 0.1) invert(ret, 7);
	if (Math.random() < 0.1) invert(ret, 9);
	if (Math.random() < 0.1) invert(ret, 15);
	
	return ret;
}

function mutateKick(kick) {
	var ret = [];
	for (var i = 0; i < kickRes; i++) {
		ret[i] = kick[i];
	}	
	
	muteKick = Math.random() < 0.1;	
	
	if (Math.random() < 0.1) invert(ret, 3);
	if (Math.random() < 0.1) invert(ret, 6);
	if (Math.random() < 0.1) invert(ret, 13);
	if (Math.random() < 0.1) invert(ret, 9)
	if (Math.random() < 0.1) invert(ret, 10);
	
	mutateBass(ret);
	
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
	else if (mutate && measureCounter % 2 == 0) {
		console.log("mutating");
		currentBeatPart._hat = mutateHat(currentBeatPart._hat);
		currentBeatPart._kick = mutateKick(currentBeatPart._kick);
		currentBeatPart._snare = mutateSnare(currentBeatPart._snare);
		scheduleBeatPart(currentBeatPart);
		mutateMelody();
		scheduleMelody();
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

// schedule instruments to be played on the given beat
function playSnare(beat) {
	if (!muteSnare) {
		// console.log("queueing snare: " + (time + beat * subBeatEvery));
		playSound(snareObject, 1, snareVol, time + beat * subBeatEvery);
	}
}

function playKick(beat) {
	if (!muteKick) {
		// playSound(kickObject, 1, kickVol, time + beat * subBeatEvery);
	}
}

function playHat(beat) {
	if (!muteHat) {
		// console.log("queueing hat: " + (time + beat * subBeatEvery));
		playSound(hatObject, 1, hatVol, time + beat * subBeatEvery);
		
		// play the next two notes in triplet
		if (currentBeatPart._hat[beat % 32] == 2) {
			playSound(hatObject, 1, hatVol, time + (beat + 2.66) * subBeatEvery);			
			playSound(hatObject, 1, hatVol, time + (beat + 5.33) * subBeatEvery);			
		}
		// play next two notes in triplet
		if (currentBeatPart._hat[beat % 32] == 3) {
			playSound(hatObject, 1, hatVol, time + (beat + 1.33) * subBeatEvery);			
			playSound(hatObject, 1, hatVol, time + (beat + 2.66) * subBeatEvery);			
		}
	}
}

// will mute if not already muted
function tryToMute(array) {
	if (array == currentBeatPart._kick) {
		if (muteSnare && muteHat) return;
		muteKick = true;
	}
	else if (array == currentBeatPart._snare) {
		if (muteKick && muteHat) return;
		muteSnare = true;
	}
	else if (array == currentBeatPart._hat) {
		if (muteSnare && muteKick) return;
		muteHat = true;
	}
}