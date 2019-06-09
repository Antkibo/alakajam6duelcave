module Carrot {
    export class Pause extends Phaser.Scene {
        private enter: Phaser.Input.Keyboard.Key;

        constructor() {
            super({
                key: 'Pause'
            });
        }

        create(): void {
            this.enter = this.input.keyboard.addKey('ENTER');
        }

        update(): void {
            if (Phaser.Input.Keyboard.JustDown(this.enter)) {
                if (this.scene.isPaused('Main')) {
                    this.scene.get('Main').sound.resumeAll();
                    this.scene.resume('Main');
                }
            }
        }
    }
}