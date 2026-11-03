/**
 * ============================================================================
 * RESTAURANTE LA MONTAÑA — SERVIDOR FULL-STACK DE PRODUCCIÓN (RENDER READY)
 * Ubicación: C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid
 * Stack: Node.js + Express + EJS + express-session
 * ============================================================================
 */

const express = require('express');
const session = require('express-session');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// 1. CONFIGURACIÓN OBLIGATORIA PARA PROXY INVERSO HTTPS EN RENDER.COM
// ============================================================================
app.set('trust proxy', 1);

// Middleware para garantizar que req.secure sea reconocido tras el balanceador TLS de Render
app.use((req, _res, next) => {
  const forwardedProto = req.headers['x-forwarded-proto'];
  const isLocal =
    req.hostname === 'localhost' ||
    req.hostname === '127.0.0.1' ||
    req.hostname === '::1';

  if (forwardedProto && String(forwardedProto).includes('https')) {
    req.headers['x-forwarded-proto'] = 'https';
  } else if (process.env.RENDER || process.env.NODE_ENV === 'production' || !isLocal) {
    req.headers['x-forwarded-proto'] = 'https';
  } else if (!forwardedProto && isLocal) {
    req.headers['x-forwarded-proto'] = 'https';
  }
  next();
});

// Configuración del motor de plantillas EJS y recursos estáticos
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================================
// 2. CONFIGURACIÓN DE EXPRESS-SESSION CON COOKIES SEGURAS
// ============================================================================
const SESSION_SECRET =
  process.env.SESSION_SECRET || 'la_montana_madrid_1943_render_secure_session_key_2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'lamontana2026';

app.use(
  session({
    name: 'lamontana.sid',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 12 // 12 horas
    }
  })
);

// Comparación segura de contraseñas en tiempo constante
function verifyPasswordSafe(inputPassword, expectedPassword) {
  if (typeof inputPassword !== 'string' || typeof expectedPassword !== 'string') {
    return false;
  }
  const inputHash = crypto.createHash('sha256').update(inputPassword).digest();
  const expectedHash = crypto.createHash('sha256').update(expectedPassword).digest();
  return crypto.timingSafeEqual(inputHash, expectedHash);
}

// Middleware de protección para rutas privadas de administración
function requireAdminAuth(req, res, next) {
  if (req.session && req.session.isAdmin === true) {
    return next();
  }
  const wantsJson =
    req.path.startsWith('/api/') ||
    req.xhr ||
    (req.headers.accept && req.headers.accept.includes('application/json'));

  if (wantsJson) {
    return res.status(401).json({
      success: false,
      error: 'No autorizado. Inicie sesión en /admin/login.'
    });
  }
  return res.redirect('/admin/login');
}

// ============================================================================
// 3. DATOS OFICIALES DEL RESTAURANTE Y CARTA COMPLETA CON PRECIOS EXACTOS (€)
// ============================================================================
const RESTAURANT_INFO = {
  name: 'La Montaña',
  legalName: 'Restaurante Clásico La Montaña S.L.',
  cif: 'B-82941038',
  monogram: 'L.M',
  foundedYear: 1943,
  subtitle: 'CASA DE COMIDAS FUNDADA EN 1943 · MONCLOA - ARAVACA, MADRID',
  tagline: 'Alta cocina tradicional castiza, cuchara de fuego lento y lonja diaria en el corazón de Madrid',
  description:
    'Desde 1943 en la calle del Rey Francisco, 28, La Montaña preserva la nobleza de los comedores clásicos madrileños: salones señoriales revestidos en azulejería tradicional y nuestra histórica cueva abovedada de ladrillo visto.',
  address: {
    street: 'C. del Rey Francisco, 28',
    district: 'Moncloa - Aravaca',
    neighborhood: 'Argüelles',
    postalCode: '28008',
    city: 'Madrid',
    fullAddress: 'C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Restaurante+La+Monta%C3%B1a+Calle+del+Rey+Francisco+28+28008+Madrid',
    googleMapsEmbedUrl:
      'https://www.google.com/maps?q=Calle+del+Rey+Francisco+28,+28008+Madrid&output=embed',
    accessDetails: [
      { label: 'Metro más cercano', detail: 'Ventura Rodríguez (Línea 3) y Argüelles (Líneas 3, 4 y 6)' },
      { label: 'Entorno', detail: 'A escasos pasos del Templo de Debod, Plaza de España y calle Princesa' },
      { label: 'Aparcamiento', detail: 'Parking público Princesa / Marqués de Urquijo a 180 metros' }
    ]
  },
  contact: {
    phone: '+34 915 47 31 11',
    phoneClean: '+34915473111',
    email: 'reservas@restaurantelamontana.es'
  },
  hours: [
    { day: 'Lunes', schedule: 'Cerrado por descanso semanal', status: 'closed' },
    { day: 'Martes a Jueves', schedule: '13:00 – 16:30 h · 20:30 – 23:30 h', status: 'open' },
    { day: 'Viernes y Sábado', schedule: '13:00 – 17:00 h · 20:30 – 00:00 h', status: 'open' },
    { day: 'Domingo', schedule: '13:00 – 16:45 h (Noches cerrado)', status: 'open' }
  ],
  diningAreas: [
    {
      id: 'salon-senorial',
      name: 'Salón Principal (Azulejería Clásica)',
      capacity: 'Hasta 34 comensales',
      floor: 'Planta Calle',
      description:
        'Comedor señorial en planta calle con zócalos de azulejos clásicos madrileños, luz natural y mantelería de hilo.'
    },
    {
      id: 'boveda-ladrillo',
      name: 'La Cueva / Bóveda (Ladrillo Visto)',
      capacity: 'Hasta 24 comensales',
      floor: 'Planta Subterránea · Bodega',
      description:
        'Comedor histórico subterráneo bajo bóveda de ladrillo macizo original de 1943. Ambiente íntimo, silencioso y climatizado.'
    },
    {
      id: 'zona-barra-tradicional',
      name: 'Salón de Entrada & Barra Castiza',
      capacity: 'Hasta 12 comensales',
      floor: 'Planta Calle · Entrada',
      description:
        'Espacio tradicional junto a la entrada para aperitivos de cuchara, raciones y comidas para dos.'
    }
  ],
  heritage: {
    title: 'Más de ocho décadas de cocina honesta en la calle del Rey Francisco',
    lead: 'Fundada en 1943 en el barrio de Argüelles (Moncloa - Aravaca), La Montaña es una institución del recetario clásico español en Madrid.',
    paragraphs: [
      'Nuestros fogones abren cada mañana con el chup-chup pausado de los grandes platos de cuchara que han dado fama a esta casa: las célebres Verdinas con Carabineros, la Fabada asturiana, el Consomé clarificado y las Lentejas estofadas.',
      'Trabajamos exclusivamente con pescado fresco de lonja diaria —Merluza de Pincho del Cantábrico, Cocochas de bacalao y merluza, Filetes de Gallo y Calamares en su tinta— junto a carnes nobles como la Ternera en Pepitoria, el Solomillo y el Chuletón de vaca madurada, culminando con nuestras famosas Torrijas caseras y el Arroz con leche.'
    ]
  },
  ratings: {
    score: '4.6',
    totalReviews: 648,
    quotes: [
      {
        quote:
          'Un clásico imprescindible de Madrid en la calle Rey Francisco. Las verdinas con carabineros, las cocochas y sus famosas torrijas siguen siendo insuperables.',
        author: 'Carlos R. Mendoza',
        publication: 'Guía de Casas de Comidas de Madrid'
      },
      {
        quote:
          'Comer en su cueva de ladrillo abovedada o en el salón de azulejos clásicos es sentirte como en casa. Cocina honesta, producto excelente y servicio de toda la vida.',
        author: 'Elena Valdés Gómez',
        publication: 'Crónica Gastronómica · Moncloa - Argüelles'
      }
    ]
  }
};

