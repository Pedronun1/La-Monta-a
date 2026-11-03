import React from 'react';

export default function Footer({ info }) {
  return (
    <footer className="bg-stone-950 border-t border-stone-800 text-stone-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="font-serif text-xl font-bold text-amber-100">
            Restaurante La Montaña
          </span>
          <p className="text-xs text-stone-500 mt-1">
            {info?.address?.fullAddress || 'C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid'} · Tel:{' '}
            {info?.contact?.phone || '+34 915 47 31 11'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
          <a href="#inicio" className="hover:text-amber-400 transition">Inicio</a>
          <a href="#carta" className="hover:text-amber-400 transition">Carta y Precios</a>
          <a href="#reservas" className="hover:text-amber-400 transition">Reservar Mesa</a>
          <a href="#resenas" className="hover:text-amber-400 transition">Reseñas (4.6★)</a>
          <a href="#contacto" className="hover:text-amber-400 transition">Mapa y Contacto</a>
        </div>

        <p className="text-xs text-stone-500">
          © {new Date().getFullYear()} Restaurante La Montaña · Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
