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

	this.fong1 = new fong(audCtx, this.mainVol, 0, 0, this);
	this.fong2 = new fong(audCtx, this.mainVol, 0, 0, this);

	this.fongs.push(this.fong1);
	this.fongs.push(this.fong2);

	this.mainVol.connect(this.audCtx.destination);

	// defaults
	if (opts)
		this.updateBoard(opts);

	this.setPrimaryOffsetFromFong(this.fong1);
	this.setSecondaryOffsetFromFong(this.fong2);

	this.FilterOn = _filterOn;
};

var $class = FongPhone.Logic.BoardLogic.prototype;

var mainInterval;
$class.start = function () {
	this.fong1.start();
	this.fong2.start();
	//mainInterval = setInterval(_.bind(this.primaryLoop, this), this.mainTimeOffset);
	window.requestAnimationFrame(FongPhone.render);
};

var timeOutCnt = 0;
var loopRunning = false;
//var len = 100;

// TODO (Inactive Code) -- Delete
$class.primaryLoop = function () {
	//if (loopRunning) return;
	loopRunning = true;
	var len = this.mainTimeOffset > 100 ? 100 : Math.floor(this.mainTimeOffset / 1.75);
	var pulses = [{
		osc: this.fong.osc1,
		gain: this.fong1.oscVol.gain,
		len: len,
		currVol: this.fong1.oscVol
	}];
	if (timeOutCnt >= this.secondaryOffset) {
		pulses.push({
			osc: this.fong2.osc,
			gain: this.fong2.oscVol.gain,
			len: len,
			currVol: this.fong2.oscVol
		});
		timeOutCnt = 0;
	} else {
		timeOutCnt++;
	}

	async.each(pulses, _pulse, function () {
		loopRunning = false;
	});

	// --- private functions ---
	function _pulse(opts, complete) {
		//opts.osc.stop();
		//opts.osc.start(opts.len);
		opts.gain.value = 0;
		setTimeout(function () {
			opts.gain.value = opts.currVol;
			complete();
		}, opts.len);
	}
};

$class.fongs = [];

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

$class.setPrimaryOffsetFromFong = function (fong) {
	// update offsets
	var primaryOffset = map(fong.x, (fong.radius / 2), window.innerWidth - fong.radius, 0, this.primaryOffsetMax);
	if (primaryOffset < 0) primaryOffset = 0;

	fong.dur = parseInt(1000 / primaryOffset * 4) + "ms";
	if (fong.boardInput) {
		fong.boardInput.dur = fong.dur;
	}
	$(fong.animation).attr("dur", fong.dur);

	return this.setPrimaryOffset(primaryOffset);
}

$class.setPrimaryOffset = function (value) {
	if (isNaN(value)) return;
	this.mainTimeOffset = value;
	this.fong1.oscGainCtrl.frequency.value = value / 4;
	return value;
};

$class.setSecondaryOffsetFromFong = function (fong) {
	var offset = map(fong.x, (fong.radius / 2), window.innerWidth - fong.radius, 0, this.secondaryOffsetMax) * this.mainTimeOffset;
	fong.dur = parseInt(1000 / offset * 4) + "ms";
	if (fong.boardInput) {
		fong.boardInput.dur = fong.dur;
	}
	$(fong.animation).attr("dur", fong.dur);
	return this.setSecondaryOffset(offset);
}

$class.setSecondaryOffset = function (value) {
	if (isNaN(value)) return;
	this.secondaryOffset = value;
	this.fong2.oscGainCtrl.frequency.value = value / 4;
	return value;
};

$class.updateBoard = function (values) {
	this.fong1.setOscVol(values.osc1Vol);
	this.fong2.setOscVol(values.osc2Vol);
	this.fong1.setOscFreq(values.osc1Freq);
	this.fong2.setOscFreq(values.osc2Freq);
	this.setPrimaryOffset(values.primaryOffset);

	this.setMainVol(values.mainVol);
	this.setSecondaryOffset(values.secondaryOffset);

	this.osc1MaxFreq = values.osc1MaxFreq;
	this.osc2MaxFreq = values.osc2MaxFreq;
	this.primaryOffsetMax = values.primaryOffsetMax;
	this.secondaryOffsetMax = values.secondaryOffsetMax;
};

// --- private helper functions ---
function map(val, x1, x2, y1, y2) {
	return (val - x1) / (Math.abs(x2 - x1)) * Math.abs(y2 - y1) + y1;
}