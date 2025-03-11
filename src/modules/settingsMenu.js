export default function createSettingsMenu(scene, gridGraphics) {
  const centerX = scene.cameras.main.centerX;
  const centerY = scene.cameras.main.centerY;
  const settingsContainer = scene.add.container(centerX, centerY);
  
  const bg = scene.add.rectangle(0, 0, 300, 200, 0x000000, 0.8);
  bg.setOrigin(0.5);
  
  const header = scene.add.text(-140, -80, "Settings", { fontSize: '32px', fill: '#fff' });
  const gridToggleText = scene.add.text(-140, -20, "Toggle Grid: ON", { fontSize: '24px', fill: '#fff' })
    .setInteractive();
  
  gridToggleText.on('pointerdown', () => {
    gridGraphics.visible = !gridGraphics.visible;
    gridToggleText.setText("Toggle Grid: " + (gridGraphics.visible ? "ON" : "OFF"));
  });
  
  settingsContainer.add([bg, header, gridToggleText]);
  settingsContainer.setVisible(false);
  
  return settingsContainer;
}
