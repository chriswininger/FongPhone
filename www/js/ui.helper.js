(function () {
	FongPhone.UI.Helper = {
		registerSwipeNavigation: function (ctrlElement, storageKey, elementID, url, direction) {
			var uiSwipe = document.getElementById(elementID);
			var hammerSwipe = new Hammer(uiSwipe, {
				direction: direction
			});

			// release any previous listeners to avoiding holding onto old dom elements
			hammerSwipe.off('pan');
			hammerSwipe.on('pan', function (ev) {
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
			});
		},
		registerClickNavigation: function (ctrlElement, storageKey, elementID, url) {
			var uiSwipe = document.getElementById(elementID);
			
			//var hammer = new Hammer(document.getElementById(elementID));
			var hammertime = Hammer(document.getElementById(elementID)).on("tap", function(event) {
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
			});
		}
	};
})();