import React, { useState, useEffect } from 'react';

export default function Navbar({ preselectedCount = 0, onOpenAdmin }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-stone-950/95 backdrop-blur-md shadow-xl border-b border-amber-500/20 py-3'
          : 'bg-gradient-to-b from-stone-950/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#inicio" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-600 to-red-900 flex items-center justify-center border border-amber-400/40 shadow-lg">
            <span className="font-serif text-xl font-bold text-amber-100">LM</span>
          </div>
          <div>
            <span className="block font-serif text-xl sm:text-2xl font-bold text-amber-50 tracking-wide">
              La Montaña
            </span>
            <span className="block text-[11px] uppercase tracking-[0.2em] text-amber-400/90 font-medium">
              Rey Francisco, 28 · Madrid
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-200">
          <a href="#inicio" className="hover:text-amber-400 transition-colors">Inicio</a>
          <a href="#carta" className="hover:text-amber-400 transition-colors">La Carta y Precios</a>
          <a href="#historia" className="hover:text-amber-400 transition-colors">Espacio Castizo</a>
          <a href="#resenas" className="hover:text-amber-400 transition-colors">Opiniones (4.6★)</a>
          <a href="#contacto" className="hover:text-amber-400 transition-colors">Ubicación y Horarios</a>
        </nav>

        {/* Quick Actions */}
        <div className="hidden md:flex items-center gap-3">
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-stone-300 hover:text-amber-300 border border-stone-700 hover:border-amber-500/40 transition"
            >
              Panel Reservas
            </button>
          )}
          <a
            href="tel:+34915473111"
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-amber-300 bg-stone-900/80 border border-amber-500/30 hover:bg-stone-800 transition"
          >
            915 47 31 11
          </a>
          <a
            href="#reservas"
            className="relative px-5 py-2.5 rounded-xl text-sm font-semibold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 transition"
          >
            Reservar Mesa
            {preselectedCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-[11px] rounded-full bg-red-900 text-amber-100 font-bold">
                {preselectedCount}
              </span>
            )}
          </a>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-stone-200 hover:text-amber-400 focus:outline-none"
          aria-label="Abrir menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone-950/98 border-b border-amber-500/20 px-4 pt-3 pb-6 space-y-3">
          <a href="#inicio" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-200 hover:text-amber-400">Inicio</a>
          <a href="#carta" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-200 hover:text-amber-400">La Carta y Precios</a>
          <a href="#resenas" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-200 hover:text-amber-400">Reseñas de Google Maps</a>
          <a href="#contacto" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-200 hover:text-amber-400">Mapa y Horarios</a>
          <div className="pt-2 flex flex-col gap-2">
            <a
              href="#reservas"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl font-bold bg-amber-500 text-stone-950"
            >
              Reservar Mesa Online
            </a>
            <a
              href="tel:+34915473111"
              className="w-full text-center py-2.5 rounded-xl font-semibold border border-amber-500/40 text-amber-300"
            >
              Llamar: +34 915 47 31 11
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
