import Phaser from 'phaser';

export class Umbrella extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   */
  constructor(scene, x, y) {
    super(scene, x, y, 'umbrella');
    this.initialX = x;
    this.initialY = y;
    this.isCarried = false;
    this.isUsed = false;

    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.body.setSize(22, 22);
    this.setDepth(20 + Math.floor(y / 10));

    // Floating prompt
    this.promptContainer = scene.add.container(x, y - 24);
    this.promptContainer.setDepth(90);
    this.promptContainer.setVisible(false);

    const bg = scene.add.graphics();
    bg.fillStyle(0x0f172a, 0.95);
    bg.fillRoundedRect(-65, -12, 130, 24, 6);
    bg.lineStyle(1.5, 0xf59e0b, 0.9);
    bg.strokeRoundedRect(-65, -12, 130, 24, 6);

    const txt = scene.add.text(0, 0, '[E] Coger paraguas / Take', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '10px',
      fontWeight: '700',
      color: '#fbbf24'
    }).setOrigin(0.5);

    this.promptContainer.add([bg, txt]);
    this.promptContainer.setSize(130, 24);
    this.promptContainer.setInteractive({ useHandCursor: true });
    this.promptContainer.on('pointerdown', () => {
      if (this.onPickupCallback) this.onPickupCallback(this);
    });
  }

  pickup(player) {
    this.isCarried = true;
    this.promptContainer.setVisible(false);
    if (this.body) this.body.enable = false;
  }

  reset() {
    this.isCarried = false;
    this.isUsed = false;
    this.setPosition(this.initialX, this.initialY);
    this.setDepth(20 + Math.floor(this.initialY / 10));
    this.promptContainer.setPosition(this.initialX, this.initialY - 24);
    this.promptContainer.setVisible(false);
    if (this.body) {
      this.body.enable = true;
      this.body.reset(this.initialX, this.initialY);
    }
  }

  setVisible(value) {
    super.setVisible(value);
    if (!value && this.promptContainer) {
      this.promptContainer.setVisible(false);
    }
    return this;
  }

  updateCarried(player) {
    if (!this.isCarried || !player) return;
    this.setPosition(player.x + 8, player.y - 24);
    this.setDepth(player.depth + 2);
  }

  updateProximity(player, isAnyCarried) {
    if (this.isCarried || this.isUsed || !this.visible) {
      this.promptContainer.setVisible(false);
      return;
    }
    const dist = Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y);
    this.promptContainer.setVisible(dist <= 55 && !isAnyCarried);
  }

  destroy(fromScene) {
    if (this.promptContainer) this.promptContainer.destroy();
    super.destroy(fromScene);
  }
}
