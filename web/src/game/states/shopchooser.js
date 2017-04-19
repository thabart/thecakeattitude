class ShopChooser extends window.Phaser.State {
  init(category) {
    this.category = category;
  }
  create() {
    var self = this,
      overview = self.category.overview_name;
    var bg = self.game.add.sprite(0, 0, overview);
    bg.width = self.game.world.width;
    bg.height = self.game.world.height;
  }
}

export default ShopChooser;
