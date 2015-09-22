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
        this.state = {};

		// make changes to dom to create ui
		self.createComponents();
		// set up dom events
		self.listen();

    };

    var $class = PhonePhong.UI.Pad.prototype;

    var oscTouchFade1,
        oscTouchFade2,
        oscTouch1,
        oscTouch2,
        backgroundPad,
		uiPadSwipeDown;

    var oscTouchFade1Val = 0, oscTouchFade2Val = 0, lastPinchDist = 0;

    $class.createComponents = function () {
        $('#phongUIGrid').height(window.innerHeight);
        window.PhonePhong.UI.Helper.registerSwipeNavigation('uiPadSwipeBottom', '#/note-map', Hammer.DIRECTION_UP);
        window.PhonePhong.UI.Helper.registerSwipeNavigation('uiPadSwipeTop', '#/help', Hammer.DIRECTION_DOWN);
        oscTouchFade1 = document.getElementById('oscTouchFade1');
        oscTouchFade2 = document.getElementById('oscTouchFade2');
        oscTouch1 = document.getElementById('oscTouch1'),
        oscTouch2 = document.getElementById('oscTouch2'),
        backgroundPad = document.getElementById('phongUIGrid');

        document.getElementById('uiPadSwipeBottom').setAttribute('y', window.innerHeight - uiPadSwipeBottom.getAttribute('height'));
    };

    $class.listen = function () {
        var self = this;
        var osc1PulseOn = true, osc2PulseOn = true;

        // Changes wave form
        $(oscTouch1).on('taphold', _handleLongTouch);
        $(oscTouch2).on('taphold', _handleLongTouch);
        // Toggles solid tone
        $(oscTouch1).on('doubletap', _handleDoubleTap);
        $(oscTouch2).on('doubletap', _handleDoubleTap);
        // Moves circles controlling pitch and speed
        oscTouch1.addEventListener('touchmove', _handleOSCTouchMove, false);
        oscTouch2.addEventListener('touchmove', _handleOSCTouchMove, false);
        oscTouch1.addEventListener('touchend', _handleOSCTouchEnd, false);
        oscTouch2.addEventListener('touchend', _handleOSCTouchEnd, false);
        // handles fade left/right
        oscTouchFade1.addEventListener('touchmove', _handleFadeMove, false);
        oscTouchFade2.addEventListener('touchmove', _handleFadeMove, false);
        // handles on off buttons
        //oscTouchOnOff1.addEventListener('touchstart', _handleOff);
       // oscTouchOnOff1.addEventListener('touchend', _handleOn);
       // oscTouchOnOff2.addEventListener('touchstart', _handleOff);
       // oscTouchOnOff2.addEventListener('touchend', _handleOn);
        // handle pad touch
        backgroundPad.addEventListener('touchstart', _handleBackGroundTouchStart);
        backgroundPad.addEventListener('touchend', _handleBackGroundTouchEnd);

        function _handleDoubleTap (event) {
            if (event.target === oscTouch1) {
                if (osc1PulseOn) self.board.stopOsc1Pulse();
                else self.board.startOsc1Pulse();
                osc1PulseOn = !osc1PulseOn;
            } else if (event.target === oscTouch2) {
                if (osc2PulseOn) self.board.stopOsc2Pulse();
                else self.board.startOsc2Pulse();
                osc2PulseOn = !osc2PulseOn;
            }
        }

        var waves = ['sine', 'square', 'triangle', 'sawtooth'];
        var waveIntOsc1 = 0, waveIntOsc2 = 0;
        function _handleLongTouch (event) {
            if (event.target === oscTouch1) {
                waveIntOsc1++;
                if (waveIntOsc1 >= waves.length) waveIntOsc1 = 0;
                self.board.setOsc1Type(waves[waveIntOsc1]);
            } else if (event.target === oscTouch2) {
                waveIntOsc2++;
                if (waveIntOsc2 >= waves.length) waveIntOsc2 = 0;
                self.board.setOsc2Type(waves[waveIntOsc2]);
            }

            event.preventDefault();
        }

        var _touches = {};
        function  _handleBackGroundTouchStart (event) {
            if (event.target !== backgroundPad) return;
            for (var i = 0; i < event.targetTouches.length; i++) {
                var touch = event.targetTouches[i];
                // TODO (CAW) could get tricky when oscillators are close together
                if (isTouchAroundOsc(oscTouch1, touch) || isTouchAroundOsc(oscTouch2, touch)) {
					var dist1 = getTouchDist(oscTouch1, touch), dist2 = getTouchDist(oscTouch2, touch);
					if (dist1 <= dist2) {
						console.log('!!! Turn it off osc1');
						self.board.osc1Off();
						_touches[touch.identifier] = {on: _.bind(self.board.osc1On, self.board)};
					} else {
						console.log('!!! Turn it off osc2');
						self.board.osc2Off();
						_touches[touch.identifier] = {on: _.bind(self.board.osc2On, self.board)};
					}
                }
                /*else if (isTouchAroundOsc(oscTouch2, touch)) {
                    console.log('!!! Turn if off osc2');
                    self.board.osc2Off();
                    _touches[touch.identifier] = {on: _.bind(self.board.osc2On, self.board) };
                }*/
            }
        }

        function  _handleBackGroundTouchEnd (event) {
            if (event.target !== backgroundPad) return;
            for (var i = 0; i < event.changedTouches.length; i++) {
                var touch = event.changedTouches[i];
                if (_touches[touch.identifier] && _.isFunction(_touches[touch.identifier].on) )
                    _touches[touch.identifier].on();

                // TODO (CAW) could get tricky when oscillators are close together
                //if (isTouchAroundOsc(oscTouch1, touch)) {
                 //   console.log('!!! Turn it on osc1');
                   // self.board.osc1On();
               // }
               // else if (isTouchAroundOsc(oscTouch2, touch)) {
                 //   console.log('!!! Turn if on osc2');
                   // self.board.osc2On();
                //}
            }
        }

        function _handleOSCTouchMove  (event) {
            // If there's exactly one finger inside this element
            if (event.targetTouches.length == 1) {
                self.state[event.target.id] = self.state[event.target.id] || {};
                var touch = event.targetTouches[0];

                // Place element where the finger is
                event.target.setAttribute('cx', touch.pageX);
                event.target.setAttribute('cy', touch.pageY);
                self.state[event.target.id].cx = touch.pageX;
                self.state[event.target.id].cy = touch.pageY;

                // get attributes from ui
                var r = parseInt(event.target.getAttribute('r'));
                var touch1x = parseFloat(oscTouch1.getAttribute('cx'))
                var touch1r = parseFloat(oscTouch1.getAttribute('r'));
                var touch2x = parseFloat(oscTouch2.getAttribute('cx'))
                var touch2r = parseFloat(oscTouch2.getAttribute('r'));
                // calculate frequency
                var freq;
                if (!window.PhonePhong.NoteMapOn) {
                    freq = map(touch.pageY, (r / 2), window.innerHeight - r, 0, self.board.osc1MaxFreq);
                } else {
                    // ?? freq2 map(touch.pageY, (r/2), window.innerHeight - event.target.getAttribute('height'), 0, self.board.osc1MaxFreq)
                    var note = PhonePhong.NoteMap[Math.round(map(touch.pageY, (r/2), window.innerHeight - r, 0, (PhonePhong.NoteMap.length - 1)))];
                    if (!note) note = PhonePhong.NoteMap[PhonePhong.NoteMap.length-1];
                    freq = note.freq;
                }

                if (freq<0)freq=0;

                var fadeUIElement, fadeUIOffset;
                if (event.target.id === oscTouch1.id) {
                    // update frequency
                    self.board.setOsc1Freq(freq);
                    fadeUIElement = oscTouchFade1;
                    fadeUIOffset = oscTouchFade1Val;
                } else if (event.target.id === oscTouch2.id) {
                    self.board.setOsc2Freq(freq);
                    fadeUIOffset = oscTouchFade2Val;
                    fadeUIElement = oscTouchFade2;
                }
                // update position of fade elements reletive to main touch element
                fadeUIElement.setAttribute('cx', touch.pageX - fadeUIOffset);
                fadeUIElement.setAttribute('cy', touch.pageY);
                // update offsets
                var primaryOffset= map(touch1x, (touch1r/2), window.innerWidth - touch1r, 0, self.board.primaryOffsetMax);
                if (primaryOffset<0) primaryOffset=0;
                self.board.setPrimaryOffset(primaryOffset);
                self.board.setSecondaryOffset(map(touch2x, (touch2r/2), window.innerWidth - touch2r, 0, self.board.secondaryOffsetMax) * self.board.mainTimeOffset);

                event.preventDefault();
            } else if (event.targetTouches.length == 2) {
                if (lastPinchDist === undefined) lastPinchDist = 0;

                var x1 = event.targetTouches[0].pageX;
                var y1 = event.targetTouches[0].pageY;
                var x2 = event.targetTouches[1].pageX;
                var y2 = event.targetTouches[1].pageY;

                var dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                var change = dist - lastPinchDist;

                var r = parseFloat(event.target.getAttribute('r'));
                if (change > 0 && r <= 98) r += 2;
                else if (r >= 62) r -= 2;

                event.target.setAttribute('r', r);

                if (event.target.id === oscTouch1.id) {
                    self.board.setOsc1Vol(map(r, 60, 100, 0.9949676394462585, 5));
                } else if (event.target.id === oscTouch2.id) {
                    self.board.setOsc2Vol(map(r, 60, 100, 0.9949676394462585, 5));
                }


                lastPinchDist = dist;
            }

            event.preventDefault();
        }

        function _handleOSCTouchEnd (event) {
            lastPinchDist = 0;
        }

        function _handleFadeMove (event) {
            if (event.targetTouches.length == 1) {
                var touch = event.targetTouches[0];
                event.target.setAttribute('cx', touch.pageX);

                if (event.target.id === oscTouchFade1.id) {
                    oscTouchFade1Val = oscTouch1.getAttribute('cx') - touch.pageX;
                    self.board.setPrimaryFade(map(-1*oscTouchFade1Val, -35, 35, -2, 2));
                } else {
                    oscTouchFade2Val = oscTouch2.getAttribute('cx') - touch.pageX;
                    // TODO (CAW) -- range should reflect size of outer sphere
                    self.board.setSecondaryFade(map(-1*oscTouchFade2Val, -35, 35, -2, 2));
                }
            }
        }

		function getTouchDist (osc, touch) {
			var cX = parseFloat(osc.getAttribute('cx')),
				cY = parseFloat(osc.getAttribute('cy')),
				a = Math.abs(touch.clientX - cX),
				b = Math.abs(touch.clientY - cY),
				c = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));

			return c;
		}

        function isTouchAroundOsc (osc, touch) {
           // just check distance between click and center of osc
            var c = getTouchDist(osc, touch);
			var radius = parseFloat(osc.getAttribute('r'));
            return c < radius + 100;
        }
    };

    // --- private helper functions ---
    function map(val, x1, x2, y1, y2) {
        return (val -x1)/(Math.abs(x2-x1)) * Math.abs(y2 -y1) + y1;
    }
})();
