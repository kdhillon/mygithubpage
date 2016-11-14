
// todo divide into sections:
// intro (4-8 measures)
// A (8 measures) "chorus"
// B (4 measures verse + 4 measures alt verse)

var currentBeatPart;


function Song() {
    this.aLength = 4;
    this.aSection = new BeatPart();

    this.bLength = 4;
    // this.bSection = mutateBeatPart(aSection);
    // initialize song
    currentBeatPart = new BeatPart()

    this.playMeasure = function(measure) {

        console.log("playing measure");
          if (measure % 2 == 0) {
            if ((measure + 2) % 8 == 0) {
                currentBeatPart.schedule(true, true);
                console.log("scheduling 1 special");
            }
            else {
                currentBeatPart.schedule(true, false);
                console.log("scheduling 1");
            }
        }
        else {
            if ((measure + 1) % 8 == 0) {
                currentBeatPart.schedule(false, true);
                console.log("scheduling 2 special");
            }
            else {
                currentBeatPart.schedule(false, false);
                console.log("scheduling 2");
            }
        }
    };
}