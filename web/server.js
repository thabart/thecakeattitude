'use strict';
var io = require('socket.io').listen(3001, function() {
	console.log('listening on port 3001');
});

io.on('connection', function(socket) {
	console.log('a user is connected');
});
