var tempoMin = 125;
var tempoMax = 150;

var tempo = Math.floor(Math.random() * (tempoMax - tempoMin) + tempoMin);
console.log("Tempo: " + tempo);
var beatEvery = 60 / tempo;
var measureEvery = beatEvery * 4;
var subBeatEvery = beatEvery / 4;

var stepCounter = 32;
var measureCounter = 0;

var context;

var startTime = 0;
var time = 0;

var song = new Song();

try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }
  
window.addEventListener ? 
window.addEventListener("load",onLoad,false) : 
window.attachEvent && window.attachEvent("onload",onLoad);

var isUnlocked = false;

function onTouch() {
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
			unlock();
		}			

	}, 0);
}

function unlock() {
	isUnlocked = true;
	startTime = context.currentTime;
	time = startTime;
	
	setTimeout(updateMeasure, 0);
		// document.getElementById("text").innerText = "&nbsp;";
	document.getElementById("img").src = "img/1.jpg";
}

function onLoad() {
	// document.getElementById("b1").addEventListener('click', unlock);
	document.getElementById("text").addEventListener('click', onTouch);
	document.getElementById("img").addEventListener('click', onTouch);
}

function updateMeasure() {
	time = startTime + measureCounter * measureEvery * 2;

	// if (measureCounter > 0) nextPart();	
	console.log("measure: " + measureCounter);
	song.playMeasure(measureCounter);

	var margin = 100;
	setTimeout(updateMeasure, 60/144 * 8  * 1000 - margin);
	measureCounter += 1;
}
