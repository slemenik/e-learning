var game = new Phaser.Game(1300, 800, Phaser.AUTO, 'canvas');

game.state.add('play', playState);
game.state.add('menu', menuState);
game.state.start('menu');