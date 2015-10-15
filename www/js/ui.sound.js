(function () {
	window.PhonePhong.Sound = function ($scope, board, pad) {
		var self = this;
		var svgElementID = 'soundControls';
		this.board = board;

		FongPhone.utils.createGetSet(this, 'osc1EnvType', getOsc1EnvType, setOsc1EnvType);
		FongPhone.utils.createGetSet(this, 'osc2EnvType', getOsc2EnvType, setOsc2EnvType);
		FongPhone.utils.createGetSet(this, 'osc1Type', getOsc1Type, setOsc1Type);
		FongPhone.utils.createGetSet(this, 'osc2Type', getOsc2Type, setOsc2Type);
		FongPhone.utils.createGetSet(this, 'delayFeedbackControl', getDelayFeedbackControl, setDelayFeedbackControl);
		FongPhone.utils.createGetSet(this, 'delayTimeControl', getDelayTimeControl, setDelayTimeControl);
		FongPhone.utils.createGetSet(this, 'delayVolumeControl', getDelayVolumeControl, setDelayVolumeControl);
		FongPhone.utils.createGetSet(this, 'filterPortamento', getFilterPortamento, setFilterPortamento);
		FongPhone.utils.createGetSet(this, 'portamentoControl', getPortamentoControl, setPortamentoControl);
		FongPhone.utils.createGetSet(this, 'env1Control', getEnv1Control, setEnv1Control);
		FongPhone.utils.createGetSet(this, 'evn2Control', getEvn2Control, setEvn2Control);
		FongPhone.utils.createGetSet(this, 'filterResonance', getFilterResonance, setFilterResonance);
		FongPhone.utils.createGetSet(this, 'filterOn', getFilterOn, setFilterOn);
		FongPhone.utils.createGetSet(this, 'filterType', getFilterType, setFilterType);


		this.filterResonance = 5;
		this.filterType = 'lowpass';
		this.env1Control = this.board.primaryOffsetMax;
		this.env2Control =  this.board.secondaryOffsetMax;
		this.portamentoControl = this.board.portamento;
		this.filterPortamento = this.board.filterPortamento;
		this.delayVolumeControl = parseInt(this.board.delayVolume * 100);
		this.delayTimeControl = parseInt(this.board.delayTime * 1000);
		this.delayFeedbackControl = parseInt(this.board.delayFeedback * 10);
		// investigate $scope values

		$scope.FilterOn = board.FilterOn;

		$scope.toggleFilterClick = function () {
			self.filterOn = !$scope.FilterOn;
		};
		
		$(".dial").attr("data-fgColor", "rgba(255, 255, 255, .5)");
		$(".dial").attr("data-bgColor", "rgba(255, 255, 255, .1)");
		$(".dial").attr('disabled','disabled');

		$("#filterResonanceControl").val(this.filterResonance);

		$("#filterResonanceControl").knob({
			'stopper': true,
			'height': 90,
			'change': function (v) {
				self.filterResonance = parseInt(v);
			}
		});

		$("#env1Control").val(this.env1Control);

		$("#env1Control").knob({
			'stopper': true,
			'height': 90,
			'change': function (v) {
				self.env1Control = parseInt(v);
			}
		});

		$("#env2Control").val(this.env2Control);

		$("#env2Control").knob({
			'stopper': true,
			'height': 90,
			'change': function (v) {
				self.evn2Control = parseInt(v);
			}
		});

		$("#portamentoControl").val(this.portamentoControl);

		$("#portamentoControl").knob({
			'stopper': true,
			'height': 90,
			'change': function (v) {
				self.portamentoControl = parseInt(v);
			}
		});

		$("#filterPortamentoControl").val(this.filterPortamento);

		$("#filterPortamentoControl").knob({
			'stopper': true,
			'height': 90,
			'change': function (v) {
				self.filterPortamento = parseInt(v);
			}
		});
		$("#delayVolumeControl").val(this.delayVolumeControl);

		$("#delayVolumeControl").knob({
			'stopper': true,
			'height': 90,
			'change': function (v) {
				self.delayVolumeControl = v;
			}
		});

		$("#delayTimeControl").val(this.delayTimeControl);

		$("#delayTimeControl").knob({
			'stopper': true,
			'height': 90,
			'change': function (v) {
				self.delayTimeControl = v;
			}
		});

		$("#delayFeedbackControl").val(this.delayFeedbackControl);

		$("#delayFeedbackControl").knob({
			'stopper': true,
			'height': 90,
			'change': function (v) {
				self.delayFeedbackControl = v;
			}
		});

		$('#soundControlsDiv').css('max-height', (window.innerHeight - 60) + "px");

		$('.page').css('max-height', window.innerHeight + "px");

		$scope.IsSelectedFilterType = function (filterType) {
			return filterType === self.filterType;
		}

		$scope.changeFilterType = function (event) {
			self.filterType = $(event.target).html().trim();
		}

		$scope.IsSelectedOsc1Type = function (type) {
			return logicBoard.fongs[0].osc.type == type;
		}

		$scope.changeOsc1Type = function (event) {
			self.osc1Type =  $(event.target).html().trim();
		}

		$scope.IsSelectedOsc2Type = function (type) {
			return logicBoard.fongs[1].osc.type == type;
		}

		$scope.changeOsc2Type = function (event) {
			self.osc2Type = $(event.target).html().trim();
		}

		$scope.IsSelectedOsc1EnvType = function (envType) {
			return logicBoard.fongs[0].oscGainCtrl.type == envType;
		}

		$scope.IsSelectedOsc2EnvType = function (envType) {
			return logicBoard.fongs[1].oscGainCtrl.type == envType;
		}

		$scope.changeOsc1EnvType = function (event) {
			self.osc1EnvType = $(event.target).html().trim();
		}

		$scope.changeOsc2EnvType = function (event) {
			self.osc2EnvType = $(event.target).html().trim();
		}

		var mapPadSwipeDown = document.getElementById('mapPadSwipeDown');
		//mapPadSwipeDown.style.top = (window.innerHeight - mapPadSwipeDown.getClientRects()[0].height) + 'px';
		var hammeruiPadSwipeDown = new Hammer(mapPadSwipeDown, {
			direction: Hammer.DIRECTION_VERTICAL
		});
		hammeruiPadSwipeDown.get('swipe').set({
			direction: Hammer.DIRECTION_VERTICAL
		});
		hammeruiPadSwipeDown.on('pan', function (ev) {
			if (ev.isFinal) {
				if (pad) {
					localStorage.setItem('ui.pad.state', JSON.stringify(pad.toJSON()));
				}
				window.location = '#/';
			}
		});

		// ==== Member Methods ====
		this.toJSON = function() {
			var exclued = { board: true };
			var out = {};
			_.each(this, function(val, key) {
				if (key[0] !== '_' && !_.isFunction(val) && !exclued[key])
					out[key] = _.clone(val);
			});

			return out;
		};

		this.set = function(state) {
			_.extend(this, state);
		};

		// ==== Getters and Setters ====
		function getOsc2EnvType() {
			return this._osc2EnvType;
		}
		function setOsc2EnvType(oscEnvType) {
			this._osc2EnvType = oscEnvType;
			logicBoard.fongs[1].oscGainCtrl.type = oscEnvType;
		}

		function getOsc1EnvType() {
			return this._osc1EnvType;
		}
		function setOsc1EnvType(oscEnvType) {
			this._osc1EnvType = oscEnvType;
			logicBoard.fongs[0].oscGainCtrl.type = oscEnvType;
		}

		function getOsc2Type() {
			return this._osc2Type;
		}
		function setOsc2Type(oscType) {
			this._osc2Type = oscType;
			pad.fongDots[1].selectedStateIndex = pad.fongDots[0].states.indexOf(oscType);
		}

		function getOsc1Type() {
			return this._osc1Type;
		}
		function setOsc1Type(oscType) {
			this._osc1Type = oscType;
			//logicBoard.fongs[0].osc.type = oscType;
			pad.fongDots[0].selectedStateIndex = pad.fongDots[0].states.indexOf(oscType);
			pad.fongDots[0].selectedState = oscType;
		}

		function getDelayFeedbackControl() {
			return this._delayFeedbackCtrl;
		}
		function setDelayFeedbackControl(delayFeedBackControl) {
			this._delayFeedbackCtrl = delayFeedBackControl;
			logicBoard.delayFeedback = delayFeedBackControl / 10.0;
			for (var i = 0; i < logicBoard.fongs.length; i++) {
				logicBoard.fongs[i].setDelayFeedback(logicBoard.delayFeedback);
			}
		}

		function getDelayTimeControl() {
			return this._delayTimeCtrl;
		}
		function setDelayTimeControl(delayTimeControl) {
			this._delayTimeCtrl = delayTimeControl;
			logicBoard.delayTime = delayTimeControl / 1000.0;
			for (var i = 0; i < logicBoard.fongs.length; i++) {
				logicBoard.fongs[i].setDelayTime(logicBoard.delayTime);
			}
		}

		function getDelayVolumeControl() {
			return this._delayVolumeCtrl;
		}
		function setDelayVolumeControl(delayVolControl) {
			this._delayVolumeCtrl = delayVolControl;
			logicBoard.delayVolume = delayVolControl / 100.0;
			for (var i = 0; i < logicBoard.fongs.length; i++) {
				logicBoard.fongs[i].setDelayVolume(logicBoard.delayVolume);
			}
		}

		function getFilterPortamento() {
			return this._filterPortamento;
		}
		function setFilterPortamento(portamento) {
			this._filterPortamento = portamento;
			logicBoard.filterPortamento = portamento;
		}

		function getPortamentoControl() {
			return this._portamento;
		}
		function setPortamentoControl(portamento) {
			this._portamento = portamento;
			logicBoard.portamento = portamento;
		}

		function getEvn2Control() {
			return this._evn2Ctrl;
		}
		function setEvn2Control(evn) {
			this._evn2Ctrl = evn;
			logicBoard.secondaryOffsetMax = evn;
			logicBoard.setSecondaryOffsetFromFong(pad.fongDots[1]);
		}

		function getEnv1Control() {
			return this._env1Ctrl;
		}
		function setEnv1Control(env) {
			this._env1Ctrl = env;
			logicBoard.primaryOffsetMax = env;
			logicBoard.setPrimaryOffsetFromFong(pad.fongDots[0]);
			logicBoard.setSecondaryOffsetFromFong(pad.fongDots[1]);
		}

		function getFilterResonance() {
			return this._filterResonance;
		}
		function setFilterResonance(filterRes) {
			self._filterResonance = filterRes;
			for (var i = 0; i < logicBoard.fongs.length; i++) {
				logicBoard.fongs[i].setOscFilterResonance(self._filterResonance * 10);
			}
		}

		function getFilterOn() {
			return this._filterOn;
		}
		function setFilterOn(on) {
			this._filterOn = on;
			$scope.FilterOn = on;
			logicBoard.setFilterStatus(on);
		}

		function getFilterType() {
			return this._filterType;
		}
		function setFilterType(filterType) {
			this._filterType = filterType;
			for (var i = 0; i < logicBoard.fongs.length; i++) {
				logicBoard.fongs[i].setFilterType(filterType);
			}
		}
		// --- END Getters and Setters ---
	};
})();