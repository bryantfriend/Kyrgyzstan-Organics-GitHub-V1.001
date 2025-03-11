// main.js
import BakingScene from './scenes/BakingScene.js';
import MainMenu from './scenes/MainMenu.js';
import CreditsScene from './scenes/CreditsScene.js';
import GameUI from './scenes/GameUI.js';

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 720
    },
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: [MainMenu, BakingScene, CreditsScene, GameUI],
};

const game = new Phaser.Game(config);