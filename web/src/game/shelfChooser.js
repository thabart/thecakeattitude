import React, {Component} from "react";
import Splash from "./shelfChooserStates/splash";

class ShelfChooser extends Component {
  constructor(props) {
    super(props);
    this._game = null;
  }

  render() { // Display the shelf chooser.
      return (<div ref="game"></div>);
  }

  display(opts) { // Display the shelf chooser.
      var game = this.refs.game;
      var self = this;
      this._game = new window.Phaser.Game(500, 400, window.Phaser.CANVAS, game, {
          preload: function () { }, create: function () {
              self._game.state.add('Splash', Splash, false);
              self._game.state.start('Splash', true, true, opts);
          }
      });
  }

  setCurrentShelf(shelfId) { // Set the current shelf.
    var self = this;
    self._game.state.states.Chooser.setCurrentShelf(shelfId);
  }
}

export default ShelfChooser;
