var tempoMin = 120;
var tempoMax = 150;

var tempo;
var beatEvery;
var measureEvery;
var subBeatEvery;

var shuffleMode = false;

var stepCounter = 32;
var measureCounter;

var startTime;
var time;

var song;

var length32seconds;

var measuresToLoad = 32;

window.addEventListener ? 
window.addEventListener("load",onLoad,false) : 
window.attachEvent && window.attachEvent("onload",onLoad);

// var isUnlocked = false;

// We set the seed on load so the field is prepopulated
function onLoad() {
	setSeed();
}

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

var seed;
function setSeed() {
	var element = document.getElementById("seedinput");
	if (element.value == null || element.value == "") {
		seed = "Song " + Math.floor(Math.random() * 10000); 
		element.value = seed;
		// must be made into a string.
		seed = seed + "";
	}
	else {
		console.log("seed already set to: " + element.value)
		seed = element.value;
	}
		
	console.log("Seed: " + seed);
	Math.seedrandom(seed);
}

// When user clicks start button
function startPressed() {
	if (document.getElementById('shuffle').checked) {
		shuffleMode = true;
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

	setSeed();
	
	tempo = Math.floor(Math.random() * (tempoMax - tempoMin) + tempoMin);
	// tempo = 500;
	console.log("Tempo: " + tempo);
	beatEvery = 60 / tempo;
	measureEvery = beatEvery * 4;
	subBeatEvery = beatEvery / 4;

	length32seconds = measureEvery * 2 * measuresToLoad;
	// Length in seconds 
	console.log("length 32 seconds " + length32seconds);

	var extraTime = 0;
	if (shuffleMode) {
		extraTime = 1;
	}
	offlineContext = new OfflineAudioContext(2,44100*(length32seconds + extraTime), 44100);
				
	initKit();
	initBass();
	initPiano();
	initBeatPart();

	// When all sounds are loaded, calls initSong();
	loadAllSounds();
}

function initSong() {
	console.log("initializing song()")
	song = new Song();
	startTime = context.currentTime;
	time = startTime;
	
	for (measure = 0; measure < measuresToLoad; measure++) {
		updateMeasure(measure);
	}

	startPlaying();
}

function updateMeasure(measureCounter) {
	time = startTime + measureCounter * measureEvery * 2;
	console.log("measure: " + measureCounter);
	song.playMeasure(measureCounter);

	measureCounter += 1;
}

function startPlaying() {
	playSong();

	// also schedule the next song to be played if in shuffle mode
	if (shuffleMode) {
		// estimate of time it takes to render the next track
		var bufferToRender = (measuresToLoad * 100);
		breakBetween = 1000;
		setTimeout(restartWithNewSong, measureEvery * 1000 * (measuresToLoad * 2) + breakBetween)
	}

	return;
}

function restartWithNewSong() {
	masterList = []
	context.close()
    context = new AudioContext();
	offlineContext = new OfflineAudioContext(2,44100*length32seconds,44100);
	// offlineContext.close();

	// isUnlocked = false;
	document.getElementById("seedinput").value = null;
	startPressed();
}