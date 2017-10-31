var CoordinateCalculator = {
  getRelativePlayerPosition: function(tile) { // Get the player position relative to the ground layer.
    return {
      row: tile.row,
      col: tile.col
    };
  }
};
