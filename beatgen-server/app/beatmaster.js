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

var thisSong;

var length32seconds;

var measuresToLoad = 32;

const seedrandom = require('./seedrandom')
const song = require('./song')
const drumkit = require('./drumkit')
const piano = require('./piano')
const bass = require('./bass')
const beatpart = require('./beatpart')
const scheduler = require('./scheduler')
var key = bass.key;

// var isUnlocked = false;

// We set the seed on load so the field is prepopulated
function onLoad() {
	setSeed();
}
module.exports.onLoad = onLoad  

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
    seed = "Song " + Math.floor(Math.random() * 10000); 
	// must be made into a string.
    seed = seed + "";
		
	console.log("Seed: " + seed);
	seedrandom(seed, { global: true });
}

// When user clicks start button
function generateSong() {
	// clear these so we can do new songs
	thisSong = null;
 	time = 0;
	startTime = 0;
	measureCounter = 0;
	scheduler.resetMasterList()

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
				
	drumkit.initKit();
	bass.initBass();
	piano.initPiano();
	beatpart.initBeatPart();

	// When all sounds are loaded, calls initSong();
	return initSong();
}
module.exports.generateSong = generateSong  

function initSong() {
	console.log("initializing song()")
	thisSong = new song.Song();
	// startTime = context.currentTime;
	startTime = Date.now();
	time = startTime;
	
	for (measure = 0; measure < measuresToLoad; measure++) {
		updateMeasure(measure);
	}

	return scheduler.getMasterList();
}

function getTime() {
	return time;
}
module.exports.getTime = getTime  
function getSubBeatEvery() {
	return subBeatEvery;
}
module.exports.getSubBeatEvery = getSubBeatEvery  

function updateMeasure(measureCounter) {
	time = startTime + measureCounter * measureEvery * 2;	
	thisSong.playMeasure(measureCounter);

	measureCounter += 1;
}

function startPlaying() {
	scheduler.playSong();

	// also schedule the next song to be played if in shuffle mode
	if (shuffleMode) {
		// estimate of time it takes to render the next track
		var bufferToRender = (measuresToLoad * 100);
		breakBetween = 1000;
		setTimeout(restartWithNewSong, measureEvery * 1000 * (measuresToLoad * 2) + breakBetween)
	}

	return;
}