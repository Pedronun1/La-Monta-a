/**
 * RESTAURANTE LA MONTAÑA — CONTROLADOR FRONTEND INTERACTIVO
 * Gestiona el filtrado fluido de la carta, preselección de platos,
 * disponibilidad en tiempo real y envío de reservas al servidor.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Menú móvil
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobilePanel = document.getElementById('mobile-menu-panel');
  if (mobileBtn && mobilePanel) {
    mobileBtn.addEventListener('click', () => {
      mobilePanel.classList.toggle('hidden');
    });
    document.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => mobilePanel.classList.add('hidden'));
    });
  }

  // 2. Filtrado interactivo de la Carta por Categoría y Búsqueda
  let activeCategory = 'all';
  let searchQuery = '';

  const tabButtons = document.querySelectorAll('.menu-tab-btn');
  const searchInput = document.getElementById('menu-search-input');
  const menuCards = document.querySelectorAll('.menu-card-item');

  function filterMenuCards() {
    const q = searchQuery.trim().toLowerCase();
    menuCards.forEach((card) => {
      const cat = card.getAttribute('data-category');
      const name = card.getAttribute('data-name') || '';
      const desc = card.getAttribute('data-desc') || '';

      const matchesCat = activeCategory === 'all' || cat === activeCategory;
      const matchesSearch = !q || name.includes(q) || desc.includes(q) || cat.toLowerCase().includes(q);

      if (matchesCat && matchesSearch) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-category') || 'all';

      tabButtons.forEach((b) => {
        b.className =
          'menu-tab-btn px-5 py-2.5 rounded-xl text-xs uppercase tracking-[0.16em] font-semibold transition-all duration-300 ease-in-out bg-stone-900/80 text-stone-300 hover:text-amber-400 border border-stone-800 hover:border-amber-500/40';
      });
      btn.className =
        'menu-tab-btn px-5 py-2.5 rounded-xl text-xs uppercase tracking-[0.16em] font-semibold transition-all duration-300 ease-in-out bg-amber-500 text-stone-950 shadow-[0_0_20px_rgba(245,158,11,0.25)]';

      filterMenuCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value || '';
      filterMenuCards();
    });
  }

  // 3. Preselección de platos para adjuntar a la reserva
  const preselectedDishes = new Set();
  const preselectedBar = document.getElementById('preselected-bar');
  const preselectedChips = document.getElementById('preselected-chips');
  const navBadge = document.getElementById('nav-preselected-badge');

  function updatePreselectedUI() {
    const list = Array.from(preselectedDishes);

    if (navBadge) {
      if (list.length > 0) {
        navBadge.textContent = String(list.length);
        navBadge.classList.remove('hidden');
      } else {
        navBadge.classList.add('hidden');
      }
    }

    if (preselectedBar && preselectedChips) {
      if (list.length === 0) {
        preselectedBar.classList.add('hidden');
      } else {
        preselectedBar.classList.remove('hidden');
        preselectedChips.innerHTML = '';
        list.forEach((dishName) => {
          const chip = document.createElement('span');
          chip.className =
            'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-[#09090b] text-amber-400 border border-amber-500/30';
          chip.textContent = dishName + ' ';
          const closeBtn = document.createElement('button');
          closeBtn.type = 'button';
          closeBtn.className = 'text-stone-400 hover:text-red-400 font-bold';
          closeBtn.textContent = '✕';
          closeBtn.addEventListener('click', () => {
            preselectedDishes.delete(dishName);
            syncDishButtons();
            updatePreselectedUI();
          });
          chip.appendChild(closeBtn);
          preselectedChips.appendChild(chip);
        });
      }
    }
  }

  function syncDishButtons() {
    document.querySelectorAll('.toggle-dish-btn').forEach((btn) => {
      const dish = btn.getAttribute('data-dish');
      if (preselectedDishes.has(dish)) {
        btn.textContent = '✓ En mi Reserva';
        btn.className =
          'toggle-dish-btn px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-bold border border-amber-500 bg-amber-500 text-stone-950 transition-all duration-300 ease-in-out';
      } else {
        btn.textContent = '+ Añadir a Reserva';
        btn.className =
          'toggle-dish-btn px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-semibold border border-stone-800 hover:border-amber-500/50 bg-stone-900/70 hover:bg-amber-500 hover:text-stone-950 text-stone-300 transition-all duration-300 ease-in-out';
      }
    });
  }

  document.querySelectorAll('.toggle-dish-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dish = btn.getAttribute('data-dish');
      if (!dish) return;
      if (preselectedDishes.has(dish)) {
        preselectedDishes.delete(dish);
      } else {
        preselectedDishes.add(dish);
      }
      syncDishButtons();
      updatePreselectedUI();
    });
  });

  // 4. Selección directa de salón desde las tarjetas de espacio
  const areaSelect = document.getElementById('res-area');
  document.querySelectorAll('.select-area-link').forEach((link) => {
    link.addEventListener('click', () => {
      const areaId = link.getAttribute('data-select-area');
      if (areaSelect && areaId) {
        areaSelect.value = areaId;
      }
    });
  });

  // 5. Inicialización de fecha por defecto y consulta de disponibilidad en vivo
  const dateInput = document.getElementById('res-date');
  const timeSelect = document.getElementById('res-time');
  const availabilityText = document.getElementById('availability-text');

  function getNextOpenDateISO() {
    const d = new Date();
    if (d.getDay() === 1) {
      d.setDate(d.getDate() + 1); // Si hoy es lunes, sugerir martes
    }
    return d.toISOString().split('T')[0];
  }

  if (dateInput) {
    dateInput.value = getNextOpenDateISO();
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  async function checkAvailability() {
    if (!dateInput || !dateInput.value || !availabilityText) return;
    availabilityText.textContent = 'Verificando disponibilidad de plazas en sala...';

    try {
      const res = await fetch(`/api/availability?date=${encodeURIComponent(dateInput.value)}`);
      const data = await res.json();
      if (!data.success) return;

      if (data.isClosedDay) {
        availabilityText.innerHTML = `<span class="text-red-400 font-medium">⚠️ ${data.closedReason}</span>`;
      } else {
        const selectedTime = timeSelect ? timeSelect.value : '14:00';
        const slotInfo = data.slots && data.slots[selectedTime];
        const seats = slotInfo ? slotInfo.availableSeats : 36;
        availabilityText.innerHTML = `Turno <strong class="text-stone-200">${selectedTime} h</strong> del <strong class="text-stone-200">${dateInput.value}</strong>: <span class="text-amber-400 font-semibold">${seats} plazas disponibles</span>`;
      }
    } catch {
      availabilityText.textContent = 'Reserva online disponible con confirmación inmediata.';
    }
  }

  if (dateInput) dateInput.addEventListener('change', checkAvailability);
  if (timeSelect) timeSelect.addEventListener('change', checkAvailability);
  checkAvailability();

  // 6. Envío del Formulario de Reserva Avanzado con Animación de Carga
  const form = document.getElementById('reservation-form');
  const errorAlert = document.getElementById('reservation-error-alert');
  const submitBtn = document.getElementById('res-submit-btn');
  const submitSpinner = document.getElementById('res-submit-spinner');
  const submitText = document.getElementById('res-submit-text');
  const successBox = document.getElementById('reservation-success-box');
  const confirmCode = document.getElementById('res-confirm-code');
  const confirmDetails = document.getElementById('res-confirm-details');
  const newResBtn = document.getElementById('new-reservation-btn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (errorAlert) errorAlert.classList.add('hidden');

      const payload = {
        date: dateInput ? dateInput.value : '',
        time: timeSelect ? timeSelect.value : '14:00',
        guests: Number(document.getElementById('res-guests')?.value || 2),
        diningArea: areaSelect ? areaSelect.value : 'salon-principal',
        name: document.getElementById('res-name')?.value || '',
        phone: document.getElementById('res-phone')?.value || '',
        email: document.getElementById('res-email')?.value || '',
        notes: document.getElementById('res-notes')?.value || '',
        preselectedDishes: Array.from(preselectedDishes)
      };

      // Estado de carga suave
      if (submitBtn) submitBtn.disabled = true;
      if (submitSpinner) submitSpinner.classList.remove('hidden');
      if (submitText) submitText.textContent = 'Confirmando mesa en el servidor...';

      try {
        const response = await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          if (errorAlert) {
            errorAlert.textContent = result.error || 'Por favor revise los campos de su reserva.';
            errorAlert.classList.remove('hidden');
          }
        } else {
          const r = result.reservation;
          if (confirmCode) confirmCode.textContent = r.reservation_code;
          if (confirmDetails) {
            confirmDetails.innerHTML = `
              <div class="flex justify-between py-1 border-b border-stone-800/80">
                <span class="text-stone-500">Titular:</span>
                <strong class="text-stone-100">${r.customer_name}</strong>
              </div>
              <div class="flex justify-between py-1 border-b border-stone-800/80">
                <span class="text-stone-500">Fecha y Hora:</span>
                <strong class="text-amber-400">${r.reservation_date} · ${r.reservation_time} h</strong>
              </div>
              <div class="flex justify-between py-1 border-b border-stone-800/80">
                <span class="text-stone-500">Comensales y Espacio:</span>
                <strong class="text-stone-100">${r.guests} personas · ${r.dining_area_name}</strong>
              </div>
              <div class="flex justify-between py-1">
                <span class="text-stone-500">Contacto:</span>
                <span class="text-stone-300">${r.customer_phone}</span>
              </div>
            `;
          }
          form.classList.add('hidden');
          if (successBox) successBox.classList.remove('hidden');
          preselectedDishes.clear();
          syncDishButtons();
          updatePreselectedUI();
          checkAvailability();
        }
      } catch {
        if (errorAlert) {
          errorAlert.textContent = 'Error de conexión con el servidor. Inténtelo de nuevo.';
          errorAlert.classList.remove('hidden');
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (submitSpinner) submitSpinner.classList.add('hidden');
        if (submitText) submitText.textContent = 'Confirmar Reserva de Mesa';
      }
    });
  }

  if (newResBtn && form && successBox) {
    newResBtn.addEventListener('click', () => {
      form.reset();
      if (dateInput) dateInput.value = getNextOpenDateISO();
      successBox.classList.add('hidden');
      form.classList.remove('hidden');
      checkAvailability();
    });
  }
});
