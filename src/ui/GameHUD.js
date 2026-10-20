import { TEXTS, SCENE_KEYS, WEATHER_VOCABULARY_INVENTORY } from '../config/constants.js';

export class GameHUD {
  /**
   * @param {Phaser.Scene} scene
   * @param {Object} [options]
   * @param {Function} [options.onWeatherToggle]
   */
  constructor(scene, options = {}) {
    this.scene = scene;
    this.options = options;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(100); // Keep HUD above environment

    this.createWeatherWidget();
    this.createTaskWidget();
    this.createTimerWidget();
    this.createVocabularyWidget();
    this.createSoundToggleButton();
    this.createNavigationButton();
    this.createToastWidget();
  }

  createWeatherWidget() {
    const { scene } = this;
    const x = 24;
    const y = 20;
    const width = 310;
    const height = 90;

    const bg = scene.add.graphics();
    bg.fillStyle(0x0f172a, 0.95);
    bg.fillRoundedRect(x, y, width, height, 12);
    bg.lineStyle(1.5, 0xf59e0b, 0.7);
    bg.strokeRoundedRect(x, y, width, height, 12);

    const header = scene.add.text(x + 16, y + 10, `${TEXTS.HUD.WEATHER_LABEL_ES.toUpperCase()} • ${TEXTS.HUD.WEATHER_LABEL_EN.toUpperCase()}`, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: 1,
      color: '#fbbf24'
    });

