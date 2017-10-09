var ShopStoreCl = function() {
	var _activeFurniture = null;
	var _furnitures = [];
	var _selectedFurniture = null;
	var _collisionLayer = null;

	var updateCollisions = function() {
		for(var x = 0; x < _collisionLayer.width; x++) { // Reset the collision layer.
			for(var y = 0; y < _collisionLayer.height; y++) {
				_collisionLayer.setWalkableAt(x, y, true);
			}
		}

		_furnitures.forEach(function(spr) { // Update the collision layer.
				var sprCoordinates = spr.getCoordinates();
				var collisionCoordinate = {
					col: sprCoordinates.col - Constants.Layers.Ground.Position.Col,
					row: sprCoordinates.row - Constants.Layers.Ground.Position.Row
				};
				for (var col = collisionCoordinate.col; col > collisionCoordinate.col - sprCoordinates.nbCols; col--) {
					for (var row = collisionCoordinate.row; row > collisionCoordinate.row - sprCoordinates.nbRows; row--) {
						_collisionLayer.setWalkableAt(row, col, false);
					}
				}
		});
	};

	this.getActiveFurniture = function() {
		return _activeFurniture;
	};

	this.setActiveFurniture = function(f) {
		_activeFurniture = f;
		$(this).trigger('activeFurnitureChanged');
	};

	this.getCollisionLayer = function() {
		return _collisionLayer;
	};

	this.setCollisionLayer = function(c) {
		_collisionLayer = c;
	};

	this.getSelectedFurniture = function() {
		return _selectedFurniture;
	};

	this.setSelectedFurniture = function(f) {
		_selectedFurniture = f;
		$(this).trigger('selectedFurnitureChanged');
	};

	this.getFurnitures = function() {
		return _furnitures;
	};

	this.addFurniture = function(f) {
		_furnitures.push(f);
		updateCollisions();
	};

	this.removeFurniture = function(f) {
		var index = _furnitures.indexOf(f);
		if (index === -1) { return; }
		me.game.world.removeChild(f);
		_furnitures.splice(index, 1);
		updateCollisions();
		me.game.repaint();
	};

	this.listenActiveFurnitureChanged = function(callback) {
		$(this).on('activeFurnitureChanged', callback);
	};

	this.listenSelectedFurnitureChanged = function(callback) {
		$(this).on('selectedFurnitureChanged', callback);
	};
};

var ShopStore = new ShopStoreCl();
