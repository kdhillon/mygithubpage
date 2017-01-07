// Fun variables
var londonMode = false;

// if using triplets, don't allow weird beats to be scheduled
var triplets;

var snareRes = 16;
var kickRes = 16;
var hatRes = 32;

var hatVol = -0.6;
var snareVol = 0.0;
var kickVol = 0.0;

var accentVol = -0.8;

var kickProbs = []

// This represents the drum pad for playing the drum beat
// Everything is represented as arrays of binary values (1 or 0).
// For example, the snare array is length 16, one for each eigth note in a two measure block.
// Example: kick = [1, 0, 0, 0, 0, 0, 0, 0
//					0, 0, 0, 0, 0, 0, 0, 0]
// High hat is double the resolution (length 32).

var measures = 1; // actuall should be called measures?

// var currentKitPart;
var hatObject;
var kickObject;
var snareObject;

var accentObject;
var heyObject;

// static
function initKit() {
	triplets = Math.random() < 0.8;
	console.log("triplets: " + triplets);

	hatObject = new sample(getFileName("hat", 3));
 	kickObject = new sample(getFileName("kick", 1));
 	snareObject = new sample(getFileName("snare", 2));

	accentObject = new sample(getFileName("accent", 1));
	heyObject = new sample(getFileName("hey", 1));
}

// this will be owned by BeatPart
function KitPart(fresh) {
	if (fresh) {
		this._kick = genKick();
		this._snare = genSnare();
		this._hat = genHat();
	}
}

function playHey(beat) {
	// console.log("playing hey " + beat);
	playSound(heyObject, 1 + originalKey, 0, time + beat * subBeatEvery);
}

