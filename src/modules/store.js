// src/modules/store.js
import { gameState } from '../gameState.js';

export function openStore(scene) {
  // Display store UI elements
  const storeText = scene.add.text(400, 10, 'Store', { fontSize: '32px', fill: '#fff' });
  const buyOvenButton = scene.add.text(400, 50, 'Buy Oven (50 Gold)', { fontSize: '24px', fill: '#fff' }).setInteractive();
  const buyMixerButton = scene.add.text(400, 100, 'Buy Mixer (30 Gold)', { fontSize: '24px', fill: '#fff' }).setInteractive();

  buyOvenButton.on('pointerdown', () => {
    if (gameState.playerGold >= 50) {
      gameState.playerGold -= 50;
      gameState.ovens++;
      // Add a new oven sprite (using an appropriate texture and position)
      scene.add.sprite(300, 400 + (gameState.ovens - 1) * 100, 'oven_off_down');
      console.log('Oven purchased!');
    }
  });

  buyMixerButton.on('pointerdown', () => {
    if (gameState.playerGold >= 30) {
      gameState.playerGold -= 30;
      gameState.mixers++;
      scene.add.sprite(100, 400 + (gameState.mixers - 1) * 100, 'mixer');
      console.log('Mixer purchased!');
    }
  });
}
