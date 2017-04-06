'use strict';
var Player = require('./player');

var players = [],
	maps = [];
var io = require('socket.io').listen(3001, function() {
	console.log('listening on port 3001');
});

io.on('connection', function(socket) {
	console.log('a user is connected');
	var removePlayer = function(id, bc) {
		var removePlayer = getPlayer(id);
		if (!removePlayer) {
			return
		}

		var id = removePlayer.getId();
		players.splice(players.indexOf(removePlayer), 1);
		bc.emit('remove_player', { id: id });		
	};
	socket.on('new_player', function(data) {
		var player = new Player(data.x, data.y, data.direction, data.mapId, data.pseudo);		
		player.setId(this.id);
		this.broadcast.emit('new_player', { id: player.getId(), x : player.getX(), y : player.getY(), direction: player.getDirection(), mapId : player.getMapId(), pseudo: player.getPseudo() });
		var i, existingPlayer
		for (i = 0; i < players.length; i++) {
			existingPlayer = players[i];			
			this.emit('new_player', { id: existingPlayer.getId(), x : existingPlayer.getX(), y : existingPlayer.getY(), direction: existingPlayer.getDirection(), mapId : existingPlayer.getMapId(), pseudo: player.getPseudo() });
		}
		
		players.push(player);
	});
	socket.on('remove', function() {
		removePlayer(this.id, this.broadcast);
	});
	socket.on('disconnect', function() {
		removePlayer(this.id, this.broadcast);		
	});
	socket.on('move_player', function(data) {
		var player = getPlayer(this.id);
		if (!player) {
			return;
		}
		
		player.setX(data.x);
		player.setY(data.y);
		player.setDirection(data.direction);
		this.broadcast.emit('move_player', { id : player.getId(), x : player.getX(), y : player.getY(), direction : player.getDirection() });
	});
	socket.on('message', function(data) {
		var player = getPlayer(this.id);
		if(!player) {
			return;
		}
		
		this.broadcast.emit('message', { id : player.getId(), message : data.message });
	});
	socket.on('new_shop', function(data) {
		
	});
});

function getPlayer(id) {
  var i;
  for (i = 0; i < players.length; i++) {
    if (players[i].getId() === id) {
      return players[i]
    }
  }
  
  return false
}