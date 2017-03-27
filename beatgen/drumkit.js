// if using triplets, don't allow weird beats to be scheduled
var triplets;

var snareRes = 16;
var kickRes = 16;
var hatRes = 32;

var hatVol = -0.6;
var snareVol = 0.0;
var clapVol = -0.9;
var kickVol = 0.0;

var accentVol = -0.8;

var switchHatSample;
var shouldPlayOpenHat;
var shouldPlayClap;

var openHatRes = 8; // 4, 8, 16
var openHatMod = 0; // 0 or openHatRes/2

var kickProbs = []

// This represents the drum pad for playing the drum beat
// Everything is represented as arrays of binary values (1 or 0).
// For example, the snare array is length 16, one for each eigth note in a two measure block.
// Example: kick = [1, 0, 0, 0, 0, 0, 0, 0
//					0, 0, 0, 0, 0, 0, 0, 0]
// High hat is double the resolution (length 32).

var measures = 1; // actuall should be called measures?

// static
function initKit() {
	triplets = Math.random() < 0.8;
	console.log("triplets: " + triplets);

	switchHatSample = Math.random() < 0.3;
	shouldPlayOpenHat = Math.random() < 0.2;
	shouldPlayClap = Math.random() < 0.0;
	console.log("should play clap: " + shouldPlayClap)

// TODO change to "sample" or "channel"
	hatObject = SoundType.HAT_1;
	hatObject2 = SoundType.HAT_2;	

	currentHat = hatObject;
}

// this will be owned by BeatPart
function KitPart(fresh) {
	if (fresh) {
		this._kick = genKick();
		this._snare = genSnare();
		this._hat = genHat();
		this._roll = genRoll();
	}
}

function playHey(beat) {
	scheduleSound(SoundType.HEY, 1 + originalKey, 0, time + beat * subBeatEvery);
}

// schedule this beat part to be played for x measures
function scheduleKitPart(kitPart, muteKick, muteHat, muteSnare, playAccent, forceHiRes) {
	if (playAccent) {
		playAcct(0);
	}
	
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
			if (shouldPlayOpenHat) {
				if (j % openHatRes == openHatMod) {
					playOpenHat(j + i * 32);
				} 
			}

			if (kitPart._hat[j] > 0 || (forceHiRes && j % 2 == 0)) {
				playHat(j + i * 32);
				
				// don't play triplets if doing hi res hat.
				if  (forceHiRes && j % 2 == 0) continue;

				// triplets
				if (kitPart._hat[j] == 2) {
					currentHat = hatObject2;
					playHat(j + i * 32 + 1.33);		
					playHat(j + i * 32 + 2.66);		
					currentHat = hatObject;
				}
				if (kitPart._hat[j] == 3) {
					currentHat = hatObject2;
					playHat(j + i * 32 + 2.66);		
					playHat(j + i * 32 + 5.33);
					currentHat = hatObject;
				}
				if (kitPart._hat[j] == 4) {
					currentHat = hatObject2;
					playHat(j + i * 32 + 0.33);		
					playHat(j + i * 32 + 0.66);
					currentHat = hatObject;
				}
				if (kitPart._hat[j] == 5) {
					currentHat = hatObject2;
					playHat(j + i * 32 + 0.25);		
					playHat(j + i * 32 + 0.5);
					playHat(j + i * 32 + 0.75);
					currentHat = hatObject;
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
			if (shouldPlayClap && j % 4 == 2) {
				playClap(j * 2 + 1 * 32);
			}
			if (kitPart._snare[j] == 1) {
				playSnare(j * 2 + i * 32);
			}
			var shouldPlayRoll = false;
			if (shouldPlayRoll) {
				console.log("playing roll")
				playRoll(j * 2 + i * 32);
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
	if (isLondonMode()) hatTime = 4;
	
	// muteHat = Math.random() < 0.7;
	hat  = mutateHat(hat, false);
	
	return hat;
}

function addTriplets(hat, i) {
	// super fast triplet // 0.3
	if (Math.random() < 0.3) {
		hat[i] = 4;
		// make the next one a triplet with high prob
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

function genRoll() {
	// 1 is 2 beats, 2 is 3 beats (not triplet), 3 is triplet, 4 is 
	var roll = [1, 0, 1, 0, 1, 0, 1, 0]
	
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
	// if (hatTime == 4) {
// 		if (Math.random() < 0.5) {
// 			hatTime = 1;
// 		}
// 	}

	console.log("hat time: " + hatTime)

	for (var i = 0; i < hatRes; i++) {
		// triplet blocked out
		if (ret[i] < 0) continue;
		
		// On an off beat
		if ((i % (hatTime * 2) != 0 && ((isLondonMode() && i % 2 == 0 && Math.random() < 0.3) || (Math.random() < 0.3 / hatTime)))) {
			invert(ret, i);
			
			if (Math.random() < 0.02 && hatTime == 1) ret[i] = 5;
		}
		if (i % (hatTime * 2) == 0) {
			if (ret[i] == 2 || ret[i] == 3) {
				invert(ret, i); 
				invert(ret, i); // invert again to make 1
			}
			else if (ret[i] == 0)
				invert(ret, i); 

			if (Math.random() < 0.05 && hatTime == 1) ret[i] = 5;
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

// schedule instruments to be played on the given beat
function playSnare(beat) {
	scheduleSound(SoundType.SNARE, 1, snareVol, time + beat * subBeatEvery);
}

function playRoll(beat) {
	beat = beat % 32;
	// Determine note based on beat:
	// 0 - 3 is 3
	// 4 - 7 is 2 
	// 8 - 11 is 1
	// 12 - 15 is 0
	var note = 3 - Math.floor(beat / 8);
	console.log(note);
	
	scheduleSound(SoundType.SNARE_2, key + currentNotes[note], snareVol, time + beat * subBeatEvery);
}

function playClap(beat) {
	scheduleSound(SoundType.CLAP, 1, clapVol, time + beat * subBeatEvery);
}

function playKick(beat) {
	scheduleSound(SoundType.KICK, 1, kickVol, time + beat * subBeatEvery);
}

function playOpenHat(beat) {
	scheduleSound(SoundType.HAT_OPEN, 1, hatVol, time + beat * subBeatEvery);
}

function playHat(beat) {
	scheduleSound(currentHat, 1, hatVol, time + beat * subBeatEvery);
}

function playAcct(beat) {
	scheduleSound(SoundType.ACCENT, 1 + key - 12, accentVol, time + beat * subBeatEvery);
}
