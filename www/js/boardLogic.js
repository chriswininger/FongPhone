window.PhonePhong = window.PhonePhong || {};
window.PhonePhong.BoardLogic = function (audCtx, opts) {
    try {
        // instantiate audio sources
        this.audCtx = audCtx;
        this.mainVol = audCtx.createGain();

        this.osc1 = audCtx.createOscillator();
        this.osc2 = audCtx.createOscillator();
        this.osc1.type = 'sine';
        this.osc2.type = 'sine';
        //osc2.frequency.value = 1000;

        this.osc1PanCtrl = audCtx.createPanner();
        this.osc1PanCtrl.panningModel = "equalpower";
        this.osc1PanCtrl.setPosition(0, 0, 0);

        this.osc2PanCtrl = audCtx.createPanner();
        this.osc2PanCtrl.panningModel = "equalpower";
        this.osc2PanCtrl.setPosition(0, 0, 0);

        this.oscVol1 = audCtx.createGain();
        this.oscVol2 = audCtx.createGain();

        this.oscVolOffset1 = audCtx.createGain();
        this.oscVolOffset2 = audCtx.createGain();
        this.oscVolOffset2.gain.value = this.oscVolOffset1.gain.value = 1.0;
        // initialize default settings
        //this.mainVol.gain.value = 0.5;
        //this.oscVol1.gain.value = 0.9949676394462585;
        //this.oscVol2.gain.value = 0.9949676394462585;

        this.osc1GainCtrl = audCtx.createOscillator();
        this.osc2GainCtrl = audCtx.createOscillator();
        //this.osc1GainCtrl.frequency.value = 0.25;
        //this.osc2GainCtrl.frequency.value = 1.0;
        this.osc1GainCtrl.type = 'square';
        this.osc2GainCtrl.type = 'square';

        this.osc1GainCtrl.connect(this.oscVol1.gain);
        this.osc2GainCtrl.connect(this.oscVol2.gain);

        this.filter1 = this.audCtx.createBiquadFilter();
        this.filter2 = this.audCtx.createBiquadFilter();

        this.filter1.type = 'lowpass'; // In this case it's a lowshelf filter
        this.filter1.frequency.value = 200;
        this.filter1.Q.value = 50;
        this.filter1.gain.value = 1;

        this.filter2.type = 'lowpass'; // In this case it's a lowshelf filter
        this.filter2.frequency.value = 250;
        this.filter2.Q.value = 50;
        this.filter2.gain.value = 1;

        this.osc1.connect(this.filter1);
        this.filter1.connect(this.oscVol1);
        this.oscVol1.connect(this.oscVolOffset1);
        this.oscVolOffset1.connect(this.osc1PanCtrl);
        this.osc1PanCtrl.connect(this.mainVol);

        this.osc2.connect(this.filter2);
        this.filter2.connect(this.oscVol2);
        this.oscVol2.connect(this.oscVolOffset2);
        this.oscVolOffset2.connect(this.osc2PanCtrl);
        this.osc2PanCtrl.connect(this.mainVol);

        this.mainVol.connect(this.audCtx.destination);

        // defaults
        this.updateBoard(opts);
        //this.mainTimeOffset = 1000;
        //this.secondaryOffset = 2;

        this.init();
    } catch (err) {
        alert(err.message + "<br />" + err.stack);
    }
};

var $class = PhonePhong.BoardLogic.prototype;

var mainInterval;
$class.init = function () {
    this.osc1.start(0);
    this.osc2.start(0);
    this.osc1GainCtrl.start(0);
    this.osc2GainCtrl.start(0);
    //mainInterval = setInterval(_.bind(this.primaryLoop, this), this.mainTimeOffset);
};

var timeOutCnt = 0;
var loopRunning = false;
//var len = 100;
$class.primaryLoop = function () {
    //if (loopRunning) return;
    loopRunning = true;
    var len = this.mainTimeOffset > 100 ? 100 : Math.floor(this.mainTimeOffset / 1.75);
    var pulses = [{
        osc: this.osc1,
        gain: this.oscVol1.gain,
        len: len,
        currVol: this.osc1Vol
    }];
    if (timeOutCnt >= this.secondaryOffset) {
        pulses.push({
            osc: this.osc2,
            gain: this.oscVol2.gain,
            len: len,
            currVol: this.osc2Vol
        });
        timeOutCnt = 0;
    } else {
        timeOutCnt++;
    }

    async.each(pulses, _pulse, function () {
        loopRunning = false;
    });
};

$class.setMainVol = function (vol) {
    this.mainVol.gain.value = vol;
};

$class.setOsc1Vol = function (vol) {
    vol = vol / 3;
    this.osc1Vol = vol;
    this.oscVolOffset1.gain.value = vol;
};

$class.setOsc2Vol = function (vol) {
    vol = vol / 3;
    this.osc2Vol = vol;
    this.oscVolOffset2.gain.value = vol;
};

$class.setOsc1FilterFreq = function (freq) {
    this.filter1.frequency.value = freq;    
};

$class.setOsc2FilterFreq = function (freq) {
    this.filter2.frequency.value = freq;
};

$class.setOsc1Freq = function (freq) {
    this.osc1Freq = freq;
    this.osc1.frequency.value = freq;
};

$class.setOsc2Freq = function (freq) {
    this.osc2Freq = freq;
    this.osc2.frequency.value = freq;
};

$class.setPrimaryOffset = function (value) {
    this.mainTimeOffset = value;
    this.osc1GainCtrl.frequency.value = value / 4;
    //clearInterval(mainInterval);
    //mainInterval = setInterval(_.bind(this.primaryLoop, this), this.mainTimeOffset);
};

$class.setSecondaryOffset = function (value) {
    this.secondaryOffset = value;
    this.osc2GainCtrl.frequency.value = value / 4;
};

$class.setOsc1Type = function (type) {
    this.osc1.type = type;
};

$class.setOsc2Type = function (type) {
    this.osc2.type = type;
};


$class.stopOsc1Pulse = function () {
    this.osc1GainCtrl.disconnect(this.oscVol1.gain);
};
$class.startOsc1Pulse = function () {
    this.osc1GainCtrl.connect(this.oscVol1.gain);
};

$class.stopOsc2Pulse = function () {
    this.osc2GainCtrl.disconnect(this.oscVol2.gain);
};
$class.startOsc2Pulse = function () {
    this.osc2GainCtrl.connect(this.oscVol2.gain);
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
    this.osc1PanCtrl.setPosition(val, 0, 0);
};

$class.setSecondaryFade = function (val) {
    this.osc2PanCtrl.setPosition(val, 0, 0);
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