
var bassChoice = "SubBass02.wav";

var bassObject = new sample('http://kyledhillon.com/beatgen/server/' + bassChoice);
// var bassObject2 = new sample('http://kyledhillon.com/beatgen/server/SubBass01.wav');

// semitone 0 for subbass is F
var semitoneOffset = 100;
var bassVol = -0.5;

// 0 is F
var key = Math.floor(Math.random() * 12);
console.log("Key: " + getNoteName(key));

// sub bass hits everytime the kick hits
function initBass(beatPart) {
    bass = [];
    for (var i = 0; i < kickRes; i++) {
        bass[i] = beatPart._kick[i];
        if (i > 0 && bass[i] == 1) {
            if (Math.random() < 0.5) bass[i] = 5;
            else if (Math.random() < 0.3) bass[i] = 3;
        }
    }
}

function getNoteName(semitonesFromF) {
    if (semitonesFromF == 0) return "F";
    if (semitonesFromF == 1) return "F#";
    if (semitonesFromF == 2) return "G";
    if (semitonesFromF == 3) return "G#";
    if (semitonesFromF == 4) return "A";
    if (semitonesFromF == 5) return "A#";
    if (semitonesFromF == 6) return "B";
    if (semitonesFromF == 7) return "C";
    if (semitonesFromF == 8) return "C#";
    if (semitonesFromF == 9) return "D";
    if (semitonesFromF == 10) return "D#";
    if (semitonesFromF == 11) return "E";
}

// mutate based on new kick
function mutateBass(beatPart) {
     for (var i = 0; i < kickRes; i++) {
        if (beatPart._kick[i] != 0 && bass[i] == 0) {
            bass[i] = 1;
            if (Math.random() < 0.4) bass[i] = 5;
            else if (Math.random() < 0.4) bass[i] = 3;
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
            playSound(bassObject, note + key, bassVol);
            // playSound(bassObject2, note + 12, bassVol);
         }
    }
}