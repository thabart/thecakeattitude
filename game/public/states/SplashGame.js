var SplashGame = function () {};
SplashGame.prototype = {
	init: function(options) {
		this.loadingBar = this.game.make.text(this.game.world.centerX, 380, 'Loading Map ...', {fill: 'white'});
		this.options = options;
	},
	preload: function() {
		var self = this;
		// LOAD ALL THE ASSETS.
		/*
		$.get(Constants.apiUrl + '/categories').then(function(result) {
			var embedded = result['_embedded'];
			if (!embedded) {
				return;
			}
			if (!$.isArray(embedded)) {
				embedded = [ embedded ];
			}

			embedded.forEach(function(category) {
				if (!category.overview_link || !category.map_link) {
					return;
				}

				var tileMapLoader = self.game.load.tilemap(category.map_name, Constants.apiUrl + category.map_link, null, Phaser.Tilemap.TILED_JSON);
				var imageLoader = self.game.load.image(category.overview_name, Constants.apiUrl + category.overview_link);
				tileMapLoader.start();
				imageLoader.start();
			});
		});
		*/
		// this.game.load.crossOrigin = "anonymous";
		var self = this;
		self.mapKey = 'main_map';
		self.overviewKey = 'overview_main_map';
		var txtGroup = self.game.add.group();
		var bgGroup = self.game.add.group();
		var bg3Loader = self.game.load.image('bg3', 'styles/backgrounds/bg3.jpg');
		bg3Loader.onFileComplete.add(function() {
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
		}, this);
	},
	create: function() {
		var self = this;
		 setTimeout(function () {
			var options = {
				pseudo: 'test',
				mapKey : self.mapKey,
				overviewKey: self.overviewKey
			};
			self.game.state.start("Game", true, false, options);
		}, 1000);
	}
};
