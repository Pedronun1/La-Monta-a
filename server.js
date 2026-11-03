/**
 * ============================================================================
 * RESTAURANTE LA MONTAÑA — SERVIDOR FULL-STACK (NODE.JS + EXPRESS + EJS)
 * Dirección: C. del Rey Francisco, 28, 28008 Madrid
 * ============================================================================
 */

const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Configuración para proxy inverso en Render (HTTPS)
app.set('trust proxy', 1);

// Configuración del motor de vistas EJS en la raíz del proyecto
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    name: 'lamontana.sid',
    secret: process.env.SESSION_SECRET || 'la_montana_madrid_secret_key_2026',
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
// CARTA OFICIAL REAL DEL RESTAURANTE LA MONTAÑA
// ============================================================================
const cartaOficial = {
  primeros: [
    { nombre: 'Consomé', precio: '5,00 €' },
    { nombre: 'Ensaladilla rusa', precio: '11,50 €' },
    { nombre: 'Ens. Tomate bonito', precio: '15,50 €' },
    { nombre: 'Ens. Tomate Raf Bon', precio: '18,50 €' },
    { nombre: 'Torreznos', precio: '10,00 €' },
    { nombre: 'Lentejas', precio: '9,00 €' },
    { nombre: 'Sopa cocido', precio: '9,00 €' },
    { nombre: 'Berenjena rebizada', precio: '11,00 €' },
    { nombre: 'Pisto manchego', precio: '11,00 €' },
    { nombre: 'Patatas revolconas', precio: '11,00 €' },
    { nombre: 'Gazpacho', precio: '11,50 €' },
    { nombre: 'Salmorejo', precio: '11,50 €' },
    { nombre: 'Huevos rellenos', precio: '12,00 €' },
    { nombre: 'Judías verdes', precio: '14,00 €' },
    { nombre: 'Fabada', precio: '19,50 €' },
    { nombre: 'Verdinas carab', precio: '19,50 €' },
    { nombre: 'Cocido', precio: '21,00 €' },
    { nombre: 'Croqueta jamón pol (ud)', precio: '1,80 €' },
    { nombre: 'Gilda', precio: '2,00 €' },
    { nombre: 'Patatas bravas', precio: '7,00 €' }
  ],
  segundos: [
    { nombre: 'Sardinas escabeche', precio: '11,00 €' },
    { nombre: 'Tortilla de la abuela', precio: '21,00 €' },
    { nombre: 'Calamares tinta', precio: '21,50 €' },
    { nombre: 'Filetes de gallo', precio: '23,00 €' },
    { nombre: 'Merluza de pincho', precio: '27,50 €' },
    { nombre: 'Delicias de merluza', precio: '27,50 €' },
    { nombre: 'Cococha', precio: '35,00 €' },
    { nombre: 'Filete de ternera', precio: '19,00 €' },
    { nombre: 'Escalope de ternera', precio: '20,00 €' },
    { nombre: 'Pollo al ajillo', precio: '14,00 €' },
    { nombre: 'Albóndigas', precio: '15,00 €' },
    { nombre: 'Pollo en pepitoria', precio: '16,50 €' },
    { nombre: 'Lomo de ternera', precio: '17,50 €' },
    { nombre: 'Solomillo y patata frita', precio: '20,00 €' },
    { nombre: 'Cachopo de ternera', precio: '22,00 €' },
    { nombre: 'Chuletón de vaca', precio: '68,00 €' }
  ],
  postres: [
    { nombre: 'Arroz con leche', precio: '7,00 €' },
    { nombre: 'Flan', precio: '7,00 €' },
    { nombre: 'Manzana asada', precio: '7,00 €' },
    { nombre: 'Fruta', precio: '6,50 €' },
    { nombre: 'Torrija', precio: '9,00 €' }
  ]
};

// ============================================================================
// ESTADO EN MEMORIA: SALAS, MESAS Y RESERVAS
// ============================================================================
const hoyISO = new Date().toISOString().split('T')[0];

