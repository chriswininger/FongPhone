(function () {
	window.PhonePhong = window.PhonePhong || {};
	window.PhonePhong.UI = window.PhonePhong.UI || {};
	window.PhonePhong.Sound = window.PhonePhong.Sound || {};
	window.PhonePhong.UI.Helper = {
		registerSwipeNavigation: function (ctrlElement, elementID, url, direction) {
			var uiSwipe = document.getElementById(elementID);
			var hammerSwipe = new Hammer(uiSwipe, {
				direction: direction
			});

			// release any previous listeners to avoiding holding onto old dom elements
			hammerSwipe.off('pan');
			hammerSwipe.on('pan', function (ev) {
				if (ev.isFinal && ev.direction == direction) {
					// save state of ctrl
					try {
						localStorage.setItem('ui.pad.state', JSON.stringify(ctrlElement.toJSON()));
					} catch (ex) {
						console.error('error saving ui pad state: ' + ex);
					}

					// set new location
					window.location = url;
				}
			});
		}
	};
})();