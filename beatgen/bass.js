var bassObject = new sample('http://kyledhillon.com/beatgen/server/SubBass01.wav');

var semitoneOffset = 100;

// sub bass hits everytime the kick hits
function initBass(beatPart) {
    bass = [];
    for (var i = 0; i < kickRes; i++) {
        bass[i] = beatPart._kick[i];
        if (i > 0 && bass[i] == 1) {
            if (Math.random() < 0.4) bass[i] = 5;
            else if (Math.random() < 0.3) bass[i] = 3;
        }
    }
}

// mutate based on new kick
function mutateBass(beatPart) {
     for (var i = 0; i < kickRes; i++) {
        if (beatPart._kick[i] != 0 && bass[i] == 0) {
            bass[i] = 1;
            if (Math.random() < 0.4) bass[i] = 5;
            else if (Math.random() < 0.3) bass[i] = 3;
        }
        else if (beatPart._kick[i] == 0 && bass[i] != 0) {
           bass[i] = 0;
        }
    }
    console.log(bass);
}

function playBass(beat) {
    if (beat % 2 == 0) {
        var index = beat / 2;
        var note = bass[index];
        if (note > 0) {
            playSound(bassObject, note);
        }
    }
}