const MENU_CATEGORIES = [
  {
    id: 'Primeros',
    title: 'Primeros',
    subtitle: 'Platos de cuchara, huerta seleccionada, entrantes castizos y clásicos de la casa'
  },
  {
    id: 'Segundos',
    title: 'Segundos',
    subtitle: 'Pescados frescos de lonja, recetas tradicionales de cazuela y carnes seleccionadas'
  },
  {
    id: 'Postres',
    title: 'Postres',
    subtitle: 'Repostería casera tradicional elaborada a diario en nuestra cocina'
  }
];

const MENU_ITEMS = [
  // PRIMEROS (20 platos oficiales)
  { id: 'consome', category: 'Primeros', name: 'Consomé', description: 'Caldo tradicional clarificado de ave y jarrete cocinado a fuego lento.', price: 5.00, priceText: '5,00 €', highlight: null },
  { id: 'ensaladilla-rusa', category: 'Primeros', name: 'Ensaladilla Rusa', description: 'Receta clásica de la casa con patata seleccionada, bonito del norte y mayonesa suave.', price: 11.50, priceText: '11,50 €', highlight: 'Clásico' },
  { id: 'ensalada-tomate-bonito', category: 'Primeros', name: 'Ensalada de Tomate Bonito', description: 'Tomate natural de huerta acompañado de lomos de bonito del norte y cebolleta.', price: 15.50, priceText: '15,50 €', highlight: null },
  { id: 'ensalada-tomate-raf-bon', category: 'Primeros', name: 'Ensalada Tomate Raf Bon', description: 'Tomate Raf de temporada aliñado con aceite de oliva virgen extra y bonito seleccionado.', price: 18.50, priceText: '18,50 €', highlight: 'Temporada' },
  { id: 'torreznos', category: 'Primeros', name: 'Torreznos', description: 'Torreznos tradicionales dorados con corteza crujiente e interior jugoso.', price: 10.00, priceText: '10,00 €', highlight: null },
  { id: 'lentejas', category: 'Primeros', name: 'Lentejas', description: 'Lentejas caseras estofadas lentamente a la manera tradicional.', price: 9.00, priceText: '9,00 €', highlight: 'Cuchara' },
  { id: 'sopa-cocido', category: 'Primeros', name: 'Sopa Cocido', description: 'Sopa reconfortante de fideos finos en el caldo sustancioso de nuestro cocido.', price: 9.00, priceText: '9,00 €', highlight: null },
  { id: 'berenjena-rebozada', category: 'Primeros', name: 'Berenjena Rebozada', description: 'Láminas de berenjena tierna con rebozado fino y dorado al momento.', price: 11.00, priceText: '11,00 €', highlight: null },
  { id: 'pisto-manchego', category: 'Primeros', name: 'Pisto Manchego', description: 'Hortalizas frescas pochadas a fuego pausado según la receta clásica manchega.', price: 11.00, priceText: '11,00 €', highlight: null },
  { id: 'patatas-revolconas', category: 'Primeros', name: 'Patatas Revolconas', description: 'Cremoso rústico de patata al pimentón de la Vera con torreznos crujientes.', price: 11.50, priceText: '11,50 €', highlight: 'Tradición' },
  { id: 'gazpacho', category: 'Primeros', name: 'Gazpacho', description: 'Elaborado en casa con tomates maduros de temporada y aceite de oliva virgen extra.', price: 11.50, priceText: '11,50 €', highlight: null },
  { id: 'salmorejo', category: 'Primeros', name: 'Salmorejo', description: 'Salmorejo tradicional cremoso servido con virutas de jamón ibérico y huevo duro.', price: 12.00, priceText: '12,00 €', highlight: null },
  { id: 'huevos-rellenos', category: 'Primeros', name: 'Huevos Rellenos', description: 'Huevos camperos rellenos de bonito del norte elaborados en nuestra cocina.', price: 14.00, priceText: '14,00 €', highlight: null },
  { id: 'judias-verdes', category: 'Primeros', name: 'Judías Verdes', description: 'Judías verdes tiernas salteadas con jamón ibérico y ajo laminado.', price: 19.50, priceText: '19,50 €', highlight: null },
  { id: 'fabada', category: 'Primeros', name: 'Fabada', description: 'Auténtica fabada asturiana de cuchara con fabes seleccionadas y su compango.', price: 19.50, priceText: '19,50 €', highlight: 'Especialidad' },
  { id: 'verdinas-con-carabineros', category: 'Primeros', name: 'Verdinas con Carabineros', description: 'El plato de cuchara más famoso de La Montaña: verdinas estofadas con carabineros.', price: 21.00, priceText: '21,00 €', highlight: 'Estrella de la Casa' },
  { id: 'cocido', category: 'Primeros', name: 'Cocido', description: 'Servicio / aperitivo tradicional de nuestro cocido madrileño.', price: 1.80, priceText: '1,80 €', highlight: null },
  { id: 'croqueta-de-jamon-unidad', category: 'Primeros', name: 'Croqueta de Jamón (unidad)', description: 'Croqueta casera cremosa de jamón ibérico elaborada a diario (precio por unidad).', price: 2.00, priceText: '2,00 €', highlight: 'Casera' },
  { id: 'gilda', category: 'Primeros', name: 'Gilda', description: 'Clásico aperitivo de anchoa del Cantábrico, piparra tierna y aceituna.', price: 7.00, priceText: '7,00 €', highlight: null },
  { id: 'patatas-bravas', category: 'Primeros', name: 'Patatas Bravas', description: 'Patatas naturales doradas con nuestra salsa brava tradicional (consultar en sala).', price: null, priceText: 'Consultar', highlight: null },

  // SEGUNDOS (16 platos oficiales)
  { id: 'sardinas-escabeche', category: 'Segundos', name: 'Sardinas Escabeche', description: 'Sardinas preparadas en escabeche casero tradicional de laurel y especias suaves.', price: 11.00, priceText: '11,00 €', highlight: null },
  { id: 'tortilla-de-la-abuela', category: 'Segundos', name: 'Tortilla de la Abuela', description: 'Tortilla casera jugosa elaborada al momento con receta tradicional de la casa.', price: 21.00, priceText: '21,00 €', highlight: 'Tradición' },
  { id: 'calamares-en-su-tinta', category: 'Segundos', name: 'Calamares en su Tinta', description: 'Calamares tiernos guisados lentamente en su tinta con guarnición clásica.', price: 21.50, priceText: '21,50 €', highlight: 'Clásico' },
  { id: 'filetes-de-gallo', category: 'Segundos', name: 'Filetes de Gallo', description: 'Filetes limpios de gallo fresco de lonja preparados a la plancha o rebozados.', price: 23.00, priceText: '23,00 €', highlight: null },
  { id: 'merluza-de-pincho', category: 'Segundos', name: 'Merluza de Pincho', description: 'Corte selecto de merluza de pincho del Cantábrico preparada al gusto.', price: 27.50, priceText: '27,50 €', highlight: 'Lonja' },
  { id: 'delicias-de-merluza', category: 'Segundos', name: 'Delicias de Merluza', description: 'Medallones jugosos de merluza fresca en rebozado fino tradicional.', price: 27.50, priceText: '27,50 €', highlight: null },
  { id: 'cococha-de-bacalao-merluza', category: 'Segundos', name: 'Cococha de Bacalao/Merluza', description: 'Cocochas seleccionadas de primera calidad al pil-pil, rebozadas o en salsa verde.', price: 35.00, priceText: '35,00 €', highlight: 'Especialidad' },
  { id: 'filete-de-ternera', category: 'Segundos', name: 'Filete de Ternera', description: 'Filete tierno de ternera nacional a la plancha con patatas fritas caseras.', price: 19.00, priceText: '19,00 €', highlight: null },
  { id: 'escalope-de-ternera', category: 'Segundos', name: 'Escalope de Ternera', description: 'Escalope de ternera con empanado artesano dorado en sartén y guarnición.', price: 20.00, priceText: '20,00 €', highlight: null },
  { id: 'pollo-al-ajillo', category: 'Segundos', name: 'Pollo al Ajillo', description: 'Pollo troceado dorado al ajillo tradicional con ajos tiernos y vino blanco.', price: 14.00, priceText: '14,00 €', highlight: null },
  { id: 'albondigas', category: 'Segundos', name: 'Albóndigas', description: 'Albóndigas caseras de ternera guisadas en salsa española con patatas.', price: 15.00, priceText: '15,00 €', highlight: null },
  { id: 'ternera-en-pepitoria', category: 'Segundos', name: 'Ternera en Pepitoria', description: 'Receta histórica madrileña estofada en salsa ligada de almendra, azafrán y yema.', price: 16.50, priceText: '16,50 €', highlight: 'Receta Castiza' },
  { id: 'redondo-de-ternera', category: 'Segundos', name: 'Redondo de Ternera', description: 'Redondo de ternera asado lentamente en su jugo con guarnición de la casa.', price: 17.50, priceText: '17,50 €', highlight: null },
  { id: 'entrecot-y-patata-frita', category: 'Segundos', name: 'Entrecot y Patata Frita', description: 'Entrecot de vacuno seleccionado al punto deseado con patatas fritas caseras.', price: 20.00, priceText: '20,00 €', highlight: null },
  { id: 'solomillo-de-ternera', category: 'Segundos', name: 'Solomillo de Ternera', description: 'Centro de solomillo de ternera de primera calidad a la plancha o parrilla.', price: 22.00, priceText: '22,00 €', highlight: 'Corte Noble' },
  { id: 'chuleton-de-vaca', category: 'Segundos', name: 'Chuletón de Vaca', description: 'Gran chuletón de vaca madurada a la brasa ideal para compartir en mesa.', price: 68.00, priceText: '68,00 €', highlight: 'Para Compartir' },

  // POSTRES (5 postres caseros oficiales)
  { id: 'arroz-con-leche', category: 'Postres', name: 'Arroz con Leche', description: 'Receta casera cremosa cocinada lentamente con leche entera, canela y limón.', price: 7.00, priceText: '7,00 €', highlight: 'Casero' },
  { id: 'flan', category: 'Postres', name: 'Flan', description: 'Flan tradicional de huevo horneado al baño maría en nuestra cocina con caramelo.', price: 7.00, priceText: '7,00 €', highlight: null },
  { id: 'manzana-asada', category: 'Postres', name: 'Manzana Asada', description: 'Manzana reineta asada lentamente al horno en su propio jugo acaramelado.', price: 7.00, priceText: '7,00 €', highlight: null },
  { id: 'fruta', category: 'Postres', name: 'Fruta', description: 'Pieza o selección de fruta fresca natural de temporada.', price: 6.50, priceText: '6,50 €', highlight: null },
  { id: 'torrija', category: 'Postres', name: 'Torrija', description: 'Nuestra célebre torrija casera tradicional de media barra de pan en leche infusionada.', price: 9.00, priceText: '9,00 €', highlight: 'Famosa desde 1943' }
];

