// This creates an array containing all sounds to be played this song. This will be a big array of arrays of ints.
// These do not map 1:1 with files, but rather to "channels". I.e. the same file can be used for multiple channels. 
SoundType = {
    BASS : "bass",

    HAT_1 : "hat1",
    HAT_2 : "hat2",
    HAT_OPEN : "openhat",
    SNARE: "snare",
    SNARE_2: "snare",
    KICK: "kick",
    CLAP: "clap",
    HEY: "hey",
    ACCENT: "accent",

    MELODY: "melody",
    HARMONY: "harmony",
    SOLO: "solo",
    SYNTH: "synth",
}

var masterList = [];

function scheduleStop(sampleType, time) {
  // send a signal to stop the note (STOP_GAIN is the stop signal)
   masterList.push([sampleType, 0, STOP_GAIN, time]);
}

function scheduleSound(sampleType, semitones, gain, time) {
    if (sampleType == null) throw "Bad sampletype"
   masterList.push([sampleType, semitones, gain, time]);
}

function playSong() {
    playMasterList(masterList);
}