import Phaser from 'phaser';

export const QUIZ_QUESTIONS = {
  rain: [
    {
      questionEs: '¿Qué significa «el paraguas» en inglés?',
      questionEn: 'What does "el paraguas" mean in English?',
      options: ['umbrella', 'chair', 'backpack', 'boots'],
      correctIndex: 0,
      explanation: '«El paraguas» significa “umbrella” (para la lluvia).'
    },
    {
      questionEs: '¿Cómo se dice "raincoat" en español?',
      questionEn: 'How do you say "raincoat" in Spanish?',
      options: ['el poncho', 'el impermeable', 'la bolsa', 'la silla'],
      correctIndex: 1,
      explanation: '«El impermeable» significa “raincoat”.'
    },
    {
      questionEs: 'Para proteger las compras de la lluvia usamos:',
      questionEn: 'To protect shopping items from rain we use:',
      options: ['la bolsa', 'el sol', 'el viento', 'la cometa'],
      correctIndex: 0,
      explanation: '«La bolsa» significa “bag” (para proteger las compras).'
    },
    {
      questionEs: '«Las botas» son para...',
      questionEn: '"Las botas" (boots) are for...',
      options: ['los pies y los charcos', 'la cabeza', 'las manos', 'comer en el café'],
      correctIndex: 0,
      explanation: '«Las botas» significa “boots” (para no mojarse los pies).'
    }
  ],
  wind: [
    {
      questionEs: '¿Qué significa «la hoja» en inglés?',
      questionEn: 'What does "la hoja" mean in English?',
      options: ['leaf', 'hat', 'paper', 'flag'],
      correctIndex: 0,
      explanation: '«La hoja» significa “leaf” (que cae del árbol).'
    },
    {
      questionEs: '¿Cómo se dice "newspaper" en español?',
      questionEn: 'How do you say "newspaper" in Spanish?',
      options: ['la servilleta', 'el periódico', 'el sombrero', 'la cometa'],
      correctIndex: 1,
      explanation: '«El periódico» significa “newspaper”.'
    },
    {
      questionEs: 'Don Mateo perdió su prenda favorita por el viento:',
      questionEn: 'Don Mateo lost his favorite item due to the wind:',
      options: ['el sombrero', 'el paraguas', 'el vaso', 'la toalla'],
      correctIndex: 0,
      explanation: '«El sombrero» significa “hat”.'
    },
    {
      questionEs: '¿Qué vuela alto en el cielo cuando hace viento?',
      questionEn: 'What flies high in the sky when it is windy?',
      options: ['la cometa', 'la bandera', 'la chaqueta', 'el helado'],
      correctIndex: 0,
      explanation: '«La cometa» significa “kite” (vuela con el viento).'
    }
  ],
  cold: [
    {
      questionEs: '¿Qué significa «la bufanda» en inglés?',
      questionEn: 'What does "la bufanda" mean in English?',
      options: ['scarf', 'jacket', 'gloves', 'blanket'],
      correctIndex: 0,
      explanation: '«La bufanda» significa “scarf” (de lana caliente).'
    },
    {
      questionEs: '¿Cómo se dice "gloves" en español?',
      questionEn: 'How do you say "gloves" in Spanish?',
      options: ['los guantes', 'el abrigo', 'el gorro', 'el suéter'],
      correctIndex: 0,
      explanation: '«Los guantes» significa “gloves” (para las manos).'
    },
    {
      questionEs: 'Para abrigarse la cabeza del frío usamos:',
      questionEn: 'To keep our head warm from the cold we use:',
      options: ['el gorro', 'la toalla', 'el abanico', 'las gafas'],
      correctIndex: 0,
      explanation: '«El gorro» significa “beanie / warm hat”.'
    },
    {
      questionEs: '¿Qué prenda larga llevamos si hace mucho frío?',
      questionEn: 'What long warm coat do we wear if it is very cold?',
      options: ['el abrigo', 'la servilleta', 'el balón', 'la bicicleta'],
      correctIndex: 0,
      explanation: '«El abrigo» significa “coat / overcoat”.'
    }
  ],
  heat: [
    {
      questionEs: '¿Qué significa «el abanico» en inglés?',
      questionEn: 'What does "el abanico" mean in English?',
      options: ['hand fan', 'bottle', 'sunglasses', 'towel'],
      correctIndex: 0,
      explanation: '«El abanico» significa “hand fan” (para el calor).'
    },
    {
      questionEs: '¿Cómo se dice "sunglasses" en español?',
      questionEn: 'How do you say "sunglasses" in Spanish?',
      options: ['las gafas de sol', 'la gorra', 'el vaso', 'el agua'],
      correctIndex: 0,
      explanation: '«Las gafas de sol» significa “sunglasses”.'
    },
    {
      questionEs: 'Cuando hace calor, bebemos agua fresca de:',
      questionEn: 'When it is hot, we drink fresh water from:',
      options: ['la botella o el vaso', 'la cometa', 'la bufanda', 'el periódico'],
      correctIndex: 0,
      explanation: '«La botella» significa “bottle” • «El vaso» significa “glass”.'
    },
    {
      questionEs: '¿Qué usamos en la cabeza para taparnos del sol?',
      questionEn: 'What do we wear on our head to shield from the sun?',
      options: ['la gorra', 'la manta', 'las botas', 'el abrigo'],
      correctIndex: 0,
      explanation: '«La gorra» significa “sun cap”.'
    }
  ],
  sunny: [
    {
      questionEs: '¿Qué significa «el helado» en inglés?',
      questionEn: 'What does "el helado" mean in English?',
      options: ['ice cream', 'flowers', 'bicycle', 'bench'],
      correctIndex: 0,
      explanation: '«El helado» significa “ice cream”.'
    },
    {
      questionEs: '¿Cómo se dice "bicycle" en español?',
      questionEn: 'How do you say "bicycle" in Spanish?',
      options: ['la bicicleta', 'la cámara', 'la cesta', 'el balón'],
      correctIndex: 0,
      explanation: '«La bicicleta» significa “bicycle”.'
    },
    {
      questionEs: '¿Qué usamos para jugar al fútbol en la plaza?',
      questionEn: 'What do we use to play football in the plaza?',
      options: ['el balón', 'la cámara', 'la cesta', 'el banco'],
      correctIndex: 0,
      explanation: '«El balón» significa “football / ball” (Juego con el balón).'
    },
    {
      questionEs: '¿Qué usamos para hacer fotos bonitas en la plaza?',
      questionEn: 'What do we use to take nice photos in the plaza?',
      options: ['la cámara', 'el banco', 'las flores', 'la toalla'],
      correctIndex: 0,
      explanation: '«La cámara» significa “camera”.'
    },
    {
      questionEs: 'Para descansar sentados al sol encontramos:',
      questionEn: 'To rest seated in the sun we find:',
      options: ['el banco', 'el paraguas', 'el gorro', 'el papel'],
      correctIndex: 0,
      explanation: '«El banco» significa “park bench”.'
    }
  ]
};

