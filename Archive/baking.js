import { gameState } from './main.js';

export function preload() {
    this.load.image('oven_off_up', 'assets/oven_off_up.png');
    this.load.image('oven_off_down', 'assets/oven_off_down.png');
    this.load.image('oven_on_up', 'assets/oven_on_up.png');
    this.load.image('oven_on_down', 'assets/oven_on_down.png');
    this.load.image('mixer', 'assets/mixer.png');
    this.load.image('bread', 'assets/bread.png');
    this.load.image('cookie', 'assets/cookie.png');
    this.load.image('flour', 'assets/flour.png'); // ✅ Load Flour
    this.load.image('player', 'assets/player.png');

    this.load.on('complete', () => console.log('Assets loaded successfully.'));
}

export function create() {
    const scene = this;
    const gridSize = 50;
    scene.heldItem = null;

    // Create player
    scene.player = scene.physics.add.sprite(400, 300, 'player');
    scene.player
        .setCollideWorldBounds(true)
        .setDepth(10)
        .setScale(0.5)
        .setSize(scene.player.width, scene.player.height / 4)
        .setOffset(0, scene.player.height / 1.5);

    // Add a facing direction vector; default to right.
    scene.player.facing = new Phaser.Math.Vector2(1, 0);

    scene.cursors = scene.input.keyboard.createCursorKeys();

    // Create interactive objects: mixer, flour, and oven.
    scene.mixer = scene.physics.add.sprite(100, 400, 'mixer').setInteractive().setDepth(5);
    scene.flour = scene.physics.add.sprite(200, 400, 'flour').setInteractive().setDepth(5);

    scene.oven = scene.physics.add.sprite(300, 400, 'oven_off_down')
        .setInteractive()
        .setDepth(5)
        .setScale(0.25)
        .setImmovable(true);

    scene.oven.isOn = false;
    scene.oven.currentRotation = "bottom_right";
    scene.oven.setTexture("oven_off_down").setFlipX(true);

    // Add collider for the oven (removed when picking it up).
    scene.physics.add.collider(scene.player, scene.oven);

    scene.cameras.main.startFollow(scene.player);

    window.addEventListener('resize', () => scene.scale.resize(window.innerWidth, window.innerHeight));

    scene.goldText = scene.add.text(10, 10, `Gold: ${gameState.playerGold}`, { fontSize: '20px', fill: '#fff' });

    // Set up key events for interactions.
    scene.input.keyboard.on('keydown-E', () => handlePickupDrop(scene));
    scene.input.keyboard.on('keydown-R', () => handleRotation(scene));
    scene.input.keyboard.on('keydown-F', () => toggleOven(scene));
}

export function update(time, delta) {
    const scene = this;
    const speed = 200;
    scene.player.setVelocity(0);

    // Update player's facing direction based on arrow key input.
    let dx = 0, dy = 0;
    if (scene.cursors.left.isDown)  dx -= 1;
    if (scene.cursors.right.isDown) dx += 1;
    if (scene.cursors.up.isDown)    dy -= 1;
    if (scene.cursors.down.isDown)  dy += 1;
    if (dx !== 0 || dy !== 0) {
        scene.player.facing = new Phaser.Math.Vector2(dx, dy).normalize();
    }

    // Apply movement (and flip sprite for left/right).
    if (scene.cursors.left.isDown) {
        scene.player.setVelocityX(-speed);
        scene.player.setFlipX(true);
    } else if (scene.cursors.right.isDown) {
        scene.player.setVelocityX(speed);
        scene.player.setFlipX(false);
    }
    if (scene.cursors.up.isDown) {
        scene.player.setVelocityY(-speed);
    } else if (scene.cursors.down.isDown) {
        scene.player.setVelocityY(speed);
    }

    // If holding an item, have it follow the player.
    if (scene.heldItem) {
        scene.heldItem.x = scene.player.x;
        scene.heldItem.y = scene.player.y - 20;
    }

    // (Optional) Debug logging of the player's position.
    if (scene.time.now % 1000 < 16) {
        console.log(`Player X: ${scene.player.x}, Y: ${scene.player.y}`);
    }
}

// ------------------------------------------------------------------
// Helper functions for pickup, rotation, and toggling the oven
// ------------------------------------------------------------------

