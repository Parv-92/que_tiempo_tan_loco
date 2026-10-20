import Phaser from 'phaser';

export class ColdTask {
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

    this.hasChaqueta = false;
    this.hasBufanda = false;
    this.isCompleted = false;

    // Item 1: Chaqueta (warm winter jacket) on bench railing
    this.chaqueta = scene.physics.add.sprite(480, 480, 'chaqueta');
    this.chaqueta.initialX = 480;
    this.chaqueta.initialY = 480;
    this.chaqueta.body.setSize(22, 22);
    this.chaqueta.setDepth(18);

    // Item 2: Bufanda (warm winter scarf) by fountain planter
    this.bufanda = scene.physics.add.sprite(600, 310, 'bufanda');
    this.bufanda.initialX = 600;
    this.bufanda.initialY = 310;
    this.bufanda.body.setSize(22, 20);
    this.bufanda.setDepth(18);

    this.setVisible(false);
  }

  setVisible(visible) {
    this.chaqueta.setVisible(visible && !this.hasChaqueta);
    this.chaqueta.body.enable = visible && !this.hasChaqueta;
    this.bufanda.setVisible(visible && !this.hasBufanda);
    this.bufanda.body.enable = visible && !this.hasBufanda;
  }

  handleInteraction(player) {
    if (!player || !this.chaqueta.scene) return false;

    // Pick up Chaqueta
    if (!this.hasChaqueta && this.chaqueta.visible) {
      const dist = Phaser.Math.Distance.Between(player.x, player.y, this.chaqueta.x, this.chaqueta.y);
      if (dist <= 50) {
        this.hasChaqueta = true;
        this.chaqueta.setVisible(false);
        this.chaqueta.body.enable = false;

        const count = (this.hasChaqueta ? 1 : 0) + (this.hasBufanda ? 1 : 0);
        if (this.options.onFeedback) {
          this.options.onFeedback(
            `Has cogido la chaqueta (${count}/2).`,
            `You picked up the jacket (${count}/2).`,
            true
          );
        }
        if (this.options.onUpdateHUD) this.options.onUpdateHUD(count, 2);
        this.checkDeliveryReady();
        return true;
      }
    }

    // Pick up Bufanda
    if (!this.hasBufanda && this.bufanda.visible) {
      const dist = Phaser.Math.Distance.Between(player.x, player.y, this.bufanda.x, this.bufanda.y);
      if (dist <= 50) {
        this.hasBufanda = true;
        this.bufanda.setVisible(false);
        this.bufanda.body.enable = false;

        const count = (this.hasChaqueta ? 1 : 0) + (this.hasBufanda ? 1 : 0);
        if (this.options.onFeedback) {
          this.options.onFeedback(
            `Has cogido la bufanda (${count}/2).`,
            `You picked up the scarf (${count}/2).`,
            true
          );
        }
        if (this.options.onUpdateHUD) this.options.onUpdateHUD(count, 2);
        this.checkDeliveryReady();
        return true;
      }
    }

    return false;
  }

  checkDeliveryReady() {
    if (this.hasChaqueta && this.hasBufanda && !this.isCompleted) {
      this.isCompleted = true;
      if (this.options.onReadyForDonMateo) {
        this.options.onReadyForDonMateo();
      }
      if (this.options.onFeedback) {
        this.options.onFeedback(
          '¡Tienes la chaqueta y la bufanda! Entrégalas a Don Mateo.',
          'You have the jacket and the scarf! Deliver them to Don Mateo.',
          true
        );
      }
    }
  }

  reset() {
    this.hasChaqueta = false;
    this.hasBufanda = false;
    this.isCompleted = false;
    this.chaqueta.setPosition(this.chaqueta.initialX, this.chaqueta.initialY);
    this.bufanda.setPosition(this.bufanda.initialX, this.bufanda.initialY);
    this.setVisible(true);
  }

  destroy() {
    this.chaqueta.destroy();
    this.bufanda.destroy();
  }
}
