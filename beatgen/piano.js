var melodyOffsetFromG
var melodyOffFromG = 0; // A.

var melodyObject = new sample(getFileName("piano", 1));
// var melodyObject1 = new sample(getFileName("piano", 1));
// var melodyObject2 = new sample(getFileName("piano", 1));

var melodyOctave = -1;
var harmonyOctave = 0;

var melodyVol = -.7;
var harmonyVol = -.7;

// these should be subtracted by one
var majorScale = [1, 3, 5, 6, 8, 10, 12, 13];
var minorScale = [1, 3, 4, 6, 8, 9, 11, 13];

var scaleProb = [0.2, 0.05, 0.2, 0.05, 0.2, 0.05, 0.05, 0.2];

var majorChord = [1, 5, 8, 13];
var minorChord = [1, 4, 8, 13];
var chordProb = [0.25, 0.25, 0.25, 0.25];

var currentNotes = minorScale;
var currentProb = scaleProb;

var RES = 4;
if (Math.random() < 0.4) { 
	RES = 2;
}
else if (Math.random() < 0.4) {
	RES = 1;
}

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

function getWeightedNote(previous) {
	if (Math.random() < 0.5) {
		var note = 0;
		if (Math.random() < 0.5) note = currentNotes[(previous + 1) % currentNotes.length];
		else note = currentNotes[(previous - 1) % currentNotes.length];		
		if (note == null) return 0;
	}
	
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
	if (harmony) {
        resolution = 4;
        // melody = [0,0,0,0,0,0,0,0,0,0,0,0,0]
    }
	else resolution = 1;
	
    for (var i = 0; i < melody.length; i += resolution) {
        if ((melody[i] != 0) && Math.random() < 0.6) continue;
        else if (!harmony && melody[i] == 0 && Math.random() < 0.3) continue;
        // if (Math.random() < 0.2) {
        //     melody[i] = 0;
        //     break;
        // }
       var note = getWeightedNote(i - resolution);
        // if (harmony) {
        //     note = input[i] + 5;
        // }
        
        if (melody[i-resolution] != note) {
            melody[i] = note;
        }
    }

//    melody[0] = 1;
//     should we duplicate the second half?
    if (Math.random() < 0.5) {
        for (var i = melody.length / 2; i < melody.length; i++) {
            melody[i] = melody[i - melody.length / 2];
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

// move to different file eventually
function scheduleMelody(melody, harmony) {
      for (var i = 0; i < measures; i++) {
		for (var j = 0; j < melody.length; j++) {
			if (melody[j] != 0) {
				if (harmony) 
					playHarmony(melody, j + i * melody.length);
				else 
					playMelody(melody, j + i * melody.length);
			}
		}
    }
}


function playMelody(melody, beat) {
    var note = melody[beat % melody.length];
    if (note != 0) {
        playSound(melodyObject, note - 1 + melodyOffFromG + key + 12 * melodyOctave, melodyVol, time + beat * 2 * subBeatEvery);
    }
}

function playHarmony(harmony, beat) {
    var note = harmony[beat % harmony.length];
    if (note != 0) {
        playSound(melodyObject, note - 1 + melodyOffFromG + key + 12 * harmonyOctave, harmonyVol, time + beat * 2 * subBeatEvery);
      }
}