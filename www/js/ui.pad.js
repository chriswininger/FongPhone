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
		this.board = board;

		// make changes to dom to create ui
		self.createComponents();
		// set up dom events
		self.listen();

		// setup state
		this.osc1PulseOn = true;
		this.osc2PulseOn = true;
		this.waveIntOsc1 = 0;
		this.waveIntOsc2 = 0;
		this.oscTouchFade1Val = 0;
		this.oscTouchFade2Val = 0;
		this.lastPinchDist = 0;

		this.longTouchChangesWave = false;
		this.longTouchSelectsFong = true;
	};

	_.extend(PhonePhong.UI.Pad.prototype, {
		waves: ['sine', 'square', 'triangle', 'sawtooth'],
		createComponents: function () {
			$('#phongUIGrid').height(window.innerHeight);
			window.PhonePhong.UI.Helper.registerSwipeNavigation('uiPadSwipeBottom', '#/note-map', Hammer.DIRECTION_UP);
			window.PhonePhong.UI.Helper.registerSwipeNavigation('uiPadSwipeTop', '#/help', Hammer.DIRECTION_DOWN);
			this.oscTouchFade1 = document.getElementById('oscTouchFade1');
			this.oscTouchFade2 = document.getElementById('oscTouchFade2');
			this.oscTouch1 = document.getElementById('oscTouch1');
			this.oscTouch2 = document.getElementById('oscTouch2');
			this.backgroundPad = document.getElementById('phongUIGrid');

			document.getElementById('uiPadSwipeBottom').setAttribute('y', window.innerHeight - uiPadSwipeBottom.getAttribute('height'));
		},
		listen: function () {
			var self = this;

			// Changes wave form
			$(self.oscTouch1).on('taphold', _.bind(self._handleLongTouch, self));
			$(self.oscTouch2).on('taphold', _.bind(self._handleLongTouch, self));
			// Toggles solid tone
			$(self.oscTouch1).on('doubletap', _.bind(self._handleDoubleTap, self));
			$(self.oscTouch2).on('doubletap', _.bind(self._handleDoubleTap, self));
			// Moves circles controlling pitch and speed
			self.oscTouch1.addEventListener('touchmove', _handleOSCTouchMove, false);
			self.oscTouch2.addEventListener('touchmove', _handleOSCTouchMove, false);
			self.oscTouch1.addEventListener('touchend', _handleOSCTouchEnd, false);
			self.oscTouch2.addEventListener('touchend', _handleOSCTouchEnd, false);
			// handles fade left/right
			self.oscTouchFade1.addEventListener('touchmove', _handleFadeMove, false);
			self.oscTouchFade2.addEventListener('touchmove', _handleFadeMove, false);
			self.backgroundPad.addEventListener('touchstart', _handleBackGroundTouchStart);
			self.backgroundPad.addEventListener('touchend', _handleBackGroundTouchEnd);

			var _touches = {};

			function _handleBackGroundTouchStart(event) {
				if (event.target !== self.backgroundPad) return;
				if (self.lastSelectedFong) {
					var touch = event.targetTouches[0];
					offsetX = 0;
					offsetY = 0;
					updateOsc(self.lastSelectedFong, touch.pageX, touch.pageY);
					offsetX = null;
					offsetY = null;
				}
				/*for (var i = 0; i < event.targetTouches.length; i++) {
					var touch = event.targetTouches[i];
					//log("_handleBackGroundTouchStart looping");
					// TODO (CAW) could get tricky when oscillators are close together
					if (isTouchAroundOsc(self.oscTouch1, touch) || isTouchAroundOsc(self.oscTouch2, touch)) {
						var dist1 = getTouchDist(self.oscTouch1, touch),
							dist2 = getTouchDist(self.oscTouch2, touch);
						if (dist1 <= dist2) {
							console.log('!!! Turn it off osc1');
							self.board.osc1Off();
							_touches[touch.identifier] = {
								on: _.bind(self.board.osc1On, self.board)
							};
						} else {
							console.log('!!! Turn it off osc2');
							self.board.osc2Off();
							_touches[touch.identifier] = {
								on: _.bind(self.board.osc2On, self.board)
							};
						}
					}
				}*/
			}

			function _handleBackGroundTouchEnd(event) {
				if (event.target !== self.backgroundPad) return;
				for (var i = 0; i < event.changedTouches.length; i++) {
					var touch = event.changedTouches[i];
					if (_touches[touch.identifier] && _.isFunction(_touches[touch.identifier].on))
						_touches[touch.identifier].on();
				}
			}

			function updateOsc(target, x, y) {
				//turning this off should be an advanced feature
				if (offsetX == null && x != target.getAttribute('cx')) {
					offsetX = x - target.getAttribute('cx');
				}
				if (offsetY == null && y != self.oscTouch1.getAttribute('cy')) {
					offsetY = y - target.getAttribute('cy');
				}

				// Place element where the finger is
				target.setAttribute('cx', x - offsetX);
				target.setAttribute('cy', y - offsetY);
				$(target).attr('class', 'selectedFong');
				
				//log(x + " " + y + " " + offsetX + " " + offsetY);

				// get attributes from ui
				var r = parseInt(target.getAttribute('r'));
				var touch1x = parseFloat(self.oscTouch1.getAttribute('cx'))
				var touch1r = parseFloat(self.oscTouch1.getAttribute('r'));
				var touch2x = parseFloat(self.oscTouch2.getAttribute('cx'))
				var touch2r = parseFloat(self.oscTouch2.getAttribute('r'));
				// calculate frequency
				var freq, ffreq;
				if (!window.PhonePhong.NoteMapOn) {
					freq = map(y / 2, (r / 2), window.innerHeight - r, 0, self.board.osc1MaxFreq);

				} else {
					// ?? freq2 map(y, (r/2), window.innerHeight - target.getAttribute('height'), 0, self.board.osc1MaxFreq)
					var noteNumber = parseInt(y * PhonePhong.NoteMap.length / window.innerHeight);
					var note = PhonePhong.NoteMap[noteNumber];
					if (!note) note = PhonePhong.NoteMap[PhonePhong.NoteMap.length - 1];
					freq = note.freq;


				}

				if (!window.PhonePhong.FilterNoteMapOn) {
					ffreq = map(x / 2, (r / 2), window.innerWidth - r, 0, self.board.osc1MaxFreq);
				} else {
					var fnoteNumber = parseInt(x * PhonePhong.NoteMap.length / window.innerWidth);
					var fnote = PhonePhong.NoteMap[fnoteNumber];
					if (!fnote) fnote = PhonePhong.NoteMap[PhonePhong.NoteMap.length - 1];
					ffreq = fnote.freq;
				}
				
				log(freq + " " + ffreq);

				if (freq < 0) freq = 0;
				if (ffreq < 100) ffreq = 100;

				var fadeUIElement, fadeUIOffset;
				if (target.id === self.oscTouch1.id) {
					// update frequency
					self.board.setOsc1Freq(freq);
					self.board.setOsc1FilterFreq(ffreq);
					fadeUIElement = self.oscTouchFade1;
					fadeUIOffset = self.oscTouchFade1Val;
				} else if (target.id === self.oscTouch2.id) {
					self.board.setOsc2Freq(freq);
					self.board.setOsc2FilterFreq(ffreq);
					fadeUIOffset = self.oscTouchFade2Val;
					fadeUIElement = self.oscTouchFade2;
				}
				// update position of fade elements reletive to main touch element
				fadeUIElement.setAttribute('cx', target.getAttribute('cx') - fadeUIOffset);
				fadeUIElement.setAttribute('cy', target.getAttribute('cy'));
				// update offsets
				var primaryOffset = map(touch1x, (touch1r / 2), window.innerWidth - touch1r, 0, self.board.primaryOffsetMax);
				if (primaryOffset < 0) primaryOffset = 0;
				self.board.setPrimaryOffset(primaryOffset);
				self.board.setSecondaryOffset(map(touch2x, (touch2r / 2), window.innerWidth - touch2r, 0, self.board.secondaryOffsetMax) * self.board.mainTimeOffset);

			}

			var offsetX, offsetY;

			function _handleOSCTouchMove(event) {
				// If there's exactly one finger inside this element
				if (event.targetTouches.length == 1) {
					var touch = event.targetTouches[0];

					updateOsc(event.target, touch.pageX, touch.pageY);

					event.preventDefault();
				} else if (event.targetTouches.length == 2) {
					if (self.lastPinchDist === undefined) self.lastPinchDist = 0;

					var x1 = event.targetTouches[0].pageX;
					var y1 = event.targetTouches[0].pageY;
					var x2 = event.targetTouches[1].pageX;
					var y2 = event.targetTouches[1].pageY;

					var dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
					var change = dist - self.lastPinchDist;

					var r = parseFloat(event.target.getAttribute('r'));
					if (change > 0 && r <= 98) r += 2;
					else if (r >= 62) r -= 2;

					event.target.setAttribute('r', r);

					if (event.target.id === self.oscTouch1.id) {
						self.board.setOsc1Vol(map(r, 60, 100, 0.9949676394462585, 5));
					} else if (event.target.id === self.oscTouch2.id) {
						self.board.setOsc2Vol(map(r, 60, 100, 0.9949676394462585, 5));
					}


					self.lastPinchDist = dist;
				}

				event.preventDefault();
			}

			function _handleOSCTouchEnd(event) {
				self.lastPinchDist = 0;
				$(event.target).attr('class', 'fong');
				offsetX = null;
				offsetY = null;
				self.lastSelectedFong = event.target;
			}

			function _handleFadeMove(event) {
				if (event.targetTouches.length == 1) {
					var touch = event.targetTouches[0];
					event.target.setAttribute('cx', touch.pageX);

					if (event.target.id === self.oscTouchFade1.id) {
						self.oscTouchFade1Val = self.oscTouch1.getAttribute('cx') - touch.pageX;
						self.board.setPrimaryFade(map(-1 * self.oscTouchFade1Val, -35, 35, -2, 2));
					} else {
						self.oscTouchFade2Val = self.oscTouch2.getAttribute('cx') - touch.pageX;
						// TODO (CAW) -- range should reflect size of outer sphere
						self.board.setSecondaryFade(map(-1 * self.oscTouchFade2Val, -35, 35, -2, 2));
					}
				}
			}

			function getTouchDist(osc, touch) {
				var cX = parseFloat(osc.getAttribute('cx')),
					cY = parseFloat(osc.getAttribute('cy')),
					a = Math.abs(touch.clientX - cX),
					b = Math.abs(touch.clientY - cY),
					c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

				return c;
			}

			function isTouchAroundOsc(osc, touch) {
				// just check distance between click and center of osc
				var c = getTouchDist(osc, touch);
				var radius = parseFloat(osc.getAttribute('r'));
				return c < radius + 100;
			}
		},
		_handleDoubleTap: function (event) {
			var self = this;
			if (event.target === self.oscTouch1) {
				if (self.osc1PulseOn) self.board.stopOsc1Pulse();
				else self.board.startOsc1Pulse();
				self.osc1PulseOn = !self.osc1PulseOn;
			} else if (event.target === self.oscTouch2) {
				if (self.osc2PulseOn) self.board.stopOsc2Pulse();
				else self.board.startOsc2Pulse();
				self.osc2PulseOn = !self.osc2PulseOn;
			}
		},
		_handleLongTouch: function (event) {
			//alert("_handleLongTouch " + event.target.id);
			var self = this;

			if (event.target === self.oscTouch1) {
				self.waveIntOsc1++;
				if (self.waveIntOsc1 >= self.waves.length) self.waveIntOsc1 = 0;
				self.board.setOsc1Type(self.waves[self.waveIntOsc1]);
			} else if (event.target === self.oscTouch2) {
				self.waveIntOsc2++;
				if (self.waveIntOsc2 >= self.waves.length) self.waveIntOsc2 = 0;
				self.board.setOsc2Type(self.waves[self.waveIntOsc2]);
			}

			event.preventDefault();
		}
	});

	// --- private helper functions ---
	function map(val, x1, x2, y1, y2) {
		return (val - x1) / (Math.abs(x2 - x1)) * Math.abs(y2 - y1) + y1;
	}
})();