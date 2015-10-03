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
	window.PhonePhong.UI.Pad = function (board) {
		var self = this;
		var svgElementID = 'phongUIGrid';

		this.board = board;
		// create fong ui representations
		this.FongDots = [];
		this.FongDots.push(new window.FongPhone.UI.Fong(svgElementID, {
			elementID: 'oscTouch1',
			x: this.board.fongs[0].x, // initialize from board for now
			y: this.board.fongs[0].y, // initialize from board for now
			radius: 60,
			color: '#ded6d6',
			fadeOffset: this.board.fongs[1].oscTouchFadeVal, // initialize from board for now
			boardInput: this.board.fongs[0],
			dataIndex: this.FongDots.length, // temporary
			positionChangedHandler: _.bind(this.handlePositionChangedPrimary, this),
			fadeChangedHandler: _.bind(this.handleFadeChanged, this),
			handleFongSelected: _.bind(this.handleFongSelected, this),
			doubleTabHandler: _.bind(this.handleDoubleTap, this),
			longTouchHandler: _.bind(this.handleLongTouch, this)
		}));
		this.FongDots.push(new window.FongPhone.UI.Fong(svgElementID, {
			elementID: 'oscTouch2',
			x: this.board.fongs[1].x, // initialize from board for now
			y: this.board.fongs[1].y, // initialize from board for now
			radius: 60,
			color: '#ded6d6',
			fadeOffset: this.board.fongs[1].oscTouchFadeVal, // initialize from board for now
			boardInput: this.board.fongs[1],
			dataIndex: this.FongDots.length, // temporary
			positionChangedHandler: _.bind(this.handlePositionChangedSecondary, this),
			fadeChangedHandler: _.bind(this.handleFadeChanged, this),
			handleFongSelected: _.bind(this.handleFongSelected, this),
			doubleTabHandler: _.bind(this.handleDoubleTap, this),
			longTouchHandler: _.bind(this.handleLongTouch, this)
		}));

		// make changes to dom to create ui
		self.createComponents();
		// set up dom events
		self.listen();
	};

	_.extend(PhonePhong.UI.Pad.prototype, {
		createComponents: function () {
			$('#phongUIGrid').height(window.innerHeight);
			window.PhonePhong.UI.Helper.registerSwipeNavigation('uiPadSwipeBottom', '#/note-map', Hammer.DIRECTION_RIGHT, 'swiperight');
			window.PhonePhong.UI.Helper.registerSwipeNavigation('uiPadSwipeBottom', '#/sound', Hammer.DIRECTION_LEFT, 'swipeleft');
			this.oscTouchFade1 = document.getElementById('oscTouchFade1');
			this.oscTouchFade2 = document.getElementById('oscTouchFade2');
			this.oscTouch1 = document.getElementById('oscTouch1');
			this.oscTouch2 = document.getElementById('oscTouch2');
			this.backgroundPad = document.getElementById('phongUIGrid');

			document.getElementById('uiPadSwipeBottom').setAttribute('y', window.innerHeight - uiPadSwipeBottom.getAttribute('height'));
		},
		listen: function () {
			this.backgroundPad.addEventListener('touchstart', _.bind(this.handleBackGroundTouchStart, this));
			this.backgroundPad.addEventListener('touchend', _.bind(this.handleBackGroundTouchEnd, this));
		},
		handleFadeChanged: function (fong) {
			// TODO (CAW) -- range should reflect size of outer sphere
			fong.boardInput.setFade(map(-1 * fong.fadeOffset, -35, 35, -2, 2));
		},
		handlePositionChangedPrimary: function (fong, oldX, oldY) {
			var freq = this.getFreq(fong.x, fong.y, fong.radius);
			var ffreq = this.getFilterFrequency(fong.x, fong.y, fong.radius);

			fong.boardInput.setOscFreq(freq);
			fong.boardInput.setOscFilterFreq(ffreq);

			// update offsets
			try {
				this.board.setPrimaryOffsetFromFong(fong);
			} catch (err) {
				alert(err.message);
			}
		},
		handlePositionChangedSecondary: function (fong, oldX, oldY) {
			var freq = this.getFreq(fong.x, fong.y, fong.radius);
			var ffreq = this.getFilterFrequency(fong.x, fong.y, fong.radius);

			fong.boardInput.setOscFreq(freq);
			fong.boardInput.setOscFilterFreq(ffreq);

			// update offsets
			this.board.setSecondaryOffsetFromFong(fong);
		},
		getFreq: function (x, y, r) {
			if (!window.PhonePhong.NoteMapOn) {
				return map(y / 2, (r / 2), window.innerHeight - r, 0, this.board.osc1MaxFreq);
			} else {
				// ?? freq2 map(y, (r/2), window.innerHeight - target.getAttribute('height'), 0, self.board.osc1MaxFreq)
				var noteNumber = parseInt(y * PhonePhong.NoteMap.length / window.innerHeight);
				var note = PhonePhong.NoteMap[noteNumber];
				if (!note) note = PhonePhong.NoteMap[PhonePhong.NoteMap.length - 1];
				return note.freq;
			}

		},
		getFilterFrequency: function (x, y, r) {
			if (!window.PhonePhong.FilterNoteMapOn) {
				return map(x / 2, (r / 2), window.innerWidth - r, 0, this.board.osc1MaxFreq);
			} else {
				var fnoteNumber = parseInt(x * PhonePhong.NoteMap.length / window.innerWidth);
				var fnote = PhonePhong.NoteMap[fnoteNumber];
				if (!fnote) fnote = PhonePhong.NoteMap[PhonePhong.NoteMap.length - 1];
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
		handleDoubleTap: function (fong) {
			log('handleDoubleTap');
			fong.boardInput.toggleOscPulse();
		},
		handleLongTouch: function (fong, event) {
			log('handleLongTouch');
			fong.boardInput.incrementOscillator();
		}
	});

	// --- private helper functions ---
	function map(val, x1, x2, y1, y2) {
		return (val - x1) / (Math.abs(x2 - x1)) * Math.abs(y2 - y1) + y1;
	}
})();