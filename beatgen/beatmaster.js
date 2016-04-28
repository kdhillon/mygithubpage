
console.log("loaded master");
var tempo = 140;
var beatEvery = 60 / tempo;
var subBeatEvery = beatEvery / 4;

var stepCounter = 0;

var context = new AudioContext();

window.onload = init;

function init() {
	// start the beat
	initKit();
	initBass(currentBeatPart);
	update32();
}

function update32() {
	playBeat(stepCounter);
	playBass(stepCounter);
	
	stepCounter++;
	if (stepCounter >= 32) {
		stepCounter = 0;
		nextPart();	
	}
	
	setTimeout(update32, subBeatEvery * 1000); // msecs
}