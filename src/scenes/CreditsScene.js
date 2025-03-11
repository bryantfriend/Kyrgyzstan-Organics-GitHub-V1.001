
class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreditsScene' });
    }

    create() {
        // Add your credits text/images here
        const creditsText = this.add.text(game.config.width / 2, game.config.height / 2, 'Credits:\nDevelopers: ...\nArtists: ...', {
          fontFamily: 'Arial',
          fontSize: 32,
          color: '#ffffff',
          align: 'center'
        });
        creditsText.setOrigin(0.5);

        // Add a button to go back to the main menu
        const backButton = this.add.text(game.config.width / 2, game.config.height * 3 / 4, 'Back to Menu', {
          fontFamily: 'Arial',
          fontSize: 24,
          color: '#ffffff',
          backgroundColor: '#000000', // Example background color
          padding: { x: 10, y: 5 } // Example padding
        });
        backButton.setInteractive();
        backButton.on('pointerdown', () => {
          this.scene.start('MainMenu');
        });
        backButton.setOrigin(0.5);
    }
}

export default CreditsScene;