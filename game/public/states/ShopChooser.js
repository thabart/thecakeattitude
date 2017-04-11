var ShopChooser = function () {  };
ShopChooser.prototype = {
	init: function() {
	},
	create: function() {
		var self = this;		
		// Change background color.				
		this.game.stage.backgroundColor = '#787878';	
		var bg = this.game.add.sprite(0, 0, 'overview_firstMap');
		bg.width = this.game.world.width;
		bg.height = this.game.world.height;
	},
	update: function() {
	},
	render: function() {		
	}
};