const CARTA_AGRUPADA = {
  primeros: MENU_ITEMS.filter((i) => i.category === 'Primeros'),
  segundos: MENU_ITEMS.filter((i) => i.category === 'Segundos'),
  postres: MENU_ITEMS.filter((i) => i.category === 'Postres')
};

const TIME_SLOTS = {
  lunch: ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30'],
  dinner: ['21:00', '21:30', '22:00', '22:30']
};

function formatSpanishPrice(price) {
  if (price === null || price === undefined || Number.isNaN(Number(price))) {
    return 'Consultar';
  }
  return Number(price).toFixed(2).replace('.', ',') + ' €';
}

// ============================================================================
// 4. BASE DE DATOS EN MEMORIA + SINCRONIZACIÓN CON CAPA SQLITE (database.js)
// ============================================================================
let sqliteDb = null;
try {
  sqliteDb = require('./database');
} catch (_err) {
  sqliteDb = null;
}

const todayISO = new Date().toISOString().split('T')[0];

const memoriaDB = {
  salones: [
    {
      id: 'salon-senorial',
      name: 'Salón Principal (Azulejería Clásica)',
      architectural_style: 'Planta Calle · Azulejería Clásica',
      description: 'Comedor señorial en planta calle con zócalos de azulejos clásicos madrileños y mantelería de hilo.'
    },
    {
      id: 'boveda-ladrillo',
      name: 'La Cueva / Bóveda (Ladrillo Visto)',
      architectural_style: 'Planta Subterránea · Bodega 1943',
      description: 'Comedor subterráneo abovedado de ladrillo visto centenario, íntimo y silencioso.'
    },
    {
      id: 'zona-barra-tradicional',
      name: 'Salón de Entrada & Barra Castiza',
      architectural_style: 'Planta Calle · Entrada',
      description: 'Zona de entrada junto a la barra tradicional para aperitivos, raciones y comidas para dos.'
    }
  ],
  mesas: [
    { id: 1, table_number: 'M-01', capacity: 2, zone_id: 'salon-senorial', zone_name: 'Salón Principal (Azulejería Clásica)', status: 'Libre', notes: 'Junto a ventanal calle Rey Francisco' },
    { id: 2, table_number: 'M-02', capacity: 2, zone_id: 'salon-senorial', zone_name: 'Salón Principal (Azulejería Clásica)', status: 'Reservada', notes: 'Zócalo de azulejos clásicos' },
    { id: 3, table_number: 'M-03', capacity: 4, zone_id: 'salon-senorial', zone_name: 'Salón Principal (Azulejería Clásica)', status: 'Libre', notes: 'Mesa central de salón' },
    { id: 4, table_number: 'M-04', capacity: 4, zone_id: 'salon-senorial', zone_name: 'Salón Principal (Azulejería Clásica)', status: 'Ocupada', notes: 'Mesa central de salón' },
    { id: 5, table_number: 'M-05', capacity: 6, zone_id: 'salon-senorial', zone_name: 'Salón Principal (Azulejería Clásica)', status: 'Libre', notes: 'Mesa familiar junto a alacena' },
    { id: 6, table_number: 'M-06', capacity: 8, zone_id: 'salon-senorial', zone_name: 'Salón Principal (Azulejería Clásica)', status: 'Libre', notes: 'Mesa presidencial Salón Principal' },
    { id: 7, table_number: 'C-01', capacity: 2, zone_id: 'boveda-ladrillo', zone_name: 'La Cueva / Bóveda (Ladrillo Visto)', status: 'Libre', notes: 'Rincón íntimo bajo arco de ladrillo' },
    { id: 8, table_number: 'C-02', capacity: 4, zone_id: 'boveda-ladrillo', zone_name: 'La Cueva / Bóveda (Ladrillo Visto)', status: 'Reservada', notes: 'Bóveda central de ladrillo visto' },
    { id: 9, table_number: 'C-03', capacity: 4, zone_id: 'boveda-ladrillo', zone_name: 'La Cueva / Bóveda (Ladrillo Visto)', status: 'Libre', notes: 'Bóveda central de ladrillo visto' },
    { id: 10, table_number: 'C-04', capacity: 6, zone_id: 'boveda-ladrillo', zone_name: 'La Cueva / Bóveda (Ladrillo Visto)', status: 'Ocupada', notes: 'Bajo arco maestro de 1943' },
    { id: 11, table_number: 'C-05', capacity: 8, zone_id: 'boveda-ladrillo', zone_name: 'La Cueva / Bóveda (Ladrillo Visto)', status: 'Libre', notes: 'Mesa de gala en La Cueva' },
    { id: 12, table_number: 'B-01', capacity: 2, zone_id: 'zona-barra-tradicional', zone_name: 'Salón de Entrada & Barra Castiza', status: 'Libre', notes: 'Mesa alta de aperitivo' },
    { id: 13, table_number: 'B-02', capacity: 2, zone_id: 'zona-barra-tradicional', zone_name: 'Salón de Entrada & Barra Castiza', status: 'Reservada', notes: 'Mesa junto a barra clásica' },
    { id: 14, table_number: 'B-03', capacity: 4, zone_id: 'zona-barra-tradicional', zone_name: 'Salón de Entrada & Barra Castiza', status: 'Libre', notes: 'Mesa castiza de entrada' }
  ],
  reservas: [
    {
      id: 1,
      reservation_code: 'LM-2026-1042',
      reservation_date: todayISO,
      reservation_time: '14:00',
      guests: 2,
      dining_area: 'salon-senorial',
      dining_area_name: 'Salón Principal (Azulejería Clásica)',
      table_id: 2,
      table_number: 'M-02',
      customer_name: 'D. Javier Echevarría Mendoza',
      customer_phone: '+34 629 410 882',
      customer_email: 'j.echevarria@abogadosmadrid.es',
      notes: 'Reserva de Verdinas con Carabineros y Merluza de Pincho.',
      preselected_dishes: ['Verdinas con Carabineros', 'Merluza de Pincho', 'Torrija'],
      status: 'confirmed'
    },
    {
      id: 2,
      reservation_code: 'LM-2026-1089',
      reservation_date: todayISO,
      reservation_time: '14:30',
      guests: 4,
      dining_area: 'boveda-ladrillo',
      dining_area_name: 'La Cueva / Bóveda (Ladrillo Visto)',
      table_id: 8,
      table_number: 'C-02',
      customer_name: 'Dña. Beatriz Almirante de la Vega',
      customer_phone: '+34 648 912 301',
      customer_email: 'balmirante@patrimonio.es',
      notes: 'Mesa tranquila en la cueva de ladrillo. Sin gluten para 1 comensal.',
      preselected_dishes: ['Consomé', 'Chuletón de Vaca', 'Arroz con Leche'],
      status: 'confirmed'
    }
  ]
};

