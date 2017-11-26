var game = new Phaser.Game(800, 800, Phaser.AUTO, 'canvas', 
	{ preload: preload, create: create, update: update });

function preload(){
	game.load.image('white-key', 'assets/img/white.png');

//  this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	//this.scale.pageAlignHorizontally = true;
	//this.scale.pageAlignVertically = true;
	//this.scale.setScreenSize( true );
}


var keyData;
var keys;
var notes;
var line1;

var keyCode = ["a", "s", "d","f","g","h","j","k","l","1","2","3","4","5"];

function create(){

	game.stage.backgroundColor = '#124184';
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.stage.disableVisibilityChange = true;
	keyData = game.cache.getImage('white-key');
	//var keys = new Array();
	position = 80;

	keys = game.add.group();
    keys.enableBody = true;

    var graphics=game.add.graphics(0,0);//if you have a static line
  	graphics.lineStyle(1, 0x000000, 1);
    for (var i = 0; i<15;i++ ){	
	 	keyHeight = keyData.height;
		var key = keys.create(position,game.world.height-keyHeight/2,'white-key');
		key.scale.setTo(0.5);

		graphics.moveTo(position,0);//moving position of graphic if you draw mulitple lines
  		graphics.lineTo(position,game.world.height-keyHeight/2);

		position += keyData.width/2;
		key.body.immovable = true;


		//keys.push(key);

		
  		
	}

	graphics.moveTo(position,0);//moving position of graphic if you draw mulitple lines
  	graphics.lineTo(position,game.world.height-keyHeight/2);

	notes = game.add.group();
	notes.enableBody = true;

	
	//for(var i = 0; i < 15;);

	//var line = new Phaser.Line(0, 0, 100, 100);
  	//var graphics=game.add.graphics(0,0);
  	


}

var appearanceTime = 0;

function update (){
	
	//game.physics.arcade.collide(notes, keys);
	game.physics.arcade.collide(notes, keys, 
		function(notes, keys){ notes.kill(); }, null, this);
	if (game.time.now > appearanceTime) {
            
            positionNum = game.rnd.integerInRange(0,14);
			var note = notes.create(80 + (positionNum * keyData.width/2), 0, 'white-key');
			note.scale.setTo(0.5, 0.1);
			game.physics.arcade.enable(note);
			note.body.velocity.y = 70;
			note.body.collideWorldBounds = true;
			note.tint = 0xff00ff;
			note.events.onKilled.add(function(note){notes.remove(note)},this);
			
			
            appearanceTime = game.time.now + game.rnd.integerInRange(500,2000);

    }


    
}