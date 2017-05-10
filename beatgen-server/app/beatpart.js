
var specialMuteHat;
var specialMuteKick;
var specialMuteSnare;

var playLongSynth;

var muteHarmonyOnB;

var resolution;
var RES = 1;

const drumkit = require('./drumkit')
const bass = require('./bass')
const piano = require('./piano')

function initBeatPart() {
    specialMuteHat = Math.random() < 0.7;
    specialMuteKick = Math.random() < 0.95;
    specialMuteSnare = Math.random() < 0.95;

    playLongSynth = false;

    muteHarmonyOnB = Math.random() < 0.5;
    if (muteHarmonyOnB) console.log("Muting harmony on B section");

    console.log("mute hat: " + specialMuteHat + " snare: " + specialMuteSnare + " kick: " + specialMuteKick)
}
module.exports.initBeatPart = initBeatPart  


// var specialMuteBass = Math.random() < 0.5;
// console.log("mute bass: " + specialMuteBass);

// this represents a 4 bar phrase of all instruments.
// this is created by the 
function BeatPart(fresh) {
	resolution = RES;
	
    if (Math.random() < 0.2) resolution = RES * 2;
    else if (Math.random() < 0.2) resolution = RES * 4;

    console.log("resolution: " + resolution)
	
    if (!fresh) {
        this.drumsA = new drumkit.KitPart();
        this.drumsB = new drumkit.KitPart();
        this.bassA = bass.getEmptyBass();
        this.bassB = bass.getEmptyBass();
		this.melodyA = piano.getNewMelody();
		this.melodyB = piano.getNewMelody();
		this.harmonyA = piano.getNewHarmony();
		this.harmonyB = piano.getNewHarmony();

        this.longSynthA = piano.generateLongSynth(this.bassA);
        this.longSynthB = piano.generateLongSynth(this.bassB);
    }
    else {
        // these functions will be in drumkit file
        this.drumsA = drumkit.generateNewDrums();
        this.drumsB = drumkit.mutateKit(this.drumsA);

        this.bassA = bass.generateBass(this.drumsA._kick);
        this.bassB = bass.mutateBass(this.bassA, this.drumsB._kick);
		
		this.melodyA = piano.generateMelody();
		if (Math.random() < 0.2) {
            this.melodyB = piano.generateMelody(this.melodyA, resolution);
        }
		else this.melodyB = this.melodyA;
		this.harmonyA = piano.generateHarmony(this.melodyA);

        if (Math.random() < 0.5) 
    		this.harmonyB = piano.generateHarmony(this.melodyB);
        else 
            this.harmonyB = this.harmonyA;

        this.longSynthA = piano.generateLongSynth(this.bassA);
        this.longSynthB = piano.generateLongSynth(this.bassB);

        // todo make long synth based on BASS!
        if (this.melodyA[0] == 0) specialMuteHat = false;
    }

    this.schedule = function (firstHalf, muteDrums, muteMelody, muteBass, muteHarmony, playAccent, forceHiRes) {
        var drums, thisbass;
        if (firstHalf) {
            drums = this.drumsA;
            thisbass = this.bassA;
            // console.log(this.bassA);
            if (!muteMelody) {
                // TODO later fix schedule calls
			    piano.scheduleMelody(this.melodyA);
                if (playLongSynth) piano.scheduleLongSynth(this.longSynthA);
            }
			if (!muteHarmony) 
				piano.scheduleHarmony(this.harmonyA);		
        }
        else {
            drums = this.drumsB;
            thisbass = this.bassB;
            // console.log(this.bassB);
            if (!muteMelody) {
			    piano.scheduleMelody(this.melodyB);
                if (playLongSynth) piano.scheduleLongSynth(this.longSynthB);
            }
			if (!muteHarmony && !muteHarmonyOnB) 
				piano.scheduleHarmony(this.harmonyB);
        }
		
		if (!muteBass) {
	        bass.scheduleBass(thisbass);
		}
		
        if (muteDrums) {
            // this needs to be consistent across both measures, these breaks should be globally set.
            drumkit.scheduleKitPart(drums, specialMuteKick, specialMuteHat, specialMuteSnare, false, false);
        }
        else {
            drumkit.scheduleKitPart(drums, false, false, false, playAccent, forceHiRes);
        }
  };
}
module.exports.BeatPart = BeatPart  

function mutateBeatPart(beatPart) {
    var newBeatPart = new BeatPart(false);
    Object.assign(newBeatPart.drumsA, drumkit.mutateKit(beatPart.drumsB));
    Object.assign(newBeatPart.drumsB, drumkit.mutateKit(newBeatPart.drumsA));
    Object.assign(newBeatPart.bassA, bass.mutateBass(beatPart.bassB, newBeatPart.drumsA._kick));
    Object.assign(newBeatPart.bassB, bass.mutateBass(newBeatPart.bassA, newBeatPart.drumsB._kick));
	
	Object.assign(newBeatPart.melodyA, beatPart.melodyA);
	Object.assign(newBeatPart.melodyB, beatPart.melodyB);
	
	Object.assign(newBeatPart.harmonyA, beatPart.harmonyA);
	Object.assign(newBeatPart.harmonyB, beatPart.harmonyB);

    Object.assign(newBeatPart.longSynthA, beatPart.longSynthA);
    Object.assign(newBeatPart.longSynthB, beatPart.longSynthB);
	// Object.assign(newBeatPart.harmonyB, mutateMelody(beatPart.harmonyA, true));

    return newBeatPart;
}
module.exports.mutateBeatPart = mutateBeatPart  
