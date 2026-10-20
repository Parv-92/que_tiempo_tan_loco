import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   */
  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    // Add to scene display and physics system
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Keep player strictly within the game canvas bounds
    this.setCollideWorldBounds(true);

    // Configure collision body at character's feet for natural 2.5D depth
    this.body.setSize(20, 14);
    this.body.setOffset(6, 28);

    // Movement speed (pixels per second) - reduced ~12.6% from 135 to 118 for deliberate, relaxed exploration
    this.speed = 118;

    // Movement lock flag (e.g. while dialogue is open)
    this.isMovementLocked = false;

    // Set up dual input controls: Arrow Keys + WASD
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // Initial depth
    this.setDepth(20);
  }

  /**
   * Locks or unlocks player movement
   * @param {boolean} locked
   */
  setMovementLock(locked) {
    this.isMovementLocked = locked;
    if (locked && this.body) {
      this.setVelocity(0, 0);
      if (this.scene.soundManager) {
        this.scene.soundManager.stopFootsteps();
      }
    }
  }

  update() {
    // Stop immediately if locked or destroyed
    if (this.isMovementLocked || !this.body) {
      this.setVelocity(0, 0);
      if (this.scene.soundManager) {
        this.scene.soundManager.stopFootsteps();
      }
      return;
    }

    let vx = 0;
    let vy = 0;

    // Horizontal input
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      vx -= 1;
      this.setFlipX(true);
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      vx += 1;
      this.setFlipX(false);
    }

    // Vertical input
    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      vy -= 1;
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      vy += 1;
    }

    // Normalize diagonal movement so player doesn't move faster diagonally
    if (vx !== 0 && vy !== 0) {
      vx *= Math.SQRT1_2;
      vy *= Math.SQRT1_2;
    }

    const isMoving = (vx !== 0 || vy !== 0);
    this.setVelocity(vx * this.speed, vy * this.speed);

    // Footstep audio: subtle footsteps when walking; stop immediately when stopped
    if (isMoving) {
      if (this.scene.soundManager) {
        this.scene.soundManager.playFootstep();
      }
    } else {
      if (this.scene.soundManager) {
        this.scene.soundManager.stopFootsteps();
      }
    }

    // Y-sorting: adjust depth dynamically based on Y position for depth ordering
    this.setDepth(20 + Math.floor(this.y / 10));
  }
}
