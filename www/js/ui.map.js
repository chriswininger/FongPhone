// TODO (CAW) Store the notemaps on the ui.fong.js not the board fongs, then we can restore the notemaps into selected fongs
//  on restore
(function () {
	window.PhonePhong.UI.NoteMap = function(logicBoard) {
		window.FongPhone.utils.createGetSet(this, 'selectedFong', this.getSelectedFong, this.setSelectedFong);
		window.FongPhone.utils.createGetSet(this, 'selectedFongIndex', this.getSelectedFongIndex, this.setSelectedFongIndex);

		this.logicBoard = logicBoard;

		this.selectedFongIndex = 0;

		// TODO (get rid of this when we get rid of note/row/map
		this.regenerateMap(this.selectedFong);

		var f = logicBoard.fongs[0];
		if (!f.NoteMap) {
			this.regenerateMap(f);
		}
		var f1 = logicBoard.fongs[1];
		if (!f1.NoteMap) {
			this.regenerateMap(f1);
		}
	};

	_.extend(window.PhonePhong.UI.NoteMap.prototype, {
		attachToDom: function($scope) {
			console.log('height: %s, max-height: %s', (window.innerHeight - 40) + "px", window.innerHeight + "px");
			$('#mapSubUI').css('height', (window.innerHeight - 40) + "px");
			$('#mapUI').css('max-height', window.innerHeight + "px");

			var self = this;
			this.$scope = $scope;

			// re-initialize values with scope set to make sure they propagate to ui
			this.selectedFongIndex = this.selectedFongIndex;

			$scope.toggleSelectedFong = function (i) {
				self.selectedFongIndex = i;
			};

			$scope.noteClick = function (index) {
				self.selectedFong.availableNotes[index].on = !self.selectedFong.availableNotes[index].on;
				// update mapped notes
				self.selectedFong.NoteMap = self.buildMap(self.selectedFong.availableNotes);
			};

			$scope.onNoteDropComplete = function($index, $data) {
				var originalFreqObj = self.selectedFong.availableNotes[$data];
				var currFreqObj =  self.selectedFong.availableNotes[$index];

				// TODO (CAW) We reall don't need to maintain available notes by row anymore
				// swap notes
				self.selectedFong.availableNotes[$index] = originalFreqObj;
				self.selectedFong.availableNotes[$data] = currFreqObj;

				// create a note map in the new order, minus disabled notes
				self.selectedFong.NoteMap = self.buildMap(self.selectedFong.availableNotes);
			};

			$scope.toggleNoteMapClick = function () {
				self.selectedFong.NoteMapOn = !self.selectedFong.NoteMapOn;
			};
			$scope.toggleFilterNoteMapClick = function () {
				self.selectedFong.FilterNoteMapOn = !self.selectedFong.FilterNoteMapOn;
			};

			$scope.IsSelectedScale = function (scale) {
				return scale === self.selectedFong.SelectedScale;
			}
			$scope.IsSelectedBaseNote = function (baseNote) {
				return baseNote === self.selectedFong.baseNote;
			}
			$scope.IsSelectedOctave = function (octave) {
				return octave === self.selectedFong.octave;
			}
			$scope.changeBaseNote = function (event) {
				self.selectedFong.baseNote = $(event.target).html().trim();
				self.regenerateMap(self.selectedFong);
			}
			$scope.changeOctave = function (event) {
				self.selectedFong.octave = parseInt($(event.target).html().trim());
				self.regenerateMap(self.selectedFong);
			}
			$scope.changeScale = function (event) {
				self.selectedFong.SelectedScale = $(event.target).html().trim();
				self.selectedFong.scale = self.selectedFong.SelectedScale;
				self.regenerateMap(self.selectedFong);
			};

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
		},
		// the map is all notes minus the ones turned off
		buildMap: function(notes) {
			var rtn = [];
			notes.forEach(function (note) {
				if (note.on) rtn.push(note);
			});

			return rtn;
		},
		getSelectedFong: function() {
			return this._selectedFong;
		},
		setSelectedFong: function(fong) {
			this._selectedFong = fong;

			// TODO (CAW) Probably don't need if its to build the map
			if (!fong.NoteMap)
				this.regenerateMap(fong);

			if (this.$scope)
				this.$scope.selectedFong = fong;
		},
		getSelectedFongIndex: function() {
			return this._selectedFongIndex;
		},
		setSelectedFongIndex: function(index) {
			this._selectedFongIndex = index;
			this.selectedFong = this.logicBoard.fongs[index];
			if (this.$scope) {
				this.$scope.Fong1Selected = (index === 0);
				this.$scope.Fong2Selected = (index === 1);
			}
		},
		generateScale: function(fong, startingNote, octave, scale) {

			fong.availableNotes = [];

			var n = teoria.note(startingNote + octave);
			var scale = n.scale(scale).simple();

			for (var i = 0; i < scale.length; i++) {
				var n = {
					label: scale[i],
					freq: teoria.note(scale[i] + octave).fq(),
					on: true
				};

				fong.availableNotes.push(n);
			}
		},
		regenerateMap: function (fong) {
			this.generateScale(fong, fong.baseNote, fong.octave, fong.SelectedScale);
			fong.NoteMap = this.buildMap(this.selectedFong.availableNotes);
		}
	});
})();