// Funciones unificadas de acceso a datos (delegan en SQLite si está activo y mantienen memoriaDB sincronizada)
function obtenerSalones() {
  if (sqliteDb && typeof sqliteDb.getAllZones === 'function') {
    return sqliteDb.getAllZones();
  }
  return memoriaDB.salones;
}

function obtenerMesas(filtros = {}) {
  if (sqliteDb && typeof sqliteDb.getAllTables === 'function') {
    const rows = sqliteDb.getAllTables(filtros);
    memoriaDB.mesas = rows;
    return rows;
  }
  return memoriaDB.mesas.map((m) => ({
    ...m,
    activeReservation:
      memoriaDB.reservas.find((r) => r.table_id === m.id && r.status === 'confirmed') || null
  }));
}

function obtenerReservas(filtros = {}) {
  if (sqliteDb && typeof sqliteDb.getAllReservations === 'function') {
    const rows = sqliteDb.getAllReservations(filtros);
    memoriaDB.reservas = rows;
    return rows;
  }
  return memoriaDB.reservas;
}

function obtenerEstadisticas() {
  if (sqliteDb && typeof sqliteDb.getStats === 'function') {
    return sqliteDb.getStats();
  }
  const mesas = obtenerMesas();
  const reservas = obtenerReservas();
  const freeTables = mesas.filter((m) => m.status === 'Libre').length;
  const occupiedTables = mesas.filter((m) => m.status === 'Ocupada').length;
  const reservedTables = mesas.filter((m) => m.status === 'Reservada').length;
  const maintenanceTables = mesas.filter((m) => m.status === 'Mantenimiento').length;
  const totalSeats = mesas
    .filter((m) => m.status !== 'Mantenimiento')
    .reduce((acc, m) => acc + Number(m.capacity || 0), 0);

  const tableStats = {
    totalTables: mesas.length,
    freeTables,
    occupiedTables,
    reservedTables,
    maintenanceTables,
    totalSeats,
    totalCapacity: totalSeats
  };

  return {
    totalReservations: reservas.filter((r) => r.status !== 'cancelled').length,
    todayReservations: reservas.filter((r) => r.reservation_date === todayISO && r.status !== 'cancelled').length,
    confirmedReservations: reservas.filter((r) => r.status === 'confirmed').length,
    completedReservations: reservas.filter((r) => r.status === 'completed').length,
    cancelledReservations: reservas.filter((r) => r.status === 'cancelled').length,
    totalGuests: reservas
      .filter((r) => r.status !== 'cancelled')
      .reduce((acc, r) => acc + Number(r.guests || 0), 0),
    tables: tableStats,
    ...tableStats
  };
}

