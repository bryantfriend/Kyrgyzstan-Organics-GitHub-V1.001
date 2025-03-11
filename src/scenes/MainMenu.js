// src/scenes/MainMenu.js
import MainMenuUI from '../gui/menus/MainMenuUI.js';

class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('startButton', 'assets/startButton.png');
        this.load.image('creditsButton', 'assets/creditsButton.png');
        this.load.audio('menuMusic', 'assets/menu_music.mp3');
        this.load.image('logo', 'assets/logo.png');
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Add background image (resized to fit)
        this.add.image(0, 0, 'background')
            .setOrigin(0, 0)
            .setDisplaySize(width, height)
            .setDepth(0);

        // Add background music
        this.menuMusic = this.sound.add('menuMusic', { loop: true, volume: 0.5 });
        this.menuMusic.play();

        // Create the MainMenu UI overlay from our new module
        new MainMenuUI(this, 0, 0);
    }
}

export default MainMenu;
