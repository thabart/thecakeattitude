var ShopStoreCl = function() {
	var _selectedFurniture = null;
	var _furnitures = [];

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

	this.listenSelectedFurnitureChanged = function(callback) {
		$(this).on('selectedFurnitureChanged', callback);
	};
};

var ShopStore = new ShopStoreCl();