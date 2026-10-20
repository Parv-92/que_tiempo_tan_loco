import Phaser from 'phaser';
import { QuestIndicator } from '../ui/QuestIndicator.js';
import { Camarero } from '../entities/Camarero.js';
import { Chair } from '../entities/Chair.js';
import { Umbrella } from '../entities/Umbrella.js';
import { EXPLORATION_OBJECTS_DATA } from '../data/explorationData.js';
import { QuizModal } from '../ui/QuizModal.js';

export const QuestStates = {
  INTRO: 'INTRO',
  WAITING_FOR_FIRST_QUEST: 'WAITING_FOR_FIRST_QUEST',
  BONUS_TIMER: 'BONUS_TIMER',
  EXPLORATION_PHASE: 'EXPLORATION_PHASE',
  QUIZ: 'QUIZ',
  EVENT_RECAP: 'EVENT_RECAP',
  EVENT_TRANSITION: 'EVENT_TRANSITION',
  SESSION_COMPLETE: 'SESSION_COMPLETE'
};

export class QuestManager {
  /**
   * @param {Phaser.Scene} scene
   * @param {Object} options
   * @param {GameHUD} options.hud
   * @param {Player} options.player
   * @param {DonMateo} options.donMateo
   * @param {CompletionModal} options.completionModal
   * @param {WeatherManager} options.weatherManager
   */
  constructor(scene, options) {
    this.scene = scene;
    this.hud = options.hud;
    this.player = options.player;
    this.donMateo = options.donMateo;
    this.completionModal = options.completionModal;
    this.weatherManager = options.weatherManager;

    this.state = QuestStates.INTRO;
    this.currentWeather = 'sunny';

    // Queue of eligible weather events for the session
    this.allPlayableEvents = ['rain', 'wind', 'cold', 'heat', 'sunny'];
    this.eventQueue = [];
    this.currentQueueIndex = -1;

    // Timer state
    this.bonusTimerEvent = null;
    this.remainingBonusSeconds = 60;

    // Dedicated Exploration phase timer
    this.explorationTimerEvent = null;
    this.remainingExplorationSeconds = 20;

    // Active Quest Indicators
    this.activeIndicators = new Map(); // questId -> QuestIndicator

    // Total session statistics
    this.sessionCompletedQuests = 0;
    this.sessionTotalQuests = 0;

    // Quiz Modal instance
    this.quizModal = new QuizModal(scene);

    // Exploration objects registry (7 distinct everyday objects per weather)
    this.explorationObjects = { rain: [], wind: [], cold: [], heat: [], sunny: [] };
    this.activeNearbyExplorationObject = null;

    // Create all world props and NPCs for the 5 weather types
    this.createWorldEntities();

    // Setup initial randomized session queue
    this.initSessionQueue();
  }

  initSessionQueue() {
    // Pick playable events in randomized order, avoiding consecutive duplicates
    const events = ['rain', 'wind', 'cold', 'heat'];
    // Fisher-Yates shuffle
    for (let i = events.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [events[i], events[j]] = [events[j], events[i]];
    }

    this.eventQueue = events;
    this.currentQueueIndex = -1;
    this.sessionCompletedQuests = 0;
    this.sessionTotalQuests = this.eventQueue.length * 3;
    this.state = QuestStates.INTRO;
  }

  // ==========================================
  // 1. WORLD ENTITIES INITIALIZATION
  // ==========================================
  createWorldEntities() {
    const { scene } = this;

    // --- RAIN PROPS ---
    // Camarero NPC on café terrace
    this.camarero = new Camarero(scene, 835, 245);

    // Café chair to move (placed in open, unobstructed plaza paving west of fountain)
    this.rainChair = new Chair(scene, 1, 510, 440);

    // Umbrella near fountain
    this.umbrella = new Umbrella(scene, 675, 420);

    // Rain market crate exposed to rain
    this.rainCrate = scene.physics.add.sprite(280, 310, 'market_crate');
    this.rainCrate.initialX = 280;
    this.rainCrate.initialY = 310;
    this.rainCrate.body.setSize(22, 22);
    this.rainCrate.setDepth(18);
    this.rainCrate.isCarried = false;
    this.rainCrate.isSheltered = false;

    // --- WIND PROPS ---
    // Carmen market vendor
    this.carmen = scene.physics.add.sprite(200, 290, 'carmen');
    this.carmen.body.setSize(22, 16);
    this.carmen.body.setOffset(5, 26);
    this.carmen.setImmovable(true);
    this.carmen.setDepth(20 + Math.floor(290 / 10));
    this.createCarmenPrompt(scene);

    // Scattered papers
    this.windPaper1 = scene.physics.add.sprite(520, 360, 'paper');
    this.windPaper1.initialX = 520;
    this.windPaper1.initialY = 360;
    this.windPaper1.body.setSize(18, 18);
    this.windPaper1.setDepth(18);
    this.windPaper1.isCollected = false;

    this.windPaper2 = scene.physics.add.sprite(680, 470, 'paper');
    this.windPaper2.initialX = 680;
    this.windPaper2.initialY = 470;
    this.windPaper2.body.setSize(18, 18);
    this.windPaper2.setDepth(18);
    this.windPaper2.isCollected = false;

    // Blown hat (sombrero)
    this.windHat = scene.physics.add.sprite(750, 470, 'sombrero');
    this.windHat.initialX = 750;
    this.windHat.initialY = 470;
    this.windHat.body.setSize(20, 20);
    this.windHat.setDepth(18);
    this.windHat.isCollected = false;
    this.windHat.isDelivered = false;

    // Wind market crate blown loose
    this.windCrate = scene.physics.add.sprite(340, 380, 'market_crate');
    this.windCrate.initialX = 340;
    this.windCrate.initialY = 380;
    this.windCrate.body.setSize(22, 22);
    this.windCrate.setDepth(18);
    this.windCrate.isCarried = false;
    this.windCrate.isSecured = false;

    // --- COLD PROPS ---
    // Warm jacket
    this.coldJacket = scene.physics.add.sprite(480, 480, 'chaqueta');
    this.coldJacket.initialX = 480;
    this.coldJacket.initialY = 480;
    this.coldJacket.body.setSize(22, 22);
    this.coldJacket.setDepth(18);
    this.coldJacket.isCollected = false;
    this.coldJacket.isDelivered = false;

    // Warm scarf
    this.coldScarf = scene.physics.add.sprite(600, 310, 'bufanda');
    this.coldScarf.initialX = 600;
    this.coldScarf.initialY = 310;
    this.coldScarf.body.setSize(22, 20);
    this.coldScarf.setDepth(18);
    this.coldScarf.isCollected = false;
    this.coldScarf.isDelivered = false;

    // Shivering citizen Elena (placed in open walkway with wide passage to café)
    this.coldElena = scene.physics.add.sprite(710, 340, 'citizen');
    this.coldElena.initialX = 710;
    this.coldElena.initialY = 340;
    this.coldElena.body.setSize(22, 16);
    this.coldElena.body.setOffset(5, 26);
    this.coldElena.setImmovable(true);
    this.coldElena.setDepth(20 + Math.floor(340 / 10));
    this.coldElena.isEscorted = false;
    this.coldElena.isFollowingPlayer = false;

    // --- HEAT PROPS ---
    // Sofia resting in sun
    this.heatSofia = scene.physics.add.sprite(600, 470, 'sofia');
    this.heatSofia.initialX = 600;
    this.heatSofia.initialY = 470;
    this.heatSofia.body.setSize(22, 16);
    this.heatSofia.body.setOffset(5, 26);
    this.heatSofia.setImmovable(true);
    this.heatSofia.setDepth(20 + Math.floor(470 / 10));
    this.heatSofia.hasWater = false;
    this.heatSofia.inShade = false;

    // Glass of water on café counter under awning
    this.heatGlass = scene.physics.add.sprite(855, 235, 'glass_water');
    this.heatGlass.initialX = 855;
    this.heatGlass.initialY = 235;
    this.heatGlass.body.setSize(18, 18);
    this.heatGlass.setDepth(18);
    this.heatGlass.isCollected = false;
    this.heatGlass.isDelivered = false;

    // --- SUNNY & ICE CREAM PROPS ---
    // Flowers pot by market
    this.sunnyFlowers = scene.physics.add.sprite(330, 300, 'flowers');
    this.sunnyFlowers.initialX = 330;
    this.sunnyFlowers.initialY = 300;
    this.sunnyFlowers.body.setSize(22, 22);
    this.sunnyFlowers.setDepth(18);
    this.sunnyFlowers.isInspected = false;

    // Paco the Ice Cream Vendor (Heladero) positioned along north promenade edge
    this.heladero = scene.physics.add.sprite(780, 235, 'heladero');
    this.heladero.initialX = 780;
    this.heladero.initialY = 235;
    this.heladero.body.setSize(22, 16);
    this.heladero.body.setOffset(5, 26);
    this.heladero.setImmovable(true);
    this.heladero.setDepth(20 + Math.floor(235 / 10));
    this.heladero.isOrdered = false;
    this.createHeladeroPrompt(scene);

    // Ice Cream Cart (Carrito de helados) next to Paco
    this.heladoCart = scene.physics.add.sprite(805, 230, 'ice_cream_cart');
    this.heladoCart.initialX = 805;
    this.heladoCart.initialY = 230;
    this.heladoCart.setDepth(19);

    // Plaza Bicycle (Bicicleta)
    this.bicicleta = scene.physics.add.sprite(415, 245, 'bicicleta');
    this.bicicleta.initialX = 415;
    this.bicicleta.initialY = 245;
    this.bicicleta.setDepth(18);

    // Picnic Basket (Cesta)
    this.cesta = scene.physics.add.sprite(475, 245, 'cesta');
    this.cesta.initialX = 475;
    this.cesta.initialY = 245;
    this.cesta.setDepth(18);

    // Sunny resting bench (North-West wooden bench)
    this.sunnyBenchTarget = { x: 445, y: 240, isRested: false };

    // Group of all weather props for quick toggling
    this.allProps = [
      this.camarero, this.rainChair, this.umbrella, this.rainCrate,
      this.carmen, this.windPaper1, this.windPaper2, this.windHat, this.windCrate,
      this.coldJacket, this.coldScarf, this.coldElena,
      this.heatSofia, this.heatGlass,
      this.sunnyFlowers,
      this.heladero, this.heladoCart, this.bicicleta, this.cesta
    ];

    // Instantiate and register all 35 exploration objects (7 distinct per weather)
    this.createExplorationEntities();
    this.createExplorationPrompt(scene);

    // Hide all weather props initially (sunny plaza baseline)
    this.allProps.forEach((p) => {
      p.setVisible(false);
      if (p.body) p.body.enable = false;
    });
  }

