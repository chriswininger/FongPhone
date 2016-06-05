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

		// redirect to correct view based on subspace returned in form
		switch (subSpace) {
			case '/soundBoard':
				window.location.href = '#/sound';
				break;
			case '/noteMap':
				window.location.href = '#/note-map';
				break;
			case '/pad1':
				// fall through
			case '/pad2':
				window.location.href = '#/';
				break;
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
			window.location.href = '/thanks-for-playing.html';
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
					NoteMapOn: false,
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
					NoteMapOn: false,
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
			templateUrl: 'views/view-sound.html',
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