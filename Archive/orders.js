import { gameState } from './main.js';

export function generateOrder() {
    const breadCount = Phaser.Math.Between(1, 3);
    const cookieCount = Phaser.Math.Between(1, 3);
    gameState.currentOrder = { bread: breadCount, cookies: cookieCount }; 
    
    // Display the order
    this.add.text(10, 100, `Order: ${breadCount} Bread, ${cookieCount} Cookies`, { fontSize: '24px', fill: '#fff' });
}

export function fulfillOrder() {
    if (gameState.currentOrder) {
        gameState.playerGold += calculateGold(gameState.currentOrder);
        this.add.text(10, 50, `Gold: ${gameState.playerGold}`, { fontSize: '24px', fill: '#fff' }).setData('gold', gameState.playerGold);
        generateOrder.call(this);
    }
}
