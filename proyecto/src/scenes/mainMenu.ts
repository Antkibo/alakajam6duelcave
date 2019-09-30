module Carrot {
    export class MainMenu extends Phaser.Scene {
      private enter: Phaser.Input.Keyboard.Key;

      constructor() {
        super({
          key: 'MainMenu'
        });
      }

      create(): void {
        // Create controls (Enter for now)
        this.enter = this.input.keyboard.addKey('ENTER');

        // Add some Text
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'title_img');
        const title = this.add.sprite(200, 80, 'title');
        this.anims.fromJSON(this.cache.json.get('title_anim'));
        title.anims.play('blink');
      }

      update(): void {
        if (Phaser.Input.Keyboard.JustDown(this.enter)) {
          this.scene.start('Main');
        }
      }
    }
}
