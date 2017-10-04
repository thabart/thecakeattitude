'use strict';
var express = require('express');
var path = require("path");
var app = express();

app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/lib', express.static(__dirname + '/lib'));
app.use('/resources', express.static(__dirname + '/resources'));
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
});
var port = process.env.PORT || 3002;
app.listen(port, function() {
	console.log('Game is listening on port ' + port);
});
