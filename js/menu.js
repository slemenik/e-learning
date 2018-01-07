var menuState = { create: create, init:init, preload: preload};

function create() {

        // var nameLabel = game.add.text(80,80,'Menu', {font: '50px Arial', fill: '#ffffff'});
        // var startLabel = game.add.text(80, game.world.head-80, 'Test', {font: '50px Arial', fill: '#ffffff'});
        //
        // var key = game.input.keyboard.addKey(Phaser.Keyboard.W);
        // key.onDown.addOnce(function () {
        //     game.state.start('play');
        // }, this);


        var sprite = game.add.sprite(0, 0, 'menu-bg');
            sprite.scale.setTo(game.world.width,game.world.height);
            console.log(sprite);
        game.add.existing(this.titleText);


        // looks like we have to create a style for or menu option
       //  var optionStyle = { font: '30pt menuFont', fill: 'white', align: 'left' , strokeThickness: 4};
       //  // the text for start
       //  var txt = game.add.text(30, 280, 'Start', optionStyle);
       //  // so how do we make it clickable?  We have to use .inputEnabled!
       //  txt.inputEnabled = true;
       //  // Now every time we click on it, it says "You did it!" in the console!
       //  // txt.events.onInputUp.add(function () { console.log('You did it!') });
       // txt.events.onInputOver.add(function (target) {
       //      target.fill = "#E9E91A";
       //  });txt.events.onInputOut.add(function (target) {
       //      target.fill = "white";
       //  });

    addMenuOption('Začni', function (target) {
        game.state.start('play');
    });
    addMenuOption('Izberi stopnjo', function (target) {
        console.log('You clicked Options!');
    });
    addMenuOption('Navodila', function (target) {
        console.log('You clicked Credits!');
    });
}

function init() {
    // console.log(a,s,d,f);
    this.titleText = game.make.text(game.world.centerX, 100, "Učenje igranja klavirja", {
        font: 'bold 70pt menuFont',
        fill: '#FDFFB5',
        align: 'center'
    });
    // this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
}

function preload() {
    game.load.image('menu-bg', 'assets/img/main-menu-background.jpg');

}
var optionCount = 1;
function addMenuOption(text, callback) {
    var optionStyle = { font: '50pt menuFont', fill: 'white', align: 'right', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    console.log(game.world)
    var txt = game.add.text(game.world.width/2-100, (this.optionCount * 100) + 200, text, optionStyle);
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
    optionCount++;

}