import React, { useState, useEffect } from 'react';

export default function ReservationSection({
  info,
  preselectedDishes = [],
  onRemoveDish,
  onReservationSuccess
}) {
  const getInitialDate = () => {
    const d = new Date();
    if (d.getDay() === 1) {
      d.setDate(d.getDate() + 1); // Si hoy es lunes, sugerimos martes
    }
    return d.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    date: getInitialDate(),
    time: '14:00',
    guests: 2,
    diningArea: 'salon-castizo',
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  const [availability, setAvailability] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [confirmedReservation, setConfirmedReservation] = useState(null);

  useEffect(() => {
    if (!formData.date) return;
    fetch(`/api/availability?date=${formData.date}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAvailability(data);
      })
      .catch(() => {});
  }, [formData.date]);

  const validateField = (field, value) => {
    const nextErrors = { ...errors };
    if (field === 'date') {
      const d = new Date(`${value}T12:00:00`);
      if (d.getDay() === 1) {
        nextErrors.date = 'Los lunes permanecemos cerrados por descanso semanal.';
      } else {
        delete nextErrors.date;
      }
    }
    if (field === 'name') {
      if (!value || value.trim().length < 3) {
        nextErrors.name = 'Introduce tu nombre y apellidos.';
      } else {
        delete nextErrors.name;
      }
    }
    if (field === 'phone') {
      const clean = String(value).replace(/\s+/g, '');
      if (!/^\+?[0-9]{9,15}$/.test(clean)) {
        nextErrors.phone = 'Introduce un teléfono válido de al menos 9 dígitos.';
      } else {
        delete nextErrors.phone;
      }
    }
    if (field === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())) {
        nextErrors.email = 'Introduce un correo electrónico válido.';
      } else {
        delete nextErrors.email;
      }
    }
    setErrors(nextErrors);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          preselectedDishes
        })
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setServerError(data.error || 'Error al procesar la reserva.');
        if (data.validationErrors) setErrors(data.validationErrors);
      } else {
        setConfirmedReservation(data.reservation);
        if (onReservationSuccess) onReservationSuccess(data.reservation);
      }
    } catch (err) {
      setServerError('Error de conexión con el servidor de reservas.');
    } finally {
      setSubmitting(false);
    }
  };

  const lunchSlots = info?.availableTimeSlots?.lunch || ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30'];
  const dinnerSlots = info?.availableTimeSlots?.dinner || ['20:30', '21:00', '21:30', '22:00', '22:30'];

  return (
    <section id="reservas" className="py-20 bg-stone-950 text-stone-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            Confirmación Inmediata · Persistencia en Servidor SQLite
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-3">
            Reserva tu Mesa en La Montaña
          </h2>
          <p className="text-stone-400 mt-3">
            Elige entre nuestro Salón Principal Castizo, la emblemática Cueva de Ladrillo Abovedada
            o nuestra zona de barra en C. del Rey Francisco, 28.
          </p>
        </div>

        {confirmedReservation ? (
          <div className="max-w-2xl mx-auto bg-stone-900 border-2 border-emerald-500/50 rounded-3xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl font-bold">
              ✓
            </div>
            <span className="inline-block mt-4 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300">
              Código Oficial: {confirmedReservation.reservation_code}
            </span>
            <h3 className="font-serif text-3xl font-bold text-white mt-3">
              ¡Mesa Confirmada, {confirmedReservation.customer_name}!
            </h3>
            <p className="text-stone-300 mt-2 text-sm">
              Te esperamos el <strong>{confirmedReservation.reservation_date}</strong> a las{' '}
              <strong>{confirmedReservation.reservation_time} h</strong> para{' '}
              <strong>{confirmedReservation.guests} comensales</strong> en{' '}
              <strong>{confirmedReservation.dining_area_name}</strong>.
            </p>
            <button
              type="button"
              onClick={() => setConfirmedReservation(null)}
              className="mt-6 px-6 py-3 rounded-xl bg-amber-500 text-stone-950 font-bold text-sm hover:bg-amber-400 transition"
            >
              Realizar otra reserva
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-stone-900/90 border border-amber-500/25 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6"
          >
            {serverError && (
              <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-sm">
                ⚠️ {serverError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                  Fecha de la Reserva *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                  required
                />
                {errors.date && <p className="text-xs text-red-400 mt-1.5">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                  Número de Comensales *
                </label>
                <select
                  value={formData.guests}
                  onChange={(e) => handleChange('guests', Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Persona' : 'Personas'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                  Ambiente Preferido *
                </label>
                <select
                  value={formData.diningArea}
                  onChange={(e) => handleChange('diningArea', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                >
                  {(info?.diningAreas || []).map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Turnos Horarios */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                Selecciona Turno Horario (Comidas y Cenas) *
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {[...lunchSlots, ...dinnerSlots].map((slot) => {
                  const slotInfo = availability?.slots?.[slot];
                  const seatsLeft = slotInfo ? slotInfo.availableSeats : 32;
                  const active = formData.time === slot;
                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => handleChange('time', slot)}
                      className={`py-2.5 px-3 rounded-xl border text-center transition ${
                        active
                          ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                          : 'bg-stone-950 text-stone-200 border-stone-800 hover:border-amber-500/40'
                      }`}
                    >
                      <span className="block text-sm">{slot}</span>
                      <span className="block text-[10px] opacity-75">{seatsLeft} plazas</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Datos de Contacto */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                  Nombre y Apellidos *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ej. Carlos Gómez"
                  className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                  required
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                  Teléfono Móvil *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+34 600 000 000"
                  className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                  required
                />
                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                  Email de Confirmación *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="cliente@correo.es"
                  className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                  required
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                Comentarios, Alergias o Peticiones Especiales
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Indícanos si algún comensal tiene alergias o intolerancias (gluten, lactosa, frutos secos), si vienes con carrito de bebé o celebras una ocasión especial..."
                className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-base shadow-xl transition"
            >
              {submitting ? 'Confirmando mesa en el servidor...' : 'Confirmar Reserva de Mesa Ahora'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
