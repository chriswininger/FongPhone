(function() {
	var _soundKey = 'ui.sound.state';
	var _mapKey = 'ui.map.state';
	var _padKey = 'ui.pad.state';
	var _stateListKey = 'ui.states.list';

	FongPhone.UI.StatesController = function(uiMap, uiPad, uiSoundSettings) {
		this.uiMap = uiMap;
		this.uiPad = uiPad;
		this.uiSoundSettings = uiSoundSettings;
		this.selectedState = '';
		this.storedList = this.getStateList();
	}

	_.extend(FongPhone.UI.StatesController.prototype, {
		addToStateList: function(name) {
			try {
				var lst = this.getStateList();
				lst.push(name);

				this.storedList = lst;
				if (this.$scope) {
					this.$scope.storedStates = this.storedList;
				}

				localStorage.setItem(_stateListKey, JSON.stringify(lst));
			} catch (ex) {
				console.error('error saving local state list: ' + ex);
			}
		},
		attachToDom: function($scope) {
			var self = this;
			this.$scope = $scope;
			$scope.pageClass = 'view-states';
			$('#statesUI').css('max-height', (window.innerHeight - 40) + "px");
			$('#statesUI').css('height', (window.innerHeight - 40) + "px");
			$('.ui-states-state-list-flex .ui-states-btn').css('width', (window.innerWidth/2 - 67) + 'px');
			$('.ui-states-state-list-entry .ui-states-btn').css('width', (window.innerWidth - 67) + 'px');

			FongPhone.UI.Helper.registerSwipeNavigation(this, 'ui.map.state', 'statesSwipeStrip', '#/sound', Hammer.DIRECTION_RIGHT);
			FongPhone.UI.Helper.registerSwipeNavigation(this, 'ui.map.state', 'statesSwipeStrip', '#/note-map', Hammer.DIRECTION_LEFT);

			this.$scope.storedList = this.storedList;
			this.$scope.restoreAllDefaults = function() {
				self.restoreDefaults();
			};

			this.$scope.saveCurrentState = function() {
				navigator.notification.prompt(
					'name',
					function(index, name) {
						if (index === 1) {
							console.log('!!! saving');
						}
					},
					'Save State',
					['Save', 'Cancel']);
			}
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
		getStateList: function() {
			var lst = [];
			var lstStore = localStorage.getItem(_stateListKey);
			if (lstStore)
				lst = JSON.parse(lstStore);

			return lst;
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
		saveAll: function(name) {
			this.saveSoundSettings(name);
			this.saveMap(name);
			this.savePad(name);

			if (name) {
				// store state in list of saved states
				this.addToStateList(name);
			}
		},
		saveMap: function(name) {
			if (!this.uiMap) return;

			name = name || '';
			if (name) name + '_';

			try {
				localStorage.setItem(name + _mapKey, JSON.stringify(this.uiMap));
			} catch (ex) {
				console.error('error saving map: ' + ex);
			}
		},
		savePad: function(name) {
			if (!this.uiPad) return;

			name = name || '';
			if (name) name + '_';

			try {
				localStorage.setItem(_padKey, JSON.stringify(this.uiPad));
			} catch (ex) {
				console.error('error saving pad: ' + ex);
			}
		},
		saveSoundSettings: function(name) {
			if (!this.uiSoundSettings) return;

			name = name || '';
			if (name) name + '_';

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