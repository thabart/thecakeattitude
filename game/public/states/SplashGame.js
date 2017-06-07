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
		this.mapKey = 'main_map';
		this.overviewKey = 'overview_main_map';
		if (this.options.isMainMap) {
			this.game.load.tilemap(this.mapKey, Constants.apiUrl + '/maps/map.json', null, Phaser.Tilemap.TILED_JSON);
			this.game.load.image(this.overviewKey, Constants.apiUrl + '/maps/map_overview.png');
		}

		this.game.add.existing(this.loadingBar);
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
