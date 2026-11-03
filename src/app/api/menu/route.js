import { NextResponse } from 'next/server';
import { RESTAURANT_INFO, MENU_CATEGORIES, MENU_ITEMS } from '../../../../data/restaurantData';

/**
 * GET /api/menu
 * Devuelve la lista completa de platos, categorías y precios reales de La Montaña.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  let items = [...MENU_ITEMS];

  if (category && category !== 'all') {
    items = items.filter((dish) => dish.category === category);
  }

  if (search && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    items = items.filter(
      (dish) =>
        dish.name.toLowerCase().includes(q) ||
        dish.description.toLowerCase().includes(q) ||
        dish.categoryName.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    success: true,
    restaurant: RESTAURANT_INFO.name,
    currency: 'EUR',
    totalItems: items.length,
    categories: MENU_CATEGORIES,
    items
  });
}
