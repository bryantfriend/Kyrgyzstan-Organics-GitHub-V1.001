// src/gui/menus/MainMenuUI.js
export default class MainMenuUI extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);

        const width = scene.scale.width;
        const height = scene.scale.height;

        // Add the logo
        const logo = scene.add.image(width / 2.5, height / 9, 'logo')
            .setOrigin(0.5)
            .setScale(0.8)
            .setDepth(2);
        this.add(logo);

        // Add start button
        const startButton = scene.add.image(width / 2.75, height * 4.9 / 6, 'startButton')
            .setOrigin(0.5)
            .setScale(0.4)
            .setInteractive()
            .setDepth(2);
        startButton.on('pointerdown', () => {
            // Stop music and start BakingScene
            if (scene.menuMusic) {
                scene.menuMusic.stop();
            }
            scene.scene.start('BakingScene');
        });
        this.add(startButton);

        // Add credits button
        const creditsButton = scene.add.image(width / 1.5, height * 4.9 / 6, 'creditsButton')
            .setOrigin(0.5)
            .setScale(0.4)
            .setInteractive()
            .setDepth(2);
        creditsButton.on('pointerdown', () => scene.scene.start('CreditsScene'));
        this.add(creditsButton);

        // Finally, add this container to the scene
        scene.add.existing(this);
    }
}
