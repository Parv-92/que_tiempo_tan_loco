import Phaser from 'phaser';

export class DonMateo extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   */
  constructor(scene, x, y) {
    super(scene, x, y, 'don_mateo');

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Immovable

    this.body.setSize(22, 16);
    this.body.setOffset(5, 26);
    this.setDepth(20 + Math.floor(y / 10));

    this.interactionRadius = 80;
    this.isPlayerNearby = false;

    this.hintIndex = 0;

    this.createAttentionArrow(scene);
    this.createPromptBubble(scene);

    scene.tweens.add({
      targets: this,
      y: y - 2,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createAttentionArrow(scene) {
    this.arrowContainer = scene.add.container(this.x, this.y - 32);
    this.arrowContainer.setDepth(92);

    this.arrowGfx = scene.add.graphics();
    // Small, crisp downward-pointing golden amber arrow with dark border
    this.arrowGfx.fillStyle(0xf59e0b, 1);
    this.arrowGfx.lineStyle(1.5, 0x78350f, 1);
    this.arrowGfx.beginPath();
    this.arrowGfx.moveTo(-6, -8);
    this.arrowGfx.lineTo(6, -8);
    this.arrowGfx.lineTo(0, 2);
    this.arrowGfx.closePath();
    this.arrowGfx.fillPath();
    this.arrowGfx.strokePath();

    this.arrowContainer.add(this.arrowGfx);

    // Gentle vertical bounce animation
    this.arrowTween = scene.tweens.add({
      targets: this.arrowGfx,
      y: -6,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  hideAttentionArrow() {
    if (this.arrowContainer) {
      this.arrowContainer.setVisible(false);
    }
  }

  showAttentionArrow() {
    if (this.arrowContainer) {
      this.arrowContainer.setVisible(true);
    }
  }

  isAttentionArrowVisible() {
    return Boolean(this.arrowContainer && this.arrowContainer.visible);
  }

  createPromptBubble(scene) {
    this.promptContainer = scene.add.container(this.x, this.y - 38);
    this.promptContainer.setDepth(90);
    this.promptContainer.setVisible(false);

    const bubbleWidth = 148;
    const bubbleHeight = 30;

    const bg = scene.add.graphics();
    bg.fillStyle(0x0f172a, 0.95);
    bg.fillRoundedRect(-bubbleWidth / 2, -bubbleHeight / 2, bubbleWidth, bubbleHeight, 8);
    bg.lineStyle(1.5, 0xf59e0b, 0.9);
    bg.strokeRoundedRect(-bubbleWidth / 2, -bubbleHeight / 2, bubbleWidth, bubbleHeight, 8);

    const textEs = scene.add.text(0, -6, '[E] Hablar con Don Mateo', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '11px',
      fontWeight: '700',
      color: '#fbbf24',
      align: 'center'
    }).setOrigin(0.5);

    const textEn = scene.add.text(0, 7, 'Press [E] or [Space] to talk', {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fontSize: '8px',
      color: '#cbd5e1',
      align: 'center'
    }).setOrigin(0.5);

    this.promptContainer.add([bg, textEs, textEn]);
    this.promptContainer.setSize(bubbleWidth, bubbleHeight);
    this.promptContainer.setInteractive({ useHandCursor: true });
    this.promptContainer.on('pointerdown', () => {
      if (this.isPlayerNearby && this.onInteractCallback) {
        this.onInteractCallback();
      }
    });

    scene.tweens.add({
      targets: this.promptContainer,
      y: this.y - 42,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  setVisible(value) {
    super.setVisible(value);
    if (!value) {
      if (this.promptContainer) this.promptContainer.setVisible(false);
      if (this.arrowContainer) this.arrowContainer.setVisible(false);
      this.isPlayerNearby = false;
    }
    return this;
  }

  hidePrompt() {
    if (this.promptContainer) {
      this.promptContainer.setVisible(false);
    }
  }

  updateProximity(player, isDialogueOpen) {
    if (!player || !this.visible) {
      if (this.promptContainer) this.promptContainer.setVisible(false);
      this.isPlayerNearby = false;
      return;
    }
    const distance = Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y);
    const enterRadius = this.interactionRadius; // 80
    const exitRadius = this.interactionRadius + 15; // 95

    if (this.isPlayerNearby) {
      this.isPlayerNearby = distance <= exitRadius;
    } else {
      this.isPlayerNearby = distance <= enterRadius;
    }

    this.promptContainer.setVisible(this.isPlayerNearby && !isDialogueOpen);

    // Keep attention arrow aligned with Don Mateo
    if (this.arrowContainer) {
      this.arrowContainer.setPosition(this.x, this.y - 32);
    }
  }

  /**
   * Retrieves concise one-sentence dialogue for the active weather state
   * @param {string} weatherState
   * @param {boolean} isTaskCompleted
   */
  getNextDialogue(weatherState = 'sunny', isTaskCompleted = false) {
    const speakerEs = 'Don Mateo (Vecino de la plaza)';
    const speakerEn = 'Don Mateo (Plaza Local)';

    if (isTaskCompleted) {
      return {
        speakerEs,
        speakerEn,
        spanish: '¡Muchas gracias por tu ayuda! Eres un gran vecino en la plaza.',
        english: 'Thank you very much for your help! You are a great neighbor in the plaza.'
      };
    }

    switch (weatherState) {
      case 'rain':
        return {
          speakerEs,
          speakerEn,
          spanish: 'Parece que empieza a llover. Ten cuidado con los adoquines húmedos.',
          english: "It seems it is starting to rain. Be careful with the wet cobblestones."
        };

      case 'wind':
        return {
          speakerEs,
          speakerEn,
          spanish: '¡Qué racha de viento! Carmen necesita ayuda con sus papeles en el mercado.',
          english: "What a gust of wind! Carmen needs help with her papers at the market."
        };

      case 'cold':
        return {
          speakerEs,
          speakerEn,
          spanish: 'Hace mucho frío hoy en Madrid. Necesito la chaqueta y la bufanda.',
          english: "It is very cold today in Madrid. I need the jacket and the scarf."
        };

      case 'heat':
        return {
          speakerEs,
          speakerEn,
          spanish: 'El sol calienta con fuerza hoy. Bebe agua fresca de la fuente central.',
          english: "The sun is beating down today. Drink fresh water from the central fountain."
        };

      case 'sunny':
      default:
        return {
          speakerEs,
          speakerEn,
          spanish: 'Buenos días. Qué agradable está la plaza hoy con este sol.',
          english: 'Good morning. How pleasant the plaza is today with this sun.'
        };
    }
  }

  /**
   * Optional brief hint
   * @param {string} weatherState
   */
  getBriefHint(weatherState) {
    const speakerEs = 'Don Mateo (Pista breve)';
    const speakerEn = 'Don Mateo (Quick Hint)';

    switch (weatherState) {
      case 'rain':
        return {
          speakerEs,
          speakerEn,
          spanish: 'Pista: Las sillas del café deben ir bajo el toldo.',
          english: 'Hint: The café chairs should go under the awning.'
        };
      case 'wind':
        return {
          speakerEs,
          speakerEn,
          spanish: 'Pista: Los papeles vuelan cerca de la fuente y los bancos.',
          english: 'Hint: The papers are blowing near the fountain and benches.'
        };
      case 'cold':
        return {
          speakerEs,
          speakerEn,
          spanish: 'Pista: Busca la chaqueta y la bufanda cerca de los bancos.',
          english: 'Hint: Look for the jacket and the scarf near the benches.'
        };
      case 'heat':
        return {
          speakerEs,
          speakerEn,
          spanish: 'Pista: Coge agua en la fuente central y busca la sombra.',
          english: 'Hint: Get water at the central fountain and seek the shade.'
        };
      default:
        return {
          speakerEs,
          speakerEn,
          spanish: 'Pista: Explora la plaza a tu propio ritmo.',
          english: 'Hint: Explore the plaza at your own pace.'
        };
    }
  }

  destroy(fromScene) {
    if (this.arrowTween) this.arrowTween.stop();
    if (this.arrowContainer) this.arrowContainer.destroy();
    if (this.promptContainer) this.promptContainer.destroy();
    super.destroy(fromScene);
  }
}
