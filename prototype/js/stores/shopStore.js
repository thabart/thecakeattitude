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
				console.log(sprCoordinates);
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

	this.setActiveFurniture = function(f) { // Set the active furniture (with opacity 0.5)
		_activeFurniture = f;
		$(this).trigger('activeFurnitureChanged');
	};

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

	this.removeFurniture = function(f) { // Remove a furniture and update the collisions.
		var index = _furnitures.indexOf(f);
		if (index === -1) { return; }
		me.game.world.removeChild(f);
		_furnitures.splice(index, 1);
		updateCollisions();
		me.game.repaint();
	};

	this.getFurnitures = function() { // Get all the furnitures.
		return _furnitures;
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
