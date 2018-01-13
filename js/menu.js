var menuState = { create: create, init:init, preload: preload};

function init() {
    game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
}

function preload() {
    game.load.image('menu-bg', 'assets/img/main-menu-background.jpg');
}

function create() {

    var backgroundSprite = game.add.sprite(0, 0, 'menu-bg');
    backgroundSprite.scale.setTo(game.world.width,game.world.height);

    var titleText = game.add.text(game.world.centerX, 100, "Učenje igranja klavirja", {
        font: 'bold 70pt menuFont',
        fill: '#FDFFB5',
        align: 'center'
    });
    titleText.anchor.set(0.5);

    var instructionsString =
        "Naučite se igrati klavirja s pomočjo klasične melodije Super Mario!\n\n" +
        "Igra ima pet stopenj, vsaka pa je težja od prejšnje. Na začetku se igra\n" +
        "le z desno roko, nato samo z levo, za konec pa se obe roke združita v\n" +
        "isti melodiji. Za večjo motivacijo so ob strani zapisane točke, ki jih\n" +
        "dobiš ob pravilnem pritisku na tipko in izgubiš, ko pritisneš na napačno.\n\n" +
        "Za boljšo izkušnjo vklopi USB MIDI Keyboard in odpri igrico v Google Chromu.";
    var instructionsText = game.add.text(game.world.centerX, 400, instructionsString, {
        font: '25pt menuFont',
        fill: 'white',
        align: 'center',
        stroke: 'rgba(0,0,0,0)',
        strokeThickness: 4
    });
    instructionsText.anchor.set(0.5);

    var startText = game.add.text(game.world.centerX, 650, "Začni", {
        font: '50pt menuFont',
        fill: 'white',
        align: 'center',
        stroke: 'rgba(0,0,0,0)',
        strokeThickness: 4
    });
    startText.events.onInputUp.add(function () {
        game.state.start('play', true, false, 0);
    });
    startText.events.onInputOver.add(function (target) {
        target.fill = "##E9E91A";
        target.stroke = "rgba(200,200,200,0.5)";
    });
    startText.events.onInputOut.add(function (target) {
        target.fill = "white";
        target.stroke = "rgba(0,0,0,0)";
    });
    startText.inputEnabled = true;
    startText.anchor.set(0.5);
}