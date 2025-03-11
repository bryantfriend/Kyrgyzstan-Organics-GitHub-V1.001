import { openStore } from './store.js';

let dayTimer = 60000; // 60 seconds per day

export function update() {
    dayTimer -= this.time.delta;
    if (dayTimer <= 0) {
        endDay.call(this);
    }
}

export function endDay() {
    openStore.call(this);
    dayTimer = 60000; // Reset timer
}