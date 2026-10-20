import { WeatherManager } from './WeatherManager.js';
import { CompletionModal } from '../ui/CompletionModal.js';
import { QuestManager } from './QuestManager.js';

export class WeatherCycleController {
  /**
   * @param {Phaser.Scene} scene
   * @param {Object} options
   * @param {GameHUD} options.hud
   * @param {Player} options.player
   */
  constructor(scene, options) {
    this.scene = scene;
    this.hud = options.hud;
    this.player = options.player;

    this.weatherManager = new WeatherManager(scene);

    this.completionModal = new CompletionModal(scene, {
      onReplay: (weatherType) => this.resetWeatherTask(weatherType),
      onCycleNext: () => this.startRandomWeatherEvent(),
      onReturnSunny: () => this.setWeather('sunny'),
      onClose: () => this.player.setMovementLock(false),
      onStartNewSession: () => this.startNewSession()
    });

    this.questManager = new QuestManager(scene, {
      hud: this.hud,
      player: this.player,
      donMateo: scene.donMateo,
      completionModal: this.completionModal,
      weatherManager: this.weatherManager
    });

    // Backward-compatibility aliases for scene references and existing tests
    this.umbrella = this.questManager.umbrella;
    this.cafeTask = {
      camarero: this.questManager.camarero,
      chairs: [this.questManager.rainChair],
      isCompleted: false,
      shelterMarker: { setVisible: () => {} }
    };
    this.windTask = {
      carmen: this.questManager.carmen,
      papers: [this.questManager.windPaper1, this.questManager.windPaper2],
      isDelivered: false
    };
    this.coldTask = {
      chaqueta: this.questManager.coldJacket,
      bufanda: this.questManager.coldScarf,
      isCompleted: false
    };
    this.heatTask = {
      sofia: this.questManager.heatSofia,
      isCompleted: false
    };

    this.eligibleWeatherEvents = ['rain', 'wind', 'cold', 'heat'];
    this.lastWeatherEvent = null;

    // Start in sunny plaza
    this.setWeather('sunny');
  }

  get currentWeather() {
    return this.questManager ? this.questManager.currentWeather : 'sunny';
  }

  set currentWeather(val) {
    if (this.questManager) this.questManager.currentWeather = val;
  }

  setWeather(weatherKey) {
    if (this.questManager) {
      this.questManager.activateWeatherEvent(weatherKey);
    }
  }

  getRandomWeatherEvent() {
    const pool = this.eligibleWeatherEvents.filter((e) => e !== this.lastWeatherEvent);
    const selection = pool.length > 0
      ? pool[Math.floor(Math.random() * pool.length)]
      : this.eligibleWeatherEvents[Math.floor(Math.random() * this.eligibleWeatherEvents.length)];
    this.lastWeatherEvent = selection;
    return selection;
  }

  startRandomWeatherEvent() {
    if (this.questManager && this.questManager.currentQueueIndex < this.questManager.eventQueue.length - 1) {
      this.questManager.startNextQueuedEvent();
      this.lastWeatherEvent = this.questManager.currentWeather;
      return this.questManager.currentWeather;
    }
    const nextEvent = this.getRandomWeatherEvent();
    this.setWeather(nextEvent);
    return nextEvent;
  }

  cycleNext() {
    return this.startRandomWeatherEvent();
  }

  startNewSession() {
    if (this.questManager) {
      this.questManager.startNewSession();
    }
  }

  resetWeatherTask(weatherType = this.currentWeather) {
    if (this.questManager) {
      this.questManager.activateWeatherEvent(weatherType);
    }
    this.player.setMovementLock(false);
  }

  handleInteraction(player) {
    if (this.questManager) {
      return this.questManager.handleInteraction(player);
    }
    return false;
  }

  update(player, isDialogueOpen) {
    if (this.questManager) {
      this.questManager.update(player, isDialogueOpen);
    }
  }

  destroy() {
    if (this.weatherManager) this.weatherManager.destroy();
    if (this.completionModal) this.completionModal.destroy();
    if (this.questManager) this.questManager.destroy();
  }
}
