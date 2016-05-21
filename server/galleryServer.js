/**
 * Simple test server
 *  This can probably be removed from the final project but it simplifies testing
 *  by letting you easily host the public directory of this project over the network
 *  so mobile devices can reach it
 * @type {*|exports}
 */
var express = require('express');
var app = express();
var fs = require('fs');
var port = 3002;
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jade = require('jade');

// setup sessions
//mongoose.connect();
/*app.use(expressSession({
	secret: 'a4f8071f-c873-4447-8ee2',
	cookie: { maxAge: 2628000000 },
	store: new (require('express-sessions'))({
		storage: 'mongodb',
		instance: mongoose, // optional
		host: 'localhost', // optional
		port: 27017, // optional
		db: 'test', // optional
		collection: 'sessions', // optional
		expire: 86400 // optional
	})
}));*/

var slots = {
	pad1: false,
	pad2: false,
	soundBoard: false
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

			console.log('!!! slots: ' + JSON.stringify(slots, null, 4));
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
		subspace: '/' + selectedSubSpace,
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

io.of('pad1').on('connection', function (socket) {
	console.log('user pad 1 connected: ' + socket.id);
	socket.on('fong:event', function(data) {
		displayNSP.emit('fong:event:pass', data);
	});

	socket.on('disconnect', function() {
		console.log('lost user pad 1 connection');
		slots.pad1 = false;
	});
});

io.of('pad2').on('connection', function (socket) {
	console.log('user pad 2 connected: ' + socket.id);

	socket.on('fong:event', function(data) {
		console.log('!!! pad2: ' + JSON.stringify(data, null, 4));
		displayNSP.emit('fong:event:pass', data);
	});

	socket.on('disconnect', function() {
		console.log('lost user pad 2 connection');
		slots.pad2 = false;
	});
});
io.of('soundBoard').on('connection', function(socket) {
	socket.on('disconnect', function() {
		console.log('lost sound board connection');
		slots.soundBoard = false;
	});
});

/*io.on('connection', function(socket){

});*/

function _remoteRequest(req, req, next) {
	next();
}

http.listen(port);
console.log('listening on port ' + port);