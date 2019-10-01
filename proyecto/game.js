/// <reference path='../dist/phaser.d.ts'/>
var Carrot;
(function (Carrot) {
    class GameStart {
        static RunGame() {
            const CONFIG = {
                width: 352,
                height: 208,
                parent: 'container',
                pixelArt: true,
                physics: {
                    default: 'arcade',
                    arcade: {
                    //debug: true
                    }
                },
                zoom: 3,
                title: 'Carrot Cave',
                type: Phaser.AUTO,
                scene: [
                    Carrot.PreBoot, Carrot.Boot, Carrot.MainMenu, Carrot.Main, Carrot.Pause, Carrot.WinScreen, Carrot.GameOver
                ]
            };
            this.gameRef = new Phaser.Game(CONFIG);
        }
    }
    Carrot.GameStart = GameStart;
})(Carrot || (Carrot = {}));
window.onload = () => {
    Carrot.GameStart.RunGame();
};
var Carrot;
(function (Carrot) {
    class Player extends Phaser.Physics.Arcade.Sprite {
        constructor(scene, x, y, type) {
            super(scene, x, y, type);
            this.properties = {
                animConfig: scene.cache.json.get('bugs_anim'),
                walkSpeed: 70,
                jumpSpeed: -80,
                isDying: false,
                isFalling: false,
                isWinning: false,
            };
            this.startPhysics();
        }
        startPhysics() {
            this.scene.add.existing(this);
            this.scene.physics.world.enable(this);
            this.scene.anims.fromJSON(this.properties.animConfig);
            this.setCollideWorldBounds(true);
            this.setGravityY(250);
            this.body.width = this.body.width * 0.5;
            this.setOffset(2.5, 0);
            this.setDepth(0.1);
        }
        startMovement(direction) {
            if (!this.properties.isDying) {
                switch (direction) {
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
        getUnitVector() {
            const modulus = Math.sqrt(Math.pow(this.body.velocity.x, 2) +
                Math.pow(this.body.velocity.y, 2));
            const unit = {
                x: this.body.velocity.x / modulus,
                y: this.body.velocity.y / modulus
            };
            return unit;
        }
        unitAnimation() {
            const unit = this.getUnitVector();
            if (this.properties.isWinning) {
                this.anims.play('idle', true);
            }
            else if (this.properties.isFalling) {
                this.anims.pause(this.anims.currentAnim.frames[3]);
                this.setAccelerationY(0);
                if (unit.x < 0) {
                    this.flipX = true;
                }
                else if (unit.x > 0) {
                    this.flipX = false;
                }
            }
            else if (!this.properties.isDying) {
                if (unit.y) {
                    this.anims.play('jump', true);
                }
                else if (!unit.x) {
                    this.anims.play('idle', true);
                }
                if (unit.x < 0 && unit.y === 0) {
                    this.anims.play('run', true);
                    this.flipX = true;
                }
                else if (unit.x < 0) {
                    this.flipX = true;
                }
                if (unit.x > 0 && unit.y === 0) {
                    this.anims.play('run', true);
                    this.flipX = false;
                }
                else if (unit.x > 0) {
                    this.flipX = false;
                }
            }
            else {
                this.anims.play('death', true);
            }
        }
    }
    Carrot.Player = Player;
})(Carrot || (Carrot = {}));
var Carrot;
(function (Carrot) {
    class Boot extends Phaser.Scene {
        constructor() {
            super({
                key: 'Boot'
            });
        }
        preload() {
            /////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////
            this.load.setPath('./assets/');
            // Sprites
            // Player
            this.load.json('bugs_anim', 'bugs_anim.json');
            this.load.atlas('bugs', 'bugs.png', 'bugs_atlas.json');
            // Turtle
            this.load.json('tortuga_anim', 'tortuga_anim.json');
            this.load.atlas('tortuga', 'tortuga.png', 'tortuga_atlas.json');
            // PowerUp
            this.load.json('carrot_anim', 'carrot_anim.json');
            this.load.atlas('carrot', 'carrot.png', 'carrot_atlas.json');
            // Background
            this.load.image('background', 'background.png');
            // Bitmap
            this.load.json('font_json', 'font.json');
            this.load.image('font', 'font.png');
            this.load.json('numbers_json', 'numbers.json');
            this.load.image('numbers', 'numbers.png');
            // Start menu and end
            this.load.image('title_img', 'title_img.png');
            this.load.json('title_anim', 'title_anim.json');
            this.load.atlas('title', 'title.png', 'title_atlas.json');
            // Loading, endgame, level counter and carrots counter
            this.load.image('levels', 'levels.png');
            this.load.image('carrots', 'carrots.png');
            this.load.image('endgame', 'endgame.png');
            // Player lives
            this.load.image('live', 'live.png');
            // Game over screen
            this.load.image('gameOver', 'gameover352-208.png');
            // Instructions
            this.load.json('instructions_anim', 'instructions_anim.json');
            this.load.atlas('instructions', 'instructions.png', 'instructions_atlas.json');
            // Audio
            this.load.audio('theme', 'audio/platformer.ogg');
            this.load.audio('jumpSound', 'audio/jump.ogg');
            this.load.audio('lava', 'audio/lava.ogg');
            this.load.audio('power', 'audio/power.ogg');
            this.load.audio('winSound', 'audio/win.ogg');
            this.load.audio('menu', 'audio/menu.ogg');
            // Maps
            this.load.image('caveTiles', 'tileset.png');
            for (let i = 0; i <= 6; i++) {
                this.load.tilemapTiledJSON(`level${i}`, `maps/level${i}.json`);
            }
            /////////////////////////////////////////////////////////////
            //////////////////////LOADING SCREEN/////////////////////////
            //////////////////////LOADING SCREEN/////////////////////////
            /////////////////////////////////////////////////////////////
            // Set color
            this.orange = Phaser.Display.Color.HexStringToColor('#FF6347');
            // Progress Box will be the outer rectangle
            this.progressBox = this.add.graphics();
            // Progress Bar will be the inner rectangle
            this.progressBar = this.add.graphics();
            // Canvas center
            const center = {
                x: this.cameras.main.width / 2,
                y: this.cameras.main.height / 2
            };
            // Fill Progress Box as a rectangle
            this.progressBox.fillStyle(this.orange.color, 0.5);
            this.progressBox.fillRect(10, center.y + 30, center.x * 2 - 20, center.y - 80);
            // Add Loading text
            // loadCount tracks number of periods added after Loading
            this.loadText = this.add.text(this.cameras.main.width / 2 + 70, this.cameras.main.height / 2, ' ');
            this.loadCount = 0;
            // Add three periods to Loading, reset, and loop
            const timeConfig = {
                delay: 300,
                callback: () => {
                    this.loadCount++;
                    if (this.loadCount > 3) {
                        this.loadText.setText(' ');
                        this.loadCount = 0;
                    }
                    else {
                        this.loadText.setText(' ' + '.'.repeat(this.loadCount));
                    }
                },
                loop: true
            };
            this.time.addEvent(timeConfig);
            // Change Progress Bar width accordingly
            this.load.on('progress', (value) => {
                this.progressBar.fillStyle(this.orange.color, 1);
                this.progressBar.fillRect(12, center.y + 32, (center.x * 2 - 24) * value, center.y - 84);
            });
            /////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////
            // Start Main after loading
            this.load.on('complete', () => {
                this.scene.stop('PreBoot');
                this.scene.start('MainMenu');
            });
        }
    }
    Carrot.Boot = Boot;
})(Carrot || (Carrot = {}));
var Carrot;
(function (Carrot) {
    class GameOver extends Phaser.Scene {
        constructor() {
            super({
                key: 'GameOver'
            });
        }
        create() {
            // Create controls (Enter for now)
            this.enter = this.input.keyboard.addKey('ENTER');
            // Game Over Screen
            this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'gameOver');
        }
        update() {
            if (Phaser.Input.Keyboard.JustDown(this.enter)) {
                this.scene.start('MainMenu');
            }
        }
    }
    Carrot.GameOver = GameOver;
})(Carrot || (Carrot = {}));
var Carrot;
(function (Carrot) {
    class Main extends Phaser.Scene {
        constructor() {
            super({
                key: 'Main'
            });
            this.audio = {};
            this.controls = {};
            this.map = [];
            this.tileset = [];
            this.level = [];
            this.respawn = {};
            this.tortle = {};
        }
        create() {
            // Canvas center
            const center = {
                x: this.cameras.main.width / 2,
                y: this.cameras.main.height / 2
            };
            this.respawn = {
                x: 25,
                y: center.y * 2 - 10
            };
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
            this.audioManager = new Carrot.AudioManager(this.game, this);
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
            this.player = new Carrot.Player(this, this.respawn.x, this.respawn.y, 'bugs');
            // Start Level
            if (this.data.get('levelCounter') <= this.map.length) {
                this.startLevel();
            }
            else {
                this.data.set('levelCounter', 1);
                this.data.set('timesBeaten', this.data.get('timesBeaten') * 2);
                this.sound.remove(this.audioManager.getByName('theme'));
                this.scene.start('WinScreen');
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
                this.data.set('rateSpeed', this.data.get('rateSpeed') + 0.05);
                this.audioManager.getByName('winSound').play();
            });
            this.registry.events.once('tortLost', () => {
                this.audioManager.pause('theme');
                this.tortle.body.anims.play('tort_lose', true);
                this.tortle.body.anims.stopOnRepeat();
            });
            this.time.delayedCall(1500, () => {
                this.tortle.isMoving = true;
            }, [], this);
        }
        update() {
            // Animate according to Player's velocity
            this.player.unitAnimation();
            // Tortle movement
            if (this.tortle.isMoving) {
                if (this.tortle.body.x <= this.cameras.main.width - 20) {
                    this.tortle.body.setVelocityX(this.data.get('tortleSpeed'));
                    this.tortle.body.anims.play('tort_walk', true);
                }
                else {
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
                }
                else if (this.controls.cursor.right.isDown) {
                    this.player.startMovement('right');
                }
                else {
                    this.player.startMovement();
                }
                if (this.controls.cursor.space.isDown) {
                    if (this.controls.cursor.space.getDuration() >= 1500) {
                        this.player.startMovement('megaJump');
                    }
                    else if (this.controls.cursor.space.getDuration() >= 500) {
                        this.player.startMovement('bigJump');
                    }
                    else {
                        this.player.startMovement('jump');
                    }
                }
            }
        }
        startLevel() {
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
        restartScene() {
            this.sound.remove(this.audioManager.getByName('theme'));
            this.scene.restart();
        }
        setSpecialTiles(level) {
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
        fallOnLava() {
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
        winLevel() {
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
        gotCarrot(element1, element2) {
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
            }
            else {
                this.data.values.slow = 3000 + (this.data.values.slow - this.clock.getElapsed());
                this.time.removeAllEvents();
                this.time.delayedCall(this.data.values.slow, () => {
                    this.tortle.isMoving = true;
                }, [], this);
            }
        }
        loseLevel() {
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
                this.data.set('livesCount', lives);
                if (this.data.get('livesCount') == 0) {
                    this.data.set('carrotScore', 0);
                    this.data.set('levelCounter', 1);
                    this.data.set('levelScore', 0);
                    this.data.set('timesBeaten', 1);
                    this.data.set('rateSpeed', 1.0);
                    this.data.set('tortleSpeed', 10);
                    this.scene.start('GameOver');
                }
                else {
                    this.restartScene();
                }
            }, [], this);
        }
        isCeiling() {
            if (this.player.body.blocked.up) {
                this.controls.cursor.space.isDown = false;
                this.player.properties.isFalling = true;
            }
            if (this.player.body.blocked.down && this.player.properties.isFalling) {
                this.player.properties.isFalling = false;
            }
        }
    }
    Carrot.Main = Main;
})(Carrot || (Carrot = {}));
var Carrot;
(function (Carrot) {
    class MainMenu extends Phaser.Scene {
        constructor() {
            super({
                key: 'MainMenu'
            });
        }
        create() {
            // Create controls (Enter for now)
            this.enter = this.input.keyboard.addKey('ENTER');
            const music = this.sound.add('menu', { volume: 0.3, loop: true });
            music.play();
            this.counter = 1;
            // Add some Text
            const title_img = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'title_img');
            const title = this.add.sprite(200, 80, 'title');
            this.anims.fromJSON(this.cache.json.get('title_anim'));
            title.anims.play('blink');
            this.events.once('instruct', () => {
                title_img.destroy();
                title.destroy();
                const intruct = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'instructions');
                this.anims.fromJSON(this.cache.json.get('instructions_anim'));
                intruct.anims.play('move');
            });
            this.events.once('start', () => {
                music.destroy();
            });
        }
        update() {
            if (Phaser.Input.Keyboard.JustDown(this.enter)) {
                if (this.counter == 1) {
                    this.counter++;
                    this.events.emit('instruct');
                }
                else {
                    this.events.emit('start');
                    this.scene.start('Main');
                }
            }
        }
    }
    Carrot.MainMenu = MainMenu;
})(Carrot || (Carrot = {}));
var Carrot;
(function (Carrot) {
    class Pause extends Phaser.Scene {
        constructor() {
            super({
                key: 'Pause'
            });
        }
        create() {
            this.enter = this.input.keyboard.addKey('ENTER');
        }
        update() {
            if (Phaser.Input.Keyboard.JustDown(this.enter)) {
                if (this.scene.isPaused('Main')) {
                    this.scene.get('Main').sound.resumeAll();
                    this.scene.resume('Main');
                }
            }
        }
    }
    Carrot.Pause = Pause;
})(Carrot || (Carrot = {}));
var Carrot;
(function (Carrot) {
    class PreBoot extends Phaser.Scene {
        constructor() {
            super({
                key: 'PreBoot'
            });
        }
        preload() {
            this.load.setPath('./assets/');
            this.load.image('logo', 'logo-transparant.png');
            this.load.image('loading', 'loading.png');
        }
        create() {
            this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 60, 'logo');
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'loading');
            this.scene.launch('Boot');
        }
    }
    Carrot.PreBoot = PreBoot;
})(Carrot || (Carrot = {}));
var Carrot;
(function (Carrot) {
    class WinScreen extends Phaser.Scene {
        constructor() {
            super({
                key: 'WinScreen'
            });
        }
        create() {
            this.enter = this.input.keyboard.addKey('ENTER');
            // Fonts
            // this.font = this.cache.json.get('font_json');
            // this.cache.bitmapFont.add('font', Phaser.GameObjects.RetroFont.Parse(this, this.font));
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'endgame');
            // // Add Some text
            // this.add.bitmapText(this.cameras.main.width/2 - 50, this.cameras.main.height/2, 'font', "You Win! You Rock!".toUpperCase());
            // this.add.bitmapText(this.cameras.main.width/2 - 50, this.cameras.main.height/2 + 20, 'font', "Press Start to Continue".toUpperCase());
        }
        update() {
            if (Phaser.Input.Keyboard.JustDown(this.enter)) {
                this.scene.start('Main');
            }
        }
    }
    Carrot.WinScreen = WinScreen;
})(Carrot || (Carrot = {}));
const config = [{
        name: "jumpSound",
        configuration: {
            volume: 0.5,
            loop: false
        }
    },
    {
        name: "theme",
        configuration: {
            volume: 0.5,
            loop: true
        }
    },
    {
        name: "power",
        configuration: {
            volume: 0.3 * 0.5,
            loop: false
        }
    },
    {
        name: "lava",
        configuration: {
            volume: 0.3 * 0.5,
            loop: false
        }
    },
    {
        name: "winSound",
        configuration: {
            volume: 0.5 * 0.5,
            loop: false
        }
    }
];
var Carrot;
(function (Carrot) {
    class AudioManager extends Phaser.Sound.BaseSoundManager {
        constructor(game, scene) {
            super(game);
            this.scene = scene;
            this.audio = [];
            this.addSound();
            this.scene.sound.pauseOnBlur = false;
        }
        addSound() {
            config.forEach((element, index) => {
                this.audio[index] = this.scene.sound.add(element.name, element.configuration);
            });
        }
        getByName(name) {
            let audioForSearch = this.audio.find((element) => element.key == name);
            return audioForSearch;
        }
        pause(name) {
            let audioForSearch = this.audio.find((element) => element.key == name);
            audioForSearch.stop();
        }
    }
    Carrot.AudioManager = AudioManager;
})(Carrot || (Carrot = {}));
//# sourceMappingURL=game.js.map