(function(ctx) {
	ctx.FongPhone = {};
	ctx.FongPhone.UI = {};
	ctx.FongPhone.Utils = {};
	ctx.FongPhone.Logic = {};
	ctx.FongPhone.Debugging = {};
	ctx.FongPhone.AppState = {};
	ctx.FongPhone.Navigation = {};
	ctx.FongPhone.Utils.Mixins = ctx.FongPhone.Utils.Mixins || {};
	ctx.FongPhone.Globals = {		
        isAndroid: ((typeof navigator !== 'undefined' && navigator.userAgent) ?
            !!navigator.userAgent.match(/Android/) : false),
		isGalleryHop: true
	};
	ctx.FongPhone.Globals.tabbedNavHeight = ctx.FongPhone.Globals.isAndroid ? 70 : 0;
})(window);
var bVersionDisplayed;
var uiPad;
var st;
var alwaysShowIntroAlerts = false;