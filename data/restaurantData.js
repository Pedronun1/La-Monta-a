/**
 * RESTAURANTE LA MONTAÑA — CATÁLOGO GASTRONÓMICO, BODEGA Y DATOS OFICIALES
 * Ubicación: C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid
 * Teléfono: +34 915 47 31 11
 */

const RESTAURANT_INFO = {
  name: "La Montaña",
  legalName: "Restaurante Gastronómico Castizo La Montaña S.L.",
  subtitle: "Moncloa - Aravaca, Madrid",
  tagline: "Alta tradición castiza, producto de temporada y brasas en el corazón de Argüelles",
  description:
    "Fundado sobre la herencia de las grandes casas de comidas madrileñas de 1943 en la Calle del Rey Francisco, 28. Una propuesta donde la cocina de raíz, el producto noble y una atmósfera íntima se encuentran en Moncloa - Aravaca.",
  foundedYear: 1943,
  priceRange: "28 € – 45 € por comensal",
  address: {
    street: "C. del Rey Francisco, 28",
    district: "Moncloa - Aravaca",
    neighborhood: "Argüelles · Pintor Rosales",
    postalCode: "28008",
    city: "Madrid",
    country: "España",
    fullAddress: "C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Calle+del+Rey+Francisco+28+28008+Madrid",
    googleMapsEmbedUrl: "https://www.google.com/maps?q=Calle+del+Rey+Francisco,+28,+28008+Madrid&output=embed",
    transport: [
      { label: "Metro Ventura Rodríguez", detail: "Línea 3 · a 3 min a pie" },
      { label: "Metro Argüelles", detail: "Líneas 3, 4 y 6 · a 5 min a pie" },
      { label: "Autobuses EMT", detail: "Líneas 1, 2, 44, 74, C1 y C2" },
      { label: "Entorno", detail: "Junto al Paseo del Pintor Rosales y Templo de Debod" }
    ]
  },
  contact: {
    phone: "+34 915 47 31 11",
    phoneClean: "+34915473111",
    email: "reservas@restaurantelamontana.es",
    instagram: "@lamontana.madrid"
  },
  hours: [
    { day: "Lunes", open: false, shifts: "Cerrado por descanso semanal" },
    { day: "Martes a Jueves", open: true, shifts: "13:00 – 16:30 h  ·  20:30 – 23:30 h" },
    { day: "Viernes y Sábado", open: true, shifts: "13:00 – 17:00 h  ·  20:30 – 00:00 h" },
    { day: "Domingo", open: true, shifts: "13:00 – 17:00 h  ·  20:30 – 23:00 h" }
  ],
  diningAreas: [
    {
      id: "salon-principal",
      name: "Salón Gastronómico Principal",
      description: "Mesas vestidas, iluminación cálida y madera noble en nuestra planta calle de Rey Francisco, 28.",
      capacity: "Hasta 45 plazas"
    },
    {
      id: "cueva-historica",
      name: "Cueva Abovedada de Ladrillo (1943)",
      description: "Bodega subterránea histórica de ladrillo visto, íntima y reservada para veladas especiales y grupos.",
      capacity: "Hasta 36 plazas"
    },
    {
      id: "barra-castiza",
      name: "Barra de Mármol & Mesas Altas",
      description: "Espacio gastronómico informal para tapeo de autor, raciones al centro y vinos por copa.",
      capacity: "Hasta 20 plazas"
    }
  ],
  ratings: {
    score: "4.7",
    totalReviews: 684,
    reviews: [
      {
        author: "Carlos R. Mendoza",
        role: "Local Guide · Madrid",
        rating: 5,
        date: "Hace 5 días",
        dish: "Croquetas de Jamón Ibérico & Huevos Trufados",
        comment:
          "Una joya gastronómica en la calle Rey Francisco. La atmósfera íntima del local, el servicio impecable de sala y unas croquetas de ibérico de bellota que se deshacen en boca. Los huevos camperos trufados son obligatorios."
      },
      {
        author: "Elena Valdés Gómez",
        role: "Crítica Gastronómica & Sommelier",
        rating: 5,
        date: "Hace 2 semanas",
        dish: "Verdinas con Carabineros & Pago de Carraovejas",
        comment:
          "Equilibrio magistral entre la casa de comidas madrileña fundada en 1943 y una puesta en escena contemporánea de primer nivel. La cueva abovedada de ladrillo tiene un encanto único en todo Moncloa-Argüelles."
      },
      {
        author: "Javier Santamaría",
        role: "Cliente Verificado",
        rating: 5,
        date: "Hace 3 semanas",
        dish: "Oreja Crujiente, Cazón en Adobo & Torrija de Brioche",
        comment:
          "Reservamos mesa online y todo funcionó a la perfección. Producto de primera, punto exacto en cada plato y una torrija caramelizada con helado de vainilla Bourbon que justifica por sí sola la visita."
      }
    ]
  }
};

