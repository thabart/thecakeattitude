'use strict';
var express = require('express');
var path = require("path");
var app = express();

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.post('login', function(req, res) { // TODO : Implement logs function.
	
});

app.post('paypalcallback', function(req, res) { // TODO : get authorization code + get access token.

});

app.use('/', express.static(__dirname + '/build'));

app.listen(3003, function() {
	console.log('Game is listening on port 3003!');
});
