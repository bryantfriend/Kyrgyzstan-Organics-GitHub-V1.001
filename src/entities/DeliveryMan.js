// src/entities/DeliveryMan.js
export default class DeliveryMan extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'delivery_man');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setInteractive();
    this.setDepth(5);

    this.itemType = 'deliveryMan';
  }

  leave(callback) {
    // Animate the delivery man leaving the screen.
    this.scene.tweens.add({
      targets: this,
      x: this.scene.sys.game.config.width + 100,
      duration: 1000,
      onComplete: () => {
        this.destroy();
        if (callback) callback();
      }
    });
  }
}
