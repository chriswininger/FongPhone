(function () {
	try {
		window.PhonePhong = window.PhonePhong || {};
		window.PhonePhong.UI = window.PhonePhong.UI || {};
		window.PhonePhong.UI.Helper = {
			registerSwipeNavigation: function (ctrlElement, elementID, url, direction) {
				// TODO (CAW) passing in ctrlElement here, could represent a memory leak
				var uiSwipe = document.getElementById(elementID);
				var hammerSwipe = new Hammer(uiSwipe, {
					direction: direction
				});
				hammerSwipe.on('pan', function (ev) {
					if (ev.isFinal) {
						// save state of ctrl
						localforage.setItem('ui.pad.state', ctrlElement.toJSON(), function(err) {
							if (err) return console.error('error saving ui pad state: ' + err);
							console.info('saved ui.pad.state');
						});

						// set new location
						window.location = url;
					}
				});
			}
		};
	} catch (err) {
		alert(err.message);
	}
})();