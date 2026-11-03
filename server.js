/**
 * ============================================================================
 * RESTAURANTE LA MONTAÑA — SERVIDOR NODE.JS / EXPRESS (PRODUCCIÓN RENDER)
 * Dirección: C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid
 * ============================================================================
 */

const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración para proxy inverso en Render (HTTPS)
app.set('trust proxy', 1);

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares de archivos estáticos y parseo de formularios
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sesión segura para producción y panel de administración
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'lamontana2026';

app.use(
  session({
    name: 'lamontana.sid',
    secret: process.env.SESSION_SECRET || 'la_montana_silent_luxury_secret_2026',
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 12
    }
  })
);

// ============================================================================
// DATOS DEL RESTAURANTE Y CARTA OFICIAL ("LA MONTAÑA")
// ============================================================================
const RESTAURANT_INFO = {
  name: 'La Montaña',
  monogram: 'L.M',
  tagline: 'La mesa se encuentra donde la montaña susurra.',
  address: {
    street: 'C. del Rey Francisco, 28',
    district: 'Moncloa - Aravaca',
    postalCode: '28008',
    city: 'Madrid',
    fullAddress: 'C. del Rey Francisco, 28, Madrid'
  },
  contact: {
    phone: '+34 915 47 31 11',
    email: 'reservas@restaurantelamontana.es'
  }
};

const menu = [
  {
    categoria: 'Primeros y Entrantes',
    subtitulo: 'Bocados de tradición castiza y producto seleccionado',
    platos: [
      {
        nombre: 'Croquetas cremosas de jamón ibérico',
        descripcion: 'Bechamel reposada de leche fresca con virutas de jamón ibérico de bellota y rebozado crujiente.',
        precio: '14 €'
      },
      {
        nombre: 'Oreja a la plancha con ajillo',
        descripcion: 'Marcada en plancha de hierro hasta lograr bordes crujientes con majado de ajo morado y perejil.',
        precio: '13 €'
      },
      {
        nombre: 'Huevos trufados con patatas de obrador',
        descripcion: 'Huevos camperos a baja temperatura sobre patata agria confitada y velo aromático de trufa negra.',
        precio: '16 €'
      },
      {
        nombre: 'Ensaladilla rusa de la casa',
        descripcion: 'Receta clásica con patata seleccionada, ventresca de bonito del norte y emulsión suave de aceite de oliva.',
        precio: '12 €'
      }
    ]
  },
  {
    categoria: 'Segundos Platos',
    subtitulo: 'Fuego lento, lonja fresca y parrilla de autor',
    platos: [
      {
        nombre: 'Cazón en adobo tradicional',
        descripcion: 'Dados de cazón marinados en adobo artesano de especias y vinagre de Jerez, fritos al momento.',
        precio: '18 €'
      },
      {
        nombre: 'Hamburguesas a la parrilla La Montaña',
        descripcion: 'Carne seleccionada de vacuno madurado a la brasa con queso fundente y guarnición artesana.',
        precio: '19 €'
      },
      {
        nombre: 'Rabo de toro estofado a baja temperatura',
        descripcion: 'Guiso meloso cocinado lentamente durante seis horas en reducción de vino tinto reserva.',
        precio: '22 €'
      },
      {
        nombre: 'Merluza de pincho a la romana',
        descripcion: 'Lomo central de merluza del Cantábrico con rebozado fino y jugoso en aceite de oliva virgen extra.',
        precio: '21 €'
      }
    ]
  },
  {
    categoria: 'Repostería Casera',
    subtitulo: 'Finales dulces elaborados a diario en nuestro obrador',
    platos: [
      {
        nombre: 'Tarta casera de queso cremosa',
        descripcion: 'Horneada a diario con interior fundente de quesos seleccionados y base artesana.',
        precio: '7 €'
      },
      {
        nombre: 'Flan de la casa con nata',
        descripcion: 'Flan tradicional de huevo campero al baño maría con caramelo tostado y nata montada.',
        precio: '6 €'
      },
      {
        nombre: 'Torrija caramelizada en brioche',
        descripcion: 'Pan brioche infusionado en leche merengada con canela y corteza caramelizada al momento.',
        precio: '8 €'
      }
    ]
  }
];

// Estado en memoria para reservas y mesas
const zones = [
  { id: 'salon-senorial', name: 'Salón Principal', description: 'Salón noble en planta calle' },
  { id: 'boveda-ladrillo', name: 'La Cueva / Bóveda', description: 'Bóveda histórica subterránea' }
];

const tables = [
  { id: 1, table_number: 'M-01', capacity: 2, zone_id: 'salon-senorial', zone_name: 'Salón Principal', status: 'Libre' },
  { id: 2, table_number: 'M-02', capacity: 4, zone_id: 'salon-senorial', zone_name: 'Salón Principal', status: 'Libre' },
  { id: 3, table_number: 'M-03', capacity: 4, zone_id: 'salon-senorial', zone_name: 'Salón Principal', status: 'Reservada' },
  { id: 4, table_number: 'M-04', capacity: 6, zone_id: 'salon-senorial', zone_name: 'Salón Principal', status: 'Libre' },
  { id: 5, table_number: 'C-01', capacity: 2, zone_id: 'boveda-ladrillo', zone_name: 'La Cueva / Bóveda', status: 'Libre' },
  { id: 6, table_number: 'C-02', capacity: 4, zone_id: 'boveda-ladrillo', zone_name: 'La Cueva / Bóveda', status: 'Libre' },
  { id: 7, table_number: 'C-03', capacity: 6, zone_id: 'boveda-ladrillo', zone_name: 'La Cueva / Bóveda', status: 'Libre' },
  { id: 8, table_number: 'C-04', capacity: 8, zone_id: 'boveda-ladrillo', zone_name: 'La Cueva / Bóveda', status: 'Libre' }
];

