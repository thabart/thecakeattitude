var Menu = function() { };
Menu.prototype = {
	preload: function() {
	},
	init: function() {
		var drawGraphic = function(g, isSelected) {		
			g.clear();		
			g.beginFill(0xb8bbc1, 0.5);
			if (isSelected) {
				g.lineStyle(2, 0xEC1515, 1);			
			} else {
				g.lineStyle(2, 0x92959b, 1);			
			}
			
			g.drawRoundedRect(0, 0, rectWidth, rectHeight, 5);
			g.endFill();
			g.isSelected = isSelected;
		};
		
		var rectHeight = 150,
			rectWidth = 150,
			paddingLeft = 10,
			playerWidth = 27,
			addPlayerWidth = 48,
			addPlayerHeight = 48,
			playerHeight = 40, 
			playWidth = 341,
			playHeight = 111,
			playPaddingBottom = 0,
			playPaddingRight = 0,
			maxSquares = 6,
			nbPlayers = 3,
			self = this,
			graphics = [];
		// Create several players.
		for (var ind = 0; ind < maxSquares; ind++) {
			var rectX = ind * (rectWidth + paddingLeft) + paddingLeft,
				rectY = this.game.height / 2 - rectHeight / 2;
			var graphic = this.game.add.graphics(rectX, rectY);
			drawGraphic(graphic, false);
			graphic.inputEnabled = true;
			graphic.events.onInputOver.add(function() {
				self.game.canvas.style.cursor = "pointer";
			});
			graphic.events.onInputOut.add(function() {
				self.game.canvas.style.cursor = "default";
			});
			if (ind + 1 <= nbPlayers) {
				this.game.add.sprite(rectX + (rectWidth / 2) - playerWidth / 2, rectY + (rectHeight / 2) - playerHeight / 2, 'player');
				graphic.events.onInputDown.add(function(g) {
					var isSelected = false;
					if (!g.isSelected) {
						isSelected = true;
					}
					
					drawGraphic(g, true);
					graphics.forEach(function(gr) {
						if (gr == g) {
							return;
						}
						
						drawGraphic(gr, false);						
					});
					
					self.start.visible = true;					
				}, this);
			} else {
				this.game.add.sprite(rectX + (rectWidth / 2) - addPlayerWidth / 2, rectY + (rectHeight / 2) - addPlayerHeight / 2, 'addPlayer');
			}
			
			graphics.push(graphic);
		}
		
		this.start = this.game.add.button(this.game.width - playPaddingRight - playWidth, this.game.height - playHeight - playPaddingBottom, 'start', null, this, 2, 1, 0);
		this.start.visible = false;
	},
	create: function() {
		
	}
};