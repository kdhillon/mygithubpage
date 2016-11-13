var melodyOffsetFromG
var melodyOffFromG = 2; // A.

var melodyObject = new sample(getFileName("melody", 8));
// var melodyObject1 = new sample(getFileName("piano", 1));
// var melodyObject2 = new sample(getFileName("piano", 1));

var melody = [0,0,0,0,0,0,0,0,   0,0,0,0,0,0,0,0]
var melodyInit = false;
var melodyOctave = 0;
var melodyVol = -.9;

// these should be subtracted by one
var majorScale = [1, 3, 5, 6, 8, 10, 12, 13];
var minorScale = [1, 3, 4, 6, 8, 9, 11, 13];

var scaleProb = [0.2, 0.05, 0.2, 0.05, 0.2, 0.05, 0.05, 0.2];

var majorChord = [1, 5, 8, 13];
var minorChord = [1, 4, 8, 13];
var chordProb = [0.25, 0.25, 0.25, 0.25];

var currentNotes = minorScale;
var currentProb = scaleProb;

function initMelody() {
    for (var i = 0; i < melody.length; i++) {
        melody[i] = 0;
    }
    mutateMelody();
    scheduleMelody();
    // melody[0] = 1;
    // for (var i = melody.length / 2; i < melody.length; i++) {
    //     melody[i - melody.length/2] = melody[i];
    // }
}

function getWeightedNote() {
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

function mutateMelody() {
    if (Math.random() < 0.7 && melodyInit) return;
    melodyInit = true;
    melody[0] = 1;
    for (var i = 2; i < melody.length; i += 2) {
        if (melody[i] != 0 && Math.random() < 0.6) continue;
        // if (Math.random() < 0.2) {
        //     melody[i] = 0;
        //     break;
        // }
       var note = getWeightedNote();
        if (melody[i-2] != note)
            melody[i] = note;
    }

    melody[0] = 1;
    // should we duplicate the second half?
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
    // console.log("melody: " + melody);
    document.getElementById("text").textContent = melody;
}

// move to different file eventually
function scheduleMelody() {
    
      for (var i = 0; i < bars; i++) {
		for (var j = 0; j < melody.length; j++) {
			if (melody[j] != 0) {
	//			playMelody(j + i * melody.length);
			}
		}
    }
}


function playMelody(beat) {
    // if (muteKick) return;
    var note = melody[beat % melody.length];
    if (note != 0) {
        playSound(melodyObject, note - 1 + melodyOffFromG + key + 12 * melodyOctave, melodyVol, time + beat * 2 * subBeatEvery);
        // playSound(melodyObject1, note - 1 + melodyOffFromG + key + 4 + 12 * melodyOctave, melodyVol - 0.2, time + beat * 2 * subBeatEvery);
        // playSound(melodyObject2, note - 1 + melodyOffFromG + key + 7 + 12 * melodyOctave, melodyVol, time + beat * 2 * subBeatEvery);
    }
}