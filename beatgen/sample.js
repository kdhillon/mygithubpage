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

function playSound(object, semitones) {
    if (object.buffer == null) return;
    if (object.playing) {
        // console.log("stopping");
        object.s.stop();
        object.playing = false;
    }
    object.s = context.createBufferSource();
    object.s.buffer = object.buffer;
    object.s.detune.value = 100 * semitones;
    object.s.connect(context.destination);

    object.playing = true;
    // console.log("playing");
    object.s.start(0);
    // object.s.detune.value = 100 * 0;
}