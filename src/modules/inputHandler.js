// src/modules/inputHandler.js
// Centralizes keyboard input setup for the game

export function setupInput(scene) {
  // Create cursor keys for movement
  const cursors = scene.input.keyboard.createCursorKeys();
  
  // Define extra keys for specific actions
  const keys = {
    interact: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
    toggleOven: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
    escape: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
    openBakery: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B)
  };

  return { cursors, keys };
}
