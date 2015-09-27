var fong = function (audCtx, mainVol) {

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

};