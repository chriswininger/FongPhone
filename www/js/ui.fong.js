(function () {
    window.FongPhone = window.FongPhone || {};
    window.FongPhone.UI = window.FongPhone.UI || {};
    window.FongPhone.UI.Fong = function (domCtxID, state) {
        window.FongPhone.utils.createGetSet(this, 'x', this.getX, this.setX);
        window.FongPhone.utils.createGetSet(this, 'y', this.getY, this.setY);
        window.FongPhone.utils.createGetSet(this, 'radius', this.getRadius, this.setRadius);
        window.FongPhone.utils.createGetSet(this, 'color', this.getColor, this.setColor);
        window.FongPhone.utils.createGetSet(this, 'fadeOffSet', this.getFadeOffSet, this.setFadeOffSet);

        this.domCtxID = domCtxID;
        this.elementID = state.elementID;
        this.fadeElementID = state.elementID + 'Fade'; // temporary
        this.dataIndex = state.dataIndex; // temporary
        this.domElement = this.initializeDomElement(this.elementID, 'fong');
        this.fadeElement = this.initializeDomElement(this.fadeElementID, 'fong-fade');
        if (!this.fadeElement || ! this.domElement) return;

        this.fadeElement.setAttribute('r', 10);

        this.x = state.x;
        this.y = state.y;
        this.radius = state.radius;
        this.color = state.color;
        this.fadeOffSet = state.fadeOffSet;

        this.updater = state.updater;
    };

    _.extend(window.FongPhone.UI.Fong.prototype, {
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
        getFadeOffSet: function() {

        },
        setFadeOffSet: function(fadeOffSet) {
            this._fadeOffSet = fadeOffSet;
            this.fadeElement.setAttribute('cx', this.x + fadeOffSet);
            this.fadeElement.setAttribute('cy', this.y);
        },
        getX: function() {
            return this._x;
        },
        setX: function(x) {
            this._x = x;
            this.domElement.setAttribute('cx', x);
            //this.fadeElement.setAttribute('cx', x + this.fadeOffSet)
        },
        getY: function() {
            return this._y;
        },
        setY: function(y) {
            this._y = y;
            this.domElement.setAttribute('cy', y);
            //this.fadeElement.setAttribute('cy', y);
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
    });
})();