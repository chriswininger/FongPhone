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
	FongPhone.UI.Pad = function (subSpace, board, state, socket) {
		var self = this;
		this._positionDebouncers = {};
		this._fadeDebouncers = {};
		this.subSpace = subSpace;

		// TODO (CAW) This is being assigned to a global declared in ns file (let's clean this up)
		uiPad = this;
		this.svgElementID = 'phongUIGrid';

		this.board = board;
		this._socket = socket;

		this.roleHandlers = {
			primary: {
				positionChanged: _.bind(this.positionChanged, this),
				fadeChangedHandler: _.bind(this.handleFadeChanged, this),
				handleFongSelected: _.bind(this.handleFongSelected, this),
				classTypeChangeHandler: _.bind(this.classTypeChangeHandler, this),
				stateChangedHandler: _.bind(this.stateChangedHandler, this),
				radiusChangeHandler: _.bind(this.radiusChangeHandler, this),
				initializer: _.bind(this.fongInitializer, this)
			},
			secondary: {
				positionChanged: _.bind(this.positionChanged, this),
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
		adjustHeightWidth: function() {
			this.winHeight = window.innerHeight;
			this.winWidth = window.innerWidth;
	
			$('#phongUIGrid').css('height', this.winHeight + "px");
		},
		attachToDom: function($scope) {
			var self = this;
			// make changes to dom to create ui
			this.createComponents();
			// set up dom events
			this.listen();

			this.adjustHeightWidth();
			$('.fong-phone-apple-status-bar').hide();
			$('.fong-phone-nav-bar-container').hide();

			this.gridHeight = this.winHeight;

			// make sure each fong gets re-attached
			_.each(this.fongDots, function(fong) { fong.attachToDom(); });
		},
		createComponents: function () {
			$('#' + this.svgElementID).height(window.innerHeight - FongPhone.Globals.tabbedNavHeight);
			this.backgroundPad = document.getElementById(this.svgElementID);
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

			FongPhone.UI.Helper.registerAlertOnFirstView("padMessage", "A Fong is a musical instrument. Move one around and let's hear what they do. Got it?", 'Fongs', 1000);
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
		},
		positionChanged: function(fong) {
			var self = this;
			if (!this._positionDebouncers[fong.id]) {
				this._positionDebouncers[fong.id] = _.debounce(function(fong) {
					self._socket.emit('fong:event', {
						eventType: 'position',
						x: fong.x,
						y: fong.y,
						id: fong.id,
						fongRole: fong.fongRole,
						winHeight: self.winHeight,
						winWidth: self.winWidth
					});
				}, 10)
			}

			this._positionDebouncers[fong.id](fong);
		},
		getFongByID: function(id) {
			return this.fongDotsByID[id];	
		},
		handleFadeChanged: function (fong) {
			var self = this;
			if (!this._fadeDebouncers[fong.x]) {
				this._fadeDebouncers[fong.x] = _.debounce(function(fong) {
					self._socket.emit('fong:event', {
						eventType: 'fade',
						fadeOffset: fong.fadeOffset,
						id: fong.id,
						fongRole: fong.fongRole
					});
				}, 10)
			}

			this._fadeDebouncers[fong.x](fong);
		},
		sendChangeEvent: function(fong) {

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
			//if (pulse) fong.boardInput.startOscPulse();
			//else fong.boardInput.stopOscPulse();
		},
		stateChangedHandler: function (fong, index, state) {
			//fong.boardInput.setOscType(state);
		},
		radiusChangeHandler: function(fong) {
			//fong.boardInput.setOscVol(map(fong.radius, 60, 100, 0.9949676394462585, 5));
		},
		set: function(json, keepLoop) {
			var fongDots = [];
			// TODO (CAW) more robust would be to store by id (include ids in json and have the id for secondary stored on primary)
			var fongDotsByRole = {};
			var fongDotsByID = {};

			_.each(json.fongDots || [], function(fongJSON) {
				fongJSON.positionChangedHandler = this.roleHandlers[fongJSON.fongRole].positionChanged;
				fongJSON.fadeChangedHandler = this.roleHandlers[fongJSON.fongRole].fadeChangedHandler;
				fongJSON.handleFongSelected = this.roleHandlers[fongJSON.fongRole].handleFongSelected;
				fongJSON.selectedClassChangedHandler = this.roleHandlers[fongJSON.fongRole].classTypeChangeHandler;
				fongJSON.stateChangedHandler = this.roleHandlers[fongJSON.fongRole].stateChangedHandler;
				fongJSON.radiusChangeHandler = this.roleHandlers[fongJSON.fongRole].radiusChangeHandler;
				fongJSON.initializer = this.roleHandlers[fongJSON.fongRole].initializer;

				var fongUI = new FongPhone.UI.Fong(this.board, fongJSON);

				// preserver previous loop positions
				if (keepLoop)
					fongUI.loopPositions = this.fongDotsByRole[fongUI.fongRole].loopPositions;

				fongDotsByRole[fongUI.fongRole] = fongUI;
				fongDotsByID[fongUI.id] = fongUI;
				fongDots.push(fongUI);
			}, this);

			this.fongDots = fongDots;
			this.fongDotsByRole = fongDotsByRole;
			this.fongDotsByID = fongDotsByID;
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