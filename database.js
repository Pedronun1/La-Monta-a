/**
 * ============================================================================
 * RESTAURANTE LA MONTAÑA — MÓDULO DE PERSISTENCIA EN MEMORIA / SQLITE
 * C. del Rey Francisco, 28, Madrid
 * ============================================================================
 */

const reservas = [];

function getAllReservations() {
  return reservas;
}

function createReservation(data) {
  const item = {
    id: Date.now(),
    ...data,
    created_at: new Date().toISOString()
  };
  reservas.unshift(item);
  return item;
}

module.exports = {
  getAllReservations,
  createReservation
};
