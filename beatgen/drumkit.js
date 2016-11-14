// Fun variables
var londonMode = false;

var snareRes = 16;
var kickRes = 16;
var hatRes = 32;

var hatVol = -0.5;
var snareVol = 0;
var kickVol = 0;

var kickProbs = []

// This represents the drum pad for playing the drum beat
// Everything is represented as arrays of binary values (1 or 0).
// For example, the snare array is length 16, one for each eigth note in a two measure block.
// Example: kick = [1, 0, 0, 0, 0, 0, 0, 0
//					0, 0, 0, 0, 0, 0, 0, 0]
// High hat is double the resolution (length 32).

var change = false; // generate completely new beat every 2 bars 
var mutate = true; // mutate previous two bars

var measures = 1; // actuall should be called measures?

// var currentKitPart;

var hatObject = new sample(getFileName("hat", 1));
var kickObject = new sample(getFileName("kick", 1));
var snareObject = new sample(getFileName("snare", 1));

// this will be owned by BeatPart
function KitPart(fresh) {
	if (fresh) {
		this._kick = genKick();
		this._snare = genSnare();
		this._hat = genHat();
	}
}

// schedule this beat part to be played for x measures
function scheduleKitPart(kitPart, muteKick, muteHat, muteSnare) {
	// console.log("scheduling");
	for (var i = 0; i < measures; i++) {
		// schedule hat
		if (!muteHat) {
		for (var j = 0; j < hatRes; j++) {
			if (kitPart._hat[j] > 0) {
				playHat(j + i * 32);
			}
		}
		}
		
		if (!muteKick) {
		// schedule kick
		for (var j = 0; j < kickRes; j++) {
			if (kitPart._kick[j] == 1) {
				playKick(j * 2 + i * 32);
			}
		}
		}
		
		if (!muteSnare) {
		// schedule snare
		for (var j = 0; j < snareRes; j++) {
			if (kitPart._snare[j] == 1) {
				playSnare(j * 2 + i * 32);
			}
		}
		}
	}
}


function generateNewDrums() {
	var newKitPart = new KitPart(true);
	return newKitPart;
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

	console.log("hat time: " + hatTime)

	// muteHat = Math.random() < 0.7;
	hat  = mutateHat(hat, false);
	
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

	snare = [0, 0, 0, 0, 1, 0, 0, 0,
			 0, 0, 0, 0, 1, 0, 0, 0];
	
	snare = mutateSnare(snare);
	muteSnare = Math.random() < 0.1 || (muteKick && Math.random() < 0.3);
	muteSnare = true;
	
	return snare;
}

function genKick() {
	var kick = [1, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0];
		
	
	kick = mutateKick(kick);
	muteKick = false;
	muteKick = Math.random() < 0.7;	
	
	return kick;
}

function mutateKit(oldKit) {
	var newKitPart = new KitPart(false);
	
	newKitPart._hat = mutateHat(oldKit._hat, false);
	newKitPart._kick = mutateKick(oldKit._kick);
	newKitPart._snare = mutateSnare(oldKit._snare);	
	
	return newKitPart;
}

// function nextPart() {
// 	//var newkitPart = new kitPart();
	
// 	if (change) {
// 		currentKitPart._hat = genHat();
// 		currentKitPart._kick = genKick();
// 		currentKitPart._snare = genSnare();
// 	}
// 	else if (mutate && measureCounter % 2 == 0) {
// 		console.log("mutating");
// 		currentKitPart._hat = mutateHat(currentKitPart._hat);
// 		currentKitPart._kick = mutateKick(currentKitPart._kick);
// 		currentKitPart._snare = mutateSnare(currentKitPart._snare);
// 		scheduleKitPart(currentKitPart);
// 		mutateMelody();
// 		scheduleMelody();
// 	}
// }

function mutateHat(hat, canChangeSituation) {
	var ret = hat.slice(0);
	
	muteHat = Math.random() < 0.1;

	// if cut out, always cut back in after.

	if (canChangeSituation && Math.random() < 0.1) {

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
	
	// mutateBass(ret);
	
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


function playBeat(beat) {
	if (beat % 2 == 0) {
		playSnare(beat / 2);
	}
	if (beat % 2 == 0) {
		playKick(beat / 2);
		// playBass(beat / 2);
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
		playSound(kickObject, 1, kickVol, time + beat * subBeatEvery);
	}
}

function playHat(beat) {
	if (!muteHat) {
		// console.log("queueing hat: " + (time + beat * subBeatEvery));
		playSound(hatObject, 1, hatVol, time + beat * subBeatEvery);
		
		// // play the next two notes in triplet
		// if (currentKitPart._hat[beat % 32] == 2) {
		// 	playSound(hatObject, 1, hatVol, time + (beat + 2.66) * subBeatEvery);			
		// 	playSound(hatObject, 1, hatVol, time + (beat + 5.33) * subBeatEvery);			
		// }
		// // play next two notes in triplet
		// if (currentKitPart._hat[beat % 32] == 3) {
		// 	playSound(hatObject, 1, hatVol, time + (beat + 1.33) * subBeatEvery);			
		// 	playSound(hatObject, 1, hatVol, time + (beat + 2.66) * subBeatEvery);			
		// }
	}
}

// will mute if not already muted
// function tryToMute(array) {
// 	if (array == currentKitPart._kick) {
// 		if (muteSnare && muteHat) return;
// 		muteKick = true;
// 	}
// 	else if (array == currentKitPart._snare) {
// 		if (muteKick && muteHat) return;
// 		muteSnare = true;
// 	}
// 	else if (array == currentKitPart._hat) {
// 		if (muteSnare && muteKick) return;
// 		muteHat = true;
// 	}
// }