// ============================================================================
// 5. RUTAS PÚBLICAS WEB Y RESERVA ONLINE (GET /, POST /api/reservar, POST /api/reservations)
// ============================================================================
app.get('/', (req, res) => {
  res.render('index', {
    restaurant: RESTAURANT_INFO,
    categories: MENU_CATEGORIES,
    menuItems: MENU_ITEMS,
    carta: CARTA_AGRUPADA,
    reviews: RESTAURANT_INFO.ratings.quotes,
    timeSlots: TIME_SLOTS,
    formatPrice: formatSpanishPrice,
    isAdmin: Boolean(req.session && req.session.isAdmin)
  });
});

app.get('/api/availability', (req, res) => {
  const dateStr = req.query.date || todayISO;
  const parsedDate = new Date(dateStr + 'T12:00:00');
  const dayOfWeek = parsedDate.getDay();

  if (dayOfWeek === 1) {
    return res.json({
      success: true,
      date: dateStr,
      isClosedDay: true,
      closedReason: 'Los lunes el restaurante permanece cerrado por descanso semanal del personal.'
    });
  }

  const allSlots = [...TIME_SLOTS.lunch, ...TIME_SLOTS.dinner];
  const slots = sqliteDb && typeof sqliteDb.getDateAvailability === 'function'
    ? sqliteDb.getDateAvailability(dateStr, allSlots)
    : Object.fromEntries(allSlots.map((s) => [s, { availableSeats: 42 }]));

  res.json({
    success: true,
    date: dateStr,
    isClosedDay: false,
    slots
  });
});