export class QuizModal {
  /**
   * @param {Phaser.Scene} scene
   * @param {Object} options
   * @param {Function} options.onComplete
   */
  constructor(scene, options = {}) {
    this.scene = scene;
    this.onCompleteCallback = options.onComplete || null;

    this.isOpen = false;
    this.currentWeather = 'rain';
    this.questions = [];
    this.currentIndex = 0;
    this.score = 0;
    this.isAnswering = false;
    this.hasAdvanced = false;
    this.advanceTimer = null;
    this.selectedOptionIndex = -1;

    const { width, height } = scene.cameras.main;
    this.modalWidth = 720;
    this.modalHeight = 460;

    // Dim overlay
    this.dimOverlay = scene.add.graphics();
    this.dimOverlay.fillStyle(0x000000, 0.75);
    this.dimOverlay.fillRect(0, 0, width, height);
    this.dimOverlay.setDepth(129);
    this.dimOverlay.setVisible(false);

    // Main modal container
    this.container = scene.add.container(width / 2, height / 2);
    this.container.setDepth(130);
    this.container.setVisible(false);

    this.createElements();
  }

  createElements() {
    const { scene, modalWidth, modalHeight } = this;

    // Panel background
    const bg = scene.add.graphics();
    bg.fillStyle(0x0f172a, 0.98);
    bg.fillRoundedRect(-modalWidth / 2, -modalHeight / 2, modalWidth, modalHeight, 16);
    bg.lineStyle(2, 0x38bdf8, 0.9);
    bg.strokeRoundedRect(-modalWidth / 2, -modalHeight / 2, modalWidth, modalHeight, 16);

    // Badge Icon Background
    const badgeBg = scene.add.graphics();
    badgeBg.fillStyle(0x0369a1, 1);
    badgeBg.fillCircle(0, -modalHeight / 2 + 36, 22);
    badgeBg.lineStyle(2, 0x38bdf8, 1);
    badgeBg.strokeCircle(0, -modalHeight / 2 + 36, 22);

    this.badgeIcon = scene.add.text(0, -modalHeight / 2 + 36, '📝', {
      fontSize: '22px'
    }).setOrigin(0.5);

    // Title
    this.title = scene.add.text(0, -modalHeight / 2 + 72, '¡QUIZ DEL CLIMA! • WEATHER VOCABULARY QUIZ', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '18px',
      fontWeight: '800',
      color: '#38bdf8',
      align: 'center'
    }).setOrigin(0.5);

