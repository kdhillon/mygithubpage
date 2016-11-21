
var specialMuteHat = Math.random() < 0.95;
var specialMuteKick = Math.random() < 0.95;
var specialMuteSnare = Math.random() < 0.95;


console.log("mute hat: " + specialMuteHat + " snare: " + specialMuteSnare + " kick: " + specialMuteKick)

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
		// this.harmonyB = getNewHarmony();
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
		this.harmonyA = generateHarmony();
		// this.harmonyB = mutateMelody(this.harmonyA, true);
        if (this.melodyA[0] == 0) specialMuteHat = false;
    }

    this.schedule = function (firstHalf, muteDrums, muteMelody, muteBass, muteHarmony) {
        var drums, bass;
        if (firstHalf) {
            drums = this.drumsA;
            bass = this.bassA;
            // console.log(this.bassA);
            if (!muteMelody)
			    scheduleMelody(this.melodyA, false);
			
			if (!muteHarmony) 
				scheduleHarmony(this.melodyA, this.harmonyA, true);		
        }
        else {
            drums = this.drumsB;
            bass = this.bassB;
            // console.log(this.bassB);
            if (!muteMelody)
			    scheduleMelody(this.melodyB, false);
			
			// if (!muteHarmony) 
			// 	scheduleHarmony(this.melodyB, this.harmonyA, true);
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
	// Object.assign(newBeatPart.harmonyB, mutateMelody(beatPart.harmonyA, true));

    return newBeatPart;
}