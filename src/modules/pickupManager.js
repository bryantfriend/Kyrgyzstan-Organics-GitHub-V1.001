// src/modules/pickupManager.js
export default class PickupManager {
  /**
   * @param {Phaser.Scene} scene - The scene where pickups occur.
   * @param {Phaser.GameObjects.Group} pickableItemsGroup - The group containing pickable items.
   */
  constructor(scene, pickableItemsGroup) {
    this.scene = scene;
    this.pickableItemsGroup = pickableItemsGroup;
    this.heldItem = null;
  }

  pickupOrDrop(isOpen) {
    if (this.heldItem) {
      this.dropItem();
    } else {
      this.pickupItem(isOpen);
    }
  }

 pickupItem(isOpen) {
  const pickupZone = this.scene.pickupZone;
  let pickedItem = null;
  for (let item of this.pickableItemsGroup.getChildren()) {
    if (this.scene.physics.overlap(pickupZone, item)) {
      pickedItem = item;
      break;
    }
  }
  if (pickedItem) {
    // If the item is flour or sugar and the bakery is open:
    if ((pickedItem.itemType === 'flour' || pickedItem.itemType === 'sugar') && isOpen === true) {
      // If it's not already a clone, clone it and mark it.
      if (!pickedItem.isClone) {
        if (pickedItem.itemType === 'flour') {
          this.heldItem = this.scene.itemManager.createFlour(
            this.scene.player.x,
            this.scene.player.y
          );
        } else { // sugar
          this.heldItem = this.scene.itemManager.createSugar(
            this.scene.player.x,
            this.scene.player.y
          );
        }
        // Mark the new item as a clone.
        this.heldItem.isClone = true;
        // Add the clone to the group so it can be picked up later.
        this.scene.pickableItemsGroup.add(this.heldItem);
      } else {
        // If it's already a clone, simply pick it up.
        this.heldItem = pickedItem;
      }
    } else {
      // For all other items, pick up the actual object.
      this.heldItem = pickedItem;
    }
    this.scene.events.emit('itempickedup', this.heldItem);
    console.log(`Picked up item: ${this.heldItem.itemType}`);
  } else {
    console.log("No item found in the pickup zone.");
  }
}

  dropItem() {
    // Emit an event to let the scene decide what to do with the dropped item.
    this.scene.events.emit('itemdropped', this.heldItem);
    this.heldItem = null;
  }

  canPlaceAt(x, y) {
    const tolerance = this.scene.gridSize / 2;
    for (const item of this.pickableItemsGroup.getChildren()) {
      if (item === this.heldItem) continue;
      if (Math.abs(item.x - x) < tolerance && Math.abs(item.y - y) < tolerance) {
        return false;
      }
    }
    return true;
  }
}