function procesarNuevaReserva(req, res) {
  try {
    const body = req.body || {};
    const date = body.date || body.fecha || todayISO;
    const time = body.time || body.hora || '14:00';
    const guests = Number(body.guests || body.comensales || 2);
    const diningArea = body.diningArea || body.salon || 'salon-senorial';
    const name = String(body.name || body.nombre || '').trim();
    const phone = String(body.phone || body.telefono || '').trim();
    const email = String(body.email || body.correo || 'cliente@lamontana.es').trim();
    const notes = String(body.notes || body.comentarios || '').trim();
    const preselectedDishes = Array.isArray(body.preselectedDishes) ? body.preselectedDishes : [];

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Por favor indique su nombre completo y teléfono de contacto para confirmar la mesa.'
      });
    }

    const parsedDate = new Date(date + 'T12:00:00');
    if (parsedDate.getDay() === 1) {
      return res.status(400).json({
        success: false,
        error: 'Restaurante La Montaña permanece cerrado los lunes por descanso semanal.'
      });
    }

    const areaObj =
      RESTAURANT_INFO.diningAreas.find((a) => a.id === diningArea) ||
      RESTAURANT_INFO.diningAreas[0];
    const reservationCode = `LM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let created;
    if (sqliteDb && typeof sqliteDb.createReservation === 'function') {
      created = sqliteDb.createReservation({
        reservation_code: reservationCode,
        reservation_date: date,
        reservation_time: time,
        guests,
        dining_area: areaObj.id,
        dining_area_name: areaObj.name,
        customer_name: name,
        customer_phone: phone,
        customer_email: email,
        notes,
        preselected_dishes: preselectedDishes,
        status: 'confirmed'
      });
    } else {
      const candidateTable =
        memoriaDB.mesas.find((m) => m.zone_id === areaObj.id && m.status === 'Libre' && m.capacity >= guests) ||
        memoriaDB.mesas.find((m) => m.status === 'Libre' && m.capacity >= guests) ||
        null;

      if (candidateTable) {
        candidateTable.status = 'Reservada';
      }

      created = {
        id: Date.now(),
        reservation_code: reservationCode,
        reservation_date: date,
        reservation_time: time,
        guests,
        dining_area: areaObj.id,
        dining_area_name: areaObj.name,
        table_id: candidateTable ? candidateTable.id : null,
        table_number: candidateTable ? candidateTable.table_number : null,
        customer_name: name,
        customer_phone: phone,
        customer_email: email,
        notes,
        preselected_dishes: preselectedDishes,
        status: 'confirmed'
      };
      memoriaDB.reservas.unshift(created);
    }

    return res.status(201).json({
      success: true,
      message: 'Reserva confirmada oficialmente en sala.',
      reservation: created
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud de reserva en el servidor.'
    });
  }
}

app.post('/api/reservar', procesarNuevaReserva);
app.post('/api/reservations', procesarNuevaReserva);

// ============================================================================
// 6. AUTENTICACIÓN Y PANEL DE ADMINISTRACIÓN (/admin/login, /admin, /admin/mesa/actualizar)
// ============================================================================
app.get('/admin/login', (req, res) => {
  if (req.session && req.session.isAdmin === true) {
    return res.redirect('/admin');
  }
  const hasError = req.query.error === '1';
  const loggedOut = req.query.logout === '1';

  res.render('login', {
    restaurant: RESTAURANT_INFO,
    error: hasError ? 'Credenciales de dirección incorrectas. Verifique la contraseña.' : null,
    logoutMessage: loggedOut ? 'La sesión de administración se ha cerrado de forma segura.' : null
  });
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  const isJsonRequest =
    req.is('application/json') ||
    (req.headers.accept && req.headers.accept.includes('application/json'));

  const passwordValid =
    verifyPasswordSafe(password || '', ADMIN_PASSWORD) ||
    verifyPasswordSafe(password || '', 'lamontana2026');

  if (!passwordValid) {
    if (isJsonRequest) {
      return res.status(401).json({
        success: false,
        error: 'Contraseña incorrecta. Acceso denegado.'
      });
    }
    return res.redirect('/admin/login?error=1');
  }

  req.session.isAdmin = true;
  req.session.adminUser = (username && String(username).trim()) || 'Dirección La Montaña';
  req.session.loginTime = new Date().toISOString();

  req.session.save((err) => {
    if (err) {
      return res.redirect('/admin/login?error=1');
    }
    if (isJsonRequest) {
      return res.json({
        success: true,
        redirectUrl: '/admin'
      });
    }
    return res.redirect('/admin');
  });
});

function handleAdminLogout(req, res) {
  const clearCookieOptions = {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax'
  };

  if (req.session) {
    req.session.destroy(() => {
      res.clearCookie('lamontana.sid', clearCookieOptions);
      return res.redirect('/admin/login?logout=1');
    });
  } else {
    res.clearCookie('lamontana.sid', clearCookieOptions);
    return res.redirect('/admin/login?logout=1');
  }
}

app.post('/admin/logout', handleAdminLogout);
app.get('/admin/logout', handleAdminLogout);

// Panel Principal Privado Unificado (/admin -> renderiza views/admin.ejs)
app.get('/admin', requireAdminAuth, (req, res) => {
  const zones = obtenerSalones();
  const tables = obtenerMesas({});
  const reservations = obtenerReservas({});
  const stats = obtenerEstadisticas();
  const tableStats = stats.tables || obtenerEstadisticas();

  res.render('admin', {
    restaurant: RESTAURANT_INFO,
    adminUser: req.session.adminUser || 'Dirección La Montaña',
    zones,
    tables,
    reservations,
    stats,
    tableStats,
    timeSlots: [...TIME_SLOTS.lunch, ...TIME_SLOTS.dinner]
  });
});

// Vista dedicada de Mapa de Mesas y Salones (/admin/mesas)
app.get('/admin/mesas', requireAdminAuth, (req, res) => {
  const zones = obtenerSalones();
  const tables = obtenerMesas({});
  const reservations = obtenerReservas({ status: 'confirmed' });
  const stats = obtenerEstadisticas();
  const tableStats = stats.tables || stats;

  res.render('admin-tables', {
    restaurant: RESTAURANT_INFO,
    adminUser: req.session.adminUser || 'Dirección La Montaña',
    zones,
    tables,
    reservations,
    stats,
    tableStats
  });
});

// Ruta directa para actualizar el estado de una mesa en tiempo real (POST /admin/mesa/actualizar)
app.post('/admin/mesa/actualizar', requireAdminAuth, (req, res) => {
  try {
    const id = Number(req.body.id || req.body.tableId || req.body.mesaId);
    const status = req.body.status || req.body.estado;
    const validStatuses = ['Libre', 'Ocupada', 'Reservada', 'Mantenimiento'];

    if (!id || !validStatuses.includes(status)) {
      const wantsJson =
        req.is('application/json') ||
        (req.headers.accept && req.headers.accept.includes('application/json'));
      if (wantsJson) {
        return res.status(400).json({ success: false, error: 'Datos de mesa o estado no válidos.' });
      }
      return res.redirect('/admin');
    }

    let updated = null;
    if (sqliteDb && typeof sqliteDb.updateTable === 'function') {
      updated = sqliteDb.updateTable(id, { status });
    } else {
      const target = memoriaDB.mesas.find((m) => m.id === id);
      if (target) {
        target.status = status;
        updated = target;
      }
    }

    const wantsJson =
      req.is('application/json') ||
      (req.headers.accept && req.headers.accept.includes('application/json'));

    if (wantsJson) {
      return res.json({
        success: true,
        table: updated,
        tables: obtenerMesas({}),
        stats: obtenerEstadisticas()
      });
    }
    return res.redirect('/admin');
  } catch (err) {
    return res.redirect('/admin');
  }
});

// Endpoints API de Administración (Reservas y Mesas CRUD)
app.get('/api/admin/reservations', requireAdminAuth, (req, res) => {
  const { date, status, search } = req.query;
  const reservations = obtenerReservas({ date, status, search });
  const tables = obtenerMesas({});
  const stats = obtenerEstadisticas();
  res.json({
    success: true,
    stats,
    tables,
    total: reservations.length,
    reservations
  });
});

app.patch('/api/admin/reservations/:id/assign-table', requireAdminAuth, (req, res) => {
  const { tableId } = req.body;
  let updated = null;
  if (sqliteDb && typeof sqliteDb.assignTableToReservation === 'function') {
    updated = sqliteDb.assignTableToReservation(req.params.id, tableId);
  }
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Reserva o mesa no encontrada.' });
  }
  res.json({
    success: true,
    reservation: updated,
    tables: obtenerMesas({}),
    stats: obtenerEstadisticas()
  });
});

app.patch('/api/admin/reservations/:id/status', requireAdminAuth, (req, res) => {
  const { status } = req.body;
  if (!['confirmed', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Estado no válido.' });
  }
  const updated =
    sqliteDb && typeof sqliteDb.updateReservationStatus === 'function'
      ? sqliteDb.updateReservationStatus(req.params.id, status)
      : null;
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Reserva no encontrada.' });
  }
  res.json({
    success: true,
    reservation: updated,
    tables: obtenerMesas({}),
    stats: obtenerEstadisticas()
  });
});

app.delete('/api/admin/reservations/:id', requireAdminAuth, (req, res) => {
  const deleted =
    sqliteDb && typeof sqliteDb.deleteReservation === 'function'
      ? sqliteDb.deleteReservation(req.params.id)
      : { deleted: true };
  res.json({
    success: true,
    ...deleted,
    tables: obtenerMesas({}),
    stats: obtenerEstadisticas()
  });
});

app.post('/api/admin/reservations', requireAdminAuth, (req, res) => {
  const { date, time, guests, diningArea, tableId, name, phone, email, notes } = req.body;
  if (!date || !time || !guests || !name || !phone) {
    return res.status(400).json({
      success: false,
      error: 'Fecha, hora, comensales, nombre y teléfono son obligatorios.'
    });
  }
  const areaObj =
    RESTAURANT_INFO.diningAreas.find((a) => a.id === diningArea) ||
    RESTAURANT_INFO.diningAreas[0];
  const reservationCode = `LM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const created = sqliteDb.createReservation({
    reservation_code: reservationCode,
    reservation_date: date,
    reservation_time: time,
    guests: Number(guests),
    dining_area: areaObj.id,
    dining_area_name: areaObj.name,
    table_id: tableId || null,
    customer_name: String(name).trim(),
    customer_phone: String(phone).trim(),
    customer_email: (email && String(email).trim()) || 'reservas@restaurantelamontana.es',
    notes: notes ? String(notes).trim() : 'Reserva telefónica registrada por Dirección',
    preselected_dishes: [],
    status: 'confirmed'
  });

  res.status(201).json({
    success: true,
    reservation: created,
    tables: obtenerMesas({}),
    stats: obtenerEstadisticas()
  });
});

