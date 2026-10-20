/**
 * Procedural Character & Object Sprite Generator
 * Spanish Weather Exploration Game — "¡Qué Tiempo Tan Loco!"
 * Generates crisp 3/4 top-down sprites without external assets.
 */

export function generateCharacterTextures(scene) {
  generatePlayerTexture(scene);
  generateDonMateoTexture(scene);
  generateCamareroTexture(scene);
  generateChairTexture(scene);
  generateRainTexture(scene);
  generateUmbrellaTexture(scene);
  generatePaperTexture(scene);
  generateCarmenTexture(scene);
  generateSofiaTexture(scene);
  generateColdPropsTextures(scene);
  generateHeatPropsTextures(scene);
  generateWeatherParticleTextures(scene);
  generateAdditionalQuestTextures(scene);
  generateIceCreamAndSunnyTextures(scene);
  generateExplorationTextures(scene);
}

function generatePlayerTexture(scene) {
  if (scene.textures.exists('player')) return;

  const width = 32;
  const height = 44;
  const gfx = scene.make.graphics({ x: 0, y: 0, add: false });

  // 1. Drop shadow at feet
  gfx.fillStyle(0x000000, 0.35);
  gfx.fillEllipse(16, 40, 22, 8);

  // 2. Shoes / Boots
  gfx.fillStyle(0x3b2414, 1);
  gfx.fillRoundedRect(10, 36, 5, 6, 2);
  gfx.fillRoundedRect(17, 36, 5, 6, 2);

  // 3. Pants (slate blue)
  gfx.fillStyle(0x334155, 1);
  gfx.fillRoundedRect(10, 28, 12, 10, 2);

  // 4. Torso / Jacket (vibrant royal blue explorer jacket)
  gfx.fillStyle(0x1d4ed8, 1);
  gfx.fillRoundedRect(8, 16, 16, 14, 4);

  // Shirt collar / zipper
  gfx.fillStyle(0xf8fafc, 1);
  gfx.fillRect(15, 17, 2, 8);
  gfx.fillStyle(0xf59e0b, 1);
  gfx.fillRect(15, 16, 2, 2);

  // Backpack straps
  gfx.fillStyle(0x78350f, 1);
  gfx.fillRect(9, 17, 2, 11);
  gfx.fillRect(21, 17, 2, 11);

  // 5. Hands
  gfx.fillStyle(0xfcd34d, 1);
  gfx.fillCircle(7, 26, 2.5);
  gfx.fillCircle(25, 26, 2.5);

  // 6. Head & Face
  gfx.fillStyle(0xfcd34d, 1);
  gfx.fillRoundedRect(10, 7, 12, 11, 4);

  // Eyes
  gfx.fillStyle(0x1e293b, 1);
  gfx.fillRect(12, 11, 2, 2);
  gfx.fillRect(18, 11, 2, 2);

  // Smile
  gfx.fillStyle(0xb45309, 1);
  gfx.fillRect(14, 15, 4, 1);

  // Hair
  gfx.fillStyle(0x542911, 1);
  gfx.fillRoundedRect(9, 5, 14, 5, 2);

  // 7. Cap / Beret (warm amber)
  gfx.fillStyle(0xd97706, 1);
  gfx.fillRoundedRect(8, 2, 16, 6, 3);
  gfx.fillStyle(0xf59e0b, 1);
  gfx.fillCircle(16, 2, 2);

  gfx.generateTexture('player', width, height);
  gfx.destroy();
}

function generateDonMateoTexture(scene) {
  if (scene.textures.exists('don_mateo')) return;

  const width = 32;
  const height = 44;
  const gfx = scene.make.graphics({ x: 0, y: 0, add: false });

  gfx.fillStyle(0x000000, 0.35);
  gfx.fillEllipse(16, 40, 22, 8);

  gfx.fillStyle(0x27190f, 1);
  gfx.fillRoundedRect(10, 36, 5, 6, 2);
  gfx.fillRoundedRect(17, 36, 5, 6, 2);

  gfx.fillStyle(0x475569, 1);
  gfx.fillRoundedRect(9, 28, 14, 10, 2);

  gfx.fillStyle(0xf1f5f9, 1);
  gfx.fillRoundedRect(7, 16, 18, 14, 4);

  gfx.fillStyle(0x881337, 1);
  gfx.fillRoundedRect(10, 17, 12, 13, 3);

  gfx.fillStyle(0xfbbf24, 1);
  gfx.fillCircle(16, 20, 1);
  gfx.fillCircle(16, 24, 1);
  gfx.fillCircle(16, 27, 1);

  gfx.fillStyle(0xfde047, 1);
  gfx.fillCircle(7, 27, 2.5);
  gfx.fillCircle(25, 27, 2.5);

  gfx.fillStyle(0xfde047, 1);
  gfx.fillRoundedRect(10, 7, 12, 11, 4);

  gfx.fillStyle(0x1e293b, 1);
  gfx.fillRect(12, 11, 2, 2);
  gfx.fillRect(18, 11, 2, 2);

  gfx.lineStyle(1, 0x94a3b8, 0.8);
  gfx.lineBetween(13, 12, 19, 12);

  gfx.fillStyle(0xe2e8f0, 1);
  gfx.fillRoundedRect(12, 14, 8, 3, 1);

  gfx.fillStyle(0xcfd8dc, 1);
  gfx.fillRect(9, 8, 2, 6);
  gfx.fillRect(21, 8, 2, 6);

  gfx.fillStyle(0x1e293b, 1);
  gfx.fillEllipse(16, 5, 18, 7);
  gfx.fillStyle(0x0f172a, 1);
  gfx.fillCircle(16, 3, 2);

  gfx.generateTexture('don_mateo', width, height);
  gfx.destroy();
}

function generateCamareroTexture(scene) {
  if (scene.textures.exists('camarero')) return;

  const width = 32;
  const height = 44;
  const gfx = scene.make.graphics({ x: 0, y: 0, add: false });

  gfx.fillStyle(0x000000, 0.35);
  gfx.fillEllipse(16, 40, 22, 8);

  gfx.fillStyle(0x0f172a, 1);
  gfx.fillRoundedRect(10, 36, 5, 6, 2);
  gfx.fillRoundedRect(17, 36, 5, 6, 2);

  gfx.fillStyle(0x1e293b, 1);
  gfx.fillRoundedRect(9, 28, 14, 10, 2);

  gfx.fillStyle(0xffffff, 1);
  gfx.fillRoundedRect(8, 16, 16, 14, 4);

  gfx.fillStyle(0x0f172a, 1);
  gfx.fillRect(14, 17, 4, 3);

  gfx.fillStyle(0x065f46, 1);
  gfx.fillRoundedRect(9, 21, 14, 15, 2);
  gfx.fillStyle(0x047857, 1);
  gfx.fillRect(11, 26, 10, 7);

  gfx.fillStyle(0xf8fafc, 1);
  gfx.fillRect(20, 24, 3, 8);

  gfx.fillStyle(0xfcd34d, 1);
  gfx.fillCircle(7, 26, 2.5);
  gfx.fillCircle(25, 26, 2.5);

  gfx.fillStyle(0xfcd34d, 1);
  gfx.fillRoundedRect(10, 7, 12, 11, 4);

  gfx.fillStyle(0x1e293b, 1);
  gfx.fillRect(12, 11, 2, 2);
  gfx.fillRect(18, 11, 2, 2);

  gfx.fillStyle(0xb45309, 1);
  gfx.fillRect(14, 15, 4, 1);

  gfx.fillStyle(0x1c1917, 1);
  gfx.fillRoundedRect(9, 4, 14, 6, 2);

  gfx.generateTexture('camarero', width, height);
  gfx.destroy();
}

