export default class BakedProduct extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene - The scene this product belongs to.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   * @param {string} type - The product type (e.g., 'cookie', 'bread', 'burnedCookie', 'burnedBread').
   */
  constructor(scene, x, y, type = 'cookie') {
    // Determine the correct texture key.
    // If the type includes 'burned', remove that part to get the base texture key.
    let textureKey = type.toLowerCase();
    if (textureKey.includes('burned')) {
      textureKey = textureKey.replace('burned', '');
    }
    super(scene, x, y, textureKey);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setInteractive();
    this.setDepth(5);

    // Save the full product type.
    this.itemType = type;
    
    // If the product is burned, tint it.
    if (type.toLowerCase().includes('burned')) {
      this.setTint(0x555555);
    }

    // Add this instance to our static tracking array.
    BakedProduct.allBakedProducts.push(this);
    this._destroyed = false; // Flag to ensure single destruction.
  }

  deliver() {
    this.destroy();
  }

  destroy(fromScene) {
    if (this._destroyed) return;  // Prevent double-destruction.
    this._destroyed = true;
    BakedProduct.allBakedProducts = BakedProduct.allBakedProducts.filter(product => product !== this);
    super.destroy(fromScene);
  }

  static clearAll() {
    while (BakedProduct.allBakedProducts.length) {
      BakedProduct.allBakedProducts[0].destroy();
    }
  }
}

// Static array to keep track of all baked products.
BakedProduct.allBakedProducts = [];
