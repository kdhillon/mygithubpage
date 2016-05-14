var melodyOffsetFromG
var melodyOffFromG = 2; // A.

var melodyObject = new sample(getFileName("piano"), 1);

var melody = [1,0,0,0,   0,0,0,0,   0,0,0,0,  0,0,0,0]

var melodyOctave = 0;

function initMelody() {
    for (var i = 0; i < melody.length; i++) {
        melody[i] = 0;
        if (Math.random() < 0.2 && (i % 2 == 0 || Math.random() < 0.5)) melody[i] = 1
        if (Math.random() < 0.1 && (i % 2 == 0 || Math.random() < 0.5)) melody[i] = 3;
        if (Math.random() < 0.15 && (i % 2 == 0 || Math.random() < 0.5)) melody[i] = 5;
        if (Math.random() < 0.1 && (i % 2 == 0 || Math.random() < 0.5)) melody[i] = 7;
        if (Math.random() < 0.1 && (i % 2 == 0 || Math.random() < 0.5)) melody[i] = -2;
    }
}

// move to different file eventually
function scheduleMelody() {
      for (var i = 0; i < bars; i++) {
		for (var j = 0; j < piano.length; j++) {
			if (bass[j] != 0) {
				playPiano(j + i * piano.length);
			}
		}
    }
}


function playBass(beat) {
    // if (muteKick) return;

    var note = melody[beat % piano.length];
    if (note != 0) {
        console.log("piano: " + melody);
        playSound(bassObject, note + melodyOffFromG + key + 12 * melodyOctave, 1, time + beat * 2 * subBeatEvery);
    }
}