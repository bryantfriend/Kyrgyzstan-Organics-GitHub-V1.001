// src/modules/bakery.js
export const bakeryState = {
  open: false,
  autoCloseTimer: null,
};

export function openBakery(scene) {
  if (!bakeryState.open) {
    bakeryState.open = true;
    console.log("Bakery opened");
    
    // Show any bakery-specific UI elements if needed.
    // e.g., scene.showBakeryUI();

    // Remove the baking machines while the bakery is open.
    if (scene.pickableItemsGroup && scene.oven && scene.mixer) {
      scene.pickableItemsGroup.remove(scene.oven, false, false);
      scene.pickableItemsGroup.remove(scene.mixer, false, false);
      console.log("Baking machines removed from the group.");
    }

    // Set a timer to automatically close the bakery after 30 seconds (30000ms)
    bakeryState.autoCloseTimer = scene.time.delayedCall(3000000, () => {
      closeBakery(scene);
      console.log("Bakery auto-closed after 30 seconds.");
    });
  }
}

export function closeBakery(scene) {
  if (bakeryState.open) {
    bakeryState.open = false;
    console.log("Bakery closed");
    if (scene) {
      scene.isOpen = bakeryState.open;  // Update the scene's isOpen property

      // Re-add the baking machines to the pickableItemsGroup
      if (scene.pickableItemsGroup && scene.oven && scene.mixer) {
        if (!scene.pickableItemsGroup.contains(scene.oven)) {
          scene.pickableItemsGroup.add(scene.oven);
        }
        if (!scene.pickableItemsGroup.contains(scene.mixer)) {
          scene.pickableItemsGroup.add(scene.mixer);
        }
        console.log("Baking machines added back to the group.");
      }
    }
    // Clear the auto-close timer if it exists.
    if (bakeryState.autoCloseTimer) {
      bakeryState.autoCloseTimer.remove(false);
      bakeryState.autoCloseTimer = null;
    }
  }
}

export function toggleBakery(scene) {
  if (bakeryState.open) {
    closeBakery(scene);
  } else {
    openBakery(scene);
  }
}
