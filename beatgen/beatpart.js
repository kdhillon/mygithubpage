// this represents a 4 bar phrase of all instruments.
// this is created by the 
function BeatPart() {

    // these functions will be in drumkit file
    this.drumsA = generateNewDrums();
    this.drumsB = mutateKit(this.drumsA);

    this.bassA = generateBass(this.drumsA._kick);

    this.scheduleFirstHalf = function() {
        scheduleKitPart(this.drumsA);
        scheduleBass(this.bassA);
    };

    this.scheduleSecondHalf = function() {
        scheduleKitPart(this.drumsB);
        scheduleBass(this.bassA);
    };
}