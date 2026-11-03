/**
 * RESTAURANTE LA MONTAÑA — ALTA COCINA CLÁSICA EN MADRID (DESDE 1943)
 * C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid | Tel: +34 915 47 31 11
 */

const RESTAURANT_INFO = {
  name: "Restaurante La Montaña",
  shortName: "La Montaña",
  monogram: "L.M",
  legalName: "Restaurante Clásico La Montaña S.L.",
  cif: "B-82941038",
  subtitle: "C. del Rey Francisco, 28 · Moncloa - Aravaca · Madrid",
  tagline: "Alta Cocina Tradicional & Legado Gastronómico desde 1943",
  description:
    "Fundado en 1943 en el señorial barrio de Argüelles, Restaurante La Montaña preserva la excelencia de las grandes casas de comidas de Madrid. Producto de lonja y dehesa, fuego lento, mantelería de hilo y una bodega histórica bajo bóveda de ladrillo.",
  foundedYear: 1943,
  priceRange: "45 € – 75 €",
  address: {
    street: "C. del Rey Francisco, 28",
    district: "Moncloa - Aravaca",
    neighborhood: "Argüelles · Paseo del Pintor Rosales",
    postalCode: "28008",
    city: "Madrid",
    country: "España",
    fullAddress: "C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Calle+del+Rey+Francisco+28+28008+Madrid",
    googleMapsEmbedUrl: "https://www.google.com/maps?q=Calle+del+Rey+Francisco,+28,+28008+Madrid&output=embed",
    accessDetails: [
      { label: "Servicio de Aparcacoches", detail: "Concertado en Parking Marqués de Urquijo (a 120 metros)" },
      { label: "Metro Cercano", detail: "Ventura Rodríguez (Línea 3) y Argüelles (Líneas 3, 4 y 6)" },
      { label: "Entorno", detail: "A dos minutos a pie del Paseo del Pintor Rosales y Templo de Debod" }
    ]
  },
  contact: {
    phone: "+34 915 47 31 11",
    phoneClean: "+34915473111",
    email: "reservas@restaurantelamontana.es",
    pressEmail: "direccion@restaurantelamontana.es"
  },
  hours: [
    { day: "Martes a Sábado · Almuerzos", schedule: "13:30 – 16:00 h", status: "open" },
    { day: "Martes a Sábado · Cenas", schedule: "20:30 – 23:30 h", status: "open" },
    { day: "Domingos · Servicio de Mediodía", schedule: "13:30 – 16:30 h", status: "open" },
    { day: "Domingos Noche y Lunes", schedule: "Cerrado por descanso de sala", status: "closed" }
  ],
  heritage: {
    yearsOfHistory: 83,
    title: "Ocho décadas de alta tradición madrileña en Rey Francisco, 28",
    lead: "Desde que abrió sus puertas en 1943, La Montaña ha sido punto de encuentro de familias, escritores, diplomáticos y amantes de la buena mesa en Moncloa - Aravaca.",
    paragraphs: [
      "Nuestra filosofía culinaria rechaza el artificio innecesario para centrarse en la pureza de la materia prima: verduras de temporada de la ribera del Ebro, pescados salvajes seleccionados cada madrugada del Cantábrico y cortes nobles de vacuno mayor madurados en cámara propia.",
      "El restaurante se articula en dos espacios de carácter único: el Salón Principal en planta calle, vestido con lino blanco y maderas nobles, y nuestra emblemática Cueva Abovedada de Ladrillo del siglo pasado, un refugio de silencio y sobriedad ideal para veladas íntimas y recepciones privadas."
    ]
  },
  diningAreas: [
    {
      id: "salon-principal",
      name: "Salón Principal de Planta Calle",
      description: "Luz natural tamizada, mantelería de hilo egipcio y separación generosa entre mesas para una privacidad absoluta.",
      capacity: "Hasta 42 comensales"
    },
    {
      id: "cueva-boveda",
      name: "La Cueva Histórica Abovedada (1943)",
      description: "Salón subterráneo de ladrillo visto centenario y acústica envolvente, junto a nuestro botellero histórico.",
      capacity: "Hasta 32 comensales"
    },
    {
      id: "reservado-privado",
      name: "Reservado Privado Rey Francisco",
      description: "Mesa imperial privada para almuerzos ejecutivos, consejos de administración o celebraciones familiares discretas.",
      capacity: "De 6 a 14 comensales"
    }
  ],
  ratings: {
    score: "4.7",
    totalReviews: 684,
    quotes: [
      {
        quote: "Una lección de clasicismo y elegancia en pleno Argüelles. Sus verdinas con carabineros y el punto del solomillo recuerdan por qué los clásicos nunca pasan de moda.",
        author: "Carlos R. Mendoza",
        publication: "Crónica Gastronómica de Madrid"
      },
      {
        quote: "El servicio de sala conserva esa cortesía silenciosa y precisa de los grandes restaurantes europeos. Imprescindible su torrija caramelizada de brioche.",
        author: "Elena Valdés Gómez",
        publication: "Sommelier & Guía de Mesa"
      }
    ]
  }
};

