const { useState, useEffect, useMemo } = React;

// Utilidad para formatear precios en Euros (formato español)
const formatEUR = (amount) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

// Etiquetas rápidas de alergias o peticiones frecuentes para el formulario de reserva
const QUICK_NOTE_TAGS = [
  'Opción Sin Gluten / Celíaco',
  'Intolerancia a la Lactosa',
  'Alergia a Frutos Secos',
  'Mesa tranquila en la Cueva',
  'Celebración de Cumpleaños / Aniversario',
  'Espacio para carrito de bebé'
];

function App() {
  const [info, setInfo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros de carta
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyPopular, setOnlyPopular] = useState(false);
  const [selectedDishModal, setSelectedDishModal] = useState(null);

  // Platos preseleccionados para incluir en la reserva
  const [preselectedDishes, setPreselectedDishes] = useState([]);

  // Estado del formulario de reserva
  const getInitialValidDate = () => {
    const d = new Date();
    if (d.getDay() === 1) {
      d.setDate(d.getDate() + 1); // Si hoy es lunes, sugerimos martes
    }
    return d.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    date: getInitialValidDate(),
    time: '14:00',
    guests: 2,
    diningArea: 'salon-castizo',
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  const [availability, setAvailability] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [confirmedReservation, setConfirmedReservation] = useState(null);

  // Buscador de reserva por código & Panel de Reservas del Servidor
  const [lookupCode, setLookupCode] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);
  const [allReservations, setAllReservations] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cargar datos iniciales desde el Backend (/api/info y /api/menu)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);

    Promise.all([
      fetch('/api/info').then((r) => r.json()),
      fetch('/api/menu').then((r) => r.json())
    ])
      .then(([infoRes, menuRes]) => {
        if (infoRes.success) setInfo(infoRes);
        if (menuRes.success) {
          setCategories(menuRes.categories || []);
          setMenuItems(menuRes.items || []);
        }
      })
      .catch((err) => console.error('Error cargando datos del servidor:', err))
      .finally(() => setLoading(false));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Consultar disponibilidad de turnos cada vez que cambia la fecha
  useEffect(() => {
    if (!formData.date) return;
    fetch(`/api/availability?date=${formData.date}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setAvailability(data);
      })
      .catch(() => {});
  }, [formData.date]);

  const loadAllReservations = () => {
    fetch('/api/reservations')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setAllReservations(data.reservations || []);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (adminDrawerOpen) {
      loadAllReservations();
    }
  }, [adminDrawerOpen]);

  // Filtrado reactivo del menú
  const filteredDishes = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchPop = !onlyPopular || item.popular;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q);
      return matchCat && matchPop && matchSearch;
    });
  }, [menuItems, activeCategory, onlyPopular, searchQuery]);

  // Alternar plato en la preselección de la reserva
  const toggleDishSelection = (dishName) => {
    setPreselectedDishes((prev) =>
      prev.includes(dishName) ? prev.filter((d) => d !== dishName) : [...prev, dishName]
    );
  };

  // Validación en tiempo real del formulario de reserva
  const validateField = (name, value) => {
    const next = { ...fieldErrors };

    if (name === 'date') {
      if (!value) {
        next.date = 'La fecha es obligatoria.';
      } else {
        const d = new Date(`${value}T12:00:00`);
        if (d.getDay() === 1) {
          next.date = 'Los lunes permanecemos cerrados por descanso semanal. Elige de martes a domingo.';
        } else {
          delete next.date;
        }
      }
    }

    if (name === 'name') {
      if (!value || value.trim().length < 3) {
        next.name = 'Introduce tu nombre y apellidos (mínimo 3 caracteres).';
      } else {
        delete next.name;
      }
    }

    if (name === 'phone') {
      const clean = String(value || '').replace(/\s+/g, '');
      if (!/^\+?[0-9]{9,15}$/.test(clean)) {
        next.phone = 'Introduce un teléfono móvil o fijo válido (mín. 9 dígitos).';
      } else {
        delete next.phone;
      }
    }

    if (name === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())) {
        next.email = 'Introduce un email válido para recibir la confirmación.';
      } else {
        delete next.email;
      }
    }

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
    setServerError('');
  };

  const handleAddNoteTag = (tag) => {
    setFormData((prev) => {
      const current = prev.notes ? prev.notes.trim() : '';
      if (current.includes(tag)) return prev;
      return {
        ...prev,
        notes: current ? `${current}. ${tag}` : tag
      };
    });
  };

  // Envío de la reserva a POST /api/reservations
  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Validar todos los campos antes de enviar
    const localErrors = {};
    const dObj = new Date(`${formData.date}T12:00:00`);
    if (!formData.date || dObj.getDay() === 1) {
      localErrors.date = 'Los lunes permanecemos cerrados por descanso semanal. Elige de martes a domingo.';
    }
    if (!formData.name || formData.name.trim().length < 3) {
      localErrors.name = 'Introduce tu nombre y apellidos.';
    }
    if (!/^\+?[0-9]{9,15}$/.test(String(formData.phone || '').replace(/\s+/g, ''))) {
      localErrors.phone = 'Introduce un número de teléfono válido.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(formData.email || '').trim())) {
      localErrors.email = 'Introduce un correo electrónico válido.';
    }

    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          preselectedDishes
        })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(data.error || 'No se pudo completar la reserva.');
        if (data.validationErrors) setFieldErrors(data.validationErrors);
      } else {
        setConfirmedReservation(data.reservation);
        // Actualizar disponibilidad en vivo
        fetch(`/api/availability?date=${formData.date}`)
          .then((r) => r.json())
          .then((av) => {
            if (av.success) setAvailability(av);
          });
      }
    } catch (error) {
      setServerError('Error de conexión con el servidor. Por favor inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  // Consultar una reserva existente por código (GET /api/reservations/:code)
  const handleLookupReservation = async (e) => {
    e.preventDefault();
    setLookupError('');
    setLookupResult(null);
    if (!lookupCode.trim()) return;

    try {
      const res = await fetch(`/api/reservations/${encodeURIComponent(lookupCode.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        setLookupError(data.error || 'Reserva no encontrada.');
      } else {
        setLookupResult(data.reservation);
      }
    } catch {
      setLookupError('Error al consultar la reserva.');
    }
  };

  const handleUpdateReservationStatus = async (id, status) => {
    await fetch(`/api/reservations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    loadAllReservations();
    if (formData.date) {
      fetch(`/api/availability?date=${formData.date}`)
        .then((r) => r.json())
        .then((av) => av.success && setAvailability(av));
    }
  };

  const lunchSlots = info?.availableTimeSlots?.lunch || ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];
  const dinnerSlots = info?.availableTimeSlots?.dinner || ['20:30', '21:00', '21:30', '22:00', '22:30', '23:00'];

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100">
      {/* ===================================================================
          1. BARRA DE NAVEGACIÓN SUPERIOR
      =================================================================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-stone-950/95 backdrop-blur-md shadow-2xl border-b border-amber-500/20 py-3'
            : 'bg-gradient-to-b from-stone-950/95 via-stone-950/70 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a href="#inicio" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 via-amber-700 to-red-950 flex items-center justify-center border border-amber-300/50 shadow-lg group-hover:scale-105 transition">
              <span className="font-serif text-xl font-bold text-amber-50">LM</span>
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold text-amber-50 tracking-wide">
                La Montaña
              </span>
              <span className="block text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-amber-400 font-semibold">
                C. del Rey Francisco, 28 · Madrid
              </span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-200">
            <a href="#inicio" className="hover:text-amber-400 transition">Inicio</a>
            <a href="#carta" className="hover:text-amber-400 transition">Carta y Precios</a>
            <a href="#espacios" className="hover:text-amber-400 transition">Espacio Castizo</a>
            <a href="#reservas" className="hover:text-amber-400 transition">Reservar Mesa</a>
            <a href="#resenas" className="hover:text-amber-400 transition">Opiniones (4.6★)</a>
            <a href="#contacto" className="hover:text-amber-400 transition">Mapa y Contacto</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAdminDrawerOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:text-amber-300 bg-stone-900/90 border border-stone-700/80 hover:border-amber-500/40 transition flex items-center gap-1.5"
              title="Ver reservas guardadas en el servidor"
            >
              <span>📋</span>
              <span>Reservas ({info?.liveStats?.totalReservations || 3})</span>
            </button>

            <a
              href="tel:+34915473111"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-amber-300 bg-stone-900/90 border border-amber-500/30 hover:bg-stone-800 transition"
            >
              📞 915 47 31 11
            </a>

            <a
              href="#reservas"
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 transition flex items-center gap-2"
            >
              <span>Reservar Mesa</span>
              {preselectedDishes.length > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-red-900 text-amber-100 font-extrabold">
                  {preselectedDishes.length}
                </span>
              )}
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-amber-300"
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Menú Móvil */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-stone-950/98 border-b border-amber-500/20 px-4 pt-4 pb-6 space-y-3">
            <a href="#inicio" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-200 font-medium">Inicio</a>
            <a href="#carta" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-200 font-medium">Carta y Precios Reales</a>
            <a href="#espacios" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-200 font-medium">Nuestros Salones y Cueva</a>
            <a href="#reservas" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-200 font-medium">Reservar Mesa Online</a>
            <a href="#resenas" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-200 font-medium">Reseñas Google Maps (4.6★)</a>
            <a href="#contacto" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-200 font-medium">Ubicación y Horarios</a>
            <div className="pt-3 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAdminDrawerOpen(true);
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-stone-900 text-amber-300 border border-stone-700"
              >
                📋 Ver Panel de Reservas del Servidor
              </button>
              <a
                href="#reservas"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl font-bold bg-amber-500 text-stone-950"
              >
                Reservar Mesa
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ===================================================================
          2. HERO SECTION (Identidad Castiza, Botones Rápidos y Horarios Google Maps)
      =================================================================== */}
      <section
        id="inicio"
        className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=2000&q=85"
            alt="Restaurante La Montaña en C. del Rey Francisco, 28, Madrid"
            className="w-full h-full object-cover object-center opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/90 to-stone-950/65" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Columna Izquierda: Eslogan, Especialidades y Acciones Rápidas */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Casa de Comidas & Taberna Castiza · Desde 1943 en Moncloa
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-amber-50 leading-[1.07]">
                Sabor castizo y <br />
                cocina de verdad en{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">
                  La Montaña
                </span>
              </h1>

              <p className="text-base sm:text-xl text-stone-200 max-w-2xl leading-relaxed">
                Un refugio acogedor y tradicional en{' '}
                <strong className="text-amber-200">C. del Rey Francisco, 28 (Moncloa - Aravaca)</strong>.
                Ven a disfrutar de nuestras inconfundibles{' '}
                <span className="text-amber-300 font-semibold">
                  croquetas cremosas de jamón ibérico, oreja a la plancha, huevos trufados, cazón en adobo,
                  hamburguesas a la parrilla y postres caseros
                </span>
                .
              </p>

              {/* Insignias de Ubicación y Valoración Google Maps */}
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-stone-200">
                <a
                  href="#contacto"
                  className="flex items-center gap-2 bg-stone-900/90 hover:bg-stone-800 border border-stone-700/80 px-4 py-2.5 rounded-xl transition"
                >
                  <span className="text-amber-400">📍</span>
                  <span>C. del Rey Francisco, 28 · 28008 Madrid</span>
                </a>
                <a
                  href="#resenas"
                  className="flex items-center gap-2 bg-stone-900/90 hover:bg-stone-800 border border-stone-700/80 px-4 py-2.5 rounded-xl transition"
                >
                  <span className="text-amber-400 font-bold">★ {info?.ratings?.overall || 4.6} / 5</span>
                  <span className="text-stone-400">({info?.ratings?.totalReviews || 648} reseñas en Google Maps)</span>
                </a>
              </div>

              {/* Botones de Acción Rápida */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#carta"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-extrabold text-base shadow-xl shadow-amber-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span>📖</span>
                  <span>Ver Carta</span>
                </a>
                <a
                  href="#reservas"
                  className="px-8 py-4 rounded-2xl bg-red-900/90 hover:bg-red-800 text-amber-50 border border-amber-400/40 font-bold text-base shadow-xl transition transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span>🍽️</span>
                  <span>Reservar Mesa</span>
                </a>
              </div>

              {/* Mini Destacados del Local */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-800/80 max-w-xl">
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">1943</span>
                  <span className="block text-xs text-stone-400 mt-0.5">Tradición en Argüelles</span>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">100%</span>
                  <span className="block text-xs text-stone-400 mt-0.5">Cocina Casera Diaria</span>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">3 Espacios</span>
                  <span className="block text-xs text-stone-400 mt-0.5">Salón, Cueva y Barra</span>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Tarjeta Oficial de Horarios de Google Maps */}
            <div className="lg:col-span-5">
              <div className="bg-stone-900/90 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-5">
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-amber-400 font-bold block">
                      Horarios Oficiales Google Maps
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-white mt-0.5">
                      Horario de Cocina y Sala
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Mar – Dom
                  </span>
                </div>

                <ul className="space-y-2 text-xs sm:text-sm">
                  {(info?.hours || []).map((h) => (
                    <li
                      key={h.day}
                      className={`flex items-center justify-between py-2 px-3.5 rounded-xl border ${
                        h.open
                          ? 'bg-stone-950/70 border-stone-800 text-stone-200'
                          : 'bg-red-950/30 border-red-900/40 text-stone-400'
                      }`}
                    >
                      <span className="font-bold">{h.day}</span>
                      <span className={h.open ? 'text-amber-300 font-semibold' : 'text-red-300 font-medium'}>
                        {h.shifts}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-5 border-t border-stone-800 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-stone-400 block">Teléfono directo de reservas:</span>
                    <a
                      href="tel:+34915473111"
                      className="text-lg font-extrabold text-amber-400 hover:text-amber-300 transition"
                    >
                      +34 915 47 31 11
                    </a>
                  </div>
                  <a
                    href="#reservas"
                    className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 text-xs font-bold transition"
                  >
                    Reservar Turno →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          3. SECCIÓN DE MENÚ Y PRECIOS REALES (/api/menu)
      =================================================================== */}
      <section id="carta" className="py-20 bg-[#FAF6F0] text-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block text-xs font-extrabold uppercase tracking-[0.2em] text-red-900 bg-amber-200/70 px-4 py-1.5 rounded-full">
              Carta Oficial · Datos y Precios Exactos
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 mt-4">
              Nuestra Carta y Especialidades
            </h2>
            <p className="text-stone-600 mt-3 text-base sm:text-lg">
              Desde nuestras míticas raciones de barra y sartén hasta nuestras hamburguesas de vaca
              madurada, combos para compartir y postres artesanos elaborados en casa.
            </p>
          </div>

          {/* Pestañas de Categorías y Buscador */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-10 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                  activeCategory === 'all'
                    ? 'bg-red-900 text-amber-50 shadow-md'
                    : 'bg-stone-100 text-stone-700 hover:bg-amber-100/60'
                }`}
              >
                Toda la Carta ({menuItems.length})
              </button>
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                    activeCategory === cat.id
                      ? 'bg-red-900 text-amber-50 shadow-md'
                      : 'bg-stone-100 text-stone-700 hover:bg-amber-100/60'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar croquetas, oreja, trufados..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-red-900"
                />
                <span className="absolute left-3 top-2.5 text-stone-400">🔍</span>
              </div>
              <button
                type="button"
                onClick={() => setOnlyPopular(!onlyPopular)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider border transition ${
                  onlyPopular
                    ? 'bg-amber-500 text-stone-950 border-amber-500 shadow'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                ★ Más Pedidos
              </button>
            </div>
          </div>

          {/* Barra flotante si el usuario ha preseleccionado platos para su reserva */}
          {preselectedDishes.length > 0 && (
            <div className="mb-8 p-4 rounded-2xl bg-stone-900 text-amber-50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-amber-500/40">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mr-1">
                  Platos anotados para tu mesa ({preselectedDishes.length}):
                </span>
                {preselectedDishes.map((d) => (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-stone-800 text-amber-200 border border-amber-500/30"
                  >
                    {d}
                    <button
                      type="button"
                      onClick={() => toggleDishSelection(d)}
                      className="text-stone-400 hover:text-red-400 font-bold"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <a
                href="#reservas"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider shrink-0 transition"
              >
                Completar Reserva con estos Platos →
              </a>
            </div>
          )}

          {/* Grid de Platos */}
          {loading ? (
            <div className="text-center py-16 text-stone-500 font-medium">
              Cargando la carta de Restaurante La Montaña...
            </div>
          ) : filteredDishes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
              <p className="text-lg font-semibold text-stone-700">
                No hemos encontrado platos que coincidan con "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                  setOnlyPopular(false);
                }}
                className="mt-4 px-5 py-2.5 rounded-xl bg-red-900 text-white text-sm font-bold"
              >
                Ver toda la carta
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredDishes.map((dish) => {
                const dishKey = dish.shortName || dish.name;
                const isSelected = preselectedDishes.includes(dishKey);

                return (
                  <article
                    key={dish.id}
                    className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col group"
                  >
                    <div
                      className="relative h-60 overflow-hidden bg-stone-200 cursor-pointer"
                      onClick={() => setSelectedDishModal(dish)}
                    >
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent" />

                      {dish.badge && (
                        <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-950/90 text-amber-300 border border-amber-400/30 shadow">
                          {dish.badge}
                        </span>
                      )}

                      <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between">
                        <span className="text-xs font-semibold text-amber-200 bg-stone-950/80 px-2.5 py-1 rounded-lg">
                          {dish.unit}
                        </span>
                        <div className="bg-red-900 text-amber-50 px-4 py-1.5 rounded-xl shadow-lg font-serif font-bold text-xl border border-amber-300/30">
                          {formatEUR(dish.price)}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-amber-800 block mb-1">
                          {dish.categoryName}
                        </span>
                        <h3
                          onClick={() => setSelectedDishModal(dish)}
                          className="font-serif text-xl font-bold text-stone-900 group-hover:text-red-900 transition cursor-pointer leading-snug"
                        >
                          {dish.name}
                        </h3>
                        <p className="text-stone-600 text-sm mt-2.5 leading-relaxed">
                          {dish.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-stone-100 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
                          {dish.halfPrice ? (
                            <span className="font-semibold text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-md">
                              Media ración: {formatEUR(dish.halfPrice)}
                            </span>
                          ) : (
                            <span>Receta artesana de la casa</span>
                          )}
                          <span>⏱ {dish.prepTime}</span>
                        </div>

                        {/* Alérgenos */}
                        <div className="flex flex-wrap gap-1.5">
                          {(dish.allergens || []).map((al) => (
                            <span
                              key={al}
                              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                al === 'Sin Gluten'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              {al}
                            </span>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleDishSelection(dishKey)}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'bg-emerald-700 text-white shadow'
                              : 'bg-stone-900 hover:bg-red-900 text-amber-100'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <span>✓</span>
                              <span>Incluido en mi reserva</span>
                            </>
                          ) : (
                            <>
                              <span>+</span>
                              <span>Preseleccionar para mi mesa</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===================================================================
          4. SECCIÓN DE IDENTIDAD Y ESPACIOS DEL LOCAL (Salón, Cueva 1943 y Barra)
      =================================================================== */}
      <section id="espacios" className="py-20 bg-stone-900 text-stone-100 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              Un Clásico de Argüelles - Moncloa desde 1943
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-3">
              Tres Ambientes con Alma Castiza
            </h2>
            <p className="text-stone-400 mt-3">
              Elige dónde disfrutar de tu velada cuando reserves tu mesa en C. del Rey Francisco, 28.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(info?.diningAreas || []).map((area, index) => {
              const images = [
                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80'
              ];
              return (
                <div
                  key={area.id}
                  className="bg-stone-950 rounded-3xl overflow-hidden border border-stone-800 flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="h-52 overflow-hidden relative">
                      <img
                        src={images[index % images.length]}
                        alt={area.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-stone-950/90 text-amber-300 border border-amber-500/30">
                        {area.capacity}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-2xl font-bold text-amber-100">{area.name}</h3>
                      <p className="text-sm text-stone-400 mt-2 leading-relaxed">
                        {area.description}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <a
                      href="#reservas"
                      onClick={() => handleInputChange('diningArea', area.id)}
                      className="block w-full py-2.5 text-center rounded-xl border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-stone-950 text-xs font-bold uppercase tracking-wider transition"
                    >
                      Elegir este espacio al reservar →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================
          5. SISTEMA DE RESERVAS INTERACTIVO (Integración Backend + SQLite)
      =================================================================== */}
      <section id="reservas" className="py-20 bg-stone-950 text-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Columna Izquierda: Formulario Interactivo de Reserva */}
            <div className="lg:col-span-8">
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                  Confirmación Inmediata · Persistencia en Servidor
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2">
                  Reservar Mesa Online
                </h2>
                <p className="text-stone-400 mt-2">
                  Selecciona fecha, turno horario y número de comensales. Recibirás tu código oficial
                  de reserva al instante.
                </p>
              </div>

              {confirmedReservation ? (
                <div className="bg-stone-900 border-2 border-emerald-500/60 rounded-3xl p-8 shadow-2xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center text-3xl font-bold">
                        ✓
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                          Reserva Registrada en Base de Datos
                        </span>
                        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                          ¡Mesa Confirmada!
                        </h3>
                      </div>
                    </div>
                    <div className="bg-stone-950 border border-amber-400/40 px-4 py-2.5 rounded-2xl text-center">
                      <span className="text-[10px] uppercase tracking-widest text-stone-400 block">
                        Código de Reserva
                      </span>
                      <span className="font-mono text-lg font-extrabold text-amber-400">
                        {confirmedReservation.reservation_code}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-stone-950/80 p-6 rounded-2xl border border-stone-800">
                    <div>
                      <span className="text-stone-400 block text-xs">Titular de la Reserva:</span>
                      <strong className="text-white text-base">{confirmedReservation.customer_name}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-xs">Fecha y Hora:</span>
                      <strong className="text-amber-300 text-base">
                        {confirmedReservation.reservation_date} a las {confirmedReservation.reservation_time} h
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-xs">Comensales y Zona:</span>
                      <strong className="text-white">
                        {confirmedReservation.guests} personas · {confirmedReservation.dining_area_name}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-xs">Contacto:</span>
                      <strong className="text-stone-200">
                        {confirmedReservation.customer_phone} · {confirmedReservation.customer_email}
                      </strong>
                    </div>
                    {confirmedReservation.notes && (
                      <div className="sm:col-span-2 pt-2 border-t border-stone-800">
                        <span className="text-stone-400 block text-xs">Comentarios / Alergias anotadas:</span>
                        <p className="text-stone-200 mt-0.5">{confirmedReservation.notes}</p>
                      </div>
                    )}
                    {confirmedReservation.preselected_dishes?.length > 0 && (
                      <div className="sm:col-span-2 pt-2 border-t border-stone-800">
                        <span className="text-amber-400 block text-xs font-bold">
                          Platos preseleccionados para la mesa:
                        </span>
                        <p className="text-stone-200 mt-1">
                          {confirmedReservation.preselected_dishes.join(' · ')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-stone-400">
                      📍 C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid · Tel: 915 47 31 11
                    </p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition"
                      >
                        🖨️ Imprimir Resguardo
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmedReservation(null)}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-extrabold transition"
                      >
                        Nueva Reserva
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleReservationSubmit}
                  className="bg-stone-900/90 border border-amber-500/25 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
                  noValidate
                >
                  {serverError && (
                    <div className="p-4 rounded-2xl bg-red-950/90 border border-red-500/50 text-red-200 text-sm font-medium">
                      ⚠️ {serverError}
                    </div>
                  )}

                  {/* Paso 1: Fecha, Comensales y Espacio */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                        1. Fecha de Reserva *
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl bg-stone-950 border text-white text-sm focus:outline-none ${
                          fieldErrors.date ? 'border-red-500' : 'border-stone-700 focus:border-amber-400'
                        }`}
                        required
                      />
                      {fieldErrors.date && (
                        <p className="text-xs text-red-400 mt-1.5">{fieldErrors.date}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                        2. Nº de Comensales *
                      </label>
                      <select
                        value={formData.guests}
                        onChange={(e) => handleInputChange('guests', Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-700 text-white text-sm focus:outline-none focus:border-amber-400"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? 'Comensal (1 persona)' : `Comensales (${n} personas)`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                        3. Zona del Local *
                      </label>
                      <select
                        value={formData.diningArea}
                        onChange={(e) => handleInputChange('diningArea', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-700 text-white text-sm focus:outline-none focus:border-amber-400"
                      >
                        {(info?.diningAreas || []).map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Paso 2: Selección de Hora con Disponibilidad en Vivo */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-amber-300">
                        4. Selecciona Hora Disponible *
                      </label>
                      <span className="text-xs text-stone-400">
                        Plazas sincronizadas en tiempo real con el servidor
                      </span>
                    </div>

                    {availability?.isClosedDay ? (
                      <div className="p-4 rounded-2xl bg-red-950/60 border border-red-800 text-red-200 text-xs">
                        {availability.closedReason}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs font-semibold text-stone-400 block mb-2">
                            ☀️ Turno de Comidas (13:00 – 16:30)
                          </span>
                          <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                            {lunchSlots.map((slot) => {
                              const seats = availability?.slots?.[slot]?.availableSeats ?? 32;
                              const isSelected = formData.time === slot;
                              const disabled = seats < formData.guests;
                              return (
                                <button
                                  type="button"
                                  key={slot}
                                  disabled={disabled}
                                  onClick={() => handleInputChange('time', slot)}
                                  className={`py-2.5 px-2 rounded-xl border text-center transition ${
                                    disabled
                                      ? 'opacity-40 cursor-not-allowed bg-stone-950 border-stone-800'
                                      : isSelected
                                      ? 'bg-amber-500 text-stone-950 border-amber-400 font-extrabold shadow-lg'
                                      : 'bg-stone-950 text-stone-200 border-stone-800 hover:border-amber-500/40'
                                  }`}
                                >
                                  <span className="block text-sm">{slot}</span>
                                  <span className="block text-[10px] opacity-80">
                                    {disabled ? 'Completo' : `${seats} libres`}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <span className="text-xs font-semibold text-stone-400 block mb-2">
                            🌙 Turno de Cenas (20:30 – 23:30)
                          </span>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {dinnerSlots.map((slot) => {
                              const seats = availability?.slots?.[slot]?.availableSeats ?? 32;
                              const isSelected = formData.time === slot;
                              const disabled = seats < formData.guests;
                              return (
                                <button
                                  type="button"
                                  key={slot}
                                  disabled={disabled}
                                  onClick={() => handleInputChange('time', slot)}
                                  className={`py-2.5 px-2 rounded-xl border text-center transition ${
                                    disabled
                                      ? 'opacity-40 cursor-not-allowed bg-stone-950 border-stone-800'
                                      : isSelected
                                      ? 'bg-amber-500 text-stone-950 border-amber-400 font-extrabold shadow-lg'
                                      : 'bg-stone-950 text-stone-200 border-stone-800 hover:border-amber-500/40'
                                  }`}
                                >
                                  <span className="block text-sm">{slot}</span>
                                  <span className="block text-[10px] opacity-80">
                                    {disabled ? 'Completo' : `${seats} libres`}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Paso 3: Datos del Cliente con Validación en Tiempo Real */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                        5. Nombre y Apellidos *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Ej. María López Serrano"
                        className={`w-full px-4 py-3 rounded-xl bg-stone-950 border text-white text-sm focus:outline-none ${
                          fieldErrors.name ? 'border-red-500' : 'border-stone-700 focus:border-amber-400'
                        }`}
                        required
                      />
                      {fieldErrors.name && (
                        <p className="text-xs text-red-400 mt-1">{fieldErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                        6. Teléfono de Contacto *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+34 612 345 678"
                        className={`w-full px-4 py-3 rounded-xl bg-stone-950 border text-white text-sm focus:outline-none ${
                          fieldErrors.phone ? 'border-red-500' : 'border-stone-700 focus:border-amber-400'
                        }`}
                        required
                      />
                      {fieldErrors.phone && (
                        <p className="text-xs text-red-400 mt-1">{fieldErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                        7. Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="nombre@correo.es"
                        className={`w-full px-4 py-3 rounded-xl bg-stone-950 border text-white text-sm focus:outline-none ${
                          fieldErrors.email ? 'border-red-500' : 'border-stone-700 focus:border-amber-400'
                        }`}
                        required
                      />
                      {fieldErrors.email && (
                        <p className="text-xs text-red-400 mt-1">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Paso 4: Comentarios, Alergias y Platos Preseleccionados */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-300">
                      8. Comentarios, Alergias o Intolerancias Alimentarias (Opcional)
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {QUICK_NOTE_TAGS.map((tag) => (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => handleAddNoteTag(tag)}
                          className="px-3 py-1 rounded-full text-xs bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-700 transition"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Indícanos cualquier alergia (gluten, marisco, lactosa, frutos secos) o preferencia de mesa..."
                      className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-700 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || availability?.isClosedDay}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 disabled:opacity-50 text-stone-950 font-extrabold text-base shadow-xl shadow-amber-500/20 transition"
                  >
                    {submitting
                      ? 'Procesando y guardando reserva en el servidor...'
                      : `Confirmar Reserva para ${formData.guests} ${
                          formData.guests === 1 ? 'Persona' : 'Personas'
                        } (${formData.date} · ${formData.time}h)`}
                  </button>
                </form>
              )}
            </div>

            {/* Columna Derecha: Comprobador de Reserva por Código e Info de Grupos */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
                  Consulta en Tiempo Real
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  ¿Ya tienes una reserva?
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Introduce tu código de confirmación (por ejemplo{' '}
                  <code className="text-amber-300 font-mono">LM-2026-4812</code>) para verificar el
                  estado de tu mesa en nuestro servidor.
                </p>

                <form onSubmit={handleLookupReservation} className="flex gap-2">
                  <input
                    type="text"
                    value={lookupCode}
                    onChange={(e) => setLookupCode(e.target.value)}
                    placeholder="LM-2026-4812"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-sm text-white font-mono uppercase focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition"
                  >
                    Buscar
                  </button>
                </form>

                {lookupError && <p className="text-xs text-red-400">{lookupError}</p>}

                {lookupResult && (
                  <div className="p-4 rounded-2xl bg-stone-950 border border-emerald-500/40 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <strong className="text-amber-300 font-mono">{lookupResult.reservation_code}</strong>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase text-[10px]">
                        {lookupResult.status}
                      </span>
                    </div>
                    <p className="text-white font-semibold">{lookupResult.customer_name}</p>
                    <p className="text-stone-300">
                      📅 {lookupResult.reservation_date} a las {lookupResult.reservation_time}h ·{' '}
                      {lookupResult.guests} pax
                    </p>
                    <p className="text-stone-400">📍 {lookupResult.dining_area_name}</p>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-red-950/70 to-stone-900 border border-amber-500/30 rounded-3xl p-6 sm:p-7 space-y-4">
                <h3 className="font-serif text-xl font-bold text-amber-100">
                  Eventos, Grupos y Celebraciones en la Cueva
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Para reservas de más de 16 comensales o privatizar nuestra histórica{' '}
                  <strong>Cueva de Ladrillo Abovedada</strong> con menús cerrados de picoteo y barra
                  libre, contáctanos directamente por teléfono.
                </p>
                <a
                  href="tel:+34915473111"
                  className="inline-flex items-center gap-2 text-amber-300 font-extrabold text-base hover:underline"
                >
                  📞 Llamar al +34 915 47 31 11
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          6. SECCIÓN DE OPINIONES Y RESEÑAS DE GOOGLE MAPS (/api/info)
      =================================================================== */}
      <section id="resenas" className="py-20 bg-[#FAF6F0] text-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-extrabold uppercase tracking-[0.2em] text-red-900 bg-amber-200/70 px-4 py-1.5 rounded-full">
              Excelencia Reconocida por el Barrio de Moncloa
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 mt-4">
              Opiniones y Reseñas en Google Maps
            </h2>
            <p className="text-stone-600 mt-3">
              La satisfacción de nuestros vecinos y visitantes refleja nuestra pasión por el buen
              producto, las raciones generosas y el trato cercano de toda la vida.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Tarjeta Resumen de Puntuación Google Maps */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-8 border border-stone-200 shadow-lg">
              <div className="flex items-center gap-4 border-b border-stone-100 pb-6">
                <div className="font-serif text-6xl font-extrabold text-stone-900">
                  {info?.ratings?.overall || 4.6}
                </div>
                <div>
                  <div className="text-amber-500 text-2xl tracking-wider">★★★★★</div>
                  <p className="text-xs text-stone-500 font-medium mt-1">
                    {info?.ratings?.totalReviews || 648} reseñas verificadas en Google Maps
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 my-6">
                {(info?.ratings?.distribution || []).map((row) => (
                  <div key={row.stars} className="flex items-center gap-3 text-xs">
                    <span className="w-9 font-bold text-stone-700">{row.stars} ★</span>
                    <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${row.percentage}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-stone-500 font-medium">
                      {row.percentage}%
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-stone-100">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-3">
                  Aspectos mejor valorados:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(info?.ratings?.highlights || []).map((h) => (
                    <span
                      key={h}
                      className="px-3 py-1.5 rounded-xl text-xs bg-amber-50 text-amber-900 border border-amber-200 font-semibold"
                    >
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tarjetas de Reseñas Destacadas */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {(info?.reviews || []).map((rev) => (
                <article
                  key={rev.id}
                  className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
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

                    <div className="flex items-center gap-1 text-amber-500 text-sm mb-3">
                      <span>★★★★★</span>
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold ml-2">
                        Reseña Verificada
                      </span>
                    </div>

                    <p className="text-stone-700 text-sm leading-relaxed">“{rev.text}”</p>
                  </div>

                  {rev.dishMentioned && (
                    <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-amber-900 font-bold">
                      🍽️ Platos recomendados: {rev.dishMentioned}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          7. INFORMACIÓN DE CONTACTO Y MAPA GOOGLE MAPS INTERACTIVO
      =================================================================== */}
      <section id="contacto" className="py-20 bg-stone-900 text-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              Encuéntranos en Madrid
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-3">
              Contacto, Dirección y Mapa
            </h2>
            <p className="text-stone-400 mt-3">
              Situados en plena Calle del Rey Francisco, 28 (Moncloa - Aravaca), muy cerca del Paseo
              del Pintor Rosales y de las estaciones de metro Ventura Rodríguez y Argüelles.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-5 bg-stone-950 rounded-3xl p-8 border border-stone-800 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
                    Dirección Exacta
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white mt-1">
                    Restaurante La Montaña
                  </h3>
                  <p className="text-stone-300 mt-1 text-base font-medium">
                    C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
                    <span className="text-xs text-stone-400 block">Teléfono Oficial</span>
                    <a
                      href="tel:+34915473111"
                      className="text-lg font-extrabold text-amber-400 hover:underline mt-1 block"
                    >
                      +34 915 47 31 11
                    </a>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
                    <span className="text-xs text-stone-400 block">Atención y Reservas</span>
                    <a
                      href="mailto:reservas@restaurantelamontana.es"
                      className="text-xs font-bold text-stone-200 hover:text-amber-300 mt-2 block truncate"
                    >
                      reservas@restaurantelamontana.es
                    </a>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2.5">
                    Transporte Público Cercano
                  </span>
                  <ul className="space-y-2 text-xs text-stone-300">
                    {(info?.address?.nearbyTransport || []).map((tr, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between bg-stone-900/80 px-3.5 py-2.5 rounded-xl border border-stone-800"
                      >
                        <strong className="text-amber-300">
                          {tr.type}: {tr.line}
                        </strong>
                        <span>{tr.station}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Calle+del+Rey+Francisco+28+28008+Madrid"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-center text-sm transition block shadow-lg"
              >
                📍 Abrir Ubicación en Google Maps ↗
              </a>
            </div>

            {/* Mapa Interactivo Google Maps */}
            <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl min-h-[460px] bg-stone-950">
              <iframe
                title="Ubicación de Restaurante La Montaña en C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid"
                src="https://www.google.com/maps?q=Calle+del+Rey+Francisco,+28,+28008+Madrid&output=embed"
                className="w-full h-full min-h-[460px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          8. FOOTER
      =================================================================== */}
      <footer className="bg-stone-950 border-t border-stone-800 text-stone-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-serif text-2xl font-bold text-amber-100">
              Restaurante La Montaña
            </span>
            <p className="text-xs text-stone-500 mt-1">
              C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid · Tel: +34 915 47 31 11
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
            <a href="#inicio" className="hover:text-amber-400 transition">Inicio</a>
            <a href="#carta" className="hover:text-amber-400 transition">Carta y Precios</a>
            <a href="#reservas" className="hover:text-amber-400 transition">Reservar Mesa</a>
            <a href="#resenas" className="hover:text-amber-400 transition">Reseñas Google Maps</a>
            <a href="#contacto" className="hover:text-amber-400 transition">Contacto y Mapa</a>
          </div>

          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} Restaurante La Montaña · Cocina Tradicional en Madrid.
          </p>
        </div>
      </footer>

      {/* ===================================================================
          MODAL DE DETALLE DEL PLATO
      =================================================================== */}
      {selectedDishModal && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedDishModal(null)}
        >
          <div
            className="bg-white text-stone-900 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 bg-stone-200">
              <img
                src={selectedDishModal.image}
                alt={selectedDishModal.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedDishModal(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-950/80 text-white font-bold flex items-center justify-center"
              >
                ✕
              </button>
              <div className="absolute bottom-4 right-4 bg-red-900 text-white px-4 py-1.5 rounded-xl font-serif font-bold text-xl shadow-lg">
                {formatEUR(selectedDishModal.price)}
              </div>
            </div>
            <div className="p-6 sm:p-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                {selectedDishModal.categoryName} · {selectedDishModal.unit}
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                {selectedDishModal.name}
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                {selectedDishModal.description}
              </p>
              {selectedDishModal.halfPrice && (
                <p className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1.5 rounded-lg inline-block">
                  Opción Media Ración disponible por {formatEUR(selectedDishModal.halfPrice)}
                </p>
              )}
              <div className="pt-4 border-t border-stone-200 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    toggleDishSelection(selectedDishModal.shortName || selectedDishModal.name);
                    setSelectedDishModal(null);
                  }}
                  className="flex-1 py-3 rounded-xl bg-red-900 hover:bg-red-800 text-amber-50 font-bold text-xs uppercase tracking-wider transition"
                >
                  + Añadir a mi Reserva de Mesa
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDishModal(null)}
                  className="px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs uppercase tracking-wider"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          PANEL DRAWER DE GESTIÓN DE RESERVAS EN SERVIDOR (GET /api/reservations)
      =================================================================== */}
      {adminDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex justify-end"
          onClick={() => setAdminDrawerOpen(false)}
        >
          <div
            className="bg-stone-900 text-stone-100 w-full max-w-2xl h-full overflow-y-auto p-6 sm:p-8 border-l border-amber-500/30 shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  Base de Datos SQLite (lamontana.db)
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Reservas Registradas en el Servidor
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAdminDrawerOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-sm font-bold"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="space-y-4">
              {allReservations.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        {r.reservation_code}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          r.status === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : r.status === 'completed'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                    <p className="text-white font-bold text-base">{r.customer_name}</p>
                    <p className="text-stone-300">
                      📅 {r.reservation_date} · ⏰ {r.reservation_time}h · 👥 {r.guests} personas (
                      {r.dining_area_name})
                    </p>
                    <p className="text-stone-400">
                      📞 {r.customer_phone} · ✉️ {r.customer_email}
                    </p>
                    {r.notes && <p className="text-amber-200/90 italic">“{r.notes}”</p>}
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0">
                    {r.status !== 'completed' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateReservationStatus(r.id, 'completed')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-bold"
                      >
                        ✓ Completar
                      </button>
                    )}
                    {r.status !== 'cancelled' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateReservationStatus(r.id, 'cancelled')}
                        className="px-3 py-1.5 rounded-lg bg-red-900/80 hover:bg-red-800 text-red-100 text-xs font-bold"
                      >
                        ✕ Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
