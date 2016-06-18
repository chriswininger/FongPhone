function fong(audCtx, mainVol, x, y, board) {
	var self = this;
	this.board = board;
	this.audCtx = audCtx;
	this.mainVol = mainVol;
	this.x = x;
	this.y = y;
	var panIsAtEndOfAudioChain = false;

	this.noteMapChanged = new signals.Signal();
	this.NoteMapInfo = new FongPhone.Logic.NoteMapInfo({
		SelectedScale: 'ionian',
		baseNote: 'a',
		octave: 4,
		availableNotes: [],
		NoteMapOn: false,
		FilterNoteMapOn: false,
		LoopDuration: 15000,
		loopChunkinessFactor: .5,
		pullChunkiness: .5
	});
	this.NoteMapInfo.changed.add(function () {
		// fire a note map changed event when changes occur
		self.noteMapChanged.dispatch(this);
	});

	this.waves = ['sine', 'square', 'triangle', 'sawtooth'];
	this.waveIntOsc = 0;

	this.oscTouchFadeVal = 0;

	this.oscPulseOn = true;

	this.radius = 60;

	this.osc = audCtx.createOscillator();
	this.osc.type = 'sine';

	this.oscs = [];
	this.oscsCount = 0;
	this.oscsIncrement = 2;

	for (var i = 0; i < this.oscsCount; i++) {
		this.oscs[i] = audCtx.createOscillator();
		this.oscs[i].type = 'sine';
	}

	this.oscPanCtrl = audCtx.createPanner();
	this.oscVol = audCtx.createGain();
	this.oscVolOffset = audCtx.createGain();
	this.oscGainCtrl = audCtx.createOscillator();
	this.feedback = audCtx.createGain();
	this.filter = audCtx.createBiquadFilter();
	this.delayGain = audCtx.createGain();
	this.chainOutputGain = audCtx.createGain();
	this.delayGain.gain.value = this.board.delayVolume;


	this.oscVolOffset.gain.value = 1.0;
	this.oscGainCtrl.type = 'square';
	this.filter.type = 'lowpass'; // In this case it's a lowshelf filter
	this.filter.frequency.value = 200;
	this.filter.Q.value = 0;
	this.filter.gain.value = 1;
	this.delay = audCtx.createDelay(10);
	this.delay.delayTime.value = this.board.delayTime;
	this.feedback.gain.value = this.board.delayFeedback;

	this.oscGainCtrl.connect(this.oscVol.gain);
	this.osc.connect(this.filter);

	// connect extra oscillators if they exist
	for (var i = 0; i < this.oscsCount; i++) {
		this.oscs[i].connect(this.filter);
	}

	this.filter.connect(this.oscVol);
	this.oscVol.connect(this.oscVolOffset);
	
	this.delay.connect(this.delayGain);
	this.delayGain.connect(this.feedback);
	this.feedback.connect(this.delay);
	
	this.oscVolOffset.connect(this.oscPanCtrl);
	
	if (panIsAtEndOfAudioChain) {		
		this.oscVolOffset.connect(this.delay);
		this.delay.connect(this.oscPanCtrl);
	} else {
		this.oscPanCtrl.connect(this.delay);
		//this.delay.connect(mainVol);
		this.delay.connect(this.chainOutputGain);
	}	
	
	this.oscPanCtrl.connect(this.chainOutputGain);
	this.chainOutputGain.connect(mainVol);

	this.chainOutputGain.gain.value = 0;

	// TODO (CAW) This should only happen once
	mainVol.connect(audCtx.destination);

	this.start = function () {
		this.osc.start(0);
		this.oscGainCtrl.start(0);

		for (var i = 0; i < this.oscsCount; i++) {
			this.oscs[i].start();
		}
	};

	this.setOscType = function (type) {
		this.osc.type = type;
	};

	this.incrementOscillator = function () {
		this.waveIntOsc++;
		if (this.waveIntOsc >= this.waves.length) this.waveIntOsc = 0;
		this.setOscType(this.waves[this.waveIntOsc]);
	};

	this.stopOscPulse = function () {
		this.oscGainCtrl.disconnect(this.oscVol.gain);
		this.oscPulseOn = false;
	};

	this.startOscPulse = function () {
		this.oscGainCtrl.connect(this.oscVol.gain);
		this.oscPulseOn = true;
	};

	this.toggleOscPulse = function () {
		if (this.oscPulseOn) this.stopOscPulse();
		else this.startOscPulse();
	};

	this.setOscVol = function (vol) {
		vol = vol / 3;
		vol = Math.min(.33, vol);
		this.oscVol.gain = vol;
		this.oscVolOffset.gain.value = vol;
	};

	this.setChainOutputVol = function(vol) {
		this.chainOutputGain.gain.value = vol;
	};

	this.transitionToFadeOutput = function() {
		this.chainOutputGain.gain.linearRampToValueAtTime(0, this.audCtx.currentTime);
	}

	this.setOscFreq = function (freq) {
		if (isNaN(freq)) return;
		if (freq < 0) return;
		this.oscFreq = freq;
		if (this.board.portamento > 0) {
			var dur = this.board.portamento / 1000.0;
			if (freq > 0) {
				this.osc.frequency.exponentialRampToValueAtTime(freq, this.audCtx.currentTime + dur);
			}

			for (var i = 0; i < this.oscsCount; i++) {
				if (freq * (i + 1 * this.oscsIncrement) > 0) {
					this.oscs[i].frequency.exponentialRampToValueAtTime(freq * (i + 1 * this.oscsIncrement), this.audCtx.currentTime + dur);
				}
			}
		} else {
			this.osc.frequency.value = freq;
			for (var i = 0; i < this.oscsCount; i++) {
				this.oscs[i].frequency.value = freq * (i + 1 * this.oscsIncrement);
			}
		}
	};

	this.setOscFilterFreq = function (freq) {
		if (isNaN(freq)) return;

		if (freq < 0) return;
		if (this.board.filterPortamento > 0 && freq > 0) {
			this.filter.frequency.exponentialRampToValueAtTime(freq, this.audCtx.currentTime + this.board.filterPortamento / 1000.0);
		} else {
			this.filter.frequency.value = freq;
		}
	};

	this.setOscFilterResonance = function (q) {
		this.filter.Q.value = q;
	};

	this.oscOff = function () {
		this.oscVol.disconnect(this.audCtx.destination);
	};

	this.oscOn = function () {
		this.oscVol.connect(this.audCtx.destination);
	};

	this.turnFilterOn = function () {
		try {
			this.osc.disconnect(this.oscVol);
			this.osc.connect(this.filter);
		} catch (ex) {
			if (ex.code === 15) return; // not off
			console.error(ex);
		}
	};

	this.turnFilterOff = function () {
		try {
			this.osc.disconnect(this.filter);
			this.osc.connect(this.oscVol);
		} catch (ex) {
			if (ex.code === 15) return; // not on
			console.error(ex);
		}
	};

	this.setDelayVolume = function (val) {
		this.delayGain.gain.value = val;
	};

	this.setDelayTime = function (val) {
		this.delay.delayTime.value = val;
	};

	this.setDelayFeedback = function (val) {
		this.feedback.gain.value = val;
	};

	this.setFade = function (x, y, z) {
		this.oscPanCtrl.setPosition(x, y, z);
	};

	this.setFilterType = function (type) {
		this.filter.type = type;
	};
}

FongPhone.Utils.Mixins.ToJSON.applyMixin(fong.prototype, [
	'audCtx',
	'board',
	'delay',
	'delayGain',
	'feedback',
	'filter',
	'mainVol',
	'osc',
	'oscGainCtrl',
	'oscPanCtrl',
	'oscVol',
	'oscVolOffset',
	'noteMapChanged',
	'oscs'
]);
