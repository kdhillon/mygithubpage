var bassObject = new sample(getFileName("bass", 3));
var bassObject2 = new sample(getFileName("bass", 3));

// 0 if 1,2,3 (Start on G), but -3 if SubBass01
var bassChoiceOffsetFromG = 1;

var semitoneOffset = 100;
var bassVol = 2;

var muteBass;

var octave = 0;

var bass;

var repeatEvery = 4; // how many bars should we repeat after

// 0 is G
var key = Math.floor(Math.random() * 12 - 4);
// var key = 0;
console.log("Key: " + getNoteName(key));

// sub bass hits everytime the kick hits
function initBass(beatPart) {
    bass = new Array(kickRes).fill(0);
    bass[0] = 1;

    mutateBass(beatPart._kick)
    scheduleBass(bass);
}

function scheduleBass(bass) {
    for (var i = 0; i < bars; i++) {
		for (var j = 0; j < kickRes; j++) {
			if (bass[j] != 0) {
				playBass(j + i * kickRes);
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
    if (bass == null) {
        bass = new Array(kickRes).fill(0);
    }
    kick[0] = 1;
    bass[0] = 1;

     for (var i = 1; i < kickRes; i++) {
        if (kick[i] != 0 && Math.random() < 1) {
            bass[i] = 1;
            if (Math.random() < 0.1) bass[i] = 5;
            else if (Math.random() < 0.1) bass[i] = 3;
            else if (Math.random() < 0.1) bass[i] = -2;
         }
        else {
           bass[i] = 0;
        }
    }
    // console.log(kick);
    // console.log(bass);
    scheduleBass(bass);
}

function playBass(beat) {
    if (muteKick) return;

    var index = beat;
    var note = bass[index % kickRes];
    if (note != 0) {
        // console.log(bass);
        // playSound(bassObject, note + key + 12 * octave, bassVol, time + beat * 2 * subBeatEvery);
        // playSound(bassObject2, note + 12, bassVol, time + beat * subBeatEvery);
    }
}