var fong = function (audCtx, mainVol) {

	this.audCtx = audCtx;

	this.waves = ['sine', 'square', 'triangle', 'sawtooth'];
	this.waveIntOsc = 0;

	this.oscTouchFadeVal = 0;

	this.oscPulseOn = true;

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
	this.filter.Q.value = 50;
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
		this.osc.frequency.value = freq;
	};

	this.setOscFilterFreq = function (freq) {
		this.filter.frequency.value = freq;
	};

	this.oscOff = function () {
		this.oscVol.disconnect(this.audCtx.destination);
	};

	this.oscOn = function () {
		this.oscVol.connect(this.audCtx.destination);
	};

	//not used yet
	this.setFade = function (val) {
		this.oscPanCtrl.setPosition(val, 0, 0);
	};

};