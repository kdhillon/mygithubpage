var bassObject = new sample(getFileName("bass", 1));
//var bassObject2 = new sample(getFileName("bass", 0));

// BASS IS G

var semitoneOffset = 100;
var bassVol = -0.2;

var trapStyle = false;

var octave = 0;

// 0 is G
var key = Math.floor(Math.random() * 12 - 4);
// var key = 0;
console.log("Key: " + getNoteName(key));

function scheduleBass(bass) {
    for (var i = 0; i < measures; i++) {
		for (var j = 0; j < kickRes; j++) {
			if (bass[j] != 0) {
				playBass(bass, j + i * kickRes);
			}
		}
    }
}

function getNoteName(semitonesFromG) {
    var semitonesFromF = semitonesFromG - 5;
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

function getEmptyBass() {
    return new Array(kickRes).fill(0);
}

// mutate based on new kick
function generateBass(kick) {
    var bass = getEmptyBass();
    
     // for (var i = 0; i < kickRes; i++) {
 //        if (kick[i] != 0 || Math.random() < .1) {
 //            bass[i] = 1;
 //            if (Math.random() < 0.1) bass[i] = 5;
 //            else if (Math.random() < 0.1) bass[i] = 3;
 //            else if (Math.random() < 0.1) bass[i] = -2;
 //         }
 //        else {
 //           bass[i] = 0;
 //        }
 //    }

    return mutateBass(bass, kick);
    // scheduleBass(bass);
}

function mutateBass(bass, kick) {
	var newBass = bass.slice(0);
	
	newBass[0] = 1; // this could be removed below, which is cool sometimes
     for (var i = 0; i < kickRes; i++) {
        if (kick[i] != 0 || Math.random() < .125) {
            if (bass[i] != 0) {
                if (Math.random() < .1) { 
                    newBass[i] = 0;
                    continue;
                }
            }
            if (Math.random() < 0.5) newBass[i] = 1;
            else if (Math.random() < 0.1) newBass[i] = 5;
            else if (Math.random() < 0.1) newBass[i] = 3;
            else if (Math.random() < 0.1) newBass[i] = -2;
         }
    }

    if (trapStyle && Math.random() < 0.2) {
        newBass = [0, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        newBass[0] = 0;
        newBass[1] = 0;
        newBass[2] = 0;
        newBass[3] = 0;
        newBass[4] = 0;

        if (Math.random() < 0.5)
          newBass[5] = 3;
        else if (Math.random() < 0.5) 
          newBass[5] = 5;
        else newBass[5] = 1;

        newBass[6] = 1;
    }
	
    return newBass;
}

function playBass(bass, beat) {
    var index = beat;
    var note = bass[index % kickRes];
    if (note != 0) {
        stopSound(bassObject, time + beat * 2 * subBeatEvery - 0.001);
        playSound(bassObject, note + key + 12 * octave, bassVol, time + beat * 2 * subBeatEvery);
        // playSound(bassObject2, note + 12, bassVol, time + beat * subBeatEvery);
    }
}