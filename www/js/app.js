(function () {
    try {
        console.log('starting...');
        var defaults = {
            mainVol: 0.5,
            osc1Vol: 0.9949676394462585,
            osc2Vol: 0.9949676394462585,
            osc1Freq: 440,
            osc2Freq: 1000,
            primaryOffset: 0.5,
            osc1MaxFreq: 3000,
            osc2MaxFreq: 10,
            primaryOffsetMax: 10,
            secondaryOffsetMax: 8,
            secondaryOffset: 1.0
        };
        var isCordova = (document.URL.indexOf('http://') === -1 &&
            document.URL.indexOf('https://') === -1);

        if (isCordova)
            document.addEventListener('deviceready', _deviceReady, false);
        else
            $(_deviceReady);

        //alert(navigator.userAgent.toLowerCase());

        //alert('loading audiocontext');

        var context;
        if (typeof AudioContext !== "undefined") {
            context = new AudioContext();
        } else if (typeof webkitAudioContext !== "undefined") {
            context = new webkitAudioContext();
        } else {
            alert('AudioContext not supported. :(');
        }

        //alert('instantiating logic board');

        var logicBoard = new PhonePhong.BoardLogic(context, defaults);
        globalBoard = logicBoard;

        //alert('loaded');

        var fongPhone = angular.module('fongPhone', ['ngRoute', 'ngAnimate']).directive('ngY', function () {
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
            });
        });

        fongPhone.controller('padController', ['$scope', function ($scope) {
            var padUI = new PhonePhong.UI.Pad(logicBoard);
            $scope.pageClass = 'view-pad';
	}]);

        fongPhone.controller('noteMapController', window.PhonePhong.UI.NoteMap);
        fongPhone.controller('helpController', window.PhonePhong.UI.HelpView);

        function _deviceReady(id) {
            console.log('device ready');
            var parentElement = document.getElementById(id);
            var domElement = document.querySelector('body');
            angular.bootstrap(domElement, ['fongPhone']);
        }
        console.log('ending...');
    } catch (err) {
        alert(err.message);
    }
})();

function log(message)
{
    $('#log').html(message);
}