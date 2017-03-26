'use strict';
var Player = function(startX, startY, startDirection) {
	var x = startX;
	var y = startY;
	var direction = startDirection;
	var getX = function() {
		return x;
	};
	
	var getY = function() {
		return y;
	};
	
	var getDirection = function() {
		return direction;
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
	
	return {
		getX : getX,
		getY : getY,
		setX : setX,
		setY : setY,
		getDirection : getDirection,
		setDirection: setDirection
	};
};

module.exports = Player;