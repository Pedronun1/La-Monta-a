import { NextResponse } from 'next/server';
import { RESTAURANT_INFO, AVAILABLE_TIME_SLOTS } from '../../../../data/restaurantData';
import db from '../../../../database';

/**
 * GET /api/info
 * Devuelve los datos de contacto, horarios oficiales y valoraciones de Google Maps.
 */
export async function GET() {
  const stats = db.getStats();
  return NextResponse.json({
    success: true,
    ...RESTAURANT_INFO,
    availableTimeSlots: AVAILABLE_TIME_SLOTS,
    liveStats: stats
  });
}
