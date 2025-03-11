// src/scenes/BakingScene.js
import { gameState } from '../gameState.js';
import createProgressBar from '../modules/progressBar.js';
import createSettingsMenu from '../modules/settingsMenu.js';
import { generateOrder, fulfillOrder } from '../modules/orders.js';
import { createOvenAnimations, createMixerAnimations } from '../modules/animations.js';
import { setupInput } from '../modules/inputHandler.js';
import { findRecipe } from '../modules/recipes.js';
import Oven from '../entities/Oven.js';
import Mixer from '../entities/Mixer.js';
import Flour from '../entities/Flour.js';
import Sugar from '../entities/Sugar.js';
import DeliveryMan from '../entities/DeliveryMan.js';
import ItemManager from '../modules/itemManager.js';
import PickupManager from '../modules/pickupManager.js';
import BakedProduct from '../entities/BakedProduct.js';
import tileMap from '../modules/TileMap.js';
import { toggleBakery, bakeryState } from '../modules/bakery.js';

export default class BakingScene extends Phaser.Scene {
  constructor() {
    super("BakingScene");
  }

  preload() {
    // --- Load Assets ---
    this.tileMap = new tileMap(this, [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 7, 5, 6, 5, 9, 8],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 8, 7, 5, 5, 5, 9, 8],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 8, 7, 5, 6, 5, 9, 8],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 8, 7, 5, 6, 5, 9, 8],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 8, 7, 5, 5, 5, 9, 8],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 8, 7, 5, 6, 5, 9, 8],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 8, 7, 5, 6, 5, 9, 8],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 8, 7, 5, 5, 5, 9, 8],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 8, 7, 5, 6, 5, 9, 8],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 7, 5, 6, 5, 9, 8],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 7, 5, 5, 5, 9, 8],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 7, 5, 6, 5, 9, 8],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 7, 5, 6, 5, 9, 8],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 7, 5, 5, 5, 9, 8],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 8, 7, 5, 6, 5, 9, 8],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 8, 7, 5, 6, 5, 9, 8],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 8, 7, 5, 5, 5, 9, 8],
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 8, 7, 5, 6, 5, 9, 8],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 8, 7, 5, 6, 5, 9, 8],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 8, 7, 5, 5, 5, 9, 8],
      [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 7, 5, 6, 5, 9, 8],
      [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 7, 5, 6, 5, 9, 8],
      [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 7, 5, 5, 5, 9, 8],
    ], 32);

    this.load.spritesheet('oven_spritesheet', 'assets/OvenSpriteSheet.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('MixerSpriteSheet', 'assets/MixerSpriteSheet.png', { frameWidth: 256, frameHeight: 256 });
    this.load.image('bread', 'assets/bread.png');
    this.load.image('cookie', 'assets/cookie.png');
    this.load.image('flour', 'assets/flour.png');
    this.load.image('sugar', 'assets/sugar.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('cookieDough', 'assets/cookieDough.png');
    this.load.image('dough', 'assets/dough.png');
    this.load.image('delivery_man', 'assets/delivery_man.png');
    this.load.image('slot_empty', 'assets/slot_empty.png');

    this.load.on('complete', () => console.log('Assets loaded successfully.'));
  }

  create() {
    // --- Grid Setup ---
    this.gridSize = 32;
    this.gridGraphics = this.add.graphics();
    this.gridGraphics.lineStyle(1, 0xffffff, 0.3);
    const gameWidth = this.sys.game.config.width;
    const gameHeight = this.sys.game.config.height;
    for (let x = 0; x < gameWidth; x += this.gridSize) {
      this.gridGraphics.moveTo(x, 0);
      this.gridGraphics.lineTo(x, gameHeight);
    }
    for (let y = 0; y < gameHeight; y += this.gridSize) {
      this.gridGraphics.moveTo(0, y);
      this.gridGraphics.lineTo(gameWidth, y);
    }
    this.gridGraphics.strokePath();
    this.gridGraphics.setDepth(-1);

    // Render the tilemap
    this.tileMap.renderTileMap();

    // --- Create Animations ---
    createOvenAnimations(this);
    createMixerAnimations(this);

    // --- Setup Input ---
    const { cursors, keys } = setupInput(this);
    this.cursors = cursors;
    this.keys = keys;

    // --- Settings Menu ---
    this.settingsContainer = createSettingsMenu(this, this.gridGraphics);

    // --- Create the Player ---
    this.player = this.physics.add.sprite(400, 300, 'player')
      .setCollideWorldBounds(true)
      .setDepth(10)
      .setScale(0.5);
    this.player.facing = new Phaser.Math.Vector2(1, 0);
    const bodyWidth = this.player.width;
    const bodyHeight = this.player.height * 0.3;
    const offsetY = this.player.height - bodyHeight;
    this.player.body.setSize(bodyWidth, bodyHeight);
    this.player.body.setOffset(0, offsetY);
    this.physics.add.collider(this.player, this.tileMap.collidableGroup);

    // --- Create a Group for Pickable Items ---
    this.pickableItemsGroup = this.physics.add.group();

    // --- Create the Item Manager ---
    this.itemManager = new ItemManager(this);

    // --- Create Entities ---
    this.oven = this.itemManager.createOven(300, 400);
    this.mixer = this.itemManager.createMixer(100, 400, 'MixerSpriteSheet');
    this.flour = this.itemManager.createFlour(50, 330);
    this.sugar = this.itemManager.createSugar(50, 230);
    this.deliveryMan = this.itemManager.createDeliveryMan(600, 300);

    this.pickableItemsGroup.addMultiple([this.flour, this.sugar, this.oven, this.mixer]);

    // --- Create Order ---
    generateOrder(this);

    // --- Create the Pickup Zone ---
    this.pickupZone = this.add.zone(0, 0, 50, 50);
    this.physics.world.enable(this.pickupZone);
    this.pickupZone.body.setAllowGravity(false);
    this.pickupZone.body.setImmovable(true);
    this.pickupZone.setOrigin(0.5, 0.5);

    // --- Camera Setup ---
    this.cameras.main.startFollow(this.player);
    window.addEventListener('resize', () => this.scale.resize(window.innerWidth, window.innerHeight));

    // --- Pickup Manager ---
    this.pickupManager = new PickupManager(this, this.pickableItemsGroup);
    this.heldItem = null;

    // --- Setup Interaction Keys ---
    this.keys.interact.on('down', () => {
      if (
        this.physics.overlap(this.pickupZone, this.mixer) &&
        !this.mixer.isMixing &&
        this.mixer.inputItems.length > 0 &&
        !this.heldItem
      ) {
        this.mixer.removeLastIngredient();
        return;
      }
      this.pickupManager.pickupOrDrop(bakeryState.open);
      this.heldItem = this.pickupManager.heldItem;
    });

    this.keys.openBakery.on('down', () => {
      toggleBakery(this);
      console.log("Bakery is now " + (bakeryState.open ? "open" : "closed"));
      this.events.emit('bakeryStateChanged', bakeryState.open);
    });

    this.keys.escape.on('down', () => {
      this.settingsContainer.setVisible(!this.settingsContainer.visible);
    });

    this.keys.toggleOven.on('down', () => {
      if (!bakeryState.open) {
        console.log("Bakery is closed; you cannot operate the mixer or oven.");
        return;
      }
      
      if (this.physics.overlap(this.pickupZone, this.mixer) && !this.mixer.isMixing) {
        this.mixer.startMixing(this.time.now, createProgressBar);
        return;
      }
      if (this.heldItem && this.heldItem.itemType === 'oven') {
        this.heldItem.togglePower();
      } else if (this.physics.overlap(this.pickupZone, this.oven)) {
        this.oven.toggleDoor(this.time.now, createProgressBar);
      }
    });

    this.events.on('itemdropped', (droppedItem) => {
      if (bakeryState.open) {
        if (this.physics.overlap(this.pickupZone, this.mixer)) {
         const itemType = droppedItem.itemType;
          if (itemType === 'flour' || itemType === 'sugar') {
            this.mixer.addIngredient(droppedItem);
            droppedItem.destroy();
            return;
          } 
        } 
      }

      if (
        (droppedItem.itemType === 'dough' || droppedItem.itemType === 'cookieDough') &&
        this.physics.overlap(this.pickupZone, this.oven) &&
        this.oven.isOpen &&
        !this.oven.currentItem
      ) {
        droppedItem.destroy();
        this.oven.currentItem = droppedItem.itemType;
        this.oven.insertDough(this.time.now, createProgressBar, droppedItem.itemType);
        console.log(`${droppedItem.itemType} placed in oven.`);
        return;
      }

      if (
        droppedItem instanceof BakedProduct &&
        this.physics.overlap(this.pickupZone, this.deliveryMan)
      ) {
        this.deliverOrder(droppedItem);
        return;
      }

      const dropX = Phaser.Math.Snap.To(this.pickupZone.x, this.gridSize);
      const dropY = Phaser.Math.Snap.To(this.pickupZone.y, this.gridSize);
      if (this.pickupManager.canPlaceAt(dropX, dropY)) {
        droppedItem.x = dropX;
        droppedItem.y = dropY;
        droppedItem.setDepth(5);
        console.log(`Dropped item: ${droppedItem.itemType} at (${dropX}, ${dropY})`);
      } else {
        console.log("Cannot drop item here: space occupied.");
      }
    });
    this.scene.launch('GameUI');
  }

  update(time, delta) {
    this.itemManager.update(time, delta);

    // Update GUI only if it exists
    if (this.goldLabel && this.bakeryStatusLabel) {
      this.goldLabel.getElement('text').setText(`Gold: ${gameState.playerGold}`);
      this.bakeryStatusLabel.getElement('text').setText(`Bakery: ${bakeryState.open ? 'Open' : 'Closed'}`);
    }

    const speed = 200;
    this.player.setVelocity(0);

    let dx = 0, dy = 0;
    if (this.cursors.left.isDown) dx -= 1;
    if (this.cursors.right.isDown) dx += 1;
    if (this.cursors.up.isDown) dy -= 1;
    if (this.cursors.down.isDown) dy += 1;
    if (dx || dy) {
      this.player.facing = new Phaser.Math.Vector2(dx, dy).normalize();
    }
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.setFlipX(false);
    }
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
    }

    const pickupDistance = 40;
    if (this.pickupZone) {
      this.pickupZone.x = this.player.x + this.player.facing.x * pickupDistance;
      this.pickupZone.y = this.player.y + this.player.facing.y * pickupDistance;
    }
    
    // In your update method, after updating the pickupZone position:
    this.pickableItemsGroup.children.iterate((item) => {
      if (this.physics.overlap(this.pickupZone, item)) {
        if (item.highlight) {
          item.highlight();
        } else if (typeof item.setTint === 'function') {
          item.setTint(0xffff00);
        }
      } else {
        if (item.clearHighlight) {
          item.clearHighlight();
        } else if (typeof item.clearTint === 'function') {
          item.clearTint();
        }
      }
    });



    if (this.heldItem) {
      this.heldItem.x = this.player.x + this.player.facing.x * 20;
      this.heldItem.y = this.player.y + 5;
      this.heldItem.setDepth(this.player.depth + 1);
    }

    if (this.deliveryMan && this.orderText) {
      this.orderText.x = this.deliveryMan.x;
      this.orderText.y = this.deliveryMan.y - 50;
    }

    this.mixer.updateMixing(time);
    if (this.oven.isBaking && this.oven.bakingProgressBar) {
      this.oven.updateBaking(time, createProgressBar);
    }
    if (this.oven.burnTimerActive && this.oven.burnProgressBar) {
      this.oven.updateBurnTimer(time);
    }
  }

  updateOrderText() {
    let orderString = '';
    for (const item in gameState.currentOrder) {
      orderString += `${item}: ${gameState.currentOrder[item]} `;
    }
    if (this.orderText) {
      this.orderText.setText(orderString.trim());
    }
  }

  toggleOven() {
    if (this.heldItem && this.heldItem.itemType === 'oven') {
      this.heldItem.togglePower();
    } else if (this.physics.overlap(this.pickupZone, this.oven)) {
      this.oven.toggleDoor(this.time.now, createProgressBar);
    }
  }

  deliverOrder(item) {
    if (!item) return;
    const itemType = item.itemType;
    if (fulfillOrder(this, itemType)) {
      item.destroy();
      if (this.heldItem === item) {
        this.heldItem = null;
      }
    }
  }

  spawnDeliveryMan() {
    this.deliveryMan = this.itemManager.createDeliveryMan(600, 300);
    if (this.orderText) {
      this.orderText.destroy();
      this.orderText = null;
    }
    generateOrder(this);
  }
}