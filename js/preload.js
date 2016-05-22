var TopDownGame = TopDownGame || {};

TopDownGame.Preload = function(){};

TopDownGame.Preload.prototype = {
	preload: function(){
		this.load.tilemap('dungeontest', 'assets/dungeontest/tilemaps/tiletest.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('gameTiles', 'assets/dungeontest/images/tiles2.png');
		//this.load.image('player', 'assets/dungeontest/images/player.png');
		this.load.spritesheet('player', 'assets/dungeontest/images/playersprite.png', 32, 32);
		this.load.image('gate', 'assets/dungeontest/images/gate.png');
		this.load.image('goldenkey', 'assets/dungeontest/images/goldenkey.png');

	},

	create: function(){
		this.state.start('Game');
	}

}
