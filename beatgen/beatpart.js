
var specialMuteHat;
var specialMuteKick;
var specialMuteSnare;

var playLongSynth;

var muteHarmonyOnB;

function initBeatPart() {
    specialMuteHat = Math.random() < 0.7;
    specialMuteKick = Math.random() < 0.95;
    specialMuteSnare = Math.random() < 0.95;

    playLongSynth = false;

    muteHarmonyOnB = Math.random() < 0.25;
    if (muteHarmonyOnB) console.log("Muting harmony on B section");

    console.log("mute hat: " + specialMuteHat + " snare: " + specialMuteSnare + " kick: " + specialMuteKick)
}

// var specialMuteBass = Math.random() < 0.5;
// console.log("mute bass: " + specialMuteBass);

// this represents a 4 bar phrase of all instruments.
// this is created by the 
function BeatPart(fresh) {
    if (!fresh) {
        this.drumsA = new KitPart();
        this.drumsB = new KitPart();
        this.bassA = getEmptyBass();
        this.bassB = getEmptyBass();
		this.melodyA = getNewMelody();
		this.melodyB = getNewMelody();
		this.harmonyA = getNewHarmony();
		this.harmonyB = getNewHarmony();

        this.longSynthA = generateLongSynth(this.bassA);
        this.longSynthB = generateLongSynth(this.bassB);
    }
    else {
        // these functions will be in drumkit file
        this.drumsA = generateNewDrums();
        this.drumsB = mutateKit(this.drumsA);

        this.bassA = generateBass(this.drumsA._kick);
        this.bassB = mutateBass(this.bassA, this.drumsB._kick);
		
		this.melodyA = generateMelody();
		// this.melodyB = mutateMelody(this.melodyA);
		this.melodyB = this.melodyA;
		this.harmonyA = generateHarmony(this.melodyA);

        if (Math.random() < 0.5) 
    		this.harmonyB = generateHarmony(this.melodyB);
        else 
            this.harmonyB = this.harmonyA;

        this.longSynthA = generateLongSynth(this.bassA);
        this.longSynthB = generateLongSynth(this.bassB);

        // todo make long synth based on BASS!
        if (this.melodyA[0] == 0) specialMuteHat = false;
    }

    this.schedule = function (firstHalf, muteDrums, muteMelody, muteBass, muteHarmony) {
        var drums, bass;
        if (firstHalf) {
            drums = this.drumsA;
            bass = this.bassA;
            // console.log(this.bassA);
            if (!muteMelody) {
			    scheduleMelody(this.melodyA);
                if (playLongSynth) scheduleLongSynth(this.longSynthA);
            }
			if (!muteHarmony) 
				scheduleHarmony(this.harmonyA);		
        }
        else {
            drums = this.drumsB;
            bass = this.bassB;
            // console.log(this.bassB);
            if (!muteMelody) {
			    scheduleMelody(this.melodyB);
                if (playLongSynth) scheduleLongSynth(this.longSynthB);
            }
			if (!muteHarmony && !muteHarmonyOnB) 
				scheduleHarmony(this.harmonyB);
        }
		
		if (!muteBass) {
	        scheduleBass(bass);
		}
		
        if (muteDrums) {
            // this needs to be consistent across both measures, these breaks should be globally set.
            scheduleKitPart(drums, specialMuteKick, specialMuteHat, specialMuteSnare);
        }
        else 
            scheduleKitPart(drums, false, false, false);
		
  };
}

function mutateBeatPart(beatPart) {
    var newBeatPart = new BeatPart(false);
    Object.assign(newBeatPart.drumsA, mutateKit(beatPart.drumsB));
    Object.assign(newBeatPart.drumsB, mutateKit(newBeatPart.drumsA));
    Object.assign(newBeatPart.bassA, mutateBass(beatPart.bassB, newBeatPart.drumsA._kick));
    Object.assign(newBeatPart.bassB, mutateBass(newBeatPart.bassA, newBeatPart.drumsB._kick));
	
	Object.assign(newBeatPart.melodyA, beatPart.melodyA);
	Object.assign(newBeatPart.melodyB, beatPart.melodyB);
	
	Object.assign(newBeatPart.harmonyA, beatPart.harmonyA);
	Object.assign(newBeatPart.harmonyB, beatPart.harmonyB);

    Object.assign(newBeatPart.longSynthA, beatPart.longSynthA);
    Object.assign(newBeatPart.longSynthB, beatPart.longSynthB);
	// Object.assign(newBeatPart.harmonyB, mutateMelody(beatPart.harmonyA, true));

    return newBeatPart;
}