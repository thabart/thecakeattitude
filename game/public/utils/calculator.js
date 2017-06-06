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
};
