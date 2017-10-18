var ShopStoreCl = function() {
	var _activeEntity = null;
	var _entities = [];
	var _selectedEntity = null;
	var _collisionLayer = null;

	var updateCollisions = function() {
		for(var x = 0; x < _collisionLayer.width; x++) { // Reset the collision layer.
			for(var y = 0; y < _collisionLayer.height; y++) {
				_collisionLayer.setWalkableAt(x, y, true);
			}
		}

		_entities.forEach(function(spr) { // Update the collision layer.
				if (!spr.isCollidable) { return; }
				var sprCoordinates = spr.getCoordinates();
				var collisionCoordinate = {
					col: sprCoordinates.col - Constants.Layers.Ground.Position.Col,
					row: sprCoordinates.row - Constants.Layers.Ground.Position.Row
				};
				if (spr.flipped) { // Vertical.
					for (var col = collisionCoordinate.col; col < collisionCoordinate.col + sprCoordinates.nbCols; col++) {
						for (var row = collisionCoordinate.row; row > collisionCoordinate.row - sprCoordinates.nbRows; row--) {
							_collisionLayer.setWalkableAt(row, col, false);
						}
					}
				} else { // Horizontal.
					for (var col = collisionCoordinate.col; col > collisionCoordinate.col - sprCoordinates.nbCols; col--) {
						for (var row = collisionCoordinate.row; row > collisionCoordinate.row - sprCoordinates.nbRows; row--) {
							_collisionLayer.setWalkableAt(row, col, false);
						}
					}
				}
		});
	};

	this.updateColls = function() {
		updateCollisions();
	};

	this.getActiveEntity = function() { // Get the active entity (with opacity 0.5)
		return _activeEntity;
	};

	this.setActiveEntity = function(name, selector, isFlipped) { // Set the active entity (with opacity 0.5)
		if (!name || name === null) {
			_activeEntity = null;
		} else {
			_activeEntity = {
				name: name,
				isFlipped: isFlipped,
				selector: selector
			};
		}

		$(this).trigger('activeEntityChanged');
	};

	this.getSelectedEntity = function() { // Get selected entity (with opacity 1.0)
		return _selectedEntity;
	};

	this.setSelectedEntity = function(f) { // Set selected entity (with opacity 1.0)
		_selectedEntity = f;
		$(this).trigger('selectedEntityChanged');
	};

	this.addEntity = function(f) { // Add an entity and update the collisions.
		_entities.push(f);
		updateCollisions();
	};

	this.getEntities = function() { // Get all the entities.
		return _entities;
	};

	this.removeEntity = function(f) { // Remove an entity and update the collisions.
		var index = _entities.indexOf(f);
		if (index === -1) { return; }
		me.game.world.removeChild(f);
		_entities.splice(index, 1);
		updateCollisions();
		me.game.repaint();
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

	this.displayActions = function() { // Display the entity actions.
		$(this).trigger('displayActionsArrived');
	};

	this.hideActions = function() { // Hide the entity actions.
		$(this).trigger('hideActionsArrived');
	};

	this.displayMessage = function(message) { // Display the player message.
		$(this).trigger('messageArrived', [ message ]);
	};

	/* LISTEN THE EVENTS */
	this.listenActiveEntityChanged = function(callback) {
		$(this).on('activeEntityChanged', callback);
	};

	this.listenSelectedEntityChanged = function(callback) {
		$(this).on('selectedEntityChanged', callback);
	};

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
};

var ShopStore = new ShopStoreCl();
