var playState = { preload: preload, create: create, update: update, init:init};

var keys;
var notes;
var keysOrder = [0,1,2,1,3,0,1,2,1,2,1,3];//0-left, 1-black, 2-middle, 3-right
var audio;

var keyboardKeys = [' ',' ',' ',' ',' ','1','2','3','4','5','6','7','8','9','0','+', 'q','w','e','r','t','z','u',
					'i','o','p','a','s','d','f','g','h','j','k','l','c','v','b','n','m', ',','.','-'];
var pianoKeys = ['C','C#', 'D', 'D#','E','F', 'F#','G', 'G#', 'A', 'A#', 'H'];
var waitForKeys;
var keysToPress = [];
var sizeMidiMap = {};

var octavesCount = 4;
var minMaxOctave = [43, 84];
var lowerOctaveFor = 2;

var positionArray = [0];
var points = 0;

var level;
var levelData = {
	0: {waitForKeys: true, bothHands: false, midiChannels: [-1, 2], playEveryNthTone: 2, startingTone: 1},//2- right, 3-left
	1: {waitForKeys: true, bothHands: false, midiChannels: [-1, 2], playEveryNthTone: 1, startingTone: 0},
	2: {waitForKeys: true, bothHands: false, midiChannels: [3, -1], playEveryNthTone: 1, startingTone: 0},
	3: {waitForKeys: true, bothHands: true, midiChannels: [3, 2], playEveryNthTone: 1, startingTone: 0},
	4: {waitForKeys: false, bothHands: false, midiChannels: [3, 2], playEveryNthTone: 1, startingTone: 0}
};

function init(l) {
	level = l;
    waitForKeys = levelData[level].waitForKeys;
}

function preload(){
    game.load.image('left-key', 'assets/img/left-small.png');
    game.load.image('right-key', 'assets/img/right-small.png');
    game.load.image('middle-key', 'assets/img/middle-small.png');
    game.load.image('black-key', 'assets/img/black.png');
    game.load.image('music-sheet', 'assets/img/sheet.PNG');
    game.load.audio('audio', 'assets/aud/audio.mp3' );
}

function create(){

	//check if browser is google chrome - MIDI keyboard doesn't work anywhere else
    var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    if (is_chrome) navigator.requestMIDIAccess().then(onsuccesscallback, onerrorcallback);

	game.stage.backgroundColor = '#124184';
	game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.isPaused = false;
    game.paused = false;
    game.time.events.resume();

    //uncomment if you want the game to continue on focus lost
	//game.stage.disableVisibilityChange = true;

    game.add.text(game.world.width-400, 750, 'Nivo št.: ' + (level +1), {
        font: '40pt menuFont',
        fill: '#fff'
    });
	
	if (level<4){
        addMenuOption1('Naslednji nivo >', function () {
            game.paused = false;
            game.state.start('play', true, false, level+1);
        }, 300);
    }

    if (level>0) {
        addMenuOption1('< Prejšnji nivo ', function () {
            game.paused = false;
            game.state.start('play', true, false, level-1);
        }, 550);
    }
    

    var sheet = game.add.sprite(game.world.width-(game.cache.getImage('music-sheet').width * 0.9), 100, 'music-sheet');
    sheet.scale.set(0.85);

	var position = 0;

	keys = game.add.group();
    keys.enableBody = true;
	
    var graphics=game.add.graphics(0,0);
  	graphics.lineStyle(1, 0x000000, 1);

  	index = 0;
  	for (var j = 0; j<octavesCount;j++){
	    for (var i = 0; i<keysOrder.length;i++ ){
	    	keyType = keysOrder[i];
	    	keyName = (keyType==0 ? 'left-key' : 
	    				keyType==1 ? 'black-key' : 
	    				keyType==2 ? 'middle-key' : 'right-key');	
		 	var keyImgData = game.cache.getImage(keyName);
		 	var whiteKeyHeight = keyImgData.height;
			var key = keys.create(position,game.world.height-whiteKeyHeight,keyName);

			textColor = keyType == 1 ? '#fff' : '#000';
			game.add.text(key.x + 5,key.y + 10, keyboardKeys[index], {fill: textColor});
			game.add.text(key.x + 5,key.y + 80, pianoKeys[i%12], {fill: textColor, font: "bold 16px Arial"});
			game.add.text(key.x + 5,key.y + 120, 
				getOctaveNumber(minMaxOctave[0]-(lowerOctaveFor*8))+ index, {font: "bold 16px Arial"});

			sizeMidiMap[(getOctaveNumber(minMaxOctave[0]-(lowerOctaveFor*8))+ index)] = keyName;

			key.inputEnabled = true;
			key.name = "key" + i;

			graphics.moveTo(position-1,0);
	  		graphics.lineTo(position-1,game.world.height-whiteKeyHeight);

			position += keyImgData.width;
			positionArray.push(position);
			key.body.immovable = true;
	  		
	  		index++;
		}
	}
	graphics.moveTo(position-1,0);
  	graphics.lineTo(position-1,game.world.height-whiteKeyHeight/2);

	notes = game.add.group();
	notes.enableBody = true;


  	cursors = game.input.keyboard.createCursorKeys(); 
  	this.game.input.keyboard.onPressCallback = function(e) {
		var indexOf = keysToPress.indexOf(e);
  		if (waitForKeys && indexOf != -1)   {
            keysToPress.splice(indexOf, 1);
            if (keysToPress.length < 1){
                game.paused = false;
                game.physics.arcade.isPaused = false;
                game.time.events.resume();
			}
  			notesToKill[indexOf].kill();
            notesToKill.splice(indexOf, 1);
  			points++;
  		} else if(waitForKeys && indexOf == -1){
  			points--;
		}
        pointsText.text = 'Točke: ' + points;
  		keyNumber = keyboardKeys.indexOf(e);

  		audio.play('Tone' + (keyNumber + getOctaveNumber(minMaxOctave[0]-(lowerOctaveFor*8))));

  	};

  	this.game.input.keyboard.onDownCallback = function(e){
  		keyToColor = keyboardKeys.indexOf(e.key);
  		keys.children[keyToColor].tint = 0xf10f2f;
  	};
  	
  	this.game.input.keyboard.onUpCallback = function(e){
  		keyToUncolor = keyboardKeys.indexOf(e.key);
  		keys.children[keyToUncolor].tint = 0xffffff;
  	};

    pointsText = game.add.text(game.world.width-120, 50, 'Točke: 0', { font: '24px menuFont', fill: '#fff' });

    audio = game.add.audio('audio');
    audio.allowMultiple = true;

    fromMarker = 0;
    for (i = 0; i<88; i++) {
    	audio.addMarker('Tone' + i, fromMarker, 1.9);
    	fromMarker += 2;
    }

    //read MIDI file
    MidiConvert.load("assets/aud/mario.mid", function(midi) {

		var midiChannels = levelData[level].midiChannels;
		var playEveryNthTone = levelData[level].playEveryNthTone;
		var startingTone = levelData[level].startingTone;
		for (var j = 0; j<midiChannels.length;j++){
			var channelIndex = midiChannels[j];
			if (channelIndex == -1) continue;
			midiNotes = midi.tracks[channelIndex].notes;
			tint = j== 0 ? 0xffff00 : 0xff00ff; //yellow : purple
			for (var i = startingTone; i<midiNotes.length;i=i+playEveryNthTone) {

                game.time.events.add(800* (midiNotes[i].time), function(midiNote, tint){

					if (!waitForKeys){
                        audio.play('Tone' + (midiNote.midi-(lowerOctaveFor*8)));
					}

					positionNum = positionArray[midiNote.midi - getOctaveNumber(minMaxOctave[0])] ;
                    var note = notes.create(positionNum, 0, sizeMidiMap[(midiNote.midi-(lowerOctaveFor*8))]);

					note.scale.setTo(1, 0.2);
					game.physics.arcade.enable(note);
					note.body.velocity.y = 150;
					note.body.collideWorldBounds = false;
					
					note.tint = tint;
					note.name = "note" + (midiNote.midi-(lowerOctaveFor*8)-getOctaveNumber(minMaxOctave[0]-(lowerOctaveFor*8)));
					note.events.onKilled.add(function(note){
						notes.remove(note)
					},this);

				}, this, midiNotes[i], tint);
			} //end for tones
		}//end for channels
   	});//end MidiConvert.load()
}//end create()

