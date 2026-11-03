const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const menuData = {
  primeros: [
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
  ],
  segundos: [
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
  ],
  postres: [
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
};

const reservas = [];

app.get('/', (req, res) => {
  res.render('index', {
    menuData,
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
        message: 'Por favor, complete todos los campos para formalizar su reserva.'
      });
    }
    return res.redirect('/?error=1#reservas');
  }

  const nuevaReserva = {
    id: Date.now(),
    codigo: `LM-${Math.floor(1000 + Math.random() * 9000)}`,
    nombre: String(nombre).trim(),
    telefono: String(telefono).trim(),
    fecha: String(fecha).trim(),
    hora: String(hora).trim(),
    comensales: Number(comensales) || 2,
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

  return res.redirect(`/?reserva=ok&codigo=${encodeURIComponent(nuevaReserva.codigo)}#reservas`);
});

app.listen(PORT, () => {
  console.log(`Servidor de La Montaña activo en el puerto ${PORT}`);
});
