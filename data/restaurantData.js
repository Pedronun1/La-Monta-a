/**
 * ============================================================================
 * RESTAURANTE LA MONTAÑA — CARTA OFICIAL Y DATOS DEL ESTABLECIMIENTO
 * C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid | Tel: +34 915 47 31 11
 * ============================================================================
 */

const RESTAURANT_INFO = {
  name: "Restaurante La Montaña",
  shortName: "La Montaña",
  monogram: "L.M",
  legalName: "Restaurante La Montaña S.L.",
  cif: "B-82941038",
  subtitle: "C. del Rey Francisco, 28 · Moncloa - Aravaca · Madrid",
  tagline: "Alta Cocina Tradicional Castiza & Casa de Comidas desde 1943",
  description:
    "Ubicado en el número 28 de la calle del Rey Francisco, en el corazón de Argüelles (Moncloa - Aravaca), La Montaña es un emblema de la gastronomía madrileña y norteña desde 1943. Salones señoriales con zócalos de azulejería clásica, mantelería de hilo y nuestra histórica cueva abovedada de ladrillo visto.",
  foundedYear: 1943,
  priceRange: "30 € – 45 €",
  address: {
    street: "C. del Rey Francisco, 28",
    district: "Moncloa - Aravaca",
    neighborhood: "Barrio de Argüelles · Pintor Rosales",
    postalCode: "28008",
    city: "Madrid",
    country: "España",
    fullAddress: "C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Calle+del+Rey+Francisco+28+28008+Madrid",
    googleMapsEmbedUrl:
      "https://www.google.com/maps?q=Calle+del+Rey+Francisco,+28,+28008+Madrid&output=embed",
    accessDetails: [
      {
        label: "Metro Cercano",
        detail: "Ventura Rodríguez (Línea 3) y Argüelles (Líneas 3, 4 y 6)"
      },
      {
        label: "Autobuses EMT",
        detail: "Líneas 1, 2, 44, 74, C1 y C2 (Princesa / Marqués de Urquijo)"
      },
      {
        label: "Entorno",
        detail: "Junto al Paseo del Pintor Rosales, Parque del Oeste y Templo de Debod"
      }
    ]
  },
  contact: {
    phone: "+34 915 47 31 11",
    phoneClean: "+34915473111",
    email: "reservas@restaurantelamontana.es"
  },
  hours: [
    { day: "Martes a Viernes · Comidas y Cenas", schedule: "13:00 – 16:00 h · 21:00 – 23:00 h", status: "open" },
    { day: "Domingos · Comidas y Cenas", schedule: "13:00 – 16:00 h · 21:00 – 23:00 h", status: "open" },
    { day: "Sábados y Eventos Privados", schedule: "Consultar disponibilidad en sala", status: "open" },
    { day: "Descanso Semanal", schedule: "Según turno de descanso · Confirmar en el 915 47 31 11", status: "closed" }
  ],
  heritage: {
    title: "Salones señoriales, azulejería tradicional y bóvedas de ladrillo visto desde 1943",
    lead: "Más de ocho décadas conservando intacto el recetario clásico español, la cocina de cuchara y el trato cercano de toda la vida en el barrio de Argüelles.",
    paragraphs: [
      "Cruzar el umbral de La Montaña en la calle del Rey Francisco, 28 es adentrarse en la historia viva de la restauración madrileña. Nuestro comedor principal conserva el encanto señorial de los zócalos de azulejo clásico, la madera noble y las mesas vestidas donde generaciones de clientes disfrutan a diario de nuestras verdinas con carabineros, la fabada, la merluza de pincho o la ternera en pepitoria.",
      "En la planta inferior se abre nuestra célebre Cueva Histórica Abovedada de ladrillo visto: un espacio acogedor, íntimo y de acústica pausada, predilecto para comidas familiares, tertulias y celebraciones privadas en torno a la buena mesa."
    ]
  },
  diningAreas: [
    {
      id: "salon-senorial",
      name: "Salón Señorial de Azulejería Clásica",
      description:
        "Comedor principal en planta calle con zócalos de cerámica tradicional, madera noble, luz natural y mantelería clásica.",
      capacity: "Hasta 45 comensales"
    },
    {
      id: "boveda-ladrillo",
      name: "Bóveda Histórica de Ladrillo Visto (Cueva)",
      description:
        "Nuestro emblemático salón subterráneo abovedado de ladrillo antiguo, cálido y reservado para comidas tranquilas y grupos.",
      capacity: "Hasta 36 comensales"
    },
    {
      id: "zona-barra-tradicional",
      name: "Salón de Entrada & Barra Castiza",
      description:
        "Espacio tradicional para disfrutar de una Gilda, nuestras croquetas caseras de jamón o unos torreznos recién hechos.",
      capacity: "Hasta 20 comensales"
    }
  ],
  ratings: {
    score: "4.6",
    totalReviews: 648,
    quotes: [
      {
        quote:
          "Un clásico imprescindible de Madrid en la calle Rey Francisco. Las verdinas con carabineros, las cocochas y sus famosas torrijas de media barra siguen siendo insuperables.",
        author: "Carlos R. Mendoza",
        publication: "Guía de Casas de Comidas de Madrid"
      },
      {
        quote:
          "Comer en su cueva de ladrillo abovedada o en el salón de azulejos clásicos es sentirte como en casa. Cocina honesta, producto excelente y servicio de toda la vida.",
        author: "Elena Valdés Gómez",
        publication: "Crónica Gastronómica · Moncloa - Argüelles"
      }
    ]
  }
};

