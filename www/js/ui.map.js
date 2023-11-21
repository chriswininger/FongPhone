// TODO (CAW) Store the notemaps on the ui.fong.js not the board fongs, then we can restore the notemaps into selected fongs
//  on restore
(function () {
	FongPhone.UI.NoteMap = function(logicBoard, state) {
		FongPhone.utils.createGetSet(this, 'selectedFong', this.getSelectedFong, this.setSelectedFong);
		FongPhone.utils.createGetSet(this, 'selectedFongIndex', this.getSelectedFongIndex, this.setSelectedFongIndex);

		this.fongs = logicBoard.fongs;
		this.selectedFongIndex = 0;

		this.set(state);

		var f = this.fongs[0];
		if (!f.NoteMapInfo.NoteMap) {
			this.regenerateMap(f);
		}
		var f1 = this.fongs[1];
		if (!f1.NoteMapInfo.NoteMap) {
			this.regenerateMap(f1);
		}
	};

	_.extend(FongPhone.UI.NoteMap.prototype, {
		attachToDom: function($scope) {
			var heightStatusBar = 20;
			var heightSub = heightStatusBar + FongPhone.Globals.tabbedNavHeight + 8;

			var self = this;
			this.$scope = $scope;

			// $('#mapSubUI').css('height', (window.innerHeight - heightSub) + "px");
			// $('#mapUI').css('max-height', window.innerHeight + "px");

			var loopDurationControl = $('#loopDurationControl');
			var chunkinessControl = $('#chunkinessControl');
			var pullChunkinessControl = $('#pullChunkinessControl');
			var dials = $('.dial');

			// re-initialize values with scope set to make sure they propagate to ui
			this.selectedFongIndex = this.selectedFongIndex;

			$scope.toggleSelectedFong = function (i) {
				self.selectedFongIndex = i;
				
				updateKnobs();
			};
						
			// Fired when a note in the map is clicked
			$scope.noteClick = function (index) {
				self.selectedFong.NoteMapInfo.availableNotes[index].on = !self.selectedFong.NoteMapInfo.availableNotes[index].on;
				// update mapped notes
				self.selectedFong.NoteMapInfo.NoteMap = self.buildMap(self.selectedFong.NoteMapInfo.availableNotes);
			};

			// Fired when dragging a note in the map into position over another
			$scope.onNoteHover = function($event) {
				angular.element(e.target).addClass('hover');
			};

			$scope.onNoteDropComplete = function($index, $data) {
				// find the index of the note that drug based on frequency
				var dragIndex = _.findIndex(self.selectedFong.NoteMapInfo.availableNotes,
					function(entry) {
						return entry.freq === $data.freq
					});

				// if dropped on self ignore
				if ($index === $data) return;

				var originalFreqObj = self.selectedFong.NoteMapInfo.availableNotes[$data];

				self.selectedFong.NoteMapInfo.availableNotes.splice($index, 0, $data);

				if ($index < dragIndex) {
					// moved back in array
					self.selectedFong.NoteMapInfo.availableNotes.splice(dragIndex +1, 1);
				} else {
					self.selectedFong.NoteMapInfo.availableNotes.splice(dragIndex, 1);
				}

				// create a note map in the new order, minus disabled notes
				self.selectedFong.NoteMapInfo.NoteMap = self.buildMap(self.selectedFong.NoteMapInfo.availableNotes);
			};

			$scope.toggleNoteMapClick = function () {
				self.selectedFong.NoteMapInfo.NoteMapOn = !self.selectedFong.NoteMapInfo.NoteMapOn;
			};
			$scope.toggleFilterNoteMapClick = function () {
				self.selectedFong.NoteMapInfo.FilterNoteMapOn = !self.selectedFong.NoteMapInfo.FilterNoteMapOn;
			};
			
			$scope.toggleLoopingClick = function () {
				self.selectedFong.NoteMapInfo.LoopOn = !self.selectedFong.NoteMapInfo.LoopOn;								
			};
			
			$scope.toggleChunkyClick = function () {
				self.selectedFong.NoteMapInfo.makeLoopChunky  = !self.selectedFong.NoteMapInfo.makeLoopChunky;
			};
			
			$scope.togglePullChunkyClick = function () {
				self.selectedFong.NoteMapInfo.pullLoopChunky  = !self.selectedFong.NoteMapInfo.pullLoopChunky;
			};
			
			$scope.clearLoopClick = function () {
				for (var i = 0; i < uiPad.fongDots.length; i++) {
					if (uiPad.fongDots[i].boardInput == self.selectedFong) {
						uiPad.fongDots[i].loopPositions = [];
					}
				}
				
				var target = event.target;
				$(target).animate({
					"opacity": .0
				}, 50, function () {
					$(target).animate({
						"opacity": .8
					}, 500, function () {
						// Animation complete.
					});
				});
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
				// self.regenerateMap(self.selectedFong);
				self.resetOctaveForMap(self.selectedFong);
			}
			$scope.changeScale = function (event) {
				self.selectedFong.NoteMapInfo.SelectedScale = $(event.target).html().trim();
				self.regenerateMap(self.selectedFong);
			};
			
			function getLoopDuration() {
				return self.selectedFong.NoteMapInfo.LoopDuration;
			}
			function setLoopDuration(loopDuration) {
				self.selectedFong.NoteMapInfo.LoopDuration = loopDuration;
			}
			
			function getLoopChunkinessFactor() {
				return self.selectedFong.NoteMapInfo.loopChunkinessFactor;
			}
			function setLoopChunkinessFactor(loopChunkinessFactor) {
				self.selectedFong.NoteMapInfo.loopChunkinessFactor = loopChunkinessFactor / 100.0;
			}
			
			function getLoopPullChunkiness() {
				return self.selectedFong.NoteMapInfo.pullChunkiness;
			}
			function setLoopPullChunkiness(pullChunkiness) {
				self.selectedFong.NoteMapInfo.pullChunkiness = pullChunkiness / 100.0;
			}
			function updateKnobs() {
				loopDurationControl.val(self.selectedFong.NoteMapInfo.LoopDuration);
				loopDurationControl.trigger('change');

				chunkinessControl.val(parseInt(self.selectedFong.NoteMapInfo.loopChunkinessFactor * 100));
				chunkinessControl.trigger('change');

				pullChunkinessControl.val(parseInt(self.selectedFong.NoteMapInfo.pullChunkiness * 100));
				pullChunkinessControl.trigger('change');
			}

			dials.attr("data-fgColor", "rgba(255, 255, 255, .5)");
			dials.attr("data-bgColor", "rgba(255, 255, 255, .1)");
			dials.attr('disabled', 'disabled');

			FongPhone.utils.createGetSet(this, 'loopDuration', getLoopDuration, setLoopDuration);
			FongPhone.utils.createGetSet(this, 'loopChunkinessFactor', getLoopChunkinessFactor, setLoopChunkinessFactor);
			FongPhone.utils.createGetSet(this, 'loopPullChunkiness', getLoopPullChunkiness, setLoopPullChunkiness);

			FongPhone.utils.registerKnob('#loopDurationControl', 'loopDuration', this.selectedFong.NoteMapInfo.LoopDuration, this);
			FongPhone.utils.registerKnob('#chunkinessControl', 'loopChunkinessFactor', this.selectedFong.NoteMapInfo.loopChunkinessFactor, this);
			FongPhone.utils.registerKnob('#pullChunkinessControl', 'loopPullChunkiness', this.selectedFong.NoteMapInfo.pullChunkiness, this);
			
			updateKnobs();
			
			FongPhone.UI.Helper.registerAlertOnFirstView("mapMessage", 'The controls on this view allow you to change the musical properties of each Fong such as scales, octaves and looping behavior. Got it?', 'Notes & Loops');
			
			$("#loopingToggle").on('taphold', function (event) {
				//$('#loopingToggle').css('background-color', "rgba(255,255,255,.8)");
				$(event.target).animate({
					"background-opacity": .8
				}, 50, function () {
					$(event.target).animate({
						"background-opacity": 0
					}, 5000, function () {
						// Animation complete.
					});
				});

				//not how this should be done but we have a design problem here
				for (var i = 0; i < uiPad.fongDots.length; i++) {
					if (uiPad.fongDots[i].boardInput == self.selectedFong) {
						uiPad.fongDots[i].loopPositions = [];
					}
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
			var scale = n.scale(scale);

			for (var i = 1; i <= scale.scale.length; i++) {
				fong.NoteMapInfo.availableNotes.push({
					label: scale.get(i).toString(),
					freq: scale.get(i).fq(),
					on: true
				});
			}
		},
		changeOctaveForScale: function(fong) {
			// change notes in splace, not complete reset
			var n = teoria.note(fong.NoteMapInfo.baseNote + fong.NoteMapInfo.octave);
			var scale = n.scale(fong.NoteMapInfo.SelectedScale);

			for (var i = 0; i < fong.NoteMapInfo.availableNotes.length; i++) {
				fong.NoteMapInfo.availableNotes[i] = {
					label: scale.get(i + 1).toString(),
					freq: scale.get(i + 1).fq(),
					on:  fong.NoteMapInfo.availableNotes[i].on
				};
			}
		},
		regenerateMap: function (fong) {
			this.generateScale(fong, fong.NoteMapInfo.baseNote, fong.NoteMapInfo.octave, fong.NoteMapInfo.SelectedScale);
			fong.NoteMapInfo.NoteMap = this.buildMap(this.selectedFong.NoteMapInfo.availableNotes);
		},
		resetOctaveForMap: function(fong) {
			this.changeOctaveForScale(fong);
			fong.NoteMapInfo.NoteMap = this.buildMap(fong.NoteMapInfo.availableNotes);
		},
		set: function(state) {
			_.each(state.fongs, function(_fong, i) {
				// todo (caw) do with ids
				_.extend(this.fongs[i].NoteMapInfo, _fong.NoteMapInfo);
			}, this);
		}
	});

	FongPhone.Utils.Mixins.ToJSON.applyMixin(FongPhone.UI.NoteMap.prototype, [
		'selectedFong'
	]);
})();