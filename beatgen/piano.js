// var melodyOffFromG = -1; // definitely -1 for some reason? C?
var melodyOctave = -1;
var harmonyOctave;

var melodyVol = -.2;
var harmonyVol = -.2;

var majorScale = [1, 3, 5, 6, 8, 10, 12, 13];
var minorScale = [1, 3, 4, 6, 8, 9, 11, 13];
var scaleProb = [0.3, 0.05, 0.15, 0.05, 0.15, 0.05, 0.05, 0.2];

var pentatonic = [1, 3, 5, 8, 10, 13];
var pentatonicProb = [0.2, 0.15, 0.15, 0.15, 0.15, 0.2]

var extMajorScale = [1, 3, 5, 6, 8, 10, 12, 13, 15, 17, 18, 20];
var extMinorScale = [1, 3, 4, 6, 8, 9, 11, 13, 15, 16, 18, 20];
var extScaleProb = [0.1, 0.05, 0.15, 0.05, 0.15, 0.05, 0.05, 0.2, 0.05, 0.05, 0.05, 0.05];

var majorChord = [1, 5, 8, 13];
var minorChord = [1, 4, 8, 13];
var chordProb = [0.25, 0.25, 0.25, 0.25];

var currentNotes = pentatonic;
var currentProb = pentatonicProb;

// Last played note in solo
var zayNote = 0;
var zayMomentum = -1;

var harmonyChordLevel = 0; // 0 is no chord, 1 is 5th, 2 is 3rd, 3 is 5th & 3rd
// var harmonyChordLevel = 1; // 1 is 

var RES = 1;

var melodyObject;
var harmonyObject;
var soloObject;
var longHarmonyObject;
var cutOffPiano;

var pianoResolution;
var pianoComplexity;

var melodyChordLevel = 0;

function initPiano() {
    // harmonyChordLevel = Math.floor(Math.random() * 4);
    console.log("HarmonyChordLevel: " + harmonyChordLevel)

    // todo make this useful for picking samples. ie, make this based 
    // on number of notes, and don't let a long syth play if it's a lot of notes.
    // between 0 and 1
    pianoComplexity = Math.random();
	// roll w disadvantage :)
	pianoComplexity = Math.min(pianoComplexity, Math.random());
    // boost if high to fill every note
    if (pianoComplexity > 0.8) pianoComplexity = 1;
    if (pianoComplexity < 0.2) pianoComplexity = 0.2;
    console.log("Piano complexity: " + pianoComplexity)

    if (pianoComplexity == 0.2) {
        // melodyChordLevel = Math.floor(Math.random() * 4);
        console.log("melody chord level: " + melodyChordLevel)
    }

    pianoResolution = 2;
    if (Math.random() < 0.5) pianoResolution = 4;
    else if (Math.random() < 0.5) pianoResolution = 8;

    if (pianoComplexity < 0.25 && pianoResolution >= 4 && Math.random() < 0.6) {
        melodyObject = new sample(getFileName("long synth", 3));
        cutOffPiano = true;
    }
    else {
        melodyObject = new sample(getFileName("piano", 4));
        cutOffPiano = false;
    }
	
    soloObject = new sample(getFileName("piano", 1));
	
    console.log("cut off piano: " + cutOffPiano)

	harmonyObject = new sample(getFileName("piano", 4));
    longHarmonyObject = new sample(getFileName("long synth", 1));

	// var melodyObject1 = new sample(getFileName("piano", 1));
	// var melodyObject2 = new sample(getFileName("piano", 1));

	// if (Math.random() < 0.3) melodyOctave = 0;
	// if (Math.random() < 0.4) melodyOctave = -2;
	// else if (Math.random() < 0.3) melodyOctave = 1;

	// melodyOctave = ;
	console.log("octave: " + melodyOctave);

	// var harmonyOctave = melodyOctave + 2;
	// if (Math.random() < 0.5) {
    harmonyOctave = melodyOctave;
	// }
	if (harmonyOctave == 2) harmonyOctave = 1;
	// harmonyOctave = 1;

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
	
	if (minor) {
        currentNotes = minorScale;
    } 
    else {
        currentNotes = majorScale;
    }

	if (currentNotes == minorScale || currentNotes == extMinorScale || currentNotes == minorChord) {
	    console.log("Key: " + getNoteName(key) + " minor");
	}
	else if (currentNotes == majorScale || currentNotes == majorScale || currentNotes == extMajorScale) {
	    console.log("Key: " + getNoteName(key) + " major");
	}
	else if (currentNotes == pentatonic) {
	     console.log("Key: " + getNoteName(key) + " pentatonic");
	}
    else {
	     console.log("Key: " + getNoteName(key));        
    }

}

