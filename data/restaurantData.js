/**
 * RESTAURANTE LA MONTAÑA — DATOS OFICIALES Y CARTA COMPLETA
 * Ubicación: C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid
 * Teléfono: +34 915 47 31 11
 */

const RESTAURANT_INFO = {
  name: "La Montaña",
  legalName: "Restaurante Taberna Castiza La Montaña S.L.",
  tagline: "Tradición castiza, brasas y tapeo de autor en el corazón de Argüelles - Moncloa",
  subTagline: "Un rincón emblemático en la Calle del Rey Francisco donde la cocina tradicional madrileña, las raciones de toda la vida y el trato familiar se dan cita desde hace generaciones.",
  foundedYear: 1943,
  priceRange: "15 € – 30 € por persona",
  address: {
    street: "C. del Rey Francisco, 28",
    district: "Moncloa - Aravaca (Barrio de Argüelles)",
    postalCode: "28008",
    city: "Madrid",
    country: "España",
    fullAddress: "C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid",
    coordinates: {
      lat: 40.42785,
      lng: -3.71762
    },
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Calle+del+Rey+Francisco+28+28008+Madrid",
    googleMapsEmbedUrl: "https://www.google.com/maps?q=Calle+del+Rey+Francisco,+28,+28008+Madrid&output=embed",
    nearbyTransport: [
      { type: "Metro", line: "Línea 3 (Amarilla)", station: "Ventura Rodríguez (a 3 min a pie)" },
      { type: "Metro", line: "Líneas 3, 4 y 6", station: "Argüelles (a 5 min a pie)" },
      { type: "Autobús EMT", line: "Líneas 1, 2, 44, 74, C1, C2", station: "Princesa / Marqués de Urquijo" },
      { type: "Paseo", line: "Zona Rosales", station: "Junto al Paseo del Pintor Rosales y Templo de Debod" }
    ]
  },
  contact: {
    phone: "+34 915 47 31 11",
    phoneClean: "+34915473111",
    whatsapp: "34915473111",
    email: "reservas@restaurantelamontana.es",
    instagram: "@lamontana_madrid",
    website: "https://www.restaurantelamontana.es"
  },
  hours: [
    { day: "Lunes", dayIndex: 1, open: false, shifts: "Cerrado por descanso semanal", lunch: null, dinner: null },
    { day: "Martes", dayIndex: 2, open: true, shifts: "13:00 – 16:30 | 20:30 – 23:30", lunch: "13:00 – 16:30", dinner: "20:30 – 23:30" },
    { day: "Miércoles", dayIndex: 3, open: true, shifts: "13:00 – 16:30 | 20:30 – 23:30", lunch: "13:00 – 16:30", dinner: "20:30 – 23:30" },
    { day: "Jueves", dayIndex: 4, open: true, shifts: "13:00 – 16:30 | 20:30 – 23:30", lunch: "13:00 – 16:30", dinner: "20:30 – 23:30" },
    { day: "Viernes", dayIndex: 5, open: true, shifts: "13:00 – 17:00 | 20:30 – 00:00", lunch: "13:00 – 17:00", dinner: "20:30 – 00:00" },
    { day: "Sábado", dayIndex: 6, open: true, shifts: "13:00 – 17:00 | 20:30 – 00:00", lunch: "13:00 – 17:00", dinner: "20:30 – 00:00" },
    { day: "Domingo", dayIndex: 0, open: true, shifts: "13:00 – 17:00 | 20:30 – 23:00", lunch: "13:00 – 17:00", dinner: "20:30 – 23:00" }
  ],
  diningAreas: [
    {
      id: "salon-castizo",
      name: "Salón Principal Castizo",
      description: "Luminoso y acogedor, con madera noble, azulejería tradicional y ambiente familiar madrileño.",
      capacity: "Hasta 45 comensales"
    },
    {
      id: "cueva-bodega",
      name: "Cueva Abovedada de Ladrillo (Bodega)",
      description: "Nuestro emblemático salón subterráneo de ladrillo visto, ideal para comidas tranquilas, grupos y celebraciones.",
      capacity: "Hasta 36 comensales"
    },
    {
      id: "barra-picoteo",
      name: "Zona de Barra & Mesas Altas",
      description: "El rincón más animado para cañas bien tiradas, vermut de grifo y raciones recién salidas de cocina.",
      capacity: "Hasta 20 comensales"
    }
  ],
  ratings: {
    overall: 4.6,
    totalReviews: 648,
    source: "Google Maps",
    distribution: [
      { stars: 5, percentage: 76, count: 492 },
      { stars: 4, percentage: 16, count: 104 },
      { stars: 3, percentage: 5, count: 32 },
      { stars: 2, percentage: 2, count: 13 },
      { stars: 1, percentage: 1, count: 7 }
    ],
    highlights: [
      "Croquetas de jamón ibérico memorables",
      "Huevos trufados y oreja a la plancha de 10",
      "Ambiente castizo con cueva de ladrillo única",
      "Excelente relación calidad-precio en Moncloa",
      "Trato cercano y servicio rápido"
    ]
  },
  reviews: [
    {
      id: "rev-1",
      author: "Carlos Rodríguez M.",
      badge: "Local Guide · 142 reseñas",
      avatar: "CR",
      rating: 5,
      date: "Hace 1 semana",
      dishMentioned: "Croquetas de jamón ibérico & Huevos trufados",
      text: "Un descubrimiento increíble en plena calle Rey Francisco. Las croquetas de jamón ibérico son súper cremosas por dentro y crujientes por fuera, y los huevos trufados con patatas panaderas son obligatorios. El local tiene ese encanto castizo madrileño que ya cuesta encontrar y la atención de los camareros es de 10.",
      verified: true
    },
    {
      id: "rev-2",
      author: "Elena Valdés Gómez",
      badge: "Local Guide · 89 reseñas",
      avatar: "EV",
      rating: 5,
      date: "Hace 2 semanas",
      dishMentioned: "Oreja a la plancha & Cazón en adobo",
      text: "Fuimos a cenar un viernes tras pasear por Pintor Rosales. Pedimos la oreja a la plancha (con ese puntito crujiente perfecto y su ajillo) y el cazón en adobo, que estaba jugosísimo y nada grasiento. Relación calidad-precio insuperable para estar en Argüelles-Moncloa. Volveremos seguro.",
      verified: true
    },
    {
      id: "rev-3",
      author: "Javier Santamaría",
      badge: "Cliente verificado · 54 reseñas",
      avatar: "JS",
      rating: 5,
      date: "Hace 3 semanas",
      dishMentioned: "Combo Castizo & Torrija caramelizada",
      text: "Reservamos mesa en el salón de abajo (la cueva de ladrillo abovedada) y el ambiente es una maravilla. Probamos las hamburguesas de vaca madurada trufada y varias raciones para compartir. De postre no os vayáis sin probar la torrija caramelizada o el arroz con leche. Trato familiar como en casa.",
      verified: true
    },
    {
      id: "rev-4",
      author: "Marta Peñalver",
      badge: "Local Guide · 215 reseñas",
      avatar: "MP",
      rating: 5,
      date: "Hace 1 mes",
      dishMentioned: "Ensalada de Ventresca & Huevos trufados",
      text: "Mi restaurante de confianza en el barrio de Moncloa. Tanto si vas de picoteo en barra con unas cañas bien tiradas como si reservas mesa para comer tranquilo, siempre cumplen con nota. Raciones abundantes, producto fresco de primera y precios muy honestos.",
      verified: true
    }
  ]
};