function generateCarmenTexture(scene) {
  if (scene.textures.exists('carmen')) return;

  const width = 32;
  const height = 44;
  const gfx = scene.make.graphics({ x: 0, y: 0, add: false });

  // Drop shadow
  gfx.fillStyle(0x000000, 0.35);
  gfx.fillEllipse(16, 40, 22, 8);

  // Shoes & Skirt
  gfx.fillStyle(0x572610, 1);
  gfx.fillRoundedRect(11, 37, 4, 5, 2);
  gfx.fillRoundedRect(17, 37, 4, 5, 2);

  // Orange terracotta market skirt
  gfx.fillStyle(0xc2410c, 1);
  gfx.fillRoundedRect(9, 28, 14, 10, 2);

  // Blouse & yellow striped apron
  gfx.fillStyle(0xfffbeb, 1);
  gfx.fillRoundedRect(8, 16, 16, 13, 3);
  gfx.fillStyle(0xf59e0b, 1);
  gfx.fillRoundedRect(10, 21, 12, 14, 2);

  // Head, red bandana
  gfx.fillStyle(0xfcd34d, 1);
  gfx.fillRoundedRect(10, 7, 12, 11, 4);

  gfx.fillStyle(0x1e293b, 1);
  gfx.fillRect(12, 11, 2, 2);
  gfx.fillRect(18, 11, 2, 2);

  // Red head scarf / bandana
  gfx.fillStyle(0xd97706, 1);
  gfx.fillRoundedRect(8, 3, 16, 6, 3);
  gfx.fillStyle(0xb91c1c, 1);
  gfx.fillCircle(24, 7, 3); // knot

  gfx.generateTexture('carmen', width, height);
  gfx.destroy();
}

function generateSofiaTexture(scene) {
  if (scene.textures.exists('sofia')) return;

  const width = 32;
  const height = 44;
  const gfx = scene.make.graphics({ x: 0, y: 0, add: false });

  // Drop shadow
  gfx.fillStyle(0x000000, 0.35);
  gfx.fillEllipse(16, 40, 22, 8);

  // Sandals
  gfx.fillStyle(0x78350f, 1);
  gfx.fillRect(11, 37, 4, 4);
  gfx.fillRect(17, 37, 4, 4);

  // Light summer sundress (cyan/turquoise)
  gfx.fillStyle(0x06b6d4, 1);
  gfx.fillRoundedRect(9, 18, 14, 19, 3);

  // Head & straw hat with ribbon
  gfx.fillStyle(0xfcd34d, 1);
  gfx.fillRoundedRect(10, 8, 12, 10, 4);

  gfx.fillStyle(0x1e293b, 1);
  gfx.fillRect(12, 12, 2, 2);
  gfx.fillRect(18, 12, 2, 2);

  // Wide brim straw hat
  gfx.fillStyle(0xfde68a, 1);
  gfx.fillEllipse(16, 6, 22, 8);
  gfx.fillStyle(0x0891b2, 1);
  gfx.fillRect(9, 4, 14, 2); // hat ribbon

  gfx.generateTexture('sofia', width, height);
  gfx.destroy();
}

function generateChairTexture(scene) {
  if (scene.textures.exists('chair')) return;

  const width = 28;
  const height = 32;
  const gfx = scene.make.graphics({ x: 0, y: 0, add: false });

  // 1. Soft contact drop shadow on ground
  gfx.fillStyle(0x000000, 0.4);
  gfx.fillEllipse(14, 29, 22, 6);

  // 2. Dark outline for maximum contrast against ground cobblestones
  gfx.fillStyle(0x1e0e04, 1);
  gfx.fillRect(4, 2, 5, 14);
  gfx.fillRect(19, 2, 5, 14);
  gfx.fillRoundedRect(3, 1, 22, 7, 2);
  gfx.fillRect(9, 5, 4, 10);
  gfx.fillRect(15, 5, 4, 10);
  gfx.fillRoundedRect(3, 13, 22, 10, 3);
  gfx.fillRect(5, 19, 4, 11);
  gfx.fillRect(19, 19, 4, 11);
  gfx.fillRect(8, 17, 3, 9);
  gfx.fillRect(17, 17, 3, 9);
  gfx.fillRect(6, 25, 16, 3);

  // 3. Back legs (in shadow)
  gfx.fillStyle(0x451a03, 1);
  gfx.fillRect(9, 18, 2, 8);
  gfx.fillRect(17, 18, 2, 8);

  // 4. Backrest uprights (rich warm teak)
  gfx.fillStyle(0x78350f, 1);
  gfx.fillRect(5, 3, 3, 13);
  gfx.fillRect(20, 3, 3, 13);

  // 5. Backrest slats and top crest
  gfx.fillStyle(0x92400e, 1);
  gfx.fillRoundedRect(4, 2, 20, 5, 2);
  gfx.fillRect(10, 6, 2, 9);
  gfx.fillRect(16, 6, 2, 9);

  // Crest highlight
  gfx.fillStyle(0xd97706, 1);
  gfx.fillRect(6, 3, 16, 2);

  // 6. Seat frame
  gfx.fillStyle(0x5c2b0c, 1);
  gfx.fillRoundedRect(4, 14, 20, 8, 2);

  // 7. Warm amber / golden leather cushion (pops clearly against the ground)
  gfx.fillStyle(0xd97706, 1);
  gfx.fillRoundedRect(5, 15, 18, 6, 2);
  gfx.fillStyle(0xfbbf24, 1);
  gfx.fillRect(6, 15, 16, 2);

  // 8. Front legs & cross rung
  gfx.fillStyle(0x78350f, 1);
  gfx.fillRect(6, 20, 2, 9);
  gfx.fillRect(20, 20, 2, 9);
  gfx.fillRect(7, 26, 14, 2);
  gfx.fillStyle(0xb45309, 1);
  gfx.fillRect(6, 20, 1, 9);
  gfx.fillRect(20, 20, 1, 9);

  gfx.generateTexture('chair', width, height);
  gfx.destroy();
}

