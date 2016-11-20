
// todo divide into sections:
// intro (4-8 measures)
// A (8 measures) "chorus"
// B (4 measures verse + 4 measures alt verse)

var currentBeatPart;

// 1-4 A
// 5-12 B
// 13-16 A
// 17-24 B

// x % (A + B) gives you cu
function Song() {
	if (Math.random() < 0.5) 
		this.introLength = 4;
	else this.introLength = 2;
    this.aLength = 4;
    this.aSection = new BeatPart(true);
    this.bSection = mutateBeatPart(this.aSection)

    this.bLength = 8;
	
	var loopLength = this.aLength + this.bLength;
	
	// this.dirtyMelody = generateMelody();

    this.playMeasure = function(measure) {
		// play intro
		if (measure < this.introLength) {
			// console.log("playing intro");
			this.aSection.schedule(measure % 2 == 0, true);
		}
		else {
			// var playHarmony = false;
			// if (measure >= this.introLength + 4)
				var playHarmony = true;
			
		var baseMeasure = (measure - this.introLength) % loopLength;
		var currentSection = this.aSection;
		var selectionLength = this.aLength;
		var elapsedParts = 0;
		// section A
		if (baseMeasure >= this.aLength) {
            // console.log("scheduling b");
			currentSection = this.bSection;
			selectionLength = this.bLength;
			elapsedParts = this.aLength;
		}
		
        if (baseMeasure % 2 == 0) {
        	currentSection.schedule(true, false, playHarmony);
        }
        else {
            if ((baseMeasure + 1 - elapsedParts) % selectionLength == 0) {
				// console.log("special");
                currentSection.schedule(false, true, playHarmony);
            }
            else {
                currentSection.schedule(false, false, playHarmony);
            }
        }
		
		// scheduleMelody(this.dirtyMelody, false)
		// this.dirtyMelody = mutateMelody(this.dirtyMelody, false);
	}
    };
}