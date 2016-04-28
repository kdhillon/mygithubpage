
var tempo = 140;
var beatEvery = 60 / tempo;
var subBeatEvery = beatEvery / 4;

var stepCounter = 0;
var measureCounter = 0;

var context = new AudioContext();
var gainNode = context.createGain();

window.onload = init;

function init() {
	// start the beat
	initKit();
	initBass(currentBeatPart);
	setTimeout(function(){ update32(); }, 1000);
}

function update32() {
	playBeat(stepCounter);
	playBass(stepCounter);
	
	stepCounter++;
	if (stepCounter >= 32) {
		stepCounter = 0;
		nextPart();	
		measureCounter++;
		console.log("measure: " + measureCounter);
	}
	
	setTimeout(update32, subBeatEvery * 1000); // msecs
}