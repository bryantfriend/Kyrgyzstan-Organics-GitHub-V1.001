// src/modules/orders.js
import { gameState } from '../gameState.js';

export function generateOrder(scene) {
    const breadCount = Phaser.Math.Between(1, 3);
    const cookieCount = Phaser.Math.Between(1, 3);

    gameState.currentOrder = {
        bread: breadCount,
        cookie: cookieCount
    };

    // ✅ Ensure `orderText` exists before setting text
    if (!scene.orderText) {
        scene.orderText = scene.add.text(scene.deliveryMan.x, scene.deliveryMan.y - 50, '', {
            fontSize: '20px',
            fill: '#fff',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: { x: 5, y: 2 }
        }).setOrigin(0.5);
    }

    scene.updateOrderText();
}


export function fulfillOrder(scene, itemType) {
    if (!gameState.currentOrder || !gameState.currentOrder[itemType]) return false;

    gameState.currentOrder[itemType]--;

    if (gameState.currentOrder[itemType] <= 0) {
        delete gameState.currentOrder[itemType];
    }

    scene.updateOrderText();

    // ✅ Check if all items are fulfilled
    if (Object.keys(gameState.currentOrder).length === 0) {
        gameState.playerGold += calculateGold(gameState.currentOrder);
        if (scene.uiManager) {
        scene.uiManager.updateGold(gameState.playerGold);
        }
        console.log("Order completed!");
        scene.tweens.add({
            targets: scene.deliveryMan,
            x: scene.sys.game.config.width + 100,
            duration: 1000,
            onComplete: () => {
                scene.deliveryMan.destroy();
                scene.spawnDeliveryMan();
            }
        });
    }
    return true;
}

function calculateGold(order) {
  // Example: 10 gold per bread, 15 per cookie
  return order.bread * 10 + order.cookies * 15;
}
