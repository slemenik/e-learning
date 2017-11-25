var game = new Phaser.Game(800, 600, Phaser.AUTO, 'canvas', 
	{ preload: preload, create: create, update: update });

function preload(){
	game.load.image('white-key', 'assets/img/white.png');

	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	//this.scale.pageAlignHorizontally = true;
	this.scale.pageAlignVertically = true;
	//this.scale.setScreenSize( true );
}

function create(){


	var keys = new Array();
	position = 0;
	for (var i = 0; i<10;i++ ){
		height = game.cache.getImage("white-key").height;
		var key = game.add.sprite(10,game.world.height-height,"white-key");
		key.scale(0.02,0.02);
		keys.push(key);
	}
	
	

}

function update (){

}