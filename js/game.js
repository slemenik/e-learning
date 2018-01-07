var game = new Phaser.Game(1300, 800, Phaser.AUTO, 'canvas');

game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.start('menu');