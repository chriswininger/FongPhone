(function () {
	try {
		window.PhonePhong = window.PhonePhong || {};
		window.PhonePhong.UI = window.PhonePhong.UI || {};
		window.PhonePhong.Sound = window.PhonePhong.Sound || {};
		window.PhonePhong.UI.Helper = {
			registerSwipeNavigation: function (elementID, url, direction, description) {
				var uiSwipe = document.getElementById(elementID);
								var hammerSwipe = new Hammer(uiSwipe, {
									direction: direction
								});
								hammerSwipe.on('pan', function (ev) {
									if (ev.isFinal && ev.direction == direction) {
										window.location = url;
									}
								});				
			}
		};
	} catch (err) {
		alert(err.message);
	}
})();