var menuState = {

    create: function () {

        var nameLabel = game.add.text(80,80,'Menu', {font: '50px Arial', fill: '#ffffff'});
        var startLabel = game.add.text(80, game.world.head-80, 'Test', {font: '50px Arial', fill: '#ffffff'});

        var key = game.input.keyboard.addKey(Phaser.Keyboard.W);
        key.onDown.addOnce(function () {
            game.state.start('play');
        }, this);
    }
}