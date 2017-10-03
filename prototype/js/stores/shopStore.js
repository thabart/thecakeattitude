var ShopStoreCl = function() {
	var _selectedFurniture = null;
	var _furnitures = [];
	var _orientation = 'row';

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

	this.getOrientation = function() {
		return _orientation;
	};

	this.setOrientation = function(o) {
		_orientation = o;
		$(this).trigger('orientationChanged');
	};

	this.listenSelectedFurnitureChanged = function(callback) {
		$(this).on('selectedFurnitureChanged', callback);
	};

	this.listenOrientationChanged = function(callback) {
		$(this).on('orientationChanged', callback);
	};
};

var ShopStore = new ShopStoreCl();