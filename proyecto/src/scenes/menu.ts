module Carrot {
    export class Menu extends Phaser.Scene {
      private enter: Phaser.Input.Keyboard.Key;

      constructor() {
        super({ key: 'Menu'});
      }

      create(): void {
        // Create controls (Enter for now)
        this.enter = this.input.keyboard.addKey('ENTER');

        // Add some Text
        this.add.text(100, 50, 'Carrot Cave');
        this.add.text(100, 60, 'Press Enter');
      }

      update(): void {
        if (Phaser.Input.Keyboard.JustDown(this.enter)) {
          this.scene.start('Main');
        }
      }
    }
}
