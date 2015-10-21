var gradientFades = true;

(function () {
	window.FongPhone = window.FongPhone || {};
	window.FongPhone.UI = window.FongPhone.UI || {};

	window.FongPhone.UI.Fong = function (board, state) {
		window.FongPhone.utils.createGetSet(this, 'x', this.getX, this.setX);
		window.FongPhone.utils.createGetSet(this, 'y', this.getY, this.setY);
		window.FongPhone.utils.createGetSet(this, 'radius', this.getRadius, this.setRadius);
		window.FongPhone.utils.createGetSet(this, 'color', this.getColor, this.setColor);
		window.FongPhone.utils.createGetSet(this, 'fadeOffset', this.getFadeOffSet, this.setFadeOffSet);
		window.FongPhone.utils.createGetSet(this, 'selectedClassType', this.getSelectedClassType, this.setSelectedClassType);
		window.FongPhone.utils.createGetSet(this, 'selectedState', this.getSelectedState, this.setSelectedState);
		window.FongPhone.utils.createGetSet(this, 'selectedStateIndex', this.getSelectedStateIndex, this.setSelectedStateIndex);
		window.FongPhone.utils.createGetSet(this, 'selectedClassTypeIndex', this.getSelectedClassTypeIndex, this.setSelectedClassTypeIndex);

		this.offsetX = null;
		this.offsetY = null;
		this.lastPinchDist = 0;

		this.domCtxID = state.domCtxID;
		this.elementID = state.elementID;
		this.fadeElementID = state.elementID + 'Fade'; // temporary

		// TODO (CAW) Switch to extend
		this.boardInputIndex = state.boardInputIndex;
		this.boardInput = board.fongs[this.boardInputIndex];
		this.dur = this.boardInput.dur; // todo (caw) something of hack but maybe ok
		this.gradient = state.gradient;

		this.set(state);

		// set handlers last (and fire them all on init)
		this.initializer = state.initializer || function() {};
		this.positionChangedHandler = state.positionChangedHandler || function() {};
		this.fadeChangedHandler = state.fadeChangedHandler || function() {};
		this.handleFongSelected = state.handleFongSelected || function() {};
		this.selectedClassChangedHandler = state.selectedClassChangedHandler || function() {};
		//this.classTypeChangeHandler = state.classTypeChangeHandler || function() {};
		this.stateChangedHandler = state.stateChangedHandler || function() {};
		this.radiusChangeHandler = state.radiusChangeHandler || function() {};

		//this.attachToDom();
	};

	_.extend(window.FongPhone.UI.Fong.prototype, {
		attachToDom: function() {
			this.animation = $("#" + this.gradient + "Animation");
			$(this.animation).attr("dur", this.dur);
			this.domElement = this.initializeDomElement(this.elementID, 'fong', this.gradient);
			this.fadeElement = this.initializeDomElement(this.fadeElementID, 'fong-fade', null);
			
			if (gradientFades)
			{
				$(this.fadeElement).attr("style", "opacity:.01");
			}

			if (!this.fadeElement || ! this.domElement) return;
			// hard code fader size
			this.fadeElement.setAttribute('r', 20);

			// reset state now that dom is attached (cheap way to trigger positioning of ui
			this.set(this.toJSON());

			this.fireAllHandlers();

			// wire up touch events on dom
			this.listen();
		},
		handleDoubleTap: function(event) {
			this.incrementState();
			event.preventDefault();
		},
		handleFadeMove: function(event) {
			if (event.targetTouches.length == 1) {
				var touch = event.targetTouches[0];
				
				if (this.radius > Math.abs(touch.pageX - this.x))
					this.fadeOffset = touch.pageX - this.x;
				
				if (gradientFades) {
					var diff = touch.pageX - this.x;
					var gradientOffset = Math.max(Math.min(diff * 1. / this.radius + .5, .95), .05);
					$($("#" + this.gradient)).attr("fx", gradientOffset);
				}
				
				if (this.fadeChangedHandler)
					this.fadeChangedHandler(this);
			}
		},
		handleLongTouch: function(event) {
			this.incrementClass();
		},
		handleTouchMove: function (event) {
			// If there's exactly one finger inside this element
			if (event.targetTouches.length == 1) {
				var touch = event.targetTouches[0];

				// calculate offset of finger from center of fong
				if (this.offsetX === null && touch.pageX != event.target.getAttribute('cx')) {
					this.offsetX = touch.pageX - event.target.getAttribute('cx');
				}
				if (this.offsetY === null && touch.pageY != event.target.getAttribute('cy')) {
					this.offsetY = touch.pageY - event.target.getAttribute('cy');
				}

				this.x = touch.pageX - this.offsetX;
				this.y = touch.pageY - this.offsetY;

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

				this.radius = r;

				this.lastPinchDist = dist;
			}

			event.preventDefault();
		},
		handleTouchEnd: function(event) {
			this.lastPinchDist = 0;
			// reset touch offset
			this.offsetX = null;
			this.offsetY = null;

			this.boardInput.portamento = this.boardInput.portamentoStored;

			if (this.handleFongSelected)
				this.handleFongSelected(this);
		},
		fireAllHandlers: function() {
			this.initializer(this);
			this.positionChangedHandler(this, this.x, this.y);
			this.fadeChangedHandler(this);
			this.handleFongSelected(this);
			this.selectedClassChangedHandler(this, this.selectedClassTypeIndex, this.selectedClassType);
			this.stateChangedHandler(this, this.selectedStateIndex, this.selectedState);
			this.radiusChangeHandler(this);
		},
		initializeDomElement: function(id, className, gradient) {
			var domCtx = document.getElementById(this.domCtxID);
			if (!domCtx) return null;
			var element = document.getElementById(id);
			if (!element) {
				element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
				element.setAttribute('class', className);
				if (gradient) {
					element.setAttribute('fill', 'url(#' + gradient + ')');
				}
				element.id = id;
				domCtx.appendChild(element);
			}

			return element;
		},
		listen: function() {
			// remove any listeners registered to dead dom nodes
			if (this._touchMoveListener)
				this.domElement.removeEventListener('touchMove', this._handleTouchMove);
			if (this._touchEndListener)
				this.domElement.removeEventListener('touchend', this._touchEndListener);
			if (this._touchMoveFadeListener)
				this.fadeElement.removeEventListener('touchmove', this._touchMoveFadeListener);

			// clear any event listeners registered through jquery
			$(this.domElement).off();

			// store the wrapped function call so we have the instance to to call removeEventLister with later
			this._touchMoveListener = _.bind(this.handleTouchMove, this);
			this._touchEndListener = _.bind(this.handleTouchEnd, this);
			this._touchMoveFadeListener = _.bind(this.handleFadeMove, this);

			this.domElement.addEventListener('touchmove', this._touchMoveListener);
			this.domElement.addEventListener('touchend', this._touchEndListener);
			this.fadeElement.addEventListener('touchmove', this._touchMoveFadeListener);

			$(this.domElement).on('doubletap', _.bind(this.handleDoubleTap, this));
			$(this.domElement).on('taphold', _.bind(this.handleLongTouch, this));
		},
		getFadeOffSet: function() {
			return this._fadeOffset;
		},
		incrementState: function() {
		  if (this.selectedStateIndex === (this.states.length - 1))
			return this.selectedStateIndex = 0;

			this.selectedStateIndex++;
		},
		incrementClass: function() {
			if (this.selectedClassTypeIndex === (this.classes.length - 1))
				return this.selectedClassTypeIndex = 0;
			this.selectedClassTypeIndex++;
		},
		setFadeOffSet: function(fadeOffset) {
			this._fadeOffset = fadeOffset;
			if (this.fadeElement) {
				if (gradientFades) {
					var gradientOffset = Math.max(Math.min(fadeOffset * 1. / this.radius + .5, .95), .05);
					$($("#" + this.gradient)).attr("fx", gradientOffset);
				}
				
				this.fadeElement.setAttribute('cx', this.x + fadeOffset);
			}
			// TODO (CAW) Propery store ui state so we don't need this on the board
			this.boardInput.oscTouchFadeVal = fadeOffset;
			//this.fadeElement.setAttribute('cy', this.y);
		},
		getX: function() {
			return this._x;
		},
		setX: function(x) {
			var oldX = this._x;
			this._x = x;
			if (this.domElement)
				this.domElement.setAttribute('cx', x);
			var fadeOffset = !this.fadeOffset ? 0 : this.fadeOffset;
			if (this.fadeElement)
				this.fadeElement.setAttribute('cx', x + fadeOffset)
			// TODO (CAW) Propery store ui state so we don't need this on the board
			this.boardInput.x = x;
			//this.positionChanged.dispatch(this, oldX, this.y);
			if (this.positionChangedHandler)
				this.positionChangedHandler(this, oldX, this.y);
		},
		getY: function() {
			return this._y;
		},
		setY: function(y) {
			var oldY = this._y;
			this._y = y;
			if (this.domElement)
				this.domElement.setAttribute('cy', y);
			if (this.fadeElement)
				this.fadeElement.setAttribute('cy', y);
			// TODO (CAW) Property store ui state so we don't need this on the board
			this.boardInput.y = y;
			if (this.positionChangedHandler)
				this.positionChangedHandler(this, this.x, oldY);
		},
		getRadius: function() {
			return this._r;
		},
		setRadius: function(r) {
			this._r = r;
			if (this.domElement)
				this.domElement.setAttribute('r', r);
			if (this.radiusChangeHandler)
				this.radiusChangeHandler(this);
		},
		getColor: function() {
			return this._color;
		},
		setColor: function(color) {
			this._color = color;
			//this.domElement.style.fill = this.color;
		},
		setSelectedClassType: function(classType) {
			if (!classType) return this.selectedClassTypeIndex = 0;
			for (var i = 0; i < this.classes.length; i++) {
				if (this.classes[i] === classType)
					return this.selectedClassTypeIndex = i;
			}

			this.selectedClassTypeIndex = 0;
		},
		getSelectedClassType: function() {
			if (!this.classes) return;
			return this.classes[this.selectedClassTypeIndex];
		},
		setSelectedClassTypeIndex: function(index) {
			this._selectedClassTypeIndex = index;
			if (this.selectedClassChangedHandler)
				this.selectedClassChangedHandler(this, index, this.classes[index]);
		},
		getSelectedClassTypeIndex: function() {
			return this._selectedClassTypeIndex;
		},
		getSelectedState: function() {
			if (!this.states) return;
			return this.states[this.selectedStateIndex];
		},
		setSelectedState: function(state) {
			if (!state) return this.selectedStateIndex = 0;
			for (var i = 0; i < this.states.length; i++) {
				if (this.states[i] === state)
					return this.selectedStateIndex = i;
			}

			this.selectedStateIndex = 0;
		},
		getSelectedStateIndex: function() {
			return this._selectedStateIndex;
		},
		setSelectedStateIndex: function(stateIndex) {
			this._selectedStateIndex = stateIndex;
			if (this.stateChangedHandler)
				this.stateChangedHandler(this, stateIndex, this.states[stateIndex]);
		},
		set: function (state) {
			this.x = state.x;
			this.y = state.y;
			this.fadeOffset = state.fadeOffset;
			this.radius = state.radius;
			this.color = state.color;
			this.states = state.states;
			this.classes = state.classes;
			this.selectedClassType = state.selectedClassType;
			this.selectedState = state.selectedState;
			this.fongRole = state.fongRole;
		},
		toJSON: function() {
			var _exlusionList = {
				boardInput: true,
				selectedClassTypeIndex: true,
				selectedStateIndex: true,
				offsetX: true,
				offsetY: true,
				lastPinchDist: true,
				domElement: true,
				fadeElement: true,
				animation: true
			};

			var obj = {};
			_.each(this, function(val, key) {
				if (!_excluded(val, key)) {
					obj[key] = val;
				}
			});

			function _excluded(val, key) {
				return (key[0] === '_') ||
					!!(_exlusionList[key]) ||
					_.isFunction(val);
			}

			return obj;
		}
	});
})();