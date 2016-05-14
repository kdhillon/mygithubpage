function sample(url) {
    this.source = url;
    loadAudio(this, url);
}

function loadAudio(object, url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function () {
        context.decodeAudioData(request.response, function (buffer) {
            object.buffer = buffer;
        });
    }
    request.send();
}

function playSound(object, semitones, gain, time) {
    if (object.buffer == null) return;
    
    // if (object.playing) {
    //     object.s.stop();
    //     object.playing = false;
    // }
    object.s = context.createBufferSource();
    object.s.buffer = object.buffer;
    if (object.s.detune != null)
        object.s.detune.value = 100 * (semitones);
    object.s.connect(context.destination);
    
    if (gain != 0) {
        gainNode.gain.value = gain;
        object.s.connect(gainNode);
        gainNode.connect(context.destination);
    }

    object.s.start(time);
    // object.playing = true;
}


function getFileName(prefix, count) {
	var random = Math.ceil(Math.random() * count) + 1;
    console.log(prefix + ": " + random);
	return "http://kyledhillon.com/beatgen/server/" + prefix + "/" + random + ".WAV";
}