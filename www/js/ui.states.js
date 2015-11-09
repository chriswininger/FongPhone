(function() {
	var _soundKey = 'ui.sound.state';
	var _mapKey = 'ui.map.state';
	var _padKey = 'ui.pad.state';
	var _stateListKey = 'ui.states.list';

	FongPhone.UI.StatesController = function(uiMap, uiPad, uiSoundSettings) {
		FongPhone.utils.createGetSet(this, 'selectedState', this.getSelectedState, this.setSelectedState);

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

			var style = $('<style>.ui-states-state-list-entry .ui-states-btn { width: ' +
				(window.innerWidth - 67) +
				'px; }</style>');
			$('html > head').append(style);

			FongPhone.UI.Helper.registerSwipeNavigation(this, 'ui.map.state', 'statesSwipeStrip', '#/sound', Hammer.DIRECTION_RIGHT);
			FongPhone.UI.Helper.registerSwipeNavigation(this, 'ui.map.state', 'statesSwipeStrip', '#/note-map', Hammer.DIRECTION_LEFT);

			this.$scope.storedList = this.storedList;
			this.$scope.restoreAllDefaults = function() {
				self.restoreDefaults();
			};

			this.$scope.saveCurrentState = function() {
				vex.dialog.open({
					message: 'Name:',
					input: '<input name="name" type="text" placeholder="please enter a name"/>',
					buttons: [
						$.extend({}, vex.dialog.buttons.YES, {
							text: 'Save'
						}),
						$.extend({}, vex.dialog.buttons.NO, {
							text: 'Cancel'
						})
					],
					callback: function(data) {
						if (data === false) return;
						if (data.name) {
							self.saveAll.call(self, data.name);
							if (self.$scope) self.$scope.$apply();
						}
					}
				});
			};

			this.$scope.restoreState = function($index) {
				self.restoreState(this.storedList[$index]);
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
			if (name) name = name + '_';
			return _getStoredState(name + _mapKey, FongPhone.UI.Defaults.noteMapSettings);
		},
		getPadState: function(name) {
			name = name || '';
			if (name) name = name + '_';
			return _getStoredState(name + _padKey, FongPhone.UI.Defaults);
		},
		getSelectedState: function() {
			return this._selectedState;
		},
		setSelectedState: function(state) {
			this._selectedState = state;
			if (this.$scope)
				this.$scope.selectedState = state;
		},
		getStateList: function() {
			var lst = this.storedList || [];
			var lstStore = localStorage.getItem(_stateListKey);
			var newList = [];
			if (lstStore)
				newList = JSON.parse(lstStore);

			// append names to current store instance
			_.each(newList, function(name) {
				if (!_.find(lst, function(entryName) { return entryName === name;  })) {
					lst.push(name);
				}
			});

			return lst;
		},
		getSoundState: function(name) {
			name = name || '';
			if (name) name = name + '_';
			return _getStoredState(name + _soundKey, FongPhone.UI.Defaults.soundBoardSettings);
		},
		restoreDefaults: function() {
			this.clearAll();
			this.uiPad.set(this.getPadState());
			this.uiSoundSettings.set(this.getSoundState());
			this.uiMap.set(this.getMapState());
		},
		restoreState: function(name) {
			this.uiPad.set(this.getPadState(name));
			this.uiSoundSettings.set(this.getSoundState(name));
			this.uiMap.set(this.getMapState(name));
			this.selectedState = name;
		},
		saveAll: function(name) {
			if (_.contains(this.storedList, name)) {
				return console.error('name already exists');
			}
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
			if (name) name = name + '_';

			try {
				localStorage.setItem(name + _mapKey, JSON.stringify(this.uiMap));
			} catch (ex) {
				console.error('error saving map: ' + ex);
			}
		},
		savePad: function(name) {
			if (!this.uiPad) return;

			name = name || '';
			if (name) name = name + '_';

			try {
				localStorage.setItem(name + _padKey, JSON.stringify(this.uiPad));
			} catch (ex) {
				console.error('error saving pad: ' + ex);
			}
		},
		saveSoundSettings: function(name) {
			if (!this.uiSoundSettings) return;

			name = name || '';
			if (name) name = name + '_';

			try {
				localStorage.setItem(name + _soundKey, JSON.stringify(this.uiSoundSettings));
			} catch (ex) {
				console.error('error saving sound settings: ' + ex);
			}
		}
	});

	function _getStoredState(key, defaults) {
		var storedState = null;
		defaults = _.clone(defaults);
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