/**
 * La Montaña — server.js
 * Punto de entrada único para producción en Render
 */
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
  index: false
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('index', {
    titulo: 'La Montaña — Cocina de altura',
    platosDestacados: [
      { nombre: 'Atún rojo de almadraba', precio: '42', desc: 'Tataki, yuzu y sal de aceituna negra.' },
      { nombre: 'Costilla de ternera 24 h', precio: '58', desc: 'Confitada a baja temperatura, puré ahumado de nabo.' },
      { nombre: 'Ostra Gillardeau', precio: '16', desc: 'Granité de manzana verde y caviar oscietra.' },
      { nombre: 'Pichón a la brasa', precio: '64', desc: 'Emulsión de sus corazones, uva al carbón.' },
      { nombre: 'Lubina salvaje', precio: '54', desc: 'Belle meunière, mousseline de alcaparras.' },
      { nombre: 'Choco negro 75%', precio: '18', desc: 'Cremoso, sal Maldon y aceite de oliva verde.' }
    ]
  });
});

app.post('/reservas', (req, res) => {
  const { nombre, email, comensales, fecha, hora } = req.body;
  console.log('Reserva recibida:', { nombre, email, comensales, fecha, hora });
  res.status(200).send(
    `<div class="py-8 text-center">
       <p class="font-serif text-2xl tracking-wide" style="color:#f4efe6">Gracias, ${nombre}.</p>
       <p class="mt-2 text-sm" style="color:#8a867d">Tu reserva para ${comensales} personas está en proceso de confirmación.</p>
     </div>`
  );
});

app.get('/health', (req, res) => res.status(200).send('ok'));

app.use((req, res) => res.status(404).render('404', { titulo: 'No encontrado' }));

app.listen(PORT, () => {
  console.log(`La Montaña corriendo en http://localhost:${PORT}`);
});
