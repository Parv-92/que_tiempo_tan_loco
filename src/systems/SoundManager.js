/**
 * SoundManager — Synthesized Web Audio Engine
 * Spanish Weather Exploration Game — "¡Qué Tiempo Tan Loco!"
 *
 * Provides subtle, organic sound effects and atmospheric weather ambience
 * using the standard browser Web Audio API (zero external network assets required).
 */
export class SoundManager {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.ctx = null;
    this.isMuted = false;
    this.isInitialized = false;

    // Gain nodes
    this.masterGain = null;
    this.sfxGain = null;
    this.ambienceGain = null;

    // Active ambience tracking
    this.currentAmbience = null;
    this.currentWeather = null;

    // Footstep tracking
    this.lastFootstepTime = 0;
    this.footstepInterval = 360; // ms between footsteps tuned for relaxed walking

    // Birdsong timer for sunny/heat
    this.birdsongTimer = null;

    // Bind interaction listeners to unlock AudioContext on first permitted user gesture
    this.setupUnlockListeners();
  }

  setupUnlockListeners() {
    const unlock = () => {
      this.init();
      // Remove DOM listeners once initialized
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };

    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
  }

  /**
   * Initializes AudioContext and master gain pipeline
   */
  init() {
    if (this.isInitialized) {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // SFX Gain (subtle, non-distracting)
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.45, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // Ambience Gain (soft background bed)
      this.ambienceGain = this.ctx.createGain();
      this.ambienceGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.ambienceGain.connect(this.masterGain);

      this.isInitialized = true;

      // If a weather ambience was already queued, start it now
      if (this.currentWeather) {
        this.startWeatherAmbience(this.currentWeather);
      }
    } catch (e) {
      // AudioContext unavailable or restricted - fail gracefully
      this.isInitialized = false;
    }
  }

  ensureContext() {
    if (!this.isInitialized) {
      this.init();
    } else if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Toggles master audio mute state
   * @returns {boolean} new mute state (true = muted, false = sound on)
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : 1;
      this.masterGain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  setMuted(muted) {
    this.isMuted = Boolean(muted);
    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : 1;
      this.masterGain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
    }
  }

  // ==========================================
  // SFX: FOOTSTEPS
  // ==========================================
  playFootstep() {
    if (this.isMuted || !this.isInitialized || !this.ctx) return;
    const now = performance.now();
    if (now - this.lastFootstepTime < this.footstepInterval) return;
    this.lastFootstepTime = now;

    try {
      const t = this.ctx.currentTime;

      // Soft low-frequency tap + damped noise (cobblestones)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Pitch variation for natural walking
      const baseFreq = 95 + Math.random() * 25;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.045);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, t);

      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.05);
    } catch (e) {}
  }

  stopFootsteps() {
    // Immediate reset of step timing
    this.lastFootstepTime = 0;
  }

  // ==========================================
  // SFX: NPC INTERACTION
  // ==========================================
  playInteract() {
    if (this.isMuted || !this.isInitialized || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      // Soft melodic marimba/kalimba two-tone: C5 (523Hz) -> E5 (659Hz)
      const notes = [523.25, 659.25];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.08);

        gain.gain.setValueAtTime(0.001, t + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, t + idx * 0.08 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.14);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t + idx * 0.08);
        osc.stop(t + idx * 0.08 + 0.15);
      });
    } catch (e) {}
  }

  // ==========================================
  // SFX: QUEST PROGRESS / ITEM PICKUP
  // ==========================================
  playProgress() {
    if (this.isMuted || !this.isInitialized || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      // Light positive blip: E5 (659Hz) -> A5 (880Hz)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.09);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.14, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.13);
    } catch (e) {}
  }

  // ==========================================
  // SFX: WRONG ANSWER / CANCEL CUE
  // ==========================================
  playCancel() {
    if (this.isMuted || !this.isInitialized || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      // Soft gentle low double-tone: D4 (293Hz) -> Bb3 (233Hz)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(293.66, t);
      osc.frequency.exponentialRampToValueAtTime(233.08, t + 0.12);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.15);
    } catch (e) {}
  }

  // ==========================================
  // SFX: QUEST COMPLETION (Pleasant Major Triad)
  // ==========================================
  playCompletion() {
    if (this.isMuted || !this.isInitialized || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      // Sparkling major chord: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
      const chord = [523.25, 659.25, 783.99, 1046.5];
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const start = t + idx * 0.06;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(start);
        osc.stop(start + 0.5);
      });
    } catch (e) {}
  }

  // ==========================================
  // SFX: WEATHER TRANSITION CUE
  // ==========================================
  playWeatherTransition() {
    if (this.isMuted || !this.isInitialized || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      // Atmospheric swell with swept sine and soft shimmer
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(440, t + 0.45);
      osc.frequency.exponentialRampToValueAtTime(330, t + 0.85);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, t);
      filter.frequency.exponentialRampToValueAtTime(1200, t + 0.4);
      filter.frequency.exponentialRampToValueAtTime(400, t + 0.85);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.9);
    } catch (e) {}
  }

  // ==========================================
  // AMBIENCE: WEATHER AUDIO LOOPS & FADING
  // ==========================================
  setWeather(weatherType) {
    if (this.currentWeather === weatherType) return;
    this.currentWeather = weatherType;

    if (!this.isInitialized) return;
    this.startWeatherAmbience(weatherType);
  }

  startWeatherAmbience(weatherType) {
    // 1. Smoothly fade out and stop old ambience
    this.stopAmbience();

    if (!this.ctx || !this.ambienceGain) return;

    try {
      switch (weatherType) {
        case 'rain':
          this.currentAmbience = this.createRainAmbience();
          break;
        case 'wind':
          this.currentAmbience = this.createWindAmbience();
          break;
        case 'cold':
          this.currentAmbience = this.createColdAmbience();
          break;
        case 'heat':
        case 'sunny':
        default:
          this.currentAmbience = this.createSunnyAmbience();
          break;
      }
    } catch (e) {
      this.currentAmbience = null;
    }
  }

  stopAmbience() {
    if (this.birdsongTimer) {
      clearInterval(this.birdsongTimer);
      this.birdsongTimer = null;
    }

    if (this.currentAmbience) {
      const amb = this.currentAmbience;
      this.currentAmbience = null;

      try {
        if (amb.gainNode && this.ctx) {
          const t = this.ctx.currentTime;
          amb.gainNode.gain.setValueAtTime(amb.gainNode.gain.value, t);
          amb.gainNode.gain.linearRampToValueAtTime(0.001, t + 0.3);
          setTimeout(() => {
            amb.stop();
          }, 350);
        } else {
          amb.stop();
        }
      } catch (e) {}
    }
  }

  // --- Rain Ambience (Soft Filtered Rain Bed + Subtle Drops) ---
  createRainAmbience() {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Warm pinkish noise
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.96 * b1 + white * 0.11;
      b2 = 0.86 * b2 + white * 0.25;
      data[i] = (b0 + b1 + b2) * 0.35;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, this.ctx.currentTime);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.4);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ambienceGain);

    noiseSource.start();

    return {
      type: 'rain',
      gainNode,
      stop: () => {
        try {
          noiseSource.stop();
          noiseSource.disconnect();
          filter.disconnect();
          gainNode.disconnect();
        } catch (e) {}
      }
    };
  }

  // --- Wind Ambience (Modulated Gust Filter) ---
  createWindAmbience() {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // Resonant bandpass for whooshing wind
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(280, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    // LFO to create natural gentle gusts
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.25, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.16, this.ctx.currentTime + 0.4);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ambienceGain);

    noiseSource.start();
    lfo.start();

    return {
      type: 'wind',
      gainNode,
      stop: () => {
        try {
          noiseSource.stop();
          lfo.stop();
          noiseSource.disconnect();
          lfo.disconnect();
          lfoGain.disconnect();
          filter.disconnect();
          gainNode.disconnect();
        } catch (e) {}
      }
    };
  }

  // --- Cold Ambience (Subtle Chilly Breeze Whistle) ---
  createColdAmbience() {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.35;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // Narrow resonant peak around 520Hz gives the cold wintry whistle
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(520, this.ctx.currentTime);
    filter.Q.setValueAtTime(4.0, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(80, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.13, this.ctx.currentTime + 0.4);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ambienceGain);

    noiseSource.start();
    lfo.start();

    return {
      type: 'cold',
      gainNode,
      stop: () => {
        try {
          noiseSource.stop();
          lfo.stop();
          noiseSource.disconnect();
          lfo.disconnect();
          filter.disconnect();
          gainNode.disconnect();
        } catch (e) {}
      }
    };
  }

  // --- Sunny / Heat Ambience (Calm Outdoor Air & Light Birdsong) ---
  createSunnyAmbience() {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.4);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ambienceGain);

    noiseSource.start();

    // Occasional gentle birdsong chirp every 4-7 seconds
    this.birdsongTimer = setInterval(() => {
      if (!this.isMuted && this.ctx && Math.random() < 0.65) {
        this.playBirdChirp();
      }
    }, 4500);

    return {
      type: 'sunny',
      gainNode,
      stop: () => {
        try {
          noiseSource.stop();
          noiseSource.disconnect();
          filter.disconnect();
          gainNode.disconnect();
        } catch (e) {}
      }
    };
  }

  playBirdChirp() {
    if (this.isMuted || !this.isInitialized || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const baseFreq = 2600 + Math.random() * 500;
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.linearRampToValueAtTime(baseFreq + 700, t + 0.05);
      osc.frequency.linearRampToValueAtTime(baseFreq + 200, t + 0.11);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.04, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);

      osc.connect(gain);
      gain.connect(this.ambienceGain);

      osc.start(t);
      osc.stop(t + 0.14);
    } catch (e) {}
  }

  destroy() {
    this.stopAmbience();
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (e) {}
      this.ctx = null;
    }
  }
}
