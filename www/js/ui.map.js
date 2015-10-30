// TODO (CAW) Store the notemaps on the ui.fong.js not the board fongs, then we can restore the notemaps into selected fongs
//  on restore
(function () {
	window.PhonePhong.UI.NoteMap = function(logicBoard, state) {
		window.FongPhone.utils.createGetSet(this, 'selectedFong', this.getSelectedFong, this.setSelectedFong);
		window.FongPhone.utils.createGetSet(this, 'selectedFongIndex', this.getSelectedFongIndex, this.setSelectedFongIndex);

		this.fongs = logicBoard.fongs;
		this.selectedFongIndex = 0;

		_.each(state.fongs, function(_fong, i) {
			// todo (caw) do with ids
			this.fongs[i].NoteMapInfo = _fong.NoteMapInfo;
		}, this);

		var f = this.fongs[0];
		if (!f.NoteMapInfo.NoteMap) {
			this.regenerateMap(f);
		}
		var f1 = this.fongs[1];
		if (!f1.NoteMapInfo.NoteMap) {
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
				self.selectedFong.NoteMapInfo.availableNotes[index].on = !self.selectedFong.NoteMapInfo.availableNotes[index].on;
				// update mapped notes
				self.selectedFong.NoteMapInfo.NoteMap = self.buildMap(self.selectedFong.NoteMapInfo.availableNotes);
			};

			$scope.onNoteDropComplete = function($index, $data) {
				var originalFreqObj = self.selectedFong.NoteMapInfo.availableNotes[$data];
				var currFreqObj =  self.selectedFong.NoteMapInfo.availableNotes[$index];

				// TODO (CAW) We reall don't need to maintain available notes by row anymore
				// swap notes
				self.selectedFong.NoteMapInfo.availableNotes[$index] = originalFreqObj;
				self.selectedFong.NoteMapInfo.availableNotes[$data] = currFreqObj;

				// create a note map in the new order, minus disabled notes
				self.selectedFong.NoteMapInfo.NoteMap = self.buildMap(self.selectedFong.NoteMapInfo.availableNotes);
			};

			$scope.toggleNoteMapClick = function () {
				self.selectedFong.NoteMapInfo.NoteMapOn = !self.selectedFong.NoteMapInfo.NoteMapOn;
			};
			$scope.toggleFilterNoteMapClick = function () {
				self.selectedFong.NoteMapInfo.FilterNoteMapOn = !self.selectedFong.NoteMapInfo.FilterNoteMapOn;
			};

			$scope.IsSelectedScale = function (scale) {
				return scale === self.selectedFong.NoteMapInfo.SelectedScale;
			}
			$scope.IsSelectedBaseNote = function (baseNote) {
				return baseNote === self.selectedFong.NoteMapInfo.baseNote;
			}
			$scope.IsSelectedOctave = function (octave) {
				return octave === self.selectedFong.NoteMapInfo.octave;
			}
			$scope.changeBaseNote = function (event) {
				self.selectedFong.NoteMapInfo.baseNote = $(event.target).html().trim();
				self.regenerateMap(self.selectedFong);
			}
			$scope.changeOctave = function (event) {
				self.selectedFong.NoteMapInfo.octave = parseInt($(event.target).html().trim());
				//$scope.regenerateMap($scope.selectedFong);			
				self.resetOctaveForMap(self.selectedFong);
			}
			$scope.changeScale = function (event) {
				self.selectedFong.NoteMapInfo.SelectedScale = $(event.target).html().trim();
				self.regenerateMap(self.selectedFong);
			};

			PhonePhong.UI.Helper.registerSwipeNavigation(this, 'ui.map.state', 'mapPadSwipeDown', '#/sound', Hammer.DIRECTION_RIGHT, 'swiperight');
			PhonePhong.UI.Helper.registerSwipeNavigation(this, 'ui.map.state', 'mapPadSwipeDown', '#/', Hammer.DIRECTION_LEFT, 'swipeleft');
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
			if (!fong.NoteMapInfo.NoteMap)
				this.regenerateMap(fong);

			if (this.$scope)
				this.$scope.selectedFong = fong;
		},
		getSelectedFongIndex: function() {
			return this._selectedFongIndex;
		},
		setSelectedFongIndex: function(index) {
			this._selectedFongIndex = index;
			this.selectedFong = this.fongs[index];
			if (this.$scope) {
				this.$scope.Fong1Selected = (index === 0);
				this.$scope.Fong2Selected = (index === 1);
			}
		},
		generateScale: function(fong, startingNote, octave, scale) {

			fong.NoteMapInfo.availableNotes = [];
			var n = teoria.note(startingNote + octave);
			var scale = n.scale(scale).simple();

			for (var i = 0; i < scale.length; i++) {
				var n = {
					label: scale[i],
					freq: teoria.note(scale[i] + octave).fq(),
					on: true
				};

				fong.NoteMapInfo.availableNotes.push(n);
			}
		},
		changeOctaveForScale: function(fong) {
			for (var i = 0; i < fong.NoteMapInfo.availableNotes.length; i++) {
				var n = {
					'label': fong.NoteMapInfo.availableNotes[i].label,
					'freq': teoria.note(fong.NoteMapInfo.availableNotes[i].label + fong.NoteMapInfo.octave).fq(),
					'on': true
				};
				fong.NoteMapInfo.availableNotes[i] = n;
			}
		},
		regenerateMap: function (fong) {
			this.generateScale(fong, fong.NoteMapInfo.baseNote, fong.NoteMapInfo.octave, fong.NoteMapInfo.SelectedScale);
			fong.NoteMapInfo.NoteMap = this.buildMap(this.selectedFong.NoteMapInfo.availableNotes);
		},
		resetOctaveForMap: function(fong) {
			this.changeOctaveForScale(fong);
			fong.NoteMapInfo.NoteMap = this.buildMap(fong.NoteMapInfo.availableNotes);
		}
	});

	FongPhone.Utils.Mixins.ToJSON.applyMixin(window.PhonePhong.UI.NoteMap.prototype, [
		'selectedFong'
	]);
})();