(function () {
	FongPhone.UI.Sound = function (board, pad, state) {
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
		FongPhone.utils.createGetSet(this, 'env2Control', getEnv2Control, setEnv2Control);
		FongPhone.utils.createGetSet(this, 'filterResonance', getFilterResonance, setFilterResonance);
		FongPhone.utils.createGetSet(this, 'filterOn', getFilterOn, setFilterOn);
		FongPhone.utils.createGetSet(this, 'filterType', getFilterType, setFilterType);
		this.set = set;
		this.attachToDom = attachToDom;
		this.registerKnob = FongPhone.utils.registerKnob;
		_.bindAll(this, 'set', 'attachToDom', 'registerKnob');

		this.set(state);


		function attachToDom($scope) {
			var self = this;
			this.$scope = $scope;

			FongPhone.UI.Helper.registerSwipeNavigation(this, 'ui.sound.state', 'soundSettingsSwipeStrip', '#/', Hammer.DIRECTION_RIGHT);
			FongPhone.UI.Helper.registerSwipeNavigation(this, 'ui.sound.state', 'soundSettingsSwipeStrip', '#/states', Hammer.DIRECTION_LEFT);

			// investigate $scope values
			$scope.FilterOn = board.FilterOn;

			$scope.toggleFilterClick = function () {
				$scope.FilterOn = !$scope.FilterOn;
				self.filterOn = $scope.FilterOn;
			};

			$(".dial").attr("data-fgColor", "rgba(255, 255, 255, .5)");
			$(".dial").attr("data-bgColor", "rgba(255, 255, 255, .1)");
			$(".dial").attr('disabled', 'disabled');

			$('#soundControlsDiv').css('max-height', (window.innerHeight - 63) + "px");
			$('.page').css('max-height', window.innerHeight + "px");

			this.registerKnob('#filterResonanceControl', 'filterResonance', this.filterResonance, this);
			this.registerKnob('#env1Control', 'env1Control', this.env1Control, this);
			this.registerKnob('#env2Control', 'env2Control', this.env2Control, this);
			this.registerKnob('#portamentoControl', 'portamentoControl', this.portamentoControl, this);
			this.registerKnob('#filterPortamentoControl', 'filterPortamento', this.filterPortamento, this);
			this.registerKnob('#delayVolumeControl', 'delayVolumeControl', this.delayVolumeControl, this);
			this.registerKnob('#delayTimeControl', 'delayTimeControl', this.delayTimeControl, this);
			this.registerKnob('#delayFeedbackControl', 'delayFeedbackControl', this.delayFeedbackControl, this);


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
				self.osc1Type = $(event.target).html().trim();
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
			
		}		

		// ==== Member Methods ====
		this.toJSON = function() {
			var exclued = { board: true, $scope: true };
			var out = {};
			_.each(this, function(val, key) {
				if (key[0] !== '_' && !_.isFunction(val) && !exclued[key])
					out[key] = _.clone(val);
			});

			return out;
		};

		function set(state) {
			_.extend(this, state);
		}

		// ==== Getters and Setters ====
		function getOsc2EnvType() {
			return self._osc2EnvType;
		}
		function setOsc2EnvType(oscEnvType) {
			self._osc2EnvType = oscEnvType;
			logicBoard.fongs[1].oscGainCtrl.type = oscEnvType;
		}

		function getOsc1EnvType() {
			return self._osc1EnvType;
		}
		function setOsc1EnvType(oscEnvType) {
			self._osc1EnvType = oscEnvType;
			logicBoard.fongs[0].oscGainCtrl.type = oscEnvType;
		}

		function getOsc2Type() {
			return self._osc2Type;
		}
		function setOsc2Type(oscType) {
			self._osc2Type = oscType;
			pad.fongDots[1].selectedStateIndex = pad.fongDots[0].states.indexOf(oscType);
		}

		function getOsc1Type() {
			return self._osc1Type;
		}
		function setOsc1Type(oscType) {
			self._osc1Type = oscType;
			//logicBoard.fongs[0].osc.type = oscType;
			pad.fongDots[0].selectedStateIndex = pad.fongDots[0].states.indexOf(oscType);
			pad.fongDots[0].selectedState = oscType;
		}

		function getDelayFeedbackControl() {
			return parseInt(self._delayFeedbackCtrl);
		}
		function setDelayFeedbackControl(delayFeedBackControl) {
			self._delayFeedbackCtrl = delayFeedBackControl;
			logicBoard.delayFeedback = delayFeedBackControl / 10.0;
			for (var i = 0; i < logicBoard.fongs.length; i++) {
				logicBoard.fongs[i].setDelayFeedback(logicBoard.delayFeedback);
			}
		}

		function getDelayTimeControl() {
			return self._delayTimeCtrl;
		}
		function setDelayTimeControl(delayTimeControl) {
			self._delayTimeCtrl = delayTimeControl;
			logicBoard.delayTime = delayTimeControl / 1000.0;
			for (var i = 0; i < logicBoard.fongs.length; i++) {
				logicBoard.fongs[i].setDelayTime(logicBoard.delayTime);
			}
		}

		function getDelayVolumeControl() {
			return self._delayVolumeCtrl;
		}
		function setDelayVolumeControl(delayVolControl) {
			self._delayVolumeCtrl = delayVolControl;
			logicBoard.delayVolume = delayVolControl / 100.0;
			for (var i = 0; i < logicBoard.fongs.length; i++) {
				logicBoard.fongs[i].setDelayVolume(logicBoard.delayVolume);
			}
		}

		function getFilterPortamento() {
			return self._filterPortamento;
		}
		function setFilterPortamento(portamento) {
			self._filterPortamento = portamento;
			logicBoard.filterPortamento = portamento;
		}

		function getPortamentoControl() {
			return self._portamento;
		}
		function setPortamentoControl(portamento) {
			self._portamento = portamento;
			logicBoard.portamento = portamento;
		}

		function getEnv2Control() {
			return self._env2Ctrl;
		}
		function setEnv2Control(env) {
			self._env2Ctrl = env;
			logicBoard.secondaryOffsetMax = env;
			logicBoard.setSecondaryOffsetFromFong(pad.fongDots[1]);
		}

		function getEnv1Control() {
			return self._env1Ctrl;
		}
		function setEnv1Control(env) {
			self._env1Ctrl = env;
			logicBoard.primaryOffsetMax = env;
			logicBoard.setPrimaryOffsetFromFong(pad.fongDots[0]);
			logicBoard.setSecondaryOffsetFromFong(pad.fongDots[1]);
		}

		function getFilterResonance() {
			return self._filterResonance;
		}
		function setFilterResonance(filterRes) {
			self._filterResonance = filterRes;
			for (var i = 0; i < logicBoard.fongs.length; i++) {
				logicBoard.fongs[i].setOscFilterResonance(self._filterResonance * 10);
			}
		}

		function getFilterOn() {
			return self._filterOn;
		}
		function setFilterOn(on) {
			self._filterOn = on;
			logicBoard.setFilterStatus(on);			
		}

		function getFilterType() {
			return self._filterType;
		}
		function setFilterType(filterType) {
			self._filterType = filterType;
			for (var i = 0; i < logicBoard.fongs.length; i++) {
				logicBoard.fongs[i].setFilterType(filterType);
			}
		}
		// --- END Getters and Setters ---
	};
})();