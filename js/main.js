var game = new Phaser.Game(800, 800, Phaser.AUTO, 'canvas', 
	{ preload: preload, create: create, update: update });

function preload(){
	game.load.image('white-key', 'assets/img/white.png');
	game.load.audio('audio', ['assets/aud/audio.mp3','assets/aud/keys.ogg'] )

//  this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	//this.scale.pageAlignHorizontally = true;
	//this.scale.pageAlignVertically = true;
	//this.scale.setScreenSize( true );
}


var keyData;
var keys;
var notes;
var line1;

// var keyCode = {"a", "s", "d","f","g","h","j","k","l","1","2","3","4","5"};
var keyCode = {a:65,s:83,d:68,f:70,g:71,h:72,j:74,k:75,l:76,č:0,"c":49,"v":50,"b":51,"n":52,"m":53};
var keyboardKeys = ['a','s','d','f','g','h','j','k','l','č','c','v','b','n','m']; 
var waitForKeys;
var keyToPress;

var points = 0;
function create(){
	game.stage.backgroundColor = '#124184';
	game.physics.startSystem(Phaser.Physics.ARCADE);
	//game.stage.disableVisibilityChange = true;//ko greš iz okna se igra nadaljuje
	keyData = game.cache.getImage('white-key');
	position = 80;

	keys = game.add.group();
    keys.enableBody = true;
	
    var graphics=game.add.graphics(0,0);//if you have a static line
  	graphics.lineStyle(1, 0x000000, 1);
    for (var i = 0; i<15;i++ ){	
	 	keyHeight = keyData.height;
		var key = keys.create(position,game.world.height-keyHeight/2,'white-key');
		keytext = game.add.text(key.x + 10,key.y + 10, keyboardKeys[i]);
		key.inputEnabled = true;
		key.events.onInputDown.add( listener, key );
		key.name = "key" + i;
		key.scale.setTo(0.5);

		graphics.moveTo(position,0);//moving position of graphic if you draw mulitple lines
  		graphics.lineTo(position,game.world.height-keyHeight/2);

		position += keyData.width/2;
		key.body.immovable = true;
  		
	}
	graphics.moveTo(position,0);//moving position of graphic if you draw mulitple lines
  	graphics.lineTo(position,game.world.height-keyHeight/2);

	notes = game.add.group();
	notes.enableBody = true;

	
	//for(var i = 0; i < 15;);

	//var line = new Phaser.Line(0, 0, 100, 100);
  	//var graphics=game.add.graphics(0,0);
  	cursors = game.input.keyboard.createCursorKeys(); 
  	this.game.input.keyboard.onPressCallback = function(e) {
  		//console.log(e);

  		if (waitForKeys && e==keyToPress)   {
  			game.paused = false;
  			noteToKill.kill();
  			points++;
  		}
  		


  	};

  	this.game.input.keyboard.onDownCallback = function(e){
  		console.log(e);
  		keyToColor = keyboardKeys.indexOf(e.key);
  		keys.children[keyToColor].tint = 0xf10f2f;
  	};

  	this.game.input.keyboard.onUpCallback = function(e){
  		keyToUncolor = keyboardKeys.indexOf(e.key);
  		keys.children[keyToUncolor].tint = 0xffffff;
  	};

  	waitForKeys = false;
  	toggleMode = game.add.text(game.world.width - 120, 20, 'Čakaj: NE', { font: '24px Arial', fill: '#fff' });
    toggleMode.inputEnabled = true;
    toggleMode.events.onInputUp.add(function () {
    	waitForKeys = !waitForKeys;
    	toggleMode.text = waitForKeys ? 'Čakaj: DA' : 'Čakaj: NE';
    });

    pointsText = game.add.text(game.world.width-120, 50, 'Točke: 0', { font: '24px Arial', fill: '#fff' });

}

function listener () {

    //console.log("fdasfsa");
    //toggleMode.text = "dsadasd";

}

var appearanceTime = 0;
var noteToKill;
function update (){
	
	//game.physics.arcade.collide(notes, keys);
	game.physics.arcade.collide(notes, keys, 
		function(note, keys){ 
			if (waitForKeys){
				game.paused = true;
				keyToPress = keyboardKeys[note.name.substring(4)];
				noteToKill = note;
				//console.log(keyCode[keyToPress]);

			} else {
				note.kill(); 
			}
			
		}, null, this);
	if (game.time.now > appearanceTime) {
            
            positionNum = game.rnd.integerInRange(0,14);
			var note = notes.create(80 + (positionNum * keyData.width/2), 0, 'white-key');
			note.scale.setTo(0.5, 0.1);
			game.physics.arcade.enable(note);
			note.body.velocity.y = 70;
			note.body.collideWorldBounds = true;
			note.tint = 0xff00ff;
			note.name = "note" + positionNum;
			note.events.onKilled.add(function(note){notes.remove(note)},this);
			
			
            appearanceTime = game.time.now + game.rnd.integerInRange(500,2000);

    }

    pointsText.text = 'Točke: ' + points;



}