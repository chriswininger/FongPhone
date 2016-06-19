(function() {
	FongPhone.Utils.GalleryDisplayEvents = function(logicBoard, pad, noteMap) {
		this.logicBoard = logicBoard;
		this.pad = pad;
		this.noteMap = noteMap;
		this.padState = {};
		this.stateChangeDebouncer = _.debounce(_.bind(this.sendState, this), 1000);
	};

	_.extend(FongPhone.Utils.GalleryDisplayEvents.prototype, {
		sendState: function() {
			// broad cast current state back to server
			this._socket.emit('displayserver:event:state', [
				{
					slot: 'soundBoard',
					state: this.padState
				},
				{
					slot: 'noteMap',
					state: {}
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

				self.padState[fong.id] = self.padState[fong.id] || {};
				switch (data.eventType) {
					case 'osc:env:type':
						self.padState[fong.id].oscGainCtrlType = data.value;
						fong.boardInput.oscGainCtrl.type = data.value;
						break;
					case 'osc:type':
						self.padState[fong.id].selectedStateIndex = data.value;
						fong.selectedStateIndex = fong.states.indexOf(data.value)
						fong.selectedState = data.value;
						break;
					case 'delay:feedback':
						self.padState[fong.id].delayFeedbackControl = data.value;
						logicBoard.delayFeedback = data.value / 10.0;
						fong.boardInput.setDelayFeedback(logicBoard.delayFeedback);
						break;
					case 'delay:time':
						self.padState[fong.id].delayTime = data.value;
						logicBoard.delayTimeControl = data.value / 1000.0;
						fong.boardInput.setDelayTime(logicBoard.delayTime);
						break;
					case 'delay:volume':
						self.padState[fong.id].delayVolumeControl = data.value;
						logicBoard.delayVolume = data.value / 100.0;
						fong.boardInput.setDelayVolume(logicBoard.delayVolume);
						break;
					case 'portamento:filter':
						self.padState.filterPortamento = data.value;
						logicBoard.filterPortamento = data.value;
						break;
					case 'portamento':
						self.padState.portamento = data.value;
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

						self.padState.env1Control = data.value;

						break;
					case 'filter:resonance':
						self.padState[fong.id].filterResonance = data.value;
						fong.boardInput.setOscFilterResonance(data.value);
						break;
					case 'filter:on':
						self.padState[fong.id].filterStatus = data.value;
						logicBoard.setFilterStatus(data.value);
						break;
					case 'filter:type':
						self.padState[fong.id].filterType = data.value;
						fong.boardInput.setFilterType(data.value);
						break;
				}

				self.stateChangeDebouncer();
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
						if (data.slot === 'pad1') {
							/*self.pad.fongDotsByID[0].boardInput.setOscVol(0);
							self.pad.fongDotsByID[0].boardInput.setDelayVolume(0);
							self.pad.fongDotsByID[1].boardInput.setOscVol(0);
							self.pad.fongDotsByID[1].boardInput.setDelayVolume(0);*/
							//this.delay.connect(mainVol);
							//this.oscPanCtrl.connect(mainVol);
							self.pad.fongDotsByID[0].boardInput.transitionToFadeOutput(0, 6);
							//.setChainOutputVol(0);
							self.pad.fongDotsByID[1].boardInput.transitionToFadeOutput(0, 6);
							//.setChainOutputVol(0);
						} else if (data.slot === 'pad2') {
							/*self.pad.fongDotsByID[2].boardInput.setOscVol(0);
							self.pad.fongDotsByID[2].boardInput.setDelayVolume(0);
							self.pad.fongDotsByID[3].boardInput.setOscVol(0);
							self.pad.fongDotsByID[3].boardInput.setDelayVolume(0);*/
							self.pad.fongDotsByID[2].boardInput.transitionToFadeOutput(0, 6);
							//.setChainOutputVol(0);
							self.pad.fongDotsByID[3].boardInput.transitionToFadeOutput(0, 6);//.setChainOutputVol(0);
						}

						break;
					case 'connect':
						if (data.slot === 'pad1') {
							/*self.pad.fongDotsByID[0].boardInput.setOscVol(connectedVol);
							self.pad.fongDotsByID[0].boardInput.setDelayVolume(1);
							self.pad.fongDotsByID[1].boardInput.setOscVol(connectedVol);
							self.pad.fongDotsByID[1].boardInput.setDelayVolume(1);*/
							self.pad.fongDotsByID[0].boardInput.setChainOutputVol(1);
							self.pad.fongDotsByID[1].boardInput.setChainOutputVol(1);
						} else if (data.slot === 'pad2') {
							/*self.pad.fongDotsByID[2].boardInput.setOscVol(connectedVol);
							self.pad.fongDotsByID[2].boardInput.setDelayVolume(1);
							self.pad.fongDotsByID[3].boardInput.setOscVol(connectedVol);
							self.pad.fongDotsByID[3].boardInput.setDelayVolume(1);*/
							self.pad.fongDotsByID[2].boardInput.setChainOutputVol(1);
							self.pad.fongDotsByID[3].boardInput.setChainOutputVol(1);
						}
				}
			});
		}
	});
})();