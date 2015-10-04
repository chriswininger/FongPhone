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
				try {
					logicBoard.primaryOffsetMax = parseInt(v);
					logicBoard.setPrimaryOffsetFromFong(pad.FongDots[0]);
					logicBoard.setSecondaryOffsetFromFong(pad.FongDots[1]);
				} catch (err) {
					alert(err.message);
				}
			}
		});

		$("#env2Control").val(this.board.secondaryOffsetMax);

		$("#env2Control").knob({
			'stopper': true,
			'height': 90,
			'change': function (v) {
				logicBoard.secondaryOffsetMax = parseInt(v);
				logicBoard.setSecondaryOffsetFromFong(pad.FongDots[1]);
			}
		});

		$scope.IsSelectedFilterType = function (filterType) {
			return filterType === _filterType;
		}

		$scope.changeFilterType = function (event) {

			$('.ui-map-note-map-base-note').attr('class', 'ui-map-note-map-scale');

			_filterType = $(event.target).html().trim();

			$(event.target).attr('class', 'selectedScale');

			for (var i = 0; i < logicBoard.fongs.length; i++) {
				logicBoard.fongs[i].setFilterType(_filterType);
			}
		}

		var mapPadSwipeDown = document.getElementById('mapPadSwipeDown');
		mapPadSwipeDown.style.top = (window.innerHeight - mapPadSwipeDown.getClientRects()[0].height) + 'px';
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