function getNewMelody() {
	return [0,0,0,0,0,0,0,0,   0,0,0,0,0,0,0,0];
}

function getNewHarmony() {
	return [0,0,0,0,0,0,0,0,   0,0,0,0,0,0,0,0];
}

function generateMelody() {
	var melody = getNewMelody();
	return mutateMelody(melody, resolution);
}

// function generateHarmony() {
// 	var harmony = getNewHarmony();
// 	return melody(harmony, true);
// }

function getHarmonyNote(melodyNote) {
    if (melodyNote == 0) return getWeightedNote(-1);
    // var note;
    // if (melodyNote != 0) {
    //     note = melodyNote + 5 - 12;
    // }
    // if (note <= 0) note -= 1;
    // prevents 13 + 3 problem, which are dissonant (1, 3);
    if (melodyNote == 13) melodyNote = 1;

    var melodyIndex = getIndexOf(melodyNote);
    if (melodyIndex == -1) return;

    // prevent harmony note from being adjacent to melody note.
    var note;
    var harmonyIndex = melodyIndex + 1;
    while (harmonyIndex == melodyIndex - 1 || harmonyIndex == melodyIndex + 1) {
        note = getWeightedNote(-1);
        harmonyIndex = getIndexOf(note);
    }

    return note;
}

function getWeightedNote(previous) {
    // if (harmony) {
    //     rand = Math.random();
    //     if (rand < 0.3) return 1;
    //     if (rand < 0.3) return 13;
    //     if (rand < 0.6) return 8;
    //     return 20;
    // }

	// if (Math.random() < 0.5) {
	// 	var note = 0;
	// 	if (Math.random() < 0.5) note = currentNotes[(previous + 1) % currentNotes.length];
	// 	else note = currentNotes[(previous - 1) % currentNotes.length];		
	// 	if (note == null) {
            
    //        return note;
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

function generateLongSynth(bass) {
    var long = [0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0]

    var resolution = 8;

     for (var i = 0; i < long.length; i += resolution) {
        var note;
        // go back to see what bass note is playing
        for (var j = i; j >= 0; j--) {
            if (bass[j] != 0) {
                note = bass[j];
                if (Math.random() < 0.5) note = getFifthOf(note);
                while (note != 1 && note == long[(i - resolution) % long.length]) {
                    note = getWeightedNote(i - resolution);
                }  
                break;
            }
        }
        if (note == null) {
            note = getWeightedNote(i - resolution);
            while (note != 1 && note == long[(i - resolution) % long.length]) {
                note = getWeightedNote(i - resolution);
            }
        }
        long[i] = note;
    }
    console.log("synth: " + long)
    return long;
}

function generateHarmony(melody) {
    var harmony = getNewHarmony();
	// var resolution = 8;
   
    // harmony[0] = 1;
    // if (Math.random() < 0.5) melody[0] = 13;
	
    for (var i = 0; i < harmony.length; i += pianoResolution) {
        // proportional to melody complexity
    if (Math.random() < 1 - (0.25 + pianoComplexity / 2)) continue;
    //    var note = getWeightedNote(i - resolution, true);
       var note = getHarmonyNote(melody[i]);
       harmony[i] = note;        
    }

//    melody[0] = 1;
//     should we duplicate the second half?
    // if (Math.random() < 0.5) {
    //     for (var i = melody.length / 2; i < melody.length; i++) {
    //         melody[i] = melody[i - melody.length / 2];
    //     }
    // }
    // else if (resolution >= 2 && Math.random() < 0.2) {
    //     // clear the second half...
    //     for (var i = melody.length / 2; i < melody.length; i++) {
    //         melody[i] = 0;
    //     }
    // }
    // for (var i = 0; i < melody.length; i += 2) {
    //     if (melody[i] == 0 && Math.random() < 0.5) melody[i] = 1;
    //     else if (melody[i] > 1 && Math.random() < 0.2) melody[i] = 0;
    // }
    // if (melody[melody.length - 4] == 1 && Math.random() < 0.5) {
    //     melody[melody.length - 2] = 2;
    //     if (Math.random() < 0.5) melody[melody.length - 2] = 3;
    // }
    console.log("harmony: " + harmony);
  

    // document.getElementById("text").textContent = melody;
	return harmony;
}

function countNotes(input) {
	var count = 0;
	for (var i = 0; i < input.length; i++) {
		if (input[i] != 0) {
			count++;
		}
	}
	// console.log("notes:/ " + count);
	return count;
}

// todo prevent there from being just a single note 
function mutateMelody(input, resolution) {
	var melody = input.slice(0);
	
    melody[0] = 13;
    if (Math.random() < 0.3) melody[0] = 1;
	
	do {
		console.log("resolution: " + resolution);
    for (var i = resolution; i < melody.length; i += resolution) {
        if ((melody[i] != 0) && Math.random() < 1 - pianoComplexity) continue;
        else if (melody[i] == 0 && Math.random() < 1 - pianoComplexity) continue;
        // if (Math.random() < 0.2) {
        //     melody[i] = 0;
        //     break;
        // }
		
        var note = getWeightedNote(i - resolution, false);
        while (melody[i-resolution] == note) {
            note = getWeightedNote(i - resolution, false);
        }
        if (note == 0) return;
        melody[i] = note;        
    }
	// console.log(melody);
	} while (countNotes(melody) <= 1);

//    melody[0] = 1;
//     should we duplicate the second half?
    if ((Math.random() < 0.3 && resolution < 4) ||  true) {
        for (var i = melody.length / 2; i < melody.length; i++) {
			if (Math.random() < 0.6)
            	melody[i] = melody[i - melody.length / 2];
        }
    }
    // else if (resolution >= 2 && Math.random() < 0.2) {
    //     // clear the second half...
    //     for (var i = melody.length / 2; i < melody.length; i++) {
    //         melody[i] = 0;
    //     }
    // }
    // for (var i = 0; i < melody.length; i += 2) {
    //     if (melody[i] == 0 && Math.random() < 0.5) melody[i] = 1;
    //     else if (melody[i] > 1 && Math.random() < 0.2) melody[i] = 0;
    // }
    // if (melody[melody.length - 4] == 1 && Math.random() < 0.5) {
    //     melody[melody.length - 2] = 2;
    //     if (Math.random() < 0.5) melody[melody.length - 2] = 3;
    // }
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
			playSolo(j + i * melody.length);
		}
    }
}

