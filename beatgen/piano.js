var melodyOffsetFromG
var melodyOffFromG = 2; // A.

var melodyObject = new sample(getFileName("melody", 8));

var melody = [0,0,0,0,0,0,0,0,   0,0,0,0,0,0,0,0]
var melodyInit = false;
var melodyOctave = 0;
var melodyVol = -.5;


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
    if (Math.random() < 0.5 && melodyInit) return;
    melodyInit = true;
     for (var i = 0; i < melody.length; i++) {
         if (i % 2 == 0 && Math.random() < 0.9) {
             if (Math.random() < 0.05) melody[i] = 3;
             else if (Math.random() < 0.05) melody[i] = 5;
             else if (Math.random() < 0.05) melody[i] = 8;
             else if (Math.random() < 0.05) melody[i] = -2;
             else if (Math.random() < 0.05) melody[i] = 0;
         }    
         if (i % 2 == 1 && Math.random() < 0.05) {
             melody[i] = 8;
             if (Math.random() < 0.5) melody[i] = 1;
         }
     }
     if (Math.random() < 0.5) {
     for (var i = melody.length / 2; i < melody.length; i++) {
         melody[i - melody.length/2] = melody[i];
    }
     }
    for (var i = 0; i < melody.length; i += 2) {
        if (melody[i] == 0 && Math.random() < 0.5) melody[i] = 1;
        else if (melody[i] > 1 && Math.random() < 0.2) melody[i] = 0;        
    }
    if (melody[melody.length - 4] == 1 && Math.random() < 0.5) {
        melody[melody.length-2] = 2;
        if (Math.random() < 0.5) melody[melody.length - 2] = 3;
    }
    console.log("melody: " + melody);   
}

// move to different file eventually
function scheduleMelody() {
      for (var i = 0; i < bars; i++) {
		for (var j = 0; j < melody.length; j++) {
			if (melody[j] != 0) {
				playMelody(j + i * melody.length);
			}
		}
    }
}


function playMelody(beat) {
    // if (muteKick) return;
    var note = melody[beat % melody.length];
    if (note != 0) {
        var vol = 0;
        // if (currentBeatPart._kick[beat] == 0) 
        playSound(melodyObject, note + melodyOffFromG + key + 12 * melodyOctave, melodyVol, time + beat * 2 * subBeatEvery);
        // playSound(melodyObject1, note + melodyOffFromG + key + 5 + 12 * melodyOctave, pianoVol - 0.2, time + beat * 2 * subBeatEvery);
        // playSound(melodyObject2, note + melodyOffFromG + key + 9 + 12 * melodyOctave, pianoVol, time + beat * 2 * subBeatEvery);
    }
}