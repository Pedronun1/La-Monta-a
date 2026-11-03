/**
 * ============================================================================
 * RESTAURANTE LA MONTAÑA — SERVIDOR FULL-STACK DE PRODUCCIÓN
 * C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid | Tel: 915 47 31 11
 * Stack: Node.js + Express + EJS + express-session + SQLite (node:sqlite)
 * ============================================================================
 */

const express = require('express');
const session = require('express-session');
const path = require('path');
const crypto = require('crypto');
const db = require('./database');
const {
  RESTAURANT_INFO,
  MENU_CATEGORIES,
  MENU_ITEMS,
  TIME_SLOTS
} = require('./data/restaurantData');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Seguridad y Credenciales de Administración
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'lamontana2026';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const SESSION_SECRET =
  process.env.SESSION_SECRET || 'la-montana-rey-francisco-28-secret-session-2026';

// Configuración del Motor de Vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// cabeceras de seguridad y parseo de peticiones
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Sesiones de Servidor con express-session (Cookie HttpOnly firmada)
app.use(
  session({
    name: 'lamontana.sid',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 12 // 12 horas de sesión activa
    }
  })
);

// Archivos estáticos públicos (CSS, JS, imágenes, iconos)
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// ============================================================================
// MIDDLEWARE DE SEGURIDAD ESTRICTA PARA EL PANEL DE ADMINISTRACIÓN
// ============================================================================
function verifyPasswordSafe(inputPassword, expectedPassword) {
  if (typeof inputPassword !== 'string') return false;
  const inputHash = crypto.createHash('sha256').update(inputPassword).digest();
  const expectedHash = crypto.createHash('sha256').update(expectedPassword).digest();
  return crypto.timingSafeEqual(inputHash, expectedHash);
}

function requireAdminAuth(req, res, next) {
  if (req.session && req.session.isAdmin === true) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    return next();
  }

  // Si es una petición AJAX / API JSON, devolver 401 con instrucción de redirección
  const acceptsJson =
    req.xhr ||
    (req.headers.accept && req.headers.accept.includes('application/json')) ||
    req.path.startsWith('/api/');

  if (acceptsJson) {
    return res.status(401).json({
      success: false,
      error: 'Sesión no iniciada o expirada. Inicie sesión para acceder al panel.',
      redirectUrl: '/admin/login'
    });
  }

  // Redirección obligatoria a la pantalla de login si intenta entrar a /admin sin sesión
  return res.redirect('/admin/login');
}

// ============================================================================
// RUTAS DE AUTENTICACIÓN Y PANEL DE ADMINISTRACIÓN PROTEGIDO (/admin)
// ============================================================================

// 1. Pantalla de Login del Administrador (GET /admin/login)
app.get('/admin/login', (req, res) => {
  if (req.session && req.session.isAdmin === true) {
    return res.redirect('/admin');
  }

  const errorMsg = req.query.error
    ? 'Credenciales de acceso incorrectas. Verifique la contraseña de administración.'
    : null;
  const logoutMsg = req.query.logout
    ? 'La sesión se ha cerrado de forma segura.'
    : null;

  res.setHeader('Cache-Control', 'no-store');
  res.render('admin-login', {
    restaurant: RESTAURANT_INFO,
    error: errorMsg,
    logoutMessage: logoutMsg
  });
});

// 2. Procesamiento de Login (POST /admin/login)
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  const isJsonRequest =
    req.is('application/json') ||
    (req.headers.accept && req.headers.accept.includes('application/json'));

  const userOk =
    !username ||
    username.trim().toLowerCase() === ADMIN_USER.toLowerCase() ||
    username.trim().toLowerCase() === 'direccion@restaurantelamontana.es';

  const passwordOk = verifyPasswordSafe(password || '', ADMIN_PASSWORD);

  if (!userOk || !passwordOk) {
    if (isJsonRequest) {
      return res.status(401).json({
        success: false,
        error: 'Contraseña incorrecta. Acceso denegado al panel privado.'
      });
    }
    return res.redirect('/admin/login?error=1');
  }

  // Autenticación exitosa: registrar sesión segura
  req.session.isAdmin = true;
  req.session.adminUser = (username && username.trim()) || 'Dirección La Montaña';
  req.session.loginTime = new Date().toISOString();

  req.session.save(() => {
    if (isJsonRequest) {
      return res.json({
        success: true,
        message: 'Autenticación verificada correctamente.',
        redirectUrl: '/admin'
      });
    }
    return res.redirect('/admin');
  });
});

