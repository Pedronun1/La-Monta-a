/**
 * ============================================================================
 * RESTAURANTE LA MONTAÑA — CAPA DE PERSISTENCIA SQLITE (node:sqlite)
 * Gestión Integral de Reservas, Salones (Zonas) y Mesas Físicas
 * C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid
 * ============================================================================
 */

const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = path.join(__dirname, 'lamontana.db');
const db = new DatabaseSync(DB_PATH);

const DEFAULT_ZONES = [
  {
    id: 'salon-senorial',
    name: 'Salón Principal (Azulejería Clásica)',
    description: 'Comedor señorial en planta calle con zócalos de azulejos clásicos madrileños y mantelería de hilo.',
    floor: 'Planta Calle'
  },
  {
    id: 'boveda-ladrillo',
    name: 'La Cueva / Bóveda (Ladrillo Visto)',
    description: 'Comedor subterráneo abovedado de ladrillo visto centenario (1943), íntimo y silencioso.',
    floor: 'Planta Subterránea (Bodega)'
  },
  {
    id: 'zona-barra-tradicional',
    name: 'Salón de Entrada & Barra Castiza',
    description: 'Zona de entrada junto a la barra tradicional para aperitivos, raciones y comidas para dos.',
    floor: 'Planta Calle · Entrada'
  }
];

function initDatabase() {
  // 1. Tabla de Zonas / Salones
  db.exec(`
    CREATE TABLE IF NOT EXISTS dining_zones (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      floor TEXT DEFAULT 'Planta Calle'
    );
  `);

  // 2. Tabla de Mesas Físicas del Restaurante
  db.exec(`
    CREATE TABLE IF NOT EXISTS restaurant_tables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_number TEXT UNIQUE NOT NULL,
      capacity INTEGER NOT NULL DEFAULT 4,
      zone_id TEXT NOT NULL,
      zone_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Libre',
      location_note TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Tabla de Reservas de Clientes (vinculada con mesa asignada)
  db.exec(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reservation_code TEXT UNIQUE NOT NULL,
      reservation_date TEXT NOT NULL,
      reservation_time TEXT NOT NULL,
      guests INTEGER NOT NULL,
      dining_area TEXT DEFAULT 'salon-senorial',
      dining_area_name TEXT DEFAULT 'Salón Principal (Azulejería Clásica)',
      table_id INTEGER DEFAULT NULL,
      table_number TEXT DEFAULT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      notes TEXT DEFAULT '',
      preselected_dishes TEXT DEFAULT '[]',
      status TEXT DEFAULT 'confirmed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Asegurar que las columnas table_id y table_number existen si la tabla ya fue creada antes
  ensureReservationTableColumns();

  // Sembrar Zonas, Mesas y Reservas iniciales si están vacías
  seedZonesAndTables();
  seedInitialReservations();
}

function ensureReservationTableColumns() {
  const cols = db.prepare('PRAGMA table_info(reservations)').all();
  const colNames = cols.map((c) => c.name);
  if (!colNames.includes('table_id')) {
    db.exec('ALTER TABLE reservations ADD COLUMN table_id INTEGER DEFAULT NULL');
  }
  if (!colNames.includes('table_number')) {
    db.exec('ALTER TABLE reservations ADD COLUMN table_number TEXT DEFAULT NULL');
  }
}

function seedZonesAndTables() {
  const zoneCount = db.prepare('SELECT COUNT(*) as total FROM dining_zones').get().total;
  if (zoneCount === 0) {
    const insertZone = db.prepare(
      'INSERT INTO dining_zones (id, name, description, floor) VALUES (?, ?, ?, ?)'
    );
    for (const z of DEFAULT_ZONES) {
      insertZone.run(z.id, z.name, z.description, z.floor);
    }
  }

  const tableCount = db.prepare('SELECT COUNT(*) as total FROM restaurant_tables').get().total;
  if (tableCount === 0) {
    const insertTable = db.prepare(`
      INSERT INTO restaurant_tables (table_number, capacity, zone_id, zone_name, status, location_note)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    // Mesas del Salón Principal (Azulejería Clásica)
    insertTable.run('M-01', 2, 'salon-senorial', 'Salón Principal (Azulejería Clásica)', 'Libre', 'Junto a ventanal Rey Francisco');
    insertTable.run('M-02', 4, 'salon-senorial', 'Salón Principal (Azulejería Clásica)', 'Reservada', 'Zócalo de azulejos clásicos');
    insertTable.run('M-03', 4, 'salon-senorial', 'Salón Principal (Azulejería Clásica)', 'Libre', 'Centro del salón señorial');
    insertTable.run('M-04', 6, 'salon-senorial', 'Salón Principal (Azulejería Clásica)', 'Ocupada', 'Mesa familiar frente a vitrina');
    insertTable.run('M-05', 2, 'salon-senorial', 'Salón Principal (Azulejería Clásica)', 'Libre', 'Rincón íntimo de azulejería');
    insertTable.run('M-06', 8, 'salon-senorial', 'Salón Principal (Azulejería Clásica)', 'Libre', 'Mesa presidencial de salón');

    // Mesas de La Cueva / Bóveda (Ladrillo Visto)
    insertTable.run('C-01', 2, 'boveda-ladrillo', 'La Cueva / Bóveda (Ladrillo Visto)', 'Reservada', 'Bajo arco de ladrillo centenario');
    insertTable.run('C-02', 4, 'boveda-ladrillo', 'La Cueva / Bóveda (Ladrillo Visto)', 'Libre', 'Centro de bóveda subterránea');
    insertTable.run('C-03', 6, 'boveda-ladrillo', 'La Cueva / Bóveda (Ladrillo Visto)', 'Reservada', 'Junto al botellero histórico 1943');
    insertTable.run('C-04', 4, 'boveda-ladrillo', 'La Cueva / Bóveda (Ladrillo Visto)', 'Libre', 'Lateral de bóveda de ladrillo');
    insertTable.run('C-05', 10, 'boveda-ladrillo', 'La Cueva / Bóveda (Ladrillo Visto)', 'Libre', 'Mesa Imperial Privada La Cueva');

    // Mesas del Salón de Entrada & Barra Castiza
    insertTable.run('B-01', 2, 'zona-barra-tradicional', 'Salón de Entrada & Barra Castiza', 'Libre', 'Mesa alta junto a barra de estaño');
    insertTable.run('B-02', 2, 'zona-barra-tradicional', 'Salón de Entrada & Barra Castiza', 'Ocupada', 'Mesa de aperitivo entrada');
    insertTable.run('B-03', 4, 'zona-barra-tradicional', 'Salón de Entrada & Barra Castiza', 'Mantenimiento', 'Mesa lateral entrada');
  }
}

