/**
 * ============================================================================
 * RESTAURANTE LA MONTAÑA — SERVIDOR FULL-STACK (NODE.JS + EXPRESS + EJS)
 * Dirección: C. del Rey Francisco, 28, 28008 Madrid
 * ============================================================================
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración para proxy inverso en Render (HTTPS)
app.set('trust proxy', 1);

// Motor de plantillas EJS y carpeta de vistas en la raíz absoluta
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares para archivos estáticos y formularios
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ============================================================================
// CARTA DINÁMICA DEL RESTAURANTE (PRIMEROS, SEGUNDOS Y POSTRES)
// ============================================================================
const menu = [
  {
    categoria: 'Primeros y Entrantes',
    subtitulo: 'Recetario clásico y producto seleccionado de temporada',
    platos: [
      {
        nombre: 'Croquetas cremosas de jamón ibérico',
        descripcion: 'Bechamel reposada de leche fresca con virutas de jamón ibérico de bellota y rebozado crujiente.',
        precio: '14 €'
      },
      {
        nombre: 'Oreja a la plancha con ajillo',
        descripcion: 'Marcada en plancha de hierro hasta lograr bordes crujientes con majado suave de ajo morado y perejil.',
        precio: '13 €'
      },
      {
        nombre: 'Huevos trufados con patatas de obrador',
        descripcion: 'Huevos camperos a baja temperatura sobre patata agria confitada y aroma de trufa negra.',
        precio: '16 €'
      },
      {
        nombre: 'Ensaladilla rusa de la casa',
        descripcion: 'Receta tradicional con patata seleccionada, ventresca de bonito del norte y emulsión suave de aceite de oliva.',
        precio: '12 €'
      }
    ]
  },
  {
    categoria: 'Segundos Platos',
    subtitulo: 'Cocina de fuego lento, lonja fresca y parrilla',
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
    categoria: 'Postres Caseros',
    subtitulo: 'Repostería artesana elaborada a diario en casa',
    platos: [
      {
        nombre: 'Tarta casera de queso cremosa',
        descripcion: 'Horneada a diario con corazón fundente de quesos seleccionados y base artesana.',
        precio: '7 €'
      },
      {
        nombre: 'Flan de la casa con nata',
        descripcion: 'Flan tradicional de huevo campero al baño maría con caramelo tostado y nata montada.',
        precio: '6 €'
      },
      {
        nombre: 'Torrija caramelizada en brioche',
        descripcion: 'Pan brioche infusionado en leche aromatizada con canela y corteza caramelizada al momento.',
        precio: '8 €'
      }
    ]
  }
];

// ============================================================================
// REGISTRO DE RESERVAS EN MEMORIA (CON DATOS INICIALES DE EJEMPLO)
// ============================================================================
const hoy = new Date().toISOString().split('T')[0];

const reservas = [
  {
    id: 1001,
    codigo: 'LM-4821',
    nombre: 'Carlos Mendoza',
    telefono: '629 410 882',
    fecha: hoy,
    hora: '14:00',
    comensales: 4,
    estado: 'Confirmada',
    creadaEn: new Date().toISOString()
  },
  {
    id: 1002,
    codigo: 'LM-5190',
    nombre: 'Elena Valdés',
    telefono: '648 912 301',
    fecha: hoy,
    hora: '21:00',
    comensales: 2,
    estado: 'Confirmada',
    creadaEn: new Date().toISOString()
  }
];

// ============================================================================
// 1. RUTAS PÚBLICAS (WEB PRINCIPAL Y FORMULARIO DE RESERVAS)
// ============================================================================

app.get('/', (req, res) => {
  res.render('index', {
    menu,
    reservaExitosa: req.query.reserva === 'ok',
    codigoReserva: req.query.codigo || null,
    errorReserva: req.query.error || null
  });
});

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
    return res.redirect('/?error=1#reservas');
  }

  const nuevaReserva = {
    id: Date.now(),
    codigo: 'LM-' + Math.floor(1000 + Math.random() * 9000),
    nombre: String(nombre).trim(),
    telefono: String(telefono).trim(),
    fecha: String(fecha).trim(),
    hora: String(hora).trim(),
    comensales: Number(comensales) || 2,
    estado: 'Confirmada',
    creadaEn: new Date().toISOString()
  };

  reservas.unshift(nuevaReserva);

  if (wantsJson) {
    return res.status(201).json({
      success: true,
      message: 'Su mesa ha sido reservada con éxito en La Montaña.',
      reserva: nuevaReserva
    });
  }

  return res.redirect('/?reserva=ok&codigo=' + encodeURIComponent(nuevaReserva.codigo) + '#reservas');
});

// ============================================================================
// 2. RUTA PRIVADA DEL RESTAURANTE (PANEL DE RESERVAS EN /admin/reservas)
// ============================================================================

function renderAdminPanel(req, res) {
  res.render('admin', {
    reservas
  });
}

app.get('/admin/reservas', renderAdminPanel);
app.get('/admin', renderAdminPanel);

// Actualizar el estado de una reserva desde el panel interno
app.post('/admin/reservas/:id/estado', (req, res) => {
  const id = Number(req.params.id);
  const { estado } = req.body || {};
  const estadosValidos = ['Confirmada', 'En Mesa', 'Completada', 'Cancelada'];

  const item = reservas.find((r) => r.id === id);
  if (item && estadosValidos.includes(estado)) {
    item.estado = estado;
  }

  if (req.is('application/json') || (req.headers.accept && req.headers.accept.includes('application/json'))) {
    return res.json({ success: true, reserva: item });
  }
  return res.redirect('/admin/reservas');
});

// ============================================================================
// ARRANQUE DEL SERVIDOR
// ============================================================================
app.listen(PORT, () => {
  console.log(`Servidor de Restaurante La Montaña activo en el puerto ${PORT}`);
});
