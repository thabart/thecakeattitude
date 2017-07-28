import React, {Component} from "react";
import Splash from "./shelfChooserStates/splash";

class ShelfChooser extends Component {
  constructor(props) {
    super(props);
    this._game = null;
  }

  create() { // Add states to the game.
      this._game.state.add('Splash', Splash, false);
      this.display();
  }

  render() { // Display the shelf chooser.
      return (<div ref="game"></div>);
  }

  display() { // Display the shelf chooser.
      this._game.state.start('Splash', true, true);
  }

  componentDidMount() { // Construct and display the canvas.
      var game = this.refs.game;
      var self = this;
      this._game = new window.Phaser.Game(500, 400, window.Phaser.CANVAS, game, {
          preload: function () { }, create: function () {
              self.create();
          }
      });
  }
}

export default ShelfChooser;
