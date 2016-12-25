Enemy = function(game, x, y, type){
	Phaser.Sprite.call(this, game, x, y, type);
	this.equipped = {
		chest: {name: "chainmail", type: "armor", damage: 0, protection: 2},
	};
	this.inventory = [];
	this.reach = 1;
	this.perception = 5;
	this.health = 20;
	this.timeAttacked = 0;

    this.animations.add('right', [0,1], 10, true);
	this.animations.add('left', [2,3], 10, true);

	this.checkSpotPlayer = function(playerX, playerY){
		if((this.x + this.perception*32 >= playerX || this.x - this.perception*32 >= playerX) && (this.y + this.perception*32 >= playerY || this.y - this.perception*32 >= playerY)){
			return true;
		}
	}

	this.makeMovement = function(playerX, playerY){
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

	this.takeActions = function(opponent){
		if(game.time.now - this.timeAttacked > 1000){
			if(this.checkHitOpponent(opponent)){
				this.attack(opponent);
				this.timeAttacked = game.time.now;
				console.log("enemy strikes player!");
			}
		}
	}

	this.checkHitOpponent = function(opponent){
		var totalReachRight = (this.x + 32) + this.reach*32;
		var totalReachLeft = this.x - this.reach*32;
		var totalReachUp = this.y - this.reach*32;
		var totalReachDown = (this.y + 32) + this.reach*32;

		if(
			((this.x <= opponent.x && totalReachRight >= opponent.x) || (this.x >= opponent.x && totalReachLeft <= opponent.x + 32))  && 
			((this.y >= opponent.y && totalReachUp <= (opponent.y + 32)) || (this.y <= opponent.y && totalReachDown >= (opponent.y)) )
		){
			return true;
		}

		return false;
	}

	this.attack = function(){

	}

	this.takeDamage = function(attacker, attackType){
		var damageDealt = 0;
		var damageProtected = 0;
		var damageTaken = 0;

		if(attackType === "primary"){
			damageDealt = attacker.equipped.rightHand.damage;
		}

		for (var property in this.equipped) {
			if (this.equipped.hasOwnProperty(property)) {
			   damageProtected += this.equipped[property].protection;
			}
		}

		damageTaken = damageDealt - damageProtected;

		console.log("enemy takes " + damageTaken + " damage.");

		this.health -= damageTaken;

		if(damageTaken > 0){
			//todo: Spela blod-animation.
		}

	}
}