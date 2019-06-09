module Carrot {
    export class Player extends Phaser.Physics.Arcade.Sprite {
        public properties: {
            animConfig:     Phaser.Types.Animations.JSONAnimation,
            walkSpeed:      number,
            jumpSpeed:      number,
            isDying:        boolean,
            isFalling:      boolean,
            isWinning:      boolean,
        }
        constructor(scene: Phaser.Scene, x: number, y: number, type: string) {
            super(scene, x, y, type);
            this.properties = {
                animConfig: scene.cache.json.get('bugs_anim'),
                walkSpeed:  70,
                jumpSpeed:  -80,
                isDying:    false,                   
                isFalling:  false,
                isWinning:  false,
            };
            this.startPhysics(); 
        }

        private startPhysics(): void {
            this.scene.add.existing(this);   
            this.scene.physics.world.enable(this);
            this.scene.anims.fromJSON(this.properties.animConfig);
            this.setCollideWorldBounds(true);
            this.setGravityY(250);
            this.body.width = this.body.width * 0.5;
            this.setOffset(2.5, 0);
            this.setDepth(0.1);      
        }

        public startMovement(direction?: string): void {
            if (!this.properties.isDying) {
                switch(direction) {
                    case 'left':
                        this.setVelocityX(-this.properties.walkSpeed);

                        break;
                    case 'right':
                        this.setVelocityX(this.properties.walkSpeed);
                    
                        break;
                    case 'jump':
                        if (this.body.velocity.y == 0) {
                            this.setAccelerationY(-100);
                            this.setVelocityY(this.properties.jumpSpeed);
                        } 
                        break;
                    case 'bigJump':
                        if (this.body.velocity.y == 0) {
                            this.setAccelerationY(-100);
                            this.setVelocityY(this.properties.jumpSpeed * 1.3);
                        } 
                        break;
                    case 'megaJump': 
                        if (this.body.velocity.y == 0) {
                            this.setAccelerationY(-100);
                            this.setVelocityY(this.properties.jumpSpeed * 1.6);
                        } 
                        break;
                    default:
                        this.setVelocityX(0);
                        break;
                }
            }
        }

        protected getUnitVector(): {x: number, y: number} {
            const modulus = Math.sqrt(
                this.body.velocity.x ** 2 +
                this.body.velocity.y ** 2
            );

            const unit = {
                x: this.body.velocity.x / modulus,
                y: this.body.velocity.y / modulus
            };

            return unit;
        }

        public unitAnimation(): void {
            const unit = this.getUnitVector();

            if (this.properties.isWinning) {
                this.anims.play('idle', true);
            } else if (this.properties.isFalling) {
                this.anims.pause(this.anims.currentAnim.frames[3]);
                this.setAccelerationY(0);
                if (unit.x < 0) {
                    this.flipX = true;
                } else if (unit.x > 0) {
                    this.flipX = false;
                }
            } else if (!this.properties.isDying) {
                if (unit.y) {
                    this.anims.play('jump', true);
                } else if (!unit.x) {
                    this.anims.play('idle', true);
                }

                if (unit.x < 0 && unit.y === 0) {
                    this.anims.play('run', true);
                    this.flipX = true;
                } else if (unit.x < 0) {
                    this.flipX = true;
                }

                if (unit.x > 0 && unit.y === 0) {
                    this.anims.play('run', true);
                    this.flipX = false;
                } else if (unit.x > 0) {
                    this.flipX = false;
                }
            } else {
                this.anims.play('death', true);
            }
            
        }

    }
}