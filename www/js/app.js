// TODO (CAW) Namespace these
var logicBoard;
var GLOBAL_NOTE_MAP;
(function () {
	console.log('starting...');
	vex.defaultOptions.className = 'vex-theme-wireframe';

	var isCordova = (document.URL.indexOf('http://') === -1 &&
		document.URL.indexOf('https://') === -1);

	if (isCordova) {
		document.addEventListener('deviceready', _deviceReady, false);
		document.addEventListener("pause", _onPause, false);
	} else {
		$(_deviceReady);
	}

	// sound and sound logic layer
	var context;
	if (typeof AudioContext !== "undefined") {
		context = new AudioContext();
	} else if (typeof webkitAudioContext !== "undefined") {
		context = new webkitAudioContext();
	} else {
		return console.error(new Error('AudioContext not supported.'));
	}

	var stateController = new FongPhone.UI.StatesController();
	logicBoard = new FongPhone.Logic.BoardLogic(context, FongPhone.Logic.Defaults.logicBoardDefaults);
	var padUI = new FongPhone.UI.Pad(logicBoard, stateController.getPadState());
	var soundUI = new FongPhone.UI.Sound(logicBoard, padUI, stateController.getSoundState());
	var noteMap = GLOBAL_NOTE_MAP = new FongPhone.UI.NoteMap(logicBoard, stateController.getMapState());
	stateController.uiMap = noteMap;
	stateController.uiPad = padUI;
	stateController.uiSoundSettings = soundUI;

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
		}).when('/help', {
			templateUrl: 'views/view-help.html',
			controller: 'helpController'
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
		padUI.attachToDom();
		 $scope.pageClass = 'view-pad';
	}]);

	fongPhone.controller('soundController', ['$scope', function ($scope) {
		soundUI.attachToDom($scope);
		$scope.pageClass = 'view-sound';
	}]);

	fongPhone.controller('noteMapController', function($scope) {
		noteMap.attachToDom($scope);
		$scope.pageClass = 'view-map';
	});

	fongPhone.controller('stateController', function($scope) {
		stateController.attachToDom($scope);
	});
	fongPhone.controller('helpController', FongPhone.UI.HelpView);

	function _deviceReady(id) {
		console.log('device ready');
		var domElement = document.querySelector('body');
		angular.bootstrap(domElement, ['fongPhone']);
	}

	function _onPause() {
		stateController.saveAll();
	}
})();

// TODO -- Stick inside closure and give name space like Fong.log (prevents library conflicts)
function log(message) {
	$('#log').html(message);
}