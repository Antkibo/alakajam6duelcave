module Carrot {
    export class Main extends Phaser.Scene {
        private player: Player;
        private tortle: {
            body?: Phaser.Physics.Arcade.Sprite,
            isMoving?: boolean
        };
        private font: Phaser.Types.GameObjects.BitmapText.RetroFontConfig;
        private numbFont: Phaser.Types.GameObjects.BitmapText.RetroFontConfig;
        private carrot: Phaser.Physics.Arcade.StaticGroup;
        private audio: {
            theme?: any,
            lava?: any,
            win?: any,
            carrot?: any,
            jump?: any
        };
        private controls: {
            cursor?: Phaser.Types.Input.Keyboard.CursorKeys,
            a?: Phaser.Input.Keyboard.Key,
            d?: Phaser.Input.Keyboard.Key,
            enter?: Phaser.Input.Keyboard.Key
        };
        private map: any[];
        private tileset: any[];
        private level: any[];
        private respawn: {
            x?: number,
            y?: number
        };
        private carrotScore: any;
        private levelScore: any;
        private clock: any;
        private audioManager: AudioManager;

        constructor() {
            super({
                key: 'Main'
            })

            this.audio = {};
            this.controls = {};
            this.map = [];
            this.tileset = [];
            this.level = [];
            this.respawn = {};
            this.tortle = {};
        }

        create(): void {
            // Canvas center
            const center = {
                x: <number>this.cameras.main.width / 2,
                y: <number>this.cameras.main.height / 2
            }

            this.respawn = {
                x: 25,
                y: center.y * 2 - 10
            }

            

            // Initialize data
            // Carrots acquired
            if (!this.data.get('carrotScore')) {
                this.data.set('carrotScore', 0);
            }

            // Times player has done all levels
            if (!this.data.get('timesBeaten')) {
                this.data.set('timesBeaten', 1);
            }

            // Amount of live of player

            if (!this.data.get('livesCount')) {
                this.data.set('livesCount', 5);
            }

            // Levels done
            if (!this.data.get('levelScore')) {
                this.data.set('levelScore', 0);
            }
            // Music speed
            if (!this.data.get('rateSpeed')) {
                this.data.set('rateSpeed', 1.0);
            }
            // Tortle speed
            if (!this.data.get('tortleSpeed')) {
                this.data.set('tortleSpeed', 10);
            }

            if (!this.data.get('levelCounter')) {
                this.data.set('levelCounter', 1);
            }

            this.data.set('tempCarrotScore', 0);

            // Font
            this.font = this.cache.json.get('font_json');
            this.cache.bitmapFont.add('font', Phaser.GameObjects.RetroFont.Parse(this, this.font));

            this.numbFont = this.cache.json.get('numbers_json');
            this.cache.bitmapFont.add('numbers', Phaser.GameObjects.RetroFont.Parse(this, this.numbFont));

            // Controls
            this.controls.cursor = this.input.keyboard.createCursorKeys();
            this.controls.a = this.input.keyboard.addKey('A');
            this.controls.d = this.input.keyboard.addKey('D');
            this.controls.enter = this.input.keyboard.addKey('ENTER');

            // Maps
            this.map[0] = this.add.tilemap('level0');
            this.map[1] = this.add.tilemap('level1');
            this.map[2] = this.add.tilemap('level2');
            this.map[3] = this.add.tilemap('level3');
            this.map[4] = this.add.tilemap('level4');
            this.map[5] = this.add.tilemap('level5');
            this.map[6] = this.add.tilemap('level6');

            // Tilesets
            this.tileset[0] = this.map[0].addTilesetImage('tileset', 'caveTiles');
            this.tileset[1] = this.map[1].addTilesetImage('tileset', 'caveTiles');
            this.tileset[2] = this.map[2].addTilesetImage('tileset', 'caveTiles');
            this.tileset[3] = this.map[3].addTilesetImage('tileset', 'caveTiles');
            this.tileset[4] = this.map[4].addTilesetImage('tileset', 'caveTiles');
            this.tileset[5] = this.map[5].addTilesetImage('tileset', 'caveTiles');
            this.tileset[6] = this.map[6].addTilesetImage('tileset', 'caveTiles');

            // Carrots
            this.carrot = this.physics.add.staticGroup();
            this.anims.fromJSON(this.cache.json.get('carrot_anim'));

            // Audio Manager

            this.audioManager = new AudioManager(this.game, this);
            this.audioManager.getByName('theme').play('', {
                rate: this.data.get('rateSpeed')
            });

            // Background image
            this.add.image(center.x, center.y, 'background');

            // Tortle
            this.tortle.body = this.physics.add.sprite(20, 27, 'tortuga');
            this.anims.fromJSON(this.cache.json.get('tortuga_anim'));
            this.tortle.body.setGravityY(250);
            this.tortle.body.setDepth(0.1);
            this.tortle.body.anims.play('tort_idle', true);
            this.tortle.isMoving = false;

            // Character
            this.player = new Player(this, this.respawn.x, this.respawn.y, 'bugs');

            // Start Level

            

            if (this.data.get('levelCounter') <= this.map.length) {
                this.startLevel();
            } else {
                this.data.set('levelCounter', 1);
                this.data.set('timesBeaten', this.data.get('timesBeaten') * 2);
                this.sound.remove(this.audioManager.getByName('theme'));
                this.scene.start('WinScreen')
            }

            // Score

            const lives = this.add.group();

            for (let i = 0, posX = 250; i < this.data.get('livesCount'); i++, posX += 12) {
                let newObj = lives.create(posX, 8, 'live');
            }

            const carrot_text = this.add.image(112 - 2, 8, 'carrots');
            this.carrotScore = this.add.bitmapText(153, 2, 'numbers', 'CARROTS: ' + this.data.values.carrotScore);

            const level_text = this.add.image(232 - 8, 8, 'levels');
            this.levelScore = this.add.bitmapText(254, 2, 'numbers', 'LEVELS: ' + this.data.values.levelScore);

            let container = this.add.container(-50, 0, [
                carrot_text,
                level_text,
                this.carrotScore,
                this.levelScore,
            ]);





            // Events
            this.registry.events.once('beatLevel', () => {
                

                this.audioManager.pause('theme');
                this.data.set('rateSpeed', this.data.get('rateSpeed')+0.05);
                this.audioManager.getByName('winSound').play();
            });

            this.registry.events.once('tortLost', () => {
                this.audioManager.pause('theme');
                this.tortle.body.anims.play('tort_lose', true);
                this.tortle.body.anims.stopOnRepeat();
            })

            this.time.delayedCall(1500, () => {
                this.tortle.isMoving = true;
            }, [], this);
        }

        update(): void {
            // Animate according to Player's velocity
            this.player.unitAnimation();

            // Tortle movement
            if (this.tortle.isMoving) {
                if (this.tortle.body.x <= this.cameras.main.width - 20) {
                    this.tortle.body.setVelocityX(this.data.get('tortleSpeed'));
                    this.tortle.body.anims.play('tort_walk', true);
                } else {
                    this.tortle.body.setVelocityX(0);
                    this.tortle.body.anims.play('tort_idle', true);
                }
            }

            // Player controls
            if (Phaser.Input.Keyboard.JustDown(this.controls.enter)) {
                this.scene.get('Main').sound.pauseAll();
                this.scene.launch('Pause');
                this.scene.pause('Main');
            }

            if (Phaser.Input.Keyboard.JustUp(this.controls.cursor.space)) {
                this.player.properties.isFalling = true;
            }

            if (!this.player.properties.isDying && !this.player.properties.isWinning) {
                if (this.controls.cursor.left.isDown) {
                    this.player.startMovement('left');
                } else if (this.controls.cursor.right.isDown) {
                    this.player.startMovement('right');
                } else {
                    this.player.startMovement();
                }

                if (this.controls.cursor.space.isDown) {
                    if (this.controls.cursor.space.getDuration() >= 1500) {
                        this.player.startMovement('megaJump');
                    } else if (this.controls.cursor.space.getDuration() >= 500) {
                        this.player.startMovement('bigJump');
                    } else {
                        this.player.startMovement('jump');
                    }
                }
            }
        }

        private startLevel(): void {
            const level = this.data.get('levelCounter');
            switch (level) {
                case 1:
                    this.level[level - 1] = this.map[level - 1].createStaticLayer('Tiles', this.tileset[level - 1]);
                    this.level[level - 1].setCollisionByProperty({ collides: true });
                    // Carrot setup
                    this.carrot.create(184, 104, 'carrot');
                    this.carrot.playAnimation('float');


                    this.physics.add.collider(this.player, this.level[level - 1], this.isCeiling, null, this);
                    this.physics.add.overlap(this.player, this.carrot, this.gotCarrot, null, this);
                    this.physics.add.collider(this.tortle.body, this.level[level - 1]);
                    this.setSpecialTiles(level);
                    break;
                case 2:
                    this.level[level - 1] = this.map[level - 1].createStaticLayer('Tiles', this.tileset[level - 1]);
                    this.level[level - 1].setCollisionByProperty({ collides: true });

                    this.carrot.create(56, 137, 'carrot');
                    this.carrot.create(184, 83, 'carrot');
                    this.carrot.create(201, 132, 'carrot');
                    this.carrot.create(119, 178, 'carrot');
                    this.carrot.playAnimation('float');

                    this.physics.add.collider(this.player, this.level[level - 1], this.isCeiling, null, this);
                    this.physics.add.overlap(this.player, this.carrot, this.gotCarrot, null, this);
                    this.physics.add.collider(this.tortle.body, this.level[level - 1]);
                    this.setSpecialTiles(level);
                    break;
                case 3:
                    this.level[level - 1] = this.map[level - 1].createStaticLayer('Tiles', this.tileset[level - 1]);
                    this.level[level - 1].setCollisionByProperty({ collides: true });

                    this.carrot.create(6, 99, 'carrot');
                    this.carrot.create(182, 116, 'carrot');
                    this.carrot.create(345, 70, 'carrot');
                    this.carrot.create(262, 154, 'carrot');
                    this.carrot.playAnimation('float');

                    this.physics.add.collider(this.player, this.level[level - 1], this.isCeiling, null, this);
                    this.physics.add.overlap(this.player, this.carrot, this.gotCarrot, null, this);
                    this.physics.add.collider(this.tortle.body, this.level[level - 1]);
                    this.setSpecialTiles(level);
                    break;
                case 4:
                    this.level[level - 1] = this.map[level - 1].createStaticLayer('Tiles', this.tileset[level - 1]);
                    this.level[level - 1].setCollisionByProperty({ collides: true });

                    this.carrot.create(7, 78, 'carrot');
                    this.carrot.create(195, 79, 'carrot');
                    this.carrot.create(266, 98, 'carrot');
                    this.carrot.playAnimation('float');


                    this.physics.add.collider(this.player, this.level[level - 1], this.isCeiling, null, this);
                    this.physics.add.overlap(this.player, this.carrot, this.gotCarrot, null, this);
                    this.physics.add.collider(this.tortle.body, this.level[level - 1]);
                    this.setSpecialTiles(level);
                    break;
                case 5:
                    this.level[level - 1] = this.map[level - 1].createStaticLayer('Tiles', this.tileset[level - 1]);
                    this.level[level - 1].setCollisionByProperty({ collides: true });


                    this.carrot.create(24, 135, 'carrot');
                    this.carrot.create(105, 104, 'carrot');
                    this.carrot.create(184, 71, 'carrot');
                    this.carrot.playAnimation('float');

                    this.physics.add.collider(this.player, this.level[level - 1], this.isCeiling, null, this);
                    this.physics.add.overlap(this.player, this.carrot, this.gotCarrot, null, this);
                    this.physics.add.collider(this.tortle.body, this.level[level - 1]);
                    this.setSpecialTiles(level);
                    break;
                case 6:
                    this.level[level - 1] = this.map[level - 1].createStaticLayer('Tiles', this.tileset[level - 1]);
                    this.level[level - 1].setCollisionByProperty({ collides: true });

                    this.carrot.create(55, 110, 'carrot');
                    this.carrot.create(128, 108, 'carrot');
                    this.carrot.create(210, 103, 'carrot');
                    this.carrot.playAnimation('float');

                    this.physics.add.collider(this.player, this.level[level - 1], this.isCeiling, null, this);
                    this.physics.add.overlap(this.player, this.carrot, this.gotCarrot, null, this);
                    this.physics.add.collider(this.tortle.body, this.level[level - 1]);
                    this.setSpecialTiles(level);
                    break;
                case 7:
                    this.level[level - 1] = this.map[level - 1].createStaticLayer('Tiles', this.tileset[level - 1]);
                    this.level[level - 1].setCollisionByProperty({ collides: true });

                    this.carrot.create(117, 174, 'carrot');
                    this.carrot.create(183, 174, 'carrot');
                    this.carrot.create(177, 128, 'carrot');
                    this.carrot.create(80, 128, 'carrot');
                    this.carrot.create(152, 67, 'carrot');
                    this.carrot.create(247, 67, 'carrot');
                    this.carrot.playAnimation('float');

                    this.physics.add.collider(this.player, this.level[level - 1], this.isCeiling, null, this);
                    this.physics.add.overlap(this.player, this.carrot, this.gotCarrot, null, this);
                    this.physics.add.collider(this.tortle.body, this.level[level - 1]);
                    this.setSpecialTiles(level);
                    break;
            }

        }

        private restartScene(): void {
            this.sound.remove(this.audioManager.getByName('theme'));
            this.scene.restart();
        }

        private setSpecialTiles(level: number): void {
            switch (level) {
                case 1:
                    // Lava Callback
                    this.level[level - 1].tilemap.setTileLocationCallback(5, 12, 2, 1, this.fallOnLava, this);
                    // Win Callback
                    this.level[level - 1].tilemap.setTileLocationCallback(21, 11, 1, 1, this.winLevel, this);
                    // Lose Callback
                    this.level[level - 1].tilemap.setTileLocationCallback(21, 1, 1, 1, this.loseLevel, this);
                    break;
                case 2:
                    // Lava Callback
                    this.level[level - 1].tilemap.setTileLocationCallback(8, 6, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(12, 6, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(16, 6, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(19, 5, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(11, 9, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(19, 9, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(11, 12, 3, 1, this.fallOnLava, this);
                    // Win Callback
                    this.level[level - 1].tilemap.setTileLocationCallback(21, 11, 1, 1, this.winLevel, this);
                    // Lose Callback
                    this.level[level - 1].tilemap.setTileLocationCallback(21, 1, 1, 1, this.loseLevel, this);
                    break;
                case 3:
                    this.level[level - 1].tilemap.setTileLocationCallback(2, 5, 3, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(9, 9, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(12, 8, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(15, 7, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(18, 7, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(19, 8, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(20, 9, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(7, 12, 2, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(10, 12, 3, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(14, 12, 5, 1, this.fallOnLava, this);
                    // Win Callback
                    this.level[level - 1].tilemap.setTileLocationCallback(21, 11, 1, 1, this.winLevel, this);
                    // Lose Callback
                    this.level[level - 1].tilemap.setTileLocationCallback(21, 1, 1, 1, this.loseLevel, this);
                    break;
                case 4:
                    this.level[level - 1].tilemap.setTileLocationCallback(0, 8, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(2, 6, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(5, 7, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(6, 6, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(10, 7, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(10, 10, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(14, 10, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(18, 10, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(18, 6, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(4, 12, 2, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(7, 12, 3, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(11, 12, 3, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(15, 12, 3, 1, this.fallOnLava, this);
                    // Win Callback
                    this.level[level - 1].tilemap.setTileLocationCallback(21, 11, 1, 1, this.winLevel, this);
                    // Lose Callback
                    this.level[level - 1].tilemap.setTileLocationCallback(21, 1, 1, 1, this.loseLevel, this);
                    break;
                case 5:
                    this.level[level - 1].tilemap.setTileLocationCallback(0, 9, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(3, 7, 3, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(8, 5, 3, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(6, 12, 2, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(10, 10, 2, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(13, 9, 3, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(17, 11, 3, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(19, 7, 3, 1, this.fallOnLava, this);
                    // Win Callback
                    this.level[level - 1].tilemap.setTileLocationCallback(21, 11, 1, 1, this.winLevel, this);
                    // Lose Callback
                    this.level[level - 1].tilemap.setTileLocationCallback(21, 1, 1, 1, this.loseLevel, this);
                    break;
                case 6:
                    this.level[level - 1].tilemap.setTileLocationCallback(2, 12, 3, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(5, 9, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(6, 12, 4, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(10, 8, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(11, 12, 4, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(15, 7, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(16, 9, 2, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(18, 11, 1, 1, this.fallOnLava, this);
                    // Win Callback
                    this.level[level - 1].tilemap.setTileLocationCallback(21, 11, 1, 1, this.winLevel, this);
                    // Lose Callback
                    this.level[level - 1].tilemap.setTileLocationCallback(21, 1, 1, 1, this.loseLevel, this);
                    break;
                case 7:
                    this.level[level - 1].tilemap.setTileLocationCallback(3, 9, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(6, 9, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(9, 9, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(12, 9, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(5, 12, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(9, 12, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(13, 12, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(4, 6, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(6, 6, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(8, 6, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(10, 6, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(12, 6, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(14, 6, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(16, 6, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(21, 5, 1, 1, this.fallOnLava, this);
                    this.level[level - 1].tilemap.setTileLocationCallback(20, 9, 1, 1, this.fallOnLava, this);
                    // Win Callback
                    this.level[level - 1].tilemap.setTileLocationCallback(21, 11, 1, 1, this.winLevel, this);
                    // Lose Callback
                    this.level[level - 1].tilemap.setTileLocationCallback(21, 1, 1, 1, this.loseLevel, this);
                    break;
                default:
                    break;
            }
        }

        private fallOnLava() {
            this.player.properties.isFalling = false;
            this.player.properties.isDying = true;
            this.player.disableBody();
            this.audioManager.getByName('lava').play();

            this.time.delayedCall(1000, () => {
                this.controls.cursor.space.isDown = false;
                this.player.enableBody(true, this.respawn.x, this.respawn.y, true, true);
                this.player.properties.isDying = false;
            }, [], this);
        }

        private winLevel() {
            this.player.properties.isWinning = true;
            this.tortle.body.setVelocityX(0);
            this.tortle.isMoving = false;

            this.player.setGravityY(500);
            this.player.setVelocityX(0);
            
            

            this.registry.events.emit('tortLost');

            this.time.delayedCall(300, () => {
                this.registry.events.emit('beatLevel');
            }, [], this);

            this.time.delayedCall(2000, () => {
                if (this.data.get('livesCount') < 5) {
                    const lives = this.data.get('livesCount') + 1;
                    console.log(lives);
                    this.data.set('livesCount', lives);
                }

                this.data.values.levelCounter++;
                this.data.values.levelScore++;
                this.data.values.carrotScore += this.data.values.tempCarrotScore;
                this.data.values.tortleSpeed += 2.5;
                this.audioManager.pause('theme');
                this.restartScene();
            }, [], this);

        }

        private gotCarrot(element1: undefined, element2) {
            element2.destroy();
            this.data.values.tempCarrotScore += 1 * this.data.get('timesBeaten');
            this.carrotScore.setText('CARROTS: ' + (this.data.values.carrotScore + this.data.values.tempCarrotScore));
            this.audioManager.getByName('power').play();

            this.tortle.body.anims.play('tort_hit', true);

            if (this.tortle.isMoving) {
                this.data.set('slow', 3000);
                this.tortle.isMoving = false;
                this.tortle.body.setVelocityX(this.tortle.body.body.velocity.x * 0.35);
                this.clock = this.time.delayedCall(this.data.values.slow, () => {
                    this.tortle.isMoving = true;
                }, [], this);
            } else {
                this.data.values.slow = 3000 + (this.data.values.slow - this.clock.getElapsed());
                this.time.removeAllEvents();
                this.time.delayedCall(this.data.values.slow, () => {
                    this.tortle.isMoving = true;
                }, [], this);
            }
        }

        private loseLevel() {
            this.cameras.main.shake(100, 0.005);
            this.scene.get('Main').sound.stopAll();
            this.audioManager.getByName('lava').play();
            this.player.properties.isWinning = true;
            this.player.setVelocityX(0);
            this.tortle.body.setVelocityX(0);
            this.tortle.body.anims.play('tort_idle', true);
            this.tortle.isMoving = false;

            


            this.player.anims.play('idle', true);
            this.time.delayedCall(1000, () => {
                const lives = (this.data.get('livesCount')) - 1;
                console.log(lives);
                this.data.set('livesCount', lives);

                if (this.data.get('livesCount') == 0) {
                    this.data.set('carrotScore', 0);
                    this.data.set('levelCounter', 1);
                    this.data.set('levelScore', 0);
                    this.data.set('timesBeaten', 1);
                    this.data.set('rateSpeed', 1.0);
                    this.data.set('tortleSpeed', 10);
                    this.scene.start('GameOver');
                } else {
                    this.restartScene();
                }
            }, [], this);
        }

        private isCeiling() {
            if (this.player.body.blocked.up) {
                this.controls.cursor.space.isDown = false;
                this.player.properties.isFalling = true;
            }

            if (this.player.body.blocked.down && this.player.properties.isFalling) {
                this.player.properties.isFalling = false;
            }
        }
    }
}
