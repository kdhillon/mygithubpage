//var bassObject2 = new sample(getFileName("bass", 0));

// BASS IS C
var semitoneOffset = 100;
var bassVol = -0.2;

var trapStyle = false;

var octave = 0;

// 0 is G
var originalKey;
var key;

// todo try changing key down by a fifth for second half of beatpart?
var minor;

function initBass() {
    key = Math.floor(Math.random() * 12 - 4);
	key = 0;
	
	minor = true;
    // key = 0;

    if (Math.random() < 0.2 && !(isLugerMode() || isLondonMode())) minor = false;
} 
// var key = 0;

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
    if (semitonesFromF < 0) semitonesFromF += 12;
    if (semitonesFromF > 12) semitonesFromF -= 12;
    if (semitonesFromF > 12) semitonesFromF -= 12;

    if (semitonesFromF % 12 == 0) return "F";
    if (semitonesFromF % 12 == 1) return "F#";
    if (semitonesFromF % 12 == 2) return "G";
    if (semitonesFromF % 12 == 3) return "G#";
    if (semitonesFromF % 12 == 4) return "A";
    if (semitonesFromF % 12 == 5) return "A#";
    if (semitonesFromF % 12 == 6) return "B";
    if (semitonesFromF % 12 == 7) return "C";
    if (semitonesFromF % 12 == 8) return "C#";
    if (semitonesFromF % 12 == 9) return "D";
    if (semitonesFromF % 12 == 10) return "D#";
    if (semitonesFromF % 12 == 11) return "E";
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

    var maxBassNotes = 3;
    var totalBass = 0;
	
	newBass[0] = 1; // this could be removed below, which is cool sometimes
     for (var i = 0; i < kickRes; i++) {
        if (kick[i] != 0 || Math.random() < .1) {
            if (bass[i] != 0) {
                // erase a note that was previously there.
                if (Math.random() < .2) { 
                    newBass[i] = 0;
                    continue;
                }
            }
            if (totalBass >= maxBassNotes) {
                newBass[i] = 0;
                continue;
            }

            if (Math.random() < 0.4) newBass[i] = 1;
            else if (Math.random() < 0.1) newBass[i] = 8;
            // 5 is actually in the minor scale, does it sound good?
            else if (Math.random() < 0.1) {
                if (minor)
                   newBass[i] = 4;
                else newBass[i] = 5;
            }
            else if (Math.random() < 0.1) newBass[i] = 3;
            else if (Math.random() < 0.1) {
                if (minor)
                    newBass[i] = -2;
                else newBass[i] = -1;
            }
         }
        if (newBass[i] != 0) totalBass++;
    }

    if (trapStyle && Math.random() < 1) {
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
        scheduleStop(SoundType.BASS, time + beat * 2 * subBeatEvery - 0.001);
        scheduleSound(SoundType.BASS, note + key + 12 * octave, bassVol, time + beat * 2 * subBeatEvery);
    }
}