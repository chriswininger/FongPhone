var fong = function (audCtx, mainVol, x, y, board) {

	this.board = board;

	this.audCtx = audCtx;
	this.mainVol = mainVol;
	this.x = x;
	this.y = y;

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
	this.oscPanCtrl.connect(mainVol);

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
		this.oscVol = vol;
		this.oscVolOffset.gain.value = vol;
	};

	this.setOscFreq = function (freq) {
		this.oscFreq = freq;
		if (this.board.portamento > 0) {
			var dur = this.board.portamento / 1000.0;
			this.osc.frequency.exponentialRampToValueAtTime(freq, this.audCtx.currentTime + dur);
		} else {
			this.osc.frequency.value = freq;
		}
	};

	this.setOscFilterFreq = function (freq) {
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
		} catch (err) {
			alert(err.message);
		}
	}

	this.turnFilterOff = function () {
		try {
			this.osc.disconnect(this.filter);
			this.osc.connect(this.oscPanCtrl);
		} catch (err) {
			alert(err.message);
		}
	}

	this.setFade = function (val) {
		this.oscPanCtrl.setPosition(val, 0, 0);
	};

	this.setFilterType = function (type) {
		this.filter.type = type;
	}

};