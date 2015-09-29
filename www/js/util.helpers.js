(function() {
    window.FongPhone = window.FongPhone || {};
    window.FongPhone.utils = window.FongPhone.utils || {};
    window.FongPhone.utils = {
        createGetSet: function(ctx, key, get, set) {
            ctx.__defineGetter__(key, _.bind(get, ctx));
            ctx.__defineSetter__(key, _.bind(set, ctx));
        }
    };
})();