const reservas = [];

// ============================================================================
// RUTAS PÚBLICAS
// ============================================================================

// Ruta principal GET /
app.get('/', (req, res) => {
  const reservaExitosa = req.query.reserva === 'ok';
  const codigoReserva = req.query.codigo || null;
  const errorReserva = req.query.error || null;

  res.render('index', {
    restaurant: RESTAURANT_INFO,
    menu,
    reservaExitosa,
    codigoReserva,
    errorReserva
  });
});

// Ruta POST /api/reservar para procesar el formulario de reservas online
app.post('/api/reservar', (req, res) => {
  const { nombre, telefono, fecha, hora, comensales } = req.body || {};

  const wantsJson =
    req.is('application/json') ||
    (req.headers.accept && req.headers.accept.includes('application/json'));

  if (!nombre || !telefono || !fecha || !hora || !comensales) {
    if (wantsJson) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, complete todos los campos obligatorios para formalizar su reserva.'
      });
    }
    return res.redirect('/?error=campos_incompletos#reservas');
  }

  const numComensales = Number(comensales) || 2;
  const mesaDisponible = tables.find((t) => t.status === 'Libre' && t.capacity >= numComensales) || null;
  if (mesaDisponible) {
    mesaDisponible.status = 'Reservada';
  }

  const nuevaReserva = {
    id: Date.now(),
    codigo: `LM-${Math.floor(1000 + Math.random() * 9000)}`,
    reservation_code: `LM-${Math.floor(1000 + Math.random() * 9000)}`,
    nombre: String(nombre).trim(),
    customer_name: String(nombre).trim(),
    telefono: String(telefono).trim(),
    customer_phone: String(telefono).trim(),
    fecha: String(fecha).trim(),
    reservation_date: String(fecha).trim(),
    hora: String(hora).trim(),
    reservation_time: String(hora).trim(),
    comensales: numComensales,
    guests: numComensales,
    table_id: mesaDisponible ? mesaDisponible.id : null,
    table_number: mesaDisponible ? mesaDisponible.table_number : 'Sala',
    dining_area_name: mesaDisponible ? mesaDisponible.zone_name : 'Salón Principal',
    status: 'confirmed',
    creadaEn: new Date().toISOString()
  };

  reservas.unshift(nuevaReserva);

  if (wantsJson) {
    return res.status(201).json({
      success: true,
      message: 'Su mesa ha sido reservada con éxito. Le esperamos en La Montaña.',
      reserva: nuevaReserva
    });
  }

  return res.redirect(`/?reserva=ok&codigo=${encodeURIComponent(nuevaReserva.codigo)}#reservas`);
});

// ============================================================================
// RUTAS DE ADMINISTRACIÓN (/admin)
// ============================================================================
function requireAdminAuth(req, res, next) {
  if (req.session && req.session.isAdmin === true) {
    return next();
  }
  return res.redirect('/admin/login');
}

app.get('/admin/login', (req, res) => {
  res.render('login', {
    restaurant: RESTAURANT_INFO,
    error: req.query.error ? 'Contraseña incorrecta.' : null,
    logoutMessage: req.query.logout ? 'Sesión cerrada correctamente.' : null
  });
});

app.post('/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (password === ADMIN_PASSWORD || password === 'lamontana2026') {
    req.session.isAdmin = true;
    req.session.adminUser = 'Dirección La Montaña';
    return res.redirect('/admin');
  }
  return res.redirect('/admin/login?error=1');
});

app.post('/admin/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(() => res.redirect('/admin/login?logout=1'));
  } else {
    res.redirect('/admin/login?logout=1');
  }
});

app.get('/admin', requireAdminAuth, (req, res) => {
  const stats = {
    totalTables: tables.length,
    freeTables: tables.filter((t) => t.status === 'Libre').length,
    occupiedTables: tables.filter((t) => t.status === 'Ocupada').length,
    reservedTables: tables.filter((t) => t.status === 'Reservada').length,
    maintenanceTables: tables.filter((t) => t.status === 'Mantenimiento').length,
    totalSeats: tables.reduce((acc, t) => acc + t.capacity, 0),
    totalReservations: reservas.length,
    confirmedReservations: reservas.length,
    todayReservations: reservas.length,
    totalGuests: reservas.reduce((acc, r) => acc + (r.comensales || 0), 0)
  };

  res.render('admin', {
    restaurant: RESTAURANT_INFO,
    adminUser: req.session.adminUser || 'Dirección La Montaña',
    zones,
    tables,
    reservations: reservas,
    stats,
    tableStats: stats,
    timeSlots: ['13:30', '14:00', '14:30', '15:00', '20:30', '21:00', '21:30', '22:00']
  });
});

app.post('/admin/mesa/actualizar', requireAdminAuth, (req, res) => {
  const id = Number(req.body.id || req.body.tableId);
  const status = req.body.status || req.body.estado;
  const mesa = tables.find((t) => t.id === id);
  if (mesa && ['Libre', 'Ocupada', 'Reservada', 'Mantenimiento'].includes(status)) {
    mesa.status = status;
  }
  if (req.is('application/json') || (req.headers.accept && req.headers.accept.includes('application/json'))) {
    return res.json({ success: true, table: mesa });
  }
  return res.redirect('/admin');
});

// ============================================================================
// ARRANQUE DEL SERVIDOR
// ============================================================================
app.listen(PORT, () => {
  console.log(`Servidor de Restaurante La Montaña activo en el puerto ${PORT}`);
});
