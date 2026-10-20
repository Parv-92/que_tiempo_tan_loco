import Phaser from 'phaser';
import { ASSET_KEYS, SCENE_KEYS } from '../config/constants.js';
import { generateCharacterTextures } from '../entities/characterTextures.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.BOOT });
  }

  preload() {
    const { width, height } = this.cameras.main;

    // Background gradient or dark overlay
    const bgGraphics = this.add.graphics();
    bgGraphics.fillGradientStyle(0x0f172a, 0x0f172a, 0x1e293b, 0x1e293b, 1);
    bgGraphics.fillRect(0, 0, width, height);

    // Decorative emblem / title
    this.add.text(width / 2, height / 2 - 80, '¡Qué Tiempo Tan Loco!', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '36px',
      fontStyle: 'bold',
      color: '#f59e0b',
      align: 'center'
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(width / 2, height / 2 - 35, 'Cargando aventura en la plaza... / Loading plaza adventure...', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '16px',
      color: '#94a3b8',
      align: 'center'
    }).setOrigin(0.5);

    // Progress bar container
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    const barWidth = 400;
    const barHeight = 16;
    const barX = (width - barWidth) / 2;
    const barY = height / 2 + 30;

    progressBox.fillStyle(0x334155, 0.8);
    progressBox.fillRoundedRect(barX - 4, barY - 4, barWidth + 8, barHeight + 8, 8);
    progressBox.lineStyle(2, 0x64748b, 0.6);
    progressBox.strokeRoundedRect(barX - 4, barY - 4, barWidth + 8, barHeight + 8, 8);

    // Progress text
    const percentText = this.add.text(width / 2, barY + 36, '0%', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '14px',
      fontWeight: '600',
      color: '#cbd5e1'
    }).setOrigin(0.5);

    // Creator Credit
    this.add.text(width / 2, height - 32, 'Made by — Parv Choudhary (25BRS1143)', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '12px',
      fontWeight: '500',
      color: '#64748b',
      align: 'center'
    }).setOrigin(0.5);

    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xf59e0b, 1);
      progressBar.fillRoundedRect(barX, barY, barWidth * value, barHeight, 6);
      percentText.setText(`${Math.round(value * 100)}%`);
    });

    let mapAssetLoaded = false;

    // Listen specifically for our map asset load
    this.load.on(`filecomplete-image-${ASSET_KEYS.MAP_SUNNY.KEY}`, () => {
      mapAssetLoaded = true;
    });

    // Gracefully handle missing asset without crashing Phaser
    this.load.on('loaderror', (fileObj) => {
      console.warn(`[BootScene] Notice: Asset failed to load: ${fileObj.key} (${fileObj.src}). Fallback environment will be rendered.`);
    });

    // Queue map asset
    this.load.image(ASSET_KEYS.MAP_SUNNY.KEY, ASSET_KEYS.MAP_SUNNY.PATH);

    this.load.on('complete', () => {
      // Generate crisp character textures for Player and Don Mateo
      generateCharacterTextures(this);
      this.registry.set('hasMapAsset', mapAssetLoaded);
      // Small pause for smooth visual transition
      this.time.delayedCall(300, () => {
        this.scene.start(SCENE_KEYS.TITLE);
      });
    });
  }
}
