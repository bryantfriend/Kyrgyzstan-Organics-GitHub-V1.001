// src/entities/Oven.js
import { findRecipe } from '../modules/recipes.js';

export default class Oven extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'oven_spritesheet', 1);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setInteractive();
    this.setDepth(5);
    this.setScale(0.5);
    this.setImmovable(true);

    // Oven properties
    this.itemType = 'oven';
    this.isFixed = true;
    this.isOn = false;
    this.isOpen = false;
    // currentItem holds the type of dough inserted or the completed product name once baking finishes.
    this.currentItem = null;
    this.isBaking = false;
    this.bakingStartTime = 0;
    this.bakingDuration = 3000;
    this.bakingProgressBar = null;
    // We'll use "productSprite" to generically refer to the baked product.
    this.productSprite = null;

    // Burn timer properties
    this.burnStartTime = 0;
    this.burnDuration = 30000;
    this.burnProgressBar = null;
    this.burnTimerActive = false;

    this.currentRotation = "bottom_right";

    // Listen for pickup events: if the baked product is picked up, clear oven reference.
    this.scene.events.on('itempickedup', (item) => {
      if (item === this.productSprite) {
        this.productSprite = null;
        this.currentItem = null;
        console.log("Baked product removed from oven due to pickup.");
      }
    });
  }

  clearOven() {
    this.currentItem = null;
    if (this.productSprite) {
      const prod = this.productSprite;
      this.productSprite = null;
      prod.removeAllListeners('destroy');
      if (prod.active) {
        if (this.scene.itemManager) {
          this.scene.itemManager.removeItem(prod);
        } else {
          prod.destroy();
        }
      }
    }
    this.isOn = false;
    console.log("Oven cleared and ready for new dough.");
  }

  togglePower() {
    if (!this.isFixed) {
      console.log("Cannot toggle power while oven is held.");
      return;
    }
    this.isOn = !this.isOn;
    this.play(this.isOn ? 'oven_closed_on' : 'oven_closed_off');
    console.log(`Oven power toggled: ${this.isOn ? "ON" : "OFF"}`);
  }

  toggleDoor(currentTime, progressBarFactory) {
    if (!this.isFixed) {
      console.log("Cannot toggle door while oven is held.");
      return;
    }
    // Toggle door state.
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.play('oven_open');
      
      switch (this.currentItem) {
        case null:
          console.log("Oven door opened; no item inside.");
          break;
        case 'dough': // Still cooking
          console.log("Oven door opened; cooking item inside.");
          break;
        default:
          // Finished product case.
          console.log("Oven door opened; finished product inside.");
          if (!this.productSprite) {
            // Use createBakedProduct() from the item manager.
            if (this.scene.itemManager && this.scene.itemManager.createBakedProduct) {
              this.productSprite = this.scene.itemManager.createBakedProduct(this.x, this.y, this.currentItem);
            } else {
              // Fallback: manually create a baked product using Bread.
              this.productSprite = new Bread(this.scene, this.x, this.y, this.currentItem);
              console.log("Manually created Bread");
            }
            if (this.scene.pickableItemsGroup) {
              this.scene.pickableItemsGroup.add(this.productSprite);
            }
            console.log("Baked product sprite created inside the oven.");
            this.productSprite.once('destroy', () => {
              this.clearOven();
            });
          } else {
            this.productSprite.setVisible(true);
          }
          break;
      }
    } else {
      // Door closing logic.
      if (this.currentItem === null) {
        this.isOn = false;
        this.play('oven_closed_off');
        console.log("Oven door closed; no item inside; oven off.");
    } else if (this.currentItem.toLowerCase().includes("dough")) {
        this.play(this.isOn ? 'oven_closed_on' : 'oven_closed_off');
        console.log("Oven door closed; cooking item inside.");
    } else {
      console.log("Oven door opened; finished product inside.");
    if (!this.productSprite) {
      if (this.scene.itemManager && this.scene.itemManager.createBakedProduct) {
        this.productSprite = this.scene.itemManager.createBakedProduct(this.x, this.y, this.currentItem);
      } else {
        // Fallback in case itemManager is not available.
        this.productSprite = new Bread(this.scene, this.x, this.y, this.currentItem);
        console.log("Fallback: Creating baked product using Bread.");
      }
      if (this.scene.pickableItemsGroup) {
        this.scene.pickableItemsGroup.add(this.productSprite);
      }
      console.log("Baked product sprite created inside the oven.");
      this.productSprite.once('destroy', () => {
        this.clearOven();
      });
    } else {
      this.productSprite.setVisible(true);
    }
  }
}

    // Burn Timer adjustments.
    if (this.isOpen && this.burnTimerActive) {
      const elapsed = this.scene.time.now - this.burnStartTime;
      this.burnDuration -= elapsed;
      this.burnTimerActive = false;
      if (this.burnProgressBar) {
        this.burnProgressBar.destroy();
        this.burnProgressBar = null;
      }
      console.log("Burn timer paused.");
    }
    if (
      !this.isOpen &&
      (this.currentItem !== null && this.currentItem !== 'dough') &&
      !this.burnTimerActive &&
      this.productSprite &&
      (this.scene.heldItem !== this.productSprite)
    ) {
      this.startBurnTimer(currentTime, progressBarFactory);
      console.log("Burn timer resumed.");
    }
  }

  startBaking(currentTime, progressBarFactory) {
    this.isBaking = true;
    this.bakingStartTime = currentTime;
    this.bakingProgressBar = progressBarFactory(this.scene, this.x - 25, this.y - 50, 50, 10);
    console.log("Baking started.");
  }

  updateBaking(currentTime, progressBarFactory) {
    if (this.isBaking && this.bakingProgressBar) {
      const elapsed = currentTime - this.bakingStartTime;
      const progress = Phaser.Math.Clamp(elapsed / this.bakingDuration, 0, 1);
      this.bakingProgressBar.setProgress(progress);
      if (progress >= 1) {
        this.isBaking = false;
        // Debug log: show currentItem (should be "cookieDough" if cookie dough was inserted)
        console.log("Before recipe lookup, currentItem =", this.currentItem);
        const recipe = findRecipe([this.currentItem]); // e.g., if currentItem was "dough" or "cookieDough"
        if (recipe) {
          this.currentItem = recipe.name; // e.g., "bread" or "cookie"
          this.completedRecipe = recipe;   // Store the recipe for later (e.g., for burned version)
        } else {
          console.log("No matching recipe found!");
        }
        this.bakingProgressBar.destroy();
        this.bakingProgressBar = null;
        console.log(`Baking complete: ${this.currentItem} is ready.`);

        // Particle effect.
        const particles = this.scene.add.particles(this.currentItem);
        const emitter = particles.createEmitter({
          x: this.x,
          y: this.y,
          speed: { min: -100, max: 100 },
          scale: { start: 0.5, end: 0 },
          lifespan: 2000,
          blendMode: 'ADD'
        });
        this.scene.time.delayedCall(2000, () => {
          particles.destroy();
        });

        // Smoke animation.
        if (!this.anims.animationManager.exists('oven_smoke')) {
          const frameNames = this.texture.getFrameNames();
          if (frameNames.length >= 5) {
            this.anims.animationManager.create({
              key: 'oven_smoke',
              frames: this.anims.generateFrameNumbers('oven_spritesheet', { start: 3, end: 4 }),
              frameRate: 2,
              repeat: -1
            });
          } else {
            console.error("Oven spritesheet does not have enough frames for smoke animation.");
            this.setFrame(2);
          }
        }
        this.play('oven_smoke');

        // Start burn timer.
        this.burnDuration = 30000;
        this.startBurnTimer(currentTime, progressBarFactory);
      }
    }
  }

  startBurnTimer(currentTime, progressBarFactory) {
    this.burnStartTime = currentTime;
    this.burnTimerActive = true;
    this.burnProgressBar = progressBarFactory(this.scene, this.x - 25, this.y - 70, 50, 10);
    console.log("Burn timer started.");
  }

  updateBurnTimer(currentTime) {
    if (this.burnTimerActive && this.burnProgressBar) {
      const elapsed = currentTime - this.burnStartTime;
      const progress = Phaser.Math.Clamp(elapsed / this.burnDuration, 0, 1);
      this.burnProgressBar.setProgress(1 - progress);
      if (progress >= 1) {
        this.burnTimerActive = false;
        this.burnProgressBar.destroy();
        this.burnProgressBar = null;
        if (this.productSprite) {
          this.productSprite.setTint(0x555555);
        }
        // Use the recipe's burnedName if available.
        if (this.completedRecipe && this.completedRecipe.burnedName) {
          this.currentItem = this.completedRecipe.burnedName;
        } else {
          this.currentItem = 'burnedProduct';
        }
        console.log("Product burned!");
      }
    }
  }

  insertDough(currentTime, progressBarFactory, doughType) {
  if (!this.isFixed) {
    console.log("Cannot insert dough into a held oven.");
    return;
  }
  // Use the provided dough type (e.g. "dough" or "cookieDough")
  this.currentItem = doughType; 
  if (this.isOpen) {
    this.toggleDoor(currentTime, progressBarFactory);
  }
  if (!this.isOn) {
    this.togglePower();
  }
  this.setFrame(2);
  this.bakingStartTime = currentTime;
  this.isBaking = true;
  this.bakingProgressBar = progressBarFactory(this.scene, this.x - 25, this.y - 50, 50, 10);
  console.log(`${doughType} inserted: Oven closed, turned on, and baking started.`);
}

}
