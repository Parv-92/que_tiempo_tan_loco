import { WEATHER_VOCABULARY_INVENTORY } from '../config/constants.js';

export class CompletionModal {
  /**
   * @param {Phaser.Scene} scene
   * @param {Object} callbacks
   * @param {Function} callbacks.onReplay
   * @param {Function} callbacks.onCycleNext
   * @param {Function} callbacks.onReturnSunny
   * @param {Function} callbacks.onClose
   * @param {Function} callbacks.onStartNewSession
   */
  constructor(scene, callbacks) {
    this.scene = scene;
    this.callbacks = callbacks;
    this.isOpen = false;
    this.currentWeatherType = 'rain';
    this.autoAdvanceTimer = null;
    this.autoAdvanceSeconds = 3;

    const { width, height } = scene.cameras.main;
    this.modalWidth = 720;
    this.modalHeight = 470;

    this.container = scene.add.container(width / 2, height / 2);
    this.container.setDepth(120);
    this.container.setVisible(false);

    this.createElements();
  }

  createElements() {
    const { scene, modalWidth, modalHeight } = this;

    this.dimOverlay = scene.add.graphics();
    this.dimOverlay.fillStyle(0x000000, 0.7);
    this.dimOverlay.fillRect(0, 0, scene.cameras.main.width, scene.cameras.main.height);
    this.dimOverlay.setDepth(119);
    this.dimOverlay.setVisible(false);

    const bg = scene.add.graphics();
    bg.fillStyle(0x0f172a, 0.98);
    bg.fillRoundedRect(-modalWidth / 2, -modalHeight / 2, modalWidth, modalHeight, 16);
    bg.lineStyle(2, 0x10b981, 0.9);
    bg.strokeRoundedRect(-modalWidth / 2, -modalHeight / 2, modalWidth, modalHeight, 16);

    const badgeBg = scene.add.graphics();
    badgeBg.fillStyle(0x065f46, 1);
    badgeBg.fillCircle(0, -modalHeight / 2 + 36, 22);
    badgeBg.lineStyle(2, 0x34d399, 1);
    badgeBg.strokeCircle(0, -modalHeight / 2 + 36, 22);

    this.badgeIcon = scene.add.text(0, -modalHeight / 2 + 36, '🎉', {
      fontSize: '22px'
    }).setOrigin(0.5);

    this.title = scene.add.text(0, -modalHeight / 2 + 72, '¡EVENTO TERMINADO! • EVENT COMPLETED!', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '20px',
      fontWeight: '800',
      color: '#34d399',
      align: 'center'
    }).setOrigin(0.5);

