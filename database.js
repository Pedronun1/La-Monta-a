/**
 * RESTAURANTE LA MONTAÑA — CAPA DE PERSISTENCIA SQLITE (node:sqlite)
 * Ubicación: C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid
 * Archivo de base de datos persistente: lamontana.db
 */

const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = path.join(__dirname, 'lamontana.db');
const db = new DatabaseSync(DB_PATH);

const MAX_GUESTS_PER_SLOT = 32; // Capacidad máxima reservable online por turno horario

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reservation_code TEXT UNIQUE NOT NULL,
      reservation_date TEXT NOT NULL,
      reservation_time TEXT NOT NULL,
      guests INTEGER NOT NULL,
      dining_area TEXT DEFAULT 'salon-castizo',
      dining_area_name TEXT DEFAULT 'Salón Principal Castizo',
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      notes TEXT DEFAULT '',
      preselected_dishes TEXT DEFAULT '[]',
      status TEXT DEFAULT 'confirmed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedInitialReservations();
}

function seedInitialReservations() {
  const countRow = db.prepare('SELECT COUNT(*) as total FROM reservations').get();
  if (countRow && countRow.total === 0) {
    const today = new Date().toISOString().split('T')[0];
    const tomorrowObj = new Date();
    tomorrowObj.setDate(tomorrowObj.getDate() + 1);
    const tomorrow = tomorrowObj.toISOString().split('T')[0];

    const insert = db.prepare(`
      INSERT INTO reservations (
        reservation_code, reservation_date, reservation_time, guests,
        dining_area, dining_area_name, customer_name, customer_phone,
        customer_email, notes, preselected_dishes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      'LM-2026-4812',
      today,
      '14:00',
      4,
      'salon-castizo',
      'Salón Principal Castizo',
      'Alejandro Mendoza',
      '+34 644 21 89 10',
      'amendoza@gmail.com',
      'Queremos probar los huevos trufados y las croquetas de jamón ibérico. Un comensal celíaco.',
      JSON.stringify(['Croquetas de Jamón Ibérico', 'Huevos Trufados', 'Oreja a la Plancha']),
      'confirmed'
    );

    insert.run(
      'LM-2026-4815',
      today,
      '21:30',
      2,
      'cueva-bodega',
      'Cueva Abovedada de Ladrillo (Bodega)',
      'Lucía Fernández Ochoa',
      '+34 619 82 34 55',
      'lucia.fo@outlook.es',
      'Cena de aniversario en mesa tranquila de la cueva.',
      JSON.stringify(['Combo Castizo Rey Francisco', 'Torrija Caramelizada Casera']),
      'confirmed'
    );

    insert.run(
      'LM-2026-4820',
      tomorrow,
      '14:30',
      6,
      'cueva-bodega',
      'Cueva Abovedada de Ladrillo (Bodega)',
      'Ignacio Echevarría',
      '+34 670 33 11 90',
      'i.echevarria@empresa.es',
      'Comida familiar en Argüelles. Sin alergias.',
      JSON.stringify(['Croquetas de Jamón Ibérico', 'Cazón en Adobo', 'Burger La Montaña Trufada']),
      'confirmed'
    );

    console.log('🍷 Base de datos SQLite (lamontana.db) inicializada con reservas de ejemplo para Restaurante La Montaña.');
  }
}

const dbOperations = {
  getAllReservations: ({ date, status, search } = {}) => {
    let query = 'SELECT * FROM reservations WHERE 1=1';
    const params = [];

    if (date) {
      query += ' AND reservation_date = ?';
      params.push(date);
    }

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      query += ' AND (customer_name LIKE ? OR customer_phone LIKE ? OR customer_email LIKE ? OR reservation_code LIKE ?)';
      params.push(term, term, term, term);
    }

    query += ' ORDER BY reservation_date ASC, reservation_time ASC, id DESC';
    const rows = db.prepare(query).all(...params);
    return rows.map((row) => ({
      ...row,
      preselected_dishes: safeParseJSON(row.preselected_dishes, [])
    }));
  },

  getReservationByCode: (code) => {
    const row = db
      .prepare('SELECT * FROM reservations WHERE UPPER(reservation_code) = UPPER(?)')
      .get(code.trim());
    if (!row) return null;
    return {
      ...row,
      preselected_dishes: safeParseJSON(row.preselected_dishes, [])
    };
  },

  getSlotOccupancy: (date, time) => {
    const row = db
      .prepare(
        "SELECT COALESCE(SUM(guests), 0) as totalGuests, COUNT(*) as totalTables FROM reservations WHERE reservation_date = ? AND reservation_time = ? AND status != 'cancelled'"
      )
      .get(date, time);
    return {
      totalGuests: row ? row.totalGuests : 0,
      totalTables: row ? row.totalTables : 0,
      maxCapacity: MAX_GUESTS_PER_SLOT,
      availableSeats: Math.max(0, MAX_GUESTS_PER_SLOT - (row ? row.totalGuests : 0))
    };
  },

  getDateAvailability: (date, allSlots) => {
    const result = {};
    for (const slot of allSlots) {
      result[slot] = dbOperations.getSlotOccupancy(date, slot);
    }
    return result;
  },

  createReservation: (data) => {
    const stmt = db.prepare(`
      INSERT INTO reservations (
        reservation_code, reservation_date, reservation_time, guests,
        dining_area, dining_area_name, customer_name, customer_phone,
        customer_email, notes, preselected_dishes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      data.reservation_code,
      data.reservation_date,
      data.reservation_time,
      Number(data.guests),
      data.dining_area || 'salon-castizo',
      data.dining_area_name || 'Salón Principal Castizo',
      data.customer_name,
      data.customer_phone,
      data.customer_email,
      data.notes || '',
      JSON.stringify(Array.isArray(data.preselected_dishes) ? data.preselected_dishes : []),
      data.status || 'confirmed'
    );

    return dbOperations.getReservationByCode(data.reservation_code);
  },

  updateReservationStatus: (id, status) => {
    db.prepare('UPDATE reservations SET status = ? WHERE id = ?').run(status, Number(id));
    const row = db.prepare('SELECT * FROM reservations WHERE id = ?').get(Number(id));
    if (!row) return null;
    return {
      ...row,
      preselected_dishes: safeParseJSON(row.preselected_dishes, [])
    };
  },

  deleteReservation: (id) => {
    db.prepare('DELETE FROM reservations WHERE id = ?').run(Number(id));
    return { deleted: true, id: Number(id) };
  },

  getStats: () => {
    const today = new Date().toISOString().split('T')[0];
    const totalReservations = db.prepare("SELECT COUNT(*) as c FROM reservations WHERE status != 'cancelled'").get().c;
    const todayReservations = db.prepare("SELECT COUNT(*) as c FROM reservations WHERE reservation_date = ? AND status != 'cancelled'").get(today).c;
    const totalGuests = db.prepare("SELECT COALESCE(SUM(guests), 0) as g FROM reservations WHERE status != 'cancelled'").get().g;
    return {
      totalReservations,
      todayReservations,
      totalGuests
    };
  }
};

function safeParseJSON(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

initDatabase();

module.exports = dbOperations;
