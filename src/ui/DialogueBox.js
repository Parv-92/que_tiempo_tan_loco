export class DialogueBox {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.isOpen = false;
    this.isClosing = false;
    this.lastClosedTime = 0;
    this.onCloseCallback = null;
    this.keyHandler = null;

    const { width, height } = scene.cameras.main;
    this.boxWidth = Math.min(840, width - 48);
    this.boxHeight = 175;
    this.boxX = width / 2;
    this.boxY = height - 110;

    // Full-screen semi-transparent dim overlay to focus attention on the RPG dialogue window
    this.dimOverlay = scene.add.graphics();
    this.dimOverlay.fillStyle(0x000000, 0.65);
    this.dimOverlay.fillRect(0, 0, width, height);
    this.dimOverlay.setDepth(118);
    this.dimOverlay.setVisible(false);
    this.dimOverlay.setInteractive({ useHandCursor: true });
    this.dimOverlay.on('pointerdown', () => this.close());

    // Main dialogue container with depth 120 (above all standard HUD widgets)
    this.container = scene.add.container(this.boxX, this.boxY);
    this.container.setDepth(120);
    this.container.setVisible(false);

    this.createElements();
  }

  createElements() {
    const { scene } = this;

    // 1. RPG Window Background & Double Border
    this.bg = scene.add.graphics();

    // 2. Speaker Portrait Frame & Sprite
    this.portraitFrame = scene.add.graphics();
    this.portraitSprite = scene.add.sprite(0, 0, 'don_mateo');
    this.portraitSprite.setVisible(false);

    this.portraitFallback = scene.add.text(0, 0, '💬', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '20px',
      color: '#cbd5e1'
    }).setOrigin(0.5);
    this.portraitFallback.setVisible(false);

    // 3. Dedicated Header Area: Speaker Name & Subtitle
    this.speakerTextEs = scene.add.text(0, 0, '', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '16px',
      fontWeight: '700',
      color: '#fbbf24'
    });

    this.speakerTextEn = scene.add.text(0, 0, '', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '11.5px',
      fontWeight: '500',
      color: '#94a3b8'
    });

    // Header divider line separating header from dialogue content
    this.headerDivider = scene.add.graphics();

    // 4. Dedicated Content Area: Prominent Spanish text & Muted English translation
    this.dialogueTextEs = scene.add.text(0, 0, '', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '15px',
      fontWeight: '600',
      color: '#f8fafc',
      lineSpacing: 5
    });

    this.dialogueTextEn = scene.add.text(0, 0, '', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '12.5px',
      fontWeight: '400',
      color: '#94a3b8',
      lineSpacing: 4
    });

    // 5. Dedicated Footer Area: Interaction Hint Pill
    this.footerContainer = scene.add.container(0, 0);
    this.footerBg = scene.add.graphics();
    this.closePrompt = scene.add.text(0, 0, '[E] o [Espacio] Continuar • [E] or [Space] Continue', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '11px',
      fontWeight: '600',
      color: '#cbd5e1'
    }).setOrigin(0.5);
    this.footerContainer.add([this.footerBg, this.closePrompt]);

    this.container.add([
      this.bg,
      this.portraitFrame,
      this.portraitSprite,
      this.portraitFallback,
      this.speakerTextEs,
      this.speakerTextEn,
      this.headerDivider,
      this.dialogueTextEs,
      this.dialogueTextEn,
      this.footerContainer
    ]);

    // Container click-to-close
    this.container.setInteractive({ useHandCursor: true });
    this.container.on('pointerdown', () => this.close());
  }

  /**
   * Resolves appropriate character portrait texture key based on speaker name or explicit key
   * @param {string} speakerEs
   * @param {Object} data
   * @returns {string|null}
   */
  resolvePortraitTexture(speakerEs, data) {
    if (data.portraitKey && this.scene.textures.exists(data.portraitKey)) {
      return data.portraitKey;
    }

    const s = (speakerEs || '').toLowerCase();
    if (s.includes('mateo')) return 'don_mateo';
    if (s.includes('camarero') || s.includes('marcos')) return 'camarero';
    if (s.includes('carmen') || s.includes('mercado')) return 'carmen';
    if (s.includes('heladero') || s.includes('paco')) return 'heladero';
    if (s.includes('sofia')) return 'sofia';
    if (s.includes('elena') || s.includes('vecina')) return 'citizen';
    if (s.includes('player') || s.includes('jugador')) return 'player';

    // Item/Object textures
    const objectMap = {
      paraguas: 'umbrella',
      umbrella: 'umbrella',
      silla: 'chair',
      chair: 'chair',
      papel: 'paper',
      paper: 'paper',
      sombrero: 'sombrero',
      hat: 'sombrero',
      chaqueta: 'chaqueta',
      jacket: 'chaqueta',
      bufanda: 'bufanda',
      scarf: 'bufanda',
      agua: 'glass_water',
      water: 'glass_water',
      flores: 'flowers',
      flowers: 'flowers',
      helado: 'helado',
      icecream: 'helado'
    };

    for (const [key, tex] of Object.entries(objectMap)) {
      if (s.includes(key) && this.scene.textures.exists(tex)) {
        return tex;
      }
    }

    return null;
  }

  /**
   * Opens RPG dialogue window with dedicated header, clear Spanish/English separation,
   * portrait frame, and dynamic height calculation.
   *
   * @param {{ speakerEs: string, speakerEn?: string, spanish: string, english: string, portraitKey?: string }} data
   * @param {Function} [onClose]
   */
  open(data, onClose) {
    if (this.isOpen) {
      if (this.onCloseCallback) this.onCloseCallback();
    }

    this.scene.tweens.killTweensOf(this.container);
    this.isOpen = true;
    this.isClosing = false;
    this.lastClosedTime = 0;
    this.onCloseCallback = onClose || null;

    // Lock player movement immediately
    if (this.scene.player?.setMovementLock) {
      this.scene.player.setMovementLock(true);
    }

    // Notify HUD to hide vocabulary/toasts to prevent overlap
    if (this.scene.hud?.setDialogueActive) {
      this.scene.hud.setDialogueActive(true);
    }

    const { width, height } = this.scene.cameras.main;
    this.boxWidth = Math.min(840, width - 48);

    const padX = 24;
    const padTop = 18;
    const padBottom = 14;

    const portraitSize = 54;
    const gapPortraitToContent = 18;

    // Dedicated content area to the right of the portrait
    const contentLeft = -this.boxWidth / 2 + padX + portraitSize + gapPortraitToContent;
    const contentWidth = this.boxWidth - padX * 2 - portraitSize - gapPortraitToContent;

    // Format Speaker Header (clean Spanish-first with English role underneath or subtitle)
    let speaker = data.speakerEs || 'Don Mateo';
    // Clean any legacy emoji from speaker string
    speaker = speaker.replace(/^[🔍💬👴🍦☕👩🧣☀️\s]+/, '').trim();
    this.speakerTextEs.setText(speaker);

    let speakerSub = data.speakerEn || '';
    speakerSub = speakerSub.replace(/^[🔍💬👴🍦☕👩🧣☀️\s]+/, '').trim();
    this.speakerTextEn.setText(speakerSub ? `(${speakerSub})` : '');

    // Setup Speaker Portrait Frame
    const portraitTexture = this.resolvePortraitTexture(speaker, data);
    if (portraitTexture && this.scene.textures.exists(portraitTexture)) {
      this.portraitSprite.setTexture(portraitTexture);
      this.portraitSprite.setVisible(true);
      // Neatly scale sprite inside 54x54 frame
      const frameDim = Math.max(this.portraitSprite.width, this.portraitSprite.height);
      const targetScale = frameDim > 0 ? (42 / frameDim) : 1;
      this.portraitSprite.setScale(targetScale);
      this.portraitFallback.setVisible(false);
    } else {
      this.portraitSprite.setVisible(false);
      this.portraitFallback.setText('💬');
      this.portraitFallback.setVisible(true);
    }

    // Set Spanish Dialogue (Prominent)
    this.dialogueTextEs.setWordWrapWidth(contentWidth);
    this.dialogueTextEs.setText(data.spanish || '');
    const esHeight = Math.max(20, Math.ceil(this.dialogueTextEs.height));

    // Set English Translation (Smaller, Muted)
    this.dialogueTextEn.setWordWrapWidth(contentWidth);
    this.dialogueTextEn.setText(data.english || '');
    const enHeight = Math.max(18, Math.ceil(this.dialogueTextEn.height));

    // Vertical spacing layout
    const headerHeight = 28;
    const gapHeaderToContent = 8;
    const gapEsToEn = 8;
    const gapContentToFooter = 12;
    const footerHeight = 26;

    const totalHeight =
      padTop +
      headerHeight +
      gapHeaderToContent +
      esHeight +
      gapEsToEn +
      enHeight +
      gapContentToFooter +
      footerHeight +
      padBottom;

    // Dynamic height safely bounded
    this.boxHeight = Math.max(165, Math.min(380, Math.ceil(totalHeight)));

    // Reposition container above screen bottom with safe clearance
    this.boxY = height - (this.boxHeight / 2) - 20;
    this.container.setPosition(width / 2, this.boxY);
    this.container.setSize(this.boxWidth, this.boxHeight);

    // 1. Draw RPG Dialogue Window: Dark mostly opaque slate background with amber subtle border
    this.bg.clear();
    // Outer shadow / dark backdrop
    this.bg.fillStyle(0x0c121e, 0.98);
    this.bg.fillRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 10);
    // Outer subtle amber/gold border
    this.bg.lineStyle(1.5, 0xd97706, 0.85);
    this.bg.strokeRoundedRect(-this.boxWidth / 2, -this.boxHeight / 2, this.boxWidth, this.boxHeight, 10);
    // Inner fine inset border for polished RPG frame aesthetic
    this.bg.lineStyle(1, 0x334155, 0.45);
    this.bg.strokeRoundedRect(-this.boxWidth / 2 + 3, -this.boxHeight / 2 + 3, this.boxWidth - 6, this.boxHeight - 6, 8);

    // 2. Position Portrait Frame
    const portraitX = -this.boxWidth / 2 + padX + portraitSize / 2;
    const portraitY = -this.boxHeight / 2 + padTop + portraitSize / 2;

    this.portraitFrame.clear();
    this.portraitFrame.fillStyle(0x1e293b, 1);
    this.portraitFrame.fillRoundedRect(-portraitSize / 2 + portraitX, -portraitSize / 2 + portraitY, portraitSize, portraitSize, 8);
    this.portraitFrame.lineStyle(1.5, 0x475569, 0.9);
    this.portraitFrame.strokeRoundedRect(-portraitSize / 2 + portraitX, -portraitSize / 2 + portraitY, portraitSize, portraitSize, 8);

    this.portraitSprite.setPosition(portraitX, portraitY);
    this.portraitFallback.setPosition(portraitX, portraitY);

    // 3. Position Header Area
    const headerY = -this.boxHeight / 2 + padTop;
    this.speakerTextEs.setPosition(contentLeft, headerY);
    this.speakerTextEn.setPosition(contentLeft + this.speakerTextEs.width + 10, headerY + 3);

    // Header divider line
    const dividerY = headerY + headerHeight;
    this.headerDivider.clear();
    this.headerDivider.lineStyle(1, 0x334155, 0.65);
    this.headerDivider.lineBetween(contentLeft, dividerY, contentLeft + contentWidth, dividerY);

    // 4. Position Dialogue Text Area
    const spanishY = dividerY + gapHeaderToContent;
    this.dialogueTextEs.setPosition(contentLeft, spanishY);

    const englishY = spanishY + esHeight + gapEsToEn;
    this.dialogueTextEn.setPosition(contentLeft, englishY);

    // 5. Position Footer Area
    const footerY = this.boxHeight / 2 - padBottom - footerHeight / 2;
    this.footerContainer.setPosition(0, footerY);

    const pillW = Math.min(360, this.boxWidth - 80);
    this.footerBg.clear();
    this.footerBg.fillStyle(0x1e293b, 0.92);
    this.footerBg.fillRoundedRect(-pillW / 2, -footerHeight / 2, pillW, footerHeight, 13);
    this.footerBg.lineStyle(1, 0x475569, 0.7);
    this.footerBg.strokeRoundedRect(-pillW / 2, -footerHeight / 2, pillW, footerHeight, 13);

    this.closePrompt.setPosition(0, 0);

    // Keyboard handlers
    this.setupKeyboardHandler();

    // Show elements with crisp RPG fade-in
    this.dimOverlay.setVisible(true);
    this.container.setVisible(true);
    this.container.setAlpha(0);
    this.container.setScale(0.98);

    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 140,
      ease: 'Sine.easeOut'
    });
  }

  setupKeyboardHandler() {
    this.removeKeyboardHandler();
    this.keyHandler = (e) => {
      if (!this.isOpen || this.isClosing) return;
      if (
        e.code === 'KeyE' ||
        e.code === 'Space' ||
        e.code === 'Enter' ||
        e.code === 'Escape' ||
        e.key === ' ' ||
        e.key === 'Spacebar'
      ) {
        e.preventDefault();
        this.close();
      }
    };
    window.addEventListener('keydown', this.keyHandler);
  }

  removeKeyboardHandler() {
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }
  }

  /**
   * Closes dialogue box, restoring player movement and invoking completion callback.
   * @param {boolean} [immediate=false]
   */
  close(immediate = false) {
    if (!this.isOpen && !this.isClosing) return;
    this.isOpen = false;
    this.isClosing = true;
    this.lastClosedTime = Date.now();
    this.removeKeyboardHandler();

    // Immediately restore player movement
    if (this.scene.player?.setMovementLock) {
      this.scene.player.setMovementLock(false);
    }

    const finishClose = () => {
      this.isOpen = false;
      this.isClosing = false;
      this.dimOverlay.setVisible(false);
      this.container.setVisible(false);

      if (this.scene.player?.setMovementLock) {
        this.scene.player.setMovementLock(false);
      }

      // Restore HUD elements
      if (this.scene.hud?.setDialogueActive) {
        this.scene.hud.setDialogueActive(false);
      }

      if (this.onCloseCallback) {
        const cb = this.onCloseCallback;
        this.onCloseCallback = null;
        cb();
      }
    };

    if (immediate) {
      finishClose();
      return;
    }

    this.scene.tweens.killTweensOf(this.container);
    this.scene.tweens.add({
      targets: this.container,
      alpha: 0,
      scaleX: 0.98,
      scaleY: 0.98,
      duration: 110,
      ease: 'Sine.easeIn',
      onComplete: finishClose
    });
  }

  destroy() {
    this.removeKeyboardHandler();
    if (this.dimOverlay) {
      this.dimOverlay.destroy();
    }
    if (this.container) {
      this.container.destroy();
    }
  }
}