function handlePickupDrop(scene) {
    const pickupThreshold = 60; // Maximum distance for pickup.
    
    if (scene.heldItem) {
        // Drop the held item and snap it to the grid.
        let dropX = scene.player.x;
        let dropY = scene.player.y;
        if (scene.cursors.left.isDown) dropX -= 50;
        else if (scene.cursors.right.isDown) dropX += 50;
        else if (scene.cursors.up.isDown) dropY -= 50;
        else if (scene.cursors.down.isDown) dropY += 50;

        scene.heldItem.x = Phaser.Math.Snap.To(dropX, 50);
        scene.heldItem.y = Phaser.Math.Snap.To(dropY, 50);
        scene.heldItem.setDepth(5);

        // If the oven is dropped, re-enable its collider.
        if (scene.heldItem === scene.oven) {
            scene.physics.add.collider(scene.player, scene.oven);
        }
        scene.heldItem = null;
    } else {
        // Build a list of potential pickup candidates.
        const candidates = [];
        // Only add objects that are active.
        if (scene.oven.active) candidates.push({ obj: scene.oven, type: 'oven' });
        if (scene.flour.active) candidates.push({ obj: scene.flour, type: 'flour' });
        if (scene.mixer.active) candidates.push({ obj: scene.mixer, type: 'mixer' });

        let bestCandidate = null;
        let bestDot = 0.5; // Only consider objects within roughly a 60° cone (cos(60°) = 0.5).

        // Loop through candidates to find which one is both within range and most "in front" of the player.
        for (let candidate of candidates) {
            let obj = candidate.obj;
            let dx = obj.x - scene.player.x;
            let dy = obj.y - scene.player.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= pickupThreshold) {
                // Compute a normalized vector from the player to the object.
                let toObj = new Phaser.Math.Vector2(dx, dy).normalize();
                // The dot product tells us how aligned the object is with the player's facing vector.
                let dot = scene.player.facing.dot(toObj);
                if (dot > bestDot) {
                    bestDot = dot;
                    bestCandidate = candidate;
                }
            }
        }

        // If a candidate is found, pick it up.
        if (bestCandidate) {
            if (bestCandidate.type === 'oven') {
                scene.heldItem = scene.oven;
                scene.oven.setDepth(10);
                // Remove the collider so the oven can move freely.
                scene.physics.world.colliders.getActive().forEach(collider => {
                    if (
                        (collider.object1 === scene.player && collider.object2 === scene.oven) ||
                        (collider.object2 === scene.player && collider.object1 === scene.oven)
                    ) {
                        collider.destroy();
                    }
                });
            } else if (bestCandidate.type === 'flour') {
                // Clone the flour so that the original remains.
                let clonedFlour = scene.physics.add.sprite(scene.flour.x, scene.flour.y, 'flour').setDepth(10);
                scene.heldItem = clonedFlour;
            } else if (bestCandidate.type === 'mixer') {
                scene.heldItem = scene.mixer;
                scene.mixer.setDepth(10);
            }
        }
    }
}

function handleRotation(scene) {
    // Only allow rotation if the held item is the oven.
    if (scene.heldItem === scene.oven) {
        const rotations = ["bottom_left", "bottom_right", "up_right", "up_left"];
        let currentIndex = rotations.indexOf(scene.heldItem.currentRotation);
        scene.heldItem.currentRotation = rotations[(currentIndex + 1) % rotations.length];
        let newTexture = scene.heldItem.isOn ?
            (scene.heldItem.currentRotation.includes("up") ? "oven_on_up" : "oven_on_down") :
            (scene.heldItem.currentRotation.includes("up") ? "oven_off_up" : "oven_off_down");
        scene.heldItem.setTexture(newTexture);
        scene.heldItem.setFlipX(currentIndex === 1 || currentIndex === 2);
    }
}

function toggleOven(scene) {
    // Toggle the oven only if the player is near it.
    if (Phaser.Math.Distance.Between(scene.player.x, scene.player.y, scene.oven.x, scene.oven.y) < 60) {
        scene.oven.isOn = !scene.oven.isOn;

        if (!scene.oven.currentRotation) {
            scene.oven.currentRotation = "bottom_right";
        }

        let newTexture = scene.oven.isOn ?
            (scene.oven.currentRotation.includes("up") ? "oven_on_up" : "oven_on_down") :
            (scene.oven.currentRotation.includes("up") ? "oven_off_up" : "oven_off_down");
        scene.oven.setTexture(newTexture);
        console.log(`Oven is now ${scene.oven.isOn ? "ON" : "OFF"}`);
    }
}
