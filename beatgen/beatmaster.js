
var tempo = 140;
var beatEvery = 60 / tempo;
var subBeatEvery = beatEvery / 4;

var stepCounter = 0;
var measureCounter = 0;

var context = new AudioContext();
var gainNode = context.createGain();

window.onload = init;

var isUnlocked = false;

function unlock() {
	if(this.unlocked)
		return;

	// create empty buffer and play it
	var buffer = context.createBuffer(1, 1, 22050);
	var source = context.createBufferSource();
	source.buffer = buffer;
	source.connect(context.destination);
	source.start(0);

	// by checking the play state after some time, we know if we're really unlocked
	setTimeout(function() {
		if((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
			isUnlocked = true;
			console.log("isUnlocked: " + isUnlocked);
		}
	}, 0);
	
	update32();
}


function init() {
	// start the beat
	initKit();
	initBass(currentBeatPart);
	// setTimeout(function(){ ; }, 1000);
	document.getElementById("b1").addEventListener('click', unlock);
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