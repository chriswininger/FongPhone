var _availableNotes;
var _scale = 'ionian';
var _baseNote = 'a4';
(function () {
	try {
		_availableNotes = [
			{
				//                label: 'c',
				//                freq: '4186.01',
				//                on: false
            }];

		function generateScale(startingNote, octave, scale) {

			_availableNotes.length = 0;

			var n = teoria.note(startingNote + octave);
			var scale = n.scale(scale).simple();

			for (var i = 0; i < scale.length; i++) {
				var n = {
					'label': scale[i],
					'freq': teoria.note(scale[i] + octave).fq(),
					'on': true
				};

				_availableNotes.push(n);
			}

		}

		generateScale(_baseNote.substr(0, 1), _baseNote.substr(1, 1), _scale);

		var rowSize = 1;

		window.PhonePhong.UI.NoteMap = function ($scope, $window) {

			//$scope.NoteMap = _availableNotes;
			$scope.windowHeight = $window.innerHeight;
			$scope.Math = {};
			$scope.Math.floor = Math.floor;
			$scope.NoteMapOn = window.PhonePhong.NoteMapOn;
			$scope.FilterNoteMapOn = window.PhonePhong.FilterNoteMapOn;			
			
			$scope.noteClick = function (row, col) {
				$scope.availableNotesByRow[row][col].on = !$scope.availableNotesByRow[row][col].on;
				// update mapped notes
				window.PhonePhong.NoteMap = buildMap(_availableNotes);
			};

			$scope.toggleNoteMapClick = function () {
				window.PhonePhong.NoteMapOn = $scope.NoteMapOn = !window.PhonePhong.NoteMapOn;
			};			
			$scope.toggleFilterNoteMapClick = function () {
				window.PhonePhong.FilterNoteMapOn = $scope.FilterNoteMapOn = !window.PhonePhong.FilterNoteMapOn;
			};

			$scope.SelectedScale = _scale;
			$scope.IsSelectedScale = function (scale) {
				return scale === $scope.SelectedScale;
			}
			$scope.IsSelectedBaseNote = function (baseNote) {
				return baseNote === _baseNote;
			}
			$scope.changeBaseNote = function (event) {

				$('.ui-map-note-map-base-note').attr('class', 'ui-map-note-map-scale');

				_baseNote = $(event.target).html().trim();

				$scope.regenerateMap();

				$(event.target).attr('class', 'selectedScale');

				window.PhonePhong.NoteMap = buildMap(_availableNotes);
			}
			$scope.changeScale = function (event) {

				$('.ui-map-note-map-scale').attr('class', 'ui-map-note-map-scale');

				$scope.SelectedScale = $(event.target).html().trim();
				_scale = $scope.SelectedScale;

				$scope.regenerateMap();

				$(event.target).attr('class', 'selectedScale');

				window.PhonePhong.NoteMap = buildMap(_availableNotes);
			};

			$scope.regenerateMap = function () {
				generateScale(_baseNote.substr(0, 1), _baseNote.substr(1, 1), $scope.SelectedScale);

				$scope.availableNotesByRow = [];

				var currentRow = [];
				for (var i = 0; i < _availableNotes.length; i++) {
					if (currentRow.length < rowSize) {
						currentRow.push(_availableNotes[i]);
					} else {
						$scope.availableNotesByRow.push(currentRow);
						currentRow = [_availableNotes[i]];
					}

					// take care of partially filled row at end
					if (i === (_availableNotes.length - 1) && currentRow.length > 0) {
						$scope.availableNotesByRow.push(currentRow);
					}
				}
			}

			$scope.availableNotesByRow = [];

			var currentRow = [];
			for (var i = 0; i < _availableNotes.length; i++) {
				if (currentRow.length < rowSize) {
					currentRow.push(_availableNotes[i]);
				} else {
					$scope.availableNotesByRow.push(currentRow);
					currentRow = [_availableNotes[i]];
				}

				// take care of partially filled row at end
				if (i === (_availableNotes.length - 1) && currentRow.length > 0) {
					$scope.availableNotesByRow.push(currentRow);
				}
			}

			// position swipe pad for page switching
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

		function buildMap(notes) {
			var rtn = [];
			notes.forEach(function (note) {
				if (note.on) rtn.push(note);
			});
			return rtn;
		}

		window.PhonePhong.NoteMap = buildMap(_availableNotes);
	} catch (err) {
		alert(err.message);
	}
})();


/*var windowHeight = 400;
for (var $index = 0; $index < windowHeight*2; $index++) {
    var y = ($index*20+5) - windowHeight*Math.floor(($index*20+5)/windowHeight);
    console.log(y);
}*/