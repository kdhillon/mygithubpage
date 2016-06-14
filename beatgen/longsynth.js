
var longSynth = [0, 0, 0, 0];

function initLongSynth() {
    mutateLS();
    scheduleLS();
}

function mutateLS() {
    longSynth[0] = 1;
    for (var i = 1; i < longSynth.length; i++) {
        longSynth[i] = getWeightedNote();
    }
}

function scheduleLS() {
	for (var j = 0; j < longSynth.length; j++) {
		playLS(j);
	}
}

function playLS(beat) {
    var note = longSynth[beat];
    if (note != 0) {
        playSound(longSynthObject, note, 0, time + beat * 8 * subBeatEvery)
    }
}