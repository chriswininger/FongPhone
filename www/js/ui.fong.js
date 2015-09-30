(function () {
    window.FongPhone = window.FongPhone || {};
    window.FongPhone.UI = window.FongPhone.UI || {};

    var Signal = signals.Signal;

    window.FongPhone.UI.Fong = function (domCtxID, state) {
        window.FongPhone.utils.createGetSet(this, 'x', this.getX, this.setX);
        window.FongPhone.utils.createGetSet(this, 'y', this.getY, this.setY);
        window.FongPhone.utils.createGetSet(this, 'radius', this.getRadius, this.setRadius);
        window.FongPhone.utils.createGetSet(this, 'color', this.getColor, this.setColor);
        window.FongPhone.utils.createGetSet(this, 'fadeOffset', this.getFadeOffSet, this.setFadeOffSet);

        this.offsetX = null;
        this.offsetY = null;
        this.lastPinchDist = 0;

        this.domCtxID = domCtxID;
        this.elementID = state.elementID;
        this.fadeElementID = state.elementID + 'Fade'; // temporary
        this.dataIndex = state.dataIndex; // temporary
        this.domElement = this.initializeDomElement(this.elementID, 'fong');
        this.fadeElement = this.initializeDomElement(this.fadeElementID, 'fong-fade');
        if (!this.fadeElement || ! this.domElement) return;

        // hard code fader size
        this.fadeElement.setAttribute('r', 10);

        // TODO (CAW) Switch to extend
        this.boardInput = state.boardInput;
        this.x = state.x;
        this.y = state.y;
        this.fadeOffset = state.fadeOffset;
        this.radius = state.radius;
        this.color = state.color;
        this.positionChangedHandler = state.positionChangedHandler;
        this.fadeChangedHandler = state.fadeChangedHandler;
        this.handleFongSelected = state.handleFongSelected;
        this.doubleTabHandler = state.doubleTabHandler;
        this.longTouchHandler = state.longTouchHandler;

        // wire up touch events on dom
        this.listen();
    };

    _.extend(window.FongPhone.UI.Fong.prototype, {
        handleDoubleTap: function(event) {
            if (this.doubleTabHandler)
                this.doubleTabHandler(this, event);
        },
        handleFadeMove: function(event) {
            if (event.targetTouches.length == 1) {
                var touch = event.targetTouches[0];
                if (this.radius > Math.abs(touch.pageX - this.x))
                    this.fadeOffset = touch.pageX - this.x;

                this.fadeChangedHandler(this);
            }
        },
        handleLongTouch: function(event) {
            if (this.longTouchHandler)
                this.longTouchHandler(this, event);
            event.preventDefault();
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

                event.target.setAttribute('r', r);

                self.board.fongs[event.target.getAttribute('data-index')].setOscVol(map(r, 60, 100, 0.9949676394462585, 5));

                self.lastPinchDist = dist;
            }

            event.preventDefault();
        },
        handleTouchEnd: function(event) {
            this.lastPinchDist = 0;
            // reset touch offset
            this.offsetX = null;
            this.offsetY = null;
            if (this.handleFongSelected)
                this.handleFongSelected(this, event);
        },
        initializeDomElement: function(id, className) {
            var domCtx = document.getElementById(this.domCtxID);
            if (!domCtx) return null;
            var element = document.getElementById(id);
            if (!element) {
                element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                element.setAttribute('class', className);
                element.id = id;
                element.setAttribute('data-index', this.dataIndex);
                domCtx.appendChild(element);
            }

            return element;
        },
        listen: function() {
            this.domElement.addEventListener('touchmove', _.bind(this.handleTouchMove, this));
            this.domElement.addEventListener('touchend', _.bind(this.handleTouchEnd, this));
            // TODO (CAW) Does this really only exist on jquery?
            this.fadeElement.addEventListener('touchmove', _.bind(this.handleFadeMove, this));
            $(this.domElement).on('doubletap', _.bind(this.handleDoubleTap, this));
            $(this.domElement).on('taphold', _.bind(this.handleLongTouch, this));
        },
        getFadeOffSet: function() {
            return this._fadeOffset;
        },
        setFadeOffSet: function(fadeOffset) {
            this._fadeOffset = fadeOffset;
            this.fadeElement.setAttribute('cx', this.x + fadeOffset);
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
            this.domElement.setAttribute('cx', x);
            var fadeOffset = !this.fadeOffset ? 0 : this.fadeOffset;
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
            this.domElement.setAttribute('cy', y);
            this.fadeElement.setAttribute('cy', y);
            // TODO (CAW) Property store ui state so we don't need this on the board
            this.boardInput.y = y;
            //this.positionChanged.dispatch(this, this.x, oldY);
            if (this.positionChangedHandler)
                this.positionChangedHandler(this, this.x, oldY);
        },
        getRadius: function() {
            return this._r;
        },
        setRadius: function(r) {
            this._r = r;
            this.domElement.setAttribute('r', r);
        },
        getColor: function() {
            return this._color;
        },
        setColor: function(color) {
            this._color = color;
            this.domElement.style.fill = this.color;
        }
        //positionChanged: new Signal()
    });
})();