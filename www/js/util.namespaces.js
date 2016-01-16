(function(ctx) {
	ctx.FongPhone = {};
	ctx.FongPhone.UI = {};
	ctx.FongPhone.Uitls = {};
	ctx.FongPhone.Logic = {};
	ctx.FongPhone.Debugging = {};
	ctx.FongPhone.AppState = {};
	ctx.FongPhone.Navigation = {};
	ctx.FongPhone.Globals = {
		tabbedNavHeight: 70,
        isAndroid: ((typeof navigator !== 'undefined' && navigator.userAgent) ?
            !!navigator.userAgent.match(/Android/) : false)
	};
})(window);
var bVersionDisplayed;
var uiPad;
var st;
var alwaysShowIntroAlerts = false;