module Carrot {
    export class MainMenu extends Phaser.Scene {
      private enter: Phaser.Input.Keyboard.Key;
      private counter: number;

      constructor() {
        super({
          key: 'MainMenu'
        });
      }

      create(): void {
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

      update(): void {
        if (Phaser.Input.Keyboard.JustDown(this.enter)) {
          if (this.counter == 1) {
            this.counter++;
            this.events.emit('instruct');
          } else {
            this.events.emit('start');
            this.scene.start('Main');
          }
          
          
        } 
      }
    }
}
