var fong = function (audCtx, mainVol, x, y, board) {

	this.board = board;

	this.audCtx = audCtx;
	this.mainVol = mainVol;
	this.x = x;
	this.y = y;

	this.scale = 'ionian';
	this.SelectedScale = this.scale;
	this.baseNote = 'a';
	this.octave = 4;
	this.availableNotes = [];
	
	this.NoteMapOn = false;
	this.FilterNoteMapOn = false;

	this.waves = ['sine', 'square', 'triangle', 'sawtooth'];
	this.waveIntOsc = 0;

	this.oscTouchFadeVal = 0;

	this.oscPulseOn = true;

	this.radius = 60;

	this.osc = audCtx.createOscillator();
	this.osc.type = 'sine';
	this.oscPanCtrl = audCtx.createPanner();
	this.oscVol = audCtx.createGain();
	this.oscVolOffset = audCtx.createGain();

	this.oscVolOffset.gain.value = 1.0;

	this.oscGainCtrl = audCtx.createOscillator();

	this.oscGainCtrl.type = 'square';

	this.oscGainCtrl.connect(this.oscVol.gain);

	this.filter = audCtx.createBiquadFilter();

	this.filter.type = 'lowpass'; // In this case it's a lowshelf filter
	this.filter.frequency.value = 200;
	this.filter.Q.value = 0;
	this.filter.gain.value = 1;

	this.osc.connect(this.filter);
	this.filter.connect(this.oscVol);
	this.oscVol.connect(this.oscVolOffset);
	this.oscVolOffset.connect(this.oscPanCtrl);

	this.delay = audCtx.createDelay();
	this.delay.delayTime.value = this.board.delayTime;

	this.feedback = audCtx.createGain();
	this.feedback.gain.value = this.board.delayFeedback;

	this.delayGain = audCtx.createGain();
	this.delayGain.gain.value = this.board.delayVolume;

	this.delay.connect(this.delayGain);
	this.delayGain.connect(this.feedback);
	this.feedback.connect(this.delay);

	this.oscPanCtrl.connect(this.delay);

	this.oscPanCtrl.connect(mainVol);
	this.delay.connect(mainVol);

	mainVol.connect(audCtx.destination);

	this.start = function () {
		this.osc.start(0);
		this.oscGainCtrl.start(0);
	}

	this.setOscType = function (type) {
		this.osc.type = type;
	};

	this.incrementOscillator = function () {
		this.waveIntOsc++;
		if (this.waveIntOsc >= this.waves.length) this.waveIntOsc = 0;
		this.setOscType(this.waves[this.waveIntOsc]);
	}

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
	}

	this.setOscVol = function (vol) {
		vol = vol / 3;
		this.oscVol.gain = vol;
		this.oscVolOffset.gain.value = vol;
	};

	this.setOscFreq = function (freq) {
		if (freq < 0) return;
		this.oscFreq = freq;
		if (this.board.portamento > 0) {
			var dur = this.board.portamento / 1000.0;
			this.osc.frequency.exponentialRampToValueAtTime(freq, this.audCtx.currentTime + dur);
		} else {
			this.osc.frequency.value = freq;
		}
	};

	this.setOscFilterFreq = function (freq) {
		if (freq < 0) return;
		if (this.board.filterPortamento > 0) {
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
			this.osc.disconnect(this.oscPanCtrl);
			this.osc.connect(this.filter);
		} catch (ex) {
			if (ex.code === 15) return; // not off
			console.error(ex);
		}
	}

	this.turnFilterOff = function () {
		try {
			this.osc.disconnect(this.filter);
			this.osc.connect(this.oscPanCtrl);
		} catch (ex) {
			if (ex.code === 15) return; // not on
			console.error(ex);
		}
	}

	this.setDelayVolume = function (val) {
		this.delayGain.gain.value = val;
	}

	this.setDelayTime = function (val) {
		this.delay.delayTime.value = val;
	}

	this.setDelayFeedback = function (val) {
		this.feedback.gain.value = val;
	}

	this.setFade = function (val) {
		this.oscPanCtrl.setPosition(val, 0, 0);
	};

	this.setFilterType = function (type) {
		this.filter.type = type;
	}

	this.toJSON = function () {
		return {
			oscPulseOn: this.oscPulseOn,
			oscFreq: this.oscFreq
		};
	};

};