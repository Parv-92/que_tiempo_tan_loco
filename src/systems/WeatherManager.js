export class WeatherManager {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.currentWeather = 'sunny';
    this.listeners = [];

    this.weatherCycles = ['sunny', 'rain', 'wind', 'cold', 'heat'];

    const { width, height } = scene.cameras.main;

    // 1. Ambient atmospheric overlay
    this.tintOverlay = scene.add.graphics();
    this.tintOverlay.fillRect(0, 0, width, height);
    this.tintOverlay.setAlpha(0);
    this.tintOverlay.setDepth(15);

    // 2. Rain particle emitter
    this.rainEmitter = scene.add.particles(0, 0, 'rain_drop', {
      x: { min: -40, max: width + 60 },
      y: -20,
      lifespan: 1100,
      speedY: { min: 650, max: 850 },
      speedX: { min: -85, max: -45 },
      quantity: 6,
      scaleY: { min: 1, max: 1.4 },
      alpha: { start: 0.75, end: 0.2 },
      emitting: false
    });
    this.rainEmitter.setDepth(70);

    // 3. Wind leaves particle emitter
    this.windEmitter = scene.add.particles(0, 0, 'wind_leaf', {
      x: -30,
      y: { min: 40, max: height - 60 },
      lifespan: 2200,
      speedX: { min: 450, max: 680 },
      speedY: { min: 20, max: 90 },
      rotate: { start: 0, end: 360 },
      quantity: 3,
      scale: { min: 0.8, max: 1.3 },
      alpha: { start: 0.9, end: 0.25 },
      emitting: false
    });
    this.windEmitter.setDepth(70);

    // 4. Cold snow particle emitter
    this.snowEmitter = scene.add.particles(0, 0, 'snowflake', {
      x: { min: 0, max: width },
      y: -10,
      lifespan: 3400,
      speedY: { min: 45, max: 85 },
      speedX: { min: -25, max: 25 },
      scale: { min: 0.7, max: 1.3 },
      alpha: { start: 0.85, end: 0.3 },
      quantity: 2,
      emitting: false
    });
    this.snowEmitter.setDepth(70);

    // 5. Rain puddle ripple timer
    this.rippleTimer = scene.time.addEvent({
      delay: 380,
      loop: true,
      callback: () => {
        if (this.currentWeather === 'rain') {
          this.spawnPuddleRipple();
        }
      }
    });
  }

  spawnPuddleRipple() {
    const rx = Phaser.Math.Between(260, 960);
    const ry = Phaser.Math.Between(240, 530);

    const ripple = this.scene.add.graphics();
    ripple.setDepth(18);
    ripple.lineStyle(1.5, 0x93c5fd, 0.6);
    ripple.strokeEllipse(rx, ry, 6, 3);

    this.scene.tweens.add({
      targets: ripple,
      scaleX: 3.5,
      scaleY: 3.5,
      alpha: 0,
      duration: 650,
      ease: 'Sine.easeOut',
      onComplete: () => ripple.destroy()
    });
  }

  /**
   * Sets weather state and updates atmospheric visuals
   * @param {'sunny' | 'rain' | 'wind' | 'cold' | 'heat'} state
   */
  setWeather(state) {
    if (this.currentWeather === state) return;
    this.currentWeather = state;

    // Stop all emitters
    this.rainEmitter.stop();
    this.windEmitter.stop();
    this.snowEmitter.stop();

    const { width, height } = this.scene.cameras.main;

    switch (state) {
      case 'rain':
        this.tintOverlay.clear();
        this.tintOverlay.fillStyle(0x0f172a, 1);
        this.tintOverlay.fillRect(0, 0, width, height);
        this.scene.tweens.add({
          targets: this.tintOverlay,
          alpha: 0.28,
          duration: 600,
          ease: 'Sine.easeInOut'
        });
        this.rainEmitter.start();
        break;

      case 'wind':
        this.tintOverlay.clear();
        this.tintOverlay.fillStyle(0x334155, 1);
        this.tintOverlay.fillRect(0, 0, width, height);
        this.scene.tweens.add({
          targets: this.tintOverlay,
          alpha: 0.12,
          duration: 600,
          ease: 'Sine.easeInOut'
        });
        this.windEmitter.start();
        break;

      case 'cold':
        this.tintOverlay.clear();
        this.tintOverlay.fillStyle(0x1e3a8a, 1); // Frost blue
        this.tintOverlay.fillRect(0, 0, width, height);
        this.scene.tweens.add({
          targets: this.tintOverlay,
          alpha: 0.22,
          duration: 600,
          ease: 'Sine.easeInOut'
        });
        this.snowEmitter.start();
        break;

      case 'heat':
        this.tintOverlay.clear();
        this.tintOverlay.fillStyle(0xf59e0b, 1); // Sun heat glare
        this.tintOverlay.fillRect(0, 0, width, height);
        this.scene.tweens.add({
          targets: this.tintOverlay,
          alpha: 0.16,
          duration: 600,
          ease: 'Sine.easeInOut'
        });
        break;

      case 'sunny':
      default:
        this.scene.tweens.add({
          targets: this.tintOverlay,
          alpha: 0,
          duration: 600,
          ease: 'Sine.easeInOut'
        });
        break;
    }

    // Notify listeners
    this.listeners.forEach((cb) => cb(this.currentWeather));
  }

  /**
   * Advances to next weather in cycle
   */
  cycleNextWeather() {
    const idx = this.weatherCycles.indexOf(this.currentWeather);
    const nextIdx = (idx + 1) % this.weatherCycles.length;
    this.setWeather(this.weatherCycles[nextIdx]);
  }

  isRaining() {
    return this.currentWeather === 'rain';
  }

  onWeatherChange(callback) {
    this.listeners.push(callback);
  }

  destroy() {
    if (this.rippleTimer) this.rippleTimer.remove();
    if (this.tintOverlay) this.tintOverlay.destroy();
    if (this.rainEmitter) this.rainEmitter.destroy();
    if (this.windEmitter) this.windEmitter.destroy();
    if (this.snowEmitter) this.snowEmitter.destroy();
  }
}
