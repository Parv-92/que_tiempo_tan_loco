/**
 * Collision Geometry and Layout for Madrid Plaza Scene
 * Spanish Weather Exploration Game — "¡Qué Tiempo Tan Loco!"
 *
 * Separate, modular collision definitions tuned to match the static
 * plaza_sunny.png scenery while keeping generous walkable routes.
 */

export const PLAZA_OBSTACLES = [
  // --- NORTH FACADES & BUILDINGS ---
  {
    id: 'north_facade_left',
    description: 'Northern residential buildings (west of center arch)',
    x: 0,
    y: 0,
    width: 610,
    height: 185
  },
  {
    id: 'north_facade_center_arch',
    description: 'Main central municipal archway wall',
    x: 610,
    y: 0,
    width: 65,
    height: 190
  },
  {
    id: 'north_facade_right',
    description: 'Northern buildings & café wall (east of center arch)',
    x: 675,
    y: 0,
    width: 605,
    height: 185
  },

  // --- WEST PERIMETER & MARKET SCENERY ---
  {
    id: 'west_perimeter_wall',
    description: 'West perimeter townhouses',
    x: 0,
    y: 185,
    width: 75,
    height: 335
  },
  {
    id: 'market_stall',
    description: 'Striped market produce stand and crates',
    x: 85,
    y: 205,
    width: 135,
    height: 125
  },
  {
    id: 'market_pergola',
    description: 'Small flower pergola south of market stall',
    x: 80,
    y: 335,
    width: 90,
    height: 65
  },
  {
    id: 'west_courtyard_trees',
    description: 'Planter and tree on west lower walkway',
    x: 180,
    y: 520,
    width: 65,
    height: 55
  },

  // --- CENTRAL FOUNTAIN ---
  // Divided into a main basin and subtle steps to give generous, circular clearance
  {
    id: 'central_fountain_basin',
    description: 'Central plaza stone fountain basin',
    x: 574,
    y: 326,
    width: 132,
    height: 86
  },
  {
    id: 'central_fountain_step_top',
    description: 'Fountain upper decorative flower rim',
    x: 595,
    y: 312,
    width: 90,
    height: 16
  },
  {
    id: 'central_fountain_step_bottom',
    description: 'Fountain lower decorative flower rim',
    x: 595,
    y: 410,
    width: 90,
    height: 16
  },

  // --- EAST PERIMETER & CAFÉ SCENERY ---
  {
    id: 'cafe_tables_parasols',
    description: 'Café outdoor round tables and parasols terrace',
    x: 885,
    y: 225,
    width: 130,
    height: 80
  },
  {
    id: 'east_pergola_terrace',
    description: 'Raised stone terrace with wooden pergola on the east',
    x: 1040,
    y: 340,
    width: 240,
    height: 180
  },
  {
    id: 'east_garden_planter',
    description: 'Tree and flower planter on east plaza esplanade',
    x: 915,
    y: 440,
    width: 95,
    height: 80
  },
  {
    id: 'east_perimeter_houses',
    description: 'East perimeter houses and walls',
    x: 1195,
    y: 185,
    width: 85,
    height: 400
  },

  // --- SOUTH ROOFTOPS, STAIRS & BALUSTRADES ---
  {
    id: 'southwest_rooftops',
    description: 'Terracotta roofs on southwest corner',
    x: 0,
    y: 520,
    width: 200,
    height: 200
  },
  {
    id: 'south_balustrade_left',
    description: 'Stone balustrade with cypress trees (west of stairs)',
    x: 390,
    y: 585,
    width: 170,
    height: 85
  },
  {
    id: 'south_balustrade_right',
    description: 'Stone balustrade with cypress trees (east of stairs)',
    x: 720,
    y: 585,
    width: 170,
    height: 85
  },
  {
    id: 'southeast_rooftops',
    description: 'Terracotta roofs on southeast corner',
    x: 860,
    y: 590,
    width: 420,
    height: 130
  },
  {
    id: 'south_gate_boundary',
    description: 'Bottom stair gateway preventing exit into lower city',
    x: 560,
    y: 690,
    width: 160,
    height: 30
  }
];

/**
 * Creates static Arcade physics bodies in the given Phaser scene
 * based on the structured collision definitions.
 *
 * @param {Phaser.Scene} scene
 * @returns {Phaser.Physics.Arcade.StaticGroup}
 */
export function createPlazaColliders(scene) {
  const obstaclesGroup = scene.physics.add.staticGroup();

  PLAZA_OBSTACLES.forEach((obs) => {
    // Create an invisible static rectangle obstacle
    const zone = scene.add.zone(
      obs.x + obs.width / 2,
      obs.y + obs.height / 2,
      obs.width,
      obs.height
    );
    scene.physics.add.existing(zone, true); // true = static body
    obstaclesGroup.add(zone);
  });

  return obstaclesGroup;
}
