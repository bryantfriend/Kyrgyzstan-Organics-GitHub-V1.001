// src/entities/Flour.js
export default class Flour extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'flour');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setInteractive();
    this.setDepth(5);

    this.itemType = 'flour';
  }
}
