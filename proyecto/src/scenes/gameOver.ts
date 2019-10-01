module Carrot {
  export class GameOver extends Phaser.Scene {
    private enter: Phaser.Input.Keyboard.Key;

    constructor() {
      super({
        key: 'GameOver'
      });
    }

    create(): void {
      // Create controls (Enter for now)
      this.enter = this.input.keyboard.addKey('ENTER');

      // Game Over Screen
      this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'gameOver');  
    }

    update(): void {
      if (Phaser.Input.Keyboard.JustDown(this.enter)) {
        this.scene.start('MainMenu');
      } 
    }
  }
}