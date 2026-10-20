import Phaser from 'phaser';
import { Chair } from '../entities/Chair.js';
import { Camarero } from '../entities/Camarero.js';

export class CafeTask {
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

    this.totalChairs = 2;
    this.placedCount = 0;
    this.carriedChair = null;
    this.isCompleted = false;

    // Sheltered awning drop zone bounds
    this.shelterZone = {
      xMin: 805,
      xMax: 875,
      yMin: 210,
      yMax: 260,
      centerX: 840,
      centerY: 235
    };

    // Designated resting slots under the awning
    this.dropSlots = [
      { x: 830, y: 232 },
      { x: 855, y: 232 }
    ];

    // Spawn Camarero NPC
    this.camarero = new Camarero(scene, 815, 260);

    // Spawn Outdoor Chairs
    this.chairs = [
      new Chair(scene, 1, 765, 320),
      new Chair(scene, 2, 860, 345)
    ];

    // Create visually guided sheltered drop zone graphic
    this.createShelterGraphic(scene);
  }

  createShelterGraphic(scene) {
    this.shelterMarker = scene.add.container(this.shelterZone.centerX, this.shelterZone.centerY);
    this.shelterMarker.setDepth(17);

    const w = 70;
    const h = 44;

    const bg = scene.add.graphics();
    bg.fillStyle(0x0284c7, 0.22);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 8);
    bg.lineStyle(1.5, 0x38bdf8, 0.75);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);

    const label = scene.add.text(0, -2, '☂️ Toldo', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '10px',
      fontWeight: '700',
      color: '#e0f2fe'
    }).setOrigin(0.5);

    this.shelterMarker.add([bg, label]);

    // Pulse animation when carrying chair
    scene.tweens.add({
      targets: this.shelterMarker,
      scaleX: 1.06,
      scaleY: 1.06,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  isInShelteredZone(player) {
    if (!player) return false;
    return (
      player.x >= this.shelterZone.xMin &&
      player.x <= this.shelterZone.xMax &&
      player.y >= this.shelterZone.yMin &&
      player.y <= this.shelterZone.yMax
    );
  }

  /**
   * Attempts interaction with chairs or shelter area
   * @param {Player} player
   * @returns {boolean} true if chair interaction occurred
   */
  handleChairInteraction(player) {
    if (!player) return false;

    // 1. Player is currently carrying a chair -> try to place it
    if (this.carriedChair) {
      if (this.isInShelteredZone(player)) {
        // Correct placement under the awning!
        const slot = this.dropSlots[this.placedCount] || this.dropSlots[0];
        const chair = this.carriedChair;
        chair.placeAt(slot.x, slot.y);
        this.carriedChair = null;
        this.placedCount++;

        const isFinished = this.placedCount >= this.totalChairs;

        // Feedback
        if (this.options.onFeedback) {
          const msgEs = isFinished
            ? '¡Excelente! Todas las sillas están a salvo de la lluvia.'
            : `¡Muy bien! Has protegido la silla de la lluvia. (${this.placedCount}/${this.totalChairs})`;
          const msgEn = isFinished
            ? 'Excellent! All chairs are safe from the rain.'
            : `Well done! You protected the chair from the rain. (${this.placedCount}/${this.totalChairs})`;
          this.options.onFeedback(msgEs, msgEn, true);
        }

        if (this.options.onUpdateHUD) {
          this.options.onUpdateHUD(this.placedCount, this.totalChairs);
        }

        if (isFinished && !this.isCompleted) {
          this.isCompleted = true;
          if (this.options.onTaskComplete) {
            this.scene.time.delayedCall(600, () => {
              this.options.onTaskComplete();
            });
          }
        }
        return true;
      } else {
        // Incorrect area feedback
        if (this.options.onFeedback) {
          this.options.onFeedback(
            '«Aquí todavía llueve. Coloca la silla bajo el toldo del café.»',
            '"It is still raining here. Place the chair under the café awning."',
            false
          );
        }
        return true;
      }
    }

    // 2. Player is not carrying a chair -> check if near an unplaced chair
    for (const chair of this.chairs) {
      if (!chair.isPlaced && !chair.isCarried) {
        const dist = Phaser.Math.Distance.Between(player.x, player.y, chair.x, chair.y);
        if (dist <= 55) {
          this.carriedChair = chair;
          chair.pickup(player);

          if (this.options.onFeedback) {
            this.options.onFeedback(
              'Has cogido la silla. Llévala bajo el toldo del café.',
              'You picked up the chair. Carry it under the café awning.',
              true
            );
          }
          return true;
        }
      }
    }

    return false;
  }

  update(player, isDialogueOpen) {
    // Update Camarero proximity
    if (this.camarero) {
      this.camarero.updateProximity(player, isDialogueOpen);
    }

    // Update chairs
    const isAnyCarried = Boolean(this.carriedChair);
    this.chairs.forEach((chair) => {
      chair.updateProximity(player, isAnyCarried);
    });

    if (this.carriedChair) {
      this.carriedChair.updateCarried(player);
    }
  }

  reset() {
    this.placedCount = 0;
    this.carriedChair = null;
    this.isCompleted = false;
    this.chairs.forEach((c) => c.reset());
  }

  destroy() {
    if (this.shelterMarker) this.shelterMarker.destroy();
    if (this.camarero) this.camarero.destroy();
    this.chairs.forEach((c) => c.destroy());
  }
}
