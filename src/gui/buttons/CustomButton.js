// src/gui/buttons/CustomButton.js
export default class CustomButton extends Phaser.GameObjects.Text {
    constructor(scene, x, y, label, callback, style = {}) {
        // Default style for the button text
        const defaultStyle = {
            fontSize: '32px',
            fill: '#ffffff',
            backgroundColor: '#000000'
        };
        super(scene, x, y, label, { ...defaultStyle, ...style });
        this.callback = callback;
        this.setPadding(10, 5, 10, 5);
        // Enable interactivity and define pointer events
        this.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.callback())
            .on('pointerover', () => this.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => this.setStyle({ fill: defaultStyle.fill }));
        scene.add.existing(this);
    }
}
