/**
 * RESTAURANTE LA MONTAÑA — SERVIDOR BACKEND RESTful API (Node.js + Express + SQLite)
 * Ubicación: C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid
 * Teléfono: +34 915 47 31 11
 *
 * Endpoints principales:
 *   - GET  /api/menu               -> Carta completa, categorías y precios exactos
 *   - GET  /api/info               -> Datos de contacto, dirección, horarios, mapa y reseñas Google Maps
 *   - POST /api/reservations       -> Crear y persistir nueva reserva de mesa con validación en tiempo real
 *   - GET  /api/reservations       -> Consultar reservas almacenadas
 *   - GET  /api/reservations/:code -> Consultar reserva por código único (ej. LM-2026-4812)
 *   - GET  /api/availability       -> Disponibilidad de plazas en tiempo real por fecha y hora
 */

const express = require('express');
const path = require('path');
const db = require('./database');
const {
  RESTAURANT_INFO,
  MENU_CATEGORIES,
  MENU_ITEMS,
  AVAILABLE_TIME_SLOTS
} = require('./data/restaurantData');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS y JSON
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del Frontend React + Tailwind CSS
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================================
// 1. GET /api/menu — Devuelve la lista completa de platos, categorías y precios reales
// ============================================================================
app.get('/api/menu', (req, res) => {
  try {
    const { category, search, popular } = req.query;
    let filteredItems = [...MENU_ITEMS];

    if (category && category !== 'all') {
      filteredItems = filteredItems.filter((item) => item.category === category);
    }

    if (popular === 'true') {
      filteredItems = filteredItems.filter((item) => item.popular);
    }

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      filteredItems = filteredItems.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.categoryName.toLowerCase().includes(q)
      );
    }

    const groupedByCategory = MENU_CATEGORIES.map((cat) => ({
      ...cat,
      items: filteredItems.filter((item) => item.category === cat.id)
    }));

    res.json({
      success: true,
      restaurant: RESTAURANT_INFO.name,
      currency: 'EUR',
      totalItems: filteredItems.length,
      categories: MENU_CATEGORIES,
      items: filteredItems,
      groupedByCategory
    });
  } catch (error) {
    console.error('Error en GET /api/menu:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al obtener la carta del restaurante.'
    });
  }
});

// ============================================================================
// 2. GET /api/info — Devuelve datos de contacto, horarios y valoraciones de Google Maps
// ============================================================================
app.get('/api/info', (req, res) => {
  try {
    const stats = db.getStats();
    res.json({
      success: true,
      ...RESTAURANT_INFO,
      availableTimeSlots: AVAILABLE_TIME_SLOTS,
      liveStats: stats
    });
  } catch (error) {
    console.error('Error en GET /api/info:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al obtener la información del establecimiento.'
    });
  }
});

// ============================================================================
// 3. GET /api/availability — Disponibilidad de mesas en tiempo real por fecha
// ============================================================================
app.get('/api/availability', (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const allSlots = [...AVAILABLE_TIME_SLOTS.lunch, ...AVAILABLE_TIME_SLOTS.dinner];
    const availability = db.getDateAvailability(date, allSlots);

    // Comprobar si es lunes (descanso semanal)
    const parsedDate = new Date(`${date}T12:00:00`);
    const isMonday = parsedDate.getDay() === 1;

    res.json({
      success: true,
      date,
      isClosedDay: isMonday,
      closedReason: isMonday ? 'Los lunes permanecemos cerrados por descanso semanal. Abrimos de martes a domingo.' : null,
      timeSlots: AVAILABLE_TIME_SLOTS,
      slots: availability
    });
  } catch (error) {
    console.error('Error en GET /api/availability:', error);
    res.status(500).json({
      success: false,
      error: 'Error al consultar la disponibilidad de mesas.'
    });
  }
});

