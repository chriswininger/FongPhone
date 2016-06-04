(function () {
	FongPhone.UI.Sound = Sound;
	function Sound(logicBoard, pad, state, socket) {
		this._socket = socket;
		this._messageDebouncers = {};
		var svgElementID = 'soundControls';
		this.logicBoard = logicBoard;
		var self = this;

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
		this.registerKnob = FongPhone.utils.registerKnob;
		_.bindAll(self, 'registerKnob');

		this.set(state);

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

		// ==== Getters and Setters ====
		function getOsc2EnvType() {
			return self._osc2EnvType;
		}
		function setOsc2EnvType(oscEnvType) {
			self._osc2EnvType = oscEnvType;
			self.sendEvent(pad.getFongByID(1), 'osc:env:type', oscEnvType);
		}

		function getOsc1EnvType() {
			return self._osc1EnvType;
		}
		function setOsc1EnvType(oscEnvType) {
			self._osc1EnvType = oscEnvType;
			self.sendEvent(pad.getFongByID(0), 'osc:env:type', oscEnvType);
		}

		function getOsc2Type() {
			return self._osc2Type;
		}
		function setOsc2Type(oscType) {
			self._osc2Type = oscType;
			self.sendEvent(pad.getFongByID(1), 'osc:type', oscType);
		}

		function getOsc1Type() {
			return self._osc1Type;
		}
		function setOsc1Type(oscType) {
			self._osc1Type = oscType;
			self.sendEvent(pad.getFongByID(0), 'osc:type', oscType);
		}

		function getDelayFeedbackControl() {
			return parseInt(self._delayFeedbackCtrl);
		}
		function setDelayFeedbackControl(delayFeedBackControl) {
			self._delayFeedbackCtrl = delayFeedBackControl;
			self.sendEvent(null, 'delay:feedback', delayFeedBackControl);
		}

		function getDelayTimeControl() {
			return self._delayTimeCtrl;
		}
		function setDelayTimeControl(delayTimeControl) {
			self._delayTimeCtrl = delayTimeControl;
			self.sendEvent(null, 'delay:time', delayTimeControl);
		}

		function getDelayVolumeControl() {
			return self._delayVolumeCtrl;
		}

		function setDelayVolumeControl(delayVolControl) {
			self._delayVolumeCtrl = delayVolControl;
			self.sendEvent(null, 'delay:volume', delayVolControl);
		}

		function getFilterPortamento() {
			return self._filterPortamento;
		}

		function setFilterPortamento(portamento) {
			self._filterPortamento = portamento;
			self.sendEvent(null, 'portamento:filter', portamento);
		}

		function getPortamentoControl() {
			return self._portamento;
		}
		function setPortamentoControl(portamento) {
			self._portamento = portamento;
			self.sendEvent(null, 'portamento', portamento);
		}

		function getEnv2Control() {
			return self._env2Ctrl;
		}
		function setEnv2Control(env) {
			self._env2Ctrl = env;
			self.sendEvent(pad.getFongByID(1), 'env', env);
		}

		function getEnv1Control() {
			return self._env1Ctrl;
		}
		function setEnv1Control(env) {
			self._env1Ctrl = env;
			self.sendEvent(pad.getFongByID(0), 'env', env);
		}

		function getFilterResonance() {
			return self._filterResonance;
		}
		function setFilterResonance(filterRes) {
			self._filterResonance = filterRes;
			self.sendEvent(null, 'filter:resonance', filterRes);
		}

		function getFilterOn() {
			return self._filterOn;
		}
		function setFilterOn(on) {
			self._filterOn = on;
			self.sendEvent(null, 'filter:on', on);
		}

		function getFilterType() {
			return self._filterType;
		}
		function setFilterType(filterType) {
			self._filterType = filterType;
			self.sendEvent(null, 'filter:type', filterType);
		}
		// --- END Getters and Setters ---
	}

	_.extend(Sound.prototype, {
		sendEvent: function(fong, event, value) {
			var self = this;
			if (!this._messageDebouncers[event]) {
				this._messageDebouncers[event] = _.debounce(function(fong, event, value) {
					self._socket.emit('sound:event', {
						eventType: event,
						value: value,
						id: (!!fong ? fong.id : null)
					});
				}, 10)
			}

			this._messageDebouncers[event](fong, event, value);
		},
		set: function(state) {
			_.extend(this, state);
		},
		attachToDom: function($scope) {
			var self = this;
			this.$scope = $scope;
			var heightStatusBar = 20;
			var heightSub = heightStatusBar + FongPhone.Globals.tabbedNavHeight + 8;
			var dial = $(".dial");

			if (FongPhone.Globals.isAndroid) {
				$('.fong-phone-apple-status-bar').hide();
				heightSub = heightSub - heightStatusBar - 8;
			}

			$('#soundControlsDiv').css('max-height', (window.innerHeight - heightSub) + "px");
			$('.page').css('max-height', window.innerHeight + "px");
			FongPhone.UI.Helper.registerAlertOnFirstView("soundMessage", 'The controls on this view allow you to change the sonic properties of each Fong including filter, wave types, delay and more. Got it?', 'Sound');

			// investigate $scope values
			$scope.FilterOn = self.logicBoard.FilterOn;

			$scope.toggleFilterClick = function () {
				$scope.FilterOn = !$scope.FilterOn;
				self.filterOn = $scope.FilterOn;
			};

			dial.attr("data-fgColor", "rgba(255, 255, 255, .5)");
			dial.attr("data-bgColor", "rgba(255, 255, 255, .1)");
			dial.attr('disabled', 'disabled');


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
				return self.osc1Type === type;
				//return logicBoard.fongs[0].osc.type == type;
			}

			$scope.changeOsc1Type = function (event) {
				self.osc1Type = $(event.target).html().trim();
			}

			$scope.IsSelectedOsc2Type = function (type) {
				return self.osc2Type === type;
				//return logicBoard.fongs[1].osc.type == type;
			}

			$scope.changeOsc2Type = function (event) {
				self.osc2Type = $(event.target).html().trim();
			}

			$scope.IsSelectedOsc1EnvType = function (envType) {
				return self.osc1EnvType === envType;
				//return logicBoard.fongs[0].oscGainCtrl.type == envType;
			}

			$scope.IsSelectedOsc2EnvType = function (envType) {
				return self.osc2EnvType === envType;
				//return logicBoard.fongs[1].oscGainCtrl.type == envType;
			}

			$scope.changeOsc1EnvType = function (event) {
				self.osc1EnvType = $(event.target).html().trim();
			}

			$scope.changeOsc2EnvType = function (event) {
				self.osc2EnvType = $(event.target).html().trim();
			}
		}
	});
})();