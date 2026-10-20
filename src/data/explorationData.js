/**
 * Everyday In-Game Exploration Objects per Weather Type
 * Spanish Weather Exploration Game — "¡Qué Tiempo Tan Loco!"
 *
 * Each category contains at least 7 distinct, non-overlapping everyday objects
 * placed in reachable, walkable areas of the Madrid plaza map.
 */

export const EXPLORATION_OBJECTS_DATA = {
  rain: [
    {
      id: 'rain_paraguas',
      weather: 'rain',
      texture: 'umbrella',
      x: 675,
      y: 420,
      es: 'el paraguas',
      en: 'umbrella',
      exampleEs: '«Llevo el paraguas rojo para no mojarme con la lluvia.»',
      exampleEn: '"I carry the red umbrella to not get wet from the rain."'
    },
    {
      id: 'rain_silla',
      weather: 'rain',
      texture: 'chair',
      x: 510,
      y: 440,
      es: 'la silla',
      en: 'chair',
      exampleEs: '«Movemos la silla bajo el toldo de la terraza.»',
      exampleEn: '"We move the chair under the terrace awning."'
    },
    {
      id: 'rain_poncho',
      weather: 'rain',
      texture: 'poncho',
      x: 885,
      y: 380,
      es: 'el poncho',
      en: 'rain poncho',
      exampleEs: '«Me pongo el poncho impermeable para no mojarme con la lluvia.»',
      exampleEn: '"I put on the waterproof rain poncho so I do not get wet in the rain."'
    },
    {
      id: 'rain_impermeable',
      weather: 'rain',
      texture: 'impermeable',
      x: 680,
      y: 250,
      es: 'el impermeable',
      en: 'raincoat',
      exampleEs: '«El impermeable amarillo nos protege del agua.»',
      exampleEn: '"The yellow raincoat protects us from the water."'
    },
    {
      id: 'rain_botas',
      weather: 'rain',
      texture: 'botas',
      x: 690,
      y: 350,
      es: 'las botas',
      en: 'boots',
      exampleEs: '«Me pongo las botas para pisar los charcos de agua.»',
      exampleEn: '"I put on boots to step in the puddles of water."'
    },
    {
      id: 'rain_mochila',
      weather: 'rain',
      texture: 'mochila',
      x: 565,
      y: 240,
      es: 'la mochila',
      en: 'backpack',
      exampleEs: '«Guardo mis libros secos dentro de la mochila.»',
      exampleEn: '"I keep my books dry inside the backpack."'
    },
    {
      id: 'rain_bolsa',
      weather: 'rain',
      texture: 'bolsa',
      x: 245,
      y: 320,
      es: 'la bolsa',
      en: 'bag',
      exampleEs: '«Llevo la fruta en la bolsa del mercado.»',
      exampleEn: '"I carry the fruit in the market bag."'
    }
  ],
  wind: [
    {
      id: 'wind_papel',
      weather: 'wind',
      texture: 'paper',
      x: 520,
      y: 360,
      es: 'el papel',
      en: 'paper',
      exampleEs: '«El viento fuerte levanta el papel por la plaza.»',
      exampleEn: '"The strong wind lifts the paper across the plaza."'
    },
    {
      id: 'wind_sombrero',
      weather: 'wind',
      texture: 'sombrero',
      x: 750,
      y: 470,
      es: 'el sombrero',
      en: 'hat',
      exampleEs: '«Don Mateo sujeta su sombrero para que no vuele.»',
      exampleEn: '"Don Mateo holds his hat so it does not fly away."'
    },
    {
      id: 'wind_hoja',
      weather: 'wind',
      texture: 'hoja',
      x: 610,
      y: 410,
      es: 'la hoja',
      en: 'leaf',
      exampleEs: '«La hoja dorada cae del árbol con la brisa.»',
      exampleEn: '"The golden leaf falls from the tree with the breeze."'
    },
    {
      id: 'wind_periodico',
      weather: 'wind',
      texture: 'periodico',
      x: 430,
      y: 245,
      es: 'el periódico',
      en: 'newspaper',
      exampleEs: '«Compro el periódico diario en el quiosco de la plaza.»',
      exampleEn: '"I buy the daily newspaper at the plaza newsstand."'
    },
    {
      id: 'wind_servilleta',
      weather: 'wind',
      texture: 'servilleta',
      x: 545,
      y: 425,
      es: 'la servilleta',
      en: 'napkin',
      exampleEs: '«La servilleta de papel vuela de la mesa del café.»',
      exampleEn: '"The paper napkin flies off the café table."'
    },
    {
      id: 'wind_cometa',
      weather: 'wind',
      texture: 'cometa',
      x: 670,
      y: 560,
      es: 'la cometa',
      en: 'kite',
      exampleEs: '«Los niños vuelan la cometa de colores con el viento.»',
      exampleEn: '"The children fly the colorful kite with the wind."'
    },
    {
      id: 'wind_bandera',
      weather: 'wind',
      texture: 'bandera',
      x: 615,
      y: 230,
      es: 'la bandera',
      en: 'flag',
      exampleEs: '«La bandera ondea con orgullo en el mástil de la plaza.»',
      exampleEn: '"The flag waves proudly on the plaza mast."'
    }
  ],
  cold: [
    {
      id: 'cold_chaqueta',
      weather: 'cold',
      texture: 'chaqueta',
      x: 480,
      y: 480,
      es: 'la chaqueta',
      en: 'jacket',
      exampleEs: '«Me pongo la chaqueta porque hace mucho frío.»',
      exampleEn: '"I put on the jacket because it is very cold."'
    },
    {
      id: 'cold_bufanda',
      weather: 'cold',
      texture: 'bufanda',
      x: 600,
      y: 310,
      es: 'la bufanda',
      en: 'scarf',
      exampleEs: '«La bufanda de lana abriga el cuello en invierno.»',
      exampleEn: '"The wool scarf keeps the neck warm in winter."'
    },
    {
      id: 'cold_guantes',
      weather: 'cold',
      texture: 'guantes',
      x: 535,
      y: 415,
      es: 'los guantes',
      en: 'gloves',
      exampleEs: '«Llevo los guantes rojos para calentar mis manos.»',
      exampleEn: '"I wear the red gloves to warm my hands."'
    },
    {
      id: 'cold_gorro',
      weather: 'cold',
      texture: 'gorro',
      x: 280,
      y: 365,
      es: 'el gorro',
      en: 'beanie / warm hat',
      exampleEs: '«El gorro con pompón protege las orejas del frío.»',
      exampleEn: '"The beanie with pom-pom protects the ears from the cold."'
    },
    {
      id: 'cold_abrigo',
      weather: 'cold',
      texture: 'abrigo',
      x: 190,
      y: 340,
      es: 'el abrigo',
      en: 'coat',
      exampleEs: '«El abrigo largo de lana es muy elegante y caliente.»',
      exampleEn: '"The long wool coat is very elegant and warm."'
    },
    {
      id: 'cold_manta',
      weather: 'cold',
      texture: 'manta',
      x: 460,
      y: 240,
      es: 'la manta',
      en: 'blanket',
      exampleEs: '«Elena se tapa con la manta suave en el banco.»',
      exampleEn: '"Elena covers herself with the soft blanket on the bench."'
    },
    {
      id: 'cold_sueter',
      weather: 'cold',
      texture: 'sueter',
      x: 340,
      y: 340,
      es: 'el suéter',
      en: 'sweater',
      exampleEs: '«Este suéter de lana abriga perfectamente hoy.»',
      exampleEn: '"This wool sweater keeps warm perfectly today."'
    }
  ],
  heat: [
    {
      id: 'heat_agua',
      weather: 'heat',
      texture: 'water_bottle',
      x: 640,
      y: 370,
      es: 'el agua',
      en: 'water',
      exampleEs: '«Bebo agua fresca en la fuente porque tengo sed.»',
      exampleEn: '"I drink fresh water at the fountain because I am thirsty."'
    },
    {
      id: 'heat_botella',
      weather: 'heat',
      texture: 'botella',
      x: 730,
      y: 360,
      es: 'la botella',
      en: 'bottle',
      exampleEs: '«Tengo una botella de agua bien fría en la mesa.»',
      exampleEn: '"I have a very cold bottle of water on the table."'
    },
    {
      id: 'heat_vaso',
      weather: 'heat',
      texture: 'glass_water',
      x: 855,
      y: 235,
      es: 'el vaso',
      en: 'glass',
      exampleEs: '«El camarero sirve un vaso de agua con limón.»',
      exampleEn: '"The waiter serves a glass of water with lemon."'
    },
    {
      id: 'heat_abanico',
      weather: 'heat',
      texture: 'abanico',
      x: 250,
      y: 370,
      es: 'el abanico',
      en: 'hand fan',
      exampleEs: '«Carmen usa el abanico para refrescarse del calor.»',
      exampleEn: '"Carmen uses the hand fan to cool off from the heat."'
    },
    {
      id: 'heat_gorra',
      weather: 'heat',
      texture: 'gorra',
      x: 580,
      y: 425,
      es: 'la gorra',
      en: 'cap',
      exampleEs: '«Llevo la gorra con visera para protegerme del sol.»',
      exampleEn: '"I wear the cap with visor to protect myself from the sun."'
    },
    {
      id: 'heat_gafas_sol',
      weather: 'heat',
      texture: 'gafas_sol',
      x: 595,
      y: 240,
      es: 'las gafas de sol',
      en: 'sunglasses',
      exampleEs: '«Las gafas de sol oscuras protegen la vista del brillo.»',
      exampleEn: '"The dark sunglasses protect the eyes from the glare."'
    },
    {
      id: 'heat_toalla',
      weather: 'heat',
      texture: 'toalla',
      x: 765,
      y: 595,
      es: 'la toalla',
      en: 'towel',
      exampleEs: '«Sofia usa la toalla para secarse el sudor del verano.»',
      exampleEn: '"Sofia uses the towel to dry off summer sweat."'
    }
  ],
  sunny: [
    {
      id: 'sunny_helado',
      weather: 'sunny',
      texture: 'helado',
      x: 820,
      y: 235,
      es: 'el helado',
      en: 'ice cream',
      exampleEs: '«Pido un helado riquísimo en el puesto de Paco.»',
      exampleEn: '"I order a delicious ice cream at Paco\'s cart."'
    },
    {
      id: 'sunny_flores',
      weather: 'sunny',
      texture: 'flowers',
      x: 330,
      y: 300,
      es: 'las flores',
      en: 'flowers',
      exampleEs: '«Las flores del puesto llenan la plaza de alegría.»',
      exampleEn: '"The flowers at the stall fill the plaza with joy."'
    },
    {
      id: 'sunny_banco',
      weather: 'sunny',
      texture: 'banco',
      x: 445,
      y: 240,
      es: 'el banco',
      en: 'bench',
      exampleEs: '«Me siento a descansar plácidamente en el banco al sol.»',
      exampleEn: '"I sit to rest peacefully on the bench in the sun."'
    },
    {
      id: 'sunny_bicicleta',
      weather: 'sunny',
      texture: 'bicicleta',
      x: 415,
      y: 245,
      es: 'la bicicleta',
      en: 'bicycle',
      exampleEs: '«Paseo en bicicleta por las calles tranquilas de Madrid.»',
      exampleEn: '"I ride a bicycle through the calm streets of Madrid."'
    },
    {
      id: 'sunny_balon',
      weather: 'sunny',
      texture: 'balon',
      x: 490,
      y: 510,
      es: 'el balón',
      en: 'football / ball',
      exampleEs: '«Juego con el balón.»',
      exampleEn: '"I play with the ball."'
    },
    {
      id: 'sunny_camara',
      weather: 'sunny',
      texture: 'camara',
      x: 570,
      y: 240,
      es: 'la cámara',
      en: 'camera',
      exampleEs: '«Hago fotos preciosas de los edificios con la cámara.»',
      exampleEn: '"I take lovely photos of the buildings with the camera."'
    },
    {
      id: 'sunny_cesta',
      weather: 'sunny',
      texture: 'cesta',
      x: 475,
      y: 245,
      es: 'la cesta',
      en: 'basket',
      exampleEs: '«Llevamos comida en la cesta para comer en el parque.»',
      exampleEn: '"We carry food in the basket to eat in the park."'
    }
  ]
};
