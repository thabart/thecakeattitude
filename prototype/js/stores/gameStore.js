var GameStoreCl = function() {
	var _activeEntity = null;
	var _entities = [];
	var _selectedEntity = null;
	var _collisionLayer = null;
	var _shopInformation = null;

	var updateCollisions = function() {
		var refLayer = me.game.world.getChildByName(Constants.Layers.Ground.Name)[0];
		for (var col = 0; col < refLayer.cols; col++) {
			for(var row = 0; row < refLayer.rows; row++) {
				var tile = refLayer.layerData[col][row];
				if (tile === null) {
					_collisionLayer.setWalkableAt(row, col, false);
				} else {
					_collisionLayer.setWalkableAt(row, col, true);
				}
			}
		}

		_entities.forEach(function(spr) { // Update the collision layer.
				if (!spr.isCollidable) { return; }
				var sprCoordinates = spr.getCoordinates();
				var collisionCoordinate = {
					col: sprCoordinates.col,
					row: sprCoordinates.row
				};

				for (var col = collisionCoordinate.col; sprCoordinates.nbCols > 0 ? (col < collisionCoordinate.col + sprCoordinates.nbCols) : (col > collisionCoordinate.col + sprCoordinates.nbCols); sprCoordinates.nbCols > 0 ? col++ : col--) {
					for (var row = collisionCoordinate.row; sprCoordinates.nbRows > 0 ? (row < collisionCoordinate.row + sprCoordinates.nbRows) : (row > collisionCoordinate.row + sprCoordinates.nbRows); sprCoordinates.nbRows > 0 ? row++ : row--) {
						_collisionLayer.setWalkableAt(row, col, false);
					}
				}
		});
	};

	this.updateColls = function() {
		updateCollisions();
	};

	this.empty = function() {
		_activeEntity = null;
		_entities = [];
		_selectedEntity = null;
		_collisionLayer = null;
		_shopInformation = null;
	};

	this.getShopInformation = function() { // Get the shop information.
		return _shopInformation;
	};

	this.setShopInformation = function(shopInformation) { // Set the shop information.
		_shopInformation = shopInformation;
		$(this).trigger('shopInformationChanged');
	};

	this.getActiveEntity = function() { // Get the active entity (with opacity 0.5)
		return _activeEntity;
	};

	this.setActiveEntity = function(name, selector, type, isFlipped) { // Set the active entity (with opacity 0.5)
		if (!name || name === null) {
			_activeEntity = null;
		} else {
			_activeEntity = {
				name: name,
				selector: selector,
				type: type,
				isFlipped: isFlipped
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

	this.addEntity = function(f, update = false) { // Add an entity and update the collisions.
		_entities.push(f);
		if (update) {
			updateCollisions();
			var gameEntities = _shopInformation['game_entities'];
			if (!gameEntities) {
				gameEntities = [];
			}

			var coordinates = f.getCoordinates();
			gameEntities.push({
				id: f.metadata.id,
				name: f.metadata.name,
				col: coordinates.col,
				row: coordinates.row,
				type: f.getType()
			});
			_shopInformation['game_entities'] = gameEntities;
			game.Services.ShopsService.update(_shopInformation.id, _shopInformation).then(function() { }).catch(function() { });
		}
	};

	this.getEntities = function() { // Get all the entities.
		return _entities;
	};

	this.removeEntity = function(f, update = false) { // Remove an entity and update the collisions.
		var index = _entities.indexOf(f);
		if (index === -1) { return; }
		me.game.world.removeChild(f);
		_entities.splice(index, 1);
		if (update) {
			updateCollisions();
			var gameEntities = _shopInformation['game_entities'];
			var removedEntity = gameEntities.filter(function(g) { return g.id === f.metadata.id })[0];
			var indexRemoved = gameEntities.indexOf(removedEntity);
			gameEntities.splice(indexRemoved, 1);
			game.Services.ShopsService.update(_shopInformation.id, _shopInformation).then(function() { }).catch(function() { });
		}

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
	this.listenShopInformationChanged = function(callback) {
		$(this).on('shopInformationChanged', callback);
	};

	this.unsubscribeShopInformationChanged = function(callback) {
		$(this).off('shopInformationChanged', callback);
	};

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

game.Stores.GameStore = new GameStoreCl();
