// src/modules/itemManager.js

import * as EntityFactory from './entityFactory.js';

export default class ItemManager {
  /**
   * @param {Phaser.Scene} scene - The scene in which the items exist.
   */
  constructor(scene) {
    this.scene = scene;
    // Array to hold references to all managed items.
    this.items = [];
  }

  // --- Creation Methods ---

  createOven(x, y) {
    const oven = EntityFactory.createOven(this.scene, x, y);
    this.items.push(oven);
    return oven;
  }

  createMixer(x, y, texture = 'MixerSpriteSheet') {
    const mixer = EntityFactory.createMixer(this.scene, x, y, texture);
    this.items.push(mixer);
    return mixer;
  }

  createFlour(x, y) {
    const flour = EntityFactory.createFlour(this.scene, x, y);
    this.items.push(flour);
    return flour;
  }

  createSugar(x, y) {
    const sugar = EntityFactory.createSugar(this.scene, x, y);
    this.items.push(sugar);
    return sugar;
  }

  createBread(x, y, state) {
    const bread = EntityFactory.createBread(this.scene, x, y, state);
    this.items.push(bread);
    return bread;
  }

  createCookie(x, y, state) {
    const cookie = EntityFactory.createBread(this.scene, x, y, state);
    this.items.push(cookie);
    return cookie;
  }
    
    
    
  createDeliveryMan(x, y) {
    const deliveryMan = EntityFactory.createDeliveryMan(this.scene, x, y);
    this.items.push(deliveryMan);
    return deliveryMan;
  }

  /**
   * Creates a baked product using the recipe's name as the texture key.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   * @param {string} textureKey - The texture key (i.e., the recipe name).
   * @returns {Bread} The created baked product.
   */
  createBakedProduct(x, y, textureKey) {
    const product = EntityFactory.createBakedProduct(this.scene, x, y, textureKey);
    this.items.push(product);
    return product;
  }

  registerItem(item) {
    this.items.push(item);
  }

  // --- Removal Methods ---

  removeItem(item) {
    if (item && item.active && typeof item.destroy === 'function') {
      item.destroy();
    }
    this.items = this.items.filter(i => i !== item);
  }

  // --- Update Methods ---

  update(time, delta) {
    this.items.forEach(item => {
      if (typeof item.update === 'function') {
        item.update(time, delta);
      }
    });
  }

  // --- Utility Methods ---

  getItemsByType(itemType) {
    return this.items.filter(item => item.itemType === itemType);
  }
}
