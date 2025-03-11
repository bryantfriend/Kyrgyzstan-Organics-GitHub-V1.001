// src/gui/inventory/InventoryUI.js
export default class InventoryUI extends Phaser.GameObjects.Container {
    constructor(scene, x, y, items = []) {
        super(scene, x, y);
        this.items = items;
        // Create a semi-transparent background rectangle
        this.background = scene.add.rectangle(0, 0, 300, 400, 0x000000, 0.7)
            .setOrigin(0, 0);
        this.add(this.background);
        this.itemTexts = [];
        this.renderItems();
        scene.add.existing(this);
    }
    
    renderItems() {
        // Remove any previous text objects
        this.itemTexts.forEach(text => text.destroy());
        this.itemTexts = [];
        // Display each inventory item
        const startY = 10;
        this.items.forEach((item, index) => {
            let itemText = this.scene.add.text(10, startY + index * 30, item, { fontSize: '20px', fill: '#ffffff' });
            this.add(itemText);
            this.itemTexts.push(itemText);
        });
    }
    
    addItem(item) {
        this.items.push(item);
        this.renderItems();
    }
    
    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
            this.renderItems();
        }
    }
}
