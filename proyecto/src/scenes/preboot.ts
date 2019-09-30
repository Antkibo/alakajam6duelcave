module Carrot {
  export class PreBoot extends Phaser.Scene {
    constructor() {
      super({
        key: 'PreBoot'
      });
    }

    preload(): void {
      this.load.setPath('./assets/');

      this.load.image('loading', 'loading.png');
    }

    create(): void {
      this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2,'loading');

      this.scene.launch('Boot');
    }
  }
}