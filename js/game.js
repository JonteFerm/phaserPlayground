var TopDownGame = TopDownGame || {};

TopDownGame.Game = function(){};


Player = function(game, x, y){
	Phaser.Sprite.call(this, game, x, y, 'player');
	this.inventory = [];
	this.reach = 1;
	this.lastDirction = "";

	this.animations.add('idleRight', [0], 5, true);
	this.animations.add('right', [1,2], 5, true);
	this.animations.add('hitRight', [3,4], 5, true);
	this.animations.add('idleLeft', [5], 5, true);
	this.animations.add('left', [6,7], 5, true);
	this.animations.add('hitLeft', [8,9], 5, true);
	this.animations.add('idleUp', [10], 5, true);
	this.animations.add('up', [11,12], 5, true);
	this.animations.add('idleDown', [13], 5, true);
	this.animations.add('down', [14,15], 5, true);
	this.animations.add('hitDown', [16,17], 5, true);

	this.wasd = {
		up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
		down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
		left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
		right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
	}

	this.checkMovement = function(){
		//console.log("player X: " + this.x + " " + "player Y: " + this.y);
		console.log(this.lastDirction);
		var canAttack = true;
		if(game.input.activePointer.leftButton.isDown){
			if(canAttack){
				this.hit();
				canAttack = false;        
				game.time.events.add(300, (function() {             canAttack = true;        }), this); 
			}
		}
		else if(this.wasd.up.isDown){
			this.body.velocity.y = -100;
			this.animations.play("up");
			this.lastDirection = "up";
		}else if(this.wasd.down.isDown){
			this.body.velocity.y = 100;
			this.animations.play("down");
			this.lastDirection = "down";
		}else if(this.wasd.left.isDown){
			this.body.velocity.x = -100;
			this.animations.play("left");
			this.lastDirection = "left";
		}else if(this.wasd.right.isDown){
			this.body.velocity.x = 100;
			this.animations.play("right");
			this.lastDirection = "right";
		}else{

				if(this.lastDirection === "up"){
					this.animations.play("idleUp");
				}else if(this.lastDirection === "down"){
					this.animations.play("idleDown");
				
				}else if(this.lastDirection === "left"){
					this.animations.play("idleLeft");
			
				}else if(this.lastDirection === "right"){
					this.animations.play("idleRight");
				}
			
		}
	}

	this.hit = function(){
		if(this.lastDirection === "down"){
			this.animations.play("hitDown");
		}else if(this.lastDirection === "left"){
			this.animations.play("hitLeft");
		}else if(this.lastDirection === "right"){
			this.animations.play("hitRight");
		}
	}
};

Player.prototype = Object.create(Phaser.Sprite.prototype);

Enemy = function(game, x, y, type){
	Phaser.Sprite.call(this, game, x, y, type);
	this.inventory = [];
	this.perception = 5;

    this.animations.add('right', [0,1], 10, true);
	this.animations.add('left', [2,3], 10, true);

	this.checkSpotPlayer = function(playerX, playerY){
		if((this.x + this.perception*32 >= playerX || this.x - this.perception*32 >= playerX) && (this.y + this.perception*32 >= playerY || this.y - this.perception*32 >= playerY)){
			console.log("spotted!");
			return true;
		}
	}

	this.makeMovement = function(playerX, playerY){
		//console.log("enemy X: " + this.x + " " + "enemy Y: " + this.y);

		if((this.y > playerY + 32 || this.y < playerY - 32) || (this.x > playerX + 32 || this.x < playerX - 32)){
			if(playerY > this.y){
				this.body.velocity.y = 80;
			}else if(playerY < this.y){
				this.body.velocity.y = -80;
			}

			if(playerX > this.x){
				this.body.velocity.x = 80;
				this.animations.play("right");
			}else if(playerX < this.x){
				this.body.velocity.x = -80;
				this.animations.play("left");
			}
		}else{
			this.animations.stop();
		}
	}

	this.checkIsHitByPlayer = function(player, mouseX, mouseY){
		var playerTotalReachRight = (player.x + 32) + player.reach*32;
		var playerTotalReachLeft = player.x - player.reach*32;
		var playerTotalReachUp = player.y - player.reach*32;
		var playerTotalReachDown = (player.y + 32) + player.reach*32;

		if(
			((player.x <= this.x && playerTotalReachRight >= this.x) || (player.x >= this.x && playerTotalReachLeft <= this.x + 32))  && 
			((player.y >= this.y && playerTotalReachUp <= (this.y + 32)) || (player.y <= this.y && playerTotalReachDown >= (this.y)) )
		){
			//console.log("player is within reach");
			if((mouseX >= this.x && mouseX < this.x + 32) && (mouseY >= this.y && mouseY < this.y + 32)){
				return true;
			}
		}

		return false;
	}
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);

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

	    this.map.setCollisionBetween(1, 3000, true, 'blockLayer');

	    this.backgroundLayer.resizeWorld();

	    this.createItems();
	    this.createDoors();

	    var playerStart = this.findObjectsByType('playerStart', this.map, 'objectLayer')[0];
	    this.player = new Player(this.game, playerStart.x, playerStart.y);
	    this.game.add.existing(this.player);
	    this.game.physics.arcade.enable(this.player);
	    this.game.camera.follow(this.player);
	    this.player.body.immovable = true;

		var enemyStart = this.findObjectsByType('enemyStart', this.map, 'objectLayer')[0];
		this.enemy = new Enemy(this.game, enemyStart.x, enemyStart.y, 'cultist');
		this.game.add.existing(this.enemy);
		this.game.physics.arcade.enable(this.enemy);
		this.enemy.body.immovable = true;

	},

	update: function(){
		this.game.physics.arcade.collide(this.player, this.blockLayer);
		this.game.physics.arcade.collide(this.player, this.enemy);
		this.game.physics.arcade.overlap(this.player, this.items, this.pickupItem, null, this);
		this.player.body.velocity.y = 0;
		this.player.body.velocity.x = 0;

		this.player.checkMovement();

		this.game.physics.arcade.collide(this.enemy, this.blockLayer);
		this.game.physics.arcade.collide(this.enemy, this.player);
		this.enemy.body.velocity.y = 0;
		this.enemy.body.velocity.x = 0;

		if(this.enemy.checkSpotPlayer(this.player.x, this.player.y)){
			this.enemy.makeMovement(this.player.x, this.player.y);
		}
		

		if(this.game.input.activePointer.leftButton.isDown){
			//console.log("left mouse X: " + this.game.input.activePointer.x + " " + "left mouse Y: " + this.game.input.activePointer.x);
			if(this.enemy.checkIsHitByPlayer(this.player, this.game.input.activePointer.x, this.game.input.activePointer.y)){
				console.log("player strikes enemy!");
			}
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