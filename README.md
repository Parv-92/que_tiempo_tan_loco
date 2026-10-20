# ¡Qué Tiempo Tan Loco! — Spanish Weather Exploration Game

A relaxed top-down exploration game set in a Madrid-inspired Spanish town plaza designed for beginner Spanish learners. Weather creates small, contextual tasks: the player explores, interacts with local characters, learns everyday Spanish phrases, and returns to free exploration without timer pressure or survival stress.

---

## Project Structure

```text
weather-game/
├── index.html                 # Main entry HTML and responsive container
├── style.css                  # Global styles, palette tokens & layout
├── vite.config.js             # Vite development & build setup
├── package.json               # Project dependencies (Phaser 3 + Vite)
├── public/
│   └── assets/
│       └── maps/
│           ├── plaza_sunny.png   # [Loaded] 1672x941 town plaza background
│           └── README.md         # Asset instructions
├── scripts/
│   └── verify_game.js         # Automated E2E verification test suite
└── src/
    ├── main.js                # Game bootstrapper
    ├── config/
    │   ├── constants.js       # Dimensions, asset paths, scene keys, bilingual texts
    │   └── gameConfig.js      # Phaser configuration (Arcade physics, Scale.FIT)
    ├── data/
    │   └── collisionData.js   # Modular obstacle and geometry definitions
    ├── entities/
    │   ├── Player.js          # Player entity with normalized WASD + Arrow movement
    │   ├── DonMateo.js        # Don Mateo NPC with proximity trigger & weather dialogues
    │   ├── Camarero.js        # Marcos the Café Worker NPC
    │   ├── Chair.js           # Movable bistro chairs with pickup/drop logic
    │   └── characterTextures.js # Procedural sprite generation for characters & props
    ├── scenes/
    │   ├── BootScene.js       # Preloader with graceful asset error handling
    │   ├── TitleScene.js      # Spanish title, bilingual description, and Play button
    │   └── PlazaScene.js      # Plaza scene, aspect-ratio renderer, fallback & HUD
    ├── systems/
    │   ├── WeatherManager.js  # Reversible weather system (overcast tint, rain particles, ripples)
    │   └── CafeTask.js        # Handcrafted rain scenario (chair rescue under café awning)
    └── ui/
        ├── GameHUD.js         # Dedicated HUD: weather indicator, objective, vocab, toasts & toggle
        ├── DialogueBox.js     # Bilingual dialogue modal with movement locking
        └── CompletionModal.js # Celebration and vocabulary recap modal with replay controls
```

---

## Controls & Interaction

- **Player Movement:** `W`, `A`, `S`, `D` or `Arrow Keys` (diagonal movement velocity is normalized).
- **Interact with NPCs & Items:** Press `E` or `Space` when nearby (or click floating prompt bubbles).
- **Rain:** Pick up umbrella (`el paraguas`) or rescue chairs (`las sillas`) under the café awning.
- **Wind:** Help Carmen collect scattered papers (`los papeles`) across the plaza and return them to the market.
- **Cold:** Collect the jacket (`la chaqueta`) and scarf (`la bufanda`) and deliver them to Don Mateo.
- **Heat:** Collect fresh water (`el agua`) from the fountain and guide Sofia to shade (`la sombra`).
- **Close Dialogue:** Press `E`, `Space`, or click anywhere on the dialogue box. Player movement is locked during conversation.
- **Weather Toggle / Cycle:** Click the weather button in the top-left HUD panel to cycle through all weather states at any time (`🌧️ Lluvia` → `🍃 Viento` → `❄️ Frío` → `☀️🔥 Calor` → `☀️ Sol`).
- **Return to Menu:** Click `← Menú Principal` in the bottom-right corner.

---

## Weather Cycles & Contextual Spanish Learning

Every interaction features concise, beginner-friendly single-sentence Spanish dialogue with English guide text directly beneath it. No timers, punishment, or health loss exist.

### 1. Sunny Baseline — `Hace sol.`
- **Atmosphere:** Warm, calm plaza baseline for free exploration.
- **NPC Dialogue:** Don Mateo: `«¡Hola! Hace sol hoy en la plaza.»` (*"Hello! It is sunny in the plaza today."*)
- **Target Vocabulary:** `Hace sol` (It's sunny), `la plaza` (the plaza), `el sol` (the sun).

### 2. Rain Cycle — `Está lloviendo.`
- **Atmosphere:** Dark blue overcast tint and falling rain streaks.
- **Tasks:**
  - **Umbrella (`el paraguas`):** Pick up the umbrella to carry it overhead for rain shelter. Don Mateo acknowledges: `«¡El paraguas es genial! Ahora estás protegido de la lluvia.»`
  - **Café Chairs (`las sillas`):** Help Marcos move outdoor chairs under the sheltered café awning.
- **Target Vocabulary:** `Está lloviendo` / `Llueve` (It's raining), `el paraguas` (the umbrella), `la silla` (the chair), `el toldo` (the awning).

### 3. Wind Cycle — `Hace viento.`
- **Atmosphere:** Swirling autumn leaves blown across the plaza.
- **Task:** Talk to market vendor Carmen (`«¡Hace viento! Por favor, recoge los papeles que vuelan por la plaza.»`). Collect scattered market papers and return them to Carmen.
- **Target Vocabulary:** `Hace viento` (It's windy), `los papeles` (the papers), `el mercado` (the market), `el viento` (the wind).

### 4. Cold Cycle — `Hace frío.`
- **Atmosphere:** Chilly cyan haze and drifting snowflakes.
- **Task:** Find the jacket (`la chaqueta`) and scarf (`la bufanda`) and deliver warm winter clothing to Don Mateo.
- **Target Vocabulary:** `Hace frío` (It's cold), `la chaqueta` (the jacket), `la bufanda` (the scarf), `el frío` (the cold).

### 5. Heat Cycle — `Hace calor.`
- **Atmosphere:** High summer amber overlay.
- **Task:** Fetch a bottle of fresh water (`el agua`) at the central fountain and accompany Sofia from direct sunlight into cool shade (`la sombra`).
- **Target Vocabulary:** `Hace calor` (It's hot), `el agua` (the water), `la sombra` (the shade), `la fuente` (the fountain).

---

## Running the Project

### Prerequisites
- Node.js (v18+)
- npm

### Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Automated Test Suite
```bash
node scripts/verify_game.js
```

### Production Build
```bash
npm run build
```
The compiled bundle will be generated into the `dist/` directory.
