var melodyOffFromG = 8; // definitely 8 for some reason?

var filename = getFileName("pad", 2)
var melodyObject = new sample(filename);
var harmonyObject = new sample(filename);
// var melodyObject1 = new sample(getFileName("piano", 1));
// var melodyObject2 = new sample(getFileName("piano", 1));

var melodyOctave = -1;
if (Math.random() < 0.5) melodyOctave = 0;
// if (Math.random() < 0.4) melodyOctave = -2;
// else if (Math.random() < 0.3) melodyOctave = 1;

// melodyOctave = ;

console.log("octave: " + melodyOctave);

// var harmonyOctave = melodyOctave + 2;
// if (Math.random() < 0.5) {
    var harmonyOctave = melodyOctave + 1;
// }
if (harmonyOctave == 2) harmonyOctave = 1;
// harmonyOctave = 1;

var melodyVol = -.7;
var harmonyVol = -.7;

 if (melodyOctave == -2) {
     melodyVol += 0.4;
     harmonyVol += 0.4;
}

// if (melodyOctave == 1) {
//     melodyVol -= .2;
// }
// if (harmonyOctave == 1) {
//     harmonyVol -= .2;
// }

// these should be subtracted by one
var majorScale = [1, 3, 5, 6, 8, 10, 12, 13];
var minorScale = [1, 3, 4, 6, 8, 9, 11, 13];

var scaleProb = [0.3, 0.05, 0.15, 0.05, 0.15, 0.05, 0.05, 0.2];

var majorChord = [1, 5, 8, 13];
var minorChord = [1, 4, 8, 13];
var chordProb = [0.25, 0.25, 0.25, 0.25];

var currentNotes = minorScale;
if (Math.random() < 0.3) currentNotes = majorScale;

if (currentNotes == minorScale || currentNotes == minorChord) {
    console.log("Key: " + getNoteName(key) + " minor");
}
else if (currentNotes == majorScale || currentNotes == majorScale) {
    console.log("Key: " + getNoteName(key) + " major");
}
else {
     console.log("Key: " + getNoteName(key));
}

var currentProb = scaleProb;

var RES = 1;

function getNewMelody() {
	return [0,0,0,0,0,0,0,0,   0,0,0,0,0,0,0,0];
}

function getNewHarmony() {
	return [0,0,0,0,0,0,0,0,   0,0,0,0,0,0,0,0];
}

function generateMelody() {
	var melody = getNewMelody();
	return mutateMelody(melody);
}

function generateHarmony() {
	var harmony = getNewHarmony();
	return mutateMelody(harmony, true);
}

function getWeightedNote(previous, harmony) {
    
    if (harmony) {
        rand = Math.random();
        if (rand < 0.3) return currentNotes[0];
        if (rand < 0.6) return currentNotes[currentNotes.length / 2];
        return currentNotes[currentNotes.length - 1];
    }

	// if (Math.random() < 0.5) {
	// 	var note = 0;
	// 	if (Math.random() < 0.5) note = currentNotes[(previous + 1) % currentNotes.length];
	// 	else note = currentNotes[(previous - 1) % currentNotes.length];		
	// 	if (note == null) {
            
    //        return ;
    //     }
	// }
	
     var rand = Math.random();
        var sum = 0;
        var index = -1;
        for (var j = 0; j < currentProb.length; j++) {
            sum += currentProb[j];
            if (rand < sum) {
                index = j; 
                break;
            }
        }
        return currentNotes[j];
}

function mutateHarmony(melody) {

}

function mutateMelody(input, harmony) {
	var melody = input.slice(0);
	var resolution = RES;
    if (Math.random() < 0.1) resolution = RES * 2;

	if (harmony) {
        if (Math.random() < 0.5)
            resolution = 2;
        else if (Math.random() < 0.5) {
            resolution = 4;
        }
        else {
            resolution = 8;
        }
        // melody = [0,0,0,0,0,0,0,0,0,0,0,0,0]
    }

    console.log("resolution: " + resolution)

    melody[0] = 1;
    if (Math.random() < 0.5) melody[0] = 13;
	
    for (var i = resolution; i < melody.length; i += resolution) {
        if ((melody[i] != 0) && Math.random() < 0.8) continue;
        else if (melody[i] == 0 && Math.random() < 0.4) continue;
        // if (Math.random() < 0.2) {
        //     melody[i] = 0;
        //     break;
        // }
       var note = getWeightedNote(i - resolution, harmony);
        while (melody[i-resolution] == note) {
            note = getWeightedNote(i - resolution, harmony);
        }
        if (note == 0) return;
        melody[i] = note;        
    }

//    melody[0] = 1;
//     should we duplicate the second half?
    if (Math.random() < 0.5) {
        for (var i = melody.length / 2; i < melody.length; i++) {
            melody[i] = melody[i - melody.length / 2];
        }
    }
    else if (resolution >= 2 && Math.random() < 0.2) {
        // clear the second half...
        for (var i = melody.length / 2; i < melody.length; i++) {
            melody[i] = 0;
        }
    }
    // for (var i = 0; i < melody.length; i += 2) {
    //     if (melody[i] == 0 && Math.random() < 0.5) melody[i] = 1;
    //     else if (melody[i] > 1 && Math.random() < 0.2) melody[i] = 0;
    // }
    // if (melody[melody.length - 4] == 1 && Math.random() < 0.5) {
    //     melody[melody.length - 2] = 2;
    //     if (Math.random() < 0.5) melody[melody.length - 2] = 3;
    // }
    if (harmony) {
        console.log("harmony: " + melody);
    }
    else 
        console.log("melody: " + melody);

    // document.getElementById("text").textContent = melody;
	return melody;
}

function scheduleMelody(melody) {
      for (var i = 0; i < measures; i++) {
		for (var j = 0; j < melody.length; j++) {
			if (melody[j] != 0) {
				playMelody(melody, j + i * melody.length);
			}
		}
    }
}

function scheduleHarmony(melody, harmony) {
      for (var i = 0; i < measures; i++) {
		for (var j = 0; j < melody.length; j++) {
			if (melody[j] != 0) {
				playHarmony(melody, harmony, j + i * melody.length);
			}
		}
    }
}


function playMelody(melody, beat) {
    var note = melody[beat % melody.length];
    
    
    if (note != 0) {
        //    stopSound(melodyObject, time + beat * 2 * subBeatEvery - 0.001);
          playSound(melodyObject, note - 1 - melodyOffFromG + key + 12 * melodyOctave, melodyVol, time + beat * 2 * subBeatEvery);
        // if (Math.random() < 0.5) playSound(melodyObject, note - 1 - melodyOffFromG + key + 12 * melodyOctave + 12, harmonyVol, time + beat * 2 * subBeatEvery);   
        // if (Math.random() < 0.5) playSound(melodyObject, note - 1 - melodyOffFromG + key + 12 * melodyOctave + 6, harmonyVol, time + beat * 2 * subBeatEvery);   
   }
}

function playHarmony(melody, harmony, beat) {
    var note = melody[beat % harmony.length] + 12;
    if (note == 25) {
        note = 12 + 8;
    }
    if (note != 0) {
         stopSound(harmonyObject, time + beat * 2 * subBeatEvery - 0.001);

        if (harmony[beat] != 0) playSound(harmonyObject, note - 1 - melodyOffFromG + key + 12 * melodyOctave + 12, harmonyVol, time + beat * 2 * subBeatEvery);
        // playSound(melodyObject, note - 1 - melodyOffFromG + key + 12 * harmonyOctave + 7, harmonyVol, time + beat * 2 * subBeatEvery);
      }
}