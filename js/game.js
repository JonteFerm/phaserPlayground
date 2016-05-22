var TopDownGame = TopDownGame || {};

TopDownGame.Game = function(){};


Player = function(game, x, y){
	Phaser.Sprite.call(this, game, x, y, 'player');
	this.inventory = ['neger'];
};

Player.prototype = Object.create(Phaser.Sprite.prototype);

Item = function(game, x, y, sprite){
	Phaser.Sprite.call(this, game, x, y, sprite);
	this.gameProperties = {
		itemLevel: 0,
	};
};

Item.prototype = Object.create(Phaser.Sprite.prototype);

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

	    var playerStart = this.findObjectsByType('playerStart', this.map, 'objectLayer')[0];
	    this.player = new Player(this.game, playerStart.x, playerStart.y);
	    this.game.add.existing(this.player);
	    this.player.animations.add('right', [0,1], 10, true);
	    this.player.animations.add('left', [2,3], 10, true);
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
		this.game.physics.arcade.overlap(this.player, this.items, this.pickupItem, null, this);
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
			this.player.animations.play("left");
		}else if(this.wasd.right.isDown){
			this.player.body.velocity.x = 100;
			this.player.animations.play("right");
		}else{
			this.player.animations.stop();
		}
	},

	pickupItem: function(player,item){
		player.inventory.push(item.key);
		console.log(item);
		console.log("Player inventory: " + this.player.inventory);
		item.destroy();
	},

	createItems: function(){
		this.items = this.game.add.group();
		this.items.enableBody = true;
		result = this.findObjectsByType('item', this.map, 'objectLayer');
		result.forEach(function(element){
			var newItem = new Item(this.game, element.x, element.y, element.properties.sprite);

			Object.keys(element.properties).forEach(function(key){
				newItem[key] = element.properties[key];
			});
			
			this.items.add(newItem);

		}, this);
	},

	createDoors: function(){
		this.doors = this.game.add.group();
		this.doors.enableBody = true;
		result = this.findObjectsByType('door', this.map, 'objectLayer');

		result.forEach(function(element){
			var newDoor = this.doors.create(element.x, element.y, element.properties.sprite);

			Object.keys(element.properties).forEach(function(key){
				newDoor[key] = element.properties[key];
			});

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
}