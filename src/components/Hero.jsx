import React from 'react';

export default function Hero({ info }) {
  const hours = info?.hours || [];

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden bg-stone-950"
    >
      {/* Background High-Res Photography & Castizo Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=85"
          alt="Interior castizo y acogedor del Restaurante La Montaña en Madrid"
          className="w-full h-full object-cover object-center opacity-35 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/90 to-stone-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Brand Identity & Quick Action Buttons */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Cocina Tradicional y Ambiente Castizo · Moncloa - Argüelles
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-amber-50 leading-[1.08]">
              Restaurante <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">
                La Montaña
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-stone-200 max-w-2xl font-normal leading-relaxed">
              {info?.tagline ||
                'Tradición castiza, brasas y tapeo de autor en el corazón de Argüelles - Moncloa.'}{' '}
              Disfruta de nuestras famosas{' '}
              <strong className="text-amber-300 font-semibold">
                croquetas de jamón ibérico, huevos trufados, oreja a la plancha y cazón en adobo
              </strong>{' '}
              en un espacio histórico desde 1943.
            </p>

            {/* Location & Google Rating Pill */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-stone-300 pt-1">
              <div className="flex items-center gap-2 bg-stone-900/90 border border-stone-800 px-3.5 py-2 rounded-xl">
                <span className="text-amber-400">📍</span>
                <span>C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-900/90 border border-stone-800 px-3.5 py-2 rounded-xl">
                <span className="text-amber-400 font-bold">★ {info?.ratings?.overall || 4.6}</span>
                <span className="text-stone-400">({info?.ratings?.totalReviews || 648} reseñas en Google Maps)</span>
              </div>
            </div>

            {/* Primary CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <a
                href="#reservas"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-base shadow-xl shadow-amber-500/20 transition transform hover:-translate-y-0.5"
              >
                Reservar Mesa
              </a>
              <a
                href="#carta"
                className="px-8 py-4 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-100 border border-amber-400/40 font-semibold text-base transition"
              >
                Ver Carta y Precios
              </a>
            </div>
          </div>

          {/* Right Column: Official Google Maps Hours Card */}
          <div className="lg:col-span-5">
            <div className="bg-stone-900/90 backdrop-blur-md border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-5">
                <div>
                  <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
                    Datos Oficiales Google Maps
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-white mt-0.5">
                    Horario de Apertura
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Cocina Castiza
                </span>
              </div>

              <ul className="space-y-2.5 text-sm">
                {hours.map((h) => (
                  <li
                    key={h.day}
                    className={`flex items-center justify-between py-1.5 px-3 rounded-lg ${
                      h.open ? 'text-stone-200 bg-stone-800/40' : 'text-stone-400 bg-red-950/30'
                    }`}
                  >
                    <span className="font-semibold">{h.day}</span>
                    <span className={h.open ? 'text-amber-300 font-medium' : 'text-red-300 font-medium'}>
                      {h.shifts}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-5 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-300">
                <div>
                  <span className="block text-stone-400">Reservas telefónicas y grupos:</span>
                  <a href="tel:+34915473111" className="text-base font-bold text-amber-400 hover:underline">
                    +34 915 47 31 11
                  </a>
                </div>
                <a
                  href="#contacto"
                  className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-semibold"
                >
                  Ver en Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
