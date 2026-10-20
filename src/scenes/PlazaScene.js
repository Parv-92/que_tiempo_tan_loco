import Phaser from 'phaser';
import { ASSET_KEYS, SCENE_KEYS } from '../config/constants.js';
import { GameHUD } from '../ui/GameHUD.js';
import { Player } from '../entities/Player.js';
import { DonMateo } from '../entities/DonMateo.js';
import { createPlazaColliders } from '../data/collisionData.js';
import { DialogueBox } from '../ui/DialogueBox.js';
import { WeatherCycleController } from '../systems/WeatherCycleController.js';

import { SoundManager } from '../systems/SoundManager.js';

export class PlazaScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.PLAZA });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Check if background asset was successfully loaded in BootScene
    const hasMapAsset = Boolean(this.registry.get('hasMapAsset')) && this.textures.exists(ASSET_KEYS.MAP_SUNNY.KEY);

    if (hasMapAsset) {
      this.renderLoadedBackground(width, height);
    } else {
      this.renderFallbackPlaza(width, height);
    }

    // 1. Static collision obstacles
    this.obstacles = createPlazaColliders(this);

    // 2. Spawn Don Mateo NPC in open plaza east of the fountain
    this.donMateo = new DonMateo(this, 775, 375);

    // 3. Spawn Player in open plaza south of the fountain
    this.player = new Player(this, 640, 480);

    // 3.5. Spawn ambient stationary NPCs sitting naturally on available plaza benches
    this.createAmbientBenchNPCs();

    // 4. Initialize Sound Manager (Web Audio synthesis)
    this.soundManager = new SoundManager(this);

    // 5. Initialize Dialogue Box UI
    this.dialogueBox = new DialogueBox(this);

    // 6. Initialize HUD overlay with weather cycle toggle and sound toggle
    this.hud = new GameHUD(this, {
      onWeatherToggle: () => this.weatherCycle.cycleNext(),
      onSoundToggle: () => this.soundManager.toggleMute()
    });

    // 7. Initialize Weather Cycle Controller
    this.weatherCycle = new WeatherCycleController(this, {
      hud: this.hud,
      player: this.player
    });

    // Start sunny background ambience
    this.soundManager.setWeather('sunny');

    // Clean up sound and HUD on scene shutdown
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.soundManager) {
        this.soundManager.destroy();
      }
      if (this.hud && this.hud.destroy) {
        this.hud.destroy();
      }
    });

    this.weatherCycle.completionModal.callbacks.onStartNewSession = () => {
      this.hasHadFirstDonMateoInteraction = false;
      this.isWeatherTransitionScheduled = false;
      if (this.delayedWeatherTimer) {
        this.delayedWeatherTimer.remove();
        this.delayedWeatherTimer = null;
      }
      this.weatherCycle.startNewSession();
    };

    this.hasHadFirstDonMateoInteraction = false;
    this.isWeatherTransitionScheduled = false;
    this.delayedWeatherTimer = null;

    // 7. Setup physics collisions
    this.physics.add.collider(this.player, this.obstacles);
    this.physics.add.collider(this.player, this.donMateo);
    this.physics.add.collider(this.player, this.weatherCycle.cafeTask.camarero);
    this.physics.add.collider(this.player, this.weatherCycle.windTask.carmen);
    this.physics.add.collider(this.player, this.weatherCycle.heatTask.sofia);

    // 8. Interaction callbacks
    this.donMateo.onInteractCallback = () => this.handleInteract();
    this.weatherCycle.cafeTask.camarero.onInteractCallback = () => this.handleCamareroInteract();

    // 9. Setup interaction keyboard controls (E, Space, Q)
    this.interactKeyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.interactKeySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.interactKeyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
  }

  handleInteract() {
    // 1. If dialogue is open (or was closed within the last 200ms), close it and consume input
    if (this.dialogueBox.isOpen || (this.dialogueBox.lastClosedTime && Date.now() - this.dialogueBox.lastClosedTime < 200)) {
      if (this.dialogueBox.isOpen) {
        this.dialogueBox.close();
      }
      return;
    }

    // 2. If completion modal or quiz modal is open, return
    if (this.weatherCycle.completionModal && this.weatherCycle.completionModal.isOpen) {
      return;
    }
    if (this.weatherCycle.questManager && this.weatherCycle.questManager.quizModal && this.weatherCycle.questManager.quizModal.isOpen) {
      return;
    }

    // 3. Priority: Active weather item interactions (chairs, umbrella, papers, clothes, water)
    const itemHandled = this.weatherCycle.handleInteraction(this.player);
    if (itemHandled) {
      return;
    }

    // 4. Camarero interaction (during rain)
    if (
      this.weatherCycle.currentWeather === 'rain' &&
      this.weatherCycle.cafeTask.camarero &&
      this.weatherCycle.cafeTask.camarero.isPlayerNearby
    ) {
      this.handleCamareroInteract();
      return;
    }

    // 5. Carmen interaction (during wind)
    if (this.weatherCycle.currentWeather === 'wind') {
      const distCarmen = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.weatherCycle.windTask.carmen.x,
        this.weatherCycle.windTask.carmen.y
      );
      if (distCarmen <= 70) {
        this.handleCarmenInteract();
        return;
      }
    }

    // 6. Don Mateo interaction
    if (this.donMateo && this.donMateo.isPlayerNearby) {
      this.handleDonMateoInteract();
    }
  }

  handleDonMateoInteract() {
    this.player.setMovementLock(true);
    if (this.soundManager) {
      this.soundManager.playInteract();
    }

    // Hide attention arrow on interaction
    if (this.donMateo && this.donMateo.hideAttentionArrow) {
      this.donMateo.hideAttentionArrow();
    }

    const weather = this.weatherCycle.currentWeather;

    // Check cold task delivery to Don Mateo
    const hasColdClothes = this.weatherCycle.questManager && (this.weatherCycle.questManager.coldJacket.isCollected || this.weatherCycle.coldTask.isCompleted);
    if (weather === 'cold' && (hasColdClothes || this.weatherCycle.coldTask.isCompleted)) {
      const dlg = {
        speakerEs: 'Don Mateo (Vecino de la plaza)',
        speakerEn: 'Don Mateo (Plaza Local)',
        spanish: '¡Muchas gracias por la chaqueta y la bufanda! Ya no tengo frío.',
        english: 'Thank you very much for the jacket and the scarf! I am no longer cold.'
      };
      this.dialogueBox.open(dlg, () => {
        this.player.setMovementLock(false);
        if (this.weatherCycle.questManager && !this.weatherCycle.questManager.activeQuests[0].isCompleted) {
          this.weatherCycle.questManager.completeFirstQuest();
        } else if (this.weatherCycle.handleTaskCompletion) {
          this.weatherCycle.handleTaskCompletion('cold');
        }
      });
      return;
    }

    // Check wind hat delivery to Don Mateo
    if (weather === 'wind' && this.weatherCycle.questManager && this.weatherCycle.questManager.windHat.isCollected) {
      this.weatherCycle.questManager.windHat.isDelivered = true;
      const dlg = {
        speakerEs: 'Don Mateo (Vecino de la plaza)',
        speakerEn: 'Don Mateo (Plaza Local)',
        spanish: '¡Mi sombrero! Muchas gracias por recuperarlo. Con este viento casi se pierde.',
        english: 'My hat! Thank you very much for recovering it. With this wind it almost blew away.'
      };
      this.dialogueBox.open(dlg, () => {
        this.player.setMovementLock(false);
        this.weatherCycle.questManager.completeBonusQuest(1);
      });
      return;
    }

    // Check umbrella reaction during rain
    if (weather === 'rain' && this.weatherCycle.umbrella.isCarried) {
      const dlg = {
        speakerEs: 'Don Mateo (Vecino de la plaza)',
        speakerEn: 'Don Mateo (Plaza Local)',
        spanish: '¡El paraguas es genial! Ahora estás protegido de la lluvia.',
        english: 'The umbrella is great! Now you are protected from the rain.'
      };
      this.dialogueBox.open(dlg, () => this.player.setMovementLock(false));
      return;
    }

    // First interaction in Sunny weather triggers delayed random weather event
    if (!this.hasHadFirstDonMateoInteraction && weather === 'sunny') {
      this.hasHadFirstDonMateoInteraction = true;
      const dlg = {
        speakerEs: 'Don Mateo (Vecino de la plaza)',
        speakerEn: 'Don Mateo (Plaza Local)',
        spanish: '¡Hola! ¿Listo para el tiempo loco?',
        english: 'Hello! Ready for some crazy weather?'
      };
      this.dialogueBox.open(dlg, () => {
        this.player.setMovementLock(false);
        this.scheduleDelayedWeatherEvent(1800);
      });
      return;
    }

    // If weather transition is already scheduled and player interacts again during the 1.5-2s window:
    if (this.isWeatherTransitionScheduled) {
      const dlg = {
        speakerEs: 'Don Mateo (Vecino de la plaza)',
        speakerEn: 'Don Mateo (Plaza Local)',
        spanish: '¡Mira al cielo! El tiempo va a cambiar en un momento.',
        english: 'Look at the sky! The weather is going to change in a moment.'
      };
      this.dialogueBox.open(dlg, () => this.player.setMovementLock(false));
      return;
    }

    // Concise one-sentence weather dialogue
    const dlg = this.donMateo.getNextDialogue(weather, false);
    this.dialogueBox.open(dlg, () => {
      this.player.setMovementLock(false);
    });
  }

  scheduleDelayedWeatherEvent(delayMs = 1800) {
    if (this.isWeatherTransitionScheduled) return;
    this.isWeatherTransitionScheduled = true;

    this.hud.showToast('El cielo empieza a cambiar...', 'The sky begins to change...', true);

    if (this.delayedWeatherTimer) {
      this.delayedWeatherTimer.remove();
    }

    this.delayedWeatherTimer = this.time.delayedCall(delayMs, () => {
      // Ensure dialogue box is not open; if open, wait until closed
      if (this.dialogueBox && this.dialogueBox.isOpen) {
        this.delayedWeatherTimer = this.time.delayedCall(600, () => {
          this.triggerRandomWeatherEvent();
        });
        return;
      }
      this.triggerRandomWeatherEvent();
    });
  }

  triggerRandomWeatherEvent() {
    this.isWeatherTransitionScheduled = false;
    this.delayedWeatherTimer = null;

    // Visual transition: subtle camera flash
    this.cameras.main.flash(350, 255, 255, 255, false);

    // Pick and start a random eligible weather event
    this.weatherCycle.startRandomWeatherEvent();
  }

  handleCamareroInteract() {
    this.player.setMovementLock(true);
    if (this.soundManager) {
      this.soundManager.playInteract();
    }

    let dlg;
    if (this.weatherCycle.cafeTask.isCompleted) {
      dlg = {
        speakerEs: 'Marcos el Camarero (Café)',
        speakerEn: 'Marcos the Café Worker',
        spanish: '¡Muchas gracias! Ahora las sillas están a salvo de la lluvia.',
        english: 'Thank you very much! Now the chairs are safe from the rain.'
      };
    } else if (this.weatherCycle.cafeTask.carriedChair) {
      dlg = {
        speakerEs: 'Marcos el Camarero (Café)',
        speakerEn: 'Marcos the Café Worker',
        spanish: 'Pon la silla aquí mismo, bajo el toldo del café.',
        english: 'Put the chair right here, under the café awning.'
      };
    } else {
      dlg = {
        speakerEs: 'Marcos el Camarero (Café)',
        speakerEn: 'Marcos the Café Worker',
        spanish: '¡Se acerca la lluvia! Por favor, ayúdame a poner las sillas bajo el toldo.',
        english: 'Rain is coming! Please help me put the chairs under the awning.'
      };
    }

    this.dialogueBox.open(dlg, () => this.player.setMovementLock(false));
  }

  handleCarmenInteract() {
    this.player.setMovementLock(true);
    if (this.soundManager) {
      this.soundManager.playInteract();
    }

    let dlg;
    if (this.weatherCycle.windTask.isDelivered) {
      dlg = {
        speakerEs: 'Carmen (Vendedora del mercado)',
        speakerEn: 'Carmen (Market Vendor)',
        spanish: '¡Muchas gracias! Los papeles del mercado ya están seguros en el puesto.',
        english: 'Thank you very much! The market papers are now safe at the stall.'
      };
    } else {
      dlg = {
        speakerEs: 'Carmen (Vendedora del mercado)',
        speakerEn: 'Carmen (Market Vendor)',
        spanish: '¡Qué viento! Por favor, recoge los papeles que vuelan por la plaza.',
        english: 'What wind! Please collect the papers flying across the plaza.'
      };
    }

    this.dialogueBox.open(dlg, () => this.player.setMovementLock(false));
  }

  update(time, delta) {
    const isEJustDown = Phaser.Input.Keyboard.JustDown(this.interactKeyE);
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(this.interactKeySpace);
    const isQJustDown = Phaser.Input.Keyboard.JustDown(this.interactKeyQ);

    if (isQJustDown) {
      if (this.weatherCycle && this.weatherCycle.questManager) {
        this.weatherCycle.questManager.skipExplorationToQuiz();
      }
    }

    if (isEJustDown || isSpaceJustDown) {
      this.handleInteract();
    }

    if (this.player) {
      this.player.update();
    }

    if (this.donMateo && this.player) {
      this.donMateo.updateProximity(this.player, this.dialogueBox.isOpen);
    }

    if (this.weatherCycle && this.player) {
      this.weatherCycle.update(this.player, this.dialogueBox.isOpen);
    }
  }

  createAmbientBenchNPCs() {
    // 1. Citizen sitting comfortably on the North-East bench near town hall entrance
    const npcNorth = this.add.sprite(585, 236, 'citizen');
    npcNorth.setDepth(19);
    npcNorth.setTint(0xf1f5f9);

    // 2. Citizen sitting on the West bench below market pergola
    const npcWest = this.add.sprite(265, 365, 'sofia');
    npcWest.setDepth(19);
    npcWest.setFlipX(true); // Facing open plaza
    npcWest.setTint(0xe2e8f0);

    this.ambientBenchNpcs = [npcNorth, npcWest];
  }

  renderLoadedBackground(sceneWidth, sceneHeight) {
    const bgBase = this.add.graphics();
    bgBase.fillStyle(0x111827, 1);
    bgBase.fillRect(0, 0, sceneWidth, sceneHeight);

    const bgImage = this.add.image(sceneWidth / 2, sceneHeight / 2, ASSET_KEYS.MAP_SUNNY.KEY);

    const scale = Math.min(sceneWidth / bgImage.width, sceneHeight / bgImage.height);
    bgImage.setScale(scale);
    bgImage.setOrigin(0.5);

    const vignette = this.add.graphics();
    vignette.lineStyle(2, 0x1e293b, 0.8);
    vignette.strokeRect(0, 0, sceneWidth, sceneHeight);
  }

  renderFallbackPlaza(sceneWidth, sceneHeight) {
    const gfx = this.add.graphics();

    gfx.fillGradientStyle(0x7c2d12, 0x7c2d12, 0x9a3412, 0x9a3412, 1);
    gfx.fillRect(0, 0, sceneWidth, sceneHeight);

    gfx.lineStyle(1, 0xb45309, 0.25);
    const step = 40;
    for (let x = 0; x < sceneWidth; x += step) {
      gfx.lineBetween(x, 0, x, sceneHeight);
    }
    for (let y = 0; y < sceneHeight; y += step) {
      gfx.lineBetween(0, y, sceneWidth, y);
    }

    const centerX = sceneWidth / 2;
    const centerY = sceneHeight / 2 + 10;
    gfx.fillStyle(0xd97706, 0.2);
    gfx.fillCircle(centerX, centerY, 180);
    gfx.lineStyle(3, 0xf59e0b, 0.4);
    gfx.strokeCircle(centerX, centerY, 180);

    gfx.fillStyle(0x0284c7, 0.4);
    gfx.fillCircle(centerX, centerY, 70);
    gfx.lineStyle(3, 0x38bdf8, 0.8);
    gfx.strokeCircle(centerX, centerY, 70);

    this.add.text(centerX, centerY, '⛲\nFuente Central\n(Central Fountain)', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '14px',
      fontWeight: '700',
      color: '#e0f2fe',
      align: 'center'
    }).setOrigin(0.5);
  }
}
