// src/entities/MixerContainer.js

import { findMixerRecipe } from '../modules/recipes.js';

export default class MixerContainer extends Phaser.GameObjects.Container {
  constructor(scene, x, y, texture = 'MixerSpriteSheet') {
    super(scene, x, y);

    // Add this container to the scene and enable physics
    scene.add.existing(this);
    scene.physics.world.enable(this);

    // Create the mixer sprite and add it as a child of the container.
    this.mixerSprite = scene.add.sprite(0, 0, texture);
    this.mixerSprite.setScale(0.25);
    this.add(this.mixerSprite);

    // Mixer state
    this.inputItems = [];    // Array of ingredient strings (e.g., 'flour', 'sugar')
    this.isMixing = false;   // Is mixing in progress?
    this.mixStartTime = 0;   // When mixing started
    this.mixDuration = 5000; // Duration (in ms)
    this.progressBar = null; // Reference to a progress bar (if any)

    // Maximum number of ingredients the mixer can hold
    this.maxIngredients = 4;

    // Slot UI arrays (for slot backgrounds and ingredient sprites)
    this.slotBGs = [];
    this.slotItems = [];

    // Create the 4 UI slots above the mixer sprite and hide them by default
    this.createSlots();
    this.hideSlots();
  }

  createSlots() {
    const spacing = 30;          // Horizontal spacing between slots
    const offsetY = 60;          // Vertical offset above the mixer sprite
    const startX = -((this.maxIngredients - 1) * spacing) / 2; 
    const slotY = -offsetY;

    for (let i = 0; i < this.maxIngredients; i++) {
      // Create a slot background image (using your "slot_empty" asset)
      const bg = this.scene.add.image(startX + i * spacing, slotY, 'slot_empty');
      bg.setScale(0.4);
      bg.setOrigin(0.5);
      this.add(bg);
      this.slotBGs.push(bg);

      // Create an ingredient sprite that will appear in the slot
      const itemSprite = this.scene.add.sprite(bg.x, bg.y, '');
      itemSprite.setScale(0.9);
      itemSprite.setOrigin(0.5);
      itemSprite.setVisible(false);
      this.add(itemSprite);
      this.slotItems.push(itemSprite);
    }
  }

  showSlots() {
    this.slotBGs.forEach(bg => bg.setVisible(true));
  }

  hideSlots() {
    this.slotBGs.forEach(bg => bg.setVisible(false));
    this.slotItems.forEach(sprite => {
      sprite.setTexture('');
      sprite.setVisible(false);
    });
  }

  addIngredient(ingredient) {
    if (this.isMixing) {
      console.log("Cannot add ingredient while mixing.");
      return;
    }
    if (this.inputItems.length >= this.maxIngredients) {
      console.log("Mixer is full.");
      return;
    }

    if (this.inputItems.length === 0) {
      this.showSlots();
    }

    this.inputItems.push(ingredient.itemType);
    const slotIndex = this.inputItems.length - 1;
    const slotSprite = this.slotItems[slotIndex];
    slotSprite.setTexture(ingredient.texture.key);
    slotSprite.setVisible(true);

    console.log(`${ingredient.itemType} added to mixer (slot ${slotIndex}).`);
  }

  removeLastIngredient() {
    if (this.isMixing) {
      console.log("Cannot remove ingredient while mixing.");
      return;
    }
    if (this.inputItems.length === 0) {
      console.log("No ingredients to remove.");
      return;
    }

    const removed = this.inputItems.pop();
    const slotIndex = this.inputItems.length;
    const slotSprite = this.slotItems[slotIndex];
    slotSprite.setTexture('');
    slotSprite.setVisible(false);

    console.log(`Removed ${removed} from mixer (slot ${slotIndex}).`);

    if (this.inputItems.length === 0) {
      this.hideSlots();
    }
  }

  startMixing(startTime, createProgressBar) {
    if (this.isMixing) {
      console.log("Mixer is already mixing.");
      return;
    }
    if (this.inputItems.length === 0) {
      console.log("No ingredients to mix.");
      return;
    }
    if (this.inputItems.includes('sugar') && !this.inputItems.includes('flour')) {
      console.log("Sugar requires flour. Cannot mix.");
      return;
    }
    this.isMixing = true;
    this.mixStartTime = startTime;
    if (createProgressBar) {
      this.progressBar = createProgressBar(this.scene, this.x, this.y - 50, this.mixDuration);
    }
    this.mixerSprite.play('mixer_mixing');
    console.log("Mixer started mixing.");
  }

  updateMixing(currentTime) {
    if (!this.isMixing) return;
    const elapsed = currentTime - this.mixStartTime;
    if (this.progressBar) {
      this.progressBar.setProgress(elapsed / this.mixDuration);
    }
    if (elapsed >= this.mixDuration) {
      this.finishMixing();
    }
  }

  finishMixing() {
    this.isMixing = false;
    if (this.progressBar) {
      this.progressBar.destroy();
      this.progressBar = null;
    }

    let outputItem = 'dough';
    if (this.inputItems.includes('flour') && this.inputItems.includes('sugar')) {
      outputItem = 'cookieDough';
    } else if (this.inputItems.includes('sugar') && !this.inputItems.includes('flour')) {
      console.log("Invalid combination: only sugar.");
      this.resetMixer();
      this.mixerSprite.play('mixer_idle');
      return;
    }

    this.resetMixer();
    this.mixerSprite.play('mixer_idle');

    const output = this.scene.physics.add.sprite(this.x, this.y - 50, outputItem);
    output.itemType = outputItem;
    if (this.scene.pickableItemsGroup) {
      this.scene.pickableItemsGroup.add(output);
    }
    console.log(`Mixer produced ${outputItem}`);
  }

  resetMixer() {
    this.inputItems = [];
    this.slotItems.forEach(sprite => {
      sprite.setTexture('');
      sprite.setVisible(false);
    });
    this.hideSlots();
  }

  // --- Highlight Methods ---
  highlight() {
    this.mixerSprite.setTint(0xffff00);
  }

  clearHighlight() {
    this.mixerSprite.clearTint();
  }
}
