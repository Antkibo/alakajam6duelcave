/// <reference path='../dist/phaser.d.ts'/>

module Carrot {
    export class GameStart {
        static gameRef: Phaser.Game;

        public static RunGame() {
            const CONFIG = {
                width: 352,
                height: 208,
                parent: 'container',
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
