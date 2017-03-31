var Map = function(key, tileMap, game, player) {
	var npcs = [],
		npcObjs = null,
		houseObj = null,
		warps = null;
	this.key = key;
	this.tileMap = tileMap;		
	this.player = player;
	this.players = [];
	this.layers = {
		alimentation : null,
		earth : null,
		ground: null,
		collision : null					
	};
	
	this.init = function() {		
		var addWrap = function(gm, obj, name, groupName, group) {			
			var rect = new Phaser.Sprite(gm, obj.x, obj.y, name);
			rect.name = groupName;
			rect.exists = true;
			rect.autoCull = false;
			rect.width = obj.width;
			rect.height = obj.height;
			group.add(rect);
			for (var property in obj.properties)
            {
                group.set(rect, property, obj.properties[property], false, false, 0, true);
            }
			
			return rect;
		};
	
		var self = this;		
		// TODO : Load all the IMAGES.
		this.tileMap.addTilesetImage('tallgrass', 'tallgrass');
		this.tileMap.addTilesetImage('farming_fishing', 'farming_fishing');
		this.tileMap.addTilesetImage('tiles', 'tiles');
		this.tileMap.addTilesetImage('plowed_soil', 'plowed_soil');
		this.tileMap.addTilesetImage('house', 'house');
		this.tileMap.addTilesetImage('freePlace', 'freePlace');
		// Add layers.					
		this.layers.collision = this.tileMap.createLayer('Collision');
		this.layers.ground = this.tileMap.createLayer('Ground');
		this.layers.earth = this.tileMap.createLayer('Earth');
		this.layers.alimentation = this.tileMap.createLayer('Alimentations');
		this.tileMap.createLayer('Wraps');
		// Create all the objects.
		warps = game.add.group();
		npcObjs = game.add.group();
		warps.enableBody = true;
		npcObjs.enableBody = true;
		var npcsObjs = tileMap.objects['Npcs'];
		var wps = tileMap.objects['Wraps'];
		// Create npcs.
		if (npcsObjs) {
			npcsObjs.forEach(function(npc) {
				var o = null;
				switch(npc.type) {
					case "warper":
						o = new Warper(game, npc);
					break;
					case "shop":
						o = new Shop(game, npc, tileMap);
					break;
				}
				
				if (o == null) {
					return;
				}
				
				var sp = o.getSprite();
				npcObjs.add(sp);
				npcs.push([sp, o ]);
			});
		}
		
		// Create warps.
		if (wps) {
			wps.forEach(function(warp) {
				addWrap(game, warp, 'warp', 'Warps', warps);
			});
		}
		
		// ADD SPRITE : 
		// this.wraps.add('tiles'); => sprite
		// Specify which tile can collide.
		this.tileMap.setCollision(421, true, 'Collision');
		// Add the player to the world.
		this.player = new Player(null, 1673, 926, game, true);
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
		warps.destroy();
		npcObjs.destroy();
		constructionsObjs.destroy();
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
	
	this.getWarps = function() {
		return warps;
	};
};