// src/modules/animations.js
// Helper functions to create animations for various entities

export function createOvenAnimations(scene) {
  scene.anims.create({
    key: 'oven_open',
    frames: scene.anims.generateFrameNumbers('oven_spritesheet', { start: 0, end: 0 }),
    frameRate: 1,
  });
  scene.anims.create({
    key: 'oven_closed_off',
    frames: scene.anims.generateFrameNumbers('oven_spritesheet', { start: 1, end: 1 }),
    frameRate: 1,
  });
  scene.anims.create({
    key: 'oven_closed_on',
    frames: scene.anims.generateFrameNumbers('oven_spritesheet', { start: 2, end: 2 }),
    frameRate: 1,
  });
}

export function createMixerAnimations(scene) {
  scene.anims.create({
    key: 'mixer_idle',
    frames: [{ key: 'MixerSpriteSheet', frame: 0 }],
    frameRate: 1,
  });
  scene.anims.create({
    key: 'mixer_mixing',
    frames: scene.anims.generateFrameNumbers('MixerSpriteSheet', { start: 1, end: 2 }),
    frameRate: 6,
    repeat: -1,
  });
}
