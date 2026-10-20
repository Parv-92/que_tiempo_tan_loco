import Phaser from 'phaser';

/**
 * Shared animated attention arrow indicator that gently bounces
 * above any given GameObject, NPC, item, or coordinate.
 */
export class QuestIndicator {
  /**
   * @param {Phaser.Scene} scene
   * @param {Phaser.GameObjects.GameObject|{x: number, y: number}} target
   * @param {Object} [options]
   * @param {number} [options.offsetY=-32]
   * @param {number} [options.color=0xf59e0b]
   * @param {number} [options.borderColor=0x78350f]
   * @param {number} [options.depth=95]
   */
  constructor(scene, target, options = {}) {
    this.scene = scene;
    this.target = target;
    this.offsetY = options.offsetY !== undefined ? options.offsetY : -32;
    this.color = options.color || 0xf59e0b;
    this.borderColor = options.borderColor || 0x78350f;
    this.depth = options.depth || 95;

    const initialX = target && target.x !== undefined ? target.x : 0;
    const initialY = target && target.y !== undefined ? target.y + this.offsetY : 0;

    this.container = scene.add.container(initialX, initialY);
    this.container.setDepth(this.depth);

    // Create downward-pointing triangular arrow
    this.arrowGfx = scene.add.graphics();
    this.arrowGfx.fillStyle(this.color, 1);
    this.arrowGfx.lineStyle(1.5, this.borderColor, 1);
    this.arrowGfx.beginPath();
    this.arrowGfx.moveTo(-7, -9);
    this.arrowGfx.lineTo(7, -9);
    this.arrowGfx.lineTo(0, 3);
    this.arrowGfx.closePath();
    this.arrowGfx.fillPath();
    this.arrowGfx.strokePath();

    this.container.add(this.arrowGfx);

    // Vertical bounce tween
    this.tween = scene.tweens.add({
      targets: this.arrowGfx,
      y: -6,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Updates indicator position to match target (even if target is moving)
   */
  update() {
    if (!this.container || !this.container.scene) return;
    if (!this.target) {
      this.setVisible(false);
      return;
    }

    // If target has visibility or active property, mirror it
    if (this.target.visible !== undefined && !this.target.visible) {
      this.container.setVisible(false);
      return;
    }

    this.container.setPosition(this.target.x, this.target.y + this.offsetY);
  }

  setTarget(newTarget) {
    this.target = newTarget;
    this.update();
  }

  setVisible(visible) {
    if (this.container && this.container.scene) {
      this.container.setVisible(Boolean(visible));
    }
  }

  destroy() {
    if (this.tween) {
      this.tween.stop();
      this.tween = null;
    }
    if (this.container) {
      this.container.destroy();
      this.container = null;
    }
  }
}