function generateUmbrellaTexture(scene) {
  if (scene.textures.exists('umbrella')) return;

  const width = 30;
  const height = 30;
  const gfx = scene.make.graphics({ x: 0, y: 0, add: false });

  // Drop shadow
  gfx.fillStyle(0x000000, 0.3);
  gfx.fillEllipse(15, 27, 20, 5);

  // Canopy dome (vibrant red & yellow striped canopy)
  gfx.fillStyle(0xd97706, 1);
  gfx.fillCircle(15, 14, 12);
  gfx.fillStyle(0xdc2626, 1);
  gfx.slice(15, 14, 12, Phaser.Math.DegToRad(30), Phaser.Math.DegToRad(90), false);
  gfx.fillPath();
  gfx.slice(15, 14, 12, Phaser.Math.DegToRad(150), Phaser.Math.DegToRad(210), false);
  gfx.fillPath();

  // Ferrule tip
  gfx.fillStyle(0xfde68a, 1);
  gfx.fillRect(14, 1, 2, 3);

  // Curved handle
  gfx.lineStyle(2, 0x78350f, 1);
  gfx.lineBetween(15, 14, 15, 25);
  gfx.strokeCircle(13, 25, 2);

  gfx.generateTexture('umbrella', width, height);
  gfx.destroy();
}

function generatePaperTexture(scene) {
  if (scene.textures.exists('paper')) return;

  const width = 20;
  const height = 22;
  const gfx = scene.make.graphics({ x: 0, y: 0, add: false });

  // Drop shadow
  gfx.fillStyle(0x000000, 0.3);
  gfx.fillEllipse(10, 20, 16, 4);

  // White paper sheet with fold
  gfx.fillStyle(0xf8fafc, 1);
  gfx.fillRoundedRect(2, 2, 16, 18, 2);
  gfx.lineStyle(1, 0x94a3b8, 0.8);
  gfx.strokeRoundedRect(2, 2, 16, 18, 2);

  // Text lines
  gfx.fillStyle(0x64748b, 1);
  gfx.fillRect(5, 6, 10, 2);
  gfx.fillRect(5, 10, 10, 2);
  gfx.fillRect(5, 14, 6, 2);

  gfx.generateTexture('paper', width, height);
  gfx.destroy();
}

function generateColdPropsTextures(scene) {
  // 1. Chaqueta (warm winter coat)
  if (!scene.textures.exists('chaqueta')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(12, 22, 18, 5);

    gfx.fillStyle(0x7f1d1d, 1); // warm crimson
    gfx.fillRoundedRect(3, 4, 18, 17, 4);
    gfx.fillStyle(0x450a0a, 1);
    gfx.fillRect(11, 4, 2, 17); // zipper
    gfx.fillStyle(0xf1f5f9, 1);
    gfx.fillRoundedRect(5, 2, 14, 4, 2); // faux fur collar

    gfx.generateTexture('chaqueta', 24, 26);
    gfx.destroy();
  }

  // 2. Bufanda (knitted scarf)
  if (!scene.textures.exists('bufanda')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(12, 16, 16, 4);

    gfx.fillStyle(0xd97706, 1);
    gfx.fillRoundedRect(2, 3, 20, 7, 3);
    gfx.fillStyle(0xb45309, 1);
    gfx.fillRect(6, 3, 3, 7);
    gfx.fillRect(14, 3, 3, 7);
    // hanging tassel
    gfx.fillStyle(0xd97706, 1);
    gfx.fillRect(16, 10, 5, 6);

    gfx.generateTexture('bufanda', 24, 20);
    gfx.destroy();
  }
}

function generateHeatPropsTextures(scene) {
  // Bottle of Water (el agua)
  if (!scene.textures.exists('water_bottle')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(10, 22, 14, 4);

    // Glass bottle
    gfx.fillStyle(0x38bdf8, 0.85);
    gfx.fillRoundedRect(4, 7, 12, 14, 3);
    gfx.fillStyle(0x0284c7, 1);
    gfx.fillRoundedRect(7, 2, 6, 6, 1); // neck & cork
    gfx.fillStyle(0xffffff, 0.7);
    gfx.fillRect(6, 10, 2, 8); // water shine

    gfx.generateTexture('water_bottle', 20, 26);
    gfx.destroy();
  }
}

function generateRainTexture(scene) {
  if (scene.textures.exists('rain_drop')) return;

  const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
  gfx.fillStyle(0x93c5fd, 0.75);
  gfx.fillRoundedRect(0, 0, 2, 14, 1);
  gfx.generateTexture('rain_drop', 2, 14);
  gfx.destroy();
}

function generateWeatherParticleTextures(scene) {
  // 1. Wind leaf particle
  if (!scene.textures.exists('wind_leaf')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0xd97706, 0.85);
    gfx.fillEllipse(4, 4, 7, 4);
    gfx.generateTexture('wind_leaf', 8, 8);
    gfx.destroy();
  }

  // 2. Snowflake particle
  if (!scene.textures.exists('snowflake')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0xffffff, 0.9);
    gfx.fillCircle(3, 3, 3);
    gfx.generateTexture('snowflake', 6, 6);
    gfx.destroy();
  }
}

