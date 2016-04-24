(function() {
	FongPhone.Utils.GalleryDisplayEvents = function(pad, noteMap) {
		this.pad = pad;
		this.noteMap = noteMap;
	}

	_.extend(FongPhone.Utils.GalleryDisplayEvents.prototype, {
		startRemoteEvents: function() {
			var self = this;

			this._socket = io();
			this._socket.on('fong:event:pass', function (data) {
				switch (data.eventType) {
					// --- Pad ----
					case 'position':
						if (isNaN(data.x))
							return console.warn('not a number');
						if (isNaN(data.y))
							return console.warn('not a number');
						self.pad.fongDotsByRole[data.fongRole].x =
							self.pad.map(data.x, 0, data.winWidth, 0, self.pad.winWidth);
						self.pad.fongDotsByRole[data.fongRole].y =
							self.pad.map(data.y, 0, data.winHeight, 0, self.pad.winHeight);
						break;
					case 'fade':
						self.pad.fongDotsByRole[data.fongRole].fadeOffset = data.fadeOffset;
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
		}
	});
})();