    this.descEs = scene.add.text(0, -modalHeight / 2 + 98, '', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '13.5px',
      fontWeight: '600',
      color: '#f8fafc',
      align: 'center'
    }).setOrigin(0.5);

    this.descEn = scene.add.text(0, -modalHeight / 2 + 118, '', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '11.5px',
      color: '#94a3b8',
      align: 'center'
    }).setOrigin(0.5);

    // Quest Results Checklist Box
    const questBoxBg = scene.add.graphics();
    questBoxBg.fillStyle(0x1e293b, 0.85);
    questBoxBg.fillRoundedRect(-modalWidth / 2 + 25, -modalHeight / 2 + 138, modalWidth - 50, 104, 8);
    questBoxBg.lineStyle(1, 0x334155, 0.8);
    questBoxBg.strokeRoundedRect(-modalWidth / 2 + 25, -modalHeight / 2 + 138, modalWidth - 50, 104, 8);
    // Divider under header
    questBoxBg.lineStyle(1, 0x334155, 0.6);
    questBoxBg.lineBetween(-modalWidth / 2 + 40, -modalHeight / 2 + 164, modalWidth / 2 - 40, -modalHeight / 2 + 164);

    const questHeader = scene.add.text(0, -modalHeight / 2 + 152, 'RESULTADOS DE MISIONES • QUEST RESULTS', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '10.5px',
      fontWeight: '700',
      letterSpacing: 1,
      color: '#38bdf8'
    }).setOrigin(0.5);

    this.questText1 = scene.add.text(-modalWidth / 2 + 45, -modalHeight / 2 + 175, '', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '12.5px',
      fontWeight: '600',
      color: '#e2e8f0'
    });

    this.questText2 = scene.add.text(-modalWidth / 2 + 45, -modalHeight / 2 + 196, '', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '12.5px',
      fontWeight: '600',
      color: '#e2e8f0'
    });

    this.questText3 = scene.add.text(-modalWidth / 2 + 45, -modalHeight / 2 + 217, '', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '12.5px',
      fontWeight: '600',
      color: '#e2e8f0'
    });

    // Vocabulary Recap Card
    const recapBg = scene.add.graphics();
    recapBg.fillStyle(0x1e293b, 0.85);
    recapBg.fillRoundedRect(-modalWidth / 2 + 25, -modalHeight / 2 + 252, modalWidth - 50, 96, 8);
    recapBg.lineStyle(1, 0x475569, 0.8);
    recapBg.strokeRoundedRect(-modalWidth / 2 + 25, -modalHeight / 2 + 252, modalWidth - 50, 96, 8);
    // Divider under header
    recapBg.lineStyle(1, 0x334155, 0.6);
    recapBg.lineBetween(-modalWidth / 2 + 40, -modalHeight / 2 + 278, modalWidth / 2 - 40, -modalHeight / 2 + 278);

    const recapHeader = scene.add.text(0, -modalHeight / 2 + 266, 'VOCABULARIO PRACTICADO • VOCABULARY PRACTICED', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '10.5px',
      fontWeight: '700',
      letterSpacing: 1,
      color: '#fbbf24'
    }).setOrigin(0.5);

    this.vocabCol1 = scene.add.text(-modalWidth / 2 + 45, -modalHeight / 2 + 288, '', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '12px',
      fontWeight: '500',
      color: '#e2e8f0',
      lineSpacing: 5
    });

    this.vocabCol2 = scene.add.text(20, -modalHeight / 2 + 288, '', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '12px',
      fontWeight: '500',
      color: '#e2e8f0',
      lineSpacing: 5
    });

    // Auto-advance bar
    this.autoAdvanceText = scene.add.text(0, modalHeight / 2 - 72, 'Siguiente evento en 3s... • Next event in 3s...', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '12px',
      fontWeight: '700',
      color: '#34d399'
    }).setOrigin(0.5);

    // Action Buttons
    this.btnNext = this.createButton(0, modalHeight / 2 - 36, '⏭️ Siguiente • Next', 0x059669, () => {
      this.cancelAutoAdvance();
      this.close();
      if (this.onAdvanceCallback) {
        this.onAdvanceCallback();
      } else if (this.callbacks.onCycleNext) {
        this.callbacks.onCycleNext();
      }
    });

    this.btnRestartSession = this.createButton(0, modalHeight / 2 - 36, '🔄 Empezar Nueva Sesión • Start New Session', 0x059669, () => {
      this.close();
      if (this.callbacks.onStartNewSession) {
        this.callbacks.onStartNewSession();
      }
    });
    this.btnRestartSession.setVisible(false);

    this.container.add([
      bg,
      badgeBg,
      this.badgeIcon,
      this.title,
      this.descEs,
      this.descEn,
      questBoxBg,
      questHeader,
      this.questText1,
      this.questText2,
      this.questText3,
      recapBg,
      recapHeader,
      this.vocabCol1,
      this.vocabCol2,
      this.autoAdvanceText,
      this.btnNext,
      this.btnRestartSession
    ]);
  }

  createButton(x, y, text, color, onClick) {
    const btn = this.scene.add.container(x, y);
    const w = 320;
    const h = 42;

    const bg = this.scene.add.graphics();
    bg.fillStyle(color, 1);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
    bg.lineStyle(1.5, 0x34d399, 0.7);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);

    const label = this.scene.add.text(0, 0, text, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '13px',
      fontWeight: '700',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    btn.add([bg, label]);
    btn.setSize(w, h);
    btn.setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0x10b981, 1);
      bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
      bg.lineStyle(2, 0xffffff, 0.9);
      bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
      btn.setScale(1.03);
    });

    btn.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(color, 1);
      bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
      bg.lineStyle(1.5, 0x34d399, 0.7);
      bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
      btn.setScale(1);
    });

    btn.on('pointerdown', onClick);

    return btn;
  }

  /**
   * Opens event recap with quest status, vocabulary, and automatic advancement countdown
   * @param {string} weatherType
   * @param {Array<Object>} questResults
   * @param {Function} [onAdvance]
   */
  openRecap(weatherType, questResults = [], onAdvance = null) {
    this.currentWeatherType = weatherType;
    this.onAdvanceCallback = onAdvance;
    this.isOpen = true;

    this.badgeIcon.setText('🎉');
    this.title.setText('¡EVENTO TERMINADO! • EVENT COMPLETED!');
    this.btnRestartSession.setVisible(false);
    this.btnNext.setVisible(true);
    this.autoAdvanceText.setVisible(true);

    // Weather descriptions & vocabulary
    this.populateWeatherRecap(weatherType);

    // Populate quest results checklist
    const q1 = questResults[0] || { titleEs: 'Misión 1', isCompleted: true };
    const q2 = questResults[1] || { titleEs: 'Misión 2 (Bonus)', isCompleted: false };
    const q3 = questResults[2] || { titleEs: 'Misión 3 (Bonus)', isCompleted: false };

    this.formatQuestLine(this.questText1, q1, 'Misión principal');
    this.formatQuestLine(this.questText2, q2, 'Bonus');
    this.formatQuestLine(this.questText3, q3, 'Bonus');

    // Show modal with smooth tween
    this.dimOverlay.setVisible(true);
    this.container.setVisible(true);
    this.container.setAlpha(0);
    this.container.setScale(0.92);

    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 200,
      ease: 'Back.easeOut'
    });

    // Start 3-second auto-advance countdown
    this.startAutoAdvanceCountdown(3);
  }

  formatQuestLine(textObj, quest, label) {
    if (quest.isCompleted) {
      textObj.setColor('#34d399');
      textObj.setText(`✅ ${quest.titleEs} — ¡Completada!`);
    } else {
      textObj.setColor('#94a3b8');
      textObj.setText(`⏭️ ${quest.titleEs} — Omitida (Skipped)`);
    }
  }

  populateWeatherRecap(weatherType) {
    const vocabList = WEATHER_VOCABULARY_INVENTORY[weatherType] || WEATHER_VOCABULARY_INVENTORY.sunny;
    const col1Items = vocabList.slice(0, 4).map((item) => `• ${item.es} = ${item.en}`);
    const col2Items = vocabList.slice(4).map((item) => `• ${item.es} = ${item.en}`);

    this.vocabCol1.setText(col1Items.join('\n'));
    this.vocabCol2.setText(col2Items.join('\n'));

    switch (weatherType) {
      case 'wind':
        this.descEs.setText('¡Has enfrentado el viento en la plaza del mercado!');
        this.descEn.setText('You braved the wind in the market square!');
        break;

      case 'cold':
        this.descEs.setText('¡Has ayudado a los vecinos a protegerse del frío!');
        this.descEn.setText('You helped neighbors stay warm in the cold!');
        break;

      case 'heat':
        this.descEs.setText('¡Has conseguido agua fresca, sombra y helado para todos!');
        this.descEn.setText('You found fresh water, shade, and ice cream for everyone!');
        break;

      case 'sunny':
        this.descEs.setText('¡Has disfrutado del sol, flores, sombra y helado en la plaza!');
        this.descEn.setText('You enjoyed the sun, flowers, shade, and ice cream in the plaza!');
        break;

      case 'rain':
      default:
        this.descEs.setText('¡Has protegido las sillas y paraguas de la lluvia!');
        this.descEn.setText('You protected chairs and umbrellas from the rain!');
        break;
    }
  }

  startAutoAdvanceCountdown(seconds = 3) {
    this.cancelAutoAdvance();
    this.autoAdvanceSeconds = seconds;

    const updateLabel = () => {
      this.autoAdvanceText.setText(`Siguiente evento en ${this.autoAdvanceSeconds}s... • Next event in ${this.autoAdvanceSeconds}s...`);
    };
    updateLabel();

    this.autoAdvanceTimer = this.scene.time.addEvent({
      delay: 1000,
      repeat: seconds - 1,
      callback: () => {
        this.autoAdvanceSeconds--;
        updateLabel();
        if (this.autoAdvanceSeconds <= 0) {
          this.cancelAutoAdvance();
          this.close();
          if (this.onAdvanceCallback) {
            this.onAdvanceCallback();
          } else if (this.callbacks.onCycleNext) {
            this.callbacks.onCycleNext();
          }
        }
      }
    });
  }

  cancelAutoAdvance() {
    if (this.autoAdvanceTimer) {
      this.autoAdvanceTimer.remove();
      this.autoAdvanceTimer = null;
    }
  }

  /**
   * Displays bilingual Session Complete screen with option to start fresh session
   * @param {Object} summary
   */
  openSessionComplete(summary = {}) {
    this.cancelAutoAdvance();
    this.isOpen = true;

    const completed = summary.completed || 0;
    const total = summary.total || 0;

    this.badgeIcon.setText('🏆');
    this.title.setText('¡SESIÓN COMPLETADA! • SESSION COMPLETE!');
    this.descEs.setText(`¡Enhorabuena! Has completado ${completed} de ${total} misiones en total.`);
    this.descEn.setText(`Congratulations! You completed ${completed} of ${total} quests in total.`);

    this.questText1.setColor('#34d399');
    this.questText1.setText('• Has practicado: lluvia, viento, frío, calor y sol.');
    this.questText2.setColor('#38bdf8');
    this.questText2.setText('• Has interactuado con Don Mateo, el camarero, Carmen y los vecinos.');
    this.questText3.setColor('#facc15');
    this.questText3.setText('• ¡Excelente progreso en el vocabulario del clima en español A1!');

    this.vocabCol1.setText(['• ¡Buen trabajo! = Good job!', '• ¡Hasta luego! = See you later!'].join('\n'));
    this.vocabCol2.setText(['• ¿Qué tiempo hace? = How is the weather?', '• ¡Muchas gracias! = Thank you very much!'].join('\n'));

    this.autoAdvanceText.setVisible(false);
    this.btnNext.setVisible(false);
    this.btnRestartSession.setVisible(true);

    this.dimOverlay.setVisible(true);
    this.container.setVisible(true);
    this.container.setAlpha(0);
    this.container.setScale(0.92);

    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 200,
      ease: 'Back.easeOut'
    });
  }

  open(weatherType = 'rain') {
    this.openRecap(weatherType, [
      { titleEs: 'Misión principal', isCompleted: true },
      { titleEs: 'Misión bonus 1', isCompleted: true },
      { titleEs: 'Misión bonus 2', isCompleted: true }
    ]);
  }

  close() {
    if (!this.isOpen) return;
    this.cancelAutoAdvance();

    this.scene.tweens.add({
      targets: this.container,
      alpha: 0,
      scaleX: 0.92,
      scaleY: 0.92,
      duration: 150,
      ease: 'Sine.easeIn',
      onComplete: () => {
        this.container.setVisible(false);
        this.dimOverlay.setVisible(false);
        this.isOpen = false;
        if (this.callbacks.onClose) this.callbacks.onClose();
      }
    });
  }

  destroy() {
    this.cancelAutoAdvance();
    if (this.container) this.container.destroy();
    if (this.dimOverlay) this.dimOverlay.destroy();
  }
}
