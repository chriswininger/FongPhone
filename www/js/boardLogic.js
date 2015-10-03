var _filterOn = true;

window.PhonePhong = window.PhonePhong || {};
window.PhonePhong.BoardLogic = function (audCtx, opts) {
	// instantiate audio sources
	this.audCtx = audCtx;
	this.mainVol = audCtx.createGain();

	this.fong1 = new fong(audCtx, this.mainVol, 60, 60);
	this.fong2 = new fong(audCtx, this.mainVol, 200, 200);

	this.fongs.push(this.fong1);
	this.fongs.push(this.fong2);

	this.mainVol.connect(this.audCtx.destination);

	// defaults
	this.updateBoard(opts);

	this.FilterOn = _filterOn;

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
	//alert(fong.x + " " + fong.radius + " " + window.innerWidth);
	var primaryOffset = map(fong.x, (fong.radius / 2), window.innerWidth - fong.radius, 0, this.primaryOffsetMax);
	if (primaryOffset < 0) primaryOffset = 0;

	this.setPrimaryOffset(primaryOffset);

	//alert(primaryOffset);
}

$class.setPrimaryOffset = function (value) {
	this.mainTimeOffset = value;
	this.fong1.oscGainCtrl.frequency.value = value / 4;
	//clearInterval(mainInterval);
	//mainInterval = setInterval(_.bind(this.primaryLoop, this), this.mainTimeOffset);
};

$class.setSecondaryOffsetFromFong = function (fong) {
	this.setSecondaryOffset(map(fong.x, (fong.radius / 2), window.innerWidth - fong.radius, 0, this.secondaryOffsetMax) * this.mainTimeOffset);
}

$class.setSecondaryOffset = function (value) {
	this.secondaryOffset = value;
	this.fong2.oscGainCtrl.frequency.value = value / 4;
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