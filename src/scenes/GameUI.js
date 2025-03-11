// src/scenes/GameUI.js
import UIManager from '../gui/UIManager.js';
import CustomButton from '../gui/buttons/CustomButton.js';

export default class GameUI extends Phaser.Scene {
    constructor() {
        // Setting active: true will auto-launch this scene so that it's always on top
        super({ key: 'GameUI'});
    }

    preload() {
        // Load any UI-specific assets if needed.
    }

    create() {
        // Create your UI Manager that adds HUD elements such as a gold display and inventory panel.
        this.uiManager = new UIManager(this);
        
        // This creates the UI for the state of the bakery, whether it's open or closed
        this.scene.get('BakingScene').events.on('bakeryStateChanged', (isOpen) => {
        this.uiManager.updateBakeryState(isOpen);
        });

        // Optionally add buttons for UI actions
        new CustomButton(this, 100, 100, 'Toggle Inventory', () => {
            this.uiManager.toggleInventory();
        });
        new CustomButton(this, 100, 200, 'Back to Menu', () => {
            // For example, stop the game scene and go back to MainMenu
            this.scene.stop('BakingScene');
            this.scene.stop('GameUI');
            this.scene.start('MainMenu');
        });

        // Ensure this scene is on top of the other scenes
        this.scene.bringToTop();
    }

    update(time, delta) {
        // Update HUD elements if necessary.
        // For example, if you use a global gameState to track gold,
        // you might update your gold display here:
        // this.uiManager.updateGold(gameState.playerGold);
    }
}
