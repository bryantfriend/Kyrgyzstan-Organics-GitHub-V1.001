// src/gui/UIManager.js
import GoldDisplay from './hud/GoldDisplay.js';
import BakeryDisplay from './hud/BakeryDisplay.js';
import InventoryUI from './inventory/InventoryUI.js';
import LabelBox from './hud/LabelBox.js';

export default class UIManager {
    constructor(scene) {
        this.scene = scene;
        // Initialize HUD elements
        this.goldDisplay = new GoldDisplay(scene, 10, 10, 100); // Starting with 100 gold
        this.bakeryDisplay = new BakeryDisplay(scene, 10, 40, false); // false means closed by default
        
        // Initialize Inventory UI (hidden by default)
        this.inventoryUI = new InventoryUI(scene, scene.cameras.main.width - 310, 10, []);
        this.inventoryUI.setVisible(false);
        
        // Create a Label Box for Controls near the bottom of the screen.
        const controlsText = 
            "Controls:\n" +
            "Arrow Keys to move\n" +
            "E to pick up / Insert\n" +
            "F to interact with a machine\n" +
            "B to open and close the bakery";
            
        // Position the label box 10 pixels from the left and near the bottom.
        this.labelBox = new LabelBox(scene, 10, scene.cameras.main.height - 120, controlsText);
    }
    
    toggleInventory() {
        this.inventoryUI.setVisible(!this.inventoryUI.visible);
    }
    
    updateGold(amount) {
        this.goldDisplay.updateGold(amount);
    }
    
    updateBakeryState(isOpen) {
        this.bakeryDisplay.updateState(isOpen);
    }
    
    addInventoryItem(item) {
        this.inventoryUI.addItem(item);
    }
    
    removeInventoryItem(item) {
        this.inventoryUI.removeItem(item);
    }
}