function scheduleHarmony(harmony) {
      for (var i = 0; i < measures; i++) {
		for (var j = 0; j < harmony.length; j++) {
            if (harmony[j] != 0) {
			    playHarmony(harmony, j + i * harmony.length);
            }
		}
    }
}

function scheduleLongSynth(harmony) {
      for (var i = 0; i < measures; i++) {
		for (var j = 0; j < harmony.length; j++) {
            if (harmony[j] != 0) {
			    playLongHarmony(harmony, j + i * harmony.length);
            }
		}
    }
}

function playSolo(beat) {
 if (isZayMode()) {
	 // Play extra note
	 if (Math.random() < 0.2) {
		 playSoloNote(beat - subBeatEvery * 4);
 	 } else if (Math.random() < 0.2) {
		 // playSoloNote(beat - subBeatEvery * 2); 
 	 }
	playSoloNote(beat);
 }
}

function playSoloNote(beat) {
 if ((zayNote == 0 || zayNote == 12) && Math.random() < 0.5) return;
 if (Math.random() < scaleProb[zayNote] * 2 + .4) {
    playSound(soloObject, currentNotes[zayNote] + key + 12 + 12 * melodyOctave, melodyVol, time + beat * 2 * subBeatEvery);
 }
if (Math.random() < 0.2) {
 zayMomentum = zayMomentum * -1;
}
if (zayNote == 0 && zayMomentum < 0) {
	zayMomentum = 1;
}
 // Drunken walk the solo
zayNote += zayMomentum;
zayNote = zayNote % currentNotes.length;
}