  createExplorationEntities() {
    const { scene } = this;
    const weathers = ['rain', 'wind', 'cold', 'heat', 'sunny'];

    weathers.forEach((w) => {
      this.explorationObjects[w] = [];
      const list = EXPLORATION_OBJECTS_DATA[w] || [];

      list.forEach((item) => {
        let sprite = null;

        // Map existing quest props where appropriate
        if (item.id === 'rain_paraguas') sprite = this.umbrella;
        else if (item.id === 'rain_silla') sprite = this.rainChair;
        else if (item.id === 'wind_papel') sprite = this.windPaper1;
        else if (item.id === 'wind_sombrero') sprite = this.windHat;
        else if (item.id === 'cold_chaqueta') sprite = this.coldJacket;
        else if (item.id === 'cold_bufanda') sprite = this.coldScarf;
        else if (item.id === 'heat_vaso') sprite = this.heatGlass;
        else if (item.id === 'sunny_flores') sprite = this.sunnyFlowers;
        else if (item.id === 'sunny_bicicleta') sprite = this.bicicleta;
        else if (item.id === 'sunny_cesta') sprite = this.cesta;
        else {
          sprite = scene.physics.add.sprite(item.x, item.y, item.texture);
          sprite.initialX = item.x;
          sprite.initialY = item.y;
          sprite.setDepth(18);
          if (sprite.body) {
            sprite.body.setSize(22, 22);
            sprite.body.enable = false;
          }
          sprite.setVisible(false);
          this.allProps.push(sprite);
          if (item.id === 'sunny_balon') {
            this.sunnyBalon = sprite;
          }
        }

        const obj = {
          data: item,
          sprite: sprite,
          isExplored: false
        };

        this.explorationObjects[w].push(obj);
      });
    });
  }

  createExplorationPrompt(scene) {
    this.explorationPrompt = scene.add.container(0, 0);
    this.explorationPrompt.setDepth(96);
    this.explorationPrompt.setVisible(false);

    const w = 230;
    const h = 28;
    this.explorationPromptBg = scene.add.graphics();
    this.explorationPromptBg.fillStyle(0x0f172a, 0.95);
    this.explorationPromptBg.fillRoundedRect(-w / 2, -h / 2, w, h, 6);
    this.explorationPromptBg.lineStyle(1.5, 0x38bdf8, 0.95);
    this.explorationPromptBg.strokeRoundedRect(-w / 2, -h / 2, w, h, 6);

    this.explorationPromptText = scene.add.text(0, 0, '', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '11px',
      fontWeight: '700',
      color: '#38bdf8'
    }).setOrigin(0.5);

