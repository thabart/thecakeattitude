var ShopStoreCl = function() {
	var _activeFurniture = null;
	var _furnitures = [];
	var _selectedFurniture = null;

	this.getActiveFurniture = function() {
		return _activeFurniture;
	};

	this.setActiveFurniture = function(f) {
		_activeFurniture = f;
		$(this).trigger('activeFurnitureChanged');
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
	};

	this.removeFurniture = function(f) {
		var index = _furnitures.indexOf(f);
		if (index === -1) { return; }
		game.furnitureContainer.removeChild(f.sprite);
		_furnitures.splice(index, 1);
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