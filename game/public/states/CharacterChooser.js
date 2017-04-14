var CharacterChooser = function() { };
CharacterChooser.prototype = {
	preload: function() {
	},
	init: function(user) {		
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
			{ pseudo: 'mili', map: 'firstMap' },
			{ pseudo: 'lili', map: 'secondMap' },
			{ pseudo : 'loki', map: 'secondMap' },
			{ pseudo : 'mulan', map: 'firstMap' }
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
			var result = $("<div class='modal fade'>"+
			"<div class='modal-dialog'>"+
				"<div class='modal-content'>"+
					"<div class='modal-header'>"+
						"<h5 class='modal-title'>Add shop</h5>"+
						"<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
					"</div>"+
					"<div style='display: none;' class='content'>"+
						"<div class='modal-body'>"+
							"<div class='form-group'>"+
								"<label class='control-label'>Category</label>"+
								"<select class='category form-control'>"+								
								"</select>"+
							"</div>"+
							"<div class='form-group'>"+
								"<label class='control-label'>Sub category</label>"+
								"<select class='sub-category form-control'>"+								
								"</select>"+
							"</div>"+
						"</div>"+
						"<div class='modal-footer'>"+
							"<button type='button' class='btn btn-success' id='confirm'>Confirm</button>"+
							"<button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancel</button>"+
						"</div>"+
					"</div>"+
					"<div style='text-align:center;'><i class='fa fa-spinner fa-spin' style='font-size:24px; width: 24px; height:24px;'></i></div>"+
				"</div>"+
			"</div></div>");
			$(document.body).append(result);
			return result;
		};
		
		var addPlayer = function(graph, player) {
			var sprX = graph.x + (graph.width / 2) - playerWidth / 2,
				sprY = graph.y + (graph.height / 2) - playerHeight / 2;
			self.game.add.sprite(sprX, sprY, 'player');
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
				
				selectedUser = player;				
				self.start.visible = true;			
			}, this);
			var style = { font: "20px Arial" };
			self.game.add.text(sprX - 30, sprY + pseudoPaddingTop + playerHeight, player.pseudo, style);
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
			backWidth = 108,
			backHeight = 100,
			playPaddingBottom = 0,
			playPaddingRight = 0,
			backPaddingLeft = 10,
			backPaddingBottom = 10,
			pseudoPaddingTop = 10,
			titlePaddingTop = 10,
			titlePaddingLeft = 10,
			maxSquares = 6,
			nbPlayers = players.length,
			self = this,
			rectPlayers = [],
			rectFreePlaces = [],
			modal = createModal(),
			selectedUser = null,
			displayLoadingAddShop = function(isLoading) {
				if (isLoading) {
					$(modal).find('.fa-spinner').show();
					$(modal).find('.content').hide();
					return;
				}
				
				$(modal).find('.fa-spinner').hide();
				$(modal).find('.content').show();
			},
			displayAddShop = function() {
				$(modal).modal('toggle');
				$.get(Constants.apiUrl + '/categories/parents').then(function(result) {
					displayLoadingAddShop(false);
					if (!result['_embedded']) {
						errorModal.display('categories cannot be displayed', 3000, 'error');
						return;
					}
					
					var elt = $(modal).find('.category');
					result['_embedded'].forEach(function(record) {
						var selfLink = record['_links'].self;
						$(elt).append("<option value='"+record.id+"' data-href='"+selfLink+"'>"+record.name+"</option>");					
					});
					var partialUrl = $(elt).find(':selected').data('href');
					displaySubCategories(partialUrl);
					
				}).fail(function() {				
					displayLoadingAddShop(false);
					errorModal.display('categories cannot be displayed', 3000, 'error');
				});
			}, 
			displaySubCategories = function(partialUrl) {
				var elt = $(modal).find('.sub-category');
				$(elt).empty();
				$.get(Constants.apiUrl + partialUrl).then(function(result) {
					if (!result['_links'] || !result['_links'].items) {
						errorModal.display('sub categories cannot be displayed', 3000, 'error');
						return;
					}
					
					var items = result['_links'].items;
					items.forEach(function(record) {
						var parts = record.href.split('/');
						var href = parts[parts.length - 1];
						$(elt).append("<option value='"+href+"'>"+record.name+"</option>");					
					});
				}).fail(function() {
					errorModal.display('sub categories cannot be displayed', 3000, 'error');				
				});
			};
			
		var titleStyle = { font: '32px Arial', fill: '#ffffff' };
		self.game.add.text(titlePaddingTop, titlePaddingLeft, 'Choose your shop', titleStyle);
		$(modal).find('#confirm').click(function() {
			if (!rectFreePlaces || rectFreePlaces.length == 0) {
				console.log('not enough space');
				return;
			}
			
			var p = rectFreePlaces[0];
			var ind = rectFreePlaces.indexOf(p);
			p.destroy();
			rectFreePlaces.splice(0, 1);
			var newPlayer = {
				pseudo : $(modal).find('#pseudo').val(),
				map: 'firstMap'
			};
			addPlayer(p.graphic, newPlayer);
			$(modal).modal('hide');
		});
		$(modal).find('.category').change(function() {
			var partialUrl = $(this).find(':selected').data('href');
			displaySubCategories(partialUrl);
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
				addPlayer(graphic, players[ind]);
			} else {
				var spr = this.game.add.sprite(rectX + (rectWidth / 2) - addPlayerWidth / 2, rectY + (rectHeight / 2) - addPlayerHeight / 2, 'addPlayer');
				graphic.events.onInputDown.add(function() {
					displayAddShop();
				});
				rectFreePlaces.push(new freePlace(spr, graphic));
			}
		}
		
		this.start = this.game.add.button(this.game.width - playPaddingRight - playWidth, this.game.height - playHeight - playPaddingBottom, 'start', function() {
			self.game.state.start("Game", true, false, selectedUser);
		}, this, 2, 1, 0);
		this.game.add.button(backPaddingLeft, this.game.height - backHeight - backPaddingLeft, 'back', function() {
			self.game.state.start('Menu');
		});
		this.start.visible = false;
	},
	create: function() {
		
	}
};