function seedInitialReservations() {
  const countRow = db.prepare('SELECT COUNT(*) as total FROM reservations').get();
  if (countRow && countRow.total === 0) {
    const today = new Date().toISOString().split('T')[0];
    const tomorrowObj = new Date();
    tomorrowObj.setDate(tomorrowObj.getDate() + 1);
    const tomorrow = tomorrowObj.toISOString().split('T')[0];

    const m02 = db.prepare("SELECT id, table_number FROM restaurant_tables WHERE table_number = 'M-02'").get();
    const c01 = db.prepare("SELECT id, table_number FROM restaurant_tables WHERE table_number = 'C-01'").get();
    const c03 = db.prepare("SELECT id, table_number FROM restaurant_tables WHERE table_number = 'C-03'").get();

    const insert = db.prepare(`
      INSERT INTO reservations (
        reservation_code, reservation_date, reservation_time, guests,
        dining_area, dining_area_name, table_id, table_number,
        customer_name, customer_phone, customer_email, notes, preselected_dishes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      'LM-2026-4812',
      today,
      '14:00',
      4,
      'salon-senorial',
      'Salón Principal (Azulejería Clásica)',
      m02 ? m02.id : null,
      m02 ? m02.table_number : 'M-02',
      'Alejandro Mendoza',
      '+34 644 21 89 10',
      'amendoza@gmail.com',
      'Mesa junto al zócalo de azulejos. Un comensal celíaco.',
      JSON.stringify(['Verdinas con Carabineros', 'Croqueta de Jamón (unidad)', 'Torrija']),
      'confirmed'
    );

    insert.run(
      'LM-2026-4815',
      today,
      '21:30',
      2,
      'boveda-ladrillo',
      'La Cueva / Bóveda (Ladrillo Visto)',
      c01 ? c01.id : null,
      c01 ? c01.table_number : 'C-01',
      'Lucía Fernández Ochoa',
      '+34 619 82 34 55',
      'lucia.fo@outlook.es',
      'Cena de aniversario bajo la bóveda de ladrillo visto.',
      JSON.stringify(['Merluza de Pincho', 'Solomillo de Ternera', 'Arroz con Leche']),
      'confirmed'
    );

    insert.run(
      'LM-2026-4820',
      tomorrow,
      '14:30',
      6,
      'boveda-ladrillo',
      'La Cueva / Bóveda (Ladrillo Visto)',
      c03 ? c03.id : null,
      c03 ? c03.table_number : 'C-03',
      'Ignacio Echevarría',
      '+34 670 33 11 90',
      'i.echevarria@empresa.es',
      'Comida familiar en Argüelles. Reservan Chuletón de Vaca y Fabada.',
      JSON.stringify(['Fabada', 'Chuletón de Vaca', 'Torrija']),
      'confirmed'
    );
  }
}

function safeParseJSON(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

const dbOperations = {
  // =========================================================================
  // GESTIÓN DE ZONAS Y SALONES
  // =========================================================================
  getAllZones: () => {
    const rows = db.prepare('SELECT * FROM dining_zones ORDER BY rowid ASC').all();
    return rows.map((z) => ({
      ...z,
      architectural_style: z.floor || 'Planta Calle'
    }));
  },

  // =========================================================================
  // GESTIÓN DE MESAS FÍSICAS (CRUD COMPLETO)
  // =========================================================================
  getAllTables: ({ zoneId, status } = {}) => {
    let query = 'SELECT * FROM restaurant_tables WHERE 1=1';
    const params = [];

    if (zoneId && zoneId !== 'all') {
      query += ' AND zone_id = ?';
      params.push(zoneId);
    }

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY zone_id ASC, table_number ASC';
    const tables = db.prepare(query).all(...params);

    // Adjuntar información de la reserva activa asignada a cada mesa (si existe)
    const activeReservations = db
      .prepare(
        "SELECT id, reservation_code, customer_name, reservation_date, reservation_time, guests FROM reservations WHERE status = 'confirmed' AND table_id IS NOT NULL ORDER BY reservation_date ASC, reservation_time ASC"
      )
      .all();

    const resByTableId = {};
    for (const r of activeReservations) {
      if (!resByTableId[r.table_id]) {
        resByTableId[r.table_id] = r;
      }
    }

    return tables.map((t) => ({
      ...t,
      notes: t.location_note || '',
      activeReservation: resByTableId[t.id] || null
    }));
  },

  getTableById: (id) => {
    const row = db.prepare('SELECT * FROM restaurant_tables WHERE id = ?').get(Number(id));
    if (!row) return null;
    return { ...row, notes: row.location_note || '' };
  },

  createTable: ({ tableNumber, capacity, zoneId, status, locationNote, notes }) => {
    const cleanNumber = String(tableNumber || '').trim().toUpperCase();
    const zone =
      db.prepare('SELECT * FROM dining_zones WHERE id = ?').get(zoneId) || DEFAULT_ZONES[0];
    const finalNote = locationNote !== undefined ? locationNote : notes;

    const stmt = db.prepare(`
      INSERT INTO restaurant_tables (table_number, capacity, zone_id, zone_name, status, location_note)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      cleanNumber,
      Number(capacity) || 4,
      zone.id,
      zone.name,
      status || 'Libre',
      finalNote ? String(finalNote).trim() : ''
    );

    return dbOperations.getTableById(info.lastInsertRowid);
  },

  updateTable: (id, { tableNumber, capacity, zoneId, status, locationNote, notes }) => {
    const current = dbOperations.getTableById(id);
    if (!current) return null;

    const nextZoneId = zoneId || current.zone_id;
    const zoneObj =
      db.prepare('SELECT * FROM dining_zones WHERE id = ?').get(nextZoneId) || {
        id: current.zone_id,
        name: current.zone_name
      };

    const rawNote = locationNote !== undefined ? locationNote : notes;
    const nextNumber = tableNumber ? String(tableNumber).trim().toUpperCase() : current.table_number;
    const nextCap = capacity !== undefined ? Number(capacity) : current.capacity;
    const nextStatus = status || current.status;
    const nextNote = rawNote !== undefined ? String(rawNote).trim() : current.location_note;

    db.prepare(`
      UPDATE restaurant_tables
      SET table_number = ?, capacity = ?, zone_id = ?, zone_name = ?, status = ?, location_note = ?
      WHERE id = ?
    `).run(nextNumber, nextCap, zoneObj.id, zoneObj.name, nextStatus, nextNote, Number(id));

    // Si cambió el código de la mesa, sincronizarlo en las reservas vinculadas
    if (nextNumber !== current.table_number) {
      db.prepare('UPDATE reservations SET table_number = ? WHERE table_id = ?').run(
        nextNumber,
        Number(id)
      );
    }

    return dbOperations.getTableById(id);
  },

  deleteTable: (id) => {
    // Desvincular reservas que apuntaban a esta mesa antes de eliminarla
    db.prepare('UPDATE reservations SET table_id = NULL, table_number = NULL WHERE table_id = ?').run(
      Number(id)
    );
    db.prepare('DELETE FROM restaurant_tables WHERE id = ?').run(Number(id));
    return { deleted: true, id: Number(id) };
  },

  getTableStats: () => {
    const totalTables = db.prepare('SELECT COUNT(*) as c FROM restaurant_tables').get().c;
    const freeTables = db.prepare("SELECT COUNT(*) as c FROM restaurant_tables WHERE status = 'Libre'").get().c;
    const occupiedTables = db.prepare("SELECT COUNT(*) as c FROM restaurant_tables WHERE status = 'Ocupada'").get().c;
    const reservedTables = db.prepare("SELECT COUNT(*) as c FROM restaurant_tables WHERE status = 'Reservada'").get().c;
    const maintenanceTables = db.prepare("SELECT COUNT(*) as c FROM restaurant_tables WHERE status = 'Mantenimiento'").get().c;
    const totalSeats = db
      .prepare("SELECT COALESCE(SUM(capacity), 0) as s FROM restaurant_tables WHERE status != 'Mantenimiento'")
      .get().s;

    return {
      totalTables,
      freeTables,
      occupiedTables,
      reservedTables,
      maintenanceTables,
      totalSeats,
      totalCapacity: totalSeats
    };
  },

  // =========================================================================
  // BUSCAR MESA ÓPTIMA LIBRE PARA ASIGNACIÓN AUTOMÁTICA O SUGERIDA
  // =========================================================================
  findBestAvailableTable: (zoneId, guests, date, time) => {
    // Mesas ya reservadas en esa misma fecha y hora
    const busyRows = db
      .prepare(
        "SELECT table_id FROM reservations WHERE reservation_date = ? AND reservation_time = ? AND status != 'cancelled' AND table_id IS NOT NULL"
      )
      .all(date, time);
    const busyIds = new Set(busyRows.map((r) => r.table_id));

    // Buscar primero en el salón solicitado con capacidad >= comensales y que no esté en Mantenimiento
    const candidates = db
      .prepare(
        "SELECT * FROM restaurant_tables WHERE zone_id = ? AND capacity >= ? AND status != 'Mantenimiento' ORDER BY capacity ASC, table_number ASC"
      )
      .all(zoneId, Number(guests));

    for (const table of candidates) {
      if (!busyIds.has(table.id)) {
        return table;
      }
    }

    // Si no hay en esa zona, buscar en cualquier salón disponible
    const fallbackCandidates = db
      .prepare(
        "SELECT * FROM restaurant_tables WHERE capacity >= ? AND status != 'Mantenimiento' ORDER BY capacity ASC, table_number ASC"
      )
      .all(Number(guests));

    for (const table of fallbackCandidates) {
      if (!busyIds.has(table.id)) {
        return table;
      }
    }

    return null;
  },

  // =========================================================================
  // GESTIÓN DE RESERVAS Y ASIGNACIÓN DE MESA FÍSICA
  // =========================================================================
  getAllReservations: ({ date, status, search } = {}) => {
    let query = 'SELECT * FROM reservations WHERE 1=1';
    const params = [];

    if (date && date.trim() !== '') {
      query += ' AND reservation_date = ?';
      params.push(date.trim());
    }

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      query +=
        ' AND (customer_name LIKE ? OR customer_phone LIKE ? OR customer_email LIKE ? OR reservation_code LIKE ? OR COALESCE(table_number, "") LIKE ?)';
      params.push(term, term, term, term, term);
    }

    query += ' ORDER BY reservation_date ASC, reservation_time ASC, id DESC';
    const rows = db.prepare(query).all(...params);
    return rows.map((row) => ({
      ...row,
      preselected_dishes: safeParseJSON(row.preselected_dishes, [])
    }));
  },

  getReservationByCode: (code) => {
    if (!code) return null;
    const row = db
      .prepare('SELECT * FROM reservations WHERE UPPER(reservation_code) = UPPER(?)')
      .get(String(code).trim());
    if (!row) return null;
    return {
      ...row,
      preselected_dishes: safeParseJSON(row.preselected_dishes, [])
    };
  },

  getSlotOccupancy: (date, time) => {
    const totalSeatsRow = db
      .prepare("SELECT COALESCE(SUM(capacity), 54) as cap FROM restaurant_tables WHERE status != 'Mantenimiento'")
      .get();
    const maxCapacity = totalSeatsRow && totalSeatsRow.cap > 0 ? totalSeatsRow.cap : 54;

    const row = db
      .prepare(
        "SELECT COALESCE(SUM(guests), 0) as totalGuests, COUNT(*) as totalTables FROM reservations WHERE reservation_date = ? AND reservation_time = ? AND status != 'cancelled'"
      )
      .get(date, time);
    const occupied = row ? row.totalGuests : 0;
    return {
      totalGuests: occupied,
      totalTables: row ? row.totalTables : 0,
      maxCapacity,
      availableSeats: Math.max(0, maxCapacity - occupied)
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
    let assignedTableId = data.table_id ? Number(data.table_id) : null;
    let assignedTableNumber = data.table_number || null;
    let finalZoneId = data.dining_area || 'salon-senorial';
    let finalZoneName = data.dining_area_name || 'Salón Principal (Azulejería Clásica)';

    if (assignedTableId) {
      const tObj = dbOperations.getTableById(assignedTableId);
      if (tObj) {
        assignedTableNumber = tObj.table_number;
        finalZoneId = tObj.zone_id;
        finalZoneName = tObj.zone_name;
      }
    } else {
      // Auto-asignar mesa adecuada si hay una libre para ese turno
      const autoTable = dbOperations.findBestAvailableTable(
        finalZoneId,
        data.guests,
        data.reservation_date,
        data.reservation_time
      );
      if (autoTable) {
        assignedTableId = autoTable.id;
        assignedTableNumber = autoTable.table_number;
      }
    }

    const stmt = db.prepare(`
      INSERT INTO reservations (
        reservation_code, reservation_date, reservation_time, guests,
        dining_area, dining_area_name, table_id, table_number,
        customer_name, customer_phone, customer_email, notes, preselected_dishes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      data.reservation_code,
      data.reservation_date,
      data.reservation_time,
      Number(data.guests),
      finalZoneId,
      finalZoneName,
      assignedTableId,
      assignedTableNumber,
      data.customer_name,
      data.customer_phone,
      data.customer_email,
      data.notes || '',
      JSON.stringify(Array.isArray(data.preselected_dishes) ? data.preselected_dishes : []),
      data.status || 'confirmed'
    );

    if (assignedTableId) {
      db.prepare("UPDATE restaurant_tables SET status = 'Reservada' WHERE id = ? AND status = 'Libre'").run(
        assignedTableId
      );
    }

    return dbOperations.getReservationByCode(data.reservation_code);
  },

  assignTableToReservation: (reservationId, tableId) => {
    const resRow = db.prepare('SELECT * FROM reservations WHERE id = ?').get(Number(reservationId));
    if (!resRow) return null;

    // Si tenía una mesa anterior, comprobar si queda libre
    const prevTableId = resRow.table_id;

    if (!tableId || tableId === 'none' || tableId === '') {
      db.prepare('UPDATE reservations SET table_id = NULL, table_number = NULL WHERE id = ?').run(
        Number(reservationId)
      );
      if (prevTableId) {
        const otherActive = db
          .prepare("SELECT COUNT(*) as c FROM reservations WHERE table_id = ? AND status = 'confirmed'")
          .get(Number(prevTableId)).c;
        if (otherActive === 0) {
          db.prepare("UPDATE restaurant_tables SET status = 'Libre' WHERE id = ? AND status = 'Reservada'").run(
            Number(prevTableId)
          );
        }
      }
    } else {
      const targetTable = dbOperations.getTableById(Number(tableId));
      if (!targetTable) return null;

      db.prepare(`
        UPDATE reservations
        SET table_id = ?, table_number = ?, dining_area = ?, dining_area_name = ?
        WHERE id = ?
      `).run(
        targetTable.id,
        targetTable.table_number,
        targetTable.zone_id,
        targetTable.zone_name,
        Number(reservationId)
      );

      if (resRow.status === 'confirmed' && targetTable.status === 'Libre') {
        db.prepare("UPDATE restaurant_tables SET status = 'Reservada' WHERE id = ?").run(targetTable.id);
      }

      if (prevTableId && prevTableId !== targetTable.id) {
        const otherActive = db
          .prepare("SELECT COUNT(*) as c FROM reservations WHERE table_id = ? AND status = 'confirmed'")
          .get(Number(prevTableId)).c;
        if (otherActive === 0) {
          db.prepare("UPDATE restaurant_tables SET status = 'Libre' WHERE id = ? AND status = 'Reservada'").run(
            Number(prevTableId)
          );
        }
      }
    }

    const updated = db.prepare('SELECT * FROM reservations WHERE id = ?').get(Number(reservationId));
    return {
      ...updated,
      preselected_dishes: safeParseJSON(updated.preselected_dishes, [])
    };
  },

  updateReservationStatus: (id, status) => {
    const resRow = db.prepare('SELECT * FROM reservations WHERE id = ?').get(Number(id));
    if (!resRow) return null;

    db.prepare('UPDATE reservations SET status = ? WHERE id = ?').run(status, Number(id));

    // Sincronizar el estado de la mesa asignada si corresponde
    if (resRow.table_id) {
      if (status === 'cancelled' || status === 'completed') {
        const remaining = db
          .prepare("SELECT COUNT(*) as c FROM reservations WHERE table_id = ? AND status = 'confirmed'")
          .get(resRow.table_id).c;
        if (remaining === 0) {
          db.prepare("UPDATE restaurant_tables SET status = 'Libre' WHERE id = ? AND status = 'Reservada'").run(
            resRow.table_id
          );
        }
      } else if (status === 'confirmed') {
        db.prepare("UPDATE restaurant_tables SET status = 'Reservada' WHERE id = ? AND status = 'Libre'").run(
          resRow.table_id
        );
      }
    }

    const row = db.prepare('SELECT * FROM reservations WHERE id = ?').get(Number(id));
    return {
      ...row,
      preselected_dishes: safeParseJSON(row.preselected_dishes, [])
    };
  },

  deleteReservation: (id) => {
    const resRow = db.prepare('SELECT * FROM reservations WHERE id = ?').get(Number(id));
    db.prepare('DELETE FROM reservations WHERE id = ?').run(Number(id));
    if (resRow && resRow.table_id) {
      const remaining = db
        .prepare("SELECT COUNT(*) as c FROM reservations WHERE table_id = ? AND status = 'confirmed'")
        .get(resRow.table_id).c;
      if (remaining === 0) {
        db.prepare("UPDATE restaurant_tables SET status = 'Libre' WHERE id = ? AND status = 'Reservada'").run(
          resRow.table_id
        );
      }
    }
    return { deleted: true, id: Number(id) };
  },

  getStats: () => {
    const today = new Date().toISOString().split('T')[0];
    const totalActive = db
      .prepare("SELECT COUNT(*) as c FROM reservations WHERE status != 'cancelled'")
      .get().c;
    const todayCount = db
      .prepare("SELECT COUNT(*) as c FROM reservations WHERE reservation_date = ? AND status != 'cancelled'")
      .get(today).c;
    const confirmedCount = db
      .prepare("SELECT COUNT(*) as c FROM reservations WHERE status = 'confirmed'")
      .get().c;
    const completedCount = db
      .prepare("SELECT COUNT(*) as c FROM reservations WHERE status = 'completed'")
      .get().c;
    const cancelledCount = db
      .prepare("SELECT COUNT(*) as c FROM reservations WHERE status = 'cancelled'")
      .get().c;
    const totalGuests = db
      .prepare("SELECT COALESCE(SUM(guests), 0) as g FROM reservations WHERE status != 'cancelled'")
      .get().g;

    const tStats = dbOperations.getTableStats();
    return {
      totalReservations: totalActive,
      todayReservations: todayCount,
      confirmedReservations: confirmedCount,
      completedReservations: completedCount,
      cancelledReservations: cancelledCount,
      totalGuests,
      tables: tStats,
      ...tStats
    };
  }
};

initDatabase();

module.exports = dbOperations;
