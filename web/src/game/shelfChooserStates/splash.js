import Constants from "../../../Constants";
import Chooser from "./chooser";

class Splash extends window.Phaser.State {
    init(category, component) {
      this.category = category;
      this.component = component;
      this.loadingBar = this.game.make.text(0, 0, 'Loading...', {fill: 'white'});
    }

    preload() {
      var self = this;
      self.game.load.image('overview', Constants.apiUrl + '/shops/shop_overview.png');
      self.game.load.tilemap('tileMap', Constants.apiUrl + '/shops/shop_template.json', null, window.Phaser.Tilemap.TILED_JSON);
      this.game.add.existing(this.loadingBar);
    }

    create() {
      var self = this;
      this.game.state.add('Chooser', Chooser, false);
      setTimeout(function () {
          self.game.state.start('Chooser', true, false);
      }, 1000);
    }
}

export default Splash;
