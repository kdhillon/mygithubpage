var tempoMin = 120;
var tempoMax = 150;

var tempo;
var beatEvery;
var measureEvery;
var subBeatEvery;

var shuffleMode = false;

var stepCounter = 32;
var measureCounter;

var context;

var startTime;
var time;

var song;

try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
}
  
// window.addEventListener ? 
// window.addEventListener("load",onLoad,false) : 
// window.attachEvent && window.attachEvent("onload",onLoad);

var isUnlocked = false;

function querySt(ji) {
    hu = window.location.search.substring(1);
    gy = hu.split("&");

    for (i=0;i<gy.length;i++) {
        ft = gy[i].split("=");
        if (ft[0] == ji) {
            return ft[1];
        }
    }
}

function onShuffle() {
	shuffleMode = true;
	onTouch();
}

var seed;
function onTouch() {
	if (isUnlocked) {
		console.log("Already unlocked");
		return;
	}

	// clear these so we can do new songs
	song = null;
 	time = 0;
	startTime = 0;
	measureCounter = 0;

	document.getElementById("start").textContent = "Loading...";
	document.getElementById("start").disabled = true;
	document.getElementById("shuffle").disabled = true;
	document.getElementById("seedinput").readOnly = true;

	var element = document.getElementById("seedinput");

	if (element.value == null || element.value == "") {
		seed = Math.floor(Math.random() * 10000); 
		element.value = "" + seed;
		// must be made into a string.
		seed = seed + "";
	}
	else if (seed == null || seed == "") {
		seed = element.value;
		seed = seed.toLowerCase();
	}
		
	console.log("Seed: " + seed);
	Math.seedrandom(seed);
	
	tempo = Math.floor(Math.random() * (tempoMax - tempoMin) + tempoMin);
	// tempo = 500;
	console.log("Tempo: " + tempo);
	beatEvery = 60 / tempo;
	measureEvery = beatEvery * 4;
	subBeatEvery = beatEvery / 4;
	
	initKit();
	initBass();
	initPiano();
	initBeatPart();
}

function initSong() {
	song = new Song();

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
			document.getElementById("start").textContent = "Playing!"
		}
	}, 0);
}

function buffersLoaded() {
	if (melodyObject == null || melodyObject.buffer == null) {
		// console.log("melody null")
		return false;
	}
	if (harmonyObject == null || harmonyObject.buffer == null) {
		// console.log("harmony null")
		return false;
	}
	if (bassObject == null || bassObject.buffer == null) {
		// console.log("bass null")
		return false;
	}
	if (hatObject == null || hatObject.buffer == null) {
		console.log("hat null")
		return false;
	}
	if (kickObject == null || kickObject.buffer == null) {
		console.log("kick null")
		return false;
	}
	if (snareObject == null || snareObject.buffer == null) {
		console.log("snare null")
		return false;
	}
	return true;
}

function unlock() {
	isUnlocked = true;
	startTime = context.currentTime;
	time = startTime;
	
	setTimeout(updateMeasure, 0);
		// document.getElementById("text").innerText = "&nbsp;";
	// document.getElementById("img").src = "img/1.jpg";
}

function onLoad() {
	// document.getElementById("b1").addEventListener('click', unlock);
	// document.getElementById("text").addEventListener('click', onTouch);
	// document.getElementById("img").addEventListener('click', onTouch);
}

var measuresToLoad = 16;
var currentMeasureLoaded = 16;
function updateMeasure() {
	if (measureCounter == 18) {
		if (shuffleMode) {
			isUnlocked = false;
			document.getElementById("seedinput").value = null;
			currentMeasureLoaded = 16;
			
			setTimeout(onTouch, 5000);
			return;
		}
	}

	if (measureCounter > currentMeasureLoaded) {
		setTimeout(updateMeasure, 1000 * measuresToLoad * measureEvery * 2 - 8000);
		currentMeasureLoaded += measuresToLoad;
		return;
	}
	time = startTime + measureCounter * measureEvery * 2;

	// if (measureCounter > 0) nextPart();	
	console.log("measure: " + measureCounter);
	song.playMeasure(measureCounter);

	// setTimeout(updateMeasure, 60/144 * 8  * 1000 - margin);
	setTimeout(updateMeasure, 100);

	measureCounter += 1;
}