    this.explorationPrompt.add([this.explorationPromptBg, this.explorationPromptText]);
  }

  // ==========================================
  // 2. QUEST DEFINITIONS PER WEATHER TYPE
  // ==========================================
  getQuestsForWeather(weatherType) {
    switch (weatherType) {
      case 'rain':
        return [
          {
            id: 'rain_chair',
            titleEs: 'Mueve la silla bajo el toldo del café',
            titleEn: 'Move the chair under the café awning',
            vocab: '«la silla» (chair) • «mover» (to move)',
            isFirst: true,
            isCompleted: false,
            getTarget: () => (this.rainChair.isCarried ? { x: 840, y: 235 } : this.rainChair)
          },
          {
            id: 'rain_umbrella',
            titleEs: 'Encuentra y coge el paraguas',
            titleEn: 'Find and take the umbrella',
            vocab: '«el paraguas» (umbrella) • «abrir» (to open)',
            isFirst: false,
            isCompleted: false,
            getTarget: () => this.umbrella
          },
          {
            id: 'rain_crate',
            titleEs: 'Protege las mercancías del puesto',
            titleEn: 'Protect the goods at the market stall',
            vocab: '«el puesto» (stall) • «proteger» (to protect)',
            isFirst: false,
            isCompleted: false,
            getTarget: () => (this.rainCrate.isCarried ? { x: 200, y: 260 } : this.rainCrate)
          }
        ];

      case 'wind':
        return [
          {
            id: 'wind_papers',
            titleEs: 'Recoge los papeles para Carmen en el mercado',
            titleEn: 'Collect the papers for Carmen at the market',
            vocab: '«el papel» (paper) • «recoger» (to pick up)',
            isFirst: true,
            isCompleted: false,
            getTarget: () => {
              if (!this.windPaper1.isCollected) return this.windPaper1;
              if (!this.windPaper2.isCollected) return this.windPaper2;
              return this.carmen;
            }
          },
          {
            id: 'wind_hat',
            titleEs: 'Rescata el sombrero y devuélvelo a Don Mateo',
            titleEn: 'Rescue the hat and return it to Don Mateo',
            vocab: '«el sombrero» (hat) • «devolver» (to return)',
            isFirst: false,
            isCompleted: false,
            getTarget: () => (this.windHat.isCollected ? this.donMateo : this.windHat)
          },
          {
            id: 'wind_crate',
            titleEs: 'Asegura el puesto: coloca la caja suelta',
            titleEn: 'Secure the stall: return the loose crate',
            vocab: '«el puesto» (stall) • «colocar» (to place)',
            isFirst: false,
            isCompleted: false,
            getTarget: () => (this.windCrate.isCarried ? { x: 200, y: 260 } : this.windCrate)
          }
        ];

      case 'cold':
        return [
          {
            id: 'cold_jacket',
            titleEs: 'Encuentra la chaqueta para Don Mateo',
            titleEn: 'Find the jacket for Don Mateo',
            vocab: '«la chaqueta» (jacket) • «Tengo frío» (I\'m cold)',
            isFirst: true,
            isCompleted: false,
            getTarget: () => (this.coldJacket.isCollected ? this.donMateo : this.coldJacket)
          },
          {
            id: 'cold_scarf',
            titleEs: 'Devuelve la bufanda perdida a Elena',
            titleEn: 'Return the lost scarf to Elena',
            vocab: '«la bufanda» (scarf) • «buscar» (to look for)',
            isFirst: false,
            isCompleted: false,
            getTarget: () => (this.coldScarf.isCollected ? this.coldElena : this.coldScarf)
          },
          {
            id: 'cold_shelter',
            titleEs: 'Acompaña a Elena al café caliente',
            titleEn: 'Guide Elena to the warm café',
            vocab: '«el café» (café) • «entrar» (to enter)',
            isFirst: false,
            isCompleted: false,
            getTarget: () => (this.coldElena.isEscorted ? { x: 825, y: 255 } : this.coldElena)
          }
        ];

      case 'heat':
        return [
          {
            id: 'heat_water',
            titleEs: 'Consigue agua en la fuente para Sofia',
            titleEn: 'Get fresh water at the fountain for Sofia',
            vocab: '«el agua» (water) • «la botella» (bottle) • «el vaso» (glass)',
            isFirst: true,
            isCompleted: false,
            getTarget: () => (this.heatSofia.hasWater ? this.heatSofia : { x: 640, y: 370 })
          },
          {
            id: 'heat_shade',
            titleEs: 'Acompaña a Sofia a la sombra del árbol',
            titleEn: 'Guide Sofia to the shaded area beneath the tree',
            vocab: '«el abanico» (hand fan) • «la gorra» (cap) • «la toalla» (towel)',
            isFirst: false,
            isCompleted: false,
            getTarget: () => (this.heatSofia.inShade ? { x: 755, y: 515 } : this.heatSofia)
          },
          {
            id: 'heat_ice_cream',
            titleEs: 'Pide un helado en el carrito',
            titleEn: 'Order an ice cream at the cart',
            vocab: '«el helado» (ice cream) • «la heladería» (ice-cream shop) • «por favor» (please)',
            isFirst: false,
            isCompleted: false,
            getTarget: () => this.heladero
          }
        ];

      case 'sunny':
      default:
        return [
          {
            id: 'sunny_flowers',
            titleEs: 'Observa las flores en el puesto',
            titleEn: 'Look at the flowers at the stand',
            vocab: '«las flores» (flowers) • «la cesta» (basket) • «la cámara» (camera)',
            isFirst: true,
            isCompleted: false,
            getTarget: () => this.sunnyFlowers
          },
          {
            id: 'sunny_shade',
            titleEs: 'Acompaña a Sofia a la sombra del árbol',
            titleEn: 'Guide Sofia to the shaded area beneath the tree',
            vocab: '«el banco» (bench) • «la bicicleta» (bicycle) • «el balón» (football / ball)',
            isFirst: false,
            isCompleted: false,
            getTarget: () => (this.heatSofia.inShade ? { x: 755, y: 515 } : this.heatSofia)
          },
          {
            id: 'sunny_ice_cream',
            titleEs: 'Pide un helado en el carrito',
            titleEn: 'Order an ice cream at the cart',
            vocab: '«el helado» (ice cream) • «la heladería» (ice-cream shop) • «por favor» (please)',
            isFirst: false,
            isCompleted: false,
            getTarget: () => this.heladero
          }
        ];
    }
  }

  // ==========================================
  // 3. QUEUE & EVENT PROGRESSION LIFECYCLE
  // ==========================================
  startNextQueuedEvent() {
    this.currentQueueIndex++;

    if (this.currentQueueIndex >= this.eventQueue.length) {
      // Session finished!
      this.state = QuestStates.SESSION_COMPLETE;
      this.completionModal.openSessionComplete({
        completed: this.sessionCompletedQuests,
        total: this.sessionTotalQuests
      });
      return;
    }

    const nextWeather = this.eventQueue[this.currentQueueIndex];
    this.activateWeatherEvent(nextWeather);
  }

  activateWeatherEvent(weatherType) {
    this.cleanUpCurrentEvent();

    this.currentWeather = weatherType;
    this.weatherManager.setWeather(weatherType);
    this.activeQuests = this.getQuestsForWeather(weatherType);

    // Audio cue: play weather transition and switch ambient audio loop
    if (this.scene.soundManager) {
      this.scene.soundManager.playWeatherTransition();
      this.scene.soundManager.setWeather(weatherType);
    }

    // Reset and spawn required props for this weather type
    this.resetAndSpawnPropsForWeather(weatherType);

    // Transition to WAITING_FOR_FIRST_QUEST (Phase A)
    this.state = QuestStates.WAITING_FOR_FIRST_QUEST;
    this.hud.hideTimer();

    // Setup Phase A indicator & HUD
    const firstQuest = this.activeQuests[0];
    this.hud.setWeatherDisplay(weatherType);
    this.hud.setTaskDisplay(`MISIÓN: ${firstQuest.titleEs}`, `MISSION: ${firstQuest.titleEn}`);
    this.hud.setVocabularyDisplay(firstQuest.vocab);

    // Weather announcement toast
    this.showWeatherAnnouncementToast(weatherType);

    // Add QuestIndicator for the untimed first quest
    this.setIndicatorForQuest(firstQuest);
  }

  showWeatherAnnouncementToast(weatherType) {
    switch (weatherType) {
      case 'rain':
        this.hud.showToast('El cielo se nubla: ¡está lloviendo!', 'The sky clouds over: it is raining.', true);
        break;
      case 'wind':
        this.hud.showToast('Viento en la plaza: ¡hace viento!', 'Wind in the plaza: it is windy.', true);
        break;
      case 'cold':
        this.hud.showToast('Bajan las temperaturas: ¡hace frío!', 'Temperatures drop: it is cold.', true);
        break;
      case 'heat':
        this.hud.showToast('El sol calienta con fuerza: ¡hace calor!', 'The sun heats up strongly: it is hot.', true);
        break;
      case 'sunny':
        this.hud.showToast('Cielo despejado: ¡hace sol!', 'Clear skies: it is sunny.', true);
        break;
    }
  }

  // ==========================================
  // 4. PHASE A -> PHASE B -> PHASE C TRANSITIONS
  // ==========================================
  completeFirstQuest() {
    if (this.state !== QuestStates.WAITING_FOR_FIRST_QUEST) return;

    const firstQuest = this.activeQuests[0];
    firstQuest.isCompleted = true;
    this.sessionCompletedQuests++;

    // Mark adapter tasks as completed for backward compatibility
    if (this.currentWeather === 'rain' && this.scene.weatherCycle) {
      this.scene.weatherCycle.cafeTask.isCompleted = true;
    } else if (this.currentWeather === 'wind' && this.scene.weatherCycle) {
      this.scene.weatherCycle.windTask.isCompleted = true;
    } else if (this.currentWeather === 'cold' && this.scene.weatherCycle) {
      this.scene.weatherCycle.coldTask.isCompleted = true;
    } else if (this.currentWeather === 'heat' && this.scene.weatherCycle) {
      this.scene.weatherCycle.heatTask.isCompleted = true;
    }

    // Remove first quest indicator
    this.removeIndicator(firstQuest.id);

    // Audio cue: distinct, pleasant quest completion confirmation sound
    if (this.scene.soundManager) {
      this.scene.soundManager.playCompletion();
    }

    // Positive feedback toast
    this.hud.showToast('Misión principal completada', 'Main mission completed', true);

    // Transition to Phase B: 60-Second Countdown Window
    this.state = QuestStates.BONUS_TIMER;
    this.remainingBonusSeconds = 60;
    this.hud.showTimer(this.remainingBonusSeconds);
    this.hud.setMultiQuestDisplay(this.activeQuests);

    // Spawn indicators for both bonus quests
    this.setIndicatorForQuest(this.activeQuests[1]);
    this.setIndicatorForQuest(this.activeQuests[2]);

    // Start 60-second countdown ticker
    if (this.bonusTimerEvent) {
      this.bonusTimerEvent.remove();
    }

    this.bonusTimerEvent = this.scene.time.addEvent({
      delay: 1000,
      repeat: 59,
      callback: () => {
        this.remainingBonusSeconds--;
        this.hud.updateTimer(this.remainingBonusSeconds);

        if (this.remainingBonusSeconds <= 0) {
          this.endEventDueToTimeout();
        }
      }
    });
  }

  completeBonusQuest(questIndex) {
    if (this.state !== QuestStates.BONUS_TIMER) return;

    const quest = this.activeQuests[questIndex];
    if (!quest || quest.isCompleted) return;

    quest.isCompleted = true;
    this.sessionCompletedQuests++;

    // Remove indicator
    this.removeIndicator(quest.id);

    // Audio cue: distinct pleasant completion sound
    if (this.scene.soundManager) {
      this.scene.soundManager.playCompletion();
    }

    // Immediate feedback
    this.hud.showToast(`Completado: ${quest.titleEs}`, `Completed: ${quest.titleEn}`, true);

    // Update HUD checklist (does NOT reset timer)
    this.hud.setMultiQuestDisplay(this.activeQuests);

    // If all 3 quests are completed, start dedicated 20s exploration phase
    if (this.activeQuests[1].isCompleted && this.activeQuests[2].isCompleted) {
      this.scene.time.delayedCall(700, () => this.startExplorationPhase());
    }
  }

  startExplorationPhase() {
    this.state = QuestStates.EXPLORATION_PHASE;

    // Clear bonus quest timer
    if (this.bonusTimerEvent) {
      this.bonusTimerEvent.remove();
      this.bonusTimerEvent = null;
    }

    // Remove remaining quest indicators
    this.clearAllIndicators();

    // 20-second dedicated exploration timer
    this.remainingExplorationSeconds = 20;
    this.hud.showTimer(this.remainingExplorationSeconds);

    // Update HUD display
    this.hud.setTaskDisplay(
      'Explora la plaza',
      'Explore the plaza'
    );
    this.hud.setVocabularyDisplay(
      'Pista: Pulsa [E] junto a los objetos para ver frases en español. Pulsa [Q] para ir al Quiz.'
    );

    // Celebratory toast
    this.hud.showToast(
      'Misiones completadas. Explora la plaza libremente.',
      'All missions completed. Explore the plaza freely.',
      true
    );

    if (this.explorationTimerEvent) {
      this.explorationTimerEvent.remove();
    }

    this.explorationTimerEvent = this.scene.time.addEvent({
      delay: 1000,
      repeat: 19,
      callback: () => {
        this.remainingExplorationSeconds--;
        this.hud.updateTimer(this.remainingExplorationSeconds);

        if (this.remainingExplorationSeconds <= 0) {
          this.startWeatherQuiz();
        }
      }
    });
  }

  skipExplorationToQuiz() {
    if (this.state !== QuestStates.EXPLORATION_PHASE) return;
    this.startWeatherQuiz();
  }

  startWeatherQuiz() {
    if (this.explorationTimerEvent) {
      this.explorationTimerEvent.remove();
      this.explorationTimerEvent = null;
    }
    this.hud.hideTimer();

    this.state = QuestStates.QUIZ;
    this.disableActiveInteractions();

    this.quizModal.open(this.currentWeather, (quizResult) => {
      this.endEventAfterQuiz(quizResult);
    });
  }

  endEventAfterQuiz(quizResult) {
    this.state = QuestStates.EVENT_RECAP;

    this.disableActiveInteractions();

    // Open CompletionModal with recap checklist and auto-advance
    this.completionModal.openRecap(this.currentWeather, this.activeQuests, () => {
      this.advanceQueueAfterRecap();
    });
  }

  endEventDueToTimeout() {
    if (this.state === QuestStates.EXPLORATION_PHASE) {
      this.startWeatherQuiz();
      return;
    }
    if (this.state !== QuestStates.BONUS_TIMER && this.state !== QuestStates.WAITING_FOR_FIRST_QUEST) return;
    this.state = QuestStates.EVENT_RECAP;

    // Stop and hide timer
    if (this.bonusTimerEvent) {
      this.bonusTimerEvent.remove();
      this.bonusTimerEvent = null;
    }
    this.hud.hideTimer();

    // Incomplete bonus quests are marked skipped (no penalty/failure)
    this.activeQuests.forEach((q) => {
      if (!q.isCompleted) {
        q.isSkipped = true;
      }
    });

    // Remove all remaining quest indicators
    this.clearAllIndicators();

    // Disable interactions for this weather
    this.disableActiveInteractions();

    // Open CompletionModal with recap checklist and auto-advance
    this.completionModal.openRecap(this.currentWeather, this.activeQuests, () => {
      this.advanceQueueAfterRecap();
    });
  }

  advanceQueueAfterRecap() {
    if (this.state !== QuestStates.EVENT_RECAP) return;
    this.state = QuestStates.EVENT_TRANSITION;

    // Clean up current weather props and advance
    this.cleanUpCurrentEvent();

    // Stop old weather ambience before transition
    if (this.scene.soundManager) {
      this.scene.soundManager.stopAmbience();
    }

    // Short transition delay before starting next event
    this.scene.time.delayedCall(500, () => {
      this.startNextQueuedEvent();
    });
  }

  // ==========================================
  // 5. DETERMINISTIC SPAWN & RESET LIFECYCLE
  // ==========================================
  resetAndSpawnPropsForWeather(weatherType) {
    // Hide and disable all props first
    this.allProps.forEach((p) => {
      p.setVisible(false);
      if (p.body) p.body.enable = false;
    });

    switch (weatherType) {
      case 'rain':
        this.camarero.setVisible(true);
        this.camarero.body.enable = true;
        this.camarero.setPosition(835, 245);

        this.rainChair.setVisible(true);
        this.rainChair.body.enable = true;
        this.rainChair.reset();

        this.umbrella.setVisible(true);
        this.umbrella.body.enable = true;
        this.umbrella.reset();

        this.rainCrate.setVisible(true);
        this.rainCrate.body.enable = true;
        this.rainCrate.setPosition(this.rainCrate.initialX, this.rainCrate.initialY);
        this.rainCrate.isCarried = false;
        this.rainCrate.isSheltered = false;
        break;

      case 'wind':
        this.carmen.setVisible(true);
        this.carmen.body.enable = true;
        this.carmen.setPosition(200, 290);

        this.windPaper1.setVisible(true);
        this.windPaper1.body.enable = true;
        this.windPaper1.setPosition(this.windPaper1.initialX, this.windPaper1.initialY);
        this.windPaper1.isCollected = false;

        this.windPaper2.setVisible(true);
        this.windPaper2.body.enable = true;
        this.windPaper2.setPosition(this.windPaper2.initialX, this.windPaper2.initialY);
        this.windPaper2.isCollected = false;

        this.windHat.setVisible(true);
        this.windHat.body.enable = true;
        this.windHat.setPosition(this.windHat.initialX, this.windHat.initialY);
        this.windHat.isCollected = false;
        this.windHat.isDelivered = false;

        this.windCrate.setVisible(true);
        this.windCrate.body.enable = true;
        this.windCrate.setPosition(this.windCrate.initialX, this.windCrate.initialY);
        this.windCrate.isCarried = false;
        this.windCrate.isSecured = false;
        break;

      case 'cold':
        this.coldJacket.setVisible(true);
        this.coldJacket.body.enable = true;
        this.coldJacket.setPosition(this.coldJacket.initialX, this.coldJacket.initialY);
        this.coldJacket.isCollected = false;
        this.coldJacket.isDelivered = false;

        this.coldScarf.setVisible(true);
        this.coldScarf.body.enable = true;
        this.coldScarf.setPosition(this.coldScarf.initialX, this.coldScarf.initialY);
        this.coldScarf.isCollected = false;
        this.coldScarf.isDelivered = false;

        this.coldElena.setVisible(true);
        this.coldElena.body.enable = true;
        this.coldElena.setPosition(this.coldElena.initialX, this.coldElena.initialY);
        this.coldElena.isEscorted = false;
        this.coldElena.isFollowingPlayer = false;
        this.coldElena.setImmovable(true);
        this.coldElena.setVelocity(0, 0);
        break;

      case 'heat':
        this.heatSofia.setVisible(true);
        this.heatSofia.body.enable = true;
        this.heatSofia.setPosition(this.heatSofia.initialX, this.heatSofia.initialY);
        this.heatSofia.hasWater = false;
        this.heatSofia.inShade = false;
        this.heatSofia.isFollowingPlayer = false;
        this.heatSofia.isEscorted = false;
        this.heatSofia.setVelocity(0, 0);
        this.heatSofia.setDepth(20 + Math.floor(this.heatSofia.initialY / 10));

        this.heladero.setVisible(true);
        this.heladero.body.enable = true;
        this.heladero.setPosition(this.heladero.initialX, this.heladero.initialY);
        this.heladero.isOrdered = false;

        this.heladoCart.setVisible(true);
        this.heladoCart.setPosition(this.heladoCart.initialX, this.heladoCart.initialY);

        this.bicicleta.setVisible(true);
        this.bicicleta.setPosition(this.bicicleta.initialX, this.bicicleta.initialY);

        this.cesta.setVisible(true);
        this.cesta.setPosition(this.cesta.initialX, this.cesta.initialY);
        break;

      case 'sunny':
        this.sunnyFlowers.setVisible(true);
        this.sunnyFlowers.body.enable = true;
        this.sunnyFlowers.setPosition(this.sunnyFlowers.initialX, this.sunnyFlowers.initialY);
        this.sunnyFlowers.isInspected = false;

        this.heatSofia.setVisible(true);
        this.heatSofia.body.enable = true;
        this.heatSofia.setPosition(this.heatSofia.initialX, this.heatSofia.initialY);
        this.heatSofia.hasWater = false;
        this.heatSofia.inShade = false;
        this.heatSofia.isFollowingPlayer = false;
        this.heatSofia.isEscorted = false;
        this.heatSofia.setVelocity(0, 0);
        this.heatSofia.setDepth(20 + Math.floor(this.heatSofia.initialY / 10));

        this.heladero.setVisible(true);
        this.heladero.body.enable = true;
        this.heladero.setPosition(this.heladero.initialX, this.heladero.initialY);
        this.heladero.isOrdered = false;

        this.heladoCart.setVisible(true);
        this.heladoCart.setPosition(this.heladoCart.initialX, this.heladoCart.initialY);

        this.bicicleta.setVisible(true);
        this.bicicleta.setPosition(this.bicicleta.initialX, this.bicicleta.initialY);

        this.cesta.setVisible(true);
        this.cesta.setPosition(this.cesta.initialX, this.cesta.initialY);
        break;
    }

    // Deterministically activate all 7 exploration objects for this weather
    const weathers = ['rain', 'wind', 'cold', 'heat', 'sunny'];
    weathers.forEach((w) => {
      const list = this.explorationObjects[w] || [];
      const isActiveWeather = (w === weatherType);
      list.forEach((obj) => {
        if (obj.sprite) {
          obj.sprite.setVisible(isActiveWeather);
          if (obj.sprite.body) obj.sprite.body.enable = isActiveWeather;
          if (isActiveWeather) {
            obj.sprite.setPosition(obj.data.x, obj.data.y);
            if (obj.sprite.setAngle) obj.sprite.setAngle(0);
            obj.isExplored = false;
          }
        }
      });
    });
  }

  cleanUpCurrentEvent() {
    // Clear timers
    if (this.bonusTimerEvent) {
      this.bonusTimerEvent.remove();
      this.bonusTimerEvent = null;
    }
    if (this.explorationTimerEvent) {
      this.explorationTimerEvent.remove();
      this.explorationTimerEvent = null;
    }
    if (this.explorationPrompt) {
      this.explorationPrompt.setVisible(false);
    }
    this.activeNearbyExplorationObject = null;

    if (this.coldElena) {
      this.coldElena.isFollowingPlayer = false;
      this.coldElena.setVelocity(0, 0);
    }

    if (this.heatSofia) {
      this.heatSofia.isFollowingPlayer = false;
      this.heatSofia.isEscorted = false;
      this.heatSofia.inShade = false;
      this.heatSofia.hasWater = false;
      this.heatSofia.setVelocity(0, 0);
      this.heatSofia.setPosition(this.heatSofia.initialX, this.heatSofia.initialY);
    }

    if (this.heladero) {
      this.heladero.isOrdered = false;
    }

    // Clear indicators
    this.clearAllIndicators();

    // Drop any carried items from player
    if (this.rainChair) this.rainChair.isCarried = false;
    if (this.umbrella) this.umbrella.isCarried = false;
    if (this.rainCrate) this.rainCrate.isCarried = false;
    if (this.windCrate) this.windCrate.isCarried = false;

    // Hide all weather props
    this.allProps.forEach((p) => {
      p.setVisible(false);
      if (p.body) p.body.enable = false;
    });

    // Hide all NPC prompts
    this.hideAllPrompts();
  }

  createCarmenPrompt(scene) {
    this.carmenPrompt = scene.add.container(200, 290 - 38);
    this.carmenPrompt.setDepth(90);
    this.carmenPrompt.setVisible(false);

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

    this.carmenPrompt.add([bg, txt]);
  }

  createHeladeroPrompt(scene) {
    this.heladeroPrompt = scene.add.container(780, 235 - 38);
    this.heladeroPrompt.setDepth(90);
    this.heladeroPrompt.setVisible(false);

    const w = 150;
    const h = 28;
    const bg = scene.add.graphics();
    bg.fillStyle(0x0f172a, 0.95);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 6);
    bg.lineStyle(1.5, 0x38bdf8, 0.9);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 6);

    const txt = scene.add.text(0, 0, '[E] Pedir un helado', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '11px',
      fontWeight: '700',
      color: '#38bdf8'
    }).setOrigin(0.5);

    this.heladeroPrompt.add([bg, txt]);
  }

  disableActiveInteractions() {
    this.clearAllIndicators();
    this.hideAllPrompts();
  }

  hideAllPrompts() {
    if (this.donMateo && this.donMateo.hidePrompt) this.donMateo.hidePrompt();
    if (this.camarero && this.camarero.hidePrompt) this.camarero.hidePrompt();
    if (this.carmenPrompt) this.carmenPrompt.setVisible(false);
    if (this.heladeroPrompt) this.heladeroPrompt.setVisible(false);
    if (this.rainChair && this.rainChair.promptContainer) this.rainChair.promptContainer.setVisible(false);
    if (this.umbrella && this.umbrella.promptContainer) this.umbrella.promptContainer.setVisible(false);
    if (this.explorationPrompt) this.explorationPrompt.setVisible(false);
  }

  // ==========================================
  // 6. QUEST INDICATOR MANAGEMENT (Requirement 13)
  // ==========================================
  setIndicatorForQuest(quest) {
    if (!quest || quest.isCompleted) return;

    if (this.activeIndicators.has(quest.id)) {
      const existing = this.activeIndicators.get(quest.id);
      existing.setTarget(quest.getTarget());
      return;
    }

    const target = quest.getTarget();
    if (!target) return;

    const indicator = new QuestIndicator(this.scene, target, {
      offsetY: -32,
      depth: 95
    });

    this.activeIndicators.set(quest.id, indicator);
  }

  removeIndicator(questId) {
    if (this.activeIndicators.has(questId)) {
      const ind = this.activeIndicators.get(questId);
      ind.destroy();
      this.activeIndicators.delete(questId);
    }
  }

  clearAllIndicators() {
    this.activeIndicators.forEach((ind) => ind.destroy());
    this.activeIndicators.clear();
  }

  updateIndicators() {
    this.activeIndicators.forEach((ind, questId) => {
      const quest = this.activeQuests ? this.activeQuests.find((q) => q.id === questId) : null;
      if (quest) {
        ind.setTarget(quest.getTarget());
      }
      ind.update();
    });
  }

  // ==========================================
  // 7. INTERACTION HANDLER (E / Space Keys)
  // ==========================================
  handleInteraction(player) {
    if (!player) return false;
    if (
      this.state !== QuestStates.WAITING_FOR_FIRST_QUEST &&
      this.state !== QuestStates.BONUS_TIMER &&
      this.state !== QuestStates.EXPLORATION_PHASE
    ) {
      return false;
    }

    // In EXPLORATION_PHASE, all missions are complete: player interacts with exploration objects
    if (this.state === QuestStates.EXPLORATION_PHASE) {
      if (this.activeNearbyExplorationObject) {
        return this.handleExplorationObjectInteract(this.activeNearbyExplorationObject, player);
      }
      return false;
    }

    const weather = this.currentWeather;

    // --- RAIN INTERACTIONS ---
    if (weather === 'rain') {
      // 1. Move chair (Quest 1)
      if (!this.rainChair.isPlaced) {
        if (this.rainChair.isCarried) {
          // Drop chair at cafe awning
          const distShelter = Phaser.Math.Distance.Between(player.x, player.y, 840, 235);
          const inAwningZone = (player.x >= 800 && player.x <= 880 && player.y >= 205 && player.y <= 265);
          if (distShelter <= 75 || inAwningZone) {
            this.rainChair.placeAt(840, 235);
            this.hud.showToast('Has colocado la silla bajo el toldo.', 'You placed the chair under the awning.', true);
            this.completeFirstQuest();
            return true;
          }
        } else {
          // Pick up chair
          const distChair = Phaser.Math.Distance.Between(player.x, player.y, this.rainChair.x, this.rainChair.y);
          if (distChair <= 65) {
            this.rainChair.pickup(player);
            if (this.scene.soundManager) {
              this.scene.soundManager.playProgress();
            }
            this.hud.showToast('Lleva la silla bajo el toldo del café.', 'Carry the chair under the café awning.', true);
            this.setIndicatorForQuest(this.activeQuests[0]);
            return true;
          }
        }
      }

      // 2. Umbrella (Quest 2 - Bonus)
      if (this.state === QuestStates.BONUS_TIMER && !this.umbrella.isCarried && !this.activeQuests[1].isCompleted) {
        const distUmbrella = Phaser.Math.Distance.Between(player.x, player.y, this.umbrella.x, this.umbrella.y);
        if (distUmbrella <= 55) {
          this.umbrella.pickup(player);
          this.hud.showToast('Has cogido el paraguas.', 'You picked up the umbrella.', true);
          this.completeBonusQuest(1);
          return true;
        }
      }

      // 3. Rain Crate (Quest 3 - Bonus)
      if (this.state === QuestStates.BONUS_TIMER && !this.rainCrate.isSheltered && !this.activeQuests[2].isCompleted) {
        if (this.rainCrate.isCarried) {
          const distMarketShelter = Phaser.Math.Distance.Between(player.x, player.y, 200, 260);
          if (distMarketShelter <= 75) {
            this.rainCrate.isCarried = false;
            this.rainCrate.isSheltered = true;
            this.rainCrate.setPosition(200, 260);
            this.hud.showToast('Las mercancías están a salvo de la lluvia.', 'The goods are safe from the rain.', true);
            this.completeBonusQuest(2);
            return true;
          }
        } else {
          const distCrate = Phaser.Math.Distance.Between(player.x, player.y, this.rainCrate.x, this.rainCrate.y);
          if (distCrate <= 55) {
            this.rainCrate.isCarried = true;
            if (this.scene.soundManager) {
              this.scene.soundManager.playProgress();
            }
            this.hud.showToast('Lleva la caja bajo el puesto del mercado.', 'Carry the crate under the market stall.', true);
            this.setIndicatorForQuest(this.activeQuests[2]);
            return true;
          }
        }
      }
    }

    // --- WIND INTERACTIONS ---
    if (weather === 'wind') {
      // 1. Papers (Quest 1)
      if (!this.activeQuests[0].isCompleted) {
        // Collect paper 1
        if (!this.windPaper1.isCollected) {
          const d1 = Phaser.Math.Distance.Between(player.x, player.y, this.windPaper1.x, this.windPaper1.y);
          if (d1 <= 50) {
            this.windPaper1.isCollected = true;
            this.windPaper1.setVisible(false);
            if (this.scene.soundManager) {
              this.scene.soundManager.playProgress();
            }
            if (this.scene.weatherCycle) this.scene.weatherCycle.windTask.collectedCount = (this.windPaper2.isCollected ? 2 : 1);
            this.hud.showToast('Has recogido un papel.', 'You picked up a paper.', true);
            this.setIndicatorForQuest(this.activeQuests[0]);
            return true;
          }
        }
        // Collect paper 2
        if (!this.windPaper2.isCollected) {
          const d2 = Phaser.Math.Distance.Between(player.x, player.y, this.windPaper2.x, this.windPaper2.y);
          if (d2 <= 50) {
            this.windPaper2.isCollected = true;
            this.windPaper2.setVisible(false);
            if (this.scene.soundManager) {
              this.scene.soundManager.playProgress();
            }
            if (this.scene.weatherCycle) this.scene.weatherCycle.windTask.collectedCount = (this.windPaper1.isCollected ? 2 : 1);
            this.hud.showToast('Has recogido un papel.', 'You picked up a paper.', true);
            this.setIndicatorForQuest(this.activeQuests[0]);
            return true;
          }
        }
        // Deliver to Carmen
        if (this.windPaper1.isCollected && this.windPaper2.isCollected) {
          const distCarmen = Phaser.Math.Distance.Between(player.x, player.y, this.carmen.x, this.carmen.y);
          if (distCarmen <= 70) {
            this.hud.showToast('Carmen agradece tu ayuda con los papeles.', 'Carmen thanks you for your help with the papers.', true);
            this.completeFirstQuest();
            return true;
          }
        }
      }

      // 2. Hat (Quest 2 - Bonus)
      if (this.state === QuestStates.BONUS_TIMER && !this.activeQuests[1].isCompleted) {
        if (!this.windHat.isCollected) {
          const distHat = Phaser.Math.Distance.Between(player.x, player.y, this.windHat.x, this.windHat.y);
          if (distHat <= 55) {
            this.windHat.isCollected = true;
            this.windHat.setVisible(false);
            if (this.scene.soundManager) {
              this.scene.soundManager.playProgress();
            }
            this.hud.showToast('Has recogido el sombrero. Llévaselo a Don Mateo.', 'You picked up the hat. Bring it to Don Mateo.', true);
            this.setIndicatorForQuest(this.activeQuests[1]);
            return true;
          }
        } else {
          const distDonMateo = Phaser.Math.Distance.Between(player.x, player.y, this.donMateo.x, this.donMateo.y);
          if (distDonMateo <= 75) {
            return false; // Let handleDonMateoInteract open Don Mateo dialogue
          }
        }
      }

      // 3. Wind Crate (Quest 3 - Bonus)
      if (this.state === QuestStates.BONUS_TIMER && !this.windCrate.isSecured && !this.activeQuests[2].isCompleted) {
        if (this.windCrate.isCarried) {
          const distStall = Phaser.Math.Distance.Between(player.x, player.y, 200, 260);
          if (distStall <= 75) {
            this.windCrate.isCarried = false;
            this.windCrate.isSecured = true;
            this.windCrate.setPosition(200, 260);
            this.hud.showToast('El puesto del mercado está asegurado.', 'The market stall is secured.', true);
            this.completeBonusQuest(2);
            return true;
          }
        } else {
          const distCrate = Phaser.Math.Distance.Between(player.x, player.y, this.windCrate.x, this.windCrate.y);
          if (distCrate <= 55) {
            this.windCrate.isCarried = true;
            if (this.scene.soundManager) {
              this.scene.soundManager.playProgress();
            }
            this.hud.showToast('Coloca la caja en el puesto de Carmen.', 'Place the crate back at Carmen\'s stall.', true);
            this.setIndicatorForQuest(this.activeQuests[2]);
            return true;
          }
        }
      }
    }

    // --- COLD INTERACTIONS ---
    if (weather === 'cold') {
      // 1. Jacket for Don Mateo (Quest 1)
      if (!this.activeQuests[0].isCompleted) {
        if (!this.coldJacket.isCollected) {
          const distJacket = Phaser.Math.Distance.Between(player.x, player.y, this.coldJacket.x, this.coldJacket.y);
          if (distJacket <= 55) {
            this.coldJacket.isCollected = true;
            this.coldJacket.setVisible(false);
            if (this.scene.soundManager) {
              this.scene.soundManager.playProgress();
            }
            this.hud.showToast('Has cogido la chaqueta. Llévala a Don Mateo.', 'You picked up the jacket. Bring it to Don Mateo.', true);
            this.setIndicatorForQuest(this.activeQuests[0]);
            if (this.donMateo && this.donMateo.showAttentionArrow) {
              this.donMateo.showAttentionArrow();
            }
            return true;
          }
        }

        // Also allow picking up Scarf
        if (!this.coldScarf.isCollected) {
          const distScarf = Phaser.Math.Distance.Between(player.x, player.y, this.coldScarf.x, this.coldScarf.y);
          if (distScarf <= 55) {
            this.coldScarf.isCollected = true;
            this.coldScarf.setVisible(false);
            if (this.scene.soundManager) {
              this.scene.soundManager.playProgress();
            }
            this.hud.showToast('Has cogido la bufanda.', 'You picked up the scarf.', true);
            if (this.donMateo && this.donMateo.showAttentionArrow) {
              this.donMateo.showAttentionArrow();
            }
            return true;
          }
        }

        // Deliver to Don Mateo
        if (this.coldJacket.isCollected || this.coldScarf.isCollected) {
          const distMateo = Phaser.Math.Distance.Between(player.x, player.y, this.donMateo.x, this.donMateo.y);
          if (distMateo <= 75) {
            return false; // Let handleDonMateoInteract open Don Mateo's bilingual dialogue
          }
        }
      }

      // 2. Scarf for Elena (Quest 2 - Bonus)
      if (this.state === QuestStates.BONUS_TIMER && !this.activeQuests[1].isCompleted) {
        if (!this.coldScarf.isCollected) {
          const distScarf = Phaser.Math.Distance.Between(player.x, player.y, this.coldScarf.x, this.coldScarf.y);
          if (distScarf <= 55) {
            this.coldScarf.isCollected = true;
            this.coldScarf.setVisible(false);
            if (this.scene.soundManager) {
              this.scene.soundManager.playProgress();
            }
            this.hud.showToast('Has cogido la bufanda. Llévala a Elena.', 'You picked up the scarf. Bring it to Elena.', true);
            this.setIndicatorForQuest(this.activeQuests[1]);
            return true;
          }
        } else {
          const distElena = Phaser.Math.Distance.Between(player.x, player.y, this.coldElena.x, this.coldElena.y);
          if (distElena <= 70) {
            this.coldScarf.isDelivered = true;
            this.hud.showToast('Elena agradece la bufanda.', 'Elena thanks you for the scarf.', true);
            this.completeBonusQuest(1);
            return true;
          }
        }
      }

      // 3. Escort Elena to café (Quest 3 - Bonus)
      if (this.state === QuestStates.BONUS_TIMER && !this.activeQuests[2].isCompleted) {
        const distElena = Phaser.Math.Distance.Between(player.x, player.y, this.coldElena.x, this.coldElena.y);
        if (!this.coldElena.isFollowingPlayer && distElena <= 70) {
          this.coldElena.isEscorted = true;
          this.coldElena.isFollowingPlayer = true;
          this.coldElena.setImmovable(false);
          if (this.scene.soundManager) {
            this.scene.soundManager.playProgress();
          }
          this.hud.showToast('Elena: «Gracias. Te sigo al café cálido.»', 'Elena: "Thank you. Following you to the warm café."', true);
          this.setIndicatorForQuest(this.activeQuests[2]);
          return true;
        } else if (this.coldElena.isFollowingPlayer && distElena <= 70) {
          this.hud.showToast('Elena: «Vamos al café bajo el toldo.»', 'Elena: "Let\'s head to the café awning."', true);
          return true;
        }
      }
    }

    // --- HEAT INTERACTIONS ---
    if (weather === 'heat') {
      // 1. Water for Sofia (Quest 1)
      if (!this.activeQuests[0].isCompleted) {
        if (!this.heatSofia.hasWater) {
          const distFountain = Phaser.Math.Distance.Between(player.x, player.y, 640, 370);
          if (distFountain <= 85) {
            this.heatSofia.hasWater = true;
            if (this.scene.soundManager) {
              this.scene.soundManager.playProgress();
            }
            this.hud.showToast('Has cogido agua fresca. Llévala a Sofia.', 'You got fresh water. Bring it to Sofia.', true);
            this.setIndicatorForQuest(this.activeQuests[0]);
            return true;
          }
        } else {
          const distSofia = Phaser.Math.Distance.Between(player.x, player.y, this.heatSofia.x, this.heatSofia.y);
          if (distSofia <= 65) {
            this.hud.showToast('Sofia ha bebido agua fresca.', 'Sofia drank fresh water.', true);
            this.completeFirstQuest();
            return true;
          }
        }
      }

      // 2. Sofia to shade beneath the large tree by the bench (Quest 2 - Bonus)
      if (this.state === QuestStates.BONUS_TIMER && !this.activeQuests[1].isCompleted) {
        const distSofia = Phaser.Math.Distance.Between(player.x, player.y, this.heatSofia.x, this.heatSofia.y);
        if (distSofia <= 70 && !this.heatSofia.isFollowingPlayer && !this.heatSofia.inShade) {
          this.heatSofia.isFollowingPlayer = true;
          this.heatSofia.isEscorted = true;
          this.heatSofia.setImmovable(false);
          if (this.scene.soundManager) {
            this.scene.soundManager.playProgress();
          }
          this.hud.showToast('Sofia: «Gracias. Vamos a la sombra del árbol.»', 'Sofia: "Thank you. Let\'s go to the shade under the tree."', true);
          this.setIndicatorForQuest(this.activeQuests[1]);
          return true;
        } else if (this.heatSofia.isFollowingPlayer && distSofia <= 70) {
          this.hud.showToast('Sofia: «Vamos a la sombra bajo el árbol.»', 'Sofia: "Let\'s head to the shade under the tree."', true);
          return true;
        }
      }

      // 3. Ice cream from Paco the Heladero (Quest 3 - Bonus)
      if (this.state === QuestStates.BONUS_TIMER && !this.activeQuests[2].isCompleted) {
        const distHeladero = Phaser.Math.Distance.Between(player.x, player.y, this.heladero.x, this.heladero.y);
        if (distHeladero <= 70 && !this.heladero.isOrdered) {
          this.triggerHeladeroOrder(player);
          return true;
        }
      }
    }

    // --- SUNNY INTERACTIONS ---
    if (weather === 'sunny') {
      // 1. Inspect flowers (Quest 1)
      if (!this.activeQuests[0].isCompleted) {
        const distFlowers = Phaser.Math.Distance.Between(player.x, player.y, this.sunnyFlowers.x, this.sunnyFlowers.y);
        if (distFlowers <= 60) {
          this.sunnyFlowers.isInspected = true;
          this.hud.showToast('Has observado las flores del puesto.', 'You inspected the flowers at the stand.', true);
          this.completeFirstQuest();
          return true;
        }
      }

      // 2. Sofia to shade beneath the large tree by the bench (Quest 2 - Bonus)
      if (this.state === QuestStates.BONUS_TIMER && !this.activeQuests[1].isCompleted) {
        const distSofia = Phaser.Math.Distance.Between(player.x, player.y, this.heatSofia.x, this.heatSofia.y);
        if (distSofia <= 70 && !this.heatSofia.isFollowingPlayer && !this.heatSofia.inShade) {
          this.heatSofia.isFollowingPlayer = true;
          this.heatSofia.isEscorted = true;
          this.heatSofia.setImmovable(false);
          if (this.scene.soundManager) {
            this.scene.soundManager.playProgress();
          }
          this.hud.showToast('Sofia: «Gracias. Vamos a la sombra del árbol.»', 'Sofia: "Thank you. Let\'s go to the shade under the tree."', true);
          this.setIndicatorForQuest(this.activeQuests[1]);
          return true;
        } else if (this.heatSofia.isFollowingPlayer && distSofia <= 70) {
          this.hud.showToast('Sofia: «Vamos a la sombra bajo el árbol.»', 'Sofia: "Let\'s head to the shade under the tree."', true);
          return true;
        }
      }

      // 3. Ice cream from Paco the Heladero (Quest 3 - Bonus)
      if (this.state === QuestStates.BONUS_TIMER && !this.activeQuests[2].isCompleted) {
        const distHeladero = Phaser.Math.Distance.Between(player.x, player.y, this.heladero.x, this.heladero.y);
        if (distHeladero <= 70 && !this.heladero.isOrdered) {
          this.triggerHeladeroOrder(player);
          return true;
        }
      }
    }

    // Check exploration object interaction if no quest action occurred
    if (this.activeNearbyExplorationObject) {
      return this.handleExplorationObjectInteract(this.activeNearbyExplorationObject, player);
    }

    return false;
  }

  triggerHeladeroOrder(player) {
    player.setMovementLock(true);
    if (this.scene.soundManager) {
      this.scene.soundManager.playInteract();
    }

    const dlg = {
      speakerEs: 'Paco el Heladero (La Heladería)',
      speakerEn: 'Paco the Ice Cream Vendor (Ice Cream Shop)',
      spanish: '¿Deseas un helado de fresa y vainilla?\n— Sí, por favor. Me gusta el helado.\n— ¡Aquí tienes! Que lo disfrutes al sol.',
      english: 'Would you like a strawberry and vanilla ice cream?\n— Yes, please. I like ice cream.\n— Here you go! Enjoy it in the sun.'
    };

    this.scene.dialogueBox.open(dlg, () => {
      player.setMovementLock(false);
      this.heladero.isOrdered = true;

      // Audio cue: quest completion sound
      if (this.scene.soundManager) {
        this.scene.soundManager.playCompletion();
      }

      // Visual floating ice cream effect
      this.playIceCreamVisualEffect(player);

      // Toast feedback
      this.hud.showToast(
        'Has pedido un helado artesanal.',
        'You ordered an artisan ice cream.',
        true
      );

      // Complete the ice cream quest
      const iceQuestIdx = this.activeQuests.findIndex((q) => q.id.includes('ice_cream'));
      if (iceQuestIdx !== -1) {
        this.completeBonusQuest(iceQuestIdx);
      }
    });
  }

  playIceCreamVisualEffect(player) {
    const ice = this.scene.add.sprite(player.x, player.y - 20, 'helado');
    ice.setDepth(player.depth + 10);
    ice.setScale(0.5);

    this.scene.tweens.add({
      targets: ice,
      y: player.y - 48,
      scale: 1.3,
      duration: 500,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.tweens.add({
          targets: ice,
          y: player.y - 60,
          alpha: 0,
          scale: 1.5,
          duration: 600,
          delay: 200,
          ease: 'Sine.easeIn',
          onComplete: () => ice.destroy()
        });
      }
    });
  }

  handleExplorationObjectInteract(obj, player) {
    if (!obj || !obj.data) return false;

    player.setMovementLock(true);
    if (this.scene.soundManager) {
      this.scene.soundManager.playProgress();
    }

    if (obj.sprite) {
      this.scene.tweens.add({
        targets: obj.sprite,
        scaleX: 1.25,
        scaleY: 1.25,
        yoyo: true,
        duration: 180
      });
    }

    // Interactive football kick behavior for sunny weather balón
    if (obj.data.id === 'sunny_balon' && obj.sprite) {
      this.kickFootball(obj.sprite, player);
    }

    const cleanSpanish = (obj.data.exampleEs || '').replace(/^[«"'\s]+|[»"'\s]+$/g, '');
    const cleanEnglish = (obj.data.exampleEn || '').replace(/^[«"'\s]+|[»"'\s]+$/g, '');

    const dlg = {
      speakerEs: `Objeto: ${obj.data.es.toUpperCase()}`,
      speakerEn: `Object: ${obj.data.en.toUpperCase()}`,
      spanish: cleanSpanish,
      english: cleanEnglish
    };

    this.scene.dialogueBox.open(dlg, () => {
      player.setMovementLock(false);
      obj.isExplored = true;

      this.hud.setVocabularyDisplay(`«${obj.data.es}» (${obj.data.en}) — ${obj.data.exampleEs}`);

      this.hud.showToast(
        `Has descubierto: ${obj.data.es} (${obj.data.en})`,
        `You discovered: ${obj.data.es} (${obj.data.en})`,
        true
      );
    });

    return true;
  }

  kickFootball(ball, player) {
    if (!ball || !player) return;

    // Determine kick angle away from player
    let angle = Phaser.Math.Angle.Between(player.x, player.y, ball.x, ball.y);
    if (Phaser.Math.Distance.Between(player.x, player.y, ball.x, ball.y) < 5) {
      angle = player.flipX ? Math.PI : 0;
    }

    const kickDist = 60;
    let targetX = ball.x + Math.cos(angle) * kickDist;
    let targetY = ball.y + Math.sin(angle) * kickDist;

    // Keep within the open, safe south-west plaza paving away from walls/boundaries
    targetX = Phaser.Math.Clamp(targetX, 360, 620);
    targetY = Phaser.Math.Clamp(targetY, 440, 580);

    // Audio cue
    if (this.scene.soundManager) {
      this.scene.soundManager.playProgress();
    }

    // Smooth physics roll & rotation
    this.scene.tweens.add({
      targets: ball,
      x: targetX,
      y: targetY,
      angle: ball.angle + (targetX > ball.x ? 180 : -180),
      duration: 400,
      ease: 'Quad.easeOut',
      onUpdate: () => {
        ball.setDepth(18 + Math.floor(ball.y / 10));
      }
    });
  }

  updateExplorationProximity(player, isDialogueOpen) {
    if (!this.explorationPrompt) return;

    if (
      isDialogueOpen ||
      (this.quizModal && this.quizModal.isOpen) ||
      (this.completionModal && this.completionModal.isOpen)
    ) {
      this.explorationPrompt.setVisible(false);
      this.activeNearbyExplorationObject = null;
      return;
    }

    const currentList = this.explorationObjects[this.currentWeather] || [];
    let nearestObj = null;
    let minDistance = 55;

    for (const obj of currentList) {
      if (!obj.sprite || !obj.sprite.visible) continue;
      if (obj.sprite.isCarried) continue;

      const dist = Phaser.Math.Distance.Between(player.x, player.y, obj.sprite.x, obj.sprite.y);
      if (dist <= minDistance) {
        minDistance = dist;
        nearestObj = obj;
      }
    }

    if (nearestObj) {
      this.activeNearbyExplorationObject = nearestObj;
      this.explorationPrompt.setPosition(nearestObj.sprite.x, nearestObj.sprite.y - 30);
      this.explorationPromptText.setText(`[E] Explorar: «${nearestObj.data.es}»`);
      this.explorationPrompt.setVisible(true);
    } else {
      this.activeNearbyExplorationObject = null;
      this.explorationPrompt.setVisible(false);
    }
  }

  // ==========================================
  // 8. UPDATE LOOP
  // ==========================================
  update(player, isDialogueOpen) {
    if (!player) return;

    // Update carried props positions
    if (this.rainChair && this.rainChair.isCarried) {
      this.rainChair.updateCarried(player);
    }
    if (this.umbrella && this.umbrella.isCarried) {
      this.umbrella.updateCarried(player);
    }
    if (this.rainCrate && this.rainCrate.isCarried) {
      this.rainCrate.setPosition(player.x, player.y - 12);
      this.rainCrate.setDepth(player.depth + 1);
    }
    if (this.windCrate && this.windCrate.isCarried) {
      this.windCrate.setPosition(player.x, player.y - 12);
      this.windCrate.setDepth(player.depth + 1);
    }

    // Update Elena following player for the café escort quest
    if (this.coldElena && this.coldElena.visible && this.coldElena.isFollowingPlayer && !this.activeQuests[2].isCompleted) {
      if (isDialogueOpen) {
        this.coldElena.setVelocity(0, 0);
      } else {
        const distToPlayer = Phaser.Math.Distance.Between(this.coldElena.x, this.coldElena.y, player.x, player.y);
        const distToCafe = Phaser.Math.Distance.Between(this.coldElena.x, this.coldElena.y, 825, 255);

        // Check if Elena reached the café awning entrance
        const inCafeZone = (this.coldElena.x >= 790 && this.coldElena.x <= 870 && this.coldElena.y >= 210 && this.coldElena.y <= 280);
        if (distToCafe <= 55 || (inCafeZone && distToPlayer <= 85)) {
          this.coldElena.isFollowingPlayer = false;
          this.coldElena.setVelocity(0, 0);
          this.coldElena.setPosition(825, 255);
          this.coldElena.setImmovable(true);
          this.hud.showToast('Elena ya está al calor del café.', 'Elena is now warm at the café.', true);
          this.completeBonusQuest(2);
        } else {
          // Relaxed walking pace: ~92-105 px/s
          const escortSpeed = distToPlayer > 120 ? 105 : 92;
          if (distToPlayer > 42) {
            const angle = Phaser.Math.Angle.Between(this.coldElena.x, this.coldElena.y, player.x, player.y);
            this.coldElena.setVelocity(Math.cos(angle) * escortSpeed, Math.sin(angle) * escortSpeed);
            this.coldElena.setFlipX(player.x < this.coldElena.x);
          } else {
            this.coldElena.setVelocity(0, 0);
          }
          this.coldElena.setDepth(20 + Math.floor(this.coldElena.y / 10));
        }
      }
    }

    // Update Sofia following player for the tree shade escort quest
    if (this.heatSofia && this.heatSofia.visible && this.heatSofia.isFollowingPlayer && !this.heatSofia.inShade) {
      if (isDialogueOpen) {
        this.heatSofia.setVelocity(0, 0);
      } else {
        const distToPlayer = Phaser.Math.Distance.Between(this.heatSofia.x, this.heatSofia.y, player.x, player.y);
        const distToShade = Phaser.Math.Distance.Between(this.heatSofia.x, this.heatSofia.y, 755, 515);

        // Check if Sofia reached the designated shaded area beneath the tree
        const inShadeZone = (this.heatSofia.x >= 720 && this.heatSofia.x <= 790 && this.heatSofia.y >= 475 && this.heatSofia.y <= 540);
        if (distToShade <= 50 || (inShadeZone && distToPlayer <= 85)) {
          this.heatSofia.isFollowingPlayer = false;
          this.heatSofia.setVelocity(0, 0);
          this.heatSofia.setPosition(755, 515);
          this.heatSofia.setDepth(20 + Math.floor(515 / 10));
          this.heatSofia.setImmovable(true);
          this.heatSofia.inShade = true;
          this.hud.showToast('Sofia descansa en la sombra fresca del árbol.', 'Sofia is resting in the cool shade of the tree.', true);
          const shadeQuestIdx = this.activeQuests.findIndex((q) => q.id.includes('shade'));
          if (shadeQuestIdx !== -1) {
            this.completeBonusQuest(shadeQuestIdx);
          }
        } else {
          // Relaxed walking pace: ~92-105 px/s
          const escortSpeed = distToPlayer > 120 ? 105 : 92;
          if (distToPlayer > 42) {
            const angle = Phaser.Math.Angle.Between(this.heatSofia.x, this.heatSofia.y, player.x, player.y);
            this.heatSofia.setVelocity(Math.cos(angle) * escortSpeed, Math.sin(angle) * escortSpeed);
            this.heatSofia.setFlipX(player.x < this.heatSofia.x);
          } else {
            this.heatSofia.setVelocity(0, 0);
          }
          this.heatSofia.setDepth(20 + Math.floor(this.heatSofia.y / 10));
        }
      }
    }

    // Update Heladero proximity with hysteresis
    if (this.heladero && this.heladero.visible && this.heladeroPrompt) {
      const distHeladero = Phaser.Math.Distance.Between(player.x, player.y, this.heladero.x, this.heladero.y);
      const enterRadius = 65;
      const exitRadius = 80;
      if (this.isPlayerNearHeladero) {
        this.isPlayerNearHeladero = distHeladero <= exitRadius;
      } else {
        this.isPlayerNearHeladero = distHeladero <= enterRadius;
      }
      this.heladeroPrompt.setVisible(this.isPlayerNearHeladero && !isDialogueOpen && !this.heladero.isOrdered);
    }

    // Update animated quest indicators
    this.updateIndicators();

    // Update Camarero proximity with hysteresis
    if (this.camarero && this.camarero.visible) {
      this.camarero.updateProximity(player, isDialogueOpen);
    }

    // Update Umbrella proximity
    if (this.umbrella && this.umbrella.visible) {
      this.umbrella.updateProximity(player, Boolean(this.rainChair && this.rainChair.isCarried));
    }

    // Update Carmen proximity with hysteresis
    if (this.carmen && this.carmen.visible && this.carmenPrompt) {
      const distCarmen = Phaser.Math.Distance.Between(player.x, player.y, this.carmen.x, this.carmen.y);
      const enterRadius = 70;
      const exitRadius = 85;
      if (this.isPlayerNearCarmen) {
        this.isPlayerNearCarmen = distCarmen <= exitRadius;
      } else {
        this.isPlayerNearCarmen = distCarmen <= enterRadius;
      }
      this.carmenPrompt.setVisible(this.isPlayerNearCarmen && !isDialogueOpen);
    } else if (this.carmenPrompt) {
      this.carmenPrompt.setVisible(false);
      this.isPlayerNearCarmen = false;
    }

    // Update exploration objects proximity
    this.updateExplorationProximity(player, isDialogueOpen);
  }

  startNewSession() {
    this.cleanUpCurrentEvent();
    if (this.quizModal && this.quizModal.isOpen) {
      this.quizModal.finishQuiz(true);
    }
    this.initSessionQueue();
    this.currentWeather = 'sunny';
    this.weatherManager.setWeather('sunny');

    if (this.scene.soundManager) {
      this.scene.soundManager.setWeather('sunny');
    }

    if (this.donMateo && this.donMateo.showAttentionArrow) {
      this.donMateo.showAttentionArrow();
    }

    this.hud.setWeatherDisplay('sunny');
    this.hud.setTaskDisplay(
      'MISIÓN: Habla con Don Mateo para empezar.',
      'MISSION: Talk to Don Mateo to start.'
    );
    this.hud.setVocabularyDisplay('«Hace sol» = It\'s sunny • «¿Listo para el tiempo loco?» = Ready for crazy weather?');
    this.hud.showToast('Nueva sesión iniciada. Habla con Don Mateo.', 'New session started. Speak with Don Mateo.', true);
  }

  destroy() {
    this.cleanUpCurrentEvent();
    if (this.quizModal) this.quizModal.destroy();
    if (this.explorationPrompt) this.explorationPrompt.destroy();
    if (this.carmenPrompt) this.carmenPrompt.destroy();
    if (this.heladeroPrompt) this.heladeroPrompt.destroy();
    this.allProps.forEach((p) => p.destroy());
  }
}
