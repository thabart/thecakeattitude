var GameStoreCl = function() {
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

	this.setActiveEntity = function(name, selector, interaction, isFlipped) { // Set the active entity (with opacity 0.5)
		if (!name || name === null) {
			_activeEntity = null;
		} else {
			_activeEntity = {
				name: name,
				isFlipped: isFlipped,
				selector: selector,
				interaction: interaction
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

	this.displayShelfBox = function() { // Display the shelf box.
		$(this).trigger('displayShelfBoxArrived');
	};

	this.hideShelfBox = function() { // Hide the shelf box.
		$(this).trigger('hideShelfBoxArrived');
	};

	this.displayInformation = function(metadata) { // Update the content of the information box.
		$(this).trigger('displayInformationArrived', [ metadata ]);
	};

	this.hideInformation = function() { // Hide information.
		$(this).trigger('hideInformationArrived');
	};

	this.displayActions = function(metadata) { // Display the entity actions.
		$(this).trigger('displayActionsArrived', [ metadata ]);
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

	this.unsubscribeActiveEntityChanged   = function(callback) {
		$(this).off('activeEntityChanged', callback);
	};

	this.listenSelectedEntityChanged = function(callback) {
		$(this).on('selectedEntityChanged', callback);
	};

	this.unsubscribeSelectedEntityChanged  = function(callback) {
		$(this).off('selectedEntityChanged', callback);
	};

	this.listenDisplayInformationArrived = function(callback) {
		$(this).on('displayInformationArrived', callback);
	};

	this.unsubscribeDisplayInformationArrived  = function(callback) {
		$(this).off('displayInformationArrived', callback);
	};

	this.listenHideInformationArrived = function(callback) {
		$(this).on('hideInformationArrived', callback);
	};

	this.unsubscribeHideInformationArrived  = function(callback) {
		$(this).off('hideInformationArrived', callback);
	};

	this.listenDisplayActionsArrived = function(callback) {
		$(this).on('displayActionsArrived', callback);
	};

	this.unsubscribeDisplayActionsArrived  = function(callback) {
		$(this).off('displayActionsArrived', callback);
	};

	this.hideDisplayActionsArrived = function(callback) {
		$(this).on('hideActionsArrived', callback);
	};

	this.unsubscribeHideDisplayActionsArrived = function(callback) {
		$(this).off('hideActionsArrived', callback);
	};

	this.listenMessageArrived = function(callback) {
		$(this).on('messageArrived', callback);
	};

	this.unsubscribeMessageArrived = function(callback) {
		$(this).off('messageArrived', callback);
	};

	this.listenDisplayPlayerPseudoArrived = function(callback) {
		$(this).on('displayPlayerPseudoArrived', callback);
	};

	this.unsubscribeDisplayPlayerPseudoArrived = function(callback) {
		$(this).off('displayPlayerPseudoArrived', callback);
	};

	this.listenHidePlayerPseudoArrived = function(callback) {
		$(this).on('hidePlayerPseudoArrived', callback);
	};

	this.unsubscribeHidePlayerPseudoArrived = function(callback) {
		$(this).off('hidePlayerPseudoArrived', callback);
	};

	this.listenDisplayShelfBoxArrived = function(callback) {
		$(this).on('displayShelfBoxArrived', callback);
	};

	this.unsubscribeDisplayShelfBoxArrived = function(callback) {
		$(this).off('displayShelfBoxArrived', callback);
	};

	this.listenHideShelfBoxArrived = function(callback) {
		$(this).on('listenHideShelfBoxArrived	', callback);
	};

	this.unsubscribeHideShelfBoxArrived = function(callback) {
		$(this).off('hideShelfBoxArrived', callback);
	};
};

var ShopStore = new GameStoreCl();
game.Stores.GameStore = new GameStoreCl();