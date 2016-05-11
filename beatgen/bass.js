
var bassChoice = "SubBass01.wav";

var bassObject = new sample('http://kyledhillon.com/beatgen/server/' + bassChoice);
var bassObject2 = new sample('http://kyledhillon.com/beatgen/server/SubBass03.WAV');

// 0 if 1,2,3 (Start on G), but -3 if SubBass01
var bassChoiceOffsetFromG = -3;

var semitoneOffset = 100;
var bassVol = -0.5;

var muteBass;

// 0 is G
var key = Math.floor(Math.random() * 12 - 4);
// var key = 0;
console.log("Key: " + getNoteName(key));

// sub bass hits everytime the kick hits
function initBass(beatPart) {
    bass = [];
    for (var i = 0; i < kickRes; i++) {
        bass[i] = beatPart._kick[i];
        if (i > 0 && bass[i] == 1) {
            if (Math.random() < 0.5) bass[i] = 5;
            else if (Math.random() < 0.3) bass[i] = 3;
        }
    }
    scheduleBass(bass);
}

function scheduleBass(bass) {
    for (var i = 0; i < bars; i++) {
		for (var j = 0; j < kickRes; j++) {
			if (bass[j] > 0) {
				playBass(j + i * 32);
			}
		}
    }
}

function getNoteName(semitonesFromG) {
    var semitonesFromF = semitonesFromG + 2;
    if (semitonesFromF < 0) semitonesFromF += 12;
    if (semitonesFromF == 0) return "F";
    if (semitonesFromF == 1) return "F#";
    if (semitonesFromF == 2) return "G";
    if (semitonesFromF == 3) return "G#";
    if (semitonesFromF == 4) return "A";
    if (semitonesFromF == 5) return "A#";
    if (semitonesFromF == 6) return "B";
    if (semitonesFromF == 7) return "C";
    if (semitonesFromF == 8) return "C#";
    if (semitonesFromF == 9) return "D";
    if (semitonesFromF == 10) return "D#";
    if (semitonesFromF == 11) return "E";
    return "messed up";
}

// mutate based on new kick
function mutateBass(kick) {
    if (Math.random() < 0.1) muteBass = true;
    else muteBass = false;
    
     for (var i = 0; i < kickRes; i++) {
        if (kick[i] != 0 && bass[i] == 0) {
            bass[i] = 1;
            if (Math.random() < 0.4) bass[i] = 5;
            else if (Math.random() < 0.4) bass[i] = 3;
        }
        else if (kick[i] == 0 && bass[i] != 0) {
           bass[i] = 0;
        }
    }
    // console.log(kick);
    // console.log(bass);
    scheduleBass(bass);
}

function playBass(beat) {
    if (muteKick) return;
    if (beat % 2 == 0) {
        var index = beat / 2 % kickRes;
        var note = bass[index];
        if (note > 0) {
            playSound(bassObject, note + key, bassVol, time + beat * subBeatEvery);
            // playSound(bassObject2, note + 12, bassVol, time + beat * subBeatEvery);
         }
    }
}