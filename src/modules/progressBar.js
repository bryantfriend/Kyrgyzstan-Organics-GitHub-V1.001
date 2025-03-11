// src/modules/progressBar.js
export default function createProgressBar(scene, x, y, duration) {
  const barWidth = 100;
  const barHeight = 10;

  // Background rectangle for the progress bar
  const progressBarBg = scene.add.rectangle(x, y, barWidth, barHeight, 0x222222).setOrigin(0.5);

  // Foreground fill (starts at 0 width)
  const progressBarFill = scene.add.rectangle(x - barWidth / 2, y, 0, barHeight, 0xffffff).setOrigin(0, 0.5);

  return {
    setProgress: (progress) => {
      const clampedProgress = Phaser.Math.Clamp(progress, 0, 1);
      progressBarFill.width = clampedProgress * barWidth;
    },
    destroy: () => {
      progressBarBg.destroy();
      progressBarFill.destroy();
    }
  };
}
