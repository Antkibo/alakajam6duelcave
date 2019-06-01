export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, type)

        // Add to Scene
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        this.body.setGravityY(250);
        // Body Properties
        this.walkSpeed = 70;
        this.jumpSpeed = -80;
    }

    // Function to be Called at Scene Update
    playerMovement(direction = undefined) {
        switch(direction) {
            case 'left':
                this.body.setVelocityX(-this.walkSpeed);
                this.flipX = true;
                break;
            case 'right': 
                this.body.setVelocityX(this.walkSpeed);
                this.flipX = false;
                break;
            case 'jump':
                if (this.body.velocity.y == 0) {
                    this.body.setAccelerationY(-100);
                    this.body.setVelocityY(this.jumpSpeed);
                } 
                break;
            case 'bigJump':
                if (this.body.velocity.y == 0) {
                    this.body.setAccelerationY(-100);
                    this.body.setVelocityY(this.jumpSpeed * 1.5);
                } 
                break;
            case 'megaJump':
                if (this.body.velocity.y == 0) {
                    this.body.setAccelerationY(-100);
                    this.body.setVelocityY(this.jumpSpeed * 2.0);
                } 
                break;
            case undefined:
                this.body.setVelocityX(0);
                break;
            default:
                break;
        }
    }
}