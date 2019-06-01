import Boot from './scenes/bootstrap.js';
import Main from './scenes/main.js';

new Phaser.Game({
    width: 352,
    height: 208,
    parent: 'container',
    backgroundColor: 0x333333,
    pixelArt: true,
    physics: { default: 'arcade', 
        arcade: { gravity: 100, debug: true }
    },
    scene: [Boot, Main]
});