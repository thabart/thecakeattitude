var Calculator = {
  // Get the overview image coordinate (x,y) from the game.
  getOverviewImageCoordinate: function(game) {
    return {
      x: game.width - 200,
      y: 10
    }
  },
  // Get overview coordinate of a player.
  getOverviewPlayerCoordinate: function(playerPosition, tileMap, overviewMapSize, overviewMapCoordinate) {
    return {
      x: ((playerPosition.x * overviewMapSize.w) / tileMap.widthInPixels) + overviewMapCoordinate.x,
      y: ((playerPosition.y * overviewMapSize.h) / tileMap.heightInPixels) + overviewMapCoordinate.y
    };
  },
  // Get relative overview coordinate of a player.
  getOverviewPlayerRelativeCoordinate: function(playerPosition, tileMap, overviewMapSize) {
    return {
      x: ((playerPosition.x * overviewMapSize.w) / tileMap.widthInPixels),
      y: ((playerPosition.y * overviewMapSize.h) / tileMap.heightInPixels)
    };
  },
  // Get the house size.
  getHouseSize: function(house, tileMap, overviewMapSize) {
    return {
      w: (house.width * overviewMapSize.w) / tileMap.widthInPixels,
      h: (house.height * overviewMapSize.h) / tileMap.heightInPixels
    };
  },
  // Get BG coordinates.
  getBgCoordinate: function(size, game, name) {
    var width = game.cache.getImage(name).width,
      worldWidth = size.w,
      xCoordinate = 0;
    if (width < worldWidth) {
      xCoordinate = (worldWidth / 2) - (width / 2);
    }

    return {
      x: xCoordinate,
      w: width
    };
  },
  // Get the loading message coordinate.
  getLoadingMessageCoordinage: function(game) {
    return {
      x: game.world.width -600,
      y : 380
    };
  }
};
