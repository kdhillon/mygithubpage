
// todo divide into sections:
// intro (4-8 measures)
// A (8 measures) "chorus"
// B (4 measures verse + 4 measures alt verse)

var currentBeatPart;

var playAccentThisSong;

var playHeyThisSong;

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
	// this.introLength = 0;
	
	originalKey = key;
	// this.adjustedKey = (key - 5);
	// if (Math.random() < 0.5) 
	// I think this isn't correct for major keys...
	
	// this.adjustedKey = (key + 10);
	this.adjustedKey = (key + 2);
	// this.adjustedKey = (key + 5);
	// this.adjustedKey = (key + 8);
	this.changeKey = minor && Math.random() < 0.2;
	this.changeKey = true;

	// make sure intro length is multiple of 4 if change key is true
	if (Math.random() < 0.5 || this.changeKey == true) 
		this.introLength = 4;
	else if (Math.random() < 0.5) this.introLength = 2;
	else if (Math.random() < 0.5) this.introLength = 1;
	else this.introLength = 0;

	console.log("intro length: " + this.introLength)


    this.aSection = new BeatPart(true);
    this.bSection = mutateBeatPart(this.aSection)

	this.temporarilyMuteDrums = false;

	this.tempBass;
	this.tempKit; 
	this.tempMelody;
	this.tempHarmony;

	playAccentThisSong = Math.random() < 0.3;
	console.log("play accent: " + playAccentThisSong)	

	playHeyThisSong = Math.random() < 0.2;

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

			var section = Math.floor((measure - this.introLength) / 4) % loopLength;

			var muteKit = false;
			var muteBass = false;
			var muteMelody = false;
			var muteHarmony = false;
			if (kitFlow[section] == 0) muteKit = true;
			if (bassFlow[section] == 0) muteBass = true;
			if (melodyFlow[section] == 0) muteMelody = true;
			if (harmonyFlow[section] == 0) muteHarmony = true;

			if (sectionFlow[section] == 1) {
				currentSection = this.aSection;
			}
			else if (sectionFlow[section] == 2) {
				currentSection = this.bSection;
			}

			var base = measure - (this.introLength);
			
			// test out changing key after a few meaures
			// note we use measure (not base measure) on purpose,
			// since change key ensures intro length is 4.
			if (this.changeKey && measure != 0 && measure % 4 == 0) {
				if (key == originalKey) key = this.adjustedKey;
				else {
					key = originalKey;
				}
			}

			// console.log("section a: " + (currentSection == this.aSection) + " mute kit: " + muteKit + " bass: " + muteBass + " melody: " + muteMelody)
			if ((base + 1) % 8 == 0 && Math.random() < 0.3) {
				muteKit = true;
				muteBass = true;
				muteMelody = false;
				muteHarmony = true;
			}

			// add "temp drum mute"
			if (this.temporarilyMuteDrums) {
				// unmute if 2 measures after, or with random prob
				this.temporarilyMuteDrums = false;
				
				if (Math.random() < 0.2) {
					console.log("staying muted on: " + measure)
					muteKit = this.tempKit || muteKit;
					muteBass = this.tempBass || muteBass;
					muteMelody = this.tempMelody || muteMelody;
					muteHarmony = this.tempHarmony || muteHarmony;
				}
				// otherwise, stay muted for one more measure.
			}
			
			if (base % 4 == 0 && Math.random() < 0.1) {
				this.temporarilyMuteDrums = true;
				console.log("muting temporarily on: " + measure);
				muteKit = true;
				muteBass = Math.random() < 0.8 || muteBass;
				muteMelody = Math.random() < 0.3 || muteMelody;
				muteHarmony = Math.random() < 0.3 || muteHarmony;
				this.tempKit = muteKit;
				this.tempBass = muteBass;
				this.tempMelody = muteMelody;
				this.tempHarmony = muteHarmony;
			} 

			if (base % 2 == 0) {
				var playAccent = false;
				if (base % 8 == 0 && playAccentThisSong) {
					// console.log("playing accent: " + base)
					playAccent = true;
				}
				currentSection.schedule(true, muteKit, muteMelody, muteBass, muteHarmony, playAccent);
			}
			else {
				currentSection.schedule(false, muteKit, muteMelody, muteBass, muteHarmony);
			}
		}
	};
}