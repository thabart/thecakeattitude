class Splash extends window.Phaser.State {
  init() {
		this.loadingBar = this.game.make.text(0, 0, 'Loading...', {fill: 'white'});
  }
  create() {
		this.game.add.existing(this.loadingBar);
  }
}

export default Splash;
