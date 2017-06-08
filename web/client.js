'use strict';
var express = require('express');
var path = require("path");
var app = express();

app.use('/images', express.static(__dirname + '/build/images'));
app.use('/static', express.static(__dirname + '/build/static'));
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname+'/build/index.html'));
});
app.listen(3001, function() {
	console.log('Game is listening on port 3001!');
});