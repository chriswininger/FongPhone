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
var debug = require('debug')('server');

var INTERACTION_TIMEOUT = 60000;
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
	var key = Math.random() * 100;
	for (var i = 0; i < slotKeys.length; i++) {
		if (!slots[slotKeys[i]]) {
			console.log('found open slot: ' + slotKeys[i] + ' (' + key + ')');
			selectedSubSpace = slotKeys[i];
			break;
		}
	}

	res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
	res.setHeader('Pragma', 'no-cache');
	res.setHeader('Expires', 0);

	if (!selectedSubSpace) {
		return res.status(404).send('no available slots');
	}

	res.render('remote', {
		subspace: '/' + selectedSubSpace
	});
});

app.get('/states.json', function(req, res) {
	res.status(200).json({ slots: slots, displayServers: displayServers });
});

app.get('/', [_remoteRequest], function(req, res) {
	debug('handling request: ' + req.url);
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
		var ns = 'fong:event';
		if (slot === 'soundBoard')
			ns = 'sound:event';
		var nsPass = ns + ':pass';

		io.of(slot).on('connection', function(socket) {
			console.log('user connected on ' + slot);
			if (slots[slot]) {
				// a user already connected to this slot
				console.log('removing a second user from slot ' + slot);
				socket.emit('spot:taken');
				return;
			}

			console.log('slot ' + slot + ' is now occupied');
			// the slot is now taken
			slots[slot] = true;

			lastInterActionTime = Date.now();

			var _checkInterval = setInterval(_checkForInteraction, 1000);
			var _closedSocket = false;

			socket.on(ns, function(data) {
				debug('received event for ' + slot + ' => ' + data.eventType + ' (' +  data.id + ')');
				// pass events to display server
				displayNSP.emit(nsPass, data);
				lastInterActionTime = Date.now();
			});

			socket.on('disconnect', function() {
				console.log('lost user connection on ' + slot);
				_freeSlot(false);
			});

			function _checkForInteraction() {
				if (Date.now() - lastInterActionTime > INTERACTION_TIMEOUT) {
					console.log('slot %s has been inactive for more than %s', slot, INTERACTION_TIMEOUT);
					_freeSlot(true);
				}
			}

			function _freeSlot(userConnected) {
				if (_closedSocket)
					return; // prevent second pass called on disconnect

				_closedSocket = true;
				clearInterval(_checkInterval);

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

				console.log('closed socket for: %s (%s)', slot, userConnected);
			}
		});
	})(slotKeys[i]);
}

function _remoteRequest(req, req, next) {
	next();
}

http.listen(PORT);
console.log('listening on port ' + PORT);