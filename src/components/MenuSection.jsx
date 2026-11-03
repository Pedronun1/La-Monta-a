import React, { useState, useMemo } from 'react';

export default function MenuSection({
  categories = [],
  items = [],
  preselectedDishes = [],
  onToggleDish
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyPopular, setOnlyPopular] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter((dish) => {
      const matchesCategory = activeCategory === 'all' || dish.category === activeCategory;
      const matchesPopular = !onlyPopular || dish.popular;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        dish.name.toLowerCase().includes(q) ||
        dish.description.toLowerCase().includes(q) ||
        dish.categoryName.toLowerCase().includes(q);
      return matchesCategory && matchesPopular && matchesSearch;
    });
  }, [items, activeCategory, onlyPopular, searchQuery]);

  const formatPrice = (value) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);

  return (
    <section id="carta" className="py-20 bg-[#FAF6F0] text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800 bg-amber-100 px-3.5 py-1.5 rounded-full">
            Carta Oficial y Precios Reales · C. del Rey Francisco, 28
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 mt-4">
            Nuestra Carta Castiza
          </h2>
          <p className="text-stone-600 mt-3 text-base sm:text-lg">
            Recetas de toda la vida elaboradas con producto de mercado, desde nuestras emblemáticas
            raciones para compartir hasta hamburguesas de vaca madurada y postres artesanos.
          </p>
        </div>

        {/* Category Filter Tabs & Search */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeCategory === 'all'
                  ? 'bg-red-900 text-amber-50 shadow-md'
                  : 'bg-white text-stone-700 hover:bg-amber-50 border border-stone-200'
              }`}
            >
              Toda la Carta ({items.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  activeCategory === cat.id
                    ? 'bg-red-900 text-amber-50 shadow-md'
                    : 'bg-white text-stone-700 hover:bg-amber-50 border border-stone-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar croquetas, oreja, trufados, cazón..."
              className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-sm focus:outline-none focus:border-red-900 min-w-[260px]"
            />
            <button
              onClick={() => setOnlyPopular(!onlyPopular)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition ${
                onlyPopular
                  ? 'bg-amber-500 text-stone-950 border-amber-500'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
            >
              ★ Platos Estrella
            </button>
          </div>
        </div>

        {/* Dish Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredItems.map((dish) => {
            const isSelected = preselectedDishes.includes(dish.shortName || dish.name);
            return (
              <article
                key={dish.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition duration-300 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden bg-stone-200">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  {dish.badge && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-stone-950/85 text-amber-300 backdrop-blur-sm">
                      {dish.badge}
                    </span>
                  )}
                  <div className="absolute bottom-3 right-3 bg-red-900 text-white px-3.5 py-1.5 rounded-xl shadow-lg font-serif font-bold text-lg">
                    {formatPrice(dish.price)}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-amber-800 font-semibold uppercase tracking-wider mb-1">
                      <span>{dish.categoryName}</span>
                      <span>{dish.unit}</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-stone-900 leading-snug">
                      {dish.name}
                    </h3>
                    <p className="text-stone-600 text-sm mt-2.5 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-stone-100 space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span>
                        {dish.halfPrice
                          ? `Media ración disponible: ${formatPrice(dish.halfPrice)}`
                          : 'Elaboración al momento'}
                      </span>
                      <span>⏱ {dish.prepTime}</span>
                    </div>

                    {onToggleDish && (
                      <button
                        type="button"
                        onClick={() => onToggleDish(dish.shortName || dish.name)}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                          isSelected
                            ? 'bg-emerald-700 text-white'
                            : 'bg-stone-100 hover:bg-amber-100 text-stone-800'
                        }`}
                      >
                        {isSelected
                          ? '✓ Preseleccionado para la reserva'
                          : '+ Incluir en mi reserva de mesa'}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