const MENU_CATEGORIES = [
  {
    id: "raciones-picoteo",
    name: "Raciones y Picoteo",
    subtitle: "El alma castiza de nuestra barra y fogones para compartir al centro",
    icon: "Flame"
  },
  {
    id: "hamburguesas-combos",
    name: "Hamburguesas y Combos Especiales",
    subtitle: "Carnes seleccionadas a la parrilla y combos pensados para disfrutar en grupo",
    icon: "Utensils"
  },
  {
    id: "ensaladas",
    name: "Ensaladas y Huerta",
    subtitle: "Producto fresco de temporada con aliños artesanos y aceite de oliva virgen extra",
    icon: "Salad"
  },
  {
    id: "postres",
    name: "Postres Caseros",
    subtitle: "Obrador propio con las recetas dulces tradicionales de nuestra casa",
    icon: "CakeSlice"
  }
];

const MENU_ITEMS = [
  // =========================================================================
  // 1. RACIONES Y PICOTEO
  // =========================================================================
  {
    id: "croquetas-jamon-iberico",
    category: "raciones-picoteo",
    categoryName: "Raciones y Picoteo",
    name: "Croquetas de Jamón Ibérico de Bellota",
    shortName: "Croquetas de Jamón Ibérico",
    description: "Nuestra receta insignia: bechamel trabajada a fuego lento con leche fresca de caserío, abundante viruta de jamón ibérico 100% bellota y rebozado panko extracrujiente. (8 unidades ración / 4 unidades media).",
    price: 13.50,
    halfPrice: 7.50,
    unit: "Ración (8 uds)",
    badge: "Estrella de la Casa",
    popular: true,
    allergens: ["Gluten", "Lácteos", "Huevo"],
    calories: "480 kcal",
    prepTime: "10 min",
    image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "oreja-a-la-plancha",
    category: "raciones-picoteo",
    categoryName: "Raciones y Picoteo",
    name: "Oreja a la Plancha Crujiente al Ajillo",
    shortName: "Oreja a la Plancha",
    description: "Clásico imprescindible del Madrid más castizo. Oreja de cerdo confitada lentamente y marcada a fuego vivo en plancha de hierro hasta lograr bordes dorados y crujientes, aderezada con majado de ajo, perejil fresco y pimentón de la Vera.",
    price: 12.90,
    halfPrice: 7.20,
    unit: "Ración generosa",
    badge: "Receta Castiza",
    popular: true,
    allergens: ["Sin Gluten"],
    calories: "540 kcal",
    prepTime: "12 min",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "huevos-trufados",
    category: "raciones-picoteo",
    categoryName: "Raciones y Picoteo",
    name: "Huevos Camperos Trufados con Patatas y Lasca Ibérica",
    shortName: "Huevos Trufados",
    description: "Huevos de corral de yema intensa fritos en puntilla sobre cama de patatas agrias pochadas y doradas en sartén, perfumados con crema de trufa negra Melanosporum, escamas de sal Maldon y jamón ibérico recién cortado. Se rompen en mesa.",
    price: 14.50,
    halfPrice: null,
    unit: "Sartén para compartir",
    badge: "Top Ventas Google Maps",
    popular: true,
    allergens: ["Huevo", "Sin Gluten"],
    calories: "610 kcal",
    prepTime: "12 min",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "cazon-en-adobo",
    category: "raciones-picoteo",
    categoryName: "Raciones y Picoteo",
    name: "Cazón en Adobo Tradicional con Alioli de Limón",
    shortName: "Cazón en Adobo",
    description: "Dados de cazón fresco marinados durante 24 horas en adobo artesano de orégano silvestre, ajo morado, pimentón dulce y vinagre de Jerez. Rebozados en harina de garbanzo andaluza para una fritura limpia, jugosa por dentro y dorada por fuera.",
    price: 13.80,
    halfPrice: 7.90,
    unit: "Ración con alioli cítrico",
    badge: "Imprescindible",
    popular: true,
    allergens: ["Pescado", "Gluten", "Huevo"],
    calories: "460 kcal",
    prepTime: "10 min",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "patatas-revolconas-torreznos",
    category: "raciones-picoteo",
    categoryName: "Raciones y Picoteo",
    name: "Patatas Revolconas con Torreznos de Soria",
    shortName: "Patatas Revolconas con Torreznos",
    description: "Cremoso puré rústico de patata machacada al pimentón ahumado de la Vera con su sofrito de ajos tiernos, coronado con torreznos de Soria de corteza suflada y carne jugosa.",
    price: 12.50,
    halfPrice: 7.00,
    unit: "Cazuela de barro",
    badge: "Tradición de Taberna",
    popular: false,
    allergens: ["Sin Gluten"],
    calories: "590 kcal",
    prepTime: "12 min",
    image: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "callos-a-la-madrilena",
    category: "raciones-picoteo",
    categoryName: "Raciones y Picoteo",
    name: "Callos a la Madrileña en Cazuela de Barro",
    shortName: "Callos a la Madrileña",
    description: "Guiso castizo de cuchara elaborado durante más de 5 horas con tripa, pata y morro, chorizo y morcilla asturiana, con una salsa melosa y un toque sutilmente picante que pide pan de hogaza.",
    price: 15.50,
    halfPrice: 8.90,
    unit: "Cazuela tradicional",
    badge: "Desde 1943",
    popular: false,
    allergens: ["Sin Gluten"],
    calories: "640 kcal",
    prepTime: "10 min",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85"
  },

  // =========================================================================
  // 2. HAMBURGUESAS Y COMBOS ESPECIALES
  // =========================================================================
  {
    id: "burger-la-montana-trufada",
    category: "hamburguesas-combos",
    categoryName: "Hamburguesas y Combos Especiales",
    name: "Hamburguesa 'La Montaña' 220g Vaca Madurada & Trufa",
    shortName: "Burger La Montaña Trufada",
    description: "220g de carne 100% vaca rubia gallega madurada 45 días a la parrilla, queso Havarti fundido, panceta ibérica crujiente, huevo campero a la plancha, cebolla caramelizada y mayonesa de trufa negra en pan brioche tostado con mantequilla. Acompañada de patatas gajo caseras.",
    price: 15.90,
    halfPrice: null,
    unit: "Con patatas rústicas",
    badge: "Burger Estrella",
    popular: true,
    allergens: ["Gluten", "Lácteos", "Huevo", "Sésamo"],
    calories: "780 kcal",
    prepTime: "15 min",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "burger-castiza-manchega",
    category: "hamburguesas-combos",
    categoryName: "Hamburguesas y Combos Especiales",
    name: "Burger Castiza Ibérica & Queso Manchego Curado",
    shortName: "Burger Castiza Ibérica",
    description: "Doble smash burger de presa ibérica y vacuno nacional, lascas de queso Manchego D.O. curado fundido, crujiente de jamón ibérico, tomate asado al tomillo y salsa brava ahumada suave en pan brioche artesano. Servida con patatas fritas caseras.",
    price: 15.50,
    halfPrice: null,
    unit: "Con patatas caseras",
    badge: "Sabor Castizo",
    popular: true,
    allergens: ["Gluten", "Lácteos", "Huevo"],
    calories: "750 kcal",
    prepTime: "15 min",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "combo-castizo-rey-francisco",
    category: "hamburguesas-combos",
    categoryName: "Hamburguesas y Combos Especiales",
    name: "Combo Castizo 'Rey Francisco' (Para 2 - 3 Personas)",
    shortName: "Combo Castizo Rey Francisco",
    description: "El festín más pedido para compartir: Ración completa de Croquetas de Jamón Ibérico (8 uds) + Sartén de Huevos Trufados con Ibérico + Ración a elegir entre Oreja a la Plancha o Cazón en Adobo + Pan de hogaza artesano + 4 Bebidas (Cañas, Vino de la casa o Refrescos).",
    price: 36.90,
    halfPrice: null,
    unit: "Pack Ahorro (2-3 pax)",
    badge: "Ahorra 18%",
    popular: true,
    allergens: ["Gluten", "Lácteos", "Huevo", "Pescado"],
    calories: "1450 kcal",
    prepTime: "15 min",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "combo-montana-burgers-picoteo",
    category: "hamburguesas-combos",
    categoryName: "Hamburguesas y Combos Especiales",
    name: "Combo 'Montaña & Amigos': 2 Burgers + Ración + 2 Bebidas",
    shortName: "Combo 2 Burgers + Ración",
    description: "Incluye 2 Hamburguesas a elegir de la carta con sus patatas rústicas + Media ración de Croquetas de Jamón Ibérico o Cazón en Adobo al centro + 2 Dobles de cerveza tirada, copas de vino Rioja/Ribera o refrescos.",
    price: 33.50,
    halfPrice: null,
    unit: "Menú Dúo Completo",
    badge: "Especial Parejas",
    popular: false,
    allergens: ["Gluten", "Lácteos", "Huevo"],
    calories: "1380 kcal",
    prepTime: "16 min",
    image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=900&q=85"
  },

  // =========================================================================
  // 3. ENSALADAS Y HUERTA
  // =========================================================================
  {
    id: "ensalada-la-montana-ventresca",
    category: "ensaladas",
    categoryName: "Ensaladas y Huerta",
    name: "Ensalada 'La Montaña' de Ventresca y Tomate Rosa",
    shortName: "Ensalada de Ventresca y Tomate",
    description: "Tomate rosa de la huerta cortado en gajos carnosos, lomos seleccionados de ventresca de bonito del Cantábrico en aceite de oliva, pimientos rojos asados a la leña, cebolleta tierna de Fuentes y aceitunas de Campo Real con AOVE arbequina.",
    price: 14.80,
    halfPrice: null,
    unit: "Fuente para compartir",
    badge: "Producto Fresco",
    popular: true,
    allergens: ["Pescado", "Sin Gluten"],
    calories: "340 kcal",
    prepTime: "8 min",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "ensalada-templada-cabra-miel",
    category: "ensaladas",
    categoryName: "Ensaladas y Huerta",
    name: "Ensalada Templada de Queso de Cabra, Nueces y Miel",
    shortName: "Ensalada Templada de Cabra",
    description: "Brotes tiernos de temporada, medallón de queso de cabra de la Sierra de Madrid caramelizado al soplete, nueces pecanas tostadas, tomates cherry confitados, pasas sultanas y emulsión templada de miel de romero y mostaza antigua.",
    price: 13.20,
    halfPrice: null,
    unit: "Plato completo",
    badge: "Vegetariana",
    popular: false,
    allergens: ["Lácteos", "Frutos de cáscara", "Mostaza", "Sin Gluten"],
    calories: "410 kcal",
    prepTime: "8 min",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "ensalada-cesar-castiza",
    category: "ensaladas",
    categoryName: "Ensaladas y Huerta",
    name: "Ensalada César Castiza con Pollo Crujiente y Manchego",
    shortName: "Ensalada César Castiza",
    description: "Cogollos frescos de Tudela, tiras de contramuslo de pollo de corral crujiente marinado a las finas hierbas, lascas de queso Manchego curado 12 meses, bacon ahumado, picatostes de hogaza al ajo y nuestra salsa César casera.",
    price: 12.90,
    halfPrice: null,
    unit: "Plato completo",
    badge: "Clásico Renovado",
    popular: false,
    allergens: ["Gluten", "Lácteos", "Huevo", "Pescado"],
    calories: "450 kcal",
    prepTime: "10 min",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=900&q=85"
  },

  // =========================================================================
  // 4. POSTRES CASEROS
  // =========================================================================
  {
    id: "torrija-caramelizada-casa",
    category: "postres",
    categoryName: "Postres Caseros",
    name: "Torrija Caramelizada en Leche Merengada con Helado",
    shortName: "Torrija Caramelizada Casera",
    description: "El postre más famoso de La Montaña en Rey Francisco, 28: gruesa rebanada de pan brioche infusionada 12 horas en leche fresca con canela en rama y piel de limón, caramelizada con azúcar moreno al momento y acompañada de helado artesano de vainilla Bourbon.",
    price: 7.50,
    halfPrice: null,
    unit: "Elaboración al momento",
    badge: "Famosa desde 1943",
    popular: true,
    allergens: ["Gluten", "Lácteos", "Huevo"],
    calories: "490 kcal",
    prepTime: "8 min",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "arroz-con-leche-requemado",
    category: "postres",
    categoryName: "Postres Caseros",
    name: "Arroz con Leche Cremoso al Estilo Norteño Requemado",
    shortName: "Arroz con Leche Requemado",
    description: "Receta tradicional cocinada lentamente durante más de dos horas removiendo sin pausa para lograr un grano mantecoso y cremoso, terminado con una fina costra crujiente de azúcar caramelizado al hierro.",
    price: 6.50,
    halfPrice: null,
    unit: "Cazuelita de barro",
    badge: "100% Casero",
    popular: true,
    allergens: ["Lácteos", "Sin Gluten"],
    calories: "380 kcal",
    prepTime: "5 min",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "tarta-queso-horno-cremosa",
    category: "postres",
    categoryName: "Postres Caseros",
    name: "Tarta de Queso al Horno con Corazón Fundente",
    shortName: "Tarta de Queso al Horno",
    description: "Elaborada a diario con mezcla de queso crema artesano, toque de queso azul suave y huevos de corral, con interior cremoso, bordes tostados y base de galleta mantequilla con mermelada casera de frutos del bosque.",
    price: 7.20,
    halfPrice: null,
    unit: "Porción generosa",
    badge: "Favorito Dulce",
    popular: true,
    allergens: ["Gluten", "Lácteos", "Huevo"],
    calories: "460 kcal",
    prepTime: "5 min",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "flan-casero-huevo-corral",
    category: "postres",
    categoryName: "Postres Caseros",
    name: "Flan Casero de Huevo de Corral con Nata Montada",
    shortName: "Flan Casero de Huevo",
    description: "Horneado al baño maría como toda la vida con huevos camperos, leche entera y caramelo oscuro tostado en casa, coronado con nata fresca montada y barquillo crujiente.",
    price: 5.90,
    halfPrice: null,
    unit: "Receta de la Abuela",
    badge: "Tradicional",
    popular: false,
    allergens: ["Lácteos", "Huevo"],
    calories: "320 kcal",
    prepTime: "5 min",
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=900&q=85"
  }
];

const AVAILABLE_TIME_SLOTS = {
  lunch: ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"],
  dinner: ["20:30", "21:00", "21:30", "22:00", "22:30", "23:00"]
};

module.exports = {
  RESTAURANT_INFO,
  MENU_CATEGORIES,
  MENU_ITEMS,
  AVAILABLE_TIME_SLOTS
};
