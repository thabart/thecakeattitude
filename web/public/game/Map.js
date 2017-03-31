var Map = function(key, tileMap, game, player) {
	var npcs = [],
		npcObjs = null;
	this.key = key;
	this.tileMap = tileMap;		
	this.wraps = [];
	this.player = player;
	this.players = [];
	this.layers = {
		alimentation : null,
		earth : null,
		ground: null,
		collision : null					
	};
	
	this.init = function() {
		var self = this;
		// TODO : Load all the IMAGES.
		this.tileMap.addTilesetImage('tallgrass', 'tallgrass');
		this.tileMap.addTilesetImage('farming_fishing', 'farming_fishing');
		this.tileMap.addTilesetImage('tiles', 'tiles');
		// Add layers.					
		this.layers.collision = this.tileMap.createLayer('Collision');
		this.layers.ground = this.tileMap.createLayer('Ground');
		this.layers.earth = this.tileMap.createLayer('Earth');
		this.layers.alimentation = this.tileMap.createLayer('Alimentations');
		this.tileMap.createLayer('Wraps');
		// Create all the objects.
		this.wraps = game.add.group();
		npcObjs = game.add.group();
		this.wraps.enableBody = true;
		npcObjs.enableBody = true;
		this.tileMap.createFromObjects('Wraps', 'wrap', 'wrap', 0, true, false, this.wraps);	
		var npcsObjs = tileMap.objects['Npcs'];
		if (npcsObjs) {
			npcsObjs.forEach(function(npc) {
				switch(npc.type) {
					case "warper":
						var warper = new Warper(game, npc);
						var sprite = warper.getSprite();
						npcObjs.add(sprite);
						npcs.push([sprite, warper ]);
					break;
				}
			});
		}
		
		// ADD SPRITE : 
		// this.wraps.add('tiles'); => sprite
		// Specify which tile can collide.
		this.tileMap.setCollision(421, true, 'Collision');
		// Add the player to the world.
		this.player = new Player(null, 0, 0, game, true);
		// Make the camera follow the sprite.
		game.camera.follow(this.player.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
		// Display layer.
		this.layers.earth.resizeWorld();
	};
	
	this.destroy = function() {
		// Destroy the layers & objects.
		this.layers.collision.destroy();
		this.layers.ground.destroy();
		this.layers.earth.destroy();
		this.layers.alimentation.destroy();
		this.wraps.destroy();
		this.tileMap.destroy();
		this.player.remove();
		this.players.forEach(function(p) {
			p.remove();
		});
	};
	
	this.getNpcObjs = function() {
		return npcObjs;
	};
	
	this.getNpc = function(sprite) {
		var result = null;
		npcs.forEach(function(kvp) {
			if (kvp[0] == sprite) {
				result = kvp[1];
			}
		});
		
		return result;
	};
};