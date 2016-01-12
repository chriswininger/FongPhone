var gulp = require('gulp');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var recursive = require('recursive-readdir');
var async = require('async');
var exec = require('child_process').exec;

gulp.task('make:manifest', makeManifest);
gulp.task('initialize', initialize);

var clientDependencies = [
	'angularjs#1.4.x',
	'angular-animate#1.4.x',
	'angular-route#1.4.x',
	'async#1.4.x',
	'jquery#2.1.x',
	'lodash#3.10.x',
	'hammerjs#2.0.x',
	'jquery-touch-events#1.0.x',
    'teoria',
	'localforage#1.2.x',
	'jquery-knob',
	'ngDraggable',
	'js-signals',
	'vex#2.3.3',
	'save-svg-as-png',
	'cordova-plugin-dialogs'
];
function initialize (complete) {
	async.waterfall([
		function _installDependencies(next) {
			console.log('installing dependencies');
			async.each(clientDependencies, function(dep, _next) {
				console.log('installing ' + dep);
				exec('bower install ' + dep, function (err, stdout, stderr) {
					if (err || stderr) {
						console.error(stderr);
						console.error(err);
						return _next(err + ' -- ' + stderr);
					}

					console.log(stdout);
					_next();
				});
			}, next)
		},
		function _addCordovaModules(next) {
			console.log('you\'ll need to install the following plugs to properly build and deploy');
			console.log('   cordova plugin add cordova-plugin-crosswalk-webview');
			console.log('   cordova plugins add org.apache.cordova.dialogs');
			console.log('   cordova plugins add cordova-plugin-splashscreen');
			next();
		}
	], function _complete() {
		console.log('initialization complete');
		complete();
	});
}

function makeManifest () {
	console.log('building manifest file');
	var manifestPath = './public/application.manifest';

	async.waterfall([
		function _getFileList(next) {
			console.log('building file list');
			var lstFiles = '';
			recursive('./public', ['application.manifest'], function (err, files) {
				if (err) return next(err)
				_.each(files, function (file) {
					lstFiles += file.replace('public/','') + '\n';
				});

				next(null, lstFiles);
			});
		},
		function _removeExistingManifest(lstFiles, next) {
			console.log('clearing existing manifest');
			fs.unlink(manifestPath, function () {
				next(null, lstFiles);
			});
		},
		function _writeFile(lstFiles, next) {
			console.log('writing new manifest');
			var manifest = [
				'CACHE MANIFEST',
				'# timestamp ' + (new Date().getTime()),
				'CACHE:',
				lstFiles,
				'NETWORK:',
				'*'
			].join('\n');

			fs.writeFile(manifestPath, manifest, next);
		}
	], function (err) {
		if (err) return console.error(err);
		console.log('task complete');
	});
}
