import Constants from '../../../Constants';
import ShopChooser from './shopchooser';

class Splash extends window.Phaser.State {
  init(category) {
    this.category = category;
		this.loadingBar = this.game.make.text(0, 0, 'Loading...', {fill: 'white'});
  }
  preload() {
    var self = this;
    var imageLoader = self.game.load.image(this.category.overview_name, Constants.apiUrl + this.category.overview_link);
    imageLoader.start();
		this.game.load.image('house', Constants.apiUrl + '/maps/tilesets/house.png');
		this.game.load.image('freePlace', Constants.apiUrl + '/maps/tilesets/freePlace.png');
  	this.game.add.existing(this.loadingBar);
  }
  create() {
    var self = this;
    this.game.state.add('ShopChooser', ShopChooser, false);
    setTimeout(function() {
      self.game.state.start('ShopChooser', true, false, self.category);
    }, 1000);
  }
}

export default Splash;
