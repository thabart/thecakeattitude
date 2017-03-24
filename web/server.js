'use strict';
var Player = require('./player');

var players = [];
var io = require('socket.io').listen(3001, function() {
	console.log('listening on port 3001');
});

io.on('connection', function(socket) {
	console.log('a user is connected');
	socket.on('new_player', function(data) {
		var newPlayer = new Player(data.x, data.y);
		newPlayer.id = this.id;
		this.broadcast.emit('new_player', { id: newPlayer.id, x : newPlayer.getX(), y : newPlayer.getY() });
		var i, existingPlayer
		for (i = 0; i < players.length; i++) {
			existingPlayer = players[i];			
			this.emit('new_player', { id: existingPlayer.id, x : existingPlayer.getX(), y : existingPlayer.getY() });
		}
		
		players.push(newPlayer);
	});
	socket.on('disconnect', function() {
		var removePlayer = getPlayer(this.id);
		if (!removePlayer) {
			return
		}

		players.splice(players.indexOf(removePlayer), 1);
		this.broadcast.emit('remove_player', {id: this.id});
	});
	socket.on('move_player', function(data) {
		var player = getPlayer(this.id);
		if (!player) {
			return;
		}
		
		player.setX(data.x);
		player.setY(data.y);
		this.broadcast.emit('move_player', { id : player.id, x : player.getX(), y : player.getY() });
	});
});

function getPlayer(id) {
  var i;
  for (i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i]
    }
  }
  
  return false
}