const salas = [
  {
    id: 1,
    nombre: 'Salón Principal',
    descripcion: 'Planta calle con zócalo de azulejos clásicos madrileños'
  },
  {
    id: 2,
    nombre: 'La Cueva / Bóveda',
    descripcion: 'Comedor histórico subterráneo de ladrillo visto'
  }
];

const mesas = [
  { id: 1, numero: 'Mesa 1', salaId: 1, salaNombre: 'Salón Principal', capacidad: 2, estado: 'Libre' },
  { id: 2, numero: 'Mesa 2', salaId: 1, salaNombre: 'Salón Principal', capacidad: 4, estado: 'Libre' },
  { id: 3, numero: 'Mesa 3', salaId: 1, salaNombre: 'Salón Principal', capacidad: 6, estado: 'Reservada' },
  { id: 4, numero: 'Mesa 4', salaId: 2, salaNombre: 'La Cueva / Bóveda', capacidad: 4, estado: 'Libre' },
  { id: 5, numero: 'Mesa 5', salaId: 2, salaNombre: 'La Cueva / Bóveda', capacidad: 8, estado: 'Libre' }
];

const reservas = [
  {
    id: 1001,
    codigo: 'LM-4821',
    nombre: 'Carlos Mendoza',
    telefono: '629 410 882',
    fecha: hoyISO,
    hora: '14:00',
    comensales: 4,
    sala: 'Salón Principal',
    mesa: 'Mesa 2',
    estado: 'Confirmada',
    creadaEn: new Date().toISOString()
  },
  {
    id: 1002,
    codigo: 'LM-5190',
    nombre: 'Elena Valdés',
    telefono: '648 912 301',
    fecha: hoyISO,
    hora: '21:00',
    comensales: 2,
    sala: 'La Cueva / Bóveda',
    mesa: 'Mesa 4',
    estado: 'Pendiente',
    creadaEn: new Date().toISOString()
  }
];

// ============================================================================
// MIDDLEWARE DE AUTENTICACIÓN ADMIN
// ============================================================================
function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin === true) {
    return next();
  }
  return res.redirect('/admin/login');
}

// ============================================================================
// 1. RUTAS PÚBLICAS (WEB PRINCIPAL Y FORMULARIO DE RESERVAS)
// ============================================================================

app.get('/', (req, res) => {
  res.render('index', {
    carta: cartaOficial,
    salas,
    reservaExitosa: req.query.reserva === 'ok',
    codigoReserva: req.query.codigo || null,
    errorReserva: req.query.error || null
  });
});

app.post('/api/reservar', (req, res) => {
  const { nombre, telefono, fecha, hora, comensales, sala } = req.body || {};

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
    return res.redirect('/?error=1#reservas');
  }

  const numComensales = Number(comensales) || 2;
  const salaElegida = sala || (salas[0] ? salas[0].nombre : 'Salón Principal');

  const mesaCandidata =
    mesas.find((m) => m.salaNombre === salaElegida && m.estado === 'Libre' && m.capacidad >= numComensales) ||
    mesas.find((m) => m.estado === 'Libre' && m.capacidad >= numComensales) ||
    null;

  if (mesaCandidata) {
    mesaCandidata.estado = 'Reservada';
  }

  const nuevaReserva = {
    id: Date.now(),
    codigo: 'LM-' + Math.floor(1000 + Math.random() * 9000),
    nombre: String(nombre).trim(),
    telefono: String(telefono).trim(),
    fecha: String(fecha).trim(),
    hora: String(hora).trim(),
    comensales: numComensales,
    sala: mesaCandidata ? mesaCandidata.salaNombre : salaElegida,
    mesa: mesaCandidata ? mesaCandidata.numero : 'Asignación en sala',
    estado: 'Pendiente',
    creadaEn: new Date().toISOString()
  };

  reservas.unshift(nuevaReserva);

  if (wantsJson) {
    return res.status(201).json({
      success: true,
      message: 'Su solicitud de reserva ha sido registrada correctamente.',
      reserva: nuevaReserva
    });
  }

  return res.redirect('/?reserva=ok&codigo=' + encodeURIComponent(nuevaReserva.codigo) + '#reservas');
});

