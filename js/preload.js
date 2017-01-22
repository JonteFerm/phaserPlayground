var TopDownGame = TopDownGame || {};

TopDownGame.Preload = function(){};

TopDownGame.Preload.prototype = {
	preload: function(){
		this.load.tilemap('dungeontest', 'assets/dungeontest/tilemaps/tiletest.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('gameTiles', 'assets/dungeontest/images/tiles2.png');
		//this.load.image('player', 'assets/dungeontest/images/player.png');
		this.load.spritesheet('player', 'assets/dungeontest/images/playersprite2.png', 32, 32);
		this.load.spritesheet('cultist', 'assets/dungeontest/images/cultist.png', 32, 32);
		this.load.image('gate', 'assets/dungeontest/images/gate.png');
		this.load.image('gateopen', 'assets/dungeontest/images/gateopen.png');
		this.load.image('goldenkey', 'assets/dungeontest/images/goldenkey.png');

		this.load.bitmapFont('font', 'assets/dungeontest/font_0.png', 'assets/dungeontest/font.xml');

	},

	create: function(){
		this.state.start('Game');
	}

}
