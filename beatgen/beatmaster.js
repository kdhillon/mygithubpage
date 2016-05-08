var tempoMin = 135;
var tempoMax = 155;

var tempo = Math.floor(Math.random() * (tempoMax - tempoMin) + tempoMin);
console.log("Tempo: " + tempo);
var beatEvery = 60 / tempo;
var subBeatEvery = beatEvery / 4;

var stepCounter = 0;
var measureCounter = 0;

var context;

try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }
  
var gainNode = context.createGain();

window.addEventListener ? 
window.addEventListener("load",onLoad,false) : 
window.attachEvent && window.attachEvent("onload",onLoad);

var isUnlocked = false;

function unlock() {
	if (isUnlocked) {
		console.log("Already unlocked");
		return;
	}

	// create empty buffer and play it
	var buffer = context.createBuffer(1, 1, 22050);
	var source = context.createBufferSource();
	source.buffer = buffer;
	source.connect(context.destination);
	source.start ? source.start(0) : source.noteOn(0);	
	
	// by checking the play state after some time, we know if we're really unlocked
	setTimeout(function() {
		if((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
			isUnlocked = true;
			initKit();
			initBass(currentBeatPart);
			setTimeout(update32, 1000);
			document.body.style.backgroundColor = "green"
			document.getElementById("text").textContent = "PLAYING";
		}
	}, 0);
}

function onLoad() {
	// document.getElementById("b1").addEventListener('click', unlock);
	document.getElementById("text").addEventListener('click', unlock);
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