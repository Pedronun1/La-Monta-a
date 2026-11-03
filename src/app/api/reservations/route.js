import { NextResponse } from 'next/server';
import db from '../../../../database';
import { RESTAURANT_INFO, AVAILABLE_TIME_SLOTS } from '../../../../data/restaurantData';

/**
 * GET /api/reservations
 * Devuelve las reservas registradas en la base de datos SQLite.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  const reservations = db.getAllReservations({ date, status, search });
  return NextResponse.json({
    success: true,
    total: reservations.length,
    reservations
  });
}

/**
 * POST /api/reservations
 * Recibe, valida en tiempo real y almacena las reservas de mesa de los clientes.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { date, time, guests, diningArea, name, phone, email, notes, preselectedDishes } = body;

    const validTimes = [...AVAILABLE_TIME_SLOTS.lunch, ...AVAILABLE_TIME_SLOTS.dinner];
    if (!date || !time || !validTimes.includes(time) || !guests || !name || !phone || !email) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos obligatorios deben estar completos.' },
        { status: 400 }
      );
    }

    const selectedArea =
      RESTAURANT_INFO.diningAreas.find((a) => a.id === diningArea) || RESTAURANT_INFO.diningAreas[0];

    const year = new Date().getFullYear();
    const reservationCode = `LM-${year}-${Math.floor(1000 + Math.random() * 9000)}`;

    const created = db.createReservation({
      reservation_code: reservationCode,
      reservation_date: date,
      reservation_time: time,
      guests: Number(guests),
      dining_area: selectedArea.id,
      dining_area_name: selectedArea.name,
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      customer_email: email.trim(),
      notes: notes || '',
      preselected_dishes: preselectedDishes || [],
      status: 'confirmed'
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Reserva confirmada en Restaurante La Montaña',
        reservationCode,
        reservation: created
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error interno al guardar la reserva.' },
      { status: 500 }
    );
  }
}
