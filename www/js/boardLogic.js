window.PhonePhong = window.PhonePhong || {};
window.PhonePhong.BoardLogic = function (audCtx, opts) {
	// instantiate audio sources
	this.audCtx = audCtx;
	this.mainVol = audCtx.createGain();
	
	this.fong1 = new fong(audCtx, this.mainVol);
	this.fong2 = new fong(audCtx, this.mainVol);	

	this.mainVol.connect(this.audCtx.destination);

	// defaults
	this.updateBoard(opts);

	this.init();
};

var $class = PhonePhong.BoardLogic.prototype;

var mainInterval;
$class.init = function () {
	this.fong1.start();
	this.fong2.start();
	//mainInterval = setInterval(_.bind(this.primaryLoop, this), this.mainTimeOffset);
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

$class.setMainVol = function (vol) {
	this.mainVol.gain.value = vol;
};

$class.setOsc1Vol = function (vol) {
	vol = vol / 3;
	this.fong1.oscVol = vol;
	this.fong1.oscVolOffset.gain.value = vol;
};

$class.setOsc2Vol = function (vol) {
	vol = vol / 3;
	this.fong2.oscVol = vol;
	this.fong2.oscVolOffset.gain.value = vol;
};

$class.setOsc1FilterFreq = function (freq) {
	this.fong1.filter.frequency.value = freq;
};

$class.setOsc2FilterFreq = function (freq) {
	this.fong2.filter.frequency.value = freq;
};

$class.setOsc1Freq = function (freq) {
	this.fong1.oscFreq = freq;
	this.fong1.osc.frequency.value = freq;
};

$class.setOsc2Freq = function (freq) {
	this.fong2.oscFreq = freq;
	this.fong2.osc.frequency.value = freq;
};

$class.setPrimaryOffset = function (value) {
	this.mainTimeOffset = value;
	this.fong1.oscGainCtrl.frequency.value = value / 4;
	//clearInterval(mainInterval);
	//mainInterval = setInterval(_.bind(this.primaryLoop, this), this.mainTimeOffset);
};

$class.setSecondaryOffset = function (value) {
	this.secondaryOffset = value;
	this.fong2.oscGainCtrl.frequency.value = value / 4;
};

$class.setOsc1Type = function (type) {
	this.fong1.osc.type = type;
};

$class.setOsc2Type = function (type) {
	this.fong2.osc.type = type;
};


$class.stopOsc1Pulse = function () {
	this.fong1.oscGainCtrl.disconnect(this.fong1.oscVol.gain);
};
$class.startOsc1Pulse = function () {
	this.fong1.oscGainCtrl.connect(this.fong1.oscVol.gain);
};

$class.stopOsc2Pulse = function () {
	this.fong2.oscGainCtrl.disconnect(this.fong2.oscVol.gain);
};
$class.startOscPulse = function () {
	this.fong2.oscGainCtrl.connect(this.fong2.oscVol.gain);
};

$class.osc1Off = function () {
	//this.oscVol1.disconnect(this.audCtx.destination);
};

$class.osc1On = function () {
	//this.oscVol1.connect(this.audCtx.destination);
};

$class.osc2Off = function () {
	//this.oscVol2.disconnect(this.audCtx.destination);
};

$class.osc2On = function () {
	//this.oscVol2.connect(this.audCtx.destination);
};

$class.setPrimaryFade = function (val) {
	this.fong1.oscPanCtrl.setPosition(val, 0, 0);
};

$class.setSecondaryFade = function (val) {
	this.fong2.oscPanCtrl.setPosition(val, 0, 0);
};

$class.updateBoard = function (values) {
	this.setOsc1Vol(values.osc1Vol);
	this.setOsc2Vol(values.osc2Vol);
	this.setOsc1Freq(values.osc1Freq);
	this.setOsc2Freq(values.osc2Freq);
	this.setPrimaryOffset(values.primaryOffset);

	this.setMainVol(values.mainVol);
	this.setSecondaryOffset(values.secondaryOffset);

	this.osc1MaxFreq = values.osc1MaxFreq;
	this.osc2MaxFreq = values.osc2MaxFreq;
	this.primaryOffsetMax = values.primaryOffsetMax;
	this.secondaryOffsetMax = values.secondaryOffsetMax;
};
