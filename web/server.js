'use strict';
var express = require('express');
var path = require("path");
var app = express();

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname+'/build/index.html'));
});

app.use('/', express.static(__dirname + '/build'));

app.listen(3001, function() {
	console.log('Website is listening on port 3001!');
});