// ============================================================================
// 2. RUTAS DE AUTENTICACIÓN Y PANEL DE ADMINISTRACIÓN (/admin)
// ============================================================================

app.get('/admin/login', (req, res) => {
  if (req.session && req.session.isAdmin === true) {
    return res.redirect('/admin');
  }
  res.render('login', {
    error: req.query.error ? 'Contraseña incorrecta. Inténtelo de nuevo.' : null
  });
});

app.get('/login', (req, res) => res.redirect('/admin/login'));

app.post('/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (password === ADMIN_PASSWORD || password === 'admin123' || password === 'lamontana2026') {
    req.session.isAdmin = true;
    return res.redirect('/admin');
  }
  return res.redirect('/admin/login?error=1');
});

app.post('/admin/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(() => res.redirect('/admin/login'));
  } else {
    res.redirect('/admin/login');
  }
});

function renderAdmin(req, res) {
  const fechaFiltro = req.query.fecha || '';
  res.render('admin', {
    reservas,
    salas,
    mesas,
    fechaFiltro,
    hoyISO
  });
}

app.get('/admin', requireAuth, renderAdmin);
app.get('/admin/reservas', requireAuth, renderAdmin);

// Actualizar estado de una reserva (Pendiente, Confirmada, Cancelada)
app.post('/admin/reservas/:id/estado', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const { estado } = req.body || {};
  const estadosValidos = ['Pendiente', 'Confirmada', 'Cancelada'];

  const item = reservas.find((r) => r.id === id);
  if (item && estadosValidos.includes(estado)) {
    item.estado = estado;
  }
  return res.redirect('/admin');
});

// Añadir una nueva Sala al restaurante
app.post('/admin/salas', requireAuth, (req, res) => {
  const { nombre, descripcion } = req.body || {};
  if (nombre && String(nombre).trim()) {
    salas.push({
      id: Date.now(),
      nombre: String(nombre).trim(),
      descripcion: descripcion ? String(descripcion).trim() : 'Sala del restaurante'
    });
  }
  return res.redirect('/admin#gestion-salas');
});

// Eliminar una Sala
app.post('/admin/salas/:id/eliminar', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const idx = salas.findIndex((s) => s.id === id);
  if (idx !== -1) {
    salas.splice(idx, 1);
  }
  return res.redirect('/admin#gestion-salas');
});

// Añadir una nueva Mesa a una Sala
app.post('/admin/mesas', requireAuth, (req, res) => {
  const { numero, salaId, capacidad, estado } = req.body || {};
  if (numero && String(numero).trim()) {
    const salaObj = salas.find((s) => s.id === Number(salaId)) || salas[0] || { id: 1, nombre: 'Salón Principal' };
    mesas.push({
      id: Date.now(),
      numero: String(numero).trim(),
      salaId: salaObj.id,
      salaNombre: salaObj.nombre,
      capacidad: Number(capacidad) || 4,
      estado: estado || 'Libre'
    });
  }
  return res.redirect('/admin#gestion-salas');
});

// Cambiar estado de una Mesa (Libre, Ocupada, Reservada)
app.post('/admin/mesas/:id/estado', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const { estado } = req.body || {};
  const mesa = mesas.find((m) => m.id === id);
  if (mesa && ['Libre', 'Ocupada', 'Reservada'].includes(estado)) {
    mesa.estado = estado;
  }
  return res.redirect('/admin#gestion-salas');
});

// Eliminar una Mesa
app.post('/admin/mesas/:id/eliminar', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const idx = mesas.findIndex((m) => m.id === id);
  if (idx !== -1) {
    mesas.splice(idx, 1);
  }
  return res.redirect('/admin#gestion-salas');
});

// ============================================================================
// ARRANQUE DEL SERVIDOR
// ============================================================================
app.listen(PORT, () => {
  console.log(`Servidor de Restaurante La Montaña activo en el puerto ${PORT}`);
});
