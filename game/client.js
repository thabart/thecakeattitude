'use strict';
var express = require('express');
var path = require("path");
var app = express();

app.use('/public', express.static(__dirname + '/public'));
app.use('/styles', express.static(__dirname + '/styles'));
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname+'/tchat.html'));
});
app.listen(3000, function() {
	console.log('Game is listening on port 3000!');
});
