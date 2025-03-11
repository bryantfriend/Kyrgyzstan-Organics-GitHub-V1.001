// src/modules/entityFactory.js
import Oven from '../entities/Oven.js';
import MixerContainer from '../entities/MixerContainer.js';  // Updated import
import Flour from '../entities/Flour.js';
import Sugar from '../entities/Sugar.js';
import BakedProduct from '../entities/BakedProduct.js';
import DeliveryMan from '../entities/DeliveryMan.js';

export function createOven(scene, x, y) {
  return new Oven(scene, x, y);
}

// Use MixerContainer instead of the old Mixer
export function createMixer(scene, x, y, texture = 'MixerSpriteSheet') {
  return new MixerContainer(scene, x, y, texture);
}

export function createFlour(scene, x, y) {
  return new Flour(scene, x, y);
}

export function createSugar(scene, x, y) {
  return new Sugar(scene, x, y);
}

export function createBakedProduct(scene, x, y, productType) {
  return new BakedProduct(scene, x, y, productType);
}

export function createBread(scene, x, y, state) {
  return new BakedProduct(scene, x, y, state);
}

export function createCookie(scene, x, y, state) {
  return new BakedProduct(scene, x, y, state);
}

export function createDeliveryMan(scene, x, y) {
  return new DeliveryMan(scene, x, y);
}
