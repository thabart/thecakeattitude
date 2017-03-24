'use strict';
var Player = require('./player');

var io = require('socket.io').listen(3001, function() {
	console.log('listening on port 3001');
});

io.on('connection', function(socket) {
	console.log('a user is connected');
});

io.on('new_player', function(data) {
	var newPlayer = new Player(data.x, data.y);
	console.log('bou');
});
