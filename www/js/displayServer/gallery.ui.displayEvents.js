(function() {
	FongPhone.Utils.GalleryDisplayEvents = function(logicBoard, pad, noteMap) {
		this.logicBoard = logicBoard;
		this.pad = pad;
		this.noteMap = noteMap;
	}

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
					// ---- Map ----
					case 'note-toggle':
						break;
					case 'note-drop':
						break;
					case 'note-map-enable':
						break;
					case 'note-map-filter-toggle':
						break;
					case 'note-map-looping-toggle':
						break;
					case 'note-map-chunky-toggle':
						break;
					case 'note-map-chunky-pull-toggle':
						break;
					case 'note-map-clear-loop':
						break;
					case 'note-map-change-base-note':
						break;
					case 'note-map-change-octave':
						console.log('!!! received event: ');
						var fong = self.pad.fongDotsByRole[data.fongRole];
						fong.boardInput.NoteMapInfo.octave = data.octave;
						self.noteMap.resetOctaveForMap(fong.boardInput);

						break;
					case 'note-map-change-scale':
						self.pad.fongDotsByRole[data.fongRole].NoteMapInfo.SelectedScale = data.SelectedScale;
						self.noteMap.regenerateMap(self.selectedFong);
						break;
				}
			});

			this._socket.on('sound:event:pass', function(data) {
				var fong;

				if (typeof data.id === 'number')
					fong = self.pad.fongDotsByID[data.id];

				switch (data.eventType) {
					case 'osc:env:type':
						if (!fong) return console.warn('no fong for event ' + data.eventType);
						fong.boardInput.oscGainCtrl.type = data.value;
						break;
					case 'osc:type':
						if (!fong) return console.warn('no fong for event ' + data.eventType);
						fong.selectedStateIndex = fong.states.indexOf(data.value)
						fong.selectedState = data.value;
						break;
					case 'delay:feedback':
						logicBoard.delayFeedback = data.value / 10.0;
						for (var i = 0; i < logicBoard.fongs.length; i++) {
							logicBoard.fongs[i].setDelayFeedback(logicBoard.delayFeedback);
						}
						break;
					case 'delay:time':
						logicBoard.delayTime = data.value / 1000.0;
						for (var i = 0; i < logicBoard.fongs.length; i++) {
							logicBoard.fongs[i].setDelayTime(logicBoard.delayTime);
						}
						break;
					case 'delay:volume':
						logicBoard.delayVolume = data.value / 100.0;
						for (var i = 0; i < logicBoard.fongs.length; i++) {
							logicBoard.fongs[i].setDelayVolume(logicBoard.delayVolume);
						}
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
						for (var i = 0; i < logicBoard.fongs.length; i++) {
							logicBoard.fongs[i].setOscFilterResonance(data.value);
						}

						break;
					case 'filter:on':
						console.log('!!! on: ' + data.value + ' (' + (typeof data.value) + ')');
						logicBoard.setFilterStatus(data.value);
						break;
					case 'filter:type':
						for (var i = 0; i < logicBoard.fongs.length; i++) {
							logicBoard.fongs[i].setFilterType(data.value);
						}
						break;
				}
			});
		}
	});
})();