// schedule this beat part to be played for x measures
function scheduleKitPart(kitPart, muteKick, muteHat, muteSnare, playAccent) {
	if (playAccent) {
		playAcct(0);
	}
	
	
	// console.log(kitPart._hat);
	for (var i = 0; i < measures; i++) {
		
		if (playHeyThisSong && !muteSnare) {
			for (var j = 0; j < kickRes; j++) {
				if (j % 4 == 2) {
					playHey(j * 2 + i * 32);
				}
			}
		}
		
		// schedule hat
		if (!muteHat) {
		for (var j = 0; j < hatRes; j++) {
			if (kitPart._hat[j] > 0) {
				playHat(j + i * 32);
				
				if (kitPart._hat[j] == 2) {
					playHat(j + i * 32 + 1.33);		
					playHat(j + i * 32 + 2.66);		
				}
				if (kitPart._hat[j] == 3) {
					playHat(j + i * 32 + 2.66);		
					playHat(j + i * 32 + 5.33);
				}
				if (kitPart._hat[j] == 4) {
					playHat(j + i * 32 + 0.33);		
					playHat(j + i * 32 + 0.66);
				}
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
	
	// muteHat = Math.random() < 0.7;
	hat  = mutateHat(hat, false);
	
	return hat;
}

function addTriplets(hat, i) {
	// super fast triplet
	if (Math.random() < .3) {
		hat[i] = 4;
		// if ( == 0) invert(hat, (i+1)%hatRes); // make the next one 1 (THIS IS FucKing stuff up)
		if (Math.random() < 0.5) hat[(i+1)%hatRes] = 4;
	}
	else if (Math.random() < .5) {
		hat[i] = 2; // triplet
		hat[(i + 1) % hatRes] = -1; // make the next one 0	
		hat[(i + 2) % hatRes] = -1; // make the next one 0			
		hat[(i + 3) % hatRes] = -1; // make the next one 0		
		if (hat[(i+4)%hatRes] == 0) invert(hat, (i+4)%hatRes); // make the next one 1 (THIS IS FucKing stuff up)
		
		// make sure the one after the triplet is off, so it doesn't sound weird. This may be buggy.
// 		hat[(i + 6) % hatRes] = 0; // make the next one 1
// 		hat[(i + 7) % hatRes] = 1; // make the next one 1
	} else {
		hat[i] = 3;
		hat[(i + 1) % hatRes] = -1; // make the next one 0	
		hat[(i + 2) % hatRes] = -1; // make the next one 0			
		hat[(i + 3) % hatRes] = -1; // make the next one 0	
		hat[(i + 4) % hatRes] = -1; // make the next one 0	
		hat[(i + 5) % hatRes] = -1; // make the next one 0			
		hat[(i + 6) % hatRes] = -1; // make the next one 0	
		if (hat[(i+7)%hatRes] == 0) invert(hat, (i+7)%hatRes); // make the next one 1 (THIS IS FucKing stuff up)
	}
 //	if (hatTime == 1 || hatTime == 2) {
 // 		hat[i] = 3;
 // 		hat[(i + 1) % hatRes] = 0; // make the next one 0
 // 		hat[(i + 2) % hatRes] = 0; // make the next one 0
 // 		hat[(i + 3) % hatRes] = 0; // make the next one 0
 // 		hat[(i + 4) % hatRes] = 1; // make the next one 1
 // 	}
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

function mutateHat(hat, canChangeSituation) {
	var ret = hat.slice(0);
	
	// muteHat = Math.random() < 0.1;

	if (canChangeSituation && Math.random() < 0.1) {
		// console.log("changing hat situation")
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
				
		for (var i = 0; i < hatRes; i++) {
			ret[i] = 0;
		}
	}

	// todo allow hat to go from slow to fast early on in the beat.
	if (hatTime == 4) {
		if (Math.random() < 0.5) {
			hatTime = 1;
		}
	}

	console.log("hat time: " + hatTime)

	for (var i = 0; i < hatRes; i++) {
		// triplet blocked out
		if (ret[i] < 0) continue;
		
		if ((i % (hatTime * 2) != 0 && (Math.random() < 0.1 / hatTime))) invert(ret, i);
		if (i % (hatTime * 2) == 0) {
			if (ret[i] == 2 || ret[i] == 3) {
				invert(ret, i); 
				invert(ret, i); // invert again to make 1
			}
			else if (ret[i] == 0)
				invert(ret, i); 
		}
		
		// this prevents triplets from sounding weird with a beat right after?
		if (triplets && (i % 2) != 0 && (ret[i] > 0 && ret[i] != 4) && !(ret[(i-1)%ret.length] == 1 && ret[(i+1)%ret.length] == 1)) {
			invert(ret, i);
		}
		
		if (triplets && ret[i] == 1 && Math.random() < 0.2 && i % 4 == 0) {
			addTriplets(ret, i);
		}	
	}
	console.log("hat: " + ret)
	return ret;
}

function mutateSnare(snare) {
	var ret = [];
	for (var i = 0; i < snareRes; i++) {
		ret[i] = snare[i];
	}
	
	if (Math.random() < 0.15) invert(ret, 7);
	if (Math.random() < 0.1 || (ret[7] == 1 && Math.random() < 0.5)) invert(ret, 9);
	if (Math.random() < 0.1) invert(ret, 15);
	
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
	
	// mutateBass(ret);
	
	return ret;
}

function invert(array, index) {
	if (array[index] == 0) {
		array[index] = 1;
	}
	else if (array[index] == 2 || array[index] == 3) {
		// no longer a triplet, so free up the next few blocks
			var j = index + 1;
			while (array[j] < 0) {
				array[j] = 0;
				j++;
			}
			array[index] = 0;
	}
	else {
		array[index] = 0;
	}
}

//
// function playBeat(beat) {
// 	if (beat % 2 == 0) {
// 		playSnare(beat / 2);
// 	}
// 	if (beat % 2 == 0) {
// 		playKick(beat / 2);
// 		// playBass(beat / 2);
// 	}
//
// 	playHat(beat);
// }

// schedule instruments to be played on the given beat
function playSnare(beat) {
	// console.log("queueing snare: " + (time + beat * subBeatEvery));
	playSound(snareObject, 1, snareVol, time + beat * subBeatEvery);
}

function playKick(beat) {
	playSound(kickObject, 1, kickVol, time + beat * subBeatEvery);
}

function playHat(beat) {
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

function playAcct(beat) {
	playSound(accentObject, 1 + key - 12, accentVol, time + beat * subBeatEvery);
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