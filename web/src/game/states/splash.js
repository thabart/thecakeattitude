import CategoryService from '../../services/Category';
import Constants from '../../../Constants';
import ShopChooser from './shopchooser';

class Splash extends window.Phaser.State {
  init() {
		this.loadingBar = this.game.make.text(0, 0, 'Loading...', {fill: 'white'});
  }
  preload() {
    var self = this;
    CategoryService.getAll().then(function(result) {
			var embedded = result['_embedded'];
			if (!embedded) {
        // CATCH THE ERROR.
				return;
			}
			if (embedded instanceof Array) {
				embedded = [ embedded ];
			}

			embedded.forEach(function(category) {
				if (!category.overview_link || !category.map_link) {
					return;
				}

				var imageLoader = self.game.load.image(category.overview_name, Constants.apiUrl + category.overview_link);
				imageLoader.start();
			});
    }).catch(function() {
      // CATCH THE ERROR.
    });
		this.game.load.image('house', Constants.apiUrl + '/maps/tilesets/house.png');
		this.game.load.image('freePlace', Constants.apiUrl + '/maps/tilesets/freePlace.png');
  	this.game.add.existing(this.loadingBar);
  }
  create() {
    var self = this;
    this.game.state.add('ShopChooser', ShopChooser, false);
    setTimeout(function() {
      self.game.state.start('ShopChooser');
    }, 1000);
  }
}

export default Splash;
