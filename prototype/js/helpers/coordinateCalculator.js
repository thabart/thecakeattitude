var CoordinateCalculator = {
  getRelativePlayerPosition: function(tile) { // Get the player position relative to the ground layer.
    return {
      row: tile.row - Constants.Layers.Ground.Position.Row,
      col: tile.col - Constants.Layers.Ground.Position.Col
    };
  }
};
