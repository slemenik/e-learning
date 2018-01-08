var menuState = { create: create, init:init, preload: preload};

function create() {

    var sprite = game.add.sprite(0, 0, 'menu-bg');
    sprite.scale.setTo(game.world.width,game.world.height);
    game.add.existing(this.titleText);

    addMenuOption('Začni', function (target) {
        game.state.start('play', true, false, 0);
    });
    addMenuOption('Izberi stopnjo', function (target) {
    });
    addMenuOption('Navodila', function (target) {
    });
}

function init() {
    game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    // this.scale.pageAlignHorizontally = false;
    // this.scale.pageAlignVertically = false;
    this.titleText = game.make.text(game.world.centerX, 100, "Učenje igranja klavirja", {
        font: 'bold 70pt menuFont',
        fill: '#FDFFB5',
        align: 'center'
    });
    this.titleText.anchor.set(0.5);
    game.state.start('play', true, false, 0);//temp
}

function preload() {
    game.load.image('menu-bg', 'assets/img/main-menu-background.jpg');
}

var optionCount = 1;
function addMenuOption(text, callback) {
    var optionStyle = { font: '50pt menuFont', fill: 'white', align: 'right', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
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