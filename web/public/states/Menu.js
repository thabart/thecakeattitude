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
		
		var players = [
			{ pseudo: 'mili', map: '' },
			{ pseudo: 'lili', map: '' },
			{ pseudo : 'loki', map: '' },
			{ pseudo : 'mulan', map: '' }
		];
		
		var freePlace = function(spr, g) {
			this.sprite = spr;
			this.graphic = g;
			
			this.destroy = function() {
				this.sprite.destroy();
				this.graphic.events.onInputDown.removeAll();
			};
		};
		
		var createModal = function() {
			var result = $("<div class='modal fade'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'>"+
			"<h5 class='modal-title'>New character</h5>"+
			"<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
			"</div>"+
			"<div class='modal-body'>"+
			"<div class='form-group'><label>Pseudo</label><input type='text' class='form-control' /></div>"+
			"<div class='form-group'><label>Category</label><select class='form-control'><option>Pâtisserie/Boulangerie</option><option>Habits/Boulangerie</option></select></div>"+
			"<div class='form-group'><label>Sub-Category</label><select class='form-control'><option>Chaussures</option> </select></div>"+
			"</div>"+
			"<div class='modal-footer'>"+
			"<button type='button' class='btn btn-success' id='confirm'>Confirm</button>"+
			"<button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancel</button>"+
			"</div></div></div></div>");
			$(document.body).append(result);
			return result;
		};
		
		var addPlayer = function(graph) {
			self.game.add.sprite(graph.x + (graph.width / 2) - playerWidth / 2, graph.y + (graph.height / 2) - playerHeight / 2, 'player');
			graph.events.onInputDown.add(function(g) {
				var isSelected = false;
				if (!g.isSelected) {
					isSelected = true;
				}
				
				drawGraphic(g, true);
				rectPlayers.forEach(function(gr) {
					if (gr == g) {
						return;
					}
					
					drawGraphic(gr, false);						
				});
				
				self.start.visible = true;			
			}, this);		
			rectPlayers.push(graph);			
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
			nbPlayers = players.length,
			self = this,
			rectPlayers = [],
			rectFreePlaces = [],
			modal = createModal();
			
		$(modal).find('#confirm').click(function() {
			if (!rectFreePlaces || rectFreePlaces.length == 0) {
				console.log('not enough space');
				return;
			}
			
			var p = rectFreePlaces[0];
			var ind = rectFreePlaces.indexOf(p);
			p.destroy();
			rectFreePlaces.splice(0, 1);
			addPlayer(p.graphic);
			$(modal).modal('hide');
		});
		
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
				addPlayer(graphic);
			} else {
				var spr = this.game.add.sprite(rectX + (rectWidth / 2) - addPlayerWidth / 2, rectY + (rectHeight / 2) - addPlayerHeight / 2, 'addPlayer');
				graphic.events.onInputDown.add(function() {
					$(modal).modal('toggle');
				});
				rectFreePlaces.push(new freePlace(spr, graphic));
			}
		}
		
		this.start = this.game.add.button(this.game.width - playPaddingRight - playWidth, this.game.height - playHeight - playPaddingBottom, 'start', null, this, 2, 1, 0);
		this.start.visible = false;
	},
	create: function() {
		
	}
};