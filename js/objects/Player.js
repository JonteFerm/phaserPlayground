Player = function(game, x, y){
	Phaser.Sprite.call(this, game, x, y, 'player');
	this.equipped = {
		rightHand: {
			name: "broadsword", 
			type: "weapon", 
			damage: 3, 
			protection: 0, 
			attackRate: 1
		},
	};


	this.health = 20;
	this.primalDamage = 1;
	this.weaponDamage = 0;
	this.protection = 1;
	this.attackRate = 2
	this.reach = 1;

	this.inventory = [];
	this.lastDirction = "";
	this.timeAttacked = 0;

	this.attacking = false;

	this.animations.add('idleRight', [0], 5, true);
	this.animations.add('right', [0, 1, 2], 5);
	this.animations.add('hitRight', [0, 3, 4], 5, true);
	this.animations.add('idleLeft', [5], 5, true);
	this.animations.add('left', [5, 6, 7], 5);
	this.animations.add('hitLeft', [5, 8, 9], 5, true);
	this.animations.add('idleUp', [10], 5, true);
	this.animations.add('up', [10, 11, 12], 5);
	this.animations.add('idleDown', [13], 5, true);
	this.animations.add('down', [13, 14, 15], 5);
	this.animations.add('hitDown', [13, 16, 17], 5, true);

	
	this.events.onAnimationComplete.add(function(){			
		this.animations.stop(true, true);	

	}, this);

	this.wasd = {
		up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
		down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
		left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
		right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
	}

	this.countStats = function(){
		for (var property in this.equipped) {
			if (this.equipped.hasOwnProperty(property)) {
				var item = this.equipped[property];
				
				if(item.type === "weapon"){
					this.weaponDamage += item.damage;
				}else if(item.type === "primal"){
					this.primalDamage += item.damage;
				}
			  
		 	  	this.protection += item.protection;
				this.attackRate -= item.attackRate;
			}
		}
	}

	this.checkActions = function(levelObjects){
		if(game.input.activePointer.leftButton.isDown){
			if(game.time.now - this.timeAttacked > this.attackRate*1000){
				if(this.lastDirection === "down"){
					this.animations.play("hitDown", 5, false);
				}else if(this.lastDirection === "left"){
					this.animations.play("hitLeft", 5, false);
				}else if(this.lastDirection === "right"){
					this.animations.play("hitRight", 5, false);
				}


				for(var i = 0; i < levelObjects.enemies.length; i++){
					var enemy = levelObjects.enemies[i];

					if(this.checkHitEnemy(enemy, game.input.activePointer.x+game.camera.x, game.input.activePointer.y+game.camera.y)){
						enemy.takeDamage(this, "primary");
					}
				}

				this.timeAttacked = game.time.now;
			}
		}else if(this.wasd.up.isDown){
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
		}
	}

	this.checkHitEnemy = function(enemy, mouseX, mouseY){
		var playerTotalReachRight = (this.x + 32) + this.reach*32;
		var playerTotalReachLeft = this.x - this.reach*32;
		var playerTotalReachUp = this.y - this.reach*32;
		var playerTotalReachDown = (this.y + 32) + this.reach*32;

		if(
			((this.x <= enemy.x && playerTotalReachRight >= enemy.x) || (this.x >= enemy.x && playerTotalReachLeft <= enemy.x + 32))  && 
			((this.y >= enemy.y && playerTotalReachUp <= (enemy.y + 32)) || (this.y <= enemy.y && playerTotalReachDown >= (enemy.y)) )
		){
			if((mouseX >= enemy.x && mouseX < enemy.x + 32) && (mouseY >= enemy.y && mouseY < enemy.y + 32)){

				return true;
			}
		}

		return false;
	}
};
