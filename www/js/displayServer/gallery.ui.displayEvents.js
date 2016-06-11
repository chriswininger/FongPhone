(function() {
	FongPhone.Utils.GalleryDisplayEvents = function(logicBoard, pad, noteMap) {
		this.logicBoard = logicBoard;
		this.pad = pad;
		this.noteMap = noteMap;
	};

	_.extend(FongPhone.Utils.GalleryDisplayEvents.prototype, {
		startRemoteEvents: function() {
			var self = this;

			this._socket = io('/display');
			this._socket.on('fong:event:pass', function (data) {
				switch (data.eventType) {
					case 'position':
						if (isNaN(data.x))
							return console.warn('not a number');
						if (isNaN(data.y))
							return console.warn('not a number');
						self.pad.fongDotsByID[data.id].x =
							self.pad.map(data.x, 0, data.winWidth, 0, self.pad.winWidth);
						self.pad.fongDotsByID[data.id].y =
							self.pad.map(data.y, 0, data.winHeight, 0, self.pad.winHeight);
						break;
					case 'fade':
						self.pad.fongDotsByID[data.id].fadeOffset = data.fadeOffset;
						break;
				};
			});

			this._socket.on('sound:event:pass', function(data) {
				var fong;

				if (typeof data.id === 'number')
					fong = self.pad.fongDotsByID[data.id];

				if (!fong) return console.warn('no fong for event ' + data.eventType);

				switch (data.eventType) {
					case 'osc:env:type':
						fong.boardInput.oscGainCtrl.type = data.value;
						break;
					case 'osc:type':
						if (!fong) return console.warn('no fong for event ' + data.eventType);
						fong.selectedStateIndex = fong.states.indexOf(data.value)
						fong.selectedState = data.value;
						break;
					case 'delay:feedback':
						logicBoard.delayFeedback = data.value / 10.0;
						fong.boardInput.setDelayFeedback(logicBoard.delayFeedback);
						break;
					case 'delay:time':
						logicBoard.delayTime = data.value / 1000.0;
						fong.boardInput.setDelayTime(logicBoard.delayTime);
						break;
					case 'delay:volume':
						logicBoard.delayVolume = data.value / 100.0;
						fong.boardInput.setDelayVolume(logicBoard.delayVolume);
						break;
					case 'portamento:filter':
						logicBoard.filterPortamento = data.value;
						break;
					case 'portamento':
						logicBoard.portamento = data.value;
						break;
					case 'env':
						if (fong.fongRole === 'primary') {
							logicBoard.primaryOffsetMax = data.value;
						} else {
							logicBoard.secondaryOffsetMax = data.value;
						}

						for (var i = 0; i < self.pad.fongDots.length; i++) {
							if (self.pad.fongDots[i].fongRole === 'primary')
								logicBoard.setPrimaryOffsetFromFong(self.pad.fongDots[i]);
							else
								logicBoard.setSecondaryOffsetFromFong(self.pad.fongDots[i]);
						}

						break;
					case 'filter:resonance':
						fong.boardInput.setOscFilterResonance(data.value);
						break;
					case 'filter:on':
						logicBoard.setFilterStatus(data.value);
						break;
					case 'filter:type':
						fong.boardInput.setFilterType(data.value);
						break;
				}
			});

			this._socket.on('map:event:pass', function(data) {
				var fong;

				if (typeof data.id === 'number')
					fong = self.pad.fongDotsByID[data.id];

				if (!fong) return console.warn('no fong for event ' + data.eventType);

				switch (data.eventType) {
					// ---- Map ----
					case 'note-toggle':
						fong.boardInput.NoteMapInfo.availableNotes[data.availableNotesIndex].on = data.on;

						// update mapped notes
						fong.boardInput.NoteMapInfo.NoteMap = self.noteMap.buildMap(fong.boardInput.NoteMapInfo.availableNotes);
						break;
					case 'note-drop':
						fong.boardInput.NoteMapInfo.availableNotes.splice(data.noteIndex, 0, data.$data);

						if (data.noteIndex < data.dragIndex) {
							// moved back in array
							fong.boardInput.NoteMapInfo.availableNotes.splice(data.dragIndex +1, 1);
						} else {
							fong.boardInput.NoteMapInfo.availableNotes.splice(data.dragIndex, 1);
						}

						// create a note map in the new order, minus disabled notes
						fong.boardInput.NoteMapInfo.NoteMap = self.noteMap.buildMap(fong.boardInput.NoteMapInfo.availableNotes);

						break;
					case 'note-map-enable':
						fong.boardInput.NoteMapInfo.NoteMapOn = data.NoteMapOn;
						break;
					case 'note-map-filter-toggle':
						fong.boardInput.NoteMapInfo.FilterNoteMapOn = data.FilterNodeMapOn;
						break;
					case 'note-map-looping-toggle':
						return console.warn('looping not supported');
						break;
					case 'note-map-chunky-toggle':
						return console.warn('looping not supported');
						break;
					case 'note-map-chunky-pull-toggle':
						return console.warn('looping not supported');
						break;
					case 'note-map-clear-loop':
						return console.warn('looping not supported');
						break;
					case 'note-map-change-base-note':
						fong.boardInput.NoteMapInfo.baseNote = data.baseNote;
						self.noteMap.regenerateMap(fong.boardInput);
						break;
					case 'note-map-change-octave':
						fong.boardInput.NoteMapInfo.octave = data.octave;
						self.noteMap.resetOctaveForMap(fong.boardInput);

						break;
					case 'note-map-change-scale':
						fong.boardInput.NoteMapInfo.SelectedScale = data.SelectedScale;
						self.noteMap.regenerateMap(fong.boardInput);
						break;
				}
			});
		}
	});
})();