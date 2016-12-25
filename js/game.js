var TopDownGame = TopDownGame || {};

TopDownGame.Game = function(){};

Player.prototype = Object.create(Phaser.Sprite.prototype);

Enemy.prototype = Object.create(Phaser.Sprite.prototype);

Item.prototype = Object.create(Phaser.Sprite.prototype);

TopDownGame.Game.prototype = {
	create: function(){
		this.map = this.game.add.tilemap('dungeontest');
		this.map.addTilesetImage('tiles2', 'gameTiles');


		this.backgroundLayer = this.map.createLayer('backgroundLayer');
		this.blockLayer = this.map.createLayer('blockLayer');

	    this.map.setCollisionBetween(1, 3000, true, 'blockLayer');

	    this.backgroundLayer.resizeWorld();

	    this.createItems();
	    this.createDoors();

	    var playerStart = this.findObjectsByType('playerStart', this.map, 'objectLayer')[0];
	    this.player = new Player(this.game, playerStart.x, playerStart.y);
	    this.game.add.existing(this.player);
	    this.game.physics.arcade.enable(this.player);
	    this.game.camera.follow(this.player);
	  

		var enemyStart = this.findObjectsByType('enemyStart', this.map, 'objectLayer')[0];
		this.enemy = new Enemy(this.game, enemyStart.x, enemyStart.y, 'cultist');
		this.game.add.existing(this.enemy);
		this.game.physics.arcade.enable(this.enemy);
		this.enemy.body.immovable = true;
	
		this.player.countStats();
		this.enemy.countStats();

	},

	update: function(){
		this.game.physics.arcade.collide(this.player, this.blockLayer);
		this.game.physics.arcade.overlap(this.player, this.items, this.pickupItem, null, this);

		this.player.body.velocity.y = 0;
		this.player.body.velocity.x = 0;

		this.player.checkActions({enemies: [this.enemy]});

		this.game.physics.arcade.collide(this.enemy, this.blockLayer);
		this.game.physics.arcade.collide(this.enemy, this.player, this.collissionHandlerPlayerAndEnemy, null, this);
		this.enemy.body.velocity.y = 0;
		this.enemy.body.velocity.x = 0;


		this.enemy.takeActions({player: this.player, opponents: [this.player]});
	},

	collissionHandlerPlayerAndEnemy: function(){
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
		this.enemy.body.velocity.x = 0;
		this.enemy.body.velocity.y = 0;
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