'use strict';
var io = require('socket.io').listen(3005, function() {
	console.log('listening on port 3005');
});

var Player = function (col, row, map, name, figure, id) {
  this.col = col;
  this.row = row;
  this.map = map;
  this.name = name;
  this.figure = figure;
  this.id = id;
	this.nextcol = null;
	this.nextrow = null;
};

var players = [];

io.on('connection', function(socket) {
  console.log('a user is connected');
	var removePlayer = function(id, bc) {
		var removePlayer = getPlayer(id);
		if (!removePlayer) {
			return
		}

		var id = removePlayer.id;
		players.splice(players.indexOf(removePlayer), 1);
		bc.emit('remove_player', { id: id });
	};

  socket.on('new_player', function(data) {
		var player = new Player(data.col, data.row, data.map, data.name, data.figure, this.id);
		this.broadcast.emit('new_player', { id: player.id, col : player.col, row : player.row, map : player.map, name: player.name, figure: player.figure });
		var i, existingPlayer
		for (i = 0; i < players.length; i++) {
			existingPlayer = players[i];
			this.emit('new_player', { id: existingPlayer.id, col : existingPlayer.col, row : existingPlayer.row, map : existingPlayer.map, name: existingPlayer.name, figure: existingPlayer.figure });
		}

		players.push(player);
  });
  socket.on('remove', function(data) {
		removePlayer(this.id, this.broadcast);
  });
  socket.on('move_player', function(data) {
		var player = getPlayer(this.id);
		if (!player) {
			return;
		}

		player.nextcol = data.nextcol;
		player.nextrow = data.nextrow;
		this.broadcast.emit('move_player', { id : player.id, col : player.col, row : player.row, nextcol: data.nextcol, nextrow: data.nextrow });
  });
	socket.on('update_player_position', function(data) {
		var player = getPlayer(this.id);
		if (!player) {
			return;
		}

		player.col = data.col;
		player.row = data.row;
	});
  socket.on('message', function(data) {
		this.broadcast.emit('message', { id : this.id, message: data.message });
  });
  socket.on('disconnect', function(data) {
		removePlayer(this.id, this.broadcast);
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
