var melodyOffsetFromG
var melodyOffFromG = 2; // A.

var melodyObject = new sample(getFileName("piano", 1));

var melody = [1,0,0,0,   0,0,0,0,   0,0,0,0,  0,0,0,0]

var melodyOctave = 0;
var pianoVol = -0.5;


function initMelody() {
    for (var i = 0; i < melody.length; i++) {
        melody[i] = 0;
        if (Math.random() < 0.3 && (i % 2 == 0 || Math.random() < 0.2)) melody[i] = 1
        else if (Math.random() < 0.05 && (i % 2 == 0 || Math.random() < 0.2)) melody[i] = 3;
        else if (Math.random() < 0.05 && (i % 2 == 0 || Math.random() < 0.2)) melody[i] = 5;
        else if (Math.random() < 0.05 && (i % 2 == 0 || Math.random() < 0.2)) melody[i] = 7;
        else if (Math.random() < 0.05 && (i % 2 == 0 || Math.random() < 0.2)) melody[i] = -2;
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
        playSound(melodyObject, note + melodyOffFromG + key + 12 * melodyOctave, pianoVol, time + beat * 2 * subBeatEvery);
    }
}