const MENU_CATEGORIES = [
  {
    id: "Primeros",
    title: "Primeros",
    subtitle: "Platos de cuchara, huerta seleccionada, entrantes castizos y clásicos de la casa"
  },
  {
    id: "Segundos",
    title: "Segundos",
    subtitle: "Pescados frescos de lonja, recetas tradicionales de cazuela y carnes seleccionadas"
  },
  {
    id: "Postres",
    title: "Postres",
    subtitle: "Repostería casera tradicional elaborada a diario en nuestra cocina"
  }
];

const MENU_ITEMS = [
  // =========================================================================
  // 1. PRIMEROS (20 Platos Oficiales con Precios Exactos)
  // =========================================================================
  {
    id: "consome",
    category: "Primeros",
    name: "Consomé",
    description: "Caldo tradicional clarificado de ave y jarrete cocinado a fuego lento.",
    price: 5.00,
    priceText: "5,00 €",
    highlight: null
  },
  {
    id: "ensaladilla-rusa",
    category: "Primeros",
    name: "Ensaladilla Rusa",
    description: "Receta clásica de la casa con patata seleccionada, bonito y mayonesa suave.",
    price: 11.50,
    priceText: "11,50 €",
    highlight: null
  },
  {
    id: "ensalada-tomate-bonito",
    category: "Primeros",
    name: "Ensalada de Tomate Bonito",
    description: "Tomate natural de huerta acompañado de lomos de bonito del norte y cebolleta.",
    price: 15.50,
    priceText: "15,50 €",
    highlight: null
  },
  {
    id: "ensalada-tomate-raf-bon",
    category: "Primeros",
    name: "Ensalada Tomate Raf Bon",
    description: "Tomate Raf de temporada aliñado con aceite de oliva virgen extra y bonito seleccionado.",
    price: 18.50,
    priceText: "18,50 €",
    highlight: "Temporada"
  },
  {
    id: "torreznos",
    category: "Primeros",
    name: "Torreznos",
    description: "Torreznos tradicionales dorados con corteza crujiente e interior jugoso.",
    price: 10.00,
    priceText: "10,00 €",
    highlight: null
  },
  {
    id: "lentejas",
    category: "Primeros",
    name: "Lentejas",
    description: "Lentejas caseras estofadas lentamente a la manera tradicional.",
    price: 9.00,
    priceText: "9,00 €",
    highlight: "Cuchara"
  },
  {
    id: "sopa-cocido",
    category: "Primeros",
    name: "Sopa Cocido",
    description: "Sopa reconfortante de fideos finos en el caldo sustancioso de nuestro cocido.",
    price: 9.00,
    priceText: "9,00 €",
    highlight: null
  },
  {
    id: "berenjena-rebozada",
    category: "Primeros",
    name: "Berenjena Rebozada",
    description: "Láminas de berenjena tierna con rebozado fino y dorado al momento.",
    price: 11.00,
    priceText: "11,00 €",
    highlight: null
  },
  {
    id: "pisto-manchego",
    category: "Primeros",
    name: "Pisto Manchego",
    description: "Hortalizas frescas pochadas a fuego pausado según la receta clásica manchega.",
    price: 11.00,
    priceText: "11,00 €",
    highlight: null
  },
  {
    id: "patatas-revolconas",
    category: "Primeros",
    name: "Patatas Revolconas",
    description: "Cremoso rústico de patata al pimentón de la Vera con torreznos crujientes.",
    price: 11.50,
    priceText: "11,50 €",
    highlight: "Tradición"
  },
  {
    id: "gazpacho",
    category: "Primeros",
    name: "Gazpacho",
    description: "Elaborado en casa con tomates maduros de temporada y aceite de oliva virgen extra.",
    price: 11.50,
    priceText: "11,50 €",
    highlight: null
  },
  {
    id: "salmorejo",
    category: "Primeros",
    name: "Salmorejo",
    description: "Salmorejo tradicional cremoso servido con virutas de jamón ibérico y huevo duro.",
    price: 12.00,
    priceText: "12,00 €",
    highlight: null
  },
  {
    id: "huevos-rellenos",
    category: "Primeros",
    name: "Huevos Rellenos",
    description: "Huevos camperos rellenos de bonito del norte elaborados en nuestra cocina.",
    price: 14.00,
    priceText: "14,00 €",
    highlight: null
  },
  {
    id: "judias-verdes",
    category: "Primeros",
    name: "Judías Verdes",
    description: "Judías verdes tiernas salteadas con jamón ibérico y ajo laminado.",
    price: 19.50,
    priceText: "19,50 €",
    highlight: null
  },
  {
    id: "fabada",
    category: "Primeros",
    name: "Fabada",
    description: "Auténtica fabada asturiana de cuchara con fabes seleccionadas y su compango.",
    price: 19.50,
    priceText: "19,50 €",
    highlight: "Especialidad"
  },
  {
    id: "verdinas-con-carabineros",
    category: "Primeros",
    name: "Verdinas con Carabineros",
    description: "El plato de cuchara más famoso de La Montaña: verdinas estofadas con carabineros.",
    price: 21.00,
    priceText: "21,00 €",
    highlight: "Estrella de la Casa"
  },
  {
    id: "cocido",
    category: "Primeros",
    name: "Cocido",
    description: "Servicio / aperitivo tradicional de nuestro cocido madrileño.",
    price: 1.80,
    priceText: "1,80 €",
    highlight: null
  },
  {
    id: "croqueta-de-jamon-unidad",
    category: "Primeros",
    name: "Croqueta de Jamón (unidad)",
    description: "Croqueta casera cremosa de jamón ibérico elaborada a diario (precio por unidad).",
    price: 2.00,
    priceText: "2,00 €",
    highlight: "Casera"
  },
  {
    id: "gilda",
    category: "Primeros",
    name: "Gilda",
    description: "Clásico aperitivo de anchoa del Cantábrico, piparra tierna y aceituna.",
    price: 7.00,
    priceText: "7,00 €",
    highlight: null
  },
  {
    id: "patatas-bravas",
    category: "Primeros",
    name: "Patatas Bravas",
    description: "Patatas naturales doradas con nuestra salsa brava tradicional (consultar en sala).",
    price: null,
    priceText: "Consultar",
    highlight: null
  },

  // =========================================================================
  // 2. SEGUNDOS (16 Platos Oficiales con Precios Exactos)
  // =========================================================================
  {
    id: "sardinas-escabeche",
    category: "Segundos",
    name: "Sardinas Escabeche",
    description: "Sardinas preparadas en escabeche casero tradicional de laurel y especias suaves.",
    price: 11.00,
    priceText: "11,00 €",
    highlight: null
  },
  {
    id: "tortilla-de-la-abuela",
    category: "Segundos",
    name: "Tortilla de la Abuela",
    description: "Tortilla casera jugosa elaborada al momento con receta tradicional de la casa.",
    price: 21.00,
    priceText: "21,00 €",
    highlight: "Tradición"
  },
  {
    id: "calamares-en-su-tinta",
    category: "Segundos",
    name: "Calamares en su Tinta",
    description: "Calamares tiernos guisados lentamente en su tinta con guarnición clásica.",
    price: 21.50,
    priceText: "21,50 €",
    highlight: "Clásico"
  },
  {
    id: "filetes-de-gallo",
    category: "Segundos",
    name: "Filetes de Gallo",
    description: "Filetes limpios de gallo fresco de lonja preparados a la plancha o rebozados.",
    price: 23.00,
    priceText: "23,00 €",
    highlight: null
  },
  {
    id: "merluza-de-pincho",
    category: "Segundos",
    name: "Merluza de Pincho",
    description: "Corte selecto de merluza de pincho del Cantábrico preparada al gusto.",
    price: 27.50,
    priceText: "27,50 €",
    highlight: "Lonja"
  },
  {
    id: "delicias-de-merluza",
    category: "Segundos",
    name: "Delicias de Merluza",
    description: "Medallones jugosos de merluza fresca en rebozado fino tradicional.",
    price: 27.50,
    priceText: "27,50 €",
    highlight: null
  },
  {
    id: "cococha-de-bacalao-merluza",
    category: "Segundos",
    name: "Cococha de Bacalao/Merluza",
    description: "Cocochas seleccionadas de primera calidad al pil-pil, rebozadas o en salsa verde.",
    price: 35.00,
    priceText: "35,00 €",
    highlight: "Especialidad"
  },
  {
    id: "filete-de-ternera",
    category: "Segundos",
    name: "Filete de Ternera",
    description: "Filete tierno de ternera nacional a la plancha con patatas fritas caseras.",
    price: 19.00,
    priceText: "19,00 €",
    highlight: null
  },
  {
    id: "escalope-de-ternera",
    category: "Segundos",
    name: "Escalope de Ternera",
    description: "Escalope de ternera con empanado artesano dorado en sartén y guarnición.",
    price: 20.00,
    priceText: "20,00 €",
    highlight: null
  },
  {
    id: "pollo-al-ajillo",
    category: "Segundos",
    name: "Pollo al Ajillo",
    description: "Pollo troceado dorado al ajillo tradicional con ajos tiernos y vino blanco.",
    price: 14.00,
    priceText: "14,00 €",
    highlight: null
  },
  {
    id: "albondigas",
    category: "Segundos",
    name: "Albóndigas",
    description: "Albóndigas caseras de ternera guisadas en salsa española con patatas.",
    price: 15.00,
    priceText: "15,00 €",
    highlight: null
  },
  {
    id: "ternera-en-pepitoria",
    category: "Segundos",
    name: "Ternera en Pepitoria",
    description: "Receta histórica madrileña estofada en salsa ligada de almendra, azafrán y yema.",
    price: 16.50,
    priceText: "16,50 €",
    highlight: "Receta Castiza"
  },
  {
    id: "redondo-de-ternera",
    category: "Segundos",
    name: "Redondo de Ternera",
    description: "Redondo de ternera asado lentamente en su jugo con guarnición de la casa.",
    price: 17.50,
    priceText: "17,50 €",
    highlight: null
  },
  {
    id: "entrecot-y-patata-frita",
    category: "Segundos",
    name: "Entrecot y Patata Frita",
    description: "Entrecot de vacuno seleccionado al punto deseado con patatas fritas caseras.",
    price: 20.00,
    priceText: "20,00 €",
    highlight: null
  },
  {
    id: "solomillo-de-ternera",
    category: "Segundos",
    name: "Solomillo de Ternera",
    description: "Centro de solomillo de ternera de primera calidad a la plancha o parrilla.",
    price: 22.00,
    priceText: "22,00 €",
    highlight: "Corte Noble"
  },
  {
    id: "chuleton-de-vaca",
    category: "Segundos",
    name: "Chuletón de Vaca",
    description: "Gran chuletón de vaca madurada a la brasa ideal para compartir en mesa.",
    price: 68.00,
    priceText: "68,00 €",
    highlight: "Para Compartir"
  },

  // =========================================================================
  // 3. POSTRES (5 Postres Caseros Oficiales con Precios Exactos)
  // =========================================================================
  {
    id: "arroz-con-leche",
    category: "Postres",
    name: "Arroz con Leche",
    description: "Receta casera cremosa cocinada lentamente con leche entera, canela y limón.",
    price: 7.00,
    priceText: "7,00 €",
    highlight: "Casero"
  },
  {
    id: "flan",
    category: "Postres",
    name: "Flan",
    description: "Flan tradicional de huevo horneado al baño maría en nuestra cocina con caramelo.",
    price: 7.00,
    priceText: "7,00 €",
    highlight: null
  },
  {
    id: "manzana-asada",
    category: "Postres",
    name: "Manzana Asada",
    description: "Manzana reineta asada lentamente al horno en su propio jugo acaramelado.",
    price: 7.00,
    priceText: "7,00 €",
    highlight: null
  },
  {
    id: "fruta",
    category: "Postres",
    name: "Fruta",
    description: "Pieza o selección de fruta fresca natural de temporada.",
    price: 6.50,
    priceText: "6,50 €",
    highlight: null
  },
  {
    id: "torrija",
    category: "Postres",
    name: "Torrija",
    description: "Nuestra célebre torrija casera tradicional de media barra de pan en leche infusionada.",
    price: 9.00,
    priceText: "9,00 €",
    highlight: "Famosa desde 1943"
  }
];

const WINE_PAIRINGS = [
  { name: "Marqués de Murrieta Reserva · D.O.Ca. Rioja", price: "34,00 €" },
  { name: "Pago de Carraovejas · D.O. Ribera del Duero", price: "46,00 €" },
  { name: "Viña Ardanza Reserva · La Rioja Alta", price: "42,00 €" },
  { name: "Pazo de Señorans · D.O. Rías Baixas (100% Albariño)", price: "27,50 €" }
];

const TIME_SLOTS = {
  lunch: ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30"],
  dinner: ["21:00", "21:30", "22:00", "22:30"]
};

module.exports = {
  RESTAURANT_INFO,
  MENU_CATEGORIES,
  MENU_ITEMS,
  WINE_PAIRINGS,
  TIME_SLOTS
};
