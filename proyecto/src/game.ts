/// <reference path='../dist/phaser.d.ts'/>

module Carrot {
    export class GameStart {
        static gameRef: Phaser.Game;

        public static RunGame() {
            const CONFIG = {
                scale: {
                    mode: Phaser.Scale.FIT,
                    parent: 'container',
                    autoCenter: Phaser.Scale.CENTER_BOTH,
                    width: 352,
                    height: 208
                },
                pixelArt: true,
                physics: {
                    default: 'arcade',
                    arcade: {
                        //debug: true
                    }
                },
                zoom: 3,
                title: 'Carrot Cave',
                type: Phaser.AUTO,
                scene: <any> [
                    PreBoot, Boot, MainMenu, Main, Pause, WinScreen, GameOver
                ]
            }
            this.gameRef = new Phaser.Game(CONFIG);
        }
    }
}

window.onload = () => {
    Carrot.GameStart.RunGame();
};
