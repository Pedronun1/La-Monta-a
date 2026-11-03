/**
 * RESTAURANTE LA MONTAÑA — CONTROLADOR FRONTEND DE ALTA COCINA
 * Gestiona la navegación, pestañas de la carta física, reservas online,
 * textos legales españoles (LSSI-CE, RGPD, AEPD) y consentimiento de cookies.
 */

const LEGAL_TEXTS = {
  'aviso-legal': {
    title: 'Aviso Legal y Condiciones de Uso (Ley 34/2002 LSSI-CE)',
    html: `
      <p><strong class="text-[#f4f1ea]">1. Datos Identificativos del Titular:</strong> En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa que el presente sitio web es titularidad de <strong>Restaurante Clásico La Montaña S.L.</strong>, con CIF <strong>B-82941038</strong> y domicilio social en <strong>Calle del Rey Francisco, 28, Distrito Moncloa - Aravaca, 28008 Madrid (España)</strong>. Teléfono de contacto: +34 915 47 31 11 · Correo electrónico: reservas@restaurantelamontana.es.</p>
      <p><strong class="text-[#f4f1ea]">2. Objeto y Ámbito de Aplicación:</strong> El presente sitio web tiene por finalidad ofrecer información oficial sobre la propuesta gastronómica, bodega, horarios e instalaciones de Restaurante La Montaña, así como facilitar la solicitud y confirmación de reservas de mesa en línea.</p>
      <p><strong class="text-[#f4f1ea]">3. Propiedad Intelectual e Industrial:</strong> Todos los contenidos, textos gastronómicos, diseño gráfico, el monograma "L.M" y el código fuente son titularidad exclusiva de Restaurante Clásico La Montaña S.L., quedando prohibida su reproducción total o parcial sin autorización expresa.</p>
      <p><strong class="text-[#f4f1ea]">4. Política de Reservas y Puntualidad:</strong> Las mesas reservadas se mantienen durante un margen de cortesía de 15 minutos respecto a la hora acordada. En caso de demora o cancelación, rogamos lo comuniquen con antelación al teléfono +34 915 47 31 11.</p>
    `
  },
  privacidad: {
    title: 'Política de Privacidad y Protección de Datos (RGPD / LOPDGDD)',
    html: `
      <p><strong class="text-[#f4f1ea]">1. Responsable del Tratamiento:</strong> Restaurante Clásico La Montaña S.L. (CIF B-82941038), con domicilio en C. del Rey Francisco, 28, 28008 Madrid. Contacto de Protección de Datos: direccion@restaurantelamontana.es.</p>
      <p><strong class="text-[#f4f1ea]">2. Finalidad del Tratamiento:</strong> Los datos personales recabados a través del formulario de reservas (nombre, teléfono, correo electrónico y observaciones sobre alergias o intolerancias) se tratan con la única finalidad de gestionar su reserva de mesa y garantizar la seguridad alimentaria durante el servicio de sala.</p>
      <p><strong class="text-[#f4f1ea]">3. Legitimación y Conservación:</strong> La base jurídica para el tratamiento es la ejecución de la relación precontractual/contractual de reserva solicitada por el interesado (art. 6.1.b RGPD). Los datos se conservarán únicamente durante el tiempo necesario para atender la reserva y cumplir con las obligaciones legales aplicables.</p>
      <p><strong class="text-[#f4f1ea]">4. Derechos de los Interesados:</strong> Puede ejercer en cualquier momento sus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad mediante comunicación escrita dirigida a C. del Rey Francisco, 28, 28008 Madrid o al correo reservas@restaurantelamontana.es, así como presentar reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).</p>
    `
  },
  cookies: {
    title: 'Política de Cookies (Directiva ePrivacy y Guía AEPD)',
    html: `
      <p><strong class="text-[#f4f1ea]">1. ¿Qué son las cookies?:</strong> Una cookie es un pequeño archivo almacenado en su navegador que permite recordar preferencias técnicas de sesión y garantizar el correcto funcionamiento del portal web.</p>
      <p><strong class="text-[#f4f1ea]">2. Tipología de Cookies Utilizadas:</strong></p>
      <ul class="list-disc pl-5 space-y-1.5">
        <li><strong class="text-[#d4af37]">Cookies Técnicas y de Sesión (Estrictamente Necesarias):</strong> Permiten gestionar la disponibilidad del formulario de reservas, recordar su preferencia de consentimiento (<code>lm_cookie_consent</code>) y mantener la seguridad de sesión del área privada (<code>lamontana.sid</code>).</li>
        <li><strong class="text-[#d4af37]">Servicios de Terceros Integrados:</strong> El mapa interactivo de ubicación utiliza Google Maps para mostrar la localización exacta en C. del Rey Francisco, 28, 28008 Madrid.</li>
      </ul>
      <p><strong class="text-[#f4f1ea]">3. Gestión y Revocación del Consentimiento:</strong> Usted puede modificar o retirar su consentimiento en cualquier momento desde el enlace "Configurar Preferencias de Cookies" situado en el pie de página.</p>
    `
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Menú de Navegación Móvil (Drawer Desplegable con Transición Fluida)
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-menu-drawer');
  const mobileBackdrop = document.getElementById('mobile-drawer-backdrop');
  const mobileCloseBtn = document.getElementById('mobile-drawer-close-btn');
  const iconOpen = document.getElementById('hamburger-icon-open');
  const iconClose = document.getElementById('hamburger-icon-close');

  function setDrawerState(isOpen) {
    if (!mobileDrawer || !mobileBackdrop) return;
    if (isOpen) {
      mobileDrawer.classList.add('is-open');
      mobileBackdrop.classList.add('is-open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'true');
      if (iconOpen) iconOpen.classList.add('hidden');
      if (iconClose) iconClose.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    } else {
      mobileDrawer.classList.remove('is-open');
      mobileBackdrop.classList.remove('is-open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
      if (iconOpen) iconOpen.classList.remove('hidden');
      if (iconClose) iconClose.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
      setDrawerState(!isExpanded);
    });
  }
  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', () => setDrawerState(false));
  }
  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', () => setDrawerState(false));
  }
  document.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => setDrawerState(false));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setDrawerState(false);
  });

  // 1.B Motor Cinematográfico "Scroll-World" y Revelado Progresivo (duration-1000)
  const revealElements = document.querySelectorAll('.lm-reveal');
  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  const heroCameraLayer = document.getElementById('hero-camera-layer');
  const heroContentStage = document.getElementById('hero-content-stage');
  const parallaxItems = document.querySelectorAll('[data-parallax]');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.12
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  let ticking = false;
  function updateScrollWorld() {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight
    );
    const progress = Math.min(1, Math.max(0, scrollY / docHeight));

    if (scrollProgressBar) {
      scrollProgressBar.style.transform = `scaleX(${progress.toFixed(4)})`;
    }

    // Efecto de cámara cinematográfica en el Hero durante los primeros 800px de scroll
    if (heroCameraLayer && scrollY < 1000) {
      const scale = 1 + Math.min(0.12, scrollY * 0.00014);
      const translateY = scrollY * 0.22;
      heroCameraLayer.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
    }

    if (heroContentStage && scrollY < 900) {
      const fade = Math.max(0.15, 1 - scrollY / 780);
      const lift = scrollY * -0.12;
      heroContentStage.style.opacity = fade.toFixed(3);
      heroContentStage.style.transform = `translate3d(0, ${lift.toFixed(1)}px, 0)`;
    }

    // Parallax suave para marcos arquitectónicos de salones
    if (window.innerWidth >= 768 && parallaxItems.length > 0) {
      parallaxItems.forEach((item) => {
        const speed = parseFloat(item.getAttribute('data-parallax') || '0');
        const rect = item.getBoundingClientRect();
        const centerOffset = rect.top - window.innerHeight * 0.5;
        const y = centerOffset * speed;
        item.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      });
    }

    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollWorld);
        ticking = true;
      }
    },
    { passive: true }
  );
  updateScrollWorld();

  // 2. Filtrado por Categorías en el Menú Físico de Lujo
  const categoryTabs = document.querySelectorAll('.lm-category-tab');
  const categorySections = document.querySelectorAll('.menu-category-section');

  categoryTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const selected = tab.getAttribute('data-category') || 'all';

      categoryTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      categorySections.forEach((sec) => {
        const secCat = sec.getAttribute('data-section-category');
        if (selected === 'all' || secCat === selected) {
          sec.classList.remove('hidden');
        } else {
          sec.classList.add('hidden');
        }
      });
    });
  });

  // 3. Preselección sutil de platos para vincular a la reserva
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
            'inline-flex items-center gap-2 px-3 py-1 bg-[#0a0a0c] text-[#e5e5e5] border border-[#d4af37]/40 text-[11px]';
          chip.textContent = dishName + ' ';
          const removeBtn = document.createElement('button');
          removeBtn.type = 'button';
          removeBtn.className = 'text-[#d4af37] hover:text-white ml-1';
          removeBtn.textContent = '✕';
          removeBtn.addEventListener('click', () => {
            preselectedDishes.delete(dishName);
            syncDishButtons();
            updatePreselectedUI();
          });
          chip.appendChild(removeBtn);
          preselectedChips.appendChild(chip);
        });
      }
    }
  }

  function syncDishButtons() {
    document.querySelectorAll('.toggle-dish-btn').forEach((btn) => {
      const dish = btn.getAttribute('data-dish');
      if (preselectedDishes.has(dish)) {
        btn.textContent = '✓ Anotado';
        btn.className =
          'toggle-dish-btn shrink-0 min-h-[34px] px-2.5 py-1 border border-[#d4af37] bg-[#d4af37]/10 text-[9px] tracking-[0.18em] uppercase text-[#d4af37] font-medium whitespace-nowrap transition-colors';
      } else {
        btn.textContent = '+ Anotar';
        btn.className =
          'toggle-dish-btn shrink-0 min-h-[34px] px-2.5 py-1 border border-white/10 hover:border-[#d4af37]/50 text-[9px] tracking-[0.18em] uppercase text-neutral-400 hover:text-[#d4af37] transition-colors whitespace-nowrap';
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

  // 4. Selección de Salón desde la sección de Historia
  const areaSelect = document.getElementById('res-area');
  document.querySelectorAll('.select-area-link').forEach((link) => {
    link.addEventListener('click', () => {
      const areaId = link.getAttribute('data-select-area');
      if (areaSelect && areaId) areaSelect.value = areaId;
    });
  });

  // 5. Inicialización de Fecha y Disponibilidad de Sala en Tiempo Real
  const dateInput = document.getElementById('res-date');
  const timeSelect = document.getElementById('res-time');
  const availabilityText = document.getElementById('availability-text');

  function getNextOpenDateISO() {
    const d = new Date();
    if (d.getDay() === 1) {
      d.setDate(d.getDate() + 1);
    }
    return d.toISOString().split('T')[0];
  }

  if (dateInput) {
    dateInput.value = getNextOpenDateISO();
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  async function checkAvailability() {
    if (!dateInput || !dateInput.value || !availabilityText) return;
    availabilityText.textContent = 'Verificando disponibilidad de sala...';

    try {
      const res = await fetch(`/api/availability?date=${encodeURIComponent(dateInput.value)}`);
      const data = await res.json();
      if (!data.success) return;

      if (data.isClosedDay) {
        availabilityText.innerHTML = `<span class="text-red-300">${data.closedReason}</span>`;
      } else {
        const selectedTime = timeSelect ? timeSelect.value : '14:00';
        const slotInfo = data.slots && data.slots[selectedTime];
        const seats = slotInfo ? slotInfo.availableSeats : 36;
        availabilityText.innerHTML = `Servicio de las <strong class="text-[#f4f1ea] font-normal">${selectedTime} h</strong> (${dateInput.value}): <span class="text-[#d4af37]">${seats} plazas disponibles en sala</span>`;
      }
    } catch {
      availabilityText.textContent = 'Reserva online disponible con confirmación inmediata.';
    }
  }

  if (dateInput) dateInput.addEventListener('change', checkAvailability);
  if (timeSelect) timeSelect.addEventListener('change', checkAvailability);
  checkAvailability();

  // 6. Envío del Formulario Formal de Reserva
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

      if (submitBtn) submitBtn.disabled = true;
      if (submitSpinner) submitSpinner.classList.remove('hidden');
      if (submitText) submitText.textContent = 'PROCESANDO RESERVA EN SALA...';

      try {
        const response = await fetch('/api/reservar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          if (errorAlert) {
            errorAlert.textContent = result.error || 'Por favor verifique los datos introducidos.';
            errorAlert.classList.remove('hidden');
          }
        } else {
          const r = result.reservation;
          if (confirmCode) confirmCode.textContent = r.reservation_code;
          if (confirmDetails) {
            confirmDetails.innerHTML = `
              <div class="flex justify-between py-1.5 border-b border-white/10">
                <span class="text-neutral-500 uppercase tracking-widest text-[10px]">Titular</span>
                <span class="text-[#f4f1ea]">${r.customer_name}</span>
              </div>
              <div class="flex justify-between py-1.5 border-b border-white/10">
                <span class="text-neutral-500 uppercase tracking-widest text-[10px]">Fecha y Hora</span>
                <span class="text-[#d4af37]">${r.reservation_date} · ${r.reservation_time} h</span>
              </div>
              <div class="flex justify-between py-1.5 border-b border-white/10">
                <span class="text-neutral-500 uppercase tracking-widest text-[10px]">Mesa y Salón</span>
                <span class="text-[#f4f1ea]">${r.table_number ? `Mesa ${r.table_number} · ` : ''}${r.guests} comensales · ${r.dining_area_name}</span>
              </div>
              <div class="flex justify-between py-1.5">
                <span class="text-neutral-500 uppercase tracking-widest text-[10px]">Teléfono</span>
                <span class="text-neutral-300">${r.customer_phone}</span>
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
          errorAlert.textContent = 'No ha sido posible conectar con el servidor de reservas.';
          errorAlert.classList.remove('hidden');
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (submitSpinner) submitSpinner.classList.add('hidden');
        if (submitText) submitText.textContent = 'CONFIRMAR RESERVA DE MESA';
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

  // 7. Modal de Textos Legales (Aviso Legal, Privacidad y Cookies)
  const legalModal = document.getElementById('legal-modal-backdrop');
  const legalTitle = document.getElementById('legal-modal-title');
  const legalBody = document.getElementById('legal-modal-body');
  const closeLegalBtn = document.getElementById('close-legal-modal-btn');

  document.querySelectorAll('[data-open-legal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-open-legal');
      const doc = LEGAL_TEXTS[key];
      if (!doc || !legalModal) return;
      if (legalTitle) legalTitle.textContent = doc.title;
      if (legalBody) legalBody.innerHTML = doc.html;
      legalModal.classList.remove('hidden');
    });
  });

  if (closeLegalBtn && legalModal) {
    closeLegalBtn.addEventListener('click', () => legalModal.classList.add('hidden'));
  }
  if (legalModal) {
    legalModal.addEventListener('click', (e) => {
      if (e.target === legalModal) legalModal.classList.add('hidden');
    });
  }

  // 8. Banner de Consentimiento de Cookies (RGPD / AEPD)
  const cookieBanner = document.getElementById('cookie-consent-banner');
  const cookieAccept = document.getElementById('cookie-accept-btn');
  const cookieReject = document.getElementById('cookie-reject-btn');
  const reopenCookieBtn = document.getElementById('reopen-cookie-banner-btn');

  if (cookieBanner && !localStorage.getItem('lm_cookie_consent')) {
    cookieBanner.classList.remove('hidden');
  }

  if (cookieAccept && cookieBanner) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('lm_cookie_consent', 'accepted_all');
      cookieBanner.classList.add('hidden');
    });
  }

  if (cookieReject && cookieBanner) {
    cookieReject.addEventListener('click', () => {
      localStorage.setItem('lm_cookie_consent', 'essential_only');
      cookieBanner.classList.add('hidden');
    });
  }

  if (reopenCookieBtn && cookieBanner) {
    reopenCookieBtn.addEventListener('click', () => {
      cookieBanner.classList.remove('hidden');
    });
  }
});
