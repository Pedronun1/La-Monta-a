/**
 * La Montaña — server.js
 * Punto de entrada único. Listo para producción (Render, etc.)
 */
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Cabeceras de seguridad básicas ---
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// --- Motor de vistas EJS con rutas absolutas ---
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// --- Estáticos ---
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
  index: false
}));

// --- Body parsing ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- Datos de la carta (producción: sustituir por base de datos) ---
const carta = {
  entrantes: [
    { nombre: 'Ostra Gillardeau Nº2', precio: '18', desc: 'Granité de manzana verde y caviar oscietra.' },
    { nombre: 'Atún rojo de almadraba', precio: '26', desc: 'Tataki, yuzu, sal de aceituna negra y brotes de shiso.' },
    { nombre: 'Croqueta de pichón', precio: '14', desc: 'Bechamel trufada, emulsión de sus corazones.' },
    { nombre: 'Vieira de las Rías', precio: '22', desc: 'Brasa suave, pil-pil de azafrán y limón asado.' }
  ],
  segundos: [
    { nombre: 'Costilla de ternera 24 h', precio: '58', desc: 'Confitada a baja temperatura, puré ahumado de nabo.' },
    { nombre: 'Lubina salvaje', precio: '54', desc: 'Belle meunière, mousseline de alcaparras y limón confitado.' },
    { nombre: 'Pichón a la brasa', precio: '64', desc: 'Emulsión de sus corazones, uva al carbón y jugo especiado.' },
    { nombre: 'Arroz de montaña', precio: '38', desc: 'Caldo de asados, setas de temporada y romero ahumado.' }
  ],
  postres: [
    { nombre: 'Choco negro 75%', precio: '16', desc: 'Cremoso, sal Maldon y aceite de oliva verde.' },
    { nombre: 'Milhojas de miel y trigo', precio: '14', desc: 'Crema de vainilla de Papantla, hojaldre crujiente.' },
    { nombre: 'Sorbete de granada', precio: '10', desc: 'Escarcha de hinojo silvestre y merengue quemado.' },
    { nombre: 'Soufflé de turrón', precio: '15', desc: 'Servido en 15 minutos, helado de leche merengada.' }
  ]
};

// --- Rutas ---
app.get('/', (req, res) => {
  res.render('index', {
    titulo: 'LA MONTAÑA — Cocina de altura',
    carta
  });
});

app.post('/api/reservar', (req, res) => {
  const { nombre, email, fecha, hora, comensales } = req.body;

  // Validación mínima del lado del servidor
  if (!nombre || !email || !fecha || !hora || !comensales) {
    return res.status(400).send(
      `<p class="text-sm tracking-wide" style="color:#d4af37">Por favor, completa todos los campos.</p>`
    );
  }

  // TODO producción: persistir en base de datos o enviar email
  console.log('[RESERVA]', { nombre, email, fecha, hora, comensales });

  // Respuesta HTML para HTMX (sin recarga de página)
  res.status(200).send(`
    <div class="py-6 text-center">
      <p class="font-serif text-2xl" style="color:#f4efe6">Gracias, ${nombre}.</p>
      <p class="mt-2 text-sm font-light" style="color:#8a867d">
        Tu solicitud para ${comensales} persona(s) el ${fecha} a las ${hora} está en proceso de confirmación.
      </p>
    </div>`
  );
});

app.get('/health', (req, res) => res.status(200).send('ok'));

app.use((req, res) => res.status(404).send('No encontrado'));

app.listen(PORT, () => {
  console.log(`LA MONTAÑA corriendo en http://localhost:${PORT}`);
});
