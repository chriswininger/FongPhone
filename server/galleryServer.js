/**
 * Gallery Hop Event Server
 * 	This server will proxy events from remote devices to the display server for the run jump dev gallery hop
 * @type {*|exports}
 */
var express = require('express');
var app = express();
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jade = require('jade');

var INTERACTION_TIMEOUT = 10000;
var PORT = 3002;

var slots = {
	pad1: false,
	pad2: false,
	soundBoard: false,
	noteMap: false
};

var displayServers = 0;

app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');
app.get('/remote', [_remoteRequest], function(req, res) {
	var slotKeys = Object.keys(slots);
	var selectedSubSpace;
	for (var i = 0; i < slotKeys.length; i++) {
		if (!slots[slotKeys[i]]) {
			console.log('found open slot: ' + slotKeys[i])
			slots[slotKeys[i]] = true;
			selectedSubSpace = slotKeys[i];
			break;
		}
	}

	if (!selectedSubSpace) {
		return res.status(404).send('no available slots');
	}

	res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
	res.setHeader('Pragma', 'no-cache');
	res.setHeader('Expires', 0);

	res.render('remote', {
		subspace: '/' + selectedSubSpace
	});
});

app.get('/states.json', function(req, res) {
	res.status(200).json({ slots: slots, displayServers: displayServers });
});

app.get('/', [_remoteRequest], function(req, res) {
	res.redirect('/remote');
});
app.use(express.static(__dirname + '/../www'));


var displayNSP = io.of('display').on('connection', function(socket) {
	console.log('display server connected: ' + socket.id);

	displayServers++;

	socket.on('disconnect', function() {
		displayServers--;
	});
});


var slotKeys = Object.keys(slots);
for (var i = 0; i < slotKeys.length; i++) {
	// wrap current slotKey into scope
	(function(slot) {
		console.log('listen under name space: ' + slot);
		var lastInterActionTime;

		io.of(slot).on('connection', function(socket) {
			console.log('user connected on ' + slot);
			lastInterActionTime = Date.now();

			var _checkForInteraction = function() {
				if (Date.now() - lastInterActionTime > INTERACTION_TIMEOUT) {
					_freeSlot(true);
				}
			};
			setInterval(_checkForInteraction, 1000);

			socket.on('fong:event', function(data) {
				// pass events to display server
				displayNSP.emit('fong:event:pass', data);
				lastInterActionTime = Date.now();
			});

			socket.on('disconnect', function() {
				console.log('lost user connection on ' + slot);
				_freeSlot(false);
			});

			function _freeSlot(userConnected) {
				// free slot
				slots[slot] = false;

				if (userConnected) {
					console.log('closing connection on ' + slot + ' due to inactivity');
					socket.disconnect('closing connection due to inactivity');
				}

				// TODO (CAW) Send out event to display server to stop sound
				displayNSP.emit('fong:event:pass', {
					type: 'disconnect',
					slot: slot
				});

				clearInterval(_checkForInteraction);
			}
		});
	})(slotKeys[i]);
}

function _remoteRequest(req, req, next) {
	next();
}

http.listen(PORT);
console.log('listening on port ' + PORT);