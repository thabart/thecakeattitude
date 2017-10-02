var ShopStoreCl = function() {
	var _selectedFurniture = null;

	this.getSelectedFurniture = function() {
		return _selectedFurniture;
	};

	this.setSelectedFurniture = function(f) {
		_selectedFurniture = f;
		$(this).trigger('selectedFurnitureChanged');
	};

	this.listenSelectedFurnitureChanged = function(callback) {
		$(this).on('selectedFurnitureChanged', callback);
	};
};

var ShopStore = new ShopStoreCl();