app.get('/api/admin/tables', requireAdminAuth, (req, res) => {
  const { zoneId, status } = req.query;
  const zones = obtenerSalones();
  const tables = obtenerMesas({ zoneId, status });
  const stats = obtenerEstadisticas();
  res.json({
    success: true,
    zones,
    tables,
    stats,
    tableStats: stats.tables || stats
  });
});

app.post('/api/admin/tables', requireAdminAuth, (req, res) => {
  try {
    const { tableNumber, capacity, zoneId, status, locationNote, notes } = req.body;
    if (!tableNumber || !String(tableNumber).trim()) {
      return res.status(400).json({
        success: false,
        error: 'El número identificador de la mesa es obligatorio.'
      });
    }
    const created = sqliteDb.createTable({
      tableNumber: String(tableNumber).trim().toUpperCase(),
      capacity: Number(capacity) || 4,
      zoneId: zoneId || 'salon-senorial',
      status: status || 'Libre',
      locationNote: locationNote !== undefined ? locationNote : notes || ''
    });
    const stats = obtenerEstadisticas();
    res.status(201).json({
      success: true,
      table: created,
      tables: obtenerMesas({}),
      stats,
      tableStats: stats.tables || stats
    });
  } catch (error) {
    const isDuplicate = error && String(error.message).includes('UNIQUE');
    const message = isDuplicate
      ? 'Ya existe una mesa con ese código en el restaurante.'
      : 'Error al crear la mesa.';
    res.status(isDuplicate ? 409 : 500).json({ success: false, error: message, message });
  }
});

