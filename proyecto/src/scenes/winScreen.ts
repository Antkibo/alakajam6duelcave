module Carrot {
  export class WinScreen extends Phaser.Scene {
    private enter: Phaser.Input.Keyboard.Key;
    private font: any;

    constructor() {
      super({
        key: 'WinScreen'
      });
    }

    create(): void {
      this.enter = this.input.keyboard.addKey('ENTER');

      // Fonts
      this.font = this.cache.json.get('font_json');
      this.cache.bitmapFont.add('font', Phaser.GameObjects.RetroFont.Parse(this, this.font));

      // Add Some text
      this.add.bitmapText(this.cameras.main.width/2 - 50, this.cameras.main.height/2, 'font', "You Win! You Rock!".toUpperCase());
      this.add.bitmapText(this.cameras.main.width/2 - 50, this.cameras.main.height/2 + 20, 'font', "Press Start to Continue".toUpperCase());
    }

    update(): void {
      if (Phaser.Input.Keyboard.JustDown(this.enter)) {
        this.scene.start('Main');
      }
    }
  }
}
