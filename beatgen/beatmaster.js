
var tempo = 140;
var beatEvery = 60 / tempo;
var subBeatEvery = beatEvery / 4;

var stepCounter = 0;
var measureCounter = 0;

var context = new AudioContext();
var gainNode = context.createGain();

window.onload = onLoad;


var isUnlocked = false;

function unlock() {
	if(this.unlocked)
		return;


	document.getElementById("b1").innerHTML = "creating initial sound";

	// create empty buffer and play it
	var buffer = context.createBuffer(1, 1, 22050);
	var source = context.createBufferSource();
	source.buffer = buffer;
	source.connect(context.destination);
	source.start ? source.start(0, 2, 1) : source.noteOn(0);	
	
	// by checking the play state after some time, we know if we're really unlocked
	setTimeout(function() {
		if((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
			isUnlocked = true;
			console.log("")
			document.getElementById("b1").innerHTML = "isUnlocked: " + isUnlocked;
			// init();
			initKit();
			initBass(currentBeatPart);
			setTimeout(update32, 1000);
		}
	}, 0);
}

function onLoad() {
	document.getElementById("b1").addEventListener('click', unlock);
}

function init() {
	// start the beat
	unlock();
	// initKit();
	// initBass(currentBeatPart);
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