const MENU_CATEGORIES = [
  {
    id: "Entrantes",
    title: "Entrantes",
    subtitle: "Preludios de temporada, fondos de cocción lenta y clásicos de nuestra casa"
  },
  {
    id: "Pescados",
    title: "Pescados",
    subtitle: "Piezas salvajes de lonja del Cantábrico y recetas marineras de precisión"
  },
  {
    id: "Carnes rojas maduradas",
    title: "Carnes Rojas Maduradas",
    subtitle: "Cortes seleccionados de vacuno mayor a la brasa de encina y guisos históricos"
  },
  {
    id: "Postres de autor",
    title: "Postres de Autor",
    subtitle: "Repostería fina elaborada al momento en nuestro obrador"
  }
];

const MENU_ITEMS = [
  // =========================================================================
  // 1. ENTRANTES
  // =========================================================================
  {
    id: "croquetas-jamon-bellota",
    category: "Entrantes",
    name: "Croquetas de Jamón Ibérico de Bellota 100%",
    description: "Bechamel etérea infusionada en hueso de jamón de Guijuelo y velo de panceta curada (6 piezas).",
    price: 16.00,
    highlight: "Clásico desde 1943"
  },
  {
    id: "huevos-camperos-trufados",
    category: "Entrantes",
    name: "Huevos de Caserío Trufados con Patata Confitada y Tuber Melanosporum",
    description: "Yema templada sobre milhojas de patata agria, jugo reducido de ave y trufa negra laminada en mesa.",
    price: 21.00,
    highlight: "Temporada"
  },
  {
    id: "verdinas-llanes-carabineros",
    category: "Entrantes",
    name: "Verdinas de Llanes Estofadas con Carabinero de Huelva",
    description: "Cuchara histórica de la casa ligada con el coral del propio crustáceo a la brasa y manzanilla pasada.",
    price: 26.50,
    highlight: "Plato Insignia"
  },
  {
    id: "oreja-confitada-crujiente",
    category: "Entrantes",
    name: "Terrina Crujiente de Oreja Ibérica Confitada al Pimentón de la Vera",
    description: "Confitada 12 horas a baja temperatura, marcada al hierro con emulsión de ajo negro y perejil.",
    price: 17.50,
    highlight: null
  },
  {
    id: "tomate-rosa-ventresca",
    category: "Entrantes",
    name: "Corazón de Tomate Rosa de Barbastro con Ventresca de Bonito del Norte",
    description: "Lomos de ventresca en conserva artesana, cebolleta tierna, pimiento de cristal al sarmiento y AOVE temprano.",
    price: 19.50,
    highlight: null
  },
  {
    id: "alcachofas-tudela-foie",
    category: "Entrantes",
    name: "Flores de Alcachofa de Tudela a la Brasa con Foie Fresco y Cecina de León",
    description: "Confitadas en aceite arbequina, marcadas al carbón con virutas de foie micuit y sal de Añana.",
    price: 22.00,
    highlight: null
  },

  // =========================================================================
  // 2. PESCADOS
  // =========================================================================
  {
    id: "cocochas-merluza-pilpil",
    category: "Pescados",
    name: "Cocochas de Merluza de Pincho del Cantábrico al Pil-Pil o a la Brasa",
    description: "Ligadas a mano en cazuela de barro con aceite virgen extra y láminas de ajo morado de Las Pedroñeras.",
    price: 29.00,
    highlight: "Lonja del Día"
  },
  {
    id: "merluza-celeiro-almejas",
    category: "Pescados",
    name: "Lomo de Merluza de Celeiro en Salsa Verde con Almejas de Carril",
    description: "Corte central de merluza de anzuelo, almeja fina gallega, espárrago blanco fresco y fumet de roca.",
    price: 28.50,
    highlight: null
  },
  {
    id: "rodaballo-salvaje-brasa",
    category: "Pescados",
    name: "Rodaballo Salvaje Asado al Carbón de Encina con Bilbaína Suave",
    description: "Asado con su piel gelatinosa, refrito tradicional de ajos dorados, vinagre de sidra y patata panadera.",
    price: 32.00,
    highlight: "Recomendación del Chef"
  },
  {
    id: "cazon-adobo-fino",
    category: "Pescados",
    name: "Tacos de Cazón de Almadraba en Adobo Antiguo y Mayonesa de Limón Asado",
    description: "Marinado 24 horas en especias suaves y vinagre viejo de Jerez, fritura limpia en harina de garbanzo.",
    price: 19.00,
    highlight: null
  },
  {
    id: "chipirones-anzuelo-tinta",
    category: "Pescados",
    name: "Chipirones de Anzuelo Rellenos en su Tinta con Arroz Blanco Cremoso",
    description: "Guisados lentamente según el recetario clásico del norte con cebolla pochada durante cuatro horas.",
    price: 25.50,
    highlight: null
  },

  // =========================================================================
  // 3. CARNES ROJAS MADURADAS
  // =========================================================================
  {
    id: "solomillo-rubia-gallega-foie",
    category: "Carnes rojas maduradas",
    name: "Solomillo de Vaca Rubia Gallega a la Brasa con Escalope de Foie y Pedro Ximénez",
    description: "Centro de solomillo al carbón, foie gras fresco marcado en sartén, reducción de vino viejo y gratén de patata.",
    price: 31.00,
    highlight: "Corte Estrella"
  },
  {
    id: "chuleta-vaca-madurada-60",
    category: "Carnes rojas maduradas",
    name: "Lomo Alto de Vaca Mayor Madurado 60 Días (Dry-Aged) al Sarmiento",
    description: "Trinchado en sala sobre plato refractario templado, acompañado de pimientos de Lodosa asados a la leña (500 g).",
    price: 38.00,
    highlight: "Maduración 60 Días"
  },
  {
    id: "rabo-toro-vino-tinto",
    category: "Carnes rojas maduradas",
    name: "Rabo de Toro Estofado al Vino Tinto Reserva y Parmentier Trufado",
    description: "Deshuesado en cilindro tras siete horas de cocción lenta, glaseado brillante en su jugo de reducción.",
    price: 26.00,
    highlight: "Receta Histórica"
  },
  {
    id: "callos-madrilena-tradicion",
    category: "Carnes rojas maduradas",
    name: "Callos a la Madrileña de Casa La Montaña en Cazuela de Barro",
    description: "Pata, morro y tripa seleccionados, morcilla y chorizo ahumado asturiano con salsa melosa ligeramente picante.",
    price: 22.50,
    highlight: "Tradición 1943"
  },
  {
    id: "paletilla-lechazo-igp",
    category: "Carnes rojas maduradas",
    name: "Paletilla de Lechazo Churro I.G.P. Castilla y León Asada a Baja Temperatura",
    description: "Piel dorada y crujiente, carne tierna en su propio jugo de asado y ensalada de brotes de la huerta.",
    price: 33.50,
    highlight: null
  },

  // =========================================================================
  // 4. POSTRES DE AUTOR
  // =========================================================================
  {
    id: "torrija-brioche-bourbon",
    category: "Postres de autor",
    name: "Torrija Caramelizada de Pan Brioche en Leche Merengada y Vainilla Bourbon",
    description: "Infusionada 12 horas en leche fresca con canela en rama y piel de cítricos, caramelizada al hierro en mesa.",
    price: 10.50,
    highlight: "Postre Insignia"
  },
  {
    id: "tarta-queso-artesana-fundente",
    category: "Postres de autor",
    name: "Tarta Fluida de Quesos Artesanos de la Sierra de Madrid y Gamoneu",
    description: "Horneada a diario con corazón cremoso, base sableé de mantequilla tostada y compota suave de frutos silvestres.",
    price: 10.00,
    highlight: null
  },
  {
    id: "arroz-leche-asturiano",
    category: "Postres de autor",
    name: "Arroz con Leche Cremoso al Estilo del Principado con Costra de Azúcar",
    description: "Tres horas de cocción pausada para lograr un grano mantecoso, quemado al momento con hierro candente.",
    price: 9.00,
    highlight: null
  },
  {
    id: "milhojas-crema-diplomatica",
    category: "Postres de autor",
    name: "Milhojas Crujiente de Hojaldre Invertido con Crema Diplomática y Toffee",
    description: "Láminas de hojaldre caramelizadas al horno, crema ligera de vainilla de Madagascar y caramelo salado.",
    price: 11.00,
    highlight: "Obrador Propio"
  }
];

const WINE_PAIRINGS = [
  { name: "Vega Sicilia Valbuena 5º Año · D.O. Ribera del Duero", price: "165,00 €" },
  { name: "Pago de Carraovejas · D.O. Ribera del Duero", price: "48,00 €" },
  { name: "La Rioja Alta Gran Reserva 904 · D.O.Ca. Rioja", price: "76,00 €" },
  { name: "Marqués de Murrieta Reserva · D.O.Ca. Rioja", price: "36,00 €" },
  { name: "Pazo Señorans Selección de Añada · D.O. Rías Baixas", price: "54,00 €" },
  { name: "Louis Roederer Collection 244 · A.O.C. Champagne", price: "82,00 €" }
];

const TIME_SLOTS = {
  lunch: ["13:30", "14:00", "14:30", "15:00", "15:30"],
  dinner: ["20:30", "21:00", "21:30", "22:00", "22:30", "23:00"]
};

module.exports = {
  RESTAURANT_INFO,
  MENU_CATEGORIES,
  MENU_ITEMS,
  WINE_PAIRINGS,
  TIME_SLOTS
};
