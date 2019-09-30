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
                x: <number> this.cameras.main.width / 2,
                y: <number> this.cameras.main.height / 2
            }

            // Fill Progress Box as a rectangle
            this.progressBox.fillStyle(this.orange.color, 0.5);
            this.progressBox.fillRect(10, center.y + 30, center.x * 2 - 20, center.y - 80);

            // Add Loading text
            // loadCount tracks number of periods added after Loading
            this.loadText = this.add.text(this.cameras.main.width / 2 + 70, this.cameras.main.height / 2, ' ');
            this.loadCount = 0;

            // Add three periods to Loading, reset, and loop
            const timeConfig: Phaser.Types.Time.TimerEventConfig = {
                delay: 300,
                callback: () => {
                    this.loadCount++;
                    if (this.loadCount > 3) {
                        this.loadText.setText(' ');
                        this.loadCount = 0;
                    } else {
                        this.loadText.setText(' ' + '.'.repeat(this.loadCount));
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
                this.scene.stop('PreBoot');
                this.scene.start('MainMenu');
            })
        }
    }
}
