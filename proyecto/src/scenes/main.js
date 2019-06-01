import Player from '../gameObjects/player.js';

export default class Main extends Phaser.Scene {
    constructor() {
        super({ key: 'Main' });
    }

    create() {
        // Player and Camera
        this.player = new Player(this, 10, this.cameras.main.height - 10, 'player');
        // Controls
        this.controlConfig = this.input.keyboard.createCursorKeys();
        // Separator
        this.separator = this.add.graphics();
        this.separator.fillStyle(Phaser.Display.Color.ValueToColor(255), 0.8);
        this.separator.fillRect(0, 50, this.cameras.main.width, 10);

        this.cameras.main.setBounds(0, 0, 352, 208);


        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1.5);
    }

    update() {
        // Player Movement
        this.player.playerMovement();

        // Left or Right Movement
        if (this.controlConfig.left.isDown) {
            this.player.playerMovement('left');
        } else if(this.controlConfig.right.isDown) {
            this.player.playerMovement('right');
        }

        // Character Jump
        // Phaser.Input.Keyboard.JustDown(this.controlConfig.space)
        if (this.controlConfig.space.isDown) {
            if (this.controlConfig.space.getDuration() >= 1000) {
                this.player.playerMovement('megaJump');
            }
            else if (this.controlConfig.space.getDuration() >= 150) {
                this.player.playerMovement('bigJump');
            } else {
                console.log(this.player.body.acceleration);
                this.player.playerMovement('jump');
                console.log(this.player.body.acceleration);
            }
        }

        if (Phaser.Input.Keyboard.JustUp(this.controlConfig.space)) {
            console.log(this.player.body.acceleration);
            this.player.body.acceleration.y /= 100;
            console.log(this.player.body.acceleration);
        }
    }
}