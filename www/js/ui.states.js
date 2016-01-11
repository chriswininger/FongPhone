(function () {
	var _soundKey = 'ui.sound.state';
	var _mapKey = 'ui.map.state';
	var _padKey = 'ui.pad.state';
	var _stateListKey = 'ui.states.list';

	FongPhone.UI.StatesController = function (uiMap, uiPad, uiSoundSettings) {
		FongPhone.utils.createGetSet(this, 'selectedState', this.getSelectedState, this.setSelectedState);
		this.keepLoop = true;

		this.uiMap = uiMap;
		this.uiPad = uiPad;
		this.uiSoundSettings = uiSoundSettings;
		this.selectedState = '';
		this.storedList = this.getStateList();
	};

	_.extend(FongPhone.UI.StatesController.prototype, {
		addToStateList: function (name) {
			try {
				var lst = this.getStateList();
				lst.push(name);

				localStorage.setItem(_stateListKey, JSON.stringify(lst));
			} catch (ex) {
				console.error('error saving local state list: ' + ex);
			}
		},
		attachToDom: function ($scope) {
			var self = this;
			this.$scope = $scope;
			$scope.pageClass = 'view-states';
			var statesUI = $('#statesUI');
			var stateControls = $('#stateControls');
			var statesContentWrapper = $('#statesContentWrapper');

			statesUI.css('max-height', (window.innerHeight - 40) + "px");
			statesUI.css('height', (window.innerHeight - 40) + "px");

			FongPhone.UI.Helper.registerSwipeNavigation(this, 'ui.map.state', 'statesSwipeStrip', '#/note-map', '#/sound');

			// build state selection board
			var a = [];
			var storedTable = [];
			var columns = Math.floor(window.innerWidth / 50) - 1;
			var rows = Math.floor(($("#statesUI").height() - 20) / 50) - 3;
			
			if ((window.innerWidth - columns * 50) < 70)
			{
				columns--;
			}
			if ((window.innerHeight - rows * 60) < 70)
			{
				rows--;
			}
			
			var cellWidth = 45;
			var cellHeight = 45;
			for (var i = 0; i < rows; i++) {
				a = [];
				for (var j = 0; j < columns; j++) {
					var index = i * columns + j;
					if (index < this.storedList.length) {
						var name = this.storedList[index];
						a.push({
							preset: name,
							width: cellWidth + "px",
							height: cellHeight + "px",
							index: index,
							i: i,
							j: j
						});
					} else {
						a.push({
							preset: null,
							width: cellWidth + "px",
							height: cellHeight + "px",
							index: index,
							i: i,
							j: j
						});
					}
				}
				storedTable.push(a);
			}

			// events
			$("#stateDefault").click(function () {
				self.fadeStateDiv(event.target, .6);
				self.restoreDefaults();
			});

			this.$scope.storedTable = storedTable;
			this.$scope.storedList = this.storedList;
			this.$scope.restoreAllDefaults = function () {
				self.restoreDefaults();
			};

			this.$scope.applyPreset = function (item) {
				if (!item) {
					self.restoreDefaults();
				} else if (item.preset) {
					self.fadeStateDiv(event.target, .6);
					self.restoreState(item.preset);
				}
			};

			this.$scope.restoreState = function ($index) {
				self.restoreState(this.storedList[$index]);
			};
			
			FongPhone.UI.Helper.registerAlertOnFirstView("statesMessage", 'Press and hold a square to save a state for later use. Press the bottom rectangle to return the Fongs to their default states. Got it?', 'States');
			
			$(document).on('taphold', ".state,.stateUnused", function (event) {
				// wrap in $apply so that angular knows to update ui bindings
				$('.state').stop(true);
				$('.state').css('opacity', .4);
				self.$scope.$apply(function() {
					self.fadeStateDiv(event.target, .6);
					var index = event.target.id.replace("state", "");
					for (var i = 0; i < self.$scope.storedTable.length; i++) {
						for (var j = 0; j < self.$scope.storedTable[i].length; j++) {
							if (index == self.$scope.storedTable[i][j].index) {
								self.$scope.storedTable[i][j].preset = index;
							}
						}
					}

					self.saveAll(index);
				});
			});

		},
		clearAll: function () {
			this.clearMap();
			this.clearPad();
			this.clearSoundSettings();
		},
		clearMap: function () {
			if (!this.uiMap) return;
			try {
				localStorage.removeItem(_mapKey);
			} catch (ex) {
				console.error('error removing map: ' + ex);
			}
		},
		clearPad: function () {
			if (!this.uiPad) return;
			try {
				localStorage.removeItem(_padKey);
			} catch (ex) {
				console.error('error removing pad: ' + ex);
			}
		},
		clearSoundSettings: function () {
			if (!this.uiSoundSettings) return;
			try {
				localStorage.removeItem(_soundKey);
			} catch (ex) {
				console.error('error clearing sound settings: ' + ex);
			}
		},

		// returns a json object containing all stored states (adding for debugging/dev use)
		getAllStates: function() {
			var stateList = this.getStateList();
			var rtn = {};
			_.each(stateList, function _sndStateItr(stateKey) {
				rtn[stateKey] = {
					soundSettings: this.getSoundState(stateKey),
					padSettings: this.getPadState(stateKey),
					noteSettings: this.getMapState(stateKey)
				};
			}, this);

			return rtn;
		},
		getMapState: function(name) {
			name = name || '';
			if (name) name = name + '_';
			return _getStoredState(name + _mapKey, FongPhone.UI.Defaults.noteMapSettings);
		},
		getPadState: function (name) {
			name = name || '';
			if (name) name = name + '_';
			return _getStoredState(name + _padKey, FongPhone.UI.Defaults);
		},
		getSelectedState: function () {
			return this._selectedState;
		},
		setSelectedState: function (state) {
			this._selectedState = state;
			if (this.$scope)
				this.$scope.selectedState = state;
		},
		getStateList: function () {
			var lst = this.storedList || [];
			var lstStore = localStorage.getItem(_stateListKey);
			var newList = [];
			if (lstStore)
				newList = JSON.parse(lstStore);

			// append names to current store instance
			_.each(newList, function (name) {
				if (!_.find(lst, function (entryName) {
						return entryName === name;
					})) {
					lst.push(name);
				}
			});

			return lst;
		},
		getSoundState: function (name) {
			name = name || '';
			if (name) name = name + '_';
			return _getStoredState(name + _soundKey, FongPhone.UI.Defaults.soundBoardSettings);
		},
		restoreDefaults: function () {
			this.clearAll();
			this.uiPad.set(this.getPadState());
			this.uiSoundSettings.set(this.getSoundState());
			this.uiMap.set(this.getMapState());
		},
		restoreState: function (name) {
			this.uiPad.set(this.getPadState(name), true);
			this.uiSoundSettings.set(this.getSoundState(name));

			var mapState = this.getMapState(name);
			if (this.keepLoop && mapState) {
				_.each(mapState.fongs, function(_fong) {
					if (_fong.NoteMapInfo) {
						delete _fong.NoteMapInfo.LoopDuration;
						delete _fong.NoteMapInfo.loopChunkinessFactor;
						delete _fong.NoteMapInfo.pullChunkiness;
						delete _fong.NoteMapInfo.LoopOn;
						delete _fong.NoteMapInfo.makeLoopChunky;
						delete _fong.NoteMapInfo.pullLoopChunky;
					}
				});
			}

			this.uiMap.set(mapState);
			this.selectedState = name;
		},
		fadeStateDiv: function (target, targetOpacity) {
			$('.state').stop(true);
			$('.state').css('opacity', .4);
			$(target).animate({
				opacity: .8
			}, 50, function () {
				$(target).animate({
					opacity: targetOpacity
				}, 5000, function () {
					// Animation complete.
				});
			});
		},
		saveAll: function (name) {
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
		saveMap: function (name) {
			if (!this.uiMap) return;

			name = name || '';
			if (name) name = name + '_';

			try {
				localStorage.setItem(name + _mapKey, JSON.stringify(this.uiMap));
			} catch (ex) {
				console.error('error saving map: ' + ex);
			}
		},
		savePad: function (name) {
			if (!this.uiPad) return;

			name = name || '';
			if (name) name = name + '_';

			try {
				localStorage.setItem(name + _padKey, JSON.stringify(this.uiPad));
			} catch (ex) {
				console.error('error saving pad: ' + ex);
			}
		},
		saveSoundSettings: function (name) {
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