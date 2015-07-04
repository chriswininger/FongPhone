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

// handle manifest on our own to make sure content-type is set correctly
app.use('/application.manifest', function (req, res, next) {
	res.type('text/cache-manifest');
	var readStream = fs.createReadStream('./public/application.manifest');
	readStream.pipe(res);
});
app.use(express.static('public'));
app.listen(3000);
console.log('listening on port 3000');