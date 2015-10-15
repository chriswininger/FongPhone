var _filterResonance = 5;
var _filterType = "lowpass";
(function () {
	window.PhonePhong.Sound = function ($scope, board, pad) {
		var self = this;
		var svgElementID = 'soundControls';

		this.board = board;
		this.pad = pad;

		$scope.FilterOn = board.FilterOn;

		$scope.toggleFilterClick = function () {
			$scope.FilterOn = !$scope.FilterOn;
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
				logicBoard.secondaryOffsetMax = parseInt(v);
				logicBoard.setSecondaryOffsetFromFong(pad.fongDots[1]);
			}
		});

		$("#portamentoControl").val(this.board.portamento);

		$("#portamentoControl").knob({
			'stopper': true,
			'height': 90,
			'change': function (v) {
				logicBoard.portamento = parseInt(v);
			}
		});

		$("#filterPortamentoControl").val(this.board.filterPortamento);

		$("#filterPortamentoControl").knob({
			'stopper': true,
			'height': 90,
			'change': function (v) {
				logicBoard.filterPortamento = parseInt(v);
			}
		});
		$("#delayVolumeControl").val(parseInt(this.board.delayVolume * 100));

		$("#delayVolumeControl").knob({
			'stopper': true,
			'height': 90,
			'change': function (v) {
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

		$scope.IsSelectedOsc1EnvType = function (envType) {
			return logicBoard.fongs[0].oscGainCtrl.type == envType;
		}

		$scope.IsSelectedOsc2EnvType = function (envType) {
			return logicBoard.fongs[1].oscGainCtrl.type == envType;
		}

		$scope.changeOsc1EnvType = function (event) {

			oscType = $(event.target).html().trim();

			logicBoard.fongs[0].oscGainCtrl.type = oscType;
		}

		$scope.changeOsc2EnvType = function (event) {

			oscType = $(event.target).html().trim();

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
				window.location = '#/';
			}
		});
	};
})();