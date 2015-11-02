(function() {
    window.FongPhone = window.FongPhone || {};
    window.FongPhone.utils = window.FongPhone.utils || {};
    window.FongPhone.utils = {
        createGetSet: function(ctx, key, get, set) {
            ctx.__defineGetter__(key, _.bind(get, ctx));
            ctx.__defineSetter__(key, _.bind(set, ctx));
        },
		registerKnob: function (selector, attrKey, val, owner) {
			$(selector).off('change');
			$(selector).val(val);
			$(selector).knob({
				'stopper': true,
				'height': 90,
				'change': function (v) {
					owner[attrKey] = parseInt(v);
				}
			});
		}
    };	
})();