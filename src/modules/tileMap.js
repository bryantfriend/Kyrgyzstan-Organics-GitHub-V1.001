export default class TileMap {
  constructor(scene, levelData, tileSize = 32) {
    console.log('TileMap constructor called');
    this.scene = scene;
    this.levelData = levelData;
    this.tileSize = tileSize;
    this.tileTypes = {
      0: 'floor',       // Floor will be handled specially (using a spritesheet)
      1: 'wallTop',
      2: 'wallBottom',
      3: 'counterTop',
      4: 'counterBottom',
      5: 'road',
      6: 'roadCenter',
      7: 'roadSidewalk',
      8: 'sidewalk',
      9: 'roadSidewalkRight'
    };

    // Define which tile indices should have collisions.
    this.collidableIndices = [1, 2, 3, 4];

    // Create a static physics group to hold collidable tiles.
    this.collidableGroup = this.scene.physics.add.staticGroup();

    this.loadTiles(); // Queue assets for loading
  }

  loadTiles() {
    console.log('TileMap: Loading tiles...');
    // Load the floor as a spritesheet so you can choose among 5 variants.
    this.scene.load.spritesheet('floor', 'assets/floor.png', { frameWidth: 32, frameHeight: 32 });
    this.scene.load.image('wallTop', 'assets/wallTop.png');
    this.scene.load.image('wallBottom', 'assets/wallBottom.png');
    this.scene.load.image('counterTop', 'assets/counterTop.png');
    this.scene.load.image('counterBottom', 'assets/counterBottom.png');
    this.scene.load.image('road', 'assets/road.png');
    this.scene.load.image('roadCenter', 'assets/roadCenter.png');
    this.scene.load.image('roadSidewalk', 'assets/roadSidewalk.png');
    this.scene.load.image('sidewalk', 'assets/sidewalk.png');
    this.scene.load.image('roadSidewalkRight', 'assets/roadSidewalkRight.png');

    // Debug: log when the sidewalk asset is loaded.
    this.scene.load.on('filecomplete-image-sidewalk', () => {
      console.log('Sidewalk image loaded successfully.');
    });

    // Optional: log when all assets in this loader are complete.
    this.scene.load.on('complete', () => {
      console.log('All TileMap assets loaded.');
    });
  }

  renderTileMap() {
    console.log('Rendering tile map...');
    for (let row = 0; row < this.levelData.length; row++) {
      for (let col = 0; col < this.levelData[row].length; col++) {
        const tileIndex = this.levelData[row][col];
        const x = col * this.tileSize;
        const y = row * this.tileSize;
        const tileType = this.tileTypes[tileIndex];

        // Debug: warn if texture doesn't exist.
        if (!this.scene.textures.exists(tileType)) {
          console.warn(`Texture "${tileType}" not found. Row: ${row}, Col: ${col}`);
        }

        if (this.collidableIndices.includes(tileIndex)) {
          // For collidable tiles, use the regular image.
          const tile = this.collidableGroup.create(x, y, tileType);
          tile.setOrigin(0, 0).setDepth(0);
        } else {
          // For non-collidable tiles (i.e. floor or others):
          if (tileIndex === 0) {
            // Choose a variant for the floor tile.
            let variant = Phaser.Math.Between(0, 4);
            this.scene.add.image(x, y, 'floor', variant)
              .setOrigin(0)
              .setDepth(0);
          } else {
            this.scene.add.image(x, y, tileType)
              .setOrigin(0)
              .setDepth(0);
          }
        }
      }
    }
    console.log('Tile map rendering complete.');
  }
}
