// src/gui/hud/LabelBox.js
export default class LabelBox extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, style = {}) {
        const defaultStyle = {
            fontSize: '20px',
            fill: '#ffffff',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: { x: 10, y: 10 }
        };
        super(scene, x, y, text, { ...defaultStyle, ...style });
        scene.add.existing(this);
    }
}
