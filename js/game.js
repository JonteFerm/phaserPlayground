var TopDownGame = TopDownGame || {};

TopDownGame.Game = function(){};

TopDownGame.Game.prototype = {
	create: function(){
		this.map = this.game.add.tilemap('dungeontest');
		this.map.addTilesetImage('tiles2', 'gameTiles');


		this.backgroundLayer = this.map.createLayer('backgroundLayer');
		this.blockLayer = this.map.createLayer('blockLayer');

		 //collision on blockedLayer
	    this.map.setCollisionBetween(1, 3000, true, 'blockLayer');
	 	
	    //resizes the game world to match the layer dimensions
	    this.backgroundLayer.resizeWorld();

	    this.createItems();
	    this.createDoors();

	    var result = this.findObjectsByType('playerStart', this.map, 'objectLayer');

	    this.player = this.game.add.sprite(result[0].x, result[0].y, 'player');
	    this.game.physics.arcade.enable(this.player);
	    this.game.camera.follow(this.player);

		this.wasd = {
			up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
			down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
			left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
			right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
		}


	    
	},

	update: function(){
		this.game.physics.arcade.collide(this.player, this.blockLayer);
		this.player.body.velocity.y = 0;
		this.player.body.velocity.x = 0;

		this.checkPlayerMovement();
	},

	checkPlayerMovement: function(){
		if(this.wasd.up.isDown){
			this.player.body.velocity.y = -100;
		}else if(this.wasd.down.isDown){
			this.player.body.velocity.y = 100;
		}else if(this.wasd.left.isDown){
			this.player.body.velocity.x = -100;
		}else if(this.wasd.right.isDown){
			this.player.body.velocity.x = 100;
		}
	},

	createItems: function(){
		this.items = this.game.add.group();
		this.items.enableBody = true;
		var item;
		result = this.findObjectsByType('item', this.map, 'objectLayer');
		result.forEach(function(element){
			this.createFromTiledObject(element, this.items);
		}, this);
	},

	createDoors: function(){
		this.doors = this.game.add.group();
		this.doors.enableBody = true;
		result = this.findObjectsByType('door', this.map, 'objectLayer');

		result.forEach(function(element){
			this.createFromTiledObject(element, this.doors);
		}, this);
	},

	findObjectsByType: function(type, map, layer){
		var result = new Array();

		map.objects[layer].forEach(function(element){
			if(element.type === type){
				element.y -= map.tileHeight;
				result.push(element);
			}
		});	
		return result;
	},

	createFromTiledObject: function(element, group){
		var sprite = group.create(element.x, element.y, element.properties.sprite);

		Object.keys(element.properties).forEach(function(key){
			sprite[key] = element.properties[key];
		});
	}


}