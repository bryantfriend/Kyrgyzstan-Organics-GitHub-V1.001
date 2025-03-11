// src/entities/Sugar.js
export default class Flour extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'sugar');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setInteractive();
    this.setDepth(5);

    this.itemType = 'sugar';
  }
}
