// src/gui/hud/BakeryDisplay.js
export default class BakeryDisplay extends Phaser.GameObjects.Text {
    constructor(scene, x, y, initialState = false, style = {}) {
        const defaultStyle = {
            fontSize: '24px',
            fill: '#ffffff'
        };
        super(scene, x, y, `Bakery: ${initialState ? 'Open' : 'Closed'}`, { ...defaultStyle, ...style });
        this.state = initialState;
        scene.add.existing(this);
    }

    updateState(isOpen) {
        this.state = isOpen;
        this.setText(`Bakery: ${this.state ? 'Open' : 'Closed'}`);
    }
}