// 3. Cerrar Sesión y Destruir Cookie de Sesión (POST & GET /admin/logout)
function handleAdminLogout(req, res) {
  const isJsonRequest =
    req.is('application/json') ||
    (req.headers.accept && req.headers.accept.includes('application/json'));

  if (req.session) {
    req.session.destroy(() => {
      res.clearCookie('lamontana.sid', { path: '/' });
      if (isJsonRequest) {
        return res.json({ success: true, redirectUrl: '/admin/login?logout=1' });
      }
      return res.redirect('/admin/login?logout=1');
    });
  } else {
    res.clearCookie('lamontana.sid', { path: '/' });
    return res.redirect('/admin/login?logout=1');
  }
}

app.post('/admin/logout', handleAdminLogout);
app.get('/admin/logout', handleAdminLogout);

// 4. Panel de Administración Privado (GET /admin) — ABSOLUTAMENTE PROTEGIDO
app.get('/admin', requireAdminAuth, (req, res) => {
  const reservations = db.getAllReservations({});
  const stats = db.getStats();

  res.render('admin-dashboard', {
    restaurant: RESTAURANT_INFO,
    adminUser: req.session.adminUser || 'Dirección La Montaña',
    loginTime: req.session.loginTime,
    reservations,
    stats,
    timeSlots: [...TIME_SLOTS.lunch, ...TIME_SLOTS.dinner]
  });
});

// ============================================================================
// API PRIVADA DE ADMINISTRACIÓN (PROTEGIDA CON SESIÓN)
// ============================================================================

app.get('/api/admin/reservations', requireAdminAuth, (req, res) => {
  try {
    const { date, status, search } = req.query;
    const reservations = db.getAllReservations({ date, status, search });
    const stats = db.getStats();
    res.json({
      success: true,
      stats,
      total: reservations.length,
      reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener las reservas desde la base de datos.'
    });
  }
});

app.patch('/api/admin/reservations/:id/status', requireAdminAuth, (req, res) => {
  try {
    const { status } = req.body;
    if (!['confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Estado no válido. Use confirmed, completed o cancelled.'
      });
    }
    const updated = db.updateReservationStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Reserva no encontrada.' });
    }
    res.json({
      success: true,
      reservation: updated,
      stats: db.getStats()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el estado de la reserva.'
    });
  }
});

app.delete('/api/admin/reservations/:id', requireAdminAuth, (req, res) => {
  try {
    const deleted = db.deleteReservation(req.params.id);
    res.json({
      success: true,
      ...deleted,
      stats: db.getStats()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar la reserva.'
    });
  }
});

app.post('/api/admin/reservations', requireAdminAuth, (req, res) => {
  try {
    const { date, time, guests, diningArea, name, phone, email, notes } = req.body;
    if (!date || !time || !guests || !name || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Fecha, hora, comensales, nombre y teléfono son obligatorios.'
      });
    }

    const areaObj =
      RESTAURANT_INFO.diningAreas.find((a) => a.id === diningArea) ||
      RESTAURANT_INFO.diningAreas[0];
    const year = new Date().getFullYear();
    const reservationCode = `LM-${year}-${Math.floor(1000 + Math.random() * 9000)}`;

    const created = db.createReservation({
      reservation_code: reservationCode,
      reservation_date: date,
      reservation_time: time,
      guests: Number(guests),
      dining_area: areaObj.id,
      dining_area_name: areaObj.name,
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      customer_email: (email && email.trim()) || 'reservas@restaurantelamontana.es',
      notes: notes ? notes.trim() : 'Reserva telefónica registrada por Dirección',
      preselected_dishes: [],
      status: 'confirmed'
    });

    res.status(201).json({
      success: true,
      reservation: created,
      stats: db.getStats()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al crear la reserva manual.'
    });
  }
});

// ============================================================================
// RUTAS PÚBLICAS WEB Y API RESTful PARA CLIENTES
// ============================================================================

// Vista Principal Pública (GET /)
app.get('/', (req, res) => {
  res.render('index', {
    restaurant: RESTAURANT_INFO,
    categories: MENU_CATEGORIES,
    menuItems: MENU_ITEMS,
    timeSlots: TIME_SLOTS
  });
});

// GET /api/menu — Lista completa de platos, categorías y precios
app.get('/api/menu', (req, res) => {
  const { category, search } = req.query;
  let items = [...MENU_ITEMS];

  if (category && category !== 'all') {
    items = items.filter((item) => item.category.toLowerCase() === category.toLowerCase());
  }

  if (search && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    restaurant: RESTAURANT_INFO.name,
    currency: 'EUR',
    totalItems: items.length,
    categories: MENU_CATEGORIES,
    items
  });
});

// GET /api/info — Datos de contacto, horarios y valoraciones
app.get('/api/info', (req, res) => {
  res.json({
    success: true,
    ...RESTAURANT_INFO,
    timeSlots: TIME_SLOTS
  });
});

