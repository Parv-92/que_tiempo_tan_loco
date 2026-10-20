import Phaser from 'phaser';
import { SCENE_KEYS, TEXTS } from '../config/constants.js';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.TITLE });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background backdrop with rich Spanish terracotta & twilight navy gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x181e2b, 0x181e2b, 0x0f131a, 0x0f131a, 1);
    bg.fillRect(0, 0, width, height);

    // Warm sunburst decorative glow at the top
    const sunGlow = this.add.graphics();
    sunGlow.fillStyle(0xf59e0b, 0.08);
    sunGlow.fillCircle(width / 2, 160, 320);
    sunGlow.fillStyle(0xf59e0b, 0.04);
    sunGlow.fillCircle(width / 2, 160, 480);

    // Architectural decorative arch line
    const arch = this.add.graphics();
    arch.lineStyle(1.5, 0xf59e0b, 0.22);
    arch.strokeCircle(width / 2, 350, 280);

    // Main Title: ¡Qué Tiempo Tan Loco!
    const titleText = this.add.text(width / 2, 205, TEXTS.TITLE, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '56px',
      fontStyle: '800',
      color: '#fbbf24',
      align: 'center',
      stroke: '#78350f',
      strokeThickness: 4,
      shadow: {
        offsetX: 0,
        offsetY: 8,
        color: '#000000',
        blur: 16,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5);

    // Creator Credit (centered, smaller than title, visually subtle)
    this.add.text(width / 2, 255, 'Made by — Parv Choudhary (25BRS1143)', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '13px',
      fontWeight: '600',
      color: '#cbd5e1',
      align: 'center'
    }).setOrigin(0.5);

    // Subtitle (Spanish primary)
    this.add.text(width / 2, 312, TEXTS.SUBTITLE_ES, {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '20px',
      fontWeight: '600',
      color: '#f8fafc',
      align: 'center'
    }).setOrigin(0.5);

    // Subtitle (English guide)
    this.add.text(width / 2, 344, TEXTS.SUBTITLE_EN, {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '15px',
      color: '#94a3b8',
      align: 'center'
    }).setOrigin(0.5);

    // Play Button (Interactive)
    const btnWidth = 320;
    const btnHeight = 64;
    const btnX = width / 2;
    const btnY = 460;

    const btnContainer = this.add.container(btnX, btnY);

    const btnBg = this.add.graphics();
    btnBg.fillStyle(0xf59e0b, 1);
    btnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 16);
    btnBg.lineStyle(2, 0xfde68a, 0.8);
    btnBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 16);

    const btnTextEs = this.add.text(0, -9, TEXTS.PLAY_BUTTON_ES, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '22px',
      fontWeight: '800',
      color: '#1e1b4b',
      align: 'center'
    }).setOrigin(0.5);

    const btnTextEn = this.add.text(0, 15, TEXTS.PLAY_BUTTON_EN, {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '13px',
      fontWeight: '600',
      color: '#78350f',
      align: 'center'
    }).setOrigin(0.5);

    btnContainer.add([btnBg, btnTextEs, btnTextEn]);
    btnContainer.setSize(btnWidth, btnHeight);
    btnContainer.setInteractive({ useHandCursor: true });

    // Interactive button hover animations
    btnContainer.on('pointerover', () => {
      btnBg.clear();
      btnBg.fillStyle(0xfbbf24, 1);
      btnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 16);
      btnBg.lineStyle(2, 0xfffbeb, 1);
      btnBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 16);
      this.tweens.add({
        targets: btnContainer,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 120,
        ease: 'Sine.easeOut'
      });
    });

    btnContainer.on('pointerout', () => {
      btnBg.clear();
      btnBg.fillStyle(0xf59e0b, 1);
      btnBg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 16);
      btnBg.lineStyle(2, 0xfde68a, 0.8);
      btnBg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 16);
      this.tweens.add({
        targets: btnContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 120,
        ease: 'Sine.easeOut'
      });
    });

    btnContainer.on('pointerdown', () => {
      this.scene.start(SCENE_KEYS.PLAZA);
    });

    // Footer note
    this.add.text(width / 2, 664, 'Español para principiantes • Spanish Weather Exploration Game', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '12px',
      color: '#64748b'
    }).setOrigin(0.5);
  }
}
