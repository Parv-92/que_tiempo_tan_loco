/**
 * Constants & Configuration Values
 * Spanish Weather Exploration Game — "¡Qué Tiempo Tan Loco!"
 */

export const GAME_CONFIG = {
  WIDTH: 1280,
  HEIGHT: 720,
  PARENT_ID: 'game-container'
};

export const SCENE_KEYS = {
  BOOT: 'BootScene',
  TITLE: 'TitleScene',
  PLAZA: 'PlazaScene'
};

export const ASSET_KEYS = {
  MAP_SUNNY: {
    KEY: 'plaza_sunny',
    PATH: 'assets/maps/plaza_sunny.png'
  }
};

export const TEXTS = {
  TITLE: '¡Qué Tiempo Tan Loco!',
  SUBTITLE_ES: 'Exploración y vocabulario del clima en la plaza española',
  SUBTITLE_EN: 'Spanish weather exploration & everyday tasks in a Madrid plaza',
  PLAY_BUTTON_ES: '¡Jugar Ahora!',
  PLAY_BUTTON_EN: 'Start Exploring',
  ABOUT_TITLE_ES: 'Modo de Juego',
  ABOUT_TITLE_EN: 'Game Concept',
  ABOUT_DESC_ES: 'Explora libremente la plaza, aprende expresiones del tiempo y ayuda a los vecinos.',
  ABOUT_DESC_EN: 'Explore the town plaza, discover weather expressions, and assist local characters with daily needs.',
  STATUS_ASSET_FOUND_ES: 'Mapa fotográfico cargado correctamente',
  STATUS_ASSET_FOUND_EN: 'Plaza background asset loaded',
  STATUS_ASSET_MISSING_ES: 'Modo de reserva: Asset plaza_sunny.png no encontrado',
  STATUS_ASSET_MISSING_EN: 'Fallback mode: Map asset plaza_sunny.png not found',
  HUD: {
    WEATHER_LABEL_ES: 'El Clima',
    WEATHER_LABEL_EN: 'Weather',
    CURRENT_WEATHER_ES: 'Hace sol (Soleado)',
    CURRENT_WEATHER_EN: "It's sunny (Pleasant, 24°C)",
    TASK_LABEL_ES: 'Misión en la Plaza',
    TASK_LABEL_EN: 'Current Objective',
    CURRENT_TASK_ES: 'Habla con Don Mateo junto a la fuente central.',
    CURRENT_TASK_EN: 'Speak with Don Mateo near the central fountain.',
    HINT_LABEL_ES: 'Pista de Vocabulario',
    HINT_LABEL_EN: 'Vocabulary Hint',
    CURRENT_HINT_ES: '«¿Qué tiempo hace hoy?» = What is the weather like today?',
    BACK_BUTTON_ES: '← Menú Principal',
    BACK_BUTTON_EN: 'Main Menu'
  }
};

/**
 * Usable Everyday Spanish Vocabulary Inventory per Weather Type
 * Each category contains at least 7 distinct, non-repeating everyday objects
 * with zero duplicate objects across all 5 weather categories.
 */
export const WEATHER_VOCABULARY_INVENTORY = {
  rain: [
    { es: 'el paraguas', en: 'umbrella', phrase: '«el paraguas» (umbrella) — para la lluvia' },
    { es: 'la silla', en: 'chair', phrase: '«la silla» (chair) — bajo el toldo' },
    { es: 'el poncho', en: 'rain poncho', phrase: '«el poncho» (rain poncho) — para la lluvia' },
    { es: 'el impermeable', en: 'raincoat', phrase: '«el impermeable» (raincoat) — para no mojarse' },
    { es: 'las botas', en: 'boots', phrase: '«las botas» (boots) — para el agua' },
    { es: 'la mochila', en: 'backpack', phrase: '«la mochila» (backpack) — protegida' },
    { es: 'la bolsa', en: 'bag', phrase: '«la bolsa» (bag) — de compras' }
  ],
  wind: [
    { es: 'el papel', en: 'paper', phrase: '«el papel» (paper) — vuela con el viento' },
    { es: 'el sombrero', en: 'hat', phrase: '«el sombrero» (hat) — de Don Mateo' },
    { es: 'la hoja', en: 'leaf', phrase: '«la hoja» (leaf) — que cae del árbol' },
    { es: 'el periódico', en: 'newspaper', phrase: '«el periódico» (newspaper) — del quiosco' },
    { es: 'la servilleta', en: 'napkin', phrase: '«la servilleta» (napkin) — del café' },
    { es: 'la cometa', en: 'kite', phrase: '«la cometa» (kite) — en el cielo' },
    { es: 'la bandera', en: 'flag', phrase: '«la bandera» (flag) — ondea al viento' }
  ],
  cold: [
    { es: 'la chaqueta', en: 'jacket', phrase: '«la chaqueta» (jacket) — para el frío' },
    { es: 'la bufanda', en: 'scarf', phrase: '«la bufanda» (scarf) — de lana suave' },
    { es: 'los guantes', en: 'gloves', phrase: '«los guantes» (gloves) — para las manos' },
    { es: 'el gorro', en: 'beanie / warm hat', phrase: '«el gorro» (beanie) — de invierno' },
    { es: 'el abrigo', en: 'coat', phrase: '«el abrigo» (coat) — bien caliente' },
    { es: 'la manta', en: 'blanket', phrase: '«la manta» (blanket) — para taparse' },
    { es: 'el suéter', en: 'sweater', phrase: '«el suéter» (sweater) — de punto' }
  ],
  heat: [
    { es: 'el agua', en: 'water', phrase: '«el agua» (water) — fresca de la fuente' },
    { es: 'la botella', en: 'bottle', phrase: '«la botella» (bottle) — de agua fría' },
    { es: 'el vaso', en: 'glass', phrase: '«el vaso» (glass) — con hielo' },
    { es: 'el abanico', en: 'hand fan', phrase: '«el abanico» (hand fan) — para el calor' },
    { es: 'la gorra', en: 'cap', phrase: '«la gorra» (cap) — para el sol' },
    { es: 'las gafas de sol', en: 'sunglasses', phrase: '«las gafas de sol» (sunglasses) — para los ojos' },
    { es: 'la toalla', en: 'towel', phrase: '«la toalla» (towel) — de verano' }
  ],
  sunny: [
    { es: 'el helado', en: 'ice cream', phrase: '«el helado» (ice cream) — de fresa y vainilla' },
    { es: 'las flores', en: 'flowers', phrase: '«las flores» (flowers) — bonitas del puesto' },
    { es: 'el banco', en: 'bench', phrase: '«el banco» (bench) — para descansar' },
    { es: 'la bicicleta', en: 'bicycle', phrase: '«la bicicleta» (bicycle) — en la plaza' },
    { es: 'el balón', en: 'football / ball', phrase: '«el balón» (football / ball) — Juego con el balón' },
    { es: 'la cámara', en: 'camera', phrase: '«la cámara» (camera) — de fotos' },
    { es: 'la cesta', en: 'basket', phrase: '«la cesta» (basket) — de pícnic' }
  ]
};
