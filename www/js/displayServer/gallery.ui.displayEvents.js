(function() {
	FongPhone.Utils.GalleryDisplayEvents = function(logicBoard, pad, noteMap, soundUI, stateController) {
		this.pad = pad;
		this.noteMap = noteMap;
		this.stateController = stateController;

		// unused currently (see below)
		this.soundUI = soundUI;

		// every 10 seconds send a full state updated
		setInterval(_.bind(this.sendState, this), 10000);
	};

	_.extend(FongPhone.Utils.GalleryDisplayEvents.prototype, {
		sendState: function() {
			// broad cast current state back to server
			this._socket.emit('displayserver:event:state', [
				{
					slot: 'soundBoard',
					state: this.soundUI.toJSON()
				},
				{
					slot: 'noteMap',
					state: this.noteMap.toJSON()
				},
				{
					slot: 'padDisplay',
					state: this.pad.toJSON()
				}
			]);
		},
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
				self.soundUI.selectedFongID = fong.id;

				// self.soundState[fong.id] = self.soundState[fong.id] || {};
				switch (data.eventType) {
					case 'osc:env:type':
						self.soundUI.osc1EnvType = data.value;
						break;
					case 'osc:type':
						self.soundUI.osc1Type = data.value;
						break;
					case 'delay:feedback':
						self.soundUI.delayFeedbackControl = data.value;
						break;
					case 'delay:time':
						self.soundUI.delayTimeControl = data.value;
						break;
					case 'delay:volume':
						self.soundUI.delayVolumeControl = data.value;
						break;
					case 'portamento:filter':
						self.soundUI.filterPortamento = data.value;
						break;
					case 'portamento':
						self.soundUI.portamentoControl = data.value;
						break;
					case 'env':
						self.soundUI.env1Control = data.value;

						break;
					case 'filter:resonance':
						self.soundUI.filterResonance = data.value;
						break;
					case 'filter:on':
						self.soundUI.filterOn = data.value;
						break;
					case 'filter:type':
						self.soundUI.filterType = data.value;
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
						self.noteMap.regenerateMap(fong.boardInput);
						// self.noteMap.resetOctaveForMap(fong.boardInput);

						break;
					case 'note-map-change-scale':
						fong.boardInput.NoteMapInfo.SelectedScale = data.SelectedScale;
						self.noteMap.regenerateMap(fong.boardInput);
						break;
				}
			});

			this._socket.on('server:event:pass', function(data) {
				switch (data.eventType) {
					case 'disconnect':
						// CLIENT DISCONNECT TURN OFF APPROPRIATE FONGS BASED ON PAD
						if (data.slot === 'pad1') {
							self.pad.fongDotsByID[0].boardInput.transitionToFadeOutput(0, 6);
							self.pad.fongDotsByID[1].boardInput.transitionToFadeOutput(0, 6);
						} else if (data.slot === 'pad2') {
							self.pad.fongDotsByID[2].boardInput.transitionToFadeOutput(0, 6);
							self.pad.fongDotsByID[3].boardInput.transitionToFadeOutput(0, 6);
						}

						break;
					case 'connect':
						// CLIENT CONNECT TURN ON APPROPRIATE FONGS BASED ON PAD
						if (data.slot === 'pad1') {
							self.pad.fongDotsByID[0].boardInput.setChainOutputVol(1);
							self.pad.fongDotsByID[1].boardInput.setChainOutputVol(1);
						} else if (data.slot === 'pad2') {
							self.pad.fongDotsByID[2].boardInput.setChainOutputVol(1);
							self.pad.fongDotsByID[3].boardInput.setChainOutputVol(1);
						}
					case 'reset':
						if (data.slot === 'soundBoard') {
							console.log('resetting sound board');
							self.soundUI.set(self.stateController.getSoundState());
						} else if (data.slot === 'noteMap') {
							console.log('resetting note map');
							self.noteMap.set(self.stateController.getMapState());
						}
				}
			});
		}
	});
})();