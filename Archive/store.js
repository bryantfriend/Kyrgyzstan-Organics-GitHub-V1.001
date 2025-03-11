import { gameState } from './main.js';

export function openStore() {
    // Display store UI
    const storeText = this.add.text(400, 10, 'Store', { fontSize: '32px', fill: '#fff' });
    const buyOvenButton = this.add.text(400, 50, 'Buy Oven (50 Gold)', { fontSize: '24px', fill: '#fff' }).setInteractive();
    const buyMixerButton = this.add.text(400, 100, 'Buy Mixer (30 Gold)', { fontSize: '24px', fill: '#fff' }).setInteractive();

    buyOvenButton.on('pointerdown', () => {
        if (playerGold >= 50) {
            playerGold -= 50;
            ovens++;
            this.add.sprite(300, 400 + (ovens - 1) * 100, 'oven');
        }
    });

    buyMixerButton.on('pointerdown', () => {
        if (playerGold >= 30) {
            playerGold -= 30;
            mixers++;
            this.add.sprite(100, 400 + (mixers - 1) * 100, 'mixer');
        }
    });
}