import React from 'react';

export default function ReviewsSection({ ratings, reviews = [] }) {
  return (
    <section id="resenas" className="py-20 bg-[#FAF6F0] text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800 bg-amber-100 px-3.5 py-1.5 rounded-full">
            Valoraciones Verificadas en Google Maps
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 mt-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-stone-600 mt-3">
            Más de {ratings?.totalReviews || 648} comensales destacan nuestro ambiente castizo en
            Moncloa, la amabilidad del servicio y la calidad de nuestras raciones caseras.
          </p>
        </div>

        {/* Summary Card + Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Google Score Breakdown */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-8 border border-stone-200 shadow-md">
            <div className="flex items-center gap-4 border-b border-stone-100 pb-6">
              <div className="text-5xl font-serif font-bold text-stone-900">
                {ratings?.overall || 4.6}
              </div>
              <div>
                <div className="text-amber-500 text-xl tracking-wider">★★★★★</div>
                <p className="text-xs text-stone-500 mt-1">
                  Basado en {ratings?.totalReviews || 648} reseñas reales en Google Maps
                </p>
              </div>
            </div>

            <div className="space-y-2.5 my-6">
              {(ratings?.distribution || []).map((bar) => (
                <div key={bar.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-8 font-bold text-stone-700">{bar.stars} ★</span>
                  <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${bar.percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-stone-500">{bar.percentage}%</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-stone-100">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                Lo más mencionado:
              </span>
              <div className="flex flex-wrap gap-2">
                {(ratings?.highlights || []).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs bg-amber-50 text-amber-900 border border-amber-200 font-medium"
                  >
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Customer Review Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <article
                key={rev.id}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-red-900 text-amber-100 font-bold flex items-center justify-center text-sm">
                        {rev.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-900 text-sm">{rev.author}</h3>
                        <span className="text-xs text-stone-500 block">{rev.badge}</span>
                      </div>
                    </div>
                    <span className="text-xs text-stone-400">{rev.date}</span>
                  </div>

                  <div className="text-amber-500 text-sm mb-2">★★★★★</div>

                  <p className="text-stone-700 text-sm leading-relaxed">“{rev.text}”</p>
                </div>

                {rev.dishMentioned && (
                  <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-amber-800 font-semibold">
                    🍽️ Platos destacados: {rev.dishMentioned}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