const MENU_CATEGORIES = [
  { id: "Entrantes", label: "Entrantes", subtitle: "Raciones de autor y clásicos castizos para compartir" },
  { id: "Principales", label: "Principales", subtitle: "Cuchara histórica, carnes maduradas y brasas" },
  { id: "Postres", label: "Postres", subtitle: "Repostería artesana elaborada a diario en nuestro obrador" },
  { id: "Vinos", label: "Vinos", subtitle: "Selección de nuestra bodega subterránea por copa y botella" }
];

const MENU_ITEMS = [
  // =========================================================================
  // ENTRANTES (Raciones Castizas & Picoteo de Autor)
  // =========================================================================
  {
    id: "croquetas-iberico-bellota",
    category: "Entrantes",
    name: "Croquetas Cremosas de Jamón Ibérico 100% Bellota",
    description:
      "Bechamel sedosa infusionada en hueso de jamón ibérico de Guijuelo durante 4 horas, abundante viruta cortada a cuchillo y cobertura panko dorada al momento. (8 unidades).",
    price: 14.50,
    tag: "Estrella de la Casa",
    allergens: "Gluten · Lácteos · Huevo",
    image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "huevos-camperos-trufados",
    category: "Entrantes",
    name: "Huevos Camperos Trufados con Patata Agria y Velo Ibérico",
    description:
      "Huevos de corral fritos con puntilla crujiente sobre cama de patatas panaderas confitadas, emulsión de trufa negra Melanosporum y lascas de presa ibérica curada.",
    price: 16.50,
    tag: "Imprescindible",
    allergens: "Huevo · Sin Gluten",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "oreja-plancha-crujiente",
    category: "Entrantes",
    name: "Oreja a la Plancha Crujiente al Ajillo y Pimentón de la Vera",
    description:
      "Confitada a baja temperatura durante 6 horas y marcada en plancha de hierro fundido hasta lograr un exterior extracrujiente, terminada con majado de ajo morado y perejil fresco.",
    price: 13.90,
    tag: "Tradición Castiza",
    allergens: "Sin Gluten",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "cazon-adobo-artesano",
    category: "Entrantes",
    name: "Cazón en Adobo Tradicional con Emulsión de Limón Asado",
    description:
      "Dados de cazón fresco marinados 24 horas en adobo de orégano silvestre y vinagre viejo de Jerez, fritos en harina de garbanzo de molienda fina con alioli cítrico.",
    price: 14.80,
    tag: "Fritura Limpia",
    allergens: "Pescado · Gluten · Huevo",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "ensalada-ventresca-tomate-rosa",
    category: "Entrantes",
    name: "Tomate Rosa de Barbastro con Ventresca del Cantábrico",
    description:
      "Gajos carnosos de tomate rosa seleccionado, lascas de ventresca de bonito del norte en AOVE arbequina, pimientos de cristal asados al sarmiento y cebolleta tierna.",
    price: 16.20,
    tag: "Huerta & Mar",
    allergens: "Pescado · Sin Gluten",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "patatas-revolconas-torreznos",
    category: "Entrantes",
    name: "Patatas Revolconas al Pimentón con Torreznos de Soria",
    description:
      "Cremoso rústico de patata vieja machacada con sofrito de ajos confitados y pimentón ahumado D.O., coronado con torreznos de Soria de corteza suflada.",
    price: 13.50,
    tag: "Clásico de Barra",
    allergens: "Sin Gluten",
    image: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=900&q=85"
  },

  // =========================================================================
  // PRINCIPALES (Cuchara Histórica, Brasas & Carnes Maduradas)
  // =========================================================================
  {
    id: "verdinas-con-carabineros",
    category: "Principales",
    name: "Verdinas de Llanes Estofadas con Carabineros de Huelva",
    description:
      "Nuestro plato de cuchara más emblemático: verdinas mantecosas guisadas lentamente en fondo de coral de carabinero a la brasa y toque de manzanilla de Sanlúcar.",
    price: 24.50,
    tag: "Receta Histórica 1943",
    allergens: "Crustáceos · Sin Gluten",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "solomillo-vaca-madurada-foie",
    category: "Principales",
    name: "Solomillo de Vaca Rubia Gallega a la Brasa con Foie y PX",
    description:
      "Centro de solomillo marcado al carbón de encina, escalope de foie micuit caramelizado, reducción de Pedro Ximénez añejo y milhojas de patata trufada.",
    price: 26.90,
    tag: "Especialidad Brasa",
    allergens: "Lácteos · Sulfitos · Sin Gluten",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "rabo-de-toro-estofado",
    category: "Principales",
    name: "Rabo de Toro Deshuesado al Vino Tinto Reserva",
    description:
      "Estofado tradicional cordobés-madrileño cocinado durante 7 horas a fuego lento hasta desprenderse del hueso, glaseado en su propio jugo con parmentier cremoso.",
    price: 22.00,
    tag: "Guiso Tradicional",
    allergens: "Lácteos · Sulfitos",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "callos-a-la-madrilena",
    category: "Principales",
    name: "Callos a la Madrileña en Cazuela de Barro",
    description:
      "Elaborados según el recetario clásico de La Montaña con pata, morro, chorizo y morcilla asturiana ahumada, con salsa gelatinosa y un sutil picante.",
    price: 18.50,
    tag: "Sello Castizo",
    allergens: "Sin Gluten",
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "hamburguesa-la-montana-trufada",
    category: "Principales",
    name: "Burger Gourmet 'La Montaña' 220g Vaca Madurada & Trufa",
    description:
      "Carne seleccionada de chuleta madurada 45 días a la parrilla, queso Comté fundido, papada ibérica crujiente, yema curada y mayonesa de trufa negra en brioche artesano.",
    price: 17.50,
    tag: "Parrilla de Carbón",
    allergens: "Gluten · Lácteos · Huevo",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "cocochas-merluza-pilpil",
    category: "Principales",
    name: "Cocochas de Merluza de Pincho del Cantábrico al Pil-Pil",
    description:
      "Confitadas suavemente en aceite de oliva virgen extra con láminas de ajo dorado y guindilla hasta ligar una emulsión sedosa y brillante.",
    price: 25.00,
    tag: "Lonja del Día",
    allergens: "Pescado · Sin Gluten",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=900&q=85"
  },

  // =========================================================================
  // POSTRES (Obrador Propio)
  // =========================================================================
  {
    id: "torrija-caramelizada-brioche",
    category: "Postres",
    name: "Torrija Caramelizada de Brioche en Leche Merengada",
    description:
      "Nuestro postre insignia desde 1943: pan brioche artesano infusionado 12 horas en leche fresca, canela de Ceilán y cítricos, tostada al soplete con helado de vainilla Bourbon.",
    price: 8.50,
    tag: "Postre Insignia",
    allergens: "Gluten · Lácteos · Huevo",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "tarta-queso-fundente",
    category: "Postres",
    name: "Tarta de Queso al Horno con Corazón Cremoso",
    description:
      "Horneada a diario con quesos artesanos de la Sierra de Madrid y toque de Gamoneu, de interior fluido y base crujiente de galleta sableé.",
    price: 8.20,
    tag: "Obrador Propio",
    allergens: "Gluten · Lácteos · Huevo",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "arroz-con-leche-requemado",
    category: "Postres",
    name: "Arroz con Leche Asturiano Cremoso Requemado al Hierro",
    description:
      "Cocinados durante más de dos horas removiendo sin pausa para lograr una textura mantecosa inigualable, coronado con costra fina de azúcar caramelizado.",
    price: 7.50,
    tag: "Receta Tradicional",
    allergens: "Lácteos · Sin Gluten",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=85"
  },

  // =========================================================================
  // VINOS (Selección de Bodega Subterránea)
  // =========================================================================
  {
    id: "pago-de-carraovejas-ribera",
    category: "Vinos",
    name: "Pago de Carraovejas · D.O. Ribera del Duero",
    description:
      "Tinto Fino, Cabernet Sauvignon y Merlot. Intenso, estructurado y envolvente, con notas de fruta negra madura, cacao y crianza en roble francés y americano. (Botella 75cl).",
    price: 46.00,
    tag: "Ribera del Duero",
    allergens: "Sulfitos",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "marques-de-murrieta-reserva",
    category: "Vinos",
    name: "Marqués de Murrieta Reserva · D.O.Ca. Rioja",
    description:
      "Tempranillo, Graciano, Mazuelo y Garnacha de la Finca Ygay. Elegancia clásica riojana con equilibrio perfecto entre fruta roja, especias dulces y tanino sedoso. (Botella 75cl).",
    price: 34.00,
    tag: "Rioja Reserva",
    allergens: "Sulfitos",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "pazo-senorans-albarino",
    category: "Vinos",
    name: "Pazo de Señorans · D.O. Rías Baixas (100% Albariño)",
    description:
      "Blanco atlántico vibrante, fresco y mineral, criado sobre lías en acero inoxidable. Maridaje ideal para nuestras verdinas con carabineros, cocochas y cazón. (Botella 75cl).",
    price: 27.50,
    tag: "Rías Baixas",
    allergens: "Sulfitos",
    image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=900&q=85"
  }
];

const TIME_SLOTS = {
  lunch: ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"],
  dinner: ["20:30", "21:00", "21:30", "22:00", "22:30", "23:00"]
};

module.exports = {
  RESTAURANT_INFO,
  MENU_CATEGORIES,
  MENU_ITEMS,
  TIME_SLOTS
};
