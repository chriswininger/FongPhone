(function () {
	var navByClick = true;
	var navBySwipe = true;

	FongPhone.UI.Helper = {
		registerSwipeNavigation: function (ctrlElement, storageKey, elementID, urlLeft, urlRight) {
			var uiSwipe = document.getElementById(elementID);
			var hammerSwipeLeft = new Hammer(uiSwipe, {
				direction: Hammer.DIRECTION_LEFT
			});
			var hammerSwipeRight = new Hammer(uiSwipe, {
				direction: Hammer.DIRECTION_RIGHT
			});
			var hammerTap = new Hammer(uiSwipe, {});

			// release any previous listeners to avoiding holding onto old dom elements
			hammerSwipeLeft.off('pan');
			hammerSwipeRight.off('pan');
			hammerTap.off('tap');

			if (navBySwipe) {
				hammerSwipeLeft.on('pan', _.partial(_swipeNavFunc, Hammer.DIRECTION_LEFT, urlLeft));
				hammerSwipeRight.on('pan', _.partial(_swipeNavFunc, Hammer.DIRECTION_RIGHT, urlRight));
			}

			if (navByClick)
				hammerTap.on("tap", _tapNavFunc);

			function _swipeNavFunc(direction, url, ev) {
				if (ev.isFinal && ev.direction === direction) {
					if (ctrlElement.toJSON) {
						// save state of ctrl
						try {
							localStorage.setItem(storageKey, JSON.stringify(ctrlElement.toJSON()));
						} catch (ex) {
							console.error('error saving ui pad state: ' + ex);
						}
					}

					// set new location
					window.location = url;
				}
			}

			function _tapNavFunc(event) {
				if (ctrlElement.toJSON) {
					// save state of ctrl
					try {
						localStorage.setItem(storageKey, JSON.stringify(ctrlElement.toJSON()));
					} catch (ex) {
						console.error('error saving ui pad state: ' + ex);
					}
				}

				var right = event.center.x < window.innerWidth / 2;
				if (right)
					window.location = urlRight;
				else
					window.location = urlLeft;
			}
		}
	};
})();