function generateAdditionalQuestTextures(scene) {
  // 1. Sombrero (Straw Hat)
  if (!scene.textures.exists('sombrero')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(14, 20, 20, 6);
    // Brim
    gfx.fillStyle(0xfde047, 1);
    gfx.fillEllipse(14, 14, 26, 10);
    // Crown
    gfx.fillStyle(0xeab308, 1);
    gfx.fillRoundedRect(8, 5, 12, 10, 3);
    // Ribbon band
    gfx.fillStyle(0xc2410c, 1);
    gfx.fillRect(8, 11, 12, 3);
    gfx.generateTexture('sombrero', 28, 24);
    gfx.destroy();
  }

  // 2. Market Crate (Caja de madera)
  if (!scene.textures.exists('market_crate')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.35);
    gfx.fillEllipse(13, 22, 22, 6);
    // Wooden box body
    gfx.fillStyle(0xb45309, 1);
    gfx.fillRoundedRect(3, 6, 20, 16, 2);
    gfx.fillStyle(0xd97706, 1);
    gfx.fillRect(5, 8, 16, 5);
    gfx.fillRect(5, 15, 16, 5);
    // Goods inside (apples / oranges)
    gfx.fillStyle(0xef4444, 1);
    gfx.fillCircle(8, 6, 3);
    gfx.fillStyle(0xf97316, 1);
    gfx.fillCircle(14, 5, 3);
    gfx.fillStyle(0x84cc16, 1);
    gfx.fillCircle(18, 6, 2.5);
    gfx.generateTexture('market_crate', 26, 26);
    gfx.destroy();
  }

  // 3. Glass of Water (Vaso de agua)
  if (!scene.textures.exists('glass_water')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(10, 22, 14, 4);
    // Glass
    gfx.fillStyle(0x38bdf8, 0.9);
    gfx.fillRoundedRect(4, 6, 12, 16, 2);
    gfx.fillStyle(0xffffff, 0.8);
    gfx.fillRect(6, 8, 2, 12);
    // Lemon slice on rim
    gfx.fillStyle(0xfacc15, 1);
    gfx.fillCircle(14, 6, 3);
    gfx.generateTexture('glass_water', 20, 24);
    gfx.destroy();
  }

  // 4. Flowers (Las flores)
  if (!scene.textures.exists('flowers')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(12, 22, 18, 5);
    // Terracotta flower pot
    gfx.fillStyle(0xc2410c, 1);
    gfx.fillRoundedRect(5, 12, 14, 10, 2);
    // Green leaves
    gfx.fillStyle(0x15803d, 1);
    gfx.fillCircle(9, 10, 4);
    gfx.fillCircle(15, 10, 4);
    // Colorful blossoms
    gfx.fillStyle(0xf43f5e, 1);
    gfx.fillCircle(9, 7, 3);
    gfx.fillStyle(0xfbbf24, 1);
    gfx.fillCircle(15, 6, 3);
    gfx.fillStyle(0x38bdf8, 1);
    gfx.fillCircle(12, 4, 3);
    gfx.generateTexture('flowers', 24, 24);
    gfx.destroy();
  }

  // 5. Citizen NPC (Marco / Elena / Carlos)
  if (!scene.textures.exists('citizen')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.35);
    gfx.fillEllipse(16, 40, 22, 8);
    // Shoes
    gfx.fillStyle(0x1e293b, 1);
    gfx.fillRoundedRect(11, 37, 4, 5, 2);
    gfx.fillRoundedRect(17, 37, 4, 5, 2);
    // Pants (olive)
    gfx.fillStyle(0x365314, 1);
    gfx.fillRoundedRect(9, 28, 14, 10, 2);
    // Shirt / Sweater (teal emerald)
    gfx.fillStyle(0x0f766e, 1);
    gfx.fillRoundedRect(8, 16, 16, 13, 3);
    // Head / Face
    gfx.fillStyle(0xfde047, 1);
    gfx.fillRoundedRect(10, 7, 12, 11, 4);
    // Eyes
    gfx.fillStyle(0x1e293b, 1);
    gfx.fillRect(12, 11, 2, 2);
    gfx.fillRect(18, 11, 2, 2);
    // Hair (warm dark brown)
    gfx.fillStyle(0x451a03, 1);
    gfx.fillRoundedRect(8, 4, 16, 6, 2);
    gfx.generateTexture('citizen', 32, 44);
    gfx.destroy();
  }
}

function generateIceCreamAndSunnyTextures(scene) {
  // 1. Heladero Vendor (Paco el Heladero)
  if (!scene.textures.exists('heladero')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    // Drop shadow
    gfx.fillStyle(0x000000, 0.35);
    gfx.fillEllipse(16, 40, 22, 8);
    // Shoes
    gfx.fillStyle(0x334155, 1);
    gfx.fillRoundedRect(10, 36, 5, 6, 2);
    gfx.fillRoundedRect(17, 36, 5, 6, 2);
    // Trousers (light blue / denim)
    gfx.fillStyle(0x3b82f6, 1);
    gfx.fillRoundedRect(9, 28, 14, 10, 2);
    // Red/White striped vendor polo shirt
    gfx.fillStyle(0xef4444, 1);
    gfx.fillRoundedRect(8, 16, 16, 13, 3);
    gfx.fillStyle(0xffffff, 1);
    gfx.fillRect(11, 16, 3, 13);
    gfx.fillRect(18, 16, 3, 13);
    // White apron
    gfx.fillStyle(0xf8fafc, 1);
    gfx.fillRoundedRect(10, 20, 12, 14, 2);
    // Tiny ice-cream cone embroidered on apron
    gfx.fillStyle(0xd97706, 1);
    gfx.fillTriangle(16, 30, 14, 26, 18, 26);
    gfx.fillStyle(0xf43f5e, 1);
    gfx.fillCircle(16, 25, 2);
    // Head / Face
    gfx.fillStyle(0xfde047, 1);
    gfx.fillRoundedRect(10, 7, 12, 11, 4);
    // Eyes
    gfx.fillStyle(0x1e293b, 1);
    gfx.fillRect(12, 11, 2, 2);
    gfx.fillRect(18, 11, 2, 2);
    // Warm smile
    gfx.fillStyle(0xb45309, 1);
    gfx.fillRect(14, 15, 4, 1);
    // Mustache
    gfx.fillStyle(0x78350f, 1);
    gfx.fillRect(13, 14, 6, 1.5);
    // White vendor / chef cap
    gfx.fillStyle(0xf8fafc, 1);
    gfx.fillRoundedRect(8, 3, 16, 6, 3);
    gfx.fillCircle(16, 3, 4);
    gfx.generateTexture('heladero', 32, 44);
    gfx.destroy();
  }

  // 2. Helado (Ice cream cone with strawberry & vanilla scoops and cherry)
  if (!scene.textures.exists('helado')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    // Golden waffle cone
    gfx.fillStyle(0xd97706, 1);
    gfx.fillTriangle(12, 26, 6, 14, 18, 14);
    // Waffle cross-hatch lines
    gfx.lineStyle(1, 0xb45309, 0.8);
    gfx.lineBetween(8, 17, 14, 23);
    gfx.lineBetween(16, 17, 10, 23);
    // Vanilla scoop
    gfx.fillStyle(0xfef08a, 1);
    gfx.fillCircle(12, 12, 6);
    // Strawberry scoop
    gfx.fillStyle(0xf43f5e, 1);
    gfx.fillCircle(12, 7, 5);
    // Cherry on top
    gfx.fillStyle(0x9f1239, 1);
    gfx.fillCircle(12, 2, 2.5);
    // Cherry stem
    gfx.lineStyle(1, 0x15803d, 1);
    gfx.lineBetween(12, 2, 14, 0);
    gfx.generateTexture('helado', 24, 28);
    gfx.destroy();
  }

  // 3. Ice Cream Cart (Carrito de helados)
  if (!scene.textures.exists('ice_cream_cart')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    // Drop shadow
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(18, 34, 30, 8);
    // Wooden wheels
    gfx.fillStyle(0x78350f, 1);
    gfx.fillCircle(9, 30, 5);
    gfx.fillCircle(27, 30, 5);
    gfx.fillStyle(0xfef08a, 1);
    gfx.fillCircle(9, 30, 2);
    gfx.fillCircle(27, 30, 2);
    // Cart body (pastel teal/cyan)
    gfx.fillStyle(0x38bdf8, 1);
    gfx.fillRoundedRect(4, 16, 28, 14, 3);
    // Cart ice-cream freezer lid (metallic silver)
    gfx.fillStyle(0xe2e8f0, 1);
    gfx.fillRoundedRect(5, 14, 26, 4, 1);
    gfx.fillStyle(0x64748b, 1);
    gfx.fillCircle(12, 14, 1.5);
    gfx.fillCircle(24, 14, 1.5);
    // Canopy poles
    gfx.lineStyle(1.5, 0x94a3b8, 1);
    gfx.lineBetween(6, 14, 6, 7);
    gfx.lineBetween(30, 14, 30, 7);
    // Striped pastel canopy (pink & white stripes)
    gfx.fillStyle(0xf43f5e, 1);
    gfx.fillRoundedRect(4, 3, 28, 6, 2);
    gfx.fillStyle(0xffffff, 1);
    gfx.fillRect(8, 3, 4, 6);
    gfx.fillRect(16, 3, 4, 6);
    gfx.fillRect(24, 3, 4, 6);
    gfx.generateTexture('ice_cream_cart', 36, 36);
    gfx.destroy();
  }

  // 4. Bicicleta (Vintage plaza bicycle)
  if (!scene.textures.exists('bicicleta')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    // Wheels
    gfx.lineStyle(1.5, 0x334155, 1);
    gfx.strokeCircle(6, 16, 5);
    gfx.strokeCircle(22, 16, 5);
    // Frame (vintage red)
    gfx.lineStyle(2, 0xdc2626, 1);
    gfx.lineBetween(6, 16, 14, 16);
    gfx.lineBetween(14, 16, 18, 9);
    gfx.lineBetween(18, 9, 22, 16);
    gfx.lineBetween(14, 16, 11, 9);
    gfx.lineBetween(11, 9, 6, 16);
    // Handlebars & seat
    gfx.lineStyle(1.5, 0x1e293b, 1);
    gfx.lineBetween(18, 9, 17, 6);
    gfx.lineBetween(15, 6, 19, 6); // Handlebars
    gfx.fillStyle(0x78350f, 1);
    gfx.fillRect(10, 7, 4, 2); // Seat
    gfx.generateTexture('bicicleta', 28, 22);
    gfx.destroy();
  }

  // 5. Cesta (Wicker picnic basket)
  if (!scene.textures.exists('cesta')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    // Basket body
    gfx.fillStyle(0xd97706, 1);
    gfx.fillRoundedRect(3, 8, 16, 10, 2);
    // Woven pattern
    gfx.lineStyle(1, 0xb45309, 0.7);
    gfx.lineBetween(3, 13, 19, 13);
    gfx.lineBetween(8, 8, 8, 18);
    gfx.lineBetween(14, 8, 14, 18);
    // Handle
    gfx.lineStyle(1.5, 0x92400e, 1);
    gfx.strokeCircle(11, 7, 5);
    gfx.fillStyle(0xffffff, 1);
    // Red-checkered napkin peeking out
    gfx.fillStyle(0xef4444, 1);
    gfx.fillRect(12, 7, 5, 3);
    gfx.generateTexture('cesta', 22, 20);
    gfx.destroy();
  }
}

