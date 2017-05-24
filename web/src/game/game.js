import React, {Component} from "react";
import Splash from "./states/splash";
import Nothing from './states/nothing';

class Game extends Component {
    constructor(props) {
        super(props);
        this._game = null;
    }

    preload() {

    }

    create() {
        this._game.state.add('Splash', Splash, false);
        this._game.state.add('Nothing', Nothing, false);
    }

    render() {
        return (<div ref="game"></div>);
    }

    reset() {
      this._game.state.start('Nothing', true, true);
    }

    loadMap(category) {
        this._game.state.start('Splash', true, true, category, this);
    }

    componentDidMount() {
        var game = this.refs.game;
        var self = this;
        this._game = new window.Phaser.Game(500, 400, window.Phaser.CANVAS, game, {
            preload: function () {
            }, create: function () {
                self.create();
            }
        });
    }
}

export default Game;
