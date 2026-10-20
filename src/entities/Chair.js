import Phaser from 'phaser';

export class Chair extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} id
   * @param {number} x
   * @param {number} y
   */
  constructor(scene, id, x, y) {
    super(scene, x, y, 'chair');
    this.chairId = id;
    this.initialX = x;
    this.initialY = y;
    this.isCarried = false;
    this.isPlaced = false;

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static body when placed/on ground

    this.body.setSize(20, 16);
    this.body.setOffset(4, 14);
    this.setDepth(20 + Math.floor(y / 10));

    // Floating interaction prompt
    this.promptContainer = scene.add.container(x, y - 24);
    this.promptContainer.setDepth(90);
    this.promptContainer.setVisible(false);

    const bg = scene.add.graphics();
    bg.fillStyle(0x0f172a, 0.95);
    bg.fillRoundedRect(-60, -12, 120, 24, 6);
    bg.lineStyle(1.5, 0xf59e0b, 0.9);
    bg.strokeRoundedRect(-60, -12, 120, 24, 6);

    const txt = scene.add.text(0, 0, '[E] Coger silla / Pick up', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '10px',
      fontWeight: '700',
      color: '#fbbf24'
    }).setOrigin(0.5);

    this.promptContainer.add([bg, txt]);
    this.promptContainer.setSize(120, 24);
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

  placeAt(x, y) {
    this.isCarried = false;
    this.isPlaced = true;
    this.setPosition(x, y);
    this.setDepth(20 + Math.floor(y / 10));
    this.promptContainer.setVisible(false);
    if (this.body) {
      this.body.enable = true;
      this.body.reset(x, y);
    }
  }

  reset() {
    this.isCarried = false;
    this.isPlaced = false;
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

    // Follow player closely above their head
    this.setPosition(player.x, player.y - 20);
    this.setDepth(player.depth + 1);
  }

  updateProximity(player, isAnyCarried) {
    if (this.isCarried || this.isPlaced) {
      this.promptContainer.setVisible(false);
      return;
    }

    const dist = Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y);
    const nearby = dist <= 65;
    // Show prompt only if nearby and player is not already carrying another chair
    this.promptContainer.setVisible(nearby && !isAnyCarried);
  }

  destroy(fromScene) {
    if (this.promptContainer) this.promptContainer.destroy();
    super.destroy(fromScene);
  }
}
