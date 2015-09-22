(function () {
	try {
		window.PhonePhong = window.PhonePhong || {};
		window.PhonePhong.UI = window.PhonePhong.UI || {};
		window.PhonePhong.UI.Helper = {
			registerSwipeNavigation: function (elementID, url, direction) {
				var uiSwipe = document.getElementById(elementID);
				var hammerSwipe = new Hammer(uiSwipe, {
					direction: direction
				});
				hammerSwipe.on('pan', function (ev) {
					if (ev.isFinal) {
						window.location = url;
					}
				});
			}
		};
	} catch (err) {
		alert(err.message);
	}
})();