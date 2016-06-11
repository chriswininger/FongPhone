(function () {
	FongPhone.UI.Sound = Sound;
	function Sound(logicBoard, pad, state, socket) {
		var self = this;

		this._socket = socket;
		this._messageDebouncers = {};
		var svgElementID = 'soundControls';
		this.logicBoard = logicBoard;
		this.selectedFongID = 0;
		this._fongStates = [{}, {}, {}, {}];

		FongPhone.utils.createGetSet(this, 'osc1EnvType', getOsc1EnvType, setOsc1EnvType);
		FongPhone.utils.createGetSet(this, 'osc1Type', getOsc1Type, setOsc1Type);
		FongPhone.utils.createGetSet(this, 'delayFeedbackControl', getDelayFeedbackControl, setDelayFeedbackControl);
		FongPhone.utils.createGetSet(this, 'delayTimeControl', getDelayTimeControl, setDelayTimeControl);
		FongPhone.utils.createGetSet(this, 'delayVolumeControl', getDelayVolumeControl, setDelayVolumeControl);
		FongPhone.utils.createGetSet(this, 'filterPortamento', getFilterPortamento, setFilterPortamento);
		FongPhone.utils.createGetSet(this, 'portamentoControl', getPortamentoControl, setPortamentoControl);
		FongPhone.utils.createGetSet(this, 'env1Control', getEnv1Control, setEnv1Control);
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
		function getOsc1EnvType() {
			return self._fongStates[self.selectedFongID]._osc1EnvType;
		}
		function setOsc1EnvType(oscEnvType) {
			self._fongStates[self.selectedFongID]._osc1EnvType = oscEnvType;
			self.sendEvent(pad.getFongByID(self.selectedFongID), 'osc:env:type', oscEnvType);
		}

		function getOsc1Type() {
			return self._fongStates[self.selectedFongID]._osc1Type;
		}
		function setOsc1Type(oscType) {
			self._fongStates[self.selectedFongID]._osc1Type = oscType;
			self.sendEvent(pad.getFongByID(self.selectedFongID), 'osc:type', oscType);
		}

		function getDelayFeedbackControl() {
			return parseInt(self._fongStates[self.selectedFongID]._delayFeedbackCtrl);
		}
		function setDelayFeedbackControl(delayFeedBackControl) {
			self._fongStates[self.selectedFongID]._delayFeedbackCtrl = delayFeedBackControl;
			self.sendEvent(pad.getFongByID(self.selectedFongID), 'delay:feedback', delayFeedBackControl);
		}

		function getDelayTimeControl() {
			return self._fongStates[self.selectedFongID]._delayTimeCtrl;
		}
		function setDelayTimeControl(delayTimeControl) {
			self._fongStates[self.selectedFongID]._delayTimeCtrl = delayTimeControl;
			self.sendEvent(pad.getFongByID(self.selectedFongID), 'delay:time', delayTimeControl);
		}

		function getDelayVolumeControl() {
			return self._fongStates[self.selectedFongID]._delayVolumeCtrl;
		}

		function setDelayVolumeControl(delayVolControl) {
			self._fongStates[self.selectedFongID]._delayVolumeCtrl = delayVolControl;
			self.sendEvent(pad.getFongByID(self.selectedFongID), 'delay:volume', delayVolControl);
		}

		function getFilterPortamento() {
			return self._filterPortamento;
		}

		function setFilterPortamento(portamento) {
			self._filterPortamento = portamento;
			self.sendEvent(pad.getFongByID(self.selectedFongID), 'portamento:filter', portamento);
		}

		function getPortamentoControl() {
			return self._portamento;
		}
		function setPortamentoControl(portamento) {
			self._portamento = portamento;
			self.sendEvent(pad.getFongByID(self.selectedFongID), 'portamento', portamento);
		}

		function getEnv1Control() {
			return self._fongStates[self.selectedFongID]._env1Ctrl;
		}
		function setEnv1Control(env) {
			self._fongStates[self.selectedFongID]._env1Ctrl = env;
			self.sendEvent(pad.getFongByID(self.selectedFongID), 'env', env);
		}

		function getFilterResonance() {
			return self._fongStates[self.selectedFongID]._filterResonance;
		}
		function setFilterResonance(filterRes) {
			self._fongStates[self.selectedFongID]._filterResonance = filterRes;
			self.sendEvent(pad.getFongByID(self.selectedFongID), 'filter:resonance', filterRes);
		}

		function getFilterOn() {
			return self._fongStates[self.selectedFongID]._filterOn;
		}
		function setFilterOn(on) {
			self._fongStates[self.selectedFongID]._filterOn = on;
			self.sendEvent(pad.getFongByID(self.selectedFongID), 'filter:on', on);
		}

		function getFilterType() {
			return self._fongStates[self.selectedFongID]._filterType;
		}
		function setFilterType(filterType) {
			self._fongStates[self.selectedFongID]._filterType = filterType;
			self.sendEvent(pad.getFongByID(self.selectedFongID), 'filter:type', filterType);
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
			for (var i = 0; i < this._fongStates.length; i++) {
				this.selectedFongID = i;
				_.extend(this, state);
			}

			this.selectedFongID = 0;
		},
		attachToDom: function($scope) {
			var self = this;
			this.$scope = $scope;
			var heightStatusBar = 20;
			var heightSub = FongPhone.Globals.tabbedNavHeight;
			var dial = $(".dial");


			$('.fong-phone-apple-status-bar').hide();
			$('#soundControlsDiv').css('height', (window.innerHeight - heightSub) + "px");
			$('#soundControlsDiv').css('max-height', (window.innerHeight - heightSub) + "px");
			//soundUI
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


			this.knobFilterResonanceControl = this.registerKnob('#filterResonanceControl', 'filterResonance', this.filterResonance, this);
			this.knobEnv1Control = this.registerKnob('#env1Control', 'env1Control', this.env1Control, this);
			this.knobPortamentoControl = this.registerKnob('#portamentoControl', 'portamentoControl', this.portamentoControl, this);
			this.knobFilterPortamentoControl = this.registerKnob('#filterPortamentoControl', 'filterPortamento', this.filterPortamento, this);
			this.knobDelayVolumeControl = this.registerKnob('#delayVolumeControl', 'delayVolumeControl', this.delayVolumeControl, this);
			this.knobDelayTimeControl = this.registerKnob('#delayTimeControl', 'delayTimeControl', this.delayTimeControl, this);
			this.knobDelayFeedbackControl = this.registerKnob('#delayFeedbackControl', 'delayFeedbackControl', this.delayFeedbackControl, this);

			$scope.updateKnobs = _.bind(this.updateKnobs, this);

			$scope.getSelectedFongID = function() {
				return self.selectedFongID;
			};

			$scope.setSelectedFongID = function(id) {
				self.selectedFongID = id;
			};

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

			$scope.IsSelectedOsc1EnvType = function (envType) {
				return self.osc1EnvType === envType;
				//return logicBoard.fongs[0].oscGainCtrl.type == envType;
			}

			$scope.changeOsc1EnvType = function (event) {
				self.osc1EnvType = $(event.target).html().trim();
			}
		},
		updateKnobs: function() {
			this.knobFilterResonanceControl.val(this.filterResonance);
			this.knobFilterResonanceControl.trigger('change');

			this.knobEnv1Control.val(this.env1Control);
			this.knobEnv1Control.trigger('change');

			this.knobFilterPortamentoControl.val(this.filterPortamento);
			this.knobFilterPortamentoControl.trigger('change');

			this.knobDelayVolumeControl.val(this.delayVolumeControl);
			this.knobDelayVolumeControl.trigger('change');

			this.knobDelayTimeControl.val(this.delayTimeControl);
			this.knobDelayTimeControl.trigger('change');

			this.knobDelayFeedbackControl.val(this.delayFeedbackControl);
			this.knobDelayFeedbackControl.trigger('change');

			// this.knobPortamentoControl.va(this.portamentoControl); (NOT NEEDED)
		}
	});
})();