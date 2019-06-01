export default class Boot extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot' });
    }

    preload() {
        // Load Assets
        this.load.image('player', '../assets/player.png');

        // Progress Bar and Progress Box
        // Progress Box will be a Static Rectangle
        // Progress Bar will fill according to Load Progress
        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();

        // Green Color from Hex Code
        const green = Phaser.Display.Color.HexStringToColor('#32CD32').color;

        // Loading Text with a Counter for Periods
        this.loadingText = this.add.text(this.cameras.main.width/2 - 50, 
            this.cameras.main.height/2, 'Loading');
        this.loadingText.count = 0;

        // Add Periods to Loading while Booting
        this.time.addEvent({
            delay: 300,                            
            callback: () => {
                // Control Counter
                this.loadingText.count++;
                // Keep adding Periods until 3
                // Then Clear and Start Again
                if (this.loadingText.count > 3) {
                    this.loadingText.setText('Loading');
                    this.loadingText.count = 0;
                } else {
                    this.loadingText.setText('Loading' + '.'.repeat(this.loadingText.count));
                }
            },
            loop: true
        })

        // Progress Box Filling
        this.progressBox.fillStyle(green, 0.5);
        this.progressBox.fillRect(10, this.cameras.main.height/2 + 50, this.cameras.main.width - 20, 
            this.cameras.main.height/2 - 100);

        // Progress Check and Progress Bar Filling
        this.load.on('progress', (value) => {
            this.progressBar.clear();
            this.progressBar.fillStyle(green, 1);
            this.progressBar.fillRect(12, this.cameras.main.height/2 + 52, 
                (this.cameras.main.width - 24) * value, this.cameras.main.height/2 - 104);
        });

        // When Complete start Main
        this.load.on('complete', () => {
            this.scene.start('Main');
        });
    }
}