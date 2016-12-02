
// todo divide into sections:
// intro (4-8 measures)
// A (8 measures) "chorus"
// B (4 measures verse + 4 measures alt verse)

var currentBeatPart;

// 1-4 A
// 5-12 B
// 13-16 A
// 17-24 B

// generate a few length 8 arrays for each part
kitFlow = 		[1, 1, 1, 1, 1, 1, 1, 1] // let kitflow number determine "section" as well
melodyFlow = 	[1, 1, 1, 1, 1, 1, 1, 1]
harmonyFlow = 	[0, 0, 1, 1, 0, 0, 1, 1]
bassFlow = 		[1, 1, 1, 1, 1, 1, 1, 1]
sectionFlow = 	[1, 1, 1, 1, 2, 2, 2, 2]

// x % (A + B) gives you cu
function Song() {
	if (Math.random() < 0.5) 
		this.introLength = 4;
	else this.introLength = 2;
	console.log("intro length: " + this.introLength)
	// this.introLength = 0;

    this.aSection = new BeatPart(true);
    this.bSection = mutateBeatPart(this.aSection)

	
	// if (Math.random() < 0.3) {
	// 	kitFlow[0] = 0;
	// }

	var setup = Math.random();
	if (setup < 0.3) {
		bassFlow[0] = 0;
	}
	else if (setup < 0.6) {
		kitFlow[0] = 0;
	}


	// change melodyFlow
	if (Math.random() < 0.0) {
		melodyFlow[0] = 0;
	}
	else if (Math.random() < 0.2) {
		melodyFlow[kitFlow.length / 2] = 0;
		// melodyFlow[kitFlow.length / 2 + 1] = 0;
	}
	
	// // change kitflow
	if (Math.random() < 0.5) {
		kitFlow[kitFlow.length / 2] = 0;
	}
	if (kitFlow[0] == 1 && Math.random() < 0.3) {
		kitFlow[1] = 0;
	}
	// // change bassFlow
	// if (melodyFlow[0] != 0 && Math.random() < 0.5) {
	// 	bassFlow[2] = 0;
	// 	if (Math.random() < 0.3) {
	// 		bassFlow[1] = 0;
	// 	}
	// }
	// else if (melodyFlow[kitFlow.length / 2] != 0 && Math.random() < 0.5) {
	// 	bassFlow[kitFlow.length / 2] = 0;
	// }

	// change sectionflow
	if (Math.random() < 0.8) {
		sectionFlow = [1, 1, 2, 2, 1, 1, 2, 2];
	}

	console.log("sectionflow: " + sectionFlow)
	console.log("kitFlow:     " + kitFlow)
	console.log("melodyFlow:  " + melodyFlow)
	console.log("harmonyFlow: " + harmonyFlow)
	console.log("bassFlow:    " + bassFlow)
	
	console.log("bassA: \n" + this.aSection.bassA + "\n" + this.aSection.bassB);
	console.log("bassB: \n" + this.bSection.bassA + "\n" + this.bSection.bassB);

	// var loopLength = this.aLength + this.bLength;
	var loopLength = kitFlow.length;
    this.playMeasure = function(measure) {
		// play intro
		if (measure < this.introLength) {
			this.aSection.schedule(measure % 2 == 0, true, false, true, true);
		}
		else {
			var playHarmony = true;

			var baseMeasure = Math.floor((measure - this.introLength) / 4) % loopLength;

			var muteKit = false;
			var muteBass = false;
			var muteMelody = false;
			var muteHarmony = false;
			if (kitFlow[baseMeasure] == 0) muteKit = true;
			if (bassFlow[baseMeasure] == 0) muteBass = true;
			if (melodyFlow[baseMeasure] == 0) muteMelody = true;
			if (harmonyFlow[baseMeasure] == 0) muteHarmony = true;

			if (sectionFlow[baseMeasure] == 1) {
				currentSection = this.aSection;
			}
			else if (sectionFlow[baseMeasure] == 2) {
				currentSection = this.bSection;
			}

			// console.log("section a: " + (currentSection == this.aSection) + " mute kit: " + muteKit + " bass: " + muteBass + " melody: " + muteMelody)
			if ((measure - this.introLength + 1) % 8 == 0 && Math.random() < 0.3) {
				muteKit = true;
				muteBass = true;
				muteMelody = false;
				muteHarmony = true;
			}

			if (measure % 2 == 0) {
				currentSection.schedule(true, muteKit, muteMelody, muteBass, muteHarmony);
			}
			else {
				currentSection.schedule(false, muteKit, muteMelody, muteBass, muteHarmony);
			}
		}
	};
}