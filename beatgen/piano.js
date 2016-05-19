var melodyOffsetFromG
var melodyOffFromG = 2; // A.

var melodyObject = new sample(getFileName("piano", 1));
var melodyObject1 = new sample(getFileName("piano", 1));
var melodyObject2 = new sample(getFileName("piano", 1));

var melody = [1,0,0,0,   0,0,0,0,   0,0,0,0,  0,0,0,0]

var melodyOctave = 0;
var pianoVol = -0.6;


function initMelody() {
    for (var i = 0; i < melody.length; i++) {
        melody[i] = 0;
    }
    mutateMelody();
    // melody[0] = 1;
    for (var i = melody.length / 2; i < melody.length; i++) {
        melody[i - melody.length/2] = melody[i];
    }
}

function mutateMelody() {
     for (var i = 0; i < melody.length; i++) {
         if (melody[i] == 0 && Math.random() < 0.2) {
             if (Math.random() < 0.3 && (i % 2 == 0 || Math.random() < 0.2)) melody[i] = 1
             else if (Math.random() < 0.05 && (i % 2 == 0 || Math.random() < 0.2)) melody[i] = 3;
             else if (Math.random() < 0.05 && (i % 2 == 0 || Math.random() < 0.2)) melody[i] = 5;
             else if (Math.random() < 0.05 && (i % 2 == 0 || Math.random() < 0.2)) melody[i] = 8;
             else if (Math.random() < 0.05 && (i % 2 == 0 || Math.random() < 0.2)) melody[i] = -2;
         }    
         else if (Math.random() < 0.1) {
             melody[i] = 0;
         }
     }
      for (var i = melody.length / 2; i < melody.length; i++) {
        melody[i - melody.length/2] = melody[i];
    }
}

// move to different file eventually
function scheduleMelody() {
      for (var i = 0; i < bars; i++) {
		for (var j = 0; j < melody.length; j++) {
			if (melody[j] != 0) {
				playPiano(j + i * melody.length);
			}
		}
    }
}


function playPiano(beat) {
    // if (muteKick) return;
    console.log("playing piano");
    var note = melody[beat % melody.length];
    if (note != 0) {
        console.log("piano: " + melody);
        // playSound(melodyObject, note + melodyOffFromG + key + 12 * melodyOctave, pianoVol, time + beat * 2 * subBeatEvery);
        // playSound(melodyObject1, note + melodyOffFromG + key + 5 + 12 * melodyOctave, pianoVol - 0.2, time + beat * 2 * subBeatEvery);
        // playSound(melodyObject2, note + melodyOffFromG + key + 9 + 12 * melodyOctave, pianoVol, time + beat * 2 * subBeatEvery);
    }
}