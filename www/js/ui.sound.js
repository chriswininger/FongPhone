var _filterResonance = 5;
var _filterType = "lowpass";
(function () {
	window.PhonePhong.Sound = function ($scope, board, pad) {
		var self = this;
		var svgElementID = 'soundControls';

		this.board = board;
		this.pad = pad;

		FongPhone.utils.createGetSet(this, 'osc2EnvType', getOsc2EnvType, setOsc2EnvType);
		FongPhone.utils.createGetSet(this, 'osc1EnvType', getOsc1EnvType, setOsc1EnvType);
		FongPhone.utils.createGetSet(this, 'osc2Type', getOsc2Type, setOsc2Type);
		FongPhone.utils.createGetSet(this, 'osc1Type', getOsc1Type, setOsc1Type);
		FongPhone.utils.createGetSet(this, 'delayFeedbackControl', getDelayFeedbackControl, setDelayFeedbackControl);
		FongPhone.utils.createGetSet(this, 'delayTimeControl', getDelayTimeControl, setDelayTimeControl);
		FongPhone.utils.createGetSet(this, 'delayVolumeControl', getDelayVolumeControl, setDelayVolumeControl);
		FongPhone.utils.createGetSet(this, 'filterPortamento', getFilterPortamento, setFilterPortamento);
		FongPhone.utils.createGetSet(this, 'portamentoControl', getPortamentoControl, setPortamentoControl);
		FongPhone.utils.createGetSet(this, 'evn2Control', getEvn2Control, setEvn2Control);
		FongPhone.utils.createGetSet(this, 'env1Control', getEnv1Control, setEnv1Control);
		FongPhone.utils.createGetSet(this, 'filterResonance', getFilterResonance, setFilterResonance);
		FongPhone.utils.createGetSet(this, 'filterOn', getFilterOn, setFilterOn);

		$scope.FilterOn = board.FilterOn;

		$scope.toggleFilterClick = function () {
			self.filterOn = !$scope.FilterOn;
			$scope.FilterOn = self.FilterOn;

			logicBoard.setFilterStatus($scope.FilterOn);
		};
		
		$(".dial").attr("data-fgColor", "rgba(255, 255, 255, .5)");
		$(".dial").attr("data-bgColor", "rgba(255, 255, 255, .1)");
		$(".dial").attr('disabled','disabled');

		$("#filterResonanceControl").val(_filterResonance);

		$("#filterResonanceControl").knob({
			'stopper': true,
			'height': 90,
			'change': function (v) {
				self.filterResonance = v;
				for (var i = 0; i < logicBoard.fongs.length; i++) {
					_filterResonance = parseInt(v);
					logicBoard.fongs[i].setOscFilterResonance(_filterResonance * 10);
				}
			}
		});

		$("#env1Control").val(this.board.primaryOffsetMax);

		$("#env1Control").knob({
			'stopper': true,
			'height': 90,
			'change': function (v) {
				self.env1Control = v;
				logicBoard.primaryOffsetMax = parseInt(v);
				logicBoard.setPrimaryOffsetFromFong(pad.fongDots[0]);
				logicBoard.setSecondaryOffsetFromFong(pad.fongDots[1]);
			}
		});

		$("#env2Control").val(this.board.secondaryOffsetMax);

		$("#env2Control").knob({
			'stopper': true,
			'height': 90,
			'change': function (v) {
				self.evn2Control = v;
				logicBoard.secondaryOffsetMax = parseInt(v);
				logicBoard.setSecondaryOffsetFromFong(pad.fongDots[1]);
			}
		});

		$("#portamentoControl").val(this.board.portamento);

		$("#portamentoControl").knob({
			'stopper': true,
			'height': 90,
			'change': function (v) {
				self.portamentoControl = v;
				logicBoard.portamento = parseInt(v);
			}
		});

		$("#filterPortamentoControl").val(this.board.filterPortamento);

		$("#filterPortamentoControl").knob({
			'stopper': true,
			'height': 90,
			'change': function (v) {
				self.filterPortamento = v;
				logicBoard.filterPortamento = parseInt(v);
			}
		});
		$("#delayVolumeControl").val(parseInt(this.board.delayVolume * 100));

		$("#delayVolumeControl").knob({
			'stopper': true,
			'height': 90,
			'change': function (v) {
				self.delayVolumeControl = v;
				logicBoard.delayVolume = v / 100.0;
				for (var i = 0; i < logicBoard.fongs.length; i++) {
					logicBoard.fongs[i].setDelayVolume(logicBoard.delayVolume);
				}
			}
		});

		$("#delayTimeControl").val(parseInt(this.board.delayTime * 1000));

		$("#delayTimeControl").knob({
			'stopper': true,
			'height': 90,
			'change': function (v) {
				self.delayTimeControl = v;
				logicBoard.delayTime = v / 1000.0;
				for (var i = 0; i < logicBoard.fongs.length; i++) {
					logicBoard.fongs[i].setDelayTime(logicBoard.delayTime);
				}
			}
		});

		$("#delayFeedbackControl").val(parseInt(this.board.delayFeedback * 10));

		$("#delayFeedbackControl").knob({
			'stopper': true,
			'height': 90,
			'change': function (v) {
				self.delayFeedbackControl = v;
				logicBoard.delayFeedback = v / 10.0;
				for (var i = 0; i < logicBoard.fongs.length; i++) {
					logicBoard.fongs[i].setDelayFeedback(logicBoard.delayFeedback);
				}
			}
		});

		$('#soundControlsDiv').css('max-height', (window.innerHeight - 60) + "px");

		$('.page').css('max-height', window.innerHeight + "px");

		$scope.IsSelectedFilterType = function (filterType) {
			return filterType === _filterType;
		}

		$scope.changeFilterType = function (event) {

			_filterType = $(event.target).html().trim();

			for (var i = 0; i < logicBoard.fongs.length; i++) {
				logicBoard.fongs[i].setFilterType(_filterType);
			}
		}

		$scope.IsSelectedOsc1Type = function (type) {
			return logicBoard.fongs[0].osc.type == type;
		}

		$scope.changeOsc1Type = function (event) {

			var oscType = $(event.target).html().trim();
			self.osc1Type = oscType;
			//logicBoard.fongs[0].osc.type = oscType;
			pad.fongDots[0].selectedStateIndex = pad.fongDots[0].states.indexOf(oscType);
			pad.fongDots[0].selectedState = oscType;
		}

		$scope.IsSelectedOsc2Type = function (type) {
			return logicBoard.fongs[1].osc.type == type;
		}

		$scope.changeOsc2Type = function (event) {

			var oscType = $(event.target).html().trim();

			self.osc2Type = oscType;
			pad.fongDots[1].selectedStateIndex = pad.fongDots[0].states.indexOf(oscType);
		}

		$scope.IsSelectedOsc1EnvType = function (envType) {
			return logicBoard.fongs[0].oscGainCtrl.type == envType;
		}

		$scope.IsSelectedOsc2EnvType = function (envType) {
			return logicBoard.fongs[1].oscGainCtrl.type == envType;
		}

		$scope.changeOsc1EnvType = function (event) {

			var oscType = $(event.target).html().trim();
			self.osc1EnvType = oscType;
			logicBoard.fongs[0].oscGainCtrl.type = oscType;
		}

		$scope.changeOsc2EnvType = function (event) {

			var oscType = $(event.target).html().trim();
			self.osc2EnvType = oscType;
			logicBoard.fongs[1].oscGainCtrl.type = oscType;
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
	};
})();