var melodyOffsetFromG
var melodyOffFromG = 2; // A.

var melodyObject = new sample(getFileName("synth", 8));
var melodyObject1 = new sample(getFileName("piano", 1));
var melodyObject2 = new sample(getFileName("piano", 1));

var melody = [0,0,0,0,   0,0,0,0,   0,0,0,0,  0,0,0,0]

var melodyOctave = 0;
var pianoVol = -0.8;


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

function mutateMelody() {
     for (var i = 0; i < melody.length; i++) {
         if (i % 2 == 0 && Math.random() < 0.9) {
             if (Math.random() < 0.05) melody[i] = 3;
             else if (Math.random() < 0.05) melody[i] = 5;
             else if (Math.random() < 0.05) melody[i] = 8;
             else if (Math.random() < 0.05) melody[i] = -2;
             else if (Math.random() < 0.05) melody[i] = 0;
         }    
         if (i % 2 == 1 && Math.random() < 0.1) {
             melody[i] = 8;
         }
     }
     for (var i = melody.length / 2; i < melody.length; i++) {
        melody[i - melody.length/2] = melody[i];
    }
    for (var i = 0; i < melody.length; i += 2) {
        if (melody[i] == 0) melody[i] = 1;        
    }
    console.log("piano: " + melody);   
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
    var note = melody[beat % melody.length];
    if (note != 0) {
        playSound(melodyObject, note + melodyOffFromG + key + 12 * melodyOctave, pianoVol, time + beat * 2 * subBeatEvery);
        // playSound(melodyObject1, note + melodyOffFromG + key + 5 + 12 * melodyOctave, pianoVol - 0.2, time + beat * 2 * subBeatEvery);
        // playSound(melodyObject2, note + melodyOffFromG + key + 9 + 12 * melodyOctave, pianoVol, time + beat * 2 * subBeatEvery);
    }
}