// ============================================================================
// 4. POST /api/reservations — Recibe, valida, procesa y almacena las reservas
// ============================================================================
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

    // Validación de Fecha
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      errors.date = 'Selecciona una fecha válida para tu reserva (YYYY-MM-DD).';
    } else {
      const selectedDateObj = new Date(`${date}T12:00:00`);
      if (selectedDateObj.getDay() === 1) {
        errors.date = 'Los lunes permanecemos cerrados por descanso semanal. Por favor, elige de martes a domingo.';
      }
    }

    // Validación de Hora
    const validTimes = [...AVAILABLE_TIME_SLOTS.lunch, ...AVAILABLE_TIME_SLOTS.dinner];
    if (!time || !validTimes.includes(time)) {
      errors.time = 'Selecciona una hora válida dentro de nuestro horario de comidas o cenas.';
    }

    // Validación de Comensales
    const numGuests = Number(guests);
    if (!numGuests || Number.isNaN(numGuests) || numGuests < 1 || numGuests > 16) {
      errors.guests = 'El número de comensales debe estar entre 1 y 16 personas (para grupos mayores llámanos al 915 47 31 11).';
    }

    // Validación de Nombre
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      errors.name = 'Introduce tu nombre y apellidos (mínimo 3 caracteres).';
    }

    // Validación de Teléfono
    const cleanPhone = phone ? String(phone).replace(/\s+/g, '') : '';
    if (!cleanPhone || !/^\+?[0-9]{9,15}$/.test(cleanPhone)) {
      errors.phone = 'Introduce un número de teléfono válido (mínimo 9 dígitos).';
    }

    // Validación de Email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      errors.email = 'Introduce un correo electrónico válido para enviarte el resguardo de reserva.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        error: Object.values(errors)[0],
        validationErrors: errors
      });
    }

    // Comprobar aforo disponible en ese turno
    const occupancy = db.getSlotOccupancy(date, time);
    if (occupancy.availableSeats < numGuests) {
      return res.status(409).json({
        success: false,
        error: `Lo sentimos, para las ${time}h del día ${date} solo quedan ${occupancy.availableSeats} plazas disponibles online. Por favor selecciona otro turno horario o llámanos al 915 47 31 11.`
      });
    }

    // Resolver nombre de zona del restaurante
    const selectedAreaObj =
      RESTAURANT_INFO.diningAreas.find((a) => a.id === diningArea) ||
      RESTAURANT_INFO.diningAreas[0];

    // Generar código único de reserva (#LM-YYYY-XXXX)
    const year = new Date().getFullYear();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const reservationCode = `LM-${year}-${randomDigits}`;

    const created = db.createReservation({
      reservation_code: reservationCode,
      reservation_date: date,
      reservation_time: time,
      guests: numGuests,
      dining_area: selectedAreaObj.id,
      dining_area_name: selectedAreaObj.name,
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      customer_email: email.trim().toLowerCase(),
      notes: notes ? String(notes).trim() : '',
      preselected_dishes: Array.isArray(preselectedDishes) ? preselectedDishes : [],
      status: 'confirmed'
    });

    console.log(
      `✅ [La Montaña] Nueva reserva confirmada ${reservationCode}: ${created.customer_name} (${numGuests} pax) el ${date} a las ${time}h en ${selectedAreaObj.name}`
    );

    res.status(201).json({
      success: true,
      message: '¡Mesa reservada con éxito en Restaurante La Montaña!',
      reservationCode,
      reservation: created
    });
  } catch (error) {
    console.error('Error en POST /api/reservations:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno al procesar la reserva en el servidor.'
    });
  }
});

// ============================================================================
// 5. GET /api/reservations — Listado de reservas y consulta por código
// ============================================================================
app.get('/api/reservations', (req, res) => {
  try {
    const { date, status, search } = req.query;
    const reservations = db.getAllReservations({ date, status, search });
    const stats = db.getStats();
    res.json({
      success: true,
      total: reservations.length,
      stats,
      reservations
    });
  } catch (error) {
    console.error('Error en GET /api/reservations:', error);
    res.status(500).json({
      success: false,
      error: 'Error al consultar las reservas.'
    });
  }
});

app.get('/api/reservations/:code', (req, res) => {
  try {
    const reservation = db.getReservationByCode(req.params.code);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: `No hemos encontrado ninguna reserva con el código "${req.params.code}".`
      });
    }
    res.json({
      success: true,
      reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al buscar la reserva.'
    });
  }
});

app.patch('/api/reservations/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!['confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Estado no válido. Valores permitidos: confirmed, completed, cancelled.'
      });
    }
    const updated = db.updateReservationStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Reserva no encontrada.' });
    }
    res.json({
      success: true,
      reservation: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el estado de la reserva.'
    });
  }
});

app.delete('/api/reservations/:id', (req, res) => {
  try {
    const result = db.deleteReservation(req.params.id);
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar la reserva.'
    });
  }
});

// Ruta raíz y fallback para SPA React (compatible con Express 4 y 5)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('====================================================================');
    console.log('🍷 RESTAURANTE LA MONTAÑA — FULL-STACK SERVER ACTIVO');
    console.log('📍 C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid');
    console.log('📞 Teléfono de Reservas: +34 915 47 31 11');
    console.log(`🌐 Aplicación Web (React + Tailwind): http://localhost:${PORT}`);
    console.log(`📡 API Carta:       http://localhost:${PORT}/api/menu`);
    console.log(`📡 API Información: http://localhost:${PORT}/api/info`);
    console.log(`📡 API Reservas:    http://localhost:${PORT}/api/reservations`);
    console.log('====================================================================');
  });
}

module.exports = app;
