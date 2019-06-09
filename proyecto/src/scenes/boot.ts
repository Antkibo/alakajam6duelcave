module Carrot {
    export class Boot extends Phaser.Scene {
        private orange:      Phaser.Display.Color;
        private loadText:    Phaser.GameObjects.Text;
        private loadCount:   number;
        private progressBar: Phaser.GameObjects.Graphics;
        private progressBox: Phaser.GameObjects.Graphics;

        constructor() {
            super({
                key: 'Boot'
            });
        }

        preload(): void {
            
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
            // Audio
                this.load.audio('theme', 'audio/platformer.ogg');
                this.load.audio('jumpSound', 'audio/jump.ogg');
                this.load.audio('lava', 'audio/lava.ogg');
                this.load.audio('power', 'audio/power.ogg');
                this.load.audio('winSound', 'audio/win.ogg');
            // Maps
                this.load.image('caveTiles', 'tileset.png');
                this.load.tilemapTiledJSON('level0', 'maps/level0.json');
                this.load.tilemapTiledJSON('level1', 'maps/level1.json');
                this.load.tilemapTiledJSON('level2', 'maps/level2.json');
                this.load.tilemapTiledJSON('level3', 'maps/level3.json');
                this.load.tilemapTiledJSON('level4', 'maps/level4.json');
                this.load.tilemapTiledJSON('level5', 'maps/level5.json');
                this.load.tilemapTiledJSON('level6', 'maps/level6.json');

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
                x: <number> this.cameras.main.width / 2,
                y: <number> this.cameras.main.height / 2
            }

            // Fill Progress Box as a rectangle
            this.progressBox.fillStyle(this.orange.color, 0.5);
            this.progressBox.fillRect(10, center.y + 30, center.x * 2 - 20, center.y - 80);

            // Add Loading text
            this.loadText = this.add.text(center.x - 50, center.y, 'Loading');
            // loadCount tracks number of periods added after Loading
            this.loadCount = 0;

            // Add three periods to Loading, reset, and loop
            const timeConfig: Phaser.Types.Time.TimerEventConfig = {
                delay: 300,
                callback: () => {
                    this.loadCount++;
                    if (this.loadCount > 3) {
                        this.loadText.setText('Loading');
                        this.loadCount = 0;
                    } else {
                        this.loadText.setText('Loading' + '.'.repeat(this.loadCount));
                    }
                },
                loop: true
            };

            this.time.addEvent(timeConfig);

            // Change Progress Bar width accordingly
            this.load.on('progress', (value: number) => {
                this.progressBar.fillStyle(this.orange.color, 1);
                this.progressBar.fillRect(12, center.y + 32, (center.x * 2 - 24) * value, center.y - 84);
            });

            /////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////

            // Start Main after loading
            this.load.on('complete', () => {
                this.scene.start('Main')
            })
        }
    }
}