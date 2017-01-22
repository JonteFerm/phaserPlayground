var TopDownGame = TopDownGame || {};

TopDownGame.Game = function(){};

Player.prototype = Object.create(Phaser.Sprite.prototype);

Enemy.prototype = Object.create(Phaser.Sprite.prototype);

Item.prototype = Object.create(Phaser.Sprite.prototype);

Door.prototype = Object.create(Phaser.Sprite.prototype);

TopDownGame.Game.prototype = {
	create: function(){
		this.map = this.game.add.tilemap('dungeontest');
		this.map.addTilesetImage('tiles2', 'gameTiles');

		this.backgroundLayer = this.map.createLayer('backgroundLayer', 576, 576);
		this.blockLayer = this.map.createLayer('blockLayer', 576, 576);

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

		this.player.body.setSize(15,32,7.5,0);

		var graphics = this.game.add.graphics();

		graphics.beginFill(0x000000, 1);
		this.gamePanel = graphics.drawRect(0, 512, 512, -96);
		graphics.endFill();
		this.gamePanel.fixedToCamera = true;

		this.gameLogTextHeight = 0;
		this.gameLog = [];
		this.gameLogHistory = [];

		this.addText("Welcome1!");
		this.addText("Welcome!\nWelcome!");
				this.addText("Welcome2!");
				
				this.addText("Welcome3!");
				this.addText("Welcome5!");
								this.addText("Welcome6!");
	},

	update: function(){
		this.game.physics.arcade.collide(this.player, this.blockLayer, this.handleWall);
		this.game.physics.arcade.overlap(this.player, this.items, this.pickupItem, null, this);
		this.game.physics.arcade.collide(this.player, this.doors, this.handleDoor, null, this);
		

		this.player.body.velocity.y = 0;
		this.player.body.velocity.x = 0;

		this.player.checkActions({enemies: [this.enemy]});

		this.game.physics.arcade.collide(this.enemy, this.blockLayer);
		this.game.physics.arcade.collide(this.enemy, this.player, this.collissionHandlerPlayerAndEnemy, null, this);
		this.enemy.body.velocity.y = 0;
		this.enemy.body.velocity.x = 0;


		if(this.enemy.health > 0){
			this.enemy.takeActions({player: this.player, opponents: [this.player]});
		}
	
	},

	collissionHandlerPlayerAndEnemy: function(){
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
		this.enemy.body.velocity.x = 0;
		this.enemy.body.velocity.y = 0;
		this.enemy.animations.stop();
	},

	pickupItem: function(character,item){
		character.inventory.push(item.key);
		console.log(item);
		console.log("Character inventory: " + character.inventory);
		item.destroy();
	},

	handleDoor: function(character, door){
		door.open();

		if(character.y > door.y ){
				character.body.y = door.y - 32;
		}else{
			character.y = door.y + 32;
		}
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
	    this.game.physics.arcade.enable(this.doors);
		result = this.findObjectsByType('door', this.map, 'objectLayer');

		result.forEach(function(element){
			var newDoor = new Door(this.game, element.x, element.y, element.properties.sprite1, element.properties.sprite2);

			Object.keys(element.properties).forEach(function(key){
				newDoor[key] = element.properties[key];
			});


			this.doors.add(newDoor);

		}, this);

		console.log(this.doors);
		for(var i = 0; i < this.doors.children.length; i++){
			this.doors.children[i].body.moves = false;
		}
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

	addText: function(text){


		this.gameLog.push(this.game.add.bitmapText(10, 430, 'font',text, 16));
		this.gameLog[this.gameLog.length-1].fixedToCamera = true;
		this.gameLogTextHeight += this.gameLog[this.gameLog.length-1].height;
		console.log(this.gameLogTextHeight);
		if(this.gameLogTextHeight >= 93){
			console.log("hej");
			var firstItem = this.gameLog.shift();
			firstItem.visible = false;
			this.gameLogHistory.push(firstItem);
			this.gameLogTextHeight -= firstItem.height;
		}

		if(this.gameLog.length > 0){
			for(var i = this.gameLog.length-1; i > 0; i--){
				if(i > 0){
					var prevText = "";
					var height = 0;
					prevText = this.gameLog[i-1].text;
					height = this.gameLog[i].height;
					this.gameLog[i-1].destroy();
					this.gameLog[i-1] = this.game.add.bitmapText(10, (this.gameLog[i].y + (16*(height/15.5))), 'font', prevText, 16);
					
					this.gameLog[i-1].fixedToCamera = true;
				}


			}
		}


		console.log(this.gameLogHistory);

		



			/*
			var logItem = this.gameLog[i];
			console.log(logItem.y);
			totalTextHeight += logItem.height;
			if(i > 0){
				logItem.y = this.gameLog[i-1].y+16;
			}*/
		
	},

	printLog: function(){

	}
}