function generateExplorationTextures(scene) {
  // --- RAIN OBJECTS ---
  // 1. Mesa (Café wooden table)
  if (!scene.textures.exists('mesa')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.35);
    gfx.fillEllipse(14, 25, 20, 6);
    // Central wrought-iron pedestal
    gfx.fillStyle(0x334155, 1);
    gfx.fillRect(13, 14, 3, 11);
    gfx.lineStyle(2, 0x1e293b, 1);
    gfx.lineBetween(8, 25, 20, 25);
    // Round table top
    gfx.fillStyle(0xb45309, 1);
    gfx.fillEllipse(14, 12, 24, 10);
    gfx.fillStyle(0xd97706, 1);
    gfx.fillEllipse(14, 11, 20, 8);
    gfx.generateTexture('mesa', 28, 28);
    gfx.destroy();
  }

  // 1b. Poncho (Bright hooded waterproof rain poncho)
  if (!scene.textures.exists('poncho')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    // Ground shadow
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(14, 25, 20, 5);
    // Poncho body (flared trapezoid cape, vivid waterproof cyan/blue)
    gfx.fillStyle(0x0284c7, 1);
    gfx.beginPath();
    gfx.moveTo(14, 7);
    gfx.lineTo(26, 23);
    gfx.lineTo(2, 23);
    gfx.closePath();
    gfx.fillPath();

    // Darker center fold / pleat
    gfx.fillStyle(0x0369a1, 1);
    gfx.beginPath();
    gfx.moveTo(14, 7);
    gfx.lineTo(17, 23);
    gfx.lineTo(11, 23);
    gfx.closePath();
    gfx.fillPath();

    // Hood
    gfx.fillStyle(0x38bdf8, 1);
    gfx.fillRoundedRect(9, 1, 10, 9, 3);
    // Face opening / collar shadow
    gfx.fillStyle(0x0284c7, 1);
    gfx.fillEllipse(14, 6, 6, 4);

    // Drawstring cords
    gfx.lineStyle(1.5, 0xffffff, 0.95);
    gfx.lineBetween(12, 9, 11, 15);
    gfx.lineBetween(16, 9, 17, 15);

    // Subtle rain shine highlight
    gfx.fillStyle(0xe0f2fe, 0.8);
    gfx.fillRoundedRect(6, 12, 4, 3, 1);

    gfx.generateTexture('poncho', 28, 28);
    gfx.destroy();
  }

  // 2. Impermeable (Yellow hooded raincoat)
  if (!scene.textures.exists('impermeable')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(13, 25, 18, 5);
    // Yellow coat body
    gfx.fillStyle(0xfacc15, 1);
    gfx.fillRoundedRect(4, 9, 18, 16, 3);
    // Hood
    gfx.fillStyle(0xeab308, 1);
    gfx.fillRoundedRect(7, 3, 12, 8, 3);
    // Toggle buttons
    gfx.fillStyle(0x78350f, 1);
    gfx.fillCircle(13, 12, 1.5);
    gfx.fillCircle(13, 17, 1.5);
    gfx.fillCircle(13, 22, 1.5);
    gfx.generateTexture('impermeable', 26, 28);
    gfx.destroy();
  }

  // 3. Botas (Pair of yellow rain boots)
  if (!scene.textures.exists('botas')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(12, 21, 20, 5);
    // Left boot
    gfx.fillStyle(0xfacc15, 1);
    gfx.fillRect(5, 6, 6, 11);
    gfx.fillRoundedRect(3, 14, 9, 6, 2);
    gfx.fillStyle(0x0f172a, 1);
    gfx.fillRect(3, 18, 9, 2); // Sole
    // Right boot
    gfx.fillStyle(0xfacc15, 1);
    gfx.fillRect(13, 6, 6, 11);
    gfx.fillRoundedRect(11, 14, 9, 6, 2);
    gfx.fillStyle(0x0f172a, 1);
    gfx.fillRect(11, 18, 9, 2); // Sole
    // Top reflective rim
    gfx.fillStyle(0xf8fafc, 0.9);
    gfx.fillRect(5, 6, 6, 2);
    gfx.fillRect(13, 6, 6, 2);
    gfx.generateTexture('botas', 24, 24);
    gfx.destroy();
  }

  // 4. Mochila (Travel backpack)
  if (!scene.textures.exists('mochila')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(12, 23, 18, 5);
    // Backpack body (royal blue)
    gfx.fillStyle(0x2563eb, 1);
    gfx.fillRoundedRect(4, 5, 16, 18, 3);
    // Front pocket
    gfx.fillStyle(0x0284c7, 1);
    gfx.fillRoundedRect(6, 13, 12, 8, 2);
    // Zipper & buckle accents
    gfx.fillStyle(0xfbbf24, 1);
    gfx.fillRect(7, 13, 10, 1.5);
    gfx.fillCircle(12, 17, 1.5);
    // Top carrying handle
    gfx.lineStyle(1.5, 0x1e293b, 1);
    gfx.strokeCircle(12, 5, 3);
    gfx.generateTexture('mochila', 24, 26);
    gfx.destroy();
  }

  // 5. Bolsa (Canvas shopping bag)
  if (!scene.textures.exists('bolsa')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(11, 21, 16, 4);
    // Bag body (emerald green canvas)
    gfx.fillStyle(0x059669, 1);
    gfx.fillRoundedRect(4, 8, 14, 13, 2);
    gfx.fillStyle(0x10b981, 1);
    gfx.fillRect(6, 10, 10, 9);
    // Handles
    gfx.lineStyle(1.5, 0x064e3b, 1);
    gfx.strokeRoundedRect(7, 2, 8, 8, 3);
    gfx.generateTexture('bolsa', 22, 24);
    gfx.destroy();
  }

  // --- WIND OBJECTS ---
  // 6. Hoja (Autumn wind-blown leaf)
  if (!scene.textures.exists('hoja')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.25);
    gfx.fillEllipse(10, 17, 14, 4);
    // Amber/orange leaf body
    gfx.fillStyle(0xd97706, 1);
    gfx.fillEllipse(10, 9, 14, 8);
    gfx.fillStyle(0xb45309, 1);
    gfx.lineStyle(1, 0x78350f, 0.9);
    gfx.lineBetween(4, 9, 16, 9);
    gfx.lineBetween(10, 9, 10, 17); // stem
    gfx.generateTexture('hoja', 20, 20);
    gfx.destroy();
  }

  // 7. Periódico (Folded newspaper)
  if (!scene.textures.exists('periodico')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(12, 17, 18, 4);
    // Newspaper pages
    gfx.fillStyle(0xf8fafc, 1);
    gfx.fillRoundedRect(3, 3, 18, 14, 2);
    // Front page headline
    gfx.fillStyle(0x0f172a, 1);
    gfx.fillRect(5, 5, 14, 3);
    // Text columns
    gfx.fillStyle(0x64748b, 1);
    gfx.fillRect(5, 10, 6, 5);
    gfx.fillRect(13, 10, 6, 5);
    gfx.generateTexture('periodico', 24, 20);
    gfx.destroy();
  }

  // 8. Servilleta (Folded white café napkin)
  if (!scene.textures.exists('servilleta')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.25);
    gfx.fillEllipse(10, 16, 14, 4);
    // White folded napkin
    gfx.fillStyle(0xf1f5f9, 1);
    gfx.fillTriangle(3, 15, 10, 3, 17, 15);
    gfx.lineStyle(1, 0xcfd8dc, 1);
    gfx.lineBetween(10, 3, 10, 15);
    gfx.generateTexture('servilleta', 20, 20);
    gfx.destroy();
  }

  // 9. Cometa (Diamond kite with ribbon tail)
  if (!scene.textures.exists('cometa')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    // Diamond kite facets
    gfx.fillStyle(0xef4444, 1);
    gfx.fillTriangle(13, 2, 4, 12, 13, 20);
    gfx.fillStyle(0x06b6d4, 1);
    gfx.fillTriangle(13, 2, 22, 12, 13, 20);
    // Spar cross
    gfx.lineStyle(1, 0xfde047, 1);
    gfx.lineBetween(13, 2, 13, 20);
    gfx.lineBetween(4, 12, 22, 12);
    // Tail with bows
    gfx.lineStyle(1, 0x64748b, 0.9);
    gfx.lineBetween(13, 20, 11, 28);
    gfx.fillStyle(0xf59e0b, 1);
    gfx.fillCircle(12, 24, 2);
    gfx.fillStyle(0xec4899, 1);
    gfx.fillCircle(11, 28, 2);
    gfx.generateTexture('cometa', 26, 30);
    gfx.destroy();
  }

  // 10. Bandera (Town plaza flag on pole)
  if (!scene.textures.exists('bandera')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    // Wooden pole
    gfx.fillStyle(0x78350f, 1);
    gfx.fillRect(4, 2, 2, 26);
    // Gold finial
    gfx.fillStyle(0xfbbf24, 1);
    gfx.fillCircle(5, 3, 2);
    // Spanish flag (Red - Yellow - Red)
    gfx.fillStyle(0xdc2626, 1);
    gfx.fillRect(6, 4, 16, 4);
    gfx.fillStyle(0xfbbf24, 1);
    gfx.fillRect(6, 8, 16, 5);
    gfx.fillStyle(0xdc2626, 1);
    gfx.fillRect(6, 13, 16, 4);
    gfx.generateTexture('bandera', 26, 30);
    gfx.destroy();
  }

  // --- COLD OBJECTS ---
  // 11. Guantes (Pair of red wool mittens)
  if (!scene.textures.exists('guantes')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(12, 19, 18, 4);
    // Left mitten
    gfx.fillStyle(0xb91c1c, 1);
    gfx.fillRoundedRect(3, 6, 8, 11, 3);
    gfx.fillCircle(4, 11, 2); // thumb
    gfx.fillStyle(0xf8fafc, 1);
    gfx.fillRoundedRect(3, 15, 8, 3, 1); // wool cuff
    // Right mitten
    gfx.fillStyle(0xb91c1c, 1);
    gfx.fillRoundedRect(13, 6, 8, 11, 3);
    gfx.fillCircle(20, 11, 2); // thumb
    gfx.fillStyle(0xf8fafc, 1);
    gfx.fillRoundedRect(13, 15, 8, 3, 1); // wool cuff
    gfx.generateTexture('guantes', 24, 22);
    gfx.destroy();
  }

  // 12. Gorro (Winter beanie with pom-pom)
  if (!scene.textures.exists('gorro')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(12, 21, 18, 4);
    // Beanie dome (teal / cyan)
    gfx.fillStyle(0x0284c7, 1);
    gfx.fillRoundedRect(4, 7, 16, 11, 4);
    // Folded brim
    gfx.fillStyle(0x0369a1, 1);
    gfx.fillRoundedRect(3, 15, 18, 4, 1);
    // Fluffy white pom-pom
    gfx.fillStyle(0xf8fafc, 1);
    gfx.fillCircle(12, 5, 4);
    gfx.generateTexture('gorro', 24, 24);
    gfx.destroy();
  }

  // 13. Abrigo (Long heavy winter overcoat)
  if (!scene.textures.exists('abrigo')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.35);
    gfx.fillEllipse(13, 27, 20, 5);
    // Overcoat body (slate charcoal)
    gfx.fillStyle(0x1e293b, 1);
    gfx.fillRoundedRect(4, 4, 18, 23, 3);
    // Lapels
    gfx.fillStyle(0x334155, 1);
    gfx.fillTriangle(4, 4, 13, 14, 4, 14);
    gfx.fillTriangle(22, 4, 13, 14, 22, 14);
    // Brass buttons
    gfx.fillStyle(0xfbbf24, 1);
    gfx.fillCircle(10, 16, 1.5);
    gfx.fillCircle(16, 16, 1.5);
    gfx.fillCircle(10, 21, 1.5);
    gfx.fillCircle(16, 21, 1.5);
    gfx.generateTexture('abrigo', 26, 30);
    gfx.destroy();
  }

  // 14. Manta (Folded plaid wool blanket)
  if (!scene.textures.exists('manta')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(13, 19, 20, 4);
    // Folded blanket (warm crimson plaid)
    gfx.fillStyle(0x991b1b, 1);
    gfx.fillRoundedRect(3, 5, 20, 13, 3);
    // Plaid lines
    gfx.fillStyle(0x15803d, 1);
    gfx.fillRect(3, 9, 20, 2);
    gfx.fillRect(10, 5, 2, 13);
    gfx.fillStyle(0xfde047, 1);
    gfx.fillRect(3, 13, 20, 1);
    // Fringe tassels
    gfx.lineStyle(1, 0xfde047, 0.9);
    for (let x = 4; x <= 22; x += 3) {
      gfx.lineBetween(x, 18, x, 21);
    }
    gfx.generateTexture('manta', 26, 22);
    gfx.destroy();
  }

  // 15. Suéter (Cozy knitted sweater)
  if (!scene.textures.exists('sueter')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(13, 21, 20, 4);
    // Knit sweater body (forest green)
    gfx.fillStyle(0x166534, 1);
    gfx.fillRoundedRect(4, 5, 18, 15, 3);
    // Nordic decorative stripe across chest
    gfx.fillStyle(0xfef08a, 1);
    gfx.fillRect(4, 10, 18, 3);
    gfx.fillStyle(0x991b1b, 1);
    gfx.fillRect(6, 11, 3, 1);
    gfx.fillRect(11, 11, 3, 1);
    gfx.fillRect(16, 11, 3, 1);
    // Collar & cuffs
    gfx.fillStyle(0x14532d, 1);
    gfx.fillRect(9, 4, 8, 2);
    gfx.generateTexture('sueter', 26, 24);
    gfx.destroy();
  }

  // --- HEAT OBJECTS ---
  // 16. Botella (Chilled mineral water bottle)
  if (!scene.textures.exists('botella')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(10, 23, 14, 4);
    // Translucent blue bottle body
    gfx.fillStyle(0x38bdf8, 0.9);
    gfx.fillRoundedRect(5, 7, 10, 16, 2);
    // White label band
    gfx.fillStyle(0xffffff, 0.95);
    gfx.fillRect(5, 12, 10, 5);
    // Blue cap
    gfx.fillStyle(0x0284c7, 1);
    gfx.fillRect(7, 3, 6, 4);
    // Water shine highlight
    gfx.fillStyle(0xffffff, 0.8);
    gfx.fillRect(6, 8, 1.5, 9);
    gfx.generateTexture('botella', 20, 26);
    gfx.destroy();
  }

  // 17. Abanico (Traditional Spanish folding hand fan)
  if (!scene.textures.exists('abanico')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(13, 19, 20, 4);
    // Semicircular fan canopy (vibrant Spanish red & gold)
    gfx.fillStyle(0xdc2626, 1);
    gfx.slice(13, 18, 12, Phaser.Math.DegToRad(200), Phaser.Math.DegToRad(340), false);
    gfx.fillPath();
    // Gold lace rim
    gfx.lineStyle(1.5, 0xfbbf24, 1);
    gfx.beginPath();
    gfx.arc(13, 18, 12, Phaser.Math.DegToRad(200), Phaser.Math.DegToRad(340), false);
    gfx.strokePath();
    // Wooden ribs
    gfx.lineStyle(1, 0x78350f, 0.8);
    gfx.lineBetween(13, 18, 5, 10);
    gfx.lineBetween(13, 18, 9, 7);
    gfx.lineBetween(13, 18, 13, 6);
    gfx.lineBetween(13, 18, 17, 7);
    gfx.lineBetween(13, 18, 21, 10);
    // Pivot brass rivet
    gfx.fillStyle(0xfbbf24, 1);
    gfx.fillCircle(13, 18, 1.5);
    gfx.generateTexture('abanico', 26, 22);
    gfx.destroy();
  }

  // 18. Gorra (Summer sun cap with visor)
  if (!scene.textures.exists('gorra')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(12, 17, 18, 4);
    // Cap dome (vibrant crimson)
    gfx.fillStyle(0xdc2626, 1);
    gfx.fillRoundedRect(6, 4, 12, 9, 3);
    // Visor brim
    gfx.fillStyle(0xb91c1c, 1);
    gfx.fillEllipse(14, 13, 14, 4);
    // Top button
    gfx.fillStyle(0xfbbf24, 1);
    gfx.fillCircle(12, 4, 1.5);
    gfx.generateTexture('gorra', 24, 20);
    gfx.destroy();
  }

  // 19. Gafas de Sol (Dark sunglasses)
  if (!scene.textures.exists('gafas_sol')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(12, 13, 18, 3);
    // Black frames
    gfx.fillStyle(0x0f172a, 1);
    gfx.fillRoundedRect(3, 4, 8, 7, 2);
    gfx.fillRoundedRect(13, 4, 8, 7, 2);
    // Bridge & side temples
    gfx.fillRect(10, 5, 4, 2);
    gfx.fillRect(1, 5, 2, 2);
    gfx.fillRect(21, 5, 2, 2);
    // Dark polarized lenses with cyan glare
    gfx.fillStyle(0x1e293b, 1);
    gfx.fillRect(4, 5, 6, 5);
    gfx.fillRect(14, 5, 6, 5);
    gfx.fillStyle(0x38bdf8, 0.7);
    gfx.fillRect(5, 6, 2, 3);
    gfx.fillRect(15, 6, 2, 3);
    gfx.generateTexture('gafas_sol', 24, 16);
    gfx.destroy();
  }

  // 20. Toalla (Folded striped cooling towel)
  if (!scene.textures.exists('toalla')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(13, 19, 20, 4);
    // Folded towel (cyan and white stripes)
    gfx.fillStyle(0x06b6d4, 1);
    gfx.fillRoundedRect(4, 5, 18, 13, 3);
    gfx.fillStyle(0xffffff, 1);
    gfx.fillRect(4, 8, 18, 2.5);
    gfx.fillRect(4, 13, 18, 2.5);
    gfx.generateTexture('toalla', 26, 22);
    gfx.destroy();
  }

  // --- SUNNY OBJECTS ---
  // 21. Banco (Wooden plaza bench)
  if (!scene.textures.exists('banco')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.35);
    gfx.fillEllipse(16, 21, 26, 5);
    // Wrought iron legs and arms
    gfx.fillStyle(0x1e293b, 1);
    gfx.fillRect(5, 10, 2, 11);
    gfx.fillRect(25, 10, 2, 11);
    // Wooden slats
    gfx.fillStyle(0x78350f, 1);
    gfx.fillRoundedRect(3, 7, 26, 4, 1);
    gfx.fillRoundedRect(3, 13, 26, 5, 1);
    gfx.fillStyle(0x92400e, 1);
    gfx.fillRect(4, 8, 24, 2);
    gfx.fillRect(4, 14, 24, 2);
    gfx.generateTexture('banco', 32, 24);
    gfx.destroy();
  }

  // 22. Pelota (Striped beach ball)
  if (!scene.textures.exists('pelota')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(11, 19, 16, 4);
    // Base circle
    gfx.fillStyle(0xf8fafc, 1);
    gfx.fillCircle(11, 10, 8);
    // Colored panels (red & cyan & yellow)
    gfx.fillStyle(0xef4444, 1);
    gfx.slice(11, 10, 8, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(90), false);
    gfx.fillPath();
    gfx.fillStyle(0x0284c7, 1);
    gfx.slice(11, 10, 8, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(270), false);
    gfx.fillPath();
    gfx.fillStyle(0xfbbf24, 1);
    gfx.fillCircle(11, 10, 2.5);
    gfx.generateTexture('pelota', 22, 22);
    gfx.destroy();
  }

  // 22b. Balón (Classic black & white leather football / soccer ball)
  if (!scene.textures.exists('balon')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    // Ground drop shadow
    gfx.fillStyle(0x000000, 0.35);
    gfx.fillEllipse(11, 20, 16, 4);

    // Outer leather white sphere
    gfx.fillStyle(0xf8fafc, 1);
    gfx.fillCircle(11, 11, 9);
    gfx.lineStyle(1, 0x334155, 0.9);
    gfx.strokeCircle(11, 11, 9);

    // Center black pentagon patch
    gfx.fillStyle(0x0f172a, 1);
    gfx.beginPath();
    const cx = 11;
    const cy = 11;
    const r = 3.8;
    for (let i = 0; i < 5; i++) {
      const a = (i * 72 - 90) * (Math.PI / 180);
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * r;
      if (i === 0) gfx.moveTo(px, py);
      else gfx.lineTo(px, py);
    }
    gfx.closePath();
    gfx.fillPath();

    // 5 outer edge patches & seam lines
    gfx.lineStyle(1, 0x1e293b, 0.85);
    for (let i = 0; i < 5; i++) {
      const a = (i * 72 - 90) * (Math.PI / 180);
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * r;
      const ex = cx + Math.cos(a) * 9;
      const ey = cy + Math.sin(a) * 9;
      gfx.lineBetween(px, py, ex, ey);

      // Edge dark patches
      gfx.fillStyle(0x0f172a, 0.95);
      const edgeA1 = a - 0.28;
      const edgeA2 = a + 0.28;
      gfx.beginPath();
      gfx.moveTo(ex, ey);
      gfx.lineTo(cx + Math.cos(edgeA1) * 9, cy + Math.sin(edgeA1) * 9);
      gfx.lineTo(cx + Math.cos(a) * 6.5, cy + Math.sin(a) * 6.5);
      gfx.lineTo(cx + Math.cos(edgeA2) * 9, cy + Math.sin(edgeA2) * 9);
      gfx.closePath();
      gfx.fillPath();
    }

    // Specular shine highlight
    gfx.fillStyle(0xffffff, 0.65);
    gfx.fillCircle(8, 8, 2);

    gfx.generateTexture('balon', 22, 22);
    gfx.destroy();
  }

  // 23. Cámara (Vintage tourist camera)
  if (!scene.textures.exists('camara')) {
    const gfx = scene.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0x000000, 0.3);
    gfx.fillEllipse(12, 17, 18, 4);
    // Camera body (black leatherette with silver top)
    gfx.fillStyle(0x1e293b, 1);
    gfx.fillRoundedRect(3, 5, 18, 12, 2);
    gfx.fillStyle(0x94a3b8, 1);
    gfx.fillRoundedRect(3, 5, 18, 4, 1);
    // Shutter button & flash
    gfx.fillStyle(0xf8fafc, 1);
    gfx.fillRect(5, 3, 3, 2);
    gfx.fillStyle(0xf59e0b, 1);
    gfx.fillRect(16, 4, 3, 2);
    // Lens
    gfx.fillStyle(0x0f172a, 1);
    gfx.fillCircle(12, 11, 4.5);
    gfx.fillStyle(0x38bdf8, 1);
    gfx.fillCircle(12, 11, 2.5);
    gfx.fillStyle(0xffffff, 0.8);
    gfx.fillCircle(11, 10, 1);
    gfx.generateTexture('camara', 24, 20);
    gfx.destroy();
  }
}

