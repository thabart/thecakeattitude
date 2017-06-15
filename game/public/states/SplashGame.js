var SplashGame = function () {};
SplashGame.prototype = {
	init: function(options) {
		this.loadingBar = this.game.make.text(this.game.world.centerX, 380, 'Loading Map ...', {fill: 'white'});
		this.options = options;
	},
	preload: function() {
		var self = this;
		self.mapKey = 'main_map';
		self.overviewKey = 'overview_main_map';
		self.typeMap = self.options.typeMap || 'main';
		var txtGroup = self.game.add.group();
		var bgGroup = self.game.add.group();
		bgGroup.add(self.game.add.tileSprite(0, 0, 980, 600, 'bg3'));
		txtGroup.add(self.loadingBar);
		self.game.world.bringToTop(txtGroup);
		if (self.options.isMainMap) {
			self.game.load.tilemap(self.mapKey, Constants.apiUrl + '/maps/main.json', null, Phaser.Tilemap.TILED_JSON);
			self.game.load.image(self.overviewKey, Constants.apiUrl + '/maps/main_overview.png');
		} else {
			self.game.load.tilemap(self.mapKey, self.options.map_link, null, Phaser.Tilemap.TILED_JSON);
			self.game.load.image(self.overviewKey, self.options.overview_link);
		}
	},
	create: function() {
		var self = this;
		 setTimeout(function () {
			var options = {
				pseudo: 'test',
				mapKey : self.mapKey,
				overviewKey: self.overviewKey,
				typeMap: self.typeMap
			};
			if (self.options.categoryId) {
				options.categoryId = self.options.categoryId;
			}

			if (self.options.playerPosition) {
				options.playerPosition = self.options.playerPosition;
			}

			self.game.state.start("Game", true, false, options);
		}, 1000);
	}
};
