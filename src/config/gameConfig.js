import Phaser from 'phaser';
import { GAME_CONFIG } from './constants.js';
import { BootScene } from '../scenes/BootScene.js';
import { TitleScene } from '../scenes/TitleScene.js';
import { PlazaScene } from '../scenes/PlazaScene.js';

export const config = {
  type: Phaser.AUTO,
  parent: GAME_CONFIG.PARENT_ID,
  width: GAME_CONFIG.WIDTH,
  height: GAME_CONFIG.HEIGHT,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  backgroundColor: '#0f141c',
  scene: [BootScene, TitleScene, PlazaScene]
};
