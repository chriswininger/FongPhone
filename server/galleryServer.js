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
var port = 3001;
var http = require('http').Server(app);
var io = require('socket.io')(http);

// handle manifest on our own to make sure content-type is set correctly
app.get('/', function(req, res) {
	res.redirect('/galleryIndex.html');
});
app.use('/application.manifest', function (req, res, next) {
	res.type('text/cache-manifest');
	var readStream = fs.createReadStream(__dirname + '/../www/application.manifest');
	readStream.pipe(res);
});
app.use(express.static(__dirname + '/../www'));

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('fong:event', function(data) {
		console.log('!!! data: ' + JSON.stringify(data, null, 4));
		io.emit('fong:event:pass', data);
	});
});



http.listen(port);
console.log('listening on port ' + port);