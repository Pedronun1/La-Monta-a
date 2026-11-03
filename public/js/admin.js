/**
 * RESTAURANTE LA MONTAÑA — CONTROLADOR DEL LIBRO DE SALA Y ASIGNACIÓN DE MESAS (/admin)
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
  const kpiTablesFree = document.getElementById('kpi-tables-free');

  let currentTables = Array.isArray(window.__INITIAL_TABLES__) ? window.__INITIAL_TABLES__ : [];

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
    if (kpiTablesFree && stats.tables) {
      kpiTablesFree.textContent = stats.tables.freeTables ?? 0;
    }
  }

  function renderStatusBadge(status) {
    if (status === 'confirmed') {
      return '<span class="px-2.5 py-1 text-[10px] tracking-[0.16em] uppercase border border-emerald-500/40 text-emerald-300">Confirmada</span>';
    }
    if (status === 'completed') {
      return '<span class="px-2.5 py-1 text-[10px] tracking-[0.16em] uppercase border border-[#d4af37]/40 text-[#d4af37]">Completada</span>';
    }
    return '<span class="px-2.5 py-1 text-[10px] tracking-[0.16em] uppercase border border-red-500/40 text-red-300">Cancelada</span>';
  }

  function buildTableOptionsHtml(selectedTableId) {
    const baseOption = '<option value="">— Sin mesa asignada —</option>';
    const options = currentTables
      .map((t) => {
        const isSelected = Number(selectedTableId) === Number(t.id) ? 'selected' : '';
        return `<option value="${t.id}" ${isSelected}>${escapeHtml(t.table_number)} (${Number(
          t.capacity
        )} pax · ${escapeHtml(t.status)})</option>`;
      })
      .join('');
    return baseOption + options;
  }

  function renderReservationsTable(reservations = []) {
    if (!tbody) return;
    if (tableBadge) tableBadge.textContent = `${reservations.length} REGISTROS`;

    if (reservations.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="py-12 text-center text-neutral-500">
            No existen reservas registradas con los criterios actuales.
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
                    `<span class="px-2 py-0.5 text-[10px] border border-[#d4af37]/30 text-[#d4af37]">${escapeHtml(
                      d
                    )}</span>`
                )
                .join('')}</div>`
            : '';

        const assignedBadge = r.table_number
          ? `<span class="inline-flex items-center gap-1.5 text-[10px] tracking-[0.16em] uppercase text-[#d4af37]">
               <span class="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
               Mesa ${escapeHtml(r.table_number)}
             </span>`
          : `<span class="text-[10px] tracking-[0.14em] uppercase text-neutral-500">Pendiente de asignar</span>`;

        return `
          <tr class="hover:bg-white/[0.02] transition-colors ${
            r.status === 'cancelled' ? 'opacity-45' : ''
          }">
            <td class="py-4 px-5 whitespace-nowrap">
              <span class="font-mono text-xs text-[#d4af37] border border-[#d4af37]/30 px-2.5 py-1">
                ${escapeHtml(r.reservation_code)}
              </span>
            </td>
            <td class="py-4 px-5 whitespace-nowrap">
              <span class="block text-[#f4f1ea] font-normal">${escapeHtml(r.reservation_date)}</span>
              <span class="block text-[#d4af37] mt-0.5">${escapeHtml(r.reservation_time)} h</span>
            </td>
            <td class="py-4 px-5">
              <span class="block text-sm text-[#f4f1ea] font-normal ${
                r.status === 'completed' ? 'line-through text-neutral-500' : ''
              }">
                ${escapeHtml(r.customer_name)}
              </span>
              <a href="tel:${escapeHtml(r.customer_phone)}" class="block text-neutral-400 hover:text-[#d4af37] mt-0.5">
                ${escapeHtml(r.customer_phone)}
              </a>
              <span class="block text-[11px] text-neutral-500">${escapeHtml(r.customer_email)}</span>
            </td>
            <td class="py-4 px-5 whitespace-nowrap">
              <span class="text-[#f4f1ea] font-normal">${Number(r.guests)} comensales</span>
              <span class="block text-neutral-400 mt-0.5">${escapeHtml(r.dining_area_name)}</span>
            </td>
            <td class="py-4 px-5 whitespace-nowrap">
              <div class="flex flex-col gap-1.5 min-w-[185px]">
                ${assignedBadge}
                <select
                  data-action="assign-table"
                  data-reservation-id="${r.id}"
                  class="assign-table-select bg-[#09090b] border border-white/15 focus:border-[#d4af37] text-[11px] text-[#f4f1ea] px-2.5 py-1.5 outline-none transition"
                >
                  ${buildTableOptionsHtml(r.table_id)}
                </select>
              </div>
            </td>
            <td class="py-4 px-5 max-w-xs">
              ${
                r.notes
                  ? `<p class="text-neutral-300 italic">“${escapeHtml(r.notes)}”</p>`
                  : '<span class="text-neutral-600">Sin observaciones</span>'
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
                    ? `<button type="button" data-action="status" data-id="${r.id}" data-status="completed" class="admin-action-btn px-2.5 py-1 text-[10px] tracking-wider uppercase border border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/50 transition">Completar</button>`
                    : ''
                }
                ${
                  r.status !== 'confirmed'
                    ? `<button type="button" data-action="status" data-id="${r.id}" data-status="confirmed" class="admin-action-btn px-2.5 py-1 text-[10px] tracking-wider uppercase border border-white/20 text-[#e5e5e5] hover:border-[#d4af37] transition">Confirmar</button>`
                    : ''
                }
                ${
                  r.status !== 'cancelled'
                    ? `<button type="button" data-action="status" data-id="${r.id}" data-status="cancelled" class="admin-action-btn px-2.5 py-1 text-[10px] tracking-wider uppercase border border-amber-500/40 text-amber-300 hover:bg-amber-950/40 transition">Cancelar</button>`
                    : ''
                }
                <button type="button" data-action="delete" data-id="${r.id}" class="admin-action-btn px-2.5 py-1 text-[10px] tracking-wider uppercase border border-red-500/40 text-red-300 hover:bg-red-950/50 transition">Eliminar</button>
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
        if (Array.isArray(data.tables)) {
          currentTables = data.tables;
        }
        renderReservationsTable(data.reservations);
        updateKPIs(data.stats);
      }
    } catch (err) {
      console.error('Error sincronizando reservas:', err);
    }
  }

  if (searchInput) searchInput.addEventListener('input', fetchReservations);
  if (dateFilter) dateFilter.addEventListener('change', fetchReservations);
  if (statusFilter) statusFilter.addEventListener('change', fetchReservations);
  if (refreshBtn) refreshBtn.addEventListener('click', fetchReservations);

  if (tbody) {
    // Cambio de asignación de mesa física
    tbody.addEventListener('change', async (e) => {
      const select = e.target.closest('.assign-table-select');
      if (!select) return;

      const reservationId = select.getAttribute('data-reservation-id');
      const tableId = select.value ? Number(select.value) : null;

      const res = await fetch(`/api/admin/reservations/${reservationId}/assign-table`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ tableId })
      });

      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      await fetchReservations();
    });

    // Acciones de estado o borrado
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

  // Modal de Reserva Telefónica Directa
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
      const rawTableId = document.getElementById('manual-table-id')?.value;
      const payload = {
        date: document.getElementById('manual-date')?.value,
        time: document.getElementById('manual-time')?.value,
        guests: Number(document.getElementById('manual-guests')?.value || 2),
        diningArea: document.getElementById('manual-area')?.value,
        tableId: rawTableId ? Number(rawTableId) : null,
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