    // Progress text & Score
    this.progressText = scene.add.text(0, -modalHeight / 2 + 96, 'Pregunta 1 de 4', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '12px',
      fontWeight: '700',
      color: '#94a3b8'
    }).setOrigin(0.5);

    // Question Box Background
    const qBox = scene.add.graphics();
    qBox.fillStyle(0x1e293b, 0.9);
    qBox.fillRoundedRect(-modalWidth / 2 + 30, -modalHeight / 2 + 115, modalWidth - 60, 75, 10);
    qBox.lineStyle(1, 0x334155, 0.8);
    qBox.strokeRoundedRect(-modalWidth / 2 + 30, -modalHeight / 2 + 115, modalWidth - 60, 75, 10);

    // Question Text (Spanish)
    this.questionTextEs = scene.add.text(0, -modalHeight / 2 + 140, '', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '17px',
      fontWeight: '700',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: modalWidth - 90 }
    }).setOrigin(0.5);

    // Question Text (English)
    this.questionTextEn = scene.add.text(0, -modalHeight / 2 + 168, '', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '13px',
      fontWeight: '500',
      color: '#cbd5e1',
      align: 'center',
      wordWrap: { width: modalWidth - 90 }
    }).setOrigin(0.5);

    // Answer Option Buttons (4 buttons in 2x2 grid)
    this.optionButtons = [];
    const btnW = 310;
    const btnH = 50;
    const startY = -modalHeight / 2 + 225;
    const gapY = 60;
    const colOffset = 165;

    for (let i = 0; i < 4; i++) {
      const col = i % 2 === 0 ? -colOffset : colOffset;
      const row = Math.floor(i / 2);
      const btnY = startY + row * gapY;

      const btnContainer = scene.add.container(col, btnY);

      const btnBg = scene.add.graphics();
      btnBg.fillStyle(0x1e293b, 0.95);
      btnBg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
      btnBg.lineStyle(1.5, 0x475569, 0.8);
      btnBg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);

      const btnKey = scene.add.text(-btnW / 2 + 20, 0, `[${i + 1}]`, {
        fontFamily: 'Outfit, sans-serif',
        fontSize: '12px',
        fontWeight: '700',
        color: '#f59e0b'
      }).setOrigin(0, 0.5);

      const btnLabel = scene.add.text(-btnW / 2 + 48, 0, '', {
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontSize: '14px',
        fontWeight: '600',
        color: '#f8fafc',
        wordWrap: { width: btnW - 60 }
      }).setOrigin(0, 0.5);

      btnContainer.add([btnBg, btnKey, btnLabel]);
      btnContainer.setSize(btnW, btnH);
      btnContainer.setInteractive({ useHandCursor: true });

      btnContainer.on('pointerover', () => {
        if (!this.isAnswering) {
          btnBg.clear();
          btnBg.fillStyle(0x334155, 1);
          btnBg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
          btnBg.lineStyle(1.5, 0x38bdf8, 1);
          btnBg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
        }
      });

      btnContainer.on('pointerout', () => {
        if (!this.isAnswering) {
          btnBg.clear();
          btnBg.fillStyle(0x1e293b, 0.95);
          btnBg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
          btnBg.lineStyle(1.5, 0x475569, 0.8);
          btnBg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
        }
      });

      btnContainer.on('pointerdown', () => {
        this.selectOption(i);
      });

      this.optionButtons.push({ container: btnContainer, bg: btnBg, key: btnKey, label: btnLabel });
    }

    // Feedback Container (Dedicated bilingual banner)
    this.feedbackContainer = scene.add.container(0, 134);
    this.feedbackContainer.setVisible(false);

    this.feedbackBg = scene.add.graphics();

    this.feedbackTextEs = scene.add.text(0, -11, '', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '13.5px',
      fontWeight: '700',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 520 }
    }).setOrigin(0.5);

    this.feedbackTextEn = scene.add.text(0, 12, '', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '11.5px',
      fontWeight: '500',
      color: '#cbd5e1',
      align: 'center',
      wordWrap: { width: 520 }
    }).setOrigin(0.5);

    this.feedbackContainer.add([this.feedbackBg, this.feedbackTextEs, this.feedbackTextEn]);

    // Next / Continue button (below feedback banner)
    this.feedbackNextBtn = scene.add.container(0, 196);
    this.feedbackNextBtn.setVisible(false);

    const nextBg = scene.add.graphics();
    const nextW = 280;
    const nextH = 34;
    nextBg.fillStyle(0x1e293b, 0.95);
    nextBg.fillRoundedRect(-nextW / 2, -nextH / 2, nextW, nextH, 6);
    nextBg.lineStyle(1.5, 0x38bdf8, 0.8);
    nextBg.strokeRoundedRect(-nextW / 2, -nextH / 2, nextW, nextH, 6);

    this.feedbackNextText = scene.add.text(0, 0, 'Continuar • Next Question [Espacio] →', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '12px',
      fontWeight: '700',
      color: '#38bdf8'
    }).setOrigin(0.5);

    this.feedbackNextBtn.add([nextBg, this.feedbackNextText]);
    this.feedbackNextBtn.setSize(nextW, nextH);
    this.feedbackNextBtn.setInteractive({ useHandCursor: true });

    this.feedbackNextBtn.on('pointerover', () => {
      nextBg.clear();
      nextBg.fillStyle(0x0369a1, 1);
      nextBg.fillRoundedRect(-nextW / 2, -nextH / 2, nextW, nextH, 6);
      nextBg.lineStyle(1.5, 0x7dd3fc, 1);
      nextBg.strokeRoundedRect(-nextW / 2, -nextH / 2, nextW, nextH, 6);
    });

    this.feedbackNextBtn.on('pointerout', () => {
      nextBg.clear();
      nextBg.fillStyle(0x1e293b, 0.95);
      nextBg.fillRoundedRect(-nextW / 2, -nextH / 2, nextW, nextH, 6);
      nextBg.lineStyle(1.5, 0x38bdf8, 0.8);
      nextBg.strokeRoundedRect(-nextW / 2, -nextH / 2, nextW, nextH, 6);
    });

    this.feedbackNextBtn.on('pointerdown', () => {
      this.advanceQuestion();
    });

    // Skip Quiz Button (bottom right)
    const skipBtn = scene.add.container(modalWidth / 2 - 95, modalHeight / 2 - 28);
    const skipBg = scene.add.graphics();
    skipBg.fillStyle(0x334155, 0.8);
    skipBg.fillRoundedRect(-65, -16, 130, 32, 6);
    const skipTxt = scene.add.text(0, 0, 'Saltar Quiz →', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '12px',
      fontWeight: '700',
      color: '#cbd5e1'
    }).setOrigin(0.5);
    skipBtn.add([skipBg, skipTxt]);
    skipBtn.setSize(130, 32);
    skipBtn.setInteractive({ useHandCursor: true });
    skipBtn.on('pointerdown', () => this.finishQuiz(true));

    // Final Screen Elements (hidden during questions)
    this.finalContainer = scene.add.container(0, 0);
    this.finalContainer.setVisible(false);

    const finalBg = scene.add.graphics();
    finalBg.fillStyle(0x0f172a, 0.98);
    finalBg.fillRoundedRect(-modalWidth / 2, -modalHeight / 2, modalWidth, modalHeight, 16);
    finalBg.lineStyle(2, 0x10b981, 0.9);
    finalBg.strokeRoundedRect(-modalWidth / 2, -modalHeight / 2, modalWidth, modalHeight, 16);

    const finalIcon = scene.add.text(0, -80, '🏆', { fontSize: '48px' }).setOrigin(0.5);
    this.finalTitle = scene.add.text(0, -20, '¡QUIZ COMPLETADO!', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '24px',
      fontWeight: '800',
      color: '#34d399'
    }).setOrigin(0.5);

    this.finalScoreText = scene.add.text(0, 20, '', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '18px',
      fontWeight: '700',
      color: '#f8fafc'
    }).setOrigin(0.5);

    this.finalDescText = scene.add.text(0, 50, '¡Excelente progreso con el vocabulario español!', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '14px',
      color: '#94a3b8'
    }).setOrigin(0.5);

    // Continue button
    this.continueBtn = scene.add.container(0, 120);
    const contBg = scene.add.graphics();
    contBg.fillStyle(0x059669, 1);
    contBg.fillRoundedRect(-140, -22, 280, 44, 8);
    contBg.lineStyle(2, 0x34d399, 1);
    contBg.strokeRoundedRect(-140, -22, 280, 44, 8);

    const contTxt = scene.add.text(0, 0, 'Siguiente Clima • Next Weather →', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '14px',
      fontWeight: '700',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.continueBtn.add([contBg, contTxt]);
    this.continueBtn.setSize(280, 44);
    this.continueBtn.setInteractive({ useHandCursor: true });
    this.continueBtn.on('pointerdown', () => this.finishQuiz(false));

    this.finalContainer.add([finalBg, finalIcon, this.finalTitle, this.finalScoreText, this.finalDescText, this.continueBtn]);

    // Add all elements to container
    this.container.add([
      bg, badgeBg, this.badgeIcon, this.title, this.progressText,
      qBox, this.questionTextEs, this.questionTextEn,
      ...this.optionButtons.map(b => b.container),
      this.feedbackContainer, this.feedbackNextBtn, skipBtn,
      this.finalContainer
    ]);
  }

  open(weatherType, onComplete) {
    if (this.advanceTimer) {
      this.advanceTimer.remove();
      this.advanceTimer = null;
    }

    this.isOpen = true;
    this.currentWeather = weatherType || 'rain';
    this.onCompleteCallback = onComplete || null;
    this.questions = QUIZ_QUESTIONS[this.currentWeather] || QUIZ_QUESTIONS.rain;
    this.currentIndex = 0;
    this.score = 0;
    this.isAnswering = false;
    this.hasAdvanced = false;

    // Update weather badge
    const icons = { rain: '🌧️', wind: '🍃', cold: '❄️', heat: '☀️🔥', sunny: '☀️' };
    this.badgeIcon.setText(icons[this.currentWeather] || '📝');

    this.finalContainer.setVisible(false);
    this.feedbackContainer.setVisible(false);
    if (this.feedbackNextBtn) {
      this.feedbackNextBtn.setVisible(false);
    }
    this.dimOverlay.setVisible(true);
    this.container.setVisible(true);

    // Setup keyboard shortcuts
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler);
    }
    this.keyHandler = (event) => {
      if (!this.isOpen) return;

      // On final screen: Space or Enter finishes quiz
      if (this.finalContainer.visible) {
        if (event.code === 'Space' || event.code === 'Enter') {
          this.finishQuiz(false);
        }
        return;
      }

      // During feedback: Space or Enter continues immediately to next question
      if (this.isAnswering) {
        if (event.code === 'Space' || event.code === 'Enter') {
          this.advanceQuestion();
        }
        return;
      }

      // Selecting options: 1, 2, 3, 4
      if (event.key === '1') this.selectOption(0);
      else if (event.key === '2') this.selectOption(1);
      else if (event.key === '3') this.selectOption(2);
      else if (event.key === '4') this.selectOption(3);
      else if (event.code === 'Escape') this.finishQuiz(true);
    };
    window.addEventListener('keydown', this.keyHandler);

    this.renderCurrentQuestion();
  }

  renderCurrentQuestion() {
    this.isAnswering = false;
    this.hasAdvanced = false;
    this.feedbackContainer.setVisible(false);
    if (this.feedbackNextBtn) {
      this.feedbackNextBtn.setVisible(false);
    }

    const q = this.questions[this.currentIndex];
    this.progressText.setText(`Pregunta ${this.currentIndex + 1} de ${this.questions.length} • Aciertos: ${this.score}`);
    this.questionTextEs.setText(q.questionEs);
    this.questionTextEn.setText(q.questionEn);

    const btnW = 310;
    const btnH = 50;

    for (let i = 0; i < 4; i++) {
      const btn = this.optionButtons[i];
      btn.label.setText(q.options[i]);
      btn.label.setColor('#f8fafc');
      if (btn.key) {
        btn.key.setText(`[${i + 1}]`);
        btn.key.setColor('#f59e0b');
      }

      btn.container.setAlpha(1);
      btn.container.setInteractive({ useHandCursor: true });

      btn.bg.clear();
      btn.bg.fillStyle(0x1e293b, 0.95);
      btn.bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
      btn.bg.lineStyle(1.5, 0x475569, 0.8);
      btn.bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
    }
  }

  selectOption(selectedIndex) {
    if (this.isAnswering || this.hasAdvanced || !this.isOpen) return;
    this.isAnswering = true;

    // Immediately disable interactivity on all answer buttons to prevent multiple clicks
    for (let i = 0; i < 4; i++) {
      this.optionButtons[i].container.disableInteractive();
    }

    const q = this.questions[this.currentIndex];
    const isCorrect = selectedIndex === q.correctIndex;
    const btnW = 310;
    const btnH = 50;

    if (isCorrect) {
      this.score++;
      if (this.scene.soundManager?.playProgress) {
        this.scene.soundManager.playProgress();
      }

      // Highlight selected correct option in green
      const btn = this.optionButtons[selectedIndex];
      btn.bg.clear();
      btn.bg.fillStyle(0x065f46, 1);
      btn.bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
      btn.bg.lineStyle(2, 0x34d399, 1);
      btn.bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
      if (btn.key) {
        btn.key.setText('⭐');
        btn.key.setColor('#fbbf24');
      }
      btn.label.setColor('#ffffff');

      // Dim unselected options
      for (let i = 0; i < 4; i++) {
        if (i !== selectedIndex) {
          this.optionButtons[i].container.setAlpha(0.45);
        }
      }

      this.showFeedback(true, q);
    } else {
      if (this.scene.soundManager?.playCancel) {
        this.scene.soundManager.playCancel();
      }

      // Highlight selected wrong option in red
      const selectedBtn = this.optionButtons[selectedIndex];
      selectedBtn.bg.clear();
      selectedBtn.bg.fillStyle(0x7f1d1d, 1);
      selectedBtn.bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
      selectedBtn.bg.lineStyle(2, 0xef4444, 1);
      selectedBtn.bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
      if (selectedBtn.key) {
        selectedBtn.key.setText('❌');
        selectedBtn.key.setColor('#f87171');
      }
      selectedBtn.label.setColor('#fca5a5');

      // Reveal correct option in green
      const correctBtn = this.optionButtons[q.correctIndex];
      correctBtn.bg.clear();
      correctBtn.bg.fillStyle(0x065f46, 1);
      correctBtn.bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
      correctBtn.bg.lineStyle(2, 0x34d399, 1);
      correctBtn.bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
      if (correctBtn.key) {
        correctBtn.key.setText('✅');
        correctBtn.key.setColor('#34d399');
      }
      correctBtn.label.setColor('#ffffff');

      // Dim other unselected wrong options
      for (let i = 0; i < 4; i++) {
        if (i !== selectedIndex && i !== q.correctIndex) {
          this.optionButtons[i].container.setAlpha(0.4);
        }
      }

      this.showFeedback(false, q);
    }

    // Update progress text with latest score
    this.progressText.setText(`Pregunta ${this.currentIndex + 1} de ${this.questions.length} • Aciertos: ${this.score}`);

    // Schedule auto-advance: 1700ms for correct, 2800ms for wrong so player can read explanation comfortably
    const delayMs = isCorrect ? 1700 : 2800;
    if (this.advanceTimer) {
      this.advanceTimer.remove();
    }
    this.advanceTimer = this.scene.time.delayedCall(delayMs, () => {
      this.advanceQuestion();
    });
  }

  showFeedback(isCorrect, q) {
    const isFinal = this.currentIndex === this.questions.length - 1;
    const correctOptionText = q.options[q.correctIndex];
    const boxW = 540;
    const boxH = 58;

    this.feedbackBg.clear();
    const fillColor = isCorrect ? 0x064e3b : 0x450a0a;
    const borderColor = isCorrect ? 0x34d399 : 0xf87171;

    this.feedbackBg.fillStyle(fillColor, 0.96);
    this.feedbackBg.fillRoundedRect(-boxW / 2, -boxH / 2, boxW, boxH, 8);
    this.feedbackBg.lineStyle(1.5, borderColor, 0.95);
    this.feedbackBg.strokeRoundedRect(-boxW / 2, -boxH / 2, boxW, boxH, 8);

    if (isCorrect) {
      this.feedbackTextEs.setText(`¡Correcto! ${q.explanation}`);
      this.feedbackTextEs.setColor('#34d399');
      this.feedbackTextEn.setText('Correct! Great job with this weather vocabulary.');
      this.feedbackTextEn.setColor('#a7f3d0');
    } else {
      this.feedbackTextEs.setText(`Incorrecto. ${q.explanation}`);
      this.feedbackTextEs.setColor('#fca5a5');
      this.feedbackTextEn.setText(`Incorrect. The correct answer is: "${correctOptionText}".`);
      this.feedbackTextEn.setColor('#fecaca');
    }

    const nextBtnLabel = isFinal ? 'Ver Resultados • View Results [Espacio] →' : 'Continuar • Next Question [Espacio] →';
    this.feedbackNextText.setText(nextBtnLabel);

    this.feedbackContainer.setVisible(true);
    this.feedbackContainer.setAlpha(1);
    this.feedbackNextBtn.setVisible(true);
    this.feedbackNextBtn.setAlpha(1);

    // Subtle scale pop animation
    this.feedbackContainer.setScale(0.96);
    this.scene.tweens.add({
      targets: this.feedbackContainer,
      scaleX: 1,
      scaleY: 1,
      duration: 120,
      ease: 'Back.easeOut'
    });
  }

  advanceQuestion() {
    if (this.hasAdvanced) return;
    this.hasAdvanced = true;

    if (this.advanceTimer) {
      this.advanceTimer.remove();
      this.advanceTimer = null;
    }

    this.feedbackContainer.setVisible(false);
    if (this.feedbackNextBtn) {
      this.feedbackNextBtn.setVisible(false);
    }

    this.currentIndex++;
    if (this.currentIndex < this.questions.length) {
      this.renderCurrentQuestion();
    } else {
      this.showFinalScreen();
    }
  }

  showFinalScreen() {
    if (this.advanceTimer) {
      this.advanceTimer.remove();
      this.advanceTimer = null;
    }
    this.feedbackContainer.setVisible(false);
    if (this.feedbackNextBtn) {
      this.feedbackNextBtn.setVisible(false);
    }

    this.finalContainer.setVisible(true);

    if (this.scene.soundManager?.playCompletion) {
      this.scene.soundManager.playCompletion();
    }

    const total = this.questions.length;
    this.finalScoreText.setText(`Has acertado ${this.score} de ${total} preguntas (${Math.round((this.score / total) * 100)}%)`);

    if (this.score === total) {
      this.finalDescText.setText('¡Puntuación perfecta! ¡Dominas el clima en español! ⭐⭐⭐');
    } else if (this.score >= total / 2) {
      this.finalDescText.setText('¡Buen trabajo! Has aprendido mucho vocabulario hoy.');
    } else {
      this.finalDescText.setText('¡Buen intento! Cada clima te enseña nuevas palabras.');
    }
  }

  finishQuiz(wasSkipped = false) {
    if (this.advanceTimer) {
      this.advanceTimer.remove();
      this.advanceTimer = null;
    }
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }

    this.isOpen = false;
    this.isAnswering = false;
    this.hasAdvanced = false;
    this.dimOverlay.setVisible(false);
    this.container.setVisible(false);
    this.feedbackContainer.setVisible(false);
    if (this.feedbackNextBtn) {
      this.feedbackNextBtn.setVisible(false);
    }
    this.finalContainer.setVisible(false);

    if (this.onCompleteCallback) {
      const cb = this.onCompleteCallback;
      this.onCompleteCallback = null;
      cb({ score: this.score, total: this.questions.length, skipped: wasSkipped });
    }
  }

  destroy() {
    if (this.advanceTimer) {
      this.advanceTimer.remove();
      this.advanceTimer = null;
    }
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }
    this.dimOverlay.destroy();
    this.container.destroy();
  }
}
