(function () {
	FongPhone.UI.Sound = Sound;
	function Sound(logicBoard, pad, state) {
		var self = this;

		this._logicBoard = logicBoard;
		this.selectedFongID = 0;
		this._pad = pad;
		this._fongStates = [{}, {}, {}, {}];
		this._domAttached = false;

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
			var exclued = { board: true, $scope: true, filterPortamento: true, protamento: true };
			var out = {
				fongs: {}
			};

			var myKeys = _.keys(this);
			var key;
			var val;
			var myKeysLen = myKeys.length;
			var fongIDS = _.keys(this._fongStates);
			var originalSelection = this.selectedFongID;
			var i;
			var j;
			for (i = 0; i < fongIDS.length; i++) {
				this.selectedFongID = fongIDS[i];
				out.fongs[this.selectedFongID] = {};
				// iterate through my keys for each fong selection (cheap trick fix this)
				for (j = 0; j < myKeysLen; j++) {
					key = myKeys[j];
					val = this[key];
					if (key[0] !== '_' && !_.isFunction(val) && !exclued[key])
						out.fongs[this.selectedFongID][key] = _.clone(val);
				}

			}

			out.filterPortamento = this.filterPortamento;
			out.protamentoControl = this.portamentoControl;

			this.selectedFongID = originalSelection;

			return out;
		};

		// ==== Getters and Setters ====
		function getOsc1EnvType() {
			return self._fongStates[self.selectedFongID]._osc1EnvType;
		}
		function setOsc1EnvType(oscEnvType) {
			self._fongStates[self.selectedFongID]._osc1EnvType = oscEnvType;
			var fong = self._pad.fongDotsByID[self.selectedFongID];
			fong.boardInput.oscGainCtrl.type = oscEnvType;
		}

		function getOsc1Type() {
			return self._fongStates[self.selectedFongID]._osc1Type;
		}
		function setOsc1Type(oscType) {
			self._fongStates[self.selectedFongID]._osc1Type = oscType;
			var fong = self._pad.fongDotsByID[self.selectedFongID];
			fong.selectedStateIndex = fong.states.indexOf(oscType);
			fong.selectedState = oscType;
		}

		function getDelayFeedbackControl() {
			return parseInt(self._fongStates[self.selectedFongID]._delayFeedbackCtrl);
		}
		function setDelayFeedbackControl(delayFeedBackControl) {
			self._fongStates[self.selectedFongID]._delayFeedbackCtrl = delayFeedBackControl;
			var fong = self._pad.fongDotsByID[self.selectedFongID];
			self._logicBoard.delayFeedback = delayFeedBackControl / 10.0;
			fong.boardInput.setDelayFeedback(self._logicBoard.delayFeedback);
		}

		function getDelayTimeControl() {
			return self._fongStates[self.selectedFongID]._delayTimeCtrl;
		}
		function setDelayTimeControl(delayTimeControl) {
			self._fongStates[self.selectedFongID]._delayTimeCtrl = delayTimeControl;
			var fong = self._pad.fongDotsByID[self.selectedFongID];
			self._logicBoard.delayTimeControl = delayTimeControl / 1000.0;
			fong.boardInput.setDelayTime(self._logicBoard.delayTimeControl);
		}

		function getDelayVolumeControl() {
			return self._fongStates[self.selectedFongID]._delayVolumeCtrl;
		}
		function setDelayVolumeControl(delayVolControl) {
			self._fongStates[self.selectedFongID]._delayVolumeCtrl = delayVolControl;
			var fong = self._pad.fongDotsByID[self.selectedFongID];
			self._logicBoard.delayVolume = delayVolControl / 100.0;
			fong.boardInput.setDelayVolume(self._logicBoard.delayVolume);
		}

		function getFilterPortamento() {
			return self._filterPortamento;
		}
		function setFilterPortamento(portamento) {
			self._filterPortamento = portamento;
			self._logicBoard.filterPortamento = portamento;
		}

		function getPortamentoControl() {
			return self._portamento;
		}
		function setPortamentoControl(portamento) {
			self._portamento = portamento;
			self._logicBoard.portamento = portamento;
		}

		function getEnv1Control() {
			return self._fongStates[self.selectedFongID]._env1Ctrl;
		}
		function setEnv1Control(env) {
			// TODO (CAW) -- We need primary and secondary offset max for each pair of fongs (or just set offset per fong)
			self._fongStates[self.selectedFongID]._env1Ctrl = env;

			/*if (fong.fongRole === 'primary') {
				self._logicBoard.primaryOffsetMax = env;
			} else {
				self._logicBoard.secondaryOffsetMax = env;
			}*/
			var fong = self._pad.fongDotsByID[self.selectedFongID];
			fong.offSetMax = env;
			if (fong.fongRole === 'primary') {
				var primaryFong = self._pad.fongDotsByID[self.selectedFongID];
				self._logicBoard.setPrimaryOffsetFromFong(primaryFong);

				if (fong.secondaryFongID) {
					var secondaryFong = self._pad.fongDotsByID[fong.secondaryFongID];
					self._logicBoard.setSecondaryOffsetFromFong(secondaryFong, primaryFong);
				}
			} else {
				var secondaryFong = self._pad.fongDotsByID[self.selectedFongID];
				if (fong.primaryFongID) {
					var primaryFong = self._pad.fongDotsByID[fong.primaryFongID];
					self._logicBoard.setSecondaryOffsetFromFong(secondaryFong, primaryFong);	
				}
			}
		}

		function getFilterResonance() {
			return self._fongStates[self.selectedFongID]._filterResonance;
		}
		function setFilterResonance(filterRes) {
			self._fongStates[self.selectedFongID]._filterResonance = filterRes;
			var fong = self._pad.fongDotsByID[self.selectedFongID];
			fong.boardInput.setOscFilterResonance(filterRes);
		}

		function getFilterOn() {
			return self._fongStates[self.selectedFongID]._filterOn;
		}

		function setFilterOn(on) {
			self._fongStates[self.selectedFongID]._filterOn = on;
			self._logicBoard.setFilterStatus(on);
		}

		function getFilterType() {
			return self._fongStates[self.selectedFongID]._filterType;
		}
		function setFilterType(filterType) {
			self._fongStates[self.selectedFongID]._filterType = filterType;
			var fong = self._pad.fongDotsByID[self.selectedFongID];
			fong.boardInput.setFilterType(filterType);
		}
		// --- END Getters and Setters ---
	}

	_.extend(Sound.prototype, {
		set: function(state) {
			var fongIDs = Object.keys(state.fongs);
			var id;
			for (var i = 0; i < fongIDs.length; i++) {
				this.selectedFongID = fongIDs[i];
				_.extend(this, state.fongs[fongIDs[i]]);
			}

			this.filterPortamento = state.filterPortamento;
			this.portamentoControl = state.portamentoControl;

			this.selectedFongID = 0;
		},
		adjustHeightWidth: function() {
			var heightSub = FongPhone.Globals.tabbedNavHeight;
			$('#soundControlsDiv').css('height', (window.innerHeight - heightSub) + "px");
			$('#soundControlsDiv').css('max-height', (window.innerHeight - heightSub) + "px");
			//soundUI
			$('.page').css('max-height', window.innerHeight + "px");
		},
		attachToDom: function($scope) {
			var self = this;
			this.$scope = $scope;

			var dial = $(".dial");

			$('.fong-phone-apple-status-bar').hide();
			this.adjustHeightWidth();

			FongPhone.UI.Helper.registerAlertOnFirstView("soundMessage", 'The controls on this view allow you to change the sonic properties of each Fong including filter, wave types, delay and more. Got it?', 'Sound');

			// investigate $scope values
			$scope.FilterOn = self._logicBoard.FilterOn;

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

			this._domAttached = true;
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

			this.knobPortamentoControl.val(this.portamentoControl);
			this.knobPortamentoControl.trigger('change');
		}
	});
})();