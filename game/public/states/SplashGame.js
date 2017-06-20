var SplashGame = function () {};
SplashGame.prototype = {
	init: function(options) {
		var self = this;
		var messageCoordinage = Calculator.getLoadingMessageCoordinage(self.game);
		self.loadingBar = self.game.make.text(messageCoordinage.x, 380, $.i18n('loadingMap'), {fill: 'white'});
		self.options = options;
		GameStateStore.onSizeChanged.call(self, function(size) {
			var coordinate = Calculator.getBgCoordinate(size, self.game, 'bg3');
			if (self.bg && self.bg !== null) self.bg.x = coordinate.x;
		});
	},
	preload: function() {
		var self = this;
		self.mapKey = 'main_map';
		self.overviewKey = 'overview_main_map';
		self.typeMap = self.options.typeMap || 'main';
		var txtGroup = self.game.add.group();
		var bgGroup = self.game.add.group();
		var coordinate = Calculator.getBgCoordinate(GameStateStore.getSize(), self.game, 'bg3');
		self.bg = self.game.add.tileSprite(coordinate.x, 0, coordinate.w, self.game.world.height, 'bg3');
		bgGroup.add(self.bg);
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
				mapKey : self.mapKey,
				overviewKey: self.overviewKey,
				typeMap: self.typeMap
			};
			if (self.options.categoryId) {
				options.categoryId = self.options.categoryId;
			}

			if (self.options.mapName) {
				options.mapName = self.options.mapName;
			}

			if (self.options.playerPosition) {
				options.playerPosition = self.options.playerPosition;
			}

			self.game.state.start("Game", true, false, options);
		}, 1000);
	},
	shutdown: function() {
		GameStateStore.offSizeChanged.call(this);
	}
};