    this.weatherTextEs = scene.add.text(x + 16, y + 28, TEXTS.HUD.CURRENT_WEATHER_ES, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '17px',
      fontWeight: '700',
      color: '#ffffff'
    });

    this.weatherTextEn = scene.add.text(x + 16, y + 50, TEXTS.HUD.CURRENT_WEATHER_EN, {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '11px',
      color: '#94a3b8'
    });

    // Weather toggle button (allows user to trigger/reverse rain)
    const toggleBtn = scene.add.container(x + width - 58, y + 24);
    const toggleBg = scene.add.graphics();
    toggleBg.fillStyle(0x1e293b, 1);
    toggleBg.fillRoundedRect(-46, -12, 92, 24, 6);
    toggleBg.lineStyle(1, 0x64748b, 0.8);
    toggleBg.strokeRoundedRect(-46, -12, 92, 24, 6);

    this.toggleLabel = scene.add.text(0, 0, '🌧️ Lluvia', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '11px',
      fontWeight: '700',
      color: '#38bdf8'
    }).setOrigin(0.5);

    toggleBtn.add([toggleBg, this.toggleLabel]);
    toggleBtn.setSize(92, 24);
    toggleBtn.setInteractive({ useHandCursor: true });

    toggleBtn.on('pointerdown', () => {
      if (this.options.onWeatherToggle) {
        this.options.onWeatherToggle();
      }
    });

    this.container.add([bg, header, this.weatherTextEs, this.weatherTextEn, toggleBtn]);
  }

  createTimerWidget() {
    const { scene } = this;
    const sceneWidth = scene.cameras.main.width;
    const w = 120;
    const h = 36;
    const x = sceneWidth / 2;
    const y = 38;

    this.timerContainer = scene.add.container(x, y);
    this.timerContainer.setDepth(102);
    this.timerContainer.setVisible(false);

    this.timerBg = scene.add.graphics();
    this.timerBg.fillStyle(0x0f172a, 0.95);
    this.timerBg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
    this.timerBg.lineStyle(1.5, 0xf59e0b, 0.9);
    this.timerBg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);

    this.timerText = scene.add.text(0, 0, '⏱️ 60s', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '15px',
      fontWeight: '800',
      color: '#fbbf24'
    }).setOrigin(0.5);

    this.timerContainer.add([this.timerBg, this.timerText]);
  }

  showTimer(seconds = 60) {
    this.timerContainer.setVisible(true);
    this.updateTimer(seconds);
  }

  updateTimer(seconds) {
    this.timerText.setText(`⏱️ ${seconds}s`);
    this.timerBg.clear();
    if (seconds <= 10) {
      this.timerText.setColor('#ef4444');
      this.timerBg.fillStyle(0x450a0a, 0.95);
      this.timerBg.fillRoundedRect(-60, -18, 120, 36, 10);
      this.timerBg.lineStyle(1.5, 0xf87171, 1);
      this.timerBg.strokeRoundedRect(-60, -18, 120, 36, 10);
    } else {
      this.timerText.setColor('#fbbf24');
      this.timerBg.fillStyle(0x0f172a, 0.95);
      this.timerBg.fillRoundedRect(-60, -18, 120, 36, 10);
      this.timerBg.lineStyle(1.5, 0xf59e0b, 0.9);
      this.timerBg.strokeRoundedRect(-60, -18, 120, 36, 10);
    }
  }

  hideTimer() {
    this.timerContainer.setVisible(false);
  }

  createTaskWidget() {
    const { scene } = this;
    const sceneWidth = scene.cameras.main.width;
    const width = 460;
    const baseHeight = 100;
    const x = sceneWidth - width - 24;
    const y = 20;

    this.taskWidgetX = x;
    this.taskWidgetY = y;
    this.taskWidgetWidth = width;
    this.taskWidgetHeight = baseHeight;

    this.taskBg = scene.add.graphics();
    this.drawTaskBg(baseHeight);

    const header = scene.add.text(x + 16, y + 10, `${TEXTS.HUD.TASK_LABEL_ES.toUpperCase()} • ${TEXTS.HUD.TASK_LABEL_EN.toUpperCase()}`, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: 1,
      color: '#38bdf8'
    });

    // Single-quest container (for Phase A / free exploration)
    this.singleTaskContainer = scene.add.container(0, 0);

    this.taskTextEs = scene.add.text(x + 16, y + 30, TEXTS.HUD.CURRENT_TASK_ES, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '13.5px',
      fontWeight: '700',
      color: '#ffffff',
      wordWrap: { width: width - 32 }
    });

    this.taskTextEn = scene.add.text(x + 16, y + 58, TEXTS.HUD.CURRENT_TASK_EN, {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '11.5px',
      color: '#94a3b8',
      wordWrap: { width: width - 32 }
    });

    this.singleTaskContainer.add([this.taskTextEs, this.taskTextEn]);

    // Multi-quest container (for Phase B: 3 clearly separated quest rows)
    this.multiTaskContainer = scene.add.container(0, 0);
    this.multiTaskContainer.setVisible(false);

    this.questRows = [];
    for (let i = 0; i < 3; i++) {
      const rowY = y + 30 + i * 42;
      const icon = scene.add.text(x + 16, rowY + 1, '⬜', {
        fontSize: '13px'
      });
      const titleEs = scene.add.text(x + 40, rowY, '', {
        fontFamily: 'Outfit, sans-serif',
        fontSize: '12px',
        fontWeight: '700',
        color: '#f8fafc',
        wordWrap: { width: width - 56 }
      });
      const titleEn = scene.add.text(x + 40, rowY + 17, '', {
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontSize: '10.5px',
        color: '#94a3b8',
        wordWrap: { width: width - 56 }
      });
      this.questRows.push({ icon, titleEs, titleEn });
      this.multiTaskContainer.add([icon, titleEs, titleEn]);
    }

    this.container.add([this.taskBg, header, this.singleTaskContainer, this.multiTaskContainer]);
  }

  drawTaskBg(height) {
    this.taskWidgetHeight = height;
    this.taskBg.clear();
    this.taskBg.fillStyle(0x0f172a, 0.95);
    this.taskBg.fillRoundedRect(this.taskWidgetX, this.taskWidgetY, this.taskWidgetWidth, height, 12);
    this.taskBg.lineStyle(1.5, 0x38bdf8, 0.7);
    this.taskBg.strokeRoundedRect(this.taskWidgetX, this.taskWidgetY, this.taskWidgetWidth, height, 12);
  }

  createVocabularyWidget() {
    const { scene } = this;
    this.vocabWidgetWidth = 630;
    this.vocabWidgetX = 24;
    this.vocabWidgetBaseHeight = 100;
    const y = scene.cameras.main.height - this.vocabWidgetBaseHeight - 20;
    this.vocabWidgetY = y;

    this.vocabWidget = scene.add.container(0, 0);

    this.vocabBg = scene.add.graphics();
    this.vocabDivider = scene.add.graphics();

    this.vocabHeader = scene.add.text(this.vocabWidgetX + 16, y + 10, '💡 VOCABULARIO CLAVE • KEY VOCABULARY', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: 1,
      color: '#fbbf24'
    });

    // Container for individual vocabulary cards
    this.vocabEntriesContainer = scene.add.container(0, 0);

    // Maintained for script assertion and backwards-compatibility
    this.vocabPhrase = scene.add.text(this.vocabWidgetX + 16, y + 36, TEXTS.HUD.CURRENT_HINT_ES, {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '13px',
      fontWeight: '600',
      color: '#f8fafc',
      wordWrap: { width: this.vocabWidgetWidth - 32 }
    });
    this.vocabPhrase.setVisible(false);

    this.vocabWidget.add([this.vocabBg, this.vocabDivider, this.vocabHeader, this.vocabEntriesContainer, this.vocabPhrase]);
    this.container.add(this.vocabWidget);

    // Initial render with default hint
    this.updateVocabularyContent(TEXTS.HUD.CURRENT_HINT_ES);
  }

  /**
   * Parses various vocabulary inputs (bullet-separated strings, phrases with '=', single words, or arrays)
   * @param {string|Array} input
   * @returns {Array<{es: string, en: string, isGeneralHint?: boolean, text?: string}>}
   */
  parseVocabInput(input) {
    if (!input) return [];

    if (Array.isArray(input)) {
      return input.map(item => ({
        es: item.es || item.spanish || '',
        en: item.en ? (item.en.charAt(0).toUpperCase() + item.en.slice(1)) : ''
      }));
    }

    if (typeof input !== 'string') return [];

    const str = input.trim();

    // Check if it's a bullet-separated list of items
    if (str.includes('•')) {
      const parts = str.split('•').map(p => p.trim()).filter(Boolean);
      const entries = [];

      for (const part of parts) {
        // Match «spanish» (english) or spanish (english)
        const match = part.match(/(?:«([^»]+)»|([^(]+))\s*(?:\(([^)]+)\))?/);
        if (match) {
          const es = (match[1] || match[2] || '').replace(/[«»"]/g, '').trim();
          let en = (match[3] || '').trim();
          if (en) {
            en = en.charAt(0).toUpperCase() + en.slice(1);
          }
          if (es) {
            entries.push({ es, en });
          }
        } else {
          const clean = part.replace(/[«»"]/g, '').trim();
          if (clean) entries.push({ es: clean, en: '' });
        }
      }
      return entries;
    }

    // Check if it's an expression with '=' (e.g. «¿Qué tiempo hace hoy?» = What is the weather like today?)
    if (str.includes('=')) {
      const [left, right] = str.split('=').map(s => s.trim());
      const cleanEs = left.replace(/[«»"]/g, '').trim();
      let cleanEn = right.replace(/[«»"]/g, '').trim();
      if (cleanEn) {
        cleanEn = cleanEn.charAt(0).toUpperCase() + cleanEn.slice(1);
      }
      return [{ es: cleanEs, en: cleanEn }];
    }

    // Check if it's a single item with parentheses: e.g. «el paraguas» (umbrella)
    const singleMatch = str.match(/(?:«([^»]+)»|([^(]+))\s*\(([^)]+)\)/);
    if (singleMatch && !str.toLowerCase().startsWith('pista')) {
      const cleanEs = (singleMatch[1] || singleMatch[2] || '').replace(/[«»"]/g, '').trim();
      let cleanEn = (singleMatch[3] || '').trim();
      if (cleanEn) {
        cleanEn = cleanEn.charAt(0).toUpperCase() + cleanEn.slice(1);
      }
      return [{ es: cleanEs, en: cleanEn }];
    }

    // General instruction or hint sentence
    return [{ isGeneralHint: true, text: str }];
  }

  /**
   * Redraws the Key Vocabulary panel with clean individual cards arranged in a row or grid.
   * @param {string|Array} input
   */
  updateVocabularyContent(input) {
    if (!this.vocabWidget || !this.scene) return;

    // Update fallback text object for script compatibility
    const rawString = typeof input === 'string' ? input : JSON.stringify(input);
    if (this.vocabPhrase) {
      this.vocabPhrase.setText(rawString);
    }

    // Parse input into structured entries
    const entries = this.parseVocabInput(input);
    if (entries.length === 0) return;

    // Clear previous entries
    this.vocabEntriesContainer.removeAll(true);

    const { scene } = this;
    const panelWidth = this.vocabWidgetWidth || 630;
    const panelX = this.vocabWidgetX || 24;
    const paddingX = 14;
    const contentWidth = panelWidth - paddingX * 2; // ~602px

    const isSingleHint = entries.length === 1 && entries[0].isGeneralHint;

    // Determine layout and dimensions
    let panelHeight = 100;
    let cardHeight = 52;
    let numRows = 1;

    if (isSingleHint) {
      panelHeight = 94;
    } else if (entries.length <= 4) {
      panelHeight = 100;
      cardHeight = 50;
      numRows = 1;
    } else {
      // 5 or more entries: wrap into 2 rows
      numRows = 2;
      cardHeight = 46;
      panelHeight = 152;
    }

    // Recalculate panel Y anchored to bottom (20px margin from screen bottom)
    const panelY = scene.cameras.main.height - panelHeight - 20;
    this.vocabWidgetY = panelY;

    // Redraw Panel Background with gold border and dark translucent slate
    this.vocabBg.clear();
    this.vocabBg.fillStyle(0x0f172a, 0.95);
    this.vocabBg.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 12);
    this.vocabBg.lineStyle(1.5, 0xf59e0b, 0.75);
    this.vocabBg.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 12);

    // Reposition Header & Divider
    this.vocabHeader.setPosition(panelX + 16, panelY + 10);
    this.vocabDivider.clear();
    this.vocabDivider.lineStyle(1, 0x334155, 0.55);
    this.vocabDivider.lineBetween(panelX + 16, panelY + 27, panelX + panelWidth - 16, panelY + 27);

    // Render entries
    if (isSingleHint) {
      // Render single general hint text
      const hintBg = scene.add.graphics();
      const hX = panelX + paddingX;
      const hY = panelY + 34;
      const hW = contentWidth;
      const hH = 48;

      hintBg.fillStyle(0x1e293b, 0.75);
      hintBg.fillRoundedRect(hX, hY, hW, hH, 8);
      hintBg.lineStyle(1, 0x475569, 0.5);
      hintBg.strokeRoundedRect(hX, hY, hW, hH, 8);

      const hintText = scene.add.text(hX + 16, hY + 14, entries[0].text, {
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontSize: '12.5px',
        fontWeight: '600',
        color: '#f8fafc',
        wordWrap: { width: hW - 32 }
      });

      this.vocabEntriesContainer.add([hintBg, hintText]);
      return;
    }

    // Multi-entry Grid or Row
    const count = entries.length;
    const itemsPerRow = numRows === 1 ? count : Math.ceil(count / numRows);
    const gapX = count === 2 ? 18 : (count === 3 ? 14 : 10);
    const gapY = 8;
    const cardWidth = Math.floor((contentWidth - (itemsPerRow - 1) * gapX) / itemsPerRow);

    entries.forEach((item, idx) => {
      const row = Math.floor(idx / itemsPerRow);
      const col = idx % itemsPerRow;

      // Center remaining items on the last row if fewer than itemsPerRow
      const itemsInThisRow = (row === numRows - 1 && count % itemsPerRow !== 0)
        ? (count % itemsPerRow)
        : itemsPerRow;
      const rowOffset = (contentWidth - (itemsInThisRow * cardWidth + (itemsInThisRow - 1) * gapX)) / 2;

      const cardX = panelX + paddingX + rowOffset + col * (cardWidth + gapX);
      const cardY = panelY + 34 + row * (cardHeight + gapY);

      // Card graphic
      const cardGraphics = scene.add.graphics();
      cardGraphics.fillStyle(0x1e293b, 0.75);
      cardGraphics.fillRoundedRect(cardX, cardY, cardWidth, cardHeight, 8);
      cardGraphics.lineStyle(1, 0xd97706, 0.4);
      cardGraphics.strokeRoundedRect(cardX, cardY, cardWidth, cardHeight, 8);

      // Top subtle gold accent line inside card
      cardGraphics.fillStyle(0xf59e0b, 0.65);
      cardGraphics.fillRoundedRect(cardX + 10, cardY + 2, cardWidth - 20, 2, 1);

      // Spanish Text (Prominent)
      const fontSizeEs = count >= 4 ? '13px' : '14px';
      const textEs = scene.add.text(cardX + cardWidth / 2, cardY + 8, item.es, {
        fontFamily: 'Outfit, sans-serif',
        fontSize: fontSizeEs,
        fontWeight: '700',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: cardWidth - 10 }
      }).setOrigin(0.5, 0);

      const cardChildren = [cardGraphics, textEs];

      // English Meaning (Directly underneath in smaller, muted font)
      if (item.en) {
        const fontSizeEn = count >= 4 ? '11px' : '11.5px';
        const textEn = scene.add.text(cardX + cardWidth / 2, cardY + 27, item.en, {
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: fontSizeEn,
          fontWeight: '500',
          color: '#cbd5e1',
          align: 'center',
          wordWrap: { width: cardWidth - 10 }
        }).setOrigin(0.5, 0);
        cardChildren.push(textEn);
      } else {
        textEs.setOrigin(0.5, 0.5);
        textEs.setPosition(cardX + cardWidth / 2, cardY + cardHeight / 2);
      }

      this.vocabEntriesContainer.add(cardChildren);
    });
  }

  /**
   * Toggles visibility of lower HUD elements when a dialogue window is active
   * to guarantee zero overlapping.
   * @param {boolean} active
   */
  setDialogueActive(active) {
    if (this.vocabWidget) {
      this.vocabWidget.setVisible(!active);
    }
  }

  createToastWidget() {
    const { scene } = this;

    // Reposition to top-center of playable area between weather widget (right: 334) and mission sidebar (left: 796)
    // Visual corridor center: (334 + 796) / 2 = 565.
    this.toastContainer = scene.add.container(565, 46);
    this.toastContainer.setDepth(110);
    this.toastContainer.setVisible(false);

    this.toastBg = scene.add.graphics();

    // Spanish text (prominent, readable, word-wrapped)
    this.toastTextEs = scene.add.text(0, 0, '', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '12px',
      fontWeight: '700',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 340, useAdvancedWrap: true }
    }).setOrigin(0.5, 0.5);

    // English text (clear translation below Spanish, word-wrapped)
    this.toastTextEn = scene.add.text(0, 0, '', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '10.5px',
      fontWeight: '500',
      color: '#a7f3d0',
      align: 'center',
      wordWrap: { width: 340, useAdvancedWrap: true }
    }).setOrigin(0.5, 0.5);

    this.toastContainer.add([this.toastBg, this.toastTextEs, this.toastTextEn]);

    this.toastQueue = [];
    this.isToastActive = false;
    this.toastShownAt = 0;
    this.currentToastItem = null;

    // Handle responsive window resize repositioning
    this.onWindowResize = () => {
      if (this.toastContainer && this.toastContainer.visible && this.currentToastItem) {
        this.updateToastLayout(this.currentToastItem);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.onWindowResize);
    }
  }

  /**
   * Calculates the optimal toast position to guarantee zero overlap with HUD elements.
   * On normal resolutions: top-center between weather widget and mission sidebar.
   * If browser window is narrow or content is wide: drops cleanly below top HUD elements in free playable area.
   * @param {number} boxWidth
   * @param {number} boxHeight
   * @returns {{x: number, y: number}}
   */
  getOptimalToastPosition(boxWidth, boxHeight) {
    const sceneWidth = this.scene.cameras.main.width;
    const isNarrowWindow = (typeof window !== 'undefined' && window.innerWidth < 1150);
    const timerActive = Boolean(this.timerContainer && this.timerContainer.visible);

    // HUD boundaries
    const weatherRight = 24 + 310; // 334
    const taskLeft = this.taskWidgetX || (sceneWidth - 460 - 24); // 796
    const topCorridorCenter = Math.round((weatherRight + taskLeft) / 2); // 565
    const taskBottom = (this.taskWidgetY || 20) + (this.taskWidgetHeight || 100);
    const topHudBottom = Math.max(110, taskBottom);

    // Available gap between top widgets: 796 - 334 = 462px.
    // Safe corridor width allowing comfortable 40px margin: 422px.
    const maxTopCorridorWidth = (taskLeft - weatherRight) - 40;

    // If browser window is narrow OR content requires repositioning below HUD:
    if (isNarrowWindow || boxWidth > maxTopCorridorWidth) {
      return {
        x: Math.round(sceneWidth / 2),
        y: Math.round(topHudBottom + (boxHeight / 2) + 14)
      };
    }

    // Normal view: top-center between weather widget and mission sidebar
    let y = 46;
    if (timerActive) {
      // Sits cleanly below timer widget (timer bottom is 56)
      y = Math.round(56 + (boxHeight / 2) + 10);
    }

    return {
      x: topCorridorCenter,
      y: y
    };
  }

  /**
   * Updates toast text, measures dimensions, and redraws compact background
   * @param {{textEs: string, textEn: string, isSuccess: boolean}} item
   * @returns {{boxWidth: number, boxHeight: number}}
   */
  updateToastLayout(item) {
    const { textEs, textEn, isSuccess = true } = item;

    // Update text content
    this.toastTextEs.setText(textEs || '');
    this.toastTextEn.setText(textEn || '');

    // Colors: Rich emerald green for success; terracotta red for alert
    const fillColor = isSuccess ? 0x064e3b : 0x7f1d1d;
    const borderColor = isSuccess ? 0x34d399 : 0xf87171;
    const enColor = isSuccess ? '#a7f3d0' : '#fecaca';
    this.toastTextEn.setColor(enColor);

    // Calculate dimensions based on actual measured text
    const textWidth = Math.max(this.toastTextEs.width, this.toastTextEn.width);
    const padX = 16;
    const padY = 7;
    const spacing = 3;

    // Sensible maximum width for top slot is 370px, minimum 170px
    const boxWidth = Math.max(170, Math.min(370, Math.round(textWidth + padX * 2)));
    const totalTextHeight = this.toastTextEs.height + (textEn ? (this.toastTextEn.height + spacing) : 0);
    const boxHeight = Math.round(totalTextHeight + padY * 2);

    // Position text inside container
    const yEs = -totalTextHeight / 2 + (this.toastTextEs.height / 2);
    this.toastTextEs.setPosition(0, yEs);

    if (textEn) {
      const yEn = yEs + (this.toastTextEs.height / 2) + spacing + (this.toastTextEn.height / 2);
      this.toastTextEn.setPosition(0, yEn);
      this.toastTextEn.setVisible(true);
    } else {
      this.toastTextEn.setVisible(false);
    }

    // Redraw compact background
    this.toastBg.clear();
    this.toastBg.fillStyle(fillColor, 0.94);
    this.toastBg.fillRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 8);
    this.toastBg.lineStyle(1.5, borderColor, 0.9);
    this.toastBg.strokeRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 8);

    // Reposition container
    const pos = this.getOptimalToastPosition(boxWidth, boxHeight);
    this.toastContainer.setPosition(pos.x, pos.y);

    return { boxWidth, boxHeight };
  }

  /**
   * Shows a brief feedback toast notification
   * Prevents multiple notifications from stacking by cleanly queueing or replacing.
   * @param {string} textEs
   * @param {string} textEn
   * @param {boolean} isSuccess
   */
  showToast(textEs, textEn, isSuccess = true) {
    if (!this.toastQueue) {
      this.toastQueue = [];
    }

    const item = { textEs, textEn, isSuccess };

    if (this.isToastActive) {
      // If a toast is currently active, queue cleanly to prevent stacking
      if (this.toastQueue.length >= 2) {
        this.toastQueue.shift(); // Keep only latest 2 items in queue to prevent backlog
      }
      this.toastQueue.push(item);

      // If the current message has already been displayed for at least 1.2s, advance promptly
      const elapsed = Date.now() - (this.toastShownAt || 0);
      if (elapsed >= 1200) {
        this.advanceToastQueue();
      }
      return;
    }

    this.displayToast(item);
  }

  displayToast(item) {
    this.isToastActive = true;
    this.currentToastItem = item;
    this.toastShownAt = Date.now();

    if (this.toastTween) {
      this.toastTween.stop();
      this.toastTween = null;
    }
    if (this.toastTimer) {
      this.toastTimer.remove();
      this.toastTimer = null;
    }

    this.updateToastLayout(item);

    this.toastContainer.setVisible(true);
    this.toastContainer.setAlpha(1);

    // Subtle scale pop: 0.95 -> 1.0
    this.toastContainer.setScale(0.95);
    this.scene.tweens.add({
      targets: this.toastContainer,
      scaleX: 1,
      scaleY: 1,
      duration: 140,
      ease: 'Back.easeOut'
    });

    // Stay visible for 2600ms so both lines are easily readable
    this.toastTimer = this.scene.time.delayedCall(2600, () => {
      if (this.toastQueue && this.toastQueue.length > 0) {
        this.advanceToastQueue();
      } else {
        // Fade out smoothly
        this.toastTween = this.scene.tweens.add({
          targets: this.toastContainer,
          alpha: 0,
          duration: 350,
          ease: 'Sine.easeIn',
          onComplete: () => {
            this.toastContainer.setVisible(false);
            this.isToastActive = false;
            this.currentToastItem = null;
          }
        });
      }
    });
  }

  advanceToastQueue() {
    if (!this.toastQueue || this.toastQueue.length === 0) {
      this.isToastActive = false;
      this.currentToastItem = null;
      return;
    }

    const nextItem = this.toastQueue.shift();
    if (this.toastTween) {
      this.toastTween.stop();
      this.toastTween = null;
    }
    if (this.toastTimer) {
      this.toastTimer.remove();
      this.toastTimer = null;
    }

    this.displayToast(nextItem);
  }

  setWeatherDisplay(weatherState) {
    switch (weatherState) {
      case 'rain':
        this.weatherTextEs.setText('ESTÁ LLOVIENDO 🌧️');
        this.weatherTextEn.setText("It's raining 🌧️ (Llueve • 18°C)");
        this.toggleLabel.setText('🍃 Viento');
        this.toggleLabel.setColor('#38bdf8');
        this.setVocabularyDisplay('«el paraguas» (umbrella) • «la silla» (chair) • «el impermeable» (raincoat) • «las botas» (boots)');
        break;

      case 'wind':
        this.weatherTextEs.setText('HACE VIENTO 🍃');
        this.weatherTextEn.setText("It's windy 🍃 (Viento • 20°C)");
        this.toggleLabel.setText('❄️ Frío');
        this.toggleLabel.setColor('#38bdf8');
        this.setVocabularyDisplay('«el papel» (paper) • «el sombrero» (hat) • «la hoja» (leaf) • «la cometa» (kite)');
        break;

      case 'cold':
        this.weatherTextEs.setText('HACE FRÍO ❄️');
        this.weatherTextEn.setText("It's cold ❄️ (Frío • 6°C)");
        this.toggleLabel.setText('☀️ Calor');
        this.toggleLabel.setColor('#38bdf8');
        this.setVocabularyDisplay('«la chaqueta» (jacket) • «la bufanda» (scarf) • «los guantes» (gloves) • «el suéter» (sweater)');
        break;

      case 'heat':
        this.weatherTextEs.setText('HACE CALOR ☀️🔥');
        this.weatherTextEn.setText("It's hot ☀️🔥 (Calor • 34°C)");
        this.toggleLabel.setText('☀️ Sol');
        this.toggleLabel.setColor('#38bdf8');
        this.setVocabularyDisplay('«el agua» (water) • «la botella» (bottle) • «el vaso» (glass) • «el abanico» (hand fan)');
        break;

      case 'sunny':
      default:
        this.weatherTextEs.setText(TEXTS.HUD.CURRENT_WEATHER_ES);
        this.weatherTextEn.setText(TEXTS.HUD.CURRENT_WEATHER_EN);
        this.toggleLabel.setText('🌧️ Lluvia');
        this.toggleLabel.setColor('#38bdf8');
        this.setVocabularyDisplay('«el helado» (ice cream) • «las flores» (flowers) • «el banco» (bench) • «la bicicleta» (bicycle)');
        break;
    }
  }

  setVocabularyDisplay(phraseEs) {
    this.updateVocabularyContent(phraseEs);
  }

  setTaskDisplay(taskEs, taskEn) {
    if (this.drawTaskBg) this.drawTaskBg(100);
    if (this.singleTaskContainer) this.singleTaskContainer.setVisible(true);
    if (this.multiTaskContainer) this.multiTaskContainer.setVisible(false);

    if (this.taskTextEs) {
      this.taskTextEs.setText(taskEs);
    }
    if (this.taskTextEn) {
      this.taskTextEn.setText(taskEn);
    }
  }

  setMultiQuestDisplay(quests) {
    if (!quests || quests.length === 0) return;

    if (this.drawTaskBg) this.drawTaskBg(164);
    if (this.singleTaskContainer) this.singleTaskContainer.setVisible(false);
    if (this.multiTaskContainer) this.multiTaskContainer.setVisible(true);

    if (this.questRows && this.questRows.length > 0) {
      quests.forEach((q, idx) => {
        if (idx >= this.questRows.length) return;
        const row = this.questRows[idx];

        let icon = '⬜';
        let colorEs = '#f8fafc';
        let colorEn = '#94a3b8';

        if (q.isCompleted) {
          icon = '✅';
          colorEs = '#34d399';
          colorEn = '#6ee7b7';
        } else if (q.isSkipped) {
          icon = '⏭️';
          colorEs = '#64748b';
          colorEn = '#475569';
        } else {
          icon = (q.isFirst) ? '🎯' : '⏱️';
          colorEs = '#f8fafc';
          colorEn = '#cbd5e1';
        }

        row.icon.setText(icon);
        row.titleEs.setText(q.titleEs).setColor(colorEs);
        const enStatus = q.isCompleted ? '(Done)' : (q.isSkipped ? '(Skipped)' : '');
        row.titleEn.setText(`${q.titleEn} ${enStatus}`.trim()).setColor(colorEn);
      });
    }

    // Keep taskTextEs/En updated as fallback/backward compatibility
    if (this.taskTextEs) {
      this.taskTextEs.setText(quests.map(q => `${q.isCompleted ? '✅' : '⬜'} ${q.titleEs}`).join('\n'));
    }
    if (this.taskTextEn) {
      this.taskTextEn.setText(quests.map(q => q.titleEn).join(' • '));
    }
  }

  createSoundToggleButton() {
    const { scene } = this;
    // Internal container kept invisible/off-screen so the button is completely removed from the visible HUD
    // while preserving audio functionality and programmatic callback handling.
    const soundContainer = scene.add.container(-9999, -9999);
    soundContainer.setVisible(false);

    this.soundTextEs = scene.add.text(0, 0, '🔊 SONIDO: SÍ');
    this.soundTextEn = scene.add.text(0, 0, 'SOUND: ON');
    soundContainer.add([this.soundTextEs, this.soundTextEn]);

    soundContainer.on('pointerdown', () => {
      if (this.options.onSoundToggle) {
        const isMuted = this.options.onSoundToggle();
        this.updateSoundDisplay(isMuted);
      }
    });

    this.soundButtonContainer = soundContainer;
    this.container.add(soundContainer);
  }

  updateSoundDisplay(isMuted) {
    this.isSoundMuted = isMuted;
    if (this.soundTextEs) {
      if (isMuted) {
        this.soundTextEs.setText('🔇 SONIDO: NO');
        this.soundTextEn.setText('SOUND: OFF');
      } else {
        this.soundTextEs.setText('🔊 SONIDO: SÍ');
        this.soundTextEn.setText('SOUND: ON');
      }
    }
  }

  createNavigationButton() {
    const { scene } = this;
    const sceneWidth = scene.cameras.main.width;
    const sceneHeight = scene.cameras.main.height;
    const width = 180;
    const height = 44;
    const x = sceneWidth - width - 24;
    const y = sceneHeight - height - 20;

    const navContainer = scene.add.container(x + width / 2, y + height / 2);

    const btnBg = scene.add.graphics();
    btnBg.fillStyle(0x1e293b, 0.9);
    btnBg.fillRoundedRect(-width / 2, -height / 2, width, height, 10);
    btnBg.lineStyle(1.5, 0x94a3b8, 0.6);
    btnBg.strokeRoundedRect(-width / 2, -height / 2, width, height, 10);

    const textEs = scene.add.text(0, -6, TEXTS.HUD.BACK_BUTTON_ES, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '13px',
      fontWeight: '700',
      color: '#f8fafc',
      align: 'center'
    }).setOrigin(0.5);

    const textEn = scene.add.text(0, 10, TEXTS.HUD.BACK_BUTTON_EN, {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '10px',
      color: '#94a3b8',
      align: 'center'
    }).setOrigin(0.5);

    navContainer.add([btnBg, textEs, textEn]);
    navContainer.setSize(width, height);
    navContainer.setInteractive({ useHandCursor: true });

    navContainer.on('pointerover', () => {
      btnBg.clear();
      btnBg.fillStyle(0x334155, 1);
      btnBg.fillRoundedRect(-width / 2, -height / 2, width, height, 10);
      btnBg.lineStyle(1.5, 0xf59e0b, 1);
      btnBg.strokeRoundedRect(-width / 2, -height / 2, width, height, 10);
    });

    navContainer.on('pointerout', () => {
      btnBg.clear();
      btnBg.fillStyle(0x1e293b, 0.9);
      btnBg.fillRoundedRect(-width / 2, -height / 2, width, height, 10);
      btnBg.lineStyle(1.5, 0x94a3b8, 0.6);
      btnBg.strokeRoundedRect(-width / 2, -height / 2, width, height, 10);
    });

    navContainer.on('pointerdown', () => {
      scene.scene.start(SCENE_KEYS.TITLE);
    });

    this.container.add(navContainer);
  }

  destroy() {
    if (typeof window !== 'undefined' && this.onWindowResize) {
      window.removeEventListener('resize', this.onWindowResize);
    }
    if (this.toastTween) {
      this.toastTween.stop();
      this.toastTween = null;
    }
    if (this.toastTimer) {
      this.toastTimer.remove();
      this.toastTimer = null;
    }
    this.toastQueue = [];
    if (this.container) {
      this.container.destroy();
    }
    if (this.toastContainer) {
      this.toastContainer.destroy();
    }
    if (this.timerContainer) {
      this.timerContainer.destroy();
    }
  }
}
