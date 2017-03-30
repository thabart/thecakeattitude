'use strict';
var Player = function(startX, startY, startDirection, mapId) {
	var id = null;
	var x = startX;
	var y = startY;
	var mapId = mapId;
	var direction = startDirection;
	var getId = function() {
		return id;
	};
	
	var getX = function() {
		return x;
	};
	
	var getY = function() {
		return y;
	};
	
	var getDirection = function() {
		return direction;
	};
	
	var getMapId = function() {
		return mapId;
	};
	
	var setId = function(newId) {
		id = newId;
	};
	
	var setX = function(newX) {
		x = newX;
	};
	
	var setY = function(newY) {
		y = newY;
	};
	
	var setDirection = function(newDirection) {
		direction = newDirection;
	};
	
	var setMapId = function(newMapId) {
		mapId = newMapId;
	};
	
	return {
		getId: getId,
		getX : getX,
		getY : getY,
		getDirection : getDirection,
		getMapId : getMapId,
		setId: setId,
		setX : setX,
		setY : setY,
		setDirection: setDirection,
		setMapId : setMapId
	};
};

module.exports = Player;