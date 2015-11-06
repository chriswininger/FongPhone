(function() {
	var _soundKey = 'ui.sound.state';
	var _mapKey = 'ui.map.state';
	var _padKey = 'ui.pad.state';

	FongPhone.UI.StatesController = function(uiMap, uiPad, uiSoundSettings) {
		this.uiMap = uiMap;
		this.uiPad = uiPad;
		this.uiSoundSettings = uiSoundSettings;
		this.selectedState = '';
	}

	_.extend(FongPhone.UI.StatesController.prototype, {
		attachToDom: function($scope) {
			var self = this;
			this.$scope = $scope;
			$scope.pageClass = 'view-states';
			$('#statesUI').css('max-height', (window.innerHeight - 40) + "px");
			$('#statesUI').css('height', (window.innerHeight - 40) + "px");


			FongPhone.UI.Helper.registerSwipeNavigation(this, 'ui.map.state', 'statesSwipeStrip', '#/sound', Hammer.DIRECTION_RIGHT);
			FongPhone.UI.Helper.registerSwipeNavigation(this, 'ui.map.state', 'statesSwipeStrip', '#/note-map', Hammer.DIRECTION_LEFT);

			this.$scope.restoreAllDefaults = function() {
				self.restoreDefaults();
			};
		},
		clearAll: function() {
			this.clearMap();
			this.clearPad();
			this.clearSoundSettings();
		},
		clearMap: function() {
			if (!this.uiMap) return;
			try {
				localStorage.removeItem(_mapKey);
			} catch (ex) {
				console.error('error removing map: ' + ex);
			}
		},
		clearPad: function() {
			if (!this.uiPad) return;
			try {
				localStorage.removeItem(_padKey);
			} catch (ex) {
				console.error('error removing pad: ' + ex);
			}
		},
		clearSoundSettings: function() {
			if (!this.uiSoundSettings) return;
			try {
				localStorage.removeItem(_soundKey);
			} catch (ex) {
				console.error('error clearing sound settings: ' + ex);
			}
		},
		getMapState: function(name) {
			name = name || '';
			return _getStoredState(name + _mapKey, FongPhone.UI.Defaults.noteMapSettings);
		},
		getPadState: function(name) {
			name = name || '';
			return _getStoredState(name + _padKey, FongPhone.UI.Defaults);
		},
		getSoundState: function(name) {
			name = name || '';
			return _getStoredState(name + _soundKey, FongPhone.UI.Defaults.soundBoardSettings);
		},
		restoreDefaults: function() {
			this.clearAll();
			this.uiPad.set(this.getPadState());
			this.uiSoundSettings.set(this.getSoundState());
			this.uiMap.set(this.getMapState());
		},
		saveAll: function() {
			this.saveSoundSettings();
			this.saveMap();
			this.savePad();
		},
		saveMap: function() {
			if (!this.uiMap) return;
			try {
				localStorage.setItem(_mapKey, JSON.stringify(this.uiMap));
			} catch (ex) {
				console.error('error saving map: ' + ex);
			}
		},
		savePad: function() {
			if (!this.uiPad) return;
			try {
				localStorage.setItem(_padKey, JSON.stringify(this.uiPad));
			} catch (ex) {
				console.error('error saving pad: ' + ex);
			}
		},
		saveSoundSettings: function() {
			if (!this.uiSoundSettings) return;
			try {
				localStorage.setItem(_soundKey, JSON.stringify(this.uiSoundSettings));
			} catch (ex) {
				console.error('error saving sound settings: ' + ex);
			}
		}
	});

	function _getStoredState(key, defaults) {
		var storedState = null;
		try {
			storedState = localStorage.getItem(key);
		} catch (ex) {
			console.error('error retrieving %s: %s', key, ex);
		}

		if (storedState) storedState = JSON.parse(storedState);
		if (storedState) return _.extend(defaults, storedState);
		return defaults;
	}
})();