// GET /api/availability — Disponibilidad de plazas en tiempo real por fecha
app.get('/api/availability', (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];
  const allSlots = [...TIME_SLOTS.lunch, ...TIME_SLOTS.dinner];
  const slots = db.getDateAvailability(date, allSlots);
  const parsedDate = new Date(`${date}T12:00:00`);
  const isMonday = parsedDate.getDay() === 1;

  res.json({
    success: true,
    date,
    isClosedDay: isMonday,
    closedReason: isMonday
      ? 'Los lunes permanecemos cerrados por descanso semanal. Abrimos de martes a domingo.'
      : null,
    timeSlots: TIME_SLOTS,
    slots
  });
});

// POST /api/reservations — Recibe, valida y almacena nuevas reservas de clientes
app.post('/api/reservations', (req, res) => {
  try {
    const {
      date,
      time,
      guests,
      diningArea,
      name,
      phone,
      email,
      notes,
      preselectedDishes
    } = req.body;

    const errors = {};

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      errors.date = 'Seleccione una fecha válida.';
    } else {
      const dObj = new Date(`${date}T12:00:00`);
      if (dObj.getDay() === 1) {
        errors.date =
          'Los lunes permanecemos cerrados por descanso semanal. Por favor, seleccione de martes a domingo.';
      }
    }

    const validTimes = [...TIME_SLOTS.lunch, ...TIME_SLOTS.dinner];
    if (!time || !validTimes.includes(time)) {
      errors.time = 'Seleccione un turno horario disponible.';
    }

    const numGuests = Number(guests);
    if (!numGuests || numGuests < 1 || numGuests > 16) {
      errors.guests = 'Seleccione entre 1 y 16 comensales.';
    }

    if (!name || String(name).trim().length < 3) {
      errors.name = 'Introduzca su nombre y apellidos completos.';
    }

    const cleanPhone = phone ? String(phone).replace(/\s+/g, '') : '';
    if (!cleanPhone || !/^\+?[0-9]{9,15}$/.test(cleanPhone)) {
      errors.phone = 'Introduzca un teléfono de contacto válido (mínimo 9 dígitos).';
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      errors.email = 'Introduzca un correo electrónico válido.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        error: Object.values(errors)[0],
        validationErrors: errors
      });
    }

    const occupancy = db.getSlotOccupancy(date, time);
    if (occupancy.availableSeats < numGuests) {
      return res.status(409).json({
        success: false,
        error: `Para el turno de las ${time}h del ${date} solo quedan ${occupancy.availableSeats} plazas disponibles online. Seleccione otra hora o llámenos al 915 47 31 11.`
      });
    }

    const areaObj =
      RESTAURANT_INFO.diningAreas.find((a) => a.id === diningArea) ||
      RESTAURANT_INFO.diningAreas[0];

    const year = new Date().getFullYear();
    const reservationCode = `LM-${year}-${Math.floor(1000 + Math.random() * 9000)}`;

    const created = db.createReservation({
      reservation_code: reservationCode,
      reservation_date: date,
      reservation_time: time,
      guests: numGuests,
      dining_area: areaObj.id,
      dining_area_name: areaObj.name,
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      customer_email: email.trim().toLowerCase(),
      notes: notes ? String(notes).trim() : '',
      preselected_dishes: Array.isArray(preselectedDishes) ? preselectedDishes : [],
      status: 'confirmed'
    });

    res.status(201).json({
      success: true,
      message: 'Reserva confirmada en Restaurante La Montaña.',
      reservationCode,
      reservation: created
    });
  } catch (error) {
    console.error('Error en POST /api/reservations:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno al registrar su reserva.'
    });
  }
});

// GET /api/reservations/:code — Consulta pública de resguardo por código
app.get('/api/reservations/:code', (req, res) => {
  const reservation = db.getReservationByCode(req.params.code);
  if (!reservation) {
    return res.status(404).json({
      success: false,
      error: `No se encontró ninguna reserva con el código ${req.params.code}.`
    });
  }
  res.json({
    success: true,
    reservation: {
      reservation_code: reservation.reservation_code,
      reservation_date: reservation.reservation_date,
      reservation_time: reservation.reservation_time,
      guests: reservation.guests,
      dining_area_name: reservation.dining_area_name,
      customer_name: reservation.customer_name,
      status: reservation.status
    }
  });
});

// Arranque del Servidor
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('====================================================================');
    console.log('🍷 RESTAURANTE LA MONTAÑA — SERVIDOR ACTIVO');
    console.log('📍 C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid');
    console.log(`🌐 Web Pública Gastronómica: http://localhost:${PORT}`);
    console.log(`🔐 Panel Privado Protegido:  http://localhost:${PORT}/admin`);
    console.log(`🔑 Login Administración:     http://localhost:${PORT}/admin/login`);
    console.log(`🛡️ Contraseña Admin Activa:  ${ADMIN_PASSWORD} (configurable vía ADMIN_PASSWORD)`);
    console.log('====================================================================');
  });
}

module.exports = app;
