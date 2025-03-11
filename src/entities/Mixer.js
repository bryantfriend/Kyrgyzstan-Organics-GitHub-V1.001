// src/entities/Mixer.js
export default class Mixer extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.setInteractive();
    this.setScale(0.25);

    // Mixer state
    this.inputItems = [];    // Array of ingredient strings (e.g. 'flour', 'sugar')
    this.isMixing = false;   // Is mixing in progress?
    this.mixStartTime = 0;   // When mixing started
    this.mixDuration = 5000; // Duration (in ms)
    this.progressBar = null; // Reference to a progress bar (if any)

    // Maximum number of ingredients the mixer can hold
    this.maxIngredients = 4;

    // Slot UI arrays
    this.slotBGs = [];    // Background images for the 4 slots
    this.slotItems = [];  // The actual ingredient sprites in each slot

    // Create the 4 slots above the mixer
    this.createSlots();
  }

  /**
   * Creates four slot backgrounds and four corresponding item sprites
   * arranged horizontally above the mixer.
   */
  createSlots() {
    const spacing = 30;          // Horizontal distance between slots
    const offsetY = 60;          // How far above the mixer to place the slots
    const startX = this.x - ((this.maxIngredients - 1) * spacing) / 2; 
    const slotY = this.y - offsetY;

    // Create each slot's background + the sprite for the ingredient
    for (let i = 0; i < this.maxIngredients; i++) {
      // Background image (e.g. a box with "slot_empty" graphic)
      const bg = this.scene.add.image(startX + i * spacing, slotY, 'slot_empty');
      bg.setScale(0.4);
      bg.setOrigin(0.5);
      this.slotBGs.push(bg);

      // Sprite for the actual ingredient that will occupy this slot
      const itemSprite = this.scene.add.sprite(bg.x, bg.y, '');
      itemSprite.setScale(0.9);
      itemSprite.setOrigin(0.5);
      itemSprite.setVisible(false); // Hidden until something is placed
      this.slotItems.push(itemSprite);
    }
  }

  /**
   * Called when an ingredient is added.
   * @param {Phaser.GameObjects.Sprite} ingredient - The ingredient sprite.
   */
  addIngredient(ingredient) {
    if (this.isMixing) {
      console.log("Cannot add ingredient while mixing.");
      return;
    }
    if (this.inputItems.length >= this.maxIngredients) {
      console.log("Mixer is full.");
      return;
    }

    // Add the ingredient’s itemType to the list
    this.inputItems.push(ingredient.itemType);

    // Update the slot UI: place the ingredient’s sprite in the next free slot
    const slotIndex = this.inputItems.length - 1; // 0-based index
    const slotSprite = this.slotItems[slotIndex];
    slotSprite.setTexture(ingredient.texture.key);
    slotSprite.setVisible(true);

    console.log(`${ingredient.itemType} added to mixer (slot ${slotIndex}).`);
  }

  /**
   * Removes the last ingredient (if mixing hasn’t started).
   */
  removeLastIngredient() {
    if (this.isMixing) {
      console.log("Cannot remove ingredient while mixing.");
      return;
    }
    if (this.inputItems.length === 0) {
      console.log("No ingredients to remove.");
      return;
    }
    // Remove from the inputItems array
    const removed = this.inputItems.pop();

    // Hide/clear the corresponding slot sprite
    const slotIndex = this.inputItems.length; 
    const slotSprite = this.slotItems[slotIndex];
    slotSprite.setTexture('');
    slotSprite.setVisible(false);

    console.log(`Removed ${removed} from mixer (slot ${slotIndex}).`);
  }

  /**
   * Begins mixing. Should be called when the player interacts with the mixer.
   * @param {number} startTime - The current time.
   * @param {function} createProgressBar - Helper to create a progress bar.
   */
  startMixing(startTime, createProgressBar) {
    if (this.isMixing) {
      console.log("Mixer is already mixing.");
      return;
    }
    if (this.inputItems.length === 0) {
      console.log("No ingredients to mix.");
      return;
    }
    // If sugar is present, flour must also be present
    if (this.inputItems.includes('sugar') && !this.inputItems.includes('flour')) {
      console.log("Sugar requires flour. Cannot mix.");
      return;
    }

    this.isMixing = true;
    this.mixStartTime = startTime;
    if (createProgressBar) {
      this.progressBar = createProgressBar(this.scene, this.x, this.y - 50, this.mixDuration);
    }
    this.play('mixer_mixing');
    console.log("Mixer started mixing.");
  }

  /**
   * Called every update while mixing.
   * @param {number} currentTime - The current time.
   */
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

  /**
   * Finishes mixing, determines the output, and resets the mixer.
   */
  finishMixing() {
    this.isMixing = false;
    if (this.progressBar) {
      this.progressBar.destroy();
      this.progressBar = null;
    }

    // Decide on the output:
    // If both flour and sugar are present, produce cookieDough; otherwise produce dough
    let outputItem = 'dough';
    if (this.inputItems.includes('flour') && this.inputItems.includes('sugar')) {
      outputItem = 'cookieDough';
    } else if (this.inputItems.includes('sugar') && !this.inputItems.includes('flour')) {
      // Should never happen, but just in case:
      console.log("Invalid combination: only sugar.");
      this.resetMixer();
      this.play('mixer_idle');
      return;
    }

    // Reset mixer state (clear ingredients and UI)
    this.resetMixer();
    this.play('mixer_idle');

    // Create the output at the mixer’s position
    const output = this.scene.physics.add.sprite(this.x, this.y - 50, outputItem);
    output.itemType = outputItem;
    if (this.scene.pickableItemsGroup) {
      this.scene.pickableItemsGroup.add(output);
    }
    console.log(`Mixer produced ${outputItem}`);
  }

  /**
   * Clears the mixer of all items and resets the UI slots.
   */
  resetMixer() {
    this.inputItems = [];

    // Clear all slot sprites
    this.slotItems.forEach(sprite => {
      sprite.setTexture('');
      sprite.setVisible(false);
    });
  }
}
