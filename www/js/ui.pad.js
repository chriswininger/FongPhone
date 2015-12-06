/**
 * Latest thoughts on controls:
 *  Distance from center of each dot will control the offset, but sliders on the edge of the screen will
 *  let you move both dots up and down, or left and right as a group with fixed relative positions
 *    (Doesn't really work though, moving one pitch up would pitch shift the other one)
 *
 * Pinching/zoom will let you make dots bigger/smaller to control the volume
 *   double tab dot will turn it off/on
 * @type {{}|*|Window.PhonePhong}
 */
(function () {
	FongPhone.UI.Pad = function (board, state) {
		var self = this;

		// TODO (CAW) This is being assigned to a global declared in ns file (let's clean this up)
		uiPad = this;
		this.svgElementID = 'phongUIGrid';

		this.board = board;

		this.roleHandlers = {
			primary: {
				positionChanged: _.bind(this.handlePositionChangedPrimary, this),
				fadeChangedHandler: _.bind(this.handleFadeChanged, this),
				handleFongSelected: _.bind(this.handleFongSelected, this),
				classTypeChangeHandler: _.bind(this.classTypeChangeHandler, this),
				stateChangedHandler: _.bind(this.stateChangedHandler, this),
				radiusChangeHandler: _.bind(this.radiusChangeHandler, this),
				initializer: _.bind(this.fongInitializer, this)
			},
			secondary: {
				positionChanged: _.bind(this.handlePositionChangedSecondary, this),
				fadeChangedHandler: _.bind(this.handleFadeChanged, this),
				handleFongSelected: _.bind(this.handleFongSelected, this),
				classTypeChangeHandler: _.bind(this.classTypeChangeHandler, this),
				stateChangedHandler: _.bind(this.stateChangedHandler, this),
				radiusChangeHandler: _.bind(this.radiusChangeHandler, this),
				initializer: _.bind(this.fongInitializer, this)
			}
		};

		this.set(state);
	};

	_.extend(FongPhone.UI.Pad.prototype, {
		attachToDom: function(attachChildren) {
			// make changes to dom to create ui
			this.createComponents();
			// set up dom events
			this.listen();

			// make sure each fong gets re-attached
			_.each(this.fongDots, function(fong) { fong.attachToDom(); });

		},
		createComponents: function () {
			$('#' + this.svgElementID).height(window.innerHeight);
			if (navByClick)
			{
				FongPhone.UI.Helper.registerClickNavigation(this, 'ui.pad.state', 'uiPadSwipeBottom', '#/note-map');
			}
			if (navBySwipe)
			{
				FongPhone.UI.Helper.registerSwipeNavigation(this, 'ui.pad.state', 'uiPadSwipeBottom', '#/note-map', Hammer.DIRECTION_RIGHT);
				FongPhone.UI.Helper.registerSwipeNavigation(this, 'ui.pad.state', 'uiPadSwipeBottom', '#/sound', Hammer.DIRECTION_LEFT);
			}

			this.backgroundPad = document.getElementById(this.svgElementID);

			document.getElementById('uiPadSwipeBottom').setAttribute('y', window.innerHeight - uiPadSwipeBottom.getAttribute('height'));
			document.getElementById('version').setAttribute('y', window.innerHeight - 50);
			document.getElementById('version').setAttribute('x', window.innerWidth - 60);
			
			if (!bVersionDisplayed)
			{
				$.get("version.txt", function (data) {
					var v = document.getElementById("version");
					v.textContent = data;
					bVersionDisplayed = $(v).fadeOut(10000);
				});
			}
		},
		listen: function () {
			var svgElem = document.getElementById(this.svgElementID);

			// store the function wrapper returned from bind so we can clean up after dom is refreshed
			this._handleBackGroundTouchStart = _.bind(this.handleBackGroundTouchStart, this);
			this._handleTouchEnd = _.bind(this.handleBackGroundTouchEnd, this);

			// remove any listeners attached to dead dom nodes
			svgElem.removeEventListener('touchmove', _stopDefault);
			if (this._handleBackGroundTouchStart)
				this.backgroundPad.removeEventListener('touchstart', this._handleBackGroundTouchStart);
			if (this._handleTouchEnd)
				this.backgroundPad.removeEventListener('touchend', this._handleTouchEnd);

			svgElem.addEventListener('touchmove', _stopDefault, false);
			this.backgroundPad.addEventListener('touchstart', this._handleBackGroundTouchStart);
			this.backgroundPad.addEventListener('touchend', this._handleTouchEnd);

			function _stopDefault(e) {
				// Cancel the event
				e.preventDefault();
			}
		},
		fongInitializer: function(fong) {
			// listen for map info changes on the sound board fong that is associated with this ui/fong
			fong.boardInput.noteMapChanged.add(function() {
				// cheep way to trigger position updated and regenerate frequency with new map info
				fong.x = fong.x;
			});
		},
		handleFadeChanged: function (fong) {
			// TODO (CAW) -- range should reflect size of outer sphere
			fong.boardInput.setFade(map(fong.fadeOffset, -35, 35, -2, 2));
		},
		handlePositionChangedPrimary: function (fong, oldX, oldY) {
			var freq = this.getFreq(fong.x, fong.y, fong.radius, fong);
			var ffreq = this.getFilterFrequency(fong.x, fong.y, fong.radius, fong);

			fong.boardInput.setOscFreq(freq);
			fong.boardInput.setOscFilterFreq(ffreq);

			// update offsets
			try {
				this.board.setPrimaryOffsetFromFong(fong);
				this.board.setSecondaryOffsetFromFong(this.fongDotsByRole.secondary);
			} catch (err) {
				alert(err.message);
			}
		},
		handlePositionChangedSecondary: function (fong) {
			var freq = this.getFreq(fong.x, fong.y, fong.radius, fong);
			var ffreq = this.getFilterFrequency(fong.x, fong.y, fong.radius, fong);

			fong.boardInput.setOscFreq(freq);
			fong.boardInput.setOscFilterFreq(ffreq);

			// update offsets
			this.board.setSecondaryOffsetFromFong(fong);
		},
		getFreq: function (x, y, r, fong) {
			var f = fong.boardInput;
			if (!f.NoteMapInfo.NoteMapOn || !f.NoteMapInfo.NoteMap) {
				return map(y / 2, (r / 2), window.innerHeight - r, 0, this.board.osc1MaxFreq);
			} else {
				// ?? freq2 map(y, (r/2), window.innerHeight - target.getAttribute('height'), 0, self.board.osc1MaxFreq)
				var noteNumber = Math.floor(y * f.NoteMapInfo.NoteMap.length / window.innerHeight);
				var note = f.NoteMapInfo.NoteMap[noteNumber];
				if (!note) note = f.NoteMapInfo.NoteMap[f.NoteMapInfo.NoteMap.length - 1];
				return note.freq;
			}
		},
		getFilterFrequency: function (x, y, r, fong) {
			var f = fong.boardInput;
			if (!f.NoteMapInfo.FilterNoteMapOn || !f.NoteMapInfo.NoteMap) {
				return map(x / 2, (r / 2), window.innerWidth - r, 0, this.board.osc1MaxFreq);
			} else {
				var fnoteNumber = Math.floor(x * f.NoteMapInfo.NoteMap.length / window.innerWidth);
				var fnote = f.NoteMapInfo.NoteMap[fnoteNumber];
				if (!fnote) fnote = f.NoteMapInfo.NoteMap[f.NoteMapInfo.NoteMap.length - 1];
				return fnote.freq;
			}
		},
		handleBackGroundTouchEnd: function (event) {
			// TODO (CAW) Shift background touch to here, so it comes after swipe detection
		},
		handleFongSelected: function (fong) {
			this.lastSelectedFong = fong;
		},
		handleBackGroundTouchStart: function (event) {
			if (event.target !== this.backgroundPad) return;
			if (this.lastSelectedFong) {
				var touch = event.targetTouches[0];

				this.lastSelectedFong.x = touch.pageX;
				this.lastSelectedFong.y = touch.pageY;
			}
		},
		classTypeChangeHandler: function (fong, index, pulse) {
			if (pulse) fong.boardInput.startOscPulse();
			else fong.boardInput.stopOscPulse();
		},
		stateChangedHandler: function (fong, index, state) {
			fong.boardInput.setOscType(state);
		},
		radiusChangeHandler: function(fong) {
			fong.boardInput.setOscVol(map(fong.radius, 60, 100, 0.9949676394462585, 5));
		},
		set: function(json) {
			this.fongDots = [];
			// TODO (CAW) more robust would be to store by id (include ids in json and have the id for secondary stored on primary)
			this.fongDotsByRole = {};

			_.each(json.fongDots || [], function(fongJSON) {
				fongJSON.positionChangedHandler = this.roleHandlers[fongJSON.fongRole].positionChanged;
				fongJSON.fadeChangedHandler = this.roleHandlers[fongJSON.fongRole].fadeChangedHandler;
				fongJSON.handleFongSelected = this.roleHandlers[fongJSON.fongRole].handleFongSelected;
				fongJSON.selectedClassChangedHandler = this.roleHandlers[fongJSON.fongRole].classTypeChangeHandler;
				fongJSON.stateChangedHandler = this.roleHandlers[fongJSON.fongRole].stateChangedHandler;
				fongJSON.radiusChangeHandler = this.roleHandlers[fongJSON.fongRole].radiusChangeHandler;
				fongJSON.initializer = this.roleHandlers[fongJSON.fongRole].initializer;

				var fongUI = new FongPhone.UI.Fong(this.board, fongJSON);
				this.fongDotsByRole[fongUI.fongRole] = fongUI;
				this.fongDots.push(fongUI);
			}, this);
		},
		toJSON: function() {
			var state = { fongDots: [] };
			_.each(this.fongDots, function(fong) {
				state.fongDots.push(fong.toJSON());
			});

			return state;
		}
	});

	// --- private helper functions ---
	function map(val, x1, x2, y1, y2) {
		return (val - x1) / (Math.abs(x2 - x1)) * Math.abs(y2 - y1) + y1;
	}
})();