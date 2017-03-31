var Map = function(key, tileMap, game, player) {
	this.key = key;
	this.tileMap = tileMap;		
	this.wraps = [];
	this.npcs = [];
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
		this.npcs = game.add.group();
		this.wraps.enableBody = true;
		this.npcs.enableBody = true;
		this.tileMap.createFromObjects('Wraps', 'wrap', 'wrap', 0, true, false, this.wraps);	
		var npcsObjs = tileMap.objects['Npcs'];
		if (npcsObjs) {
			npcsObjs.forEach(function(npc) {
				switch(npc.type) {
					case "warper":
						var warper = game.add.sprite(npc.x, npc.y, 'wraper');
						warper.animations.add('stay');
						warper.animations.play('stay', 1, true);
						self.npcs.add(warper);
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
		game.physics.arcade.enable(this.player.sprite);			
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
};