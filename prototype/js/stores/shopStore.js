var ShopStoreCl = function() {
	var _activeFurniture = null;
	var _activePoster = null;
	var _activeFloor = null;
	var _furnitures = [];
	var _posters = [];
	var _floors = [];
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

	this.getActiveFurniture = function() { // Get the active furniture (with opacity 0.5)
		return _activeFurniture;
	};

	this.setActiveFurniture = function(name, isFlipped) { // Set the active furniture (with opacity 0.5)
		if (!name || name === null) {
			_activeFurniture = null;
		} else {
			_activeFurniture = {
				name: name,
				isFlipped: isFlipped
			};
		}

		$(this).trigger('activeFurnitureChanged');
	};

	this.getActivePoster = function() { // Get the active poster (with opacity 0.5)
		return _activePoster;
	};

	this.setActivePoster = function(name, isFlipped) { // Set the active furniture (with opacity 0.5)
		if (!name || name === null) {
			_activePoster = null;
		} else {
			_activePoster = {
				name: name,
				isFlipped: isFlipped
			};
		}

		$(this).trigger('activePosterChanged');
	};

	this.getActiveFloor = function() { // Get the active floor (with opacity 0.5)
		return _activeFloor;
	}

	this.setActiveFloor = function(name) { // Set the active floor (with opacity 0.5)
		if (!name || name === null) {
			_activeFloor = null;
		} else {			
			_activeFloor = {
				name: name
			};
		}

		$(this).trigger('activeFloorChanged');
	}

	this.addFloor = function(f) { // Add a floor into the collection.
		_floors.push(f);
	}

	this.getSelectedFurniture = function() { // Get selected furniture (with opacity 1.0)
		return _selectedFurniture;
	};

	this.setSelectedFurniture = function(f) { // Set selected furniture (with opacity 1.0)
		_selectedFurniture = f;
		$(this).trigger('selectedFurnitureChanged');
	};

	this.addFurniture = function(f) { // Add a furniture and update the collisions.
		_furnitures.push(f);
		updateCollisions();
	};

	this.addPoster = function(f) { // Add a poster.
		_posters.push(f);
	};

	this.getFurnitures = function() { // Get all the posters.
		return _furnitures;
	};

	this.removeFurniture = function(f) { // Remove a furniture and update the collisions.
		var index = _furnitures.indexOf(f);
		if (index === -1) { return; }
		me.game.world.removeChild(f);
		_furnitures.splice(index, 1);
		updateCollisions();
		me.game.repaint();
	};

	this.getPosters = function() { // Get all the posters.
		return _posters;
	};

	this.getCollisionLayer = function() { // Get collision layer.
		return _collisionLayer;
	};

	this.setCollisionLayer = function(c) { // Set collision layer.
		_collisionLayer = c;
	};

	this.displayPlayerPseudo = function() { // Display the player pseudo.
		$(this).trigger('displayPlayerPseudoArrived');
	};

	this.hidePlayerPseudo = function() { // Hide the player pseudo.
		$(this).trigger('hidePlayerPseudoArrived');
	};

	this.displayInformation = function(metadata) { // Update the content of the information box.
		$(this).trigger('displayInformationArrived', [ metadata ]);
	};

	this.hideInformation = function() { // Hide information.
		$(this).trigger('hideInformationArrived');
	};

	this.displayActions = function() { // Display the furniture actions.
		$(this).trigger('displayActionsArrived');
	};

	this.hideActions = function() { // Hide the furniture actions.
		$(this).trigger('hideActionsArrived');
	};

	this.displayMessage = function(message) { // Display the player message.
		$(this).trigger('messageArrived', [ message ]);
	};

	/* LISTEN THE EVENTS */
	this.listenActiveFurnitureChanged = function(callback) {
		$(this).on('activeFurnitureChanged', callback);
	};

	this.listenActivePosterChanged = function(callback) {
		$(this).on('activePosterChanged', callback);
	};

	this.listenActiveFloorChanged = function(callback) {
		$(this).on('activeFloorChanged', callback);
	}

	this.listenDisplayInformationArrived = function(callback) {
		$(this).on('displayInformationArrived', callback);
	};

	this.listenHideInformationArrived = function(callback) {
		$(this).on('hideInformationArrived', callback);
	};

	this.listenDisplayActionsArrived = function(callback) {
		$(this).on('displayActionsArrived', callback);
	};

	this.hideDisplayActionsArrived = function(callback) {
		$(this).on('hideActionsArrived', callback);
	};

	this.listenMessageArrived = function(callback) {
		$(this).on('messageArrived', callback);
	};

	this.listenDisplayPlayerPseudoArrived = function(callback) {
		$(this).on('displayPlayerPseudoArrived', callback);
	};

	this.listenHidePlayerPseudoArrived = function(callback) {
		$(this).on('hidePlayerPseudoArrived', callback);
	};

	this.listenSelectedFurnitureChanged = function(callback) {
		$(this).on('selectedFurnitureChanged', callback);
	};
};

var ShopStore = new ShopStoreCl();
