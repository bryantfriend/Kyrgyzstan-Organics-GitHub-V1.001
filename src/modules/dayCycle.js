// src/modules/dayCycle.js
import { toggleBakeryState } from './bakery.js';

let dayTimer = 600000; // 60 seconds per day

export function updateDayCycle(scene, delta) {
  dayTimer -= delta;
  if (dayTimer <= 0) {
    endDay(scene);
  }
}

export function endDay(scene) {
  toggleBakeryState(scene);
  dayTimer = 600000; // Reset timer for the next day
}
