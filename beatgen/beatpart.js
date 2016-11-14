
var specialMuteHat = Math.random() < 0.5;
var specialMuteKick = Math.random() < 0.5;
var specialMuteSnare = Math.random() < 0.5;
console.log("mute hat: " + specialMuteHat + " snare: " + specialMuteSnare + " kick: " + specialMuteKick)

// this represents a 4 bar phrase of all instruments.
// this is created by the 
function BeatPart() {
    // these functions will be in drumkit file
    this.drumsA = generateNewDrums();
    this.drumsB = mutateKit(this.drumsA);

    this.bassA = generateBass(this.drumsA._kick);
    this.bassB = mutateBass(this.bassA);

    this.schedule = function(firstHalf, changeUp) {
        var drums, bass;
        if (firstHalf) {
            drums = this.drumsA;
            bass = this.bassA;
            console.log(this.bassA);
        }
        else {
            drums = this.drumsB;
            bass = this.bassB;
            console.log(this.bassB);
        }
        scheduleBass(bass);
        if (changeUp && Math.random() < 1) {
            // this needs to be consistent across both measures, these breaks should be globally set.
            scheduleKitPart(drums, specialMuteKick, specialMuteHat, specialMuteSnare);
        }
        else 
            scheduleKitPart(drums, false, false, false);
  };
}