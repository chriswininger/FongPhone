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
					// --- Pad ----
					case 'addFongs':
						var primarmyIndex = self.logicBoard.createNewFongs(0.9949676394462585,
							0.9949676394462585, 440, 1000
						);

						var fong1 =  new FongPhone.UI.Fong(self.logicBoard, {
							id: primarmyIndex,
							x: 100,
							y: 200,
							radius: 60,
							color: "#ded6d6",
							fadeOffset: 0,
							selectedClassType: true,
							selectedState: "sine",
							gradient: 'grad1',
							domCtxID: "phongUIGrid",
							elementID: "oscTouch3",
							fadeElementID: "oscTouch3Fade",
							boardInputIndex: primarmyIndex,
							fongRole: 'primary',
							states: [
								"sine",
								"square",
								"triangle",
								"sawtooth"
							],
							classes: [
								true,
								false
							]
						});

						var fong2 =  new FongPhone.UI.Fong(self.logicBoard, {
							id: primarmyIndex + 1,
							x: 100,
							y: 200,
							radius: 60,
							color: "#ded6d6",
							fadeOffset: 0,
							selectedClassType: true,
							selectedState: "sine",
							gradient: 'grad1',
							domCtxID: "phongUIGrid",
							elementID: "oscTouch3",
							fadeElementID: "oscTouch3Fade",
							boardInputIndex: primarmyIndex + 1,
							fongRole: 'primary',
							states: [
								"sine",
								"square",
								"triangle",
								"sawtooth"
							],
							classes: [
								true,
								false
							]
						});

						self.pad.fongDots.push(fong1);
						self.pad.fongDots.push(fong2);

						self.pad.fongDotsByID[fong1.id] = fong1;
						self.pad.fongDotsByID[fong2.id] = fong2;

						fong1.attachToDom();
						fong2.attachToDom();

						break;
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