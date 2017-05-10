// This creates an array containing all sounds to be played this song. This will be a big array of arrays of ints.
// These do not map 1:1 with files, but rather to "channels". I.e. the same file can be used for multiple channels. 
SoundType = {
    BASS : "bass",

    HAT_1 : "hat1",
    HAT_2 : "hat2",
    HAT_OPEN : "openhat",
    SNARE: "snare",
    KICK: "kick",
    CLAP: "clap",
    HEY: "hey",
    ACCENT: "accent",

    MELODY: "melody",
    HARMONY: "harmony",
    SOLO: "solo",
    SYNTH: "synth",
}
module.exports.SoundType = SoundType  
var STOP_GAIN = -99;
var masterList = [];
function resetMasterList() {
    masterList = []
}
module.exports.resetMasterList = resetMasterList 

function scheduleStop(sampleType, time) {
  // send a signal to stop the note (STOP_GAIN is the stop signal)
   masterList.push([sampleType, 0, STOP_GAIN, time]);
}
module.exports.scheduleStop = scheduleStop 

function scheduleSound(sampleType, semitones, gain, time) {
    if (sampleType == null) throw "Bad sampletype"
   masterList.push([sampleType, semitones, gain, time]);
}
module.exports.scheduleSound = scheduleSound  

function playSong() {
    playMasterList(masterList);
}
module.exports.playSong = playSong  

function getMasterList() {
    return masterList;
}
module.exports.getMasterList = getMasterList  

function playMasterList(masterList) {
    console.log(masterList)
}