function playMelody(melody, beat) {
    var note = melody[beat % melody.length];
    if (note != 0) {
        if (cutOffPiano) {
           stopSound(melodyObject, time + beat * 2 * subBeatEvery - 0.001);
        }
        playSound(melodyObject, note + key + 12 * melodyOctave, melodyVol, time + beat * 2 * subBeatEvery);
        // if (Math.random() < 0.5) playSound(melodyObject, note - 1 - melodyOffFromG + key + 12 * melodyOctave + 12, harmonyVol, time + beat * 2 * subBeatEvery);   
        // if (Math.random() < 0.5) playSound(melodyObject, note - 1 - melodyOffFromG + key + 12 * melodyOctave + 6, harmonyVol, time + beat * 2 * subBeatEvery);   
        if (melodyChordLevel == 1 || melodyChordLevel == 3) {
            playSound(melodyObject, getFifthOf(note) + key + 12 * melodyOctave, melodyVol, time + beat * 2 * subBeatEvery);
        }
        if (melodyChordLevel == 2 || melodyChordLevel == 3) {
          playSound(melodyObject, getThirdOf(note) + key + 12 * melodyOctave, melodyVol, time + beat * 2 * subBeatEvery);
        }
     }
}

function getIndexOf(note) {
    var index = -1;
    for (var i = 0; i < currentNotes.length; i++) {
        if (currentNotes[i] == note) {
            index = i;
            break;
        }
    }
    return index;
}

function getFifthOf(note) {
    var noteIndex = getIndexOf(note);
    if (noteIndex < 0) return;
    return currentNotes[(noteIndex + 4) % currentNotes.length];
}

function getThirdOf(note) {
    var noteIndex = getIndexOf(note);
    if (noteIndex < 0) return;
    return currentNotes[(noteIndex + 2) % currentNotes.length];
}

function playHarmony(harmony, beat) {

    // return;

    var note = harmony[beat % harmony.length];
    // if (note == 25) {
    //     note = 12 + 8;
    // }
    if (note != 0) {
         stopSound(harmonyObject, time + beat * 2 * subBeatEvery - 0.001);

        playSound(harmonyObject, note + key + 12 * melodyOctave + 12, harmonyVol, time + beat * 2 * subBeatEvery);
        // Play the 5th too.
        if (harmonyChordLevel == 1 || harmonyChordLevel == 3) {
            var fifth = getFifthOf(note);
            if (fifth != null)
                playSound(harmonyObject, fifth + key + 12 * melodyOctave + 12, harmonyVol, time + beat * 2 * subBeatEvery);
         }
         if (harmonyChordLevel == 2 || harmonyChordLevel == 3) {
             var third = getThirdOf(note);
             if (third != null) 
                playSound(harmonyObject, third+ key + 12 * melodyOctave + 12, harmonyVol, time + beat * 2 * subBeatEvery);
         }
       
        // playSound(melodyObject, note - 1 - melodyOffFromG + key + 12 * harmonyOctave + 7, harmonyVol, time + beat * 2 * subBeatEvery);
      }
}

function playLongHarmony(harmony, beat) {
    var note = harmony[beat % harmony.length] + 12;
    if (note != 0) {
        stopSound(longHarmonyObject, time + beat * 2 * subBeatEvery - 0.001);

        playSound(longHarmonyObject, note + key + 12 * melodyOctave + 12, harmonyVol, time + beat * 2 * subBeatEvery);
        // playSound(melodyObject, note - 1 - melodyOffFromG + key + 12 * harmonyOctave + 7, harmonyVol, time + beat * 2 * subBeatEvery);
      }
}