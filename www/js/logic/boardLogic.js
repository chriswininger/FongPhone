var _filterOn = true;
FongPhone.Logic.BoardLogic = function (audCtx, opts) {
	// instantiate audio sources
	this.audCtx = audCtx;
	this.mainVol = audCtx.createGain();
	
	this.portamento = 0;
	this.filterPortamento = 0;
	this.delayVolume = 1;
	this.delayTime = .5;
	this.delayFeedback = .8;
	this.fongs = [];

	this.createNewFongs(0.9949676394462585,
		0.9949676394462585, 440, 1000
	);
	this.createNewFongs(0.9949676394462585,
		0.9949676394462585, 440, 1000
	);

	this.mainVol.connect(this.audCtx.destination);

	// defaults
	if (opts)
		this.updateBoard(opts);

	this.FilterOn = _filterOn;
};

var $class = FongPhone.Logic.BoardLogic.prototype;

$class.start = function () {
	for (var i = 0; i < this.fongs.length; i++) {
		this.fongs[i].start();
	}
};

$class.setMainVol = function (vol) {
	this.mainVol.gain.value = vol;
};

$class.setFilterStatus = function (b) {
	for (var i = 0; i < this.fongs.length; i++) {
		if (b) {
			this.fongs[i].turnFilterOn();
		} else {
			this.fongs[i].turnFilterOff();
		}
	}
	this.FilterOn = b;
	_filterOn = b;
};

$class.createNewFongs = function(osc1Freq, osc2Freq, osc1Vol, osc2Vol) {
	var fongPrimary = new fong(this.audCtx, this.mainVol, 0, 0, this);
	var fongSecondary = new fong(this.audCtx, this.mainVol, 0, 0, this);
	fongPrimary.secondary = fongSecondary;
	fongSecondary.primary = fongPrimary;

	this.fongs.push(fongPrimary);
	this.fongs.push(fongSecondary);

	fongPrimary.setOscFreq(osc1Freq);
	fongPrimary.setOscVol(osc1Vol);

	fongSecondary.setOscFreq(osc2Freq);
	fongSecondary.setOscVol(osc2Vol);

	this.setPrimaryOffsetFromFong(fongPrimary);
	this.setSecondaryOffsetFromFong(fongSecondary);

	//fongPrimary.start();
	//fongSecondary.start();

	// returns index of primary
	return (this.fongs.length - 2);
}

$class.setPrimaryOffsetFromFong = function (fong) {
	// update offsets
	var primaryOffset = map(fong.x, (fong.radius / 2), window.innerWidth - fong.radius, 0, this.primaryOffsetMax);
	if (primaryOffset < 0) primaryOffset = 0;

	fong.dur = parseInt(1000 / primaryOffset * 4) + "ms";
	if (fong.boardInput) {
		fong.boardInput.dur = fong.dur;
	}
	$(fong.animation).attr("dur", fong.dur);

	return this.setPrimaryOffset(fong.boardInput, primaryOffset);
}

$class.setPrimaryOffset = function (fong, value) {
	if (isNaN(value)) return;
	this.mainTimeOffset = value;
	fong.oscGainCtrl.frequency.value = value / 4;
	return value;
};

$class.setSecondaryOffsetFromFong = function (fong) {
	var offset = map(fong.x, (fong.radius / 2), window.innerWidth - fong.radius, 0, this.secondaryOffsetMax) * this.mainTimeOffset;
	fong.dur = parseInt(1000 / offset * 4) + "ms";
	if (fong.boardInput) {
		fong.boardInput.dur = fong.dur;
	}
	$(fong.animation).attr("dur", fong.dur);
	return this.setSecondaryOffset(fong.boardInput, offset);
}

$class.setSecondaryOffset = function (fong, value) {
	if (isNaN(value)) return;
	this.secondaryOffset = value;
	fong.oscGainCtrl.frequency.value = value / 4;
	return value;
};

$class.updateBoard = function (values) {
	for (var i = 0; i < this.fongs.length; i++) {
		if (this.fongs[i].fongRole === 'primary') {
			this.fongs[i].setOscVol(values.osc1Vol);
			this.fongs[i].setOscFreq(values.osc1Freq);
			this.setPrimaryOffset(this.fongs[i], values.primaryOffset);
		} else {
			this.fongs[i].setOscVol(values.osc2Vol);
			this.fongs[i].setOscFreq(values.osc2Freq);
			this.setSecondaryOffset(this.fongs[i], values.secondaryOffset);
		}
	}

	this.setMainVol(values.mainVol);


	this.osc1MaxFreq = values.osc1MaxFreq;
	this.osc2MaxFreq = values.osc2MaxFreq;
	this.primaryOffsetMax = values.primaryOffsetMax;
	this.secondaryOffsetMax = values.secondaryOffsetMax;
};

// --- private helper functions ---
function map(val, x1, x2, y1, y2) {
	return (val - x1) / (Math.abs(x2 - x1)) * Math.abs(y2 - y1) + y1;
}