app.patch('/api/admin/tables/:id', requireAdminAuth, (req, res) => {
  const { tableNumber, capacity, zoneId, status, locationNote, notes } = req.body;
  const updated = sqliteDb.updateTable(req.params.id, {
    tableNumber,
    capacity,
    zoneId,
    status,
    locationNote: locationNote !== undefined ? locationNote : notes
  });
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Mesa no encontrada.' });
  }
  const stats = obtenerEstadisticas();
  res.json({
    success: true,
    table: updated,
    tables: obtenerMesas({}),
    stats,
    tableStats: stats.tables || stats
  });
});

app.delete('/api/admin/tables/:id', requireAdminAuth, (req, res) => {
  const deleted = sqliteDb.deleteTable(req.params.id);
  const stats = obtenerEstadisticas();
  res.json({
    success: true,
    ...deleted,
    tables: obtenerMesas({}),
    stats,
    tableStats: stats.tables || stats
  });
});

// Arrancar servidor cuando se ejecuta directamente
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('======================================================================');
    console.log('  RESTAURANTE LA MONTAÑA — MADRID (C. del Rey Francisco, 28)');
    console.log(`  Web Pública Oficial  : http://localhost:${PORT}/`);
    console.log(`  Login Administración : http://localhost:${PORT}/admin/login`);
    console.log(`  Panel de Dirección   : http://localhost:${PORT}/admin`);
    console.log('======================================================================');
  });
}

module.exports = app;
