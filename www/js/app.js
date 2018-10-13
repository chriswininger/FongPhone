// TODO (CAW) Namespace these
var logicBoard;
(function () {
	console.log('starting...');
	vex.defaultOptions.className = 'vex-theme-wireframe';

	var isCordova = (document.URL.indexOf('http://') === -1 &&
		document.URL.indexOf('https://') === -1);

	if (isCordova) {
		document.addEventListener('deviceready', _deviceReady, false);
		document.addEventListener('pause', _onPause, false);
		document.addEventListener('resume', _onResume, false);
	} else {
		$(_deviceReady);
	}
	
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

	// sound and sound logic layer
	var context;
	if (typeof AudioContext !== "undefined") {
		context = new AudioContext();
	} else if (typeof webkitAudioContext !== "undefined") {
		context = new webkitAudioContext();
		playInitSound(context);
		if (context.sampleRate === 48000) {
			context = new webkitAudioContext();
			playInitSound(context);
		}
	} else {
		return console.error(new Error('AudioContext not supported.'));
	}

	var stateController = new FongPhone.UI.StatesController();
    if (FongPhone.UI.Helper.getVersion() !== '1.1.0') {
        console.log('clearing states for pre 1.1.0 release');
		localStorage.clear()
        FongPhone.UI.Helper.setVersion('1.1.0');
    }

	logicBoard = new FongPhone.Logic.BoardLogic(context, FongPhone.Logic.Defaults.logicBoardDefaults);
	var padUI = new FongPhone.UI.Pad(logicBoard, stateController.getPadState());
	var soundUI = new FongPhone.UI.Sound(logicBoard, padUI, stateController.getSoundState());
	var noteMap = new FongPhone.UI.NoteMap(logicBoard, stateController.getMapState());

	stateController.uiMap = noteMap;
	stateController.uiPad = padUI;
	stateController.uiSoundSettings = soundUI;


	FongPhone.Navigation.tabNavigationFunc = _.partial(FongPhone.Navigation.tabNavigationFunc, stateController);

		// start the oscillators after all other settings have been initialized to avoid hiccup
	setTimeout(function() {
		logicBoard.start();
	}, 1000);

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
			templateUrl: 'views/view-pad.html',
			controller: 'padController'
		}).when('/note-map', {
			templateUrl: 'views/view-map.html',
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

	function _deviceReady(id) {
		console.log('device ready');
		var domElement = document.querySelector('body');
		angular.bootstrap(domElement, ['fongPhone']);
		setTimeout(function () {
			if (navigator && navigator.splashscreen)
				navigator.splashscreen.hide();
		}, 500);
	}

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