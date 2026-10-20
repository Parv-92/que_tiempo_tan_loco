import Phaser from 'phaser';

export class WindTask {
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

    this.totalPapers = 2;
    this.collectedCount = 0;
    this.isDelivered = false;
    this.isCompleted = false;

    // 1. Carmen the Market Vendor NPC
    this.carmen = scene.physics.add.sprite(200, 290, 'carmen');
    this.carmen.body.setSize(22, 16);
    this.carmen.body.setOffset(5, 26);
    this.carmen.setImmovable(true);
    this.carmen.setDepth(20 + Math.floor(290 / 10));

    this.createCarmenPrompt(scene);

    // 2. Scattered Papers on plaza
    this.paperSpots = [
      { id: 1, x: 520, y: 360 },
      { id: 2, x: 680, y: 470 }
    ];

    this.papers = this.paperSpots.map((spot) => {
      const p = scene.physics.add.sprite(spot.x, spot.y, 'paper');
      p.paperId = spot.id;
      p.initialX = spot.x;
      p.initialY = spot.y;
      p.isCollected = false;
      p.body.setSize(18, 18);
      p.setDepth(18);

      // Gentle floating animation
      scene.tweens.add({
        targets: p,
        y: spot.y - 4,
        angle: 8,
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      return p;
    });

    // Destination highlight marker at market stall
    this.createMarketMarker(scene);

    this.setVisible(false); // Hidden until wind weather is active
  }

  createCarmenPrompt(scene) {
    this.promptContainer = scene.add.container(200, 290 - 38);
    this.promptContainer.setDepth(90);
    this.promptContainer.setVisible(false);

    const w = 140;
    const h = 28;
    const bg = scene.add.graphics();
    bg.fillStyle(0x0f172a, 0.95);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 6);
    bg.lineStyle(1.5, 0xd97706, 0.9);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 6);

    const txt = scene.add.text(0, 0, '[E] Hablar con Carmen', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '11px',
      fontWeight: '700',
      color: '#f59e0b'
    }).setOrigin(0.5);

    this.promptContainer.add([bg, txt]);
  }

  createMarketMarker(scene) {
    this.marketMarker = scene.add.container(200, 260);
    this.marketMarker.setDepth(17);

    const bg = scene.add.graphics();
    bg.fillStyle(0xd97706, 0.2);
    bg.fillRoundedRect(-35, -20, 70, 40, 8);
    bg.lineStyle(1.5, 0xf59e0b, 0.8);
    bg.strokeRoundedRect(-35, -20, 70, 40, 8);

    const txt = scene.add.text(0, 0, '📦 Mercado', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '10px',
      fontWeight: '700',
      color: '#fde68a'
    }).setOrigin(0.5);

    this.marketMarker.add([bg, txt]);
  }

  setVisible(visible) {
    this.carmen.setVisible(visible);
    this.carmen.body.enable = visible;
    this.marketMarker.setVisible(visible);
    if (!visible) this.promptContainer.setVisible(false);

    this.papers.forEach((p) => {
      p.setVisible(visible && !p.isCollected);
      p.body.enable = visible && !p.isCollected;
    });
  }

  handleInteraction(player) {
    if (!player || !this.carmen.visible) return false;

    // 1. Check if near Carmen to deliver papers or talk
    const distCarmen = Phaser.Math.Distance.Between(player.x, player.y, this.carmen.x, this.carmen.y);
    if (distCarmen <= 70) {
      if (this.collectedCount >= this.totalPapers && !this.isDelivered) {
        this.isDelivered = true;
        this.isCompleted = true;

        if (this.options.onFeedback) {
          this.options.onFeedback(
            '¡Papeles entregados! Carmen te da las gracias.',
            'Papers delivered! Carmen thanks you.',
            true
          );
        }

        if (this.options.onTaskComplete) {
          this.scene.time.delayedCall(600, () => this.options.onTaskComplete('wind'));
        }
        return true;
      }
      return false; // let PlazaScene open Carmen's dialogue
    }

    // 2. Check if near any uncollected paper
    for (const paper of this.papers) {
      if (!paper.isCollected) {
        const dist = Phaser.Math.Distance.Between(player.x, player.y, paper.x, paper.y);
        if (dist <= 50) {
          paper.isCollected = true;
          paper.setVisible(false);
          paper.body.enable = false;
          this.collectedCount++;

          const isAll = this.collectedCount >= this.totalPapers;
          const msgEs = isAll
            ? '¡Has recogido todos los papeles! Llévalos a Carmen en el mercado.'
            : `Has recogido un papel. (${this.collectedCount}/${this.totalPapers})`;
          const msgEn = isAll
            ? 'You collected all papers! Bring them to Carmen at the market.'
            : `You picked up a paper. (${this.collectedCount}/${this.totalPapers})`;

          if (this.options.onFeedback) {
            this.options.onFeedback(msgEs, msgEn, true);
          }

          if (this.options.onUpdateHUD) {
            this.options.onUpdateHUD(this.collectedCount, this.totalPapers);
          }
          return true;
        }
      }
    }

    return false;
  }

  update(player, isDialogueOpen) {
    if (!player || !this.carmen.visible) return;

    const dist = Phaser.Math.Distance.Between(player.x, player.y, this.carmen.x, this.carmen.y);
    this.promptContainer.setVisible(dist <= 70 && !isDialogueOpen);
  }

  reset() {
    this.collectedCount = 0;
    this.isDelivered = false;
    this.isCompleted = false;

    this.papers.forEach((p) => {
      p.isCollected = false;
      p.setPosition(p.initialX, p.initialY);
      p.setVisible(this.carmen.visible);
      p.body.enable = this.carmen.visible;
    });
  }

  destroy() {
    if (this.promptContainer) this.promptContainer.destroy();
    if (this.marketMarker) this.marketMarker.destroy();
    if (this.carmen) this.carmen.destroy();
    this.papers.forEach((p) => p.destroy());
  }
}
