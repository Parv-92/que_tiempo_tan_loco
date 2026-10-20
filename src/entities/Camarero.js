import Phaser from 'phaser';

export class Camarero extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   */
  constructor(scene, x, y) {
    super(scene, x, y, 'camarero');

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Immovable

    this.body.setSize(22, 16);
    this.body.setOffset(5, 26);
    this.setDepth(20 + Math.floor(y / 10));

    this.interactionRadius = 75;
    this.isPlayerNearby = false;

    // Interaction Prompt Bubble
    this.createPromptBubble(scene);

    // Subtle idle breathing
    scene.tweens.add({
      targets: this,
      y: y - 2,
      duration: 1300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createPromptBubble(scene) {
    this.promptContainer = scene.add.container(this.x, this.y - 38);
    this.promptContainer.setDepth(90);
    this.promptContainer.setVisible(false);

    const bubbleWidth = 144;
    const bubbleHeight = 30;

    const bg = scene.add.graphics();
    bg.fillStyle(0x0f172a, 0.95);
    bg.fillRoundedRect(-bubbleWidth / 2, -bubbleHeight / 2, bubbleWidth, bubbleHeight, 8);
    bg.lineStyle(1.5, 0x10b981, 0.9);
    bg.strokeRoundedRect(-bubbleWidth / 2, -bubbleHeight / 2, bubbleWidth, bubbleHeight, 8);

    const textEs = scene.add.text(0, -6, '[E] Hablar con el camarero', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '11px',
      fontWeight: '700',
      color: '#34d399',
      align: 'center'
    }).setOrigin(0.5);

    const textEn = scene.add.text(0, 7, 'Press [E] or [Space] to talk', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '8px',
      color: '#cbd5e1',
      align: 'center'
    }).setOrigin(0.5);

    this.promptContainer.add([bg, textEs, textEn]);
    this.promptContainer.setSize(bubbleWidth, bubbleHeight);
    this.promptContainer.setInteractive({ useHandCursor: true });
    this.promptContainer.on('pointerdown', () => {
      if (this.isPlayerNearby && this.onInteractCallback) {
        this.onInteractCallback();
      }
    });

    scene.tweens.add({
      targets: this.promptContainer,
      y: this.y - 42,
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  setVisible(value) {
    super.setVisible(value);
    if (!value && this.promptContainer) {
      this.promptContainer.setVisible(false);
      this.isPlayerNearby = false;
    }
    return this;
  }

  updateProximity(player, isDialogueOpen) {
    if (!player || !this.visible) {
      if (this.promptContainer) this.promptContainer.setVisible(false);
      this.isPlayerNearby = false;
      return;
    }

    const dist = Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y);
    const enterRadius = this.interactionRadius; // 75
    const exitRadius = this.interactionRadius + 15; // 90

    if (this.isPlayerNearby) {
      this.isPlayerNearby = dist <= exitRadius;
    } else {
      this.isPlayerNearby = dist <= enterRadius;
    }

    this.promptContainer.setVisible(this.isPlayerNearby && !isDialogueOpen);
  }

  hidePrompt() {
    if (this.promptContainer) {
      this.promptContainer.setVisible(false);
    }
  }

  destroy(fromScene) {
    if (this.promptContainer) this.promptContainer.destroy();
    super.destroy(fromScene);
  }
}
