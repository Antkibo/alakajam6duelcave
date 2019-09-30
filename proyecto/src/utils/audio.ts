interface Audio {
  name: string;
  configuration: Phaser.Types.Sound.SoundConfig;
}

const config: Array<Audio> = [{
    name: "jumpSound",
    configuration: {
      volume: 0.5,
      loop: false
    }
  },
  {
    name: "theme",
    configuration: {
      volume: 0.5,
      loop: true
    }
  },
  {
    name: "power",
    configuration: {
      volume: 0.3 * 0.5,
      loop: false
    }
  },
  {
    name: "lava",
    configuration: {
      volume: 0.3 * 0.5,
      loop: false
    }
  },
  {
    name: "winSound",
    configuration: {
      volume: 0.5 * 0.5,
      loop: false
    }
  }
];

module Carrot {
  export class AudioManager extends Phaser.Sound.BaseSoundManager {
    private scene: Phaser.Scene;
    private audio: Array<any>;

    constructor(game: Phaser.Game, scene: Phaser.Scene) {
      super(game);
      this.scene = scene;
      this.audio = [];
      this.addSound();
      this.scene.sound.pauseOnBlur = false;
    }
  
    private addSound(): void {
      config.forEach((element, index) => {
        this.audio[index] = this.scene.sound.add(element.name, element.configuration);
      });
    }

    public getByName(name: string): Phaser.Sound.WebAudioSound {
      let audioForSearch = this.audio.find( (element) => element.key == name);

      return audioForSearch;
    }

    public pause(name: string): void {
      let audioForSearch = this.audio.find( (element) => element.key == name);
      audioForSearch.stop();
    }
  }
}
