import Phaser from 'phaser';

export class HeatTask {
  /**
   * @param {Phaser.Scene} scene
   * @param {Object} options
   * @param {Function} options.onFeedback
   * @param {Function} options.onTaskComplete
   * @param {Function} options.onUpdateHUD
   */
  constructor(scene, options) {
    this.scene = scene;
    this.options = options;

    this.hasWater = false;
    this.isDelivered = false;
    this.isCompleted = false;

    // Sofia NPC resting in the sun
    this.sofia = scene.physics.add.sprite(600, 470, 'sofia');
    this.sofia.initialX = 600;
    this.sofia.initialY = 470;
    this.sofia.body.setSize(22, 16);
    this.sofia.body.setOffset(5, 26);
    this.sofia.setImmovable(true);
    this.sofia.setDepth(20 + Math.floor(470 / 10));

    // Shade zone under east tree at (730, 440)
    this.shadeZone = {
      xMin: 700,
      xMax: 760,
      yMin: 420,
      yMax: 470
    };

    this.createShadeMarker(scene);
    this.setVisible(false);
  }

  createShadeMarker(scene) {
    this.shadeMarker = scene.add.container(730, 445);
    this.shadeMarker.setDepth(17);

    const bg = scene.add.graphics();
    bg.fillStyle(0x047857, 0.22);
    bg.fillRoundedRect(-30, -20, 60, 40, 8);
    bg.lineStyle(1.5, 0x10b981, 0.8);
    bg.strokeRoundedRect(-30, -20, 60, 40, 8);

    const txt = scene.add.text(0, 0, '🌳 Sombra', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '10px',
      fontWeight: '700',
      color: '#a7f3d0'
    }).setOrigin(0.5);

    this.shadeMarker.add([bg, txt]);
  }

  setVisible(visible) {
    this.sofia.setVisible(visible);
    this.sofia.body.enable = visible;
    this.shadeMarker.setVisible(visible);
  }

  handleInteraction(player) {
    if (!player || !this.sofia.visible) return false;

    // 1. Central Fountain water collection
    const distFountain = Phaser.Math.Distance.Between(player.x, player.y, 640, 370);
    if (distFountain <= 90 && !this.hasWater) {
      this.hasWater = true;
      if (this.options.onFeedback) {
        this.options.onFeedback(
          'Has cogido agua fresca en la fuente. Llévala a Sofia.',
          'You got fresh water at the fountain. Bring it to Sofia.',
          true
        );
      }
      if (this.options.onUpdateHUD) {
        this.options.onUpdateHUD('Lleva el agua a Sofia y acompáñala a la sombra.', 'Bring water to Sofia and accompany her to shade.');
      }
      return true;
    }

    // 2. Deliver water to Sofia & move to shade
    const distSofia = Phaser.Math.Distance.Between(player.x, player.y, this.sofia.x, this.sofia.y);
    if (distSofia <= 65) {
      if (this.hasWater && !this.isDelivered) {
        this.isDelivered = true;

        // Sofia walks with player to shade
        this.scene.tweens.add({
          targets: this.sofia,
          x: 730,
          y: 445,
          duration: 1200,
          ease: 'Sine.easeInOut',
          onComplete: () => {
            this.isCompleted = true;
            if (this.options.onFeedback) {
              this.options.onFeedback(
                'Sofia tiene agua y está en la sombra.',
                'Sofia has water and is in the shade.',
                true
              );
            }
            if (this.options.onTaskComplete) {
              this.scene.time.delayedCall(500, () => this.options.onTaskComplete('heat'));
            }
          }
        });
        return true;
      }
    }

    return false;
  }

  reset() {
    this.hasWater = false;
    this.isDelivered = false;
    this.isCompleted = false;
    this.sofia.setPosition(this.sofia.initialX, this.sofia.initialY);
    this.setVisible(true);
  }

  destroy() {
    this.sofia.destroy();
    if (this.shadeMarker) this.shadeMarker.destroy();
  }
}
