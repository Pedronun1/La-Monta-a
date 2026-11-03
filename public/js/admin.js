/**
 * RESTAURANTE LA MONTAÑA — CONTROLADOR DEL PANEL PRIVADO (/admin)
 * Sincronización en tiempo real, filtros, cambios de estado y alta manual.
 */

document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('admin-reservations-tbody');
  const searchInput = document.getElementById('admin-search-input');
  const dateFilter = document.getElementById('admin-date-filter');
  const statusFilter = document.getElementById('admin-status-filter');
  const refreshBtn = document.getElementById('admin-refresh-btn');
  const tableBadge = document.getElementById('table-count-badge');

  const kpiTotal = document.getElementById('kpi-total');
  const kpiToday = document.getElementById('kpi-today');
  const kpiGuests = document.getElementById('kpi-guests');
  const kpiCompleted = document.getElementById('kpi-completed');

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function updateKPIs(stats) {
    if (!stats) return;
    if (kpiTotal) kpiTotal.textContent = stats.totalReservations ?? 0;
    if (kpiToday) kpiToday.textContent = stats.todayReservations ?? 0;
    if (kpiGuests) kpiGuests.textContent = stats.totalGuests ?? 0;
    if (kpiCompleted) kpiCompleted.textContent = stats.completedReservations ?? 0;
  }

  function renderStatusBadge(status) {
    if (status === 'confirmed') {
      return '<span class="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Confirmada</span>';
    }
    if (status === 'completed') {
      return '<span class="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">Completada</span>';
    }
    return '<span class="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-500/15 text-red-300 border border-red-500/30">Cancelada</span>';
  }

  function renderReservationsTable(reservations = []) {
    if (!tbody) return;
    if (tableBadge) tableBadge.textContent = `${reservations.length} registros`;

    if (reservations.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="py-12 text-center text-stone-500">
            No se encontraron reservas con los criterios seleccionados.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = reservations
      .map((r) => {
        const dishesHtml =
          Array.isArray(r.preselected_dishes) && r.preselected_dishes.length > 0
            ? `<div class="mt-1.5 flex flex-wrap gap-1">${r.preselected_dishes
                .map(
                  (d) =>
                    `<span class="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20">${escapeHtml(
                      d
                    )}</span>`
                )
                .join('')}</div>`
            : '';

        return `
          <tr class="hover:bg-stone-900/50 transition-colors duration-200 ${
            r.status === 'cancelled' ? 'opacity-50' : ''
          }">
            <td class="py-4 px-5 whitespace-nowrap">
              <span class="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                ${escapeHtml(r.reservation_code)}
              </span>
            </td>
            <td class="py-4 px-5 whitespace-nowrap">
              <span class="block font-semibold text-stone-100">${escapeHtml(r.reservation_date)}</span>
              <span class="block text-xs text-amber-400 font-medium">${escapeHtml(r.reservation_time)} h</span>
            </td>
            <td class="py-4 px-5">
              <span class="block font-semibold text-stone-100 ${
                r.status === 'completed' ? 'line-through text-stone-400' : ''
              }">
                ${escapeHtml(r.customer_name)}
              </span>
              <a href="tel:${escapeHtml(r.customer_phone)}" class="block text-xs text-stone-400 hover:text-amber-400">
                ${escapeHtml(r.customer_phone)}
              </a>
              <span class="block text-[11px] text-stone-500">${escapeHtml(r.customer_email)}</span>
            </td>
            <td class="py-4 px-5 whitespace-nowrap">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-xs font-semibold text-stone-200">
                👥 ${Number(r.guests)} pax
              </span>
              <span class="block text-xs text-stone-400 mt-1">${escapeHtml(r.dining_area_name)}</span>
            </td>
            <td class="py-4 px-5 max-w-xs">
              ${
                r.notes
                  ? `<p class="text-xs text-stone-300 italic">“${escapeHtml(r.notes)}”</p>`
                  : '<span class="text-xs text-stone-600">Sin observaciones</span>'
              }
              ${dishesHtml}
            </td>
            <td class="py-4 px-5 whitespace-nowrap">
              ${renderStatusBadge(r.status)}
            </td>
            <td class="py-4 px-5 whitespace-nowrap text-right">
              <div class="inline-flex items-center gap-1.5">
                ${
                  r.status !== 'completed'
                    ? `<button type="button" data-action="status" data-id="${r.id}" data-status="completed" class="admin-action-btn px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-800 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition">✓ Completar</button>`
                    : ''
                }
                ${
                  r.status !== 'confirmed'
                    ? `<button type="button" data-action="status" data-id="${r.id}" data-status="confirmed" class="admin-action-btn px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-400 border border-stone-700 text-xs font-semibold transition">↺ Confirmar</button>`
                    : ''
                }
                ${
                  r.status !== 'cancelled'
                    ? `<button type="button" data-action="status" data-id="${r.id}" data-status="cancelled" class="admin-action-btn px-2.5 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-500/30 text-xs font-semibold transition">✕ Cancelar</button>`
                    : ''
                }
                <button type="button" data-action="delete" data-id="${r.id}" class="admin-action-btn px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/30 text-xs font-semibold transition">🗑️</button>
              </div>
            </td>
          </tr>
        `;
      })
      .join('');
  }

  async function fetchReservations() {
    const params = new URLSearchParams();
    if (searchInput && searchInput.value.trim()) params.set('search', searchInput.value.trim());
    if (dateFilter && dateFilter.value) params.set('date', dateFilter.value);
    if (statusFilter && statusFilter.value !== 'all') params.set('status', statusFilter.value);

    try {
      const res = await fetch(`/api/admin/reservations?${params.toString()}`, {
        headers: { Accept: 'application/json' }
      });
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (data.success) {
        renderReservationsTable(data.reservations);
        updateKPIs(data.stats);
      }
    } catch (err) {
      console.error('Error sincronizando reservas:', err);
    }
  }

  // Eventos de filtrado en tiempo real
  if (searchInput) searchInput.addEventListener('input', fetchReservations);
  if (dateFilter) dateFilter.addEventListener('change', fetchReservations);
  if (statusFilter) statusFilter.addEventListener('change', fetchReservations);
  if (refreshBtn) refreshBtn.addEventListener('click', fetchReservations);

  // Delegación de eventos en la tabla para Cambiar Estado / Eliminar
  if (tbody) {
    tbody.addEventListener('click', async (e) => {
      const btn = e.target.closest('.admin-action-btn');
      if (!btn) return;

      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id');

      if (action === 'status') {
        const status = btn.getAttribute('data-status');
        const res = await fetch(`/api/admin/reservations/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ status })
        });
        if (res.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
        await fetchReservations();
      } else if (action === 'delete') {
        const res = await fetch(`/api/admin/reservations/${id}`, {
          method: 'DELETE',
          headers: { Accept: 'application/json' }
        });
        if (res.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
        await fetchReservations();
      }
    });
  }

  // Modal de Nueva Reserva Telefónica Manual
  const modal = document.getElementById('manual-reservation-modal');
  const openModalBtn = document.getElementById('open-manual-modal-btn');
  const closeModalBtn = document.getElementById('close-manual-modal-btn');
  const cancelModalBtn = document.getElementById('cancel-manual-modal-btn');
  const manualForm = document.getElementById('manual-reservation-form');
  const manualDate = document.getElementById('manual-date');

  if (manualDate) {
    manualDate.value = new Date().toISOString().split('T')[0];
  }

  function closeModal() {
    if (modal) modal.classList.add('hidden');
  }

  if (openModalBtn && modal) {
    openModalBtn.addEventListener('click', () => modal.classList.remove('hidden'));
  }
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

  if (manualForm) {
    manualForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        date: document.getElementById('manual-date')?.value,
        time: document.getElementById('manual-time')?.value,
        guests: Number(document.getElementById('manual-guests')?.value || 2),
        diningArea: document.getElementById('manual-area')?.value,
        name: document.getElementById('manual-name')?.value,
        phone: document.getElementById('manual-phone')?.value,
        email: document.getElementById('manual-email')?.value,
        notes: document.getElementById('manual-notes')?.value
      };

      const res = await fetch('/api/admin/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }

      if (res.ok) {
        manualForm.reset();
        if (manualDate) manualDate.value = new Date().toISOString().split('T')[0];
        closeModal();
        await fetchReservations();
      }
    });
  }
});
