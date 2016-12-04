var reader = new FileReader();

var offlineMode = true;

var loaded = true;

function sample(url) {
    this.source = url;
    loadAudio(this, url);
}

// Doesn't work
function loadLocalAudio(object, localFileName) {
    var file = document.getElementById('file').files[0];
    var buffer = reader.readAsArrayBuffer(file);
    context.decodeAudioData(request.response, function (buffer) {
        object.buffer = buffer;
        object.gainNode = context.createGain();
    })
}

function loadAudio(object, url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

	// we have to make sure to wait for this before anything starts... 
    request.onload = function () {
        context.decodeAudioData(request.response, function (buffer) {
            object.buffer = buffer;
            object.gainNode = context.createGain();
            if (buffersLoaded() && song == null) {
                initSong();
            }
        });
    }
    request.send();
}

function playSound(object, semitones, gain, time) {
    if (object.buffer == null) {
        console.log(("buffer is null"));
        return;
    }

    semitones -= 1;

    // if (object.playing) {
    //     object.s.stop();
    //     object.playing = false;
    // }
    object.s = context.createBufferSource();
    object.s.buffer = object.buffer;
    
    // note: detune parameter is new and only supported by chrome
    if (object.s.detune != null)
        object.s.detune.value = 100 * (semitones);
    object.s.connect(context.destination);
    
    // if (gain != 0) {
        object.gainNode.gain.value = gain;
        object.s.connect(object.gainNode);
        object.gainNode.connect(context.destination);
    // }

    object.s.start(time);
    // object.playing = true;
}

function stopSound(object, time) {
    if (object.s == null) return;

    object.s.stop(time);
    // object.s.
}


function getFileName(prefix, count) {
    var count = count;
	var random = Math.ceil(Math.random() * count);
    // console.log(prefix + ": " + random);
    if (offlineMode) 
	    return "http://127.0.0.1:8887/" + prefix + "/" + random + ".WAV";
	return "http://kyledhillon.com/beatgen/server/" + prefix + "/" + random + ".WAV";
}