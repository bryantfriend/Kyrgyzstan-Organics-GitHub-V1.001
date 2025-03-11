export default class Cookie extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type = 'Cookie') {
    super(scene, x, y, 'Cookie');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setInteractive();
    this.setDepth(5);
    this.itemType = type;
    if (type === 'burnedCookie') {
      this.setTint(0x555555);
    }
    Cookie.allCookies.push(this);
    this._destroyed = false; // flag to ensure single destruction
  }

  deliver() {
    this.destroy();
  }

  destroy(fromScene) {
    if (this._destroyed) return;  // prevent double-destruction
    this._destroyed = true;
    Cookie.allCookies = Cookie.allCookies.filter(b => b !== this);
    super.destroy(fromScene);
  }

  static clearAll() {
    while (Cookie.allCookies.length) {
      Cookie.allCookies[0].destroy();
    }
  }
}

Cookie.allCookies = [];
