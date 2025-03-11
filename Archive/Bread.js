export default class Bread extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type = 'bread') {
    super(scene, x, y, 'bread');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setInteractive();
    this.setDepth(5);
    this.itemType = type;
    if (type === 'burnedBread') {
      this.setTint(0x555555);
    }
    Bread.allBreads.push(this);
    this._destroyed = false; // flag to ensure single destruction
  }

  deliver() {
    this.destroy();
  }

  destroy(fromScene) {
    if (this._destroyed) return;  // prevent double-destruction
    this._destroyed = true;
    Bread.allBreads = Bread.allBreads.filter(b => b !== this);
    super.destroy(fromScene);
  }

  static clearAll() {
    while (Bread.allBreads.length) {
      Bread.allBreads[0].destroy();
    }
  }
}

Bread.allBreads = [];
