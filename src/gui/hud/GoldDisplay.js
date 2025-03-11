// src/gui/hud/GoldDisplay.js
export default class GoldDisplay extends Phaser.GameObjects.Text {
    constructor(scene, x, y, initialGold = 0, style = {}) {
        const defaultStyle = {
            fontSize: '24px',
            fill: '#ffff00'
        };
        super(scene, x, y, `Gold: ${initialGold}`, { ...defaultStyle, ...style });
        this.gold = initialGold;
        scene.add.existing(this);
    }
    
    updateGold(amount) {
        this.gold = amount;
        this.setText(`Gold: ${this.gold}`);
    }
    
    addGold(amount) {
        this.updateGold(this.gold + amount);
    }
    
    subtractGold(amount) {
        this.updateGold(this.gold - amount);
    }
}