function getOctaveNumber(min){
	while(min>0){
		if (min%8==0) return min;
		min--;
	}
	return 0;
}

var notesToKill = [];
var pianoKeysToPress = [];
function update (){

	game.physics.arcade.collide(notes, keys,
		function(note, keys){

			if (waitForKeys){
				keysToPress.push(keyboardKeys[note.name.substring(4)]);
                pianoKeysToPress.push(parseInt(note.name.substring(4)) + 24);
				notesToKill.push(note);
				game.physics.arcade.isPaused = true;
				game.time.events.pause();
			} else {
				note.kill();
			}
		}, null, this);

    pointsText.text = 'Točke: ' + points;
}

function addMenuOption1(text, callback, xPosition) {
    var optionStyle = { font: '25pt menuFont', fill: 'white', align: 'right', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    var txt = game.add.text(game.world.width-xPosition, game.world.height-125, text, optionStyle);
    var onOver = function (target) {
        target.fill = "##E9E91A";
        target.stroke = "rgba(200,200,200,0.5)";
    };
    var onOut = function (target) {
        target.fill = "white";
        target.stroke = "rgba(0,0,0,0)";
    };
    txt.stroke = "rgba(0,0,0,0";
    txt.strokeThickness = 4;
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback);
    txt.events.onInputOver.add(onOver);
    txt.events.onInputOut.add(onOut);
}

function onsuccesscallback( access ) {
    access.inputs.values().next().value.onmidimessage = myMIDIMessagehandler;
}

function onerrorcallback( err ) {
    console.log(err);
}

function myMIDIMessagehandler(event){
    var data = event.data,
        note = data[1],
        velocity = data[2];
    if (velocity) {
        keyToColor = note-24;
        keys.children[keyToColor].tint = 0xf10f2f;
        var indexOf = pianoKeysToPress.indexOf(note);
        if (waitForKeys && indexOf != -1)   {
            pianoKeysToPress.splice(indexOf, 1);
            if (pianoKeysToPress.length < 1){
                game.paused = false;
                game.physics.arcade.isPaused = false;
                game.time.events.resume();
			}

            notesToKill[indexOf].kill();
            notesToKill.splice(indexOf, 1);
            points++;
        } else if(waitForKeys &&  indexOf == -1){
            points--;
        }
        pointsText.text = 'Točke: ' + points;
        audio.play('Tone' + note);
    }
    else{
        keyToUncolor = note-24;
        keys.children[keyToUncolor].tint = 0xffffff;
    }
}