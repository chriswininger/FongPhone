(function () {
	try {

		function generateScale(fong, startingNote, octave, scale) {

			fong.availableNotes.length = 0;

			var n = teoria.note(startingNote + octave);
			var scale = n.scale(scale).simple();

			for (var i = 0; i < scale.length; i++) {
				var n = {
					'label': scale[i],
					'freq': teoria.note(scale[i] + octave).fq(),
					'on': true
				};

				fong.availableNotes.push(n);				
			}

		}

		var rowSize = 1;

		window.PhonePhong.UI.NoteMap = function ($scope, $window) {			

			$('#mapSubUI').css('height', (window.innerHeight - 40) + "px");
			$('#mapUI').css('max-height', window.innerHeight + "px");

			$scope.selectedFong = logicBoard.fongs[0];
			$scope.Fong1Selected = true;

			$scope.windowHeight = $window.innerHeight;
			$scope.Math = {};
			$scope.Math.floor = Math.floor;

			$scope.NoteMapOn = $scope.selectedFong.NoteMapOn;
			$scope.FilterNoteMapOn = window.PhonePhong.FilterNoteMapOn;

			$scope.toggleSelectedFong = function (i) {
				$scope.selectedFong = logicBoard.fongs[i];
				
				$scope.Fong1Selected = i == 0;
				$scope.Fong2Selected = i == 1;
				
				$scope.NoteMapOn = $scope.selectedFong.NoteMapOn;
				
				if (!$scope.selectedFong.NoteMap)
				{
					$scope.regenerateMap($scope.selectedFong);
				}
				
				$scope.availableNotesByRow = $scope.selectedFong.availableNotesByRow;
			}

			$scope.noteClick = function (row, col) {
				$scope.selectedFong.availableNotesByRow[row][col].on = !$scope.selectedFong.availableNotesByRow[row][col].on;
				// update mapped notes
				$scope.selectedFong.NoteMap = buildMap($scope.selectedFong.availableNotes);
			};

			$scope.onNoteDropComplete = function($index, $data, $event) {
				var originalFreqObj = $scope.selectedFong.availableNotesByRow[$data];
				var currFreqObj =  $scope.selectedFong.availableNotesByRow[$index];

				// TODO (CAW) We reall don't need to maintain available notes by row anymore
				// swap notes
				$scope.selectedFong.availableNotesByRow[$index] = originalFreqObj;
				$scope.selectedFong.availableNotesByRow[$data] = currFreqObj;
				$scope.selectedFong.availableNotes[$index] = originalFreqObj[0];
				$scope.selectedFong.availableNotes[$data] = currFreqObj[0];

				$scope.selectedFong.NoteMap = buildMap($scope.selectedFong.availableNotes);
			};

			$scope.toggleNoteMapClick = function () {
				$scope.selectedFong.NoteMapOn = !$scope.selectedFong.NoteMapOn;
			};
			$scope.toggleFilterNoteMapClick = function () {
				$scope.selectedFong.FilterNoteMapOn = !$scope.selectedFong.FilterNoteMapOn;
			};

			//$scope.selectedFong.SelectedScale = _scale;
			$scope.IsSelectedScale = function (scale) {
				return scale === $scope.selectedFong.SelectedScale;
			}
			$scope.IsSelectedBaseNote = function (baseNote) {
				return baseNote === $scope.selectedFong.baseNote;
			}
			$scope.IsSelectedOctave = function (octave) {
				return octave === $scope.selectedFong.octave;	
			}
			$scope.changeBaseNote = function (event) {

				$scope.selectedFong.baseNote = $(event.target).html().trim();

				$scope.regenerateMap($scope.selectedFong);			
			}
			$scope.changeOctave = function (event) {

				$scope.selectedFong.octave = parseInt($(event.target).html().trim());

				$scope.regenerateMap($scope.selectedFong);			
			}
			$scope.changeScale = function (event) {

				$scope.selectedFong.SelectedScale = $(event.target).html().trim();
				$scope.selectedFong.scale = $scope.selectedFong.SelectedScale;

				$scope.regenerateMap($scope.selectedFong);
			};

			$scope.regenerateMap = function (fong) {
				generateScale(fong, fong.baseNote, fong.octave, fong.SelectedScale);

				fong.availableNotesByRow = [];

				var currentRow = [];
				for (var i = 0; i < fong.availableNotes.length; i++) {
					if (currentRow.length < rowSize) {
						currentRow.push(fong.availableNotes[i]);
					} else {
						fong.availableNotesByRow.push(currentRow);
						currentRow = [fong.availableNotes[i]];
					}

					// take care of partially filled row at end
					if (i === (fong.availableNotes.length - 1) && currentRow.length > 0) {
						fong.availableNotesByRow.push(currentRow);
					}
				}
				
				$scope.availableNotesByRow = $scope.selectedFong.availableNotesByRow;
				$scope.selectedFong.NoteMap = buildMap($scope.selectedFong.availableNotes);
			}

			$scope.selectedFong.availableNotesByRow = [];

			var currentRow = [];
			for (var i = 0; i < $scope.selectedFong.availableNotes.length; i++) {
				if (currentRow.length < rowSize) {
					currentRow.push($scope.selectedFong.availableNotes[i]);
				} else {
					$scope.selectedFong.availableNotesByRow.push(currentRow);
					currentRow = [$scope.selectedFong.availableNotes[i]];
				}

				// take care of partially filled row at end
				if (i === ($scope.selectedFong.availableNotes.length - 1) && currentRow.length > 0) {
					$scope.selectedFong.availableNotesByRow.push(currentRow);
				}
			}

			// position swipe pad for page switching
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

			var f = logicBoard.fongs[0];
			generateScale(f, f.baseNote, f.octave, f.scale);
			var f1 = logicBoard.fongs[1];
			generateScale(f1, f1.baseNote, f1.octave, f1.scale);
			
			$scope.regenerateMap(f);
			$scope.regenerateMap(f1);

		};

		function buildMap(notes) {
			var rtn = [];
			notes.forEach(function (note) {
				if (note.on) rtn.push(note);
			});
			return rtn;
		}

		//window.PhonePhong.NoteMap = buildMap($scope.selectedFong.availableNotes);
	} catch (err) {
		alert(err.message);
	}
})();