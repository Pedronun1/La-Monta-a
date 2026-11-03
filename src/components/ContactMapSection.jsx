import React from 'react';

export default function ContactMapSection({ info }) {
  const address = info?.address || {};
  const contact = info?.contact || {};
  const hours = info?.hours || [];

  return (
    <section id="contacto" className="py-20 bg-stone-900 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            Visítanos en Moncloa - Aravaca
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-3">
            Ubicación, Contacto y Horarios
          </h2>
          <p className="text-stone-400 mt-3">
            A un paso del Paseo del Pintor Rosales, Templo de Debod y Plaza de España.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 bg-stone-950 rounded-3xl p-8 border border-stone-800 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  Dirección Oficial
                </span>
                <h3 className="font-serif text-2xl font-bold text-white mt-1">
                  Restaurante La Montaña
                </h3>
                <p className="text-stone-300 mt-1">
                  {address.fullAddress || 'C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
                  <span className="text-xs text-stone-400 block">Teléfono de Reservas</span>
                  <a
                    href={`tel:${contact.phoneClean || '+34915473111'}`}
                    className="text-lg font-bold text-amber-400 hover:underline mt-1 block"
                  >
                    {contact.phone || '+34 915 47 31 11'}
                  </a>
                </div>
                <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
                  <span className="text-xs text-stone-400 block">Correo Electrónico</span>
                  <a
                    href={`mailto:${contact.email || 'reservas@restaurantelamontana.es'}`}
                    className="text-sm font-semibold text-stone-200 hover:text-amber-300 mt-1 block truncate"
                  >
                    {contact.email || 'reservas@restaurantelamontana.es'}
                  </a>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2.5">
                  Cómo llegar en Transporte Público
                </span>
                <ul className="space-y-2 text-xs text-stone-300">
                  {(address.nearbyTransport || []).map((t, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-stone-900/70 px-3 py-2 rounded-lg">
                      <strong className="text-amber-200">{t.type} · {t.line}</strong>
                      <span>{t.station}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
                  Horario Semanal
                </span>
                <div className="space-y-1.5 text-xs">
                  {hours.map((h) => (
                    <div key={h.day} className="flex justify-between py-1 border-b border-stone-800/70">
                      <span className="font-semibold text-stone-300">{h.day}</span>
                      <span className={h.open ? 'text-amber-300' : 'text-red-400'}>{h.shifts}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <a
              href={
                address.googleMapsUrl ||
                'https://www.google.com/maps/search/?api=1&query=Calle+del+Rey+Francisco+28+28008+Madrid'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-center text-sm transition block"
            >
              Abrir Cómo Llegar en Google Maps ↗
            </a>
          </div>

          {/* Interactive Google Maps Embed Column */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl min-h-[460px] bg-stone-950">
            <iframe
              title="Mapa de ubicación del Restaurante La Montaña en C. del Rey Francisco, 28, Madrid"
              src={
                address.googleMapsEmbedUrl ||
                'https://www.google.com/maps?q=Calle+del+Rey+Francisco,+28,+28008+Madrid&output=embed'
              }
              className="w-full h-full min-h-[460px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
