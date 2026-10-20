import Phaser from 'phaser';
import { config } from './config/gameConfig.js';

window.addEventListener('DOMContentLoaded', () => {
  const game = new Phaser.Game(config);
  // Expose instance for testing & verification
  window.__PHASER_GAME__ = game;
});
