// TODO (CAW) Namespace these
var logicBoard;
(function () {
	var subSpace = $('body').data('subspace');
	console.log('starting...');
	vex.defaultOptions.className = 'vex-theme-wireframe';

	var isCordova = (document.URL.indexOf('http://') === -1 &&
	document.URL.indexOf('https://') === -1);

	console.log('using sub space: ' + subSpace);
	$(function _deviceReady(id) {
		console.log('device ready');
		var domElement = document.querySelector('body');
		angular.bootstrap(domElement, ['fongPhone']);

		var heightAdjustmentFunc;

		// redirect to correct view based on subspace returned in form
		switch (subSpace) {
			case '/soundBoard':
				window.location.href = '#/sound';
				heightAdjustmentFunc = _.bind(soundUI.adjustHeightWidth, soundUI);
				break;
			case '/noteMap':
				window.location.href = '#/note-map';
				heightAdjustmentFunc = _.bind(noteMap.adjustHeightWidth, noteMap);
				break;
			case '/pad1':
				// fall through
			case '/pad2':
				window.location.href = '#/';
				heightAdjustmentFunc = _.bind(padUI.adjustHeightWidth, padUI);
				break;
		}


		window.addEventListener('orientationchange', function _orientationChanged() {
			if (!heightAdjustmentFunc)
				return console.warn('no height adjustment found for sub space: ' + subSpace);

			setTimeout(heightAdjustmentFunc, 300);
		});

		$(window).resize(function() {
			setTimeout(heightAdjustmentFunc, 300);
		});


		// Need to prompt user and then do this on button press
		swal({
				title: "Allow Full Screen",
				text: "Allow Full Screen Fongs?",
				type: "info",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Allow",
				closeOnConfirm: false
			},
			_tryGetFullOnClick
		);

		function _tryGetFullOnClick() {
			try {
				swal.close();
				launchIntoFullscreen(document.documentElement);
			} catch (ex) {
				console.warn('error getting full screen: ' + ex);
			}
		}
	});

	if (document.visibilityState === 'prerender') {
		// don't connect to sockets, this is chrome trying to pre-load the page
		console.log('short circuit for preview mode');
		return;
	}

	// connect to websocket over the specified subspace
	var socket = io(subSpace);
	var stateController = new FongPhone.UI.StatesController();
	socket.on('disconnect', function(msg) {
		console.log('server dropped connection: ' + msg);
		if (msg === 'io server disconnect') {
			// the server has disconnected due to inactivity or because you lost connection for too long
			window.location.href = '/thanks-for-playing?disconnected=true';
		}
	});
	socket.on('spot:taken', function() {
		// this spot was full (two users requesting at once), try again
		console.log('the requested spot was taken: ' + subSpace);
		window.location.href = '/';
	});

	// hack around the fact that note map is storing data on au.fong and logic board instead of using pad and ui.fongs
	var fakeLogicBoard = {
		filterOn: true,
		fongs: [
			{
				id: 0,
				NoteMapInfo: new FongPhone.Logic.NoteMapInfo({
					SelectedScale: 'ionian',
					baseNote: 'a',
					octave: 4,
					availableNotes: [],
					NoteMapOn: true,
					FilterNoteMapOn: false,
					LoopDuration: 15000,
					loopChunkinessFactor: .5,
					pullChunkiness: .5
				})
			},
			{
				id: 1,
				NoteMapInfo: new FongPhone.Logic.NoteMapInfo({
					SelectedScale: 'ionian',
					baseNote: 'a',
					octave: 4,
					availableNotes: [],
					NoteMapOn: true,
					FilterNoteMapOn: false,
					LoopDuration: 15000,
					loopChunkinessFactor: .5,
					pullChunkiness: .5
				})
			},
			{
				id: 2,
				NoteMapInfo: new FongPhone.Logic.NoteMapInfo({
					SelectedScale: 'ionian',
					baseNote: 'a',
					octave: 4,
					availableNotes: [],
					NoteMapOn: true,
					FilterNoteMapOn: false,
					LoopDuration: 15000,
					loopChunkinessFactor: .5,
					pullChunkiness: .5
				})
			},
			{
				id: 3,
				NoteMapInfo: new FongPhone.Logic.NoteMapInfo({
					SelectedScale: 'ionian',
					baseNote: 'a',
					octave: 4,
					availableNotes: [],
					NoteMapOn: true,
					FilterNoteMapOn: false,
					LoopDuration: 15000,
					loopChunkinessFactor: .5,
					pullChunkiness: .5
				})
			}
		]
	};
	var padUI = new FongPhone.UI.Pad(subSpace, null, stateController.getPadState(), socket);
	var soundUI = new FongPhone.UI.Sound(fakeLogicBoard, padUI, stateController.getSoundState(), socket);
	var noteMap = new FongPhone.UI.NoteMap(fakeLogicBoard, stateController.getMapState(), socket);

	//stateController.uiMap = noteMap;
	stateController.uiPad = padUI;
	//stateController.uiSoundSettings = soundUI;


	FongPhone.Navigation.tabNavigationFunc = _.partial(FongPhone.Navigation.tabNavigationFunc, stateController);

	var fongPhone = angular.module('fongPhone', ['ngRoute', 'ngAnimate', 'ngDraggable']).directive('ngY', function () {
		return function (scope, element, attrs) {
			scope.$watch(attrs.ngY, function (value) {
				element.attr('y', value);
			});
		};
	}).directive('ngX', function () {
		return function (scope, element, attrs) {
			scope.$watch(attrs.ngX, function (value) {
				element.attr('x', value);
			});
		};
	});

	fongPhone.config(function ($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'views/gallery.view.pad.html',
			controller: 'padController'
		}).when('/note-map', {
			templateUrl: 'views/gallery.view.map.html',
			controller: 'noteMapController'
		}).when('/sound', {
			templateUrl: 'views/gallery.view.sound.html',
			controller: 'soundController'
		}).when('/states', {
			templateUrl: 'views/view-states.html',
			controller: 'stateController'
		});
	});

	// initialize angular route controllers
	fongPhone.controller('padController', ['$scope', function ($scope) {
		$scope.tabbedNavigationTabs = FongPhone.Navigation.Tabs;
		$scope.pageClass = 'view-pad';
		$scope.tabNavigationFunc = FongPhone.Navigation.tabNavigationFunc;
		padUI.attachToDom($scope);
	}]);

	fongPhone.controller('soundController', ['$scope', function ($scope) {
		$scope.tabbedNavigationTabs = FongPhone.Navigation.Tabs;
		$scope.pageClass = 'view-sound';
		$scope.tabNavigationFunc = FongPhone.Navigation.tabNavigationFunc;
		soundUI.attachToDom($scope);

		/*
			Code that requests and updates the client state from the server, but we're not going to use this for now
			socket.emit('get:state', function(err, state) {
			if (err) {
				console.warn('err');
			} else if (state) {
				for (var i = 0; i < soundUI._fongStates.length; i++) {
					if (state[i]) {
						soundUI.selectedFongID = i;
						soundUI.filterResonance = state[i].filterResonance ||
								soundUI.filterResonance;
						soundUI.env1Control = state[i].env1Control ||
								soundUI.env1Control;
						soundUI.delayVolumeControl = state[i].delayVolumeControl ||
							soundUI.delayVolumeControl;
						soundUI.delayTimeControl = state[i].delayTimeControl ||
							soundUI.delayTimeControl;
						soundUI.delayFeedBackControl = state[i].delayFeedbackControl ||
							soundUI.delayFeedBackControl;
						soundUI.filterType = state[i].filterType ||
								soundUI.filterType
					}
				}

				soundUI.selectedFongID = 0;
				soundUI.filterPortamento = state.filterPortamento ||
						soundUI.filterPortamento;
			}
			soundUI.attachToDom($scope);
		});*/
	}]);

	fongPhone.controller('noteMapController', function($scope) {
		$scope.tabbedNavigationTabs = FongPhone.Navigation.Tabs;
		$scope.pageClass = 'view-map';
		$scope.tabNavigationFunc = FongPhone.Navigation.tabNavigationFunc;
		noteMap.attachToDom($scope);
	});

	fongPhone.controller('stateController', function($scope) {
		$scope.tabbedNavigationTabs = FongPhone.Navigation.Tabs;
		$scope.pageClass = 'view-states';
		$scope.tabNavigationFunc = FongPhone.Navigation.tabNavigationFunc;
		stateController.attachToDom($scope);
	});

	// answer to annoying iOS bug found here http://stackoverflow.com/a/34501159/3175029
	function playInitSound(context) {
		var source = context.createBufferSource();
		source.buffer = context.createBuffer(1, 1, context.sampleRate);
		source.connect(context.destination);
		if (source.start) {
			source.start(0);
		} else {
			source.noteOn(0);
		}
	};

	function _onPause() {
		FongPhone.AppState.paused = true;
		stateController.saveAll();
	}

	function _onResume() {
		FongPhone.AppState.paused = false;
	}

	FongPhone.Debugging.dumpAllStateToConsole = function() {
		console.log(JSON.stringify(stateController.getAllStates(), null, 4));
		console.log('------CURRENT STATE-------');
		console.log(JSON.stringify(noteMap.toJSON(), null, 4));
		console.log('--------------------------');
	}

	function launchIntoFullscreen(element) {
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	}

})();

// TODO -- Stick inside closure and give name space like Fong.log (prevents library conflicts)
function log(message) {
	$('#log').html(message);
}

function setWindow(page) {
	setTimeout(function() {
		window.location = page;
	}, 10);
}