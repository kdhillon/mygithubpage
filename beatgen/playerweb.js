// resposible for playing a full master list on a browser
// works in chrome (on desktop and android)

// "implements" interface
// loadAudio() which loads the audio map
// playMasterList() which plays the song.

var STOP_GAIN = -99;

var reader = new FileReader();

var offlineMode = false;

var loaded = true;

var soundsToLoad = 0;

// Maps one object to each channel
var objectMap = new Map();

try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
}

function sample(url) {
    this.source = url;
    loadAudio(this, url);
}

function loadAllSounds() {
    objectMap.set(SoundType.BASS, getObjectForFolder("bass", 2));

    objectMap.set(SoundType.HAT_1, getObjectForFolder("hat", 3));
    objectMap.set(SoundType.HAT_2, getObjectForFolder("hat", 3));
    objectMap.set(SoundType.HAT_OPEN, getObjectForFolder("open hat", 1));
    objectMap.set(SoundType.SNARE, getObjectForFolder("snare", 4));
    objectMap.set(SoundType.SNARE_2, getObjectForFolder("snare", 1));
    objectMap.set(SoundType.KICK, getObjectForFolder("kick", 1));
    objectMap.set(SoundType.CLAP, getObjectForFolder("clap", 1));
    objectMap.set(SoundType.HEY, getObjectForFolder("hey", 1));
    objectMap.set(SoundType.ACCENT, getObjectForFolder("accent", 1));

    objectMap.set(SoundType.MELODY, getObjectForFolder("piano", 4));
    objectMap.set(SoundType.HARMONY, getObjectForFolder("piano", 4));
    objectMap.set(SoundType.SOLO, getObjectForFolder("piano", 1));
    objectMap.set(SoundType.SYNTH, getObjectForFolder("long synth", 3));

    console.log("waiting on sounds to load");
}

function getObjectForFolder(folder, total) {
    return new sample(getFileName(folder, total));
}

function loadAudio(object, url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

	// we have to make sure to wait for this before anything starts... 
    request.onload = function () {
        context.decodeAudioData(request.response, function (buffer) {
            object.buffer = buffer;
            object.gainNode = offlineContext.createGain();
            // TODO do a check here to make sure everything in objectMap has a buffer
		    soundsToLoad--;
            console.log("sound loaded. " + soundsToLoad + " left");
			if (soundsToLoad == 0) {
				console.log("ready to continue.")
				initSong()
			}
        });
    }
    request.send();
	soundsToLoad++;
	console.log("sounds to load: " + soundsToLoad)
}

function playMasterList(masterList) {
    console.log("playing master list of size " + masterList.length)
    for (var i = 0; i < masterList.length; i++) {
        var sound = masterList[i];
        var sampleType = sound[0];
        var semitones = sound[1];
        var gain = sound[2];
        var time = sound[3];

        var object = objectMap.get(sampleType);

        if (object == null || object.buffer == null) console.log(sampleType + "  is null")

        if (gain == STOP_GAIN) {
            stopSound(object, time);
        } else {
            playSoundHere(object, semitones, gain, time);
        }
    }

	offlineContext.startRendering().then(function (renderedBuffer) {
		console.log('Rendering completed successfully');
		var object = objectMap.get(SoundType.BASS)

		document.getElementById("start").textContent = "Playing!"
    	var source = context.createBufferSource();
		source.buffer = renderedBuffer;
		source.connect(context.destination);
		if (!shuffleMode) source.loop = true;
		source.start(0);
	})

}

function playSoundHere(object, semitones, gain, time) {
    if (object == null) {
        // console.log("object is null")
        return;
    }
    if (object.buffer == null) {
        // console.log(("buffer is null"));
        return;
    }
    semitones -= 1;

    // if (object.playing) {
    //     object.s.stop();
    //     object.playing = false;
    // }
    object.s = offlineContext.createBufferSource();
    object.s.buffer = object.buffer;
    
    // note: detune parameter is new and only supported by chrome
    if (object.s.detune != null) {
        object.s.detune.value = 100 * (semitones);
    }
	if (object == objectMap.get(SoundType.ACCENT)) {
		object.s.playbackRate.value = tempo / 130
		object.s.detune.value = 0;
		console.log("playback rate: " + object.s.playbackRate.value)
	}
	
    object.s.connect(offlineContext.destination);
    
    // if (gain != 0) {
        object.gainNode.gain.value = gain;
        object.s.connect(object.gainNode);
        object.gainNode.connect(offlineContext.destination);
    // }

    // write to buffer
    
    object.s.start(time);
    // object.playing = true;
}

function stopSound(object, time) {
    if (object == null) return;
    if (object.s == null) return;

    object.s.stop(time);
    // object.s.
}

function getFileName(prefix, count) {
    var count = count;
	var random = Math.ceil(Math.random() * count);
    
    console.log(prefix + ": " + random);
    if (offlineMode) 
	    return "http://127.0.0.1:8886/" + prefix + "/" + random + ".WAV";
	return "http://kyledhillon.com/beatgen/server/" + prefix + "/" + random + ".WAV";
}