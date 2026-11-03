/**
 * RESTAURANTE LA MONTAÑA — CONTROLADOR DE GESTIÓN DE ESPACIOS Y MESAS (/admin/mesas)
 */

document.addEventListener('DOMContentLoaded', () => {
  const zonesContainer = document.getElementById('zones-map-container');
  const statusFilter = document.getElementById('table-status-filter');
  const refreshBtn = document.getElementById('refresh-tables-btn');
  const zoneFilterBtns = document.querySelectorAll('.zone-filter-btn');

  const statTotalTables = document.getElementById('stat-total-tables');
  const statFreeTables = document.getElementById('stat-free-tables');
  const statReservedTables = document.getElementById('stat-reserved-tables');
  const statOccupiedTables = document.getElementById('stat-occupied-tables');
  const statMaintenanceTables = document.getElementById('stat-maintenance-tables');
  const statTotalCapacity = document.getElementById('stat-total-capacity');

  const modal = document.getElementById('table-crud-modal');
  const modalTitle = document.getElementById('table-modal-title');
  const modalError = document.getElementById('table-modal-error');
  const openNewBtn = document.getElementById('open-new-table-modal-btn');
  const closeModalBtn = document.getElementById('close-table-modal-btn');
  const cancelModalBtn = document.getElementById('cancel-table-modal-btn');
  const tableForm = document.getElementById('table-crud-form');

  const inputId = document.getElementById('form-table-id');
  const inputNumber = document.getElementById('form-table-number');
  const inputCapacity = document.getElementById('form-table-capacity');
  const inputZone = document.getElementById('form-table-zone');
  const inputStatus = document.getElementById('form-table-status');
  const inputNotes = document.getElementById('form-table-notes');

  let zonesData = Array.isArray(window.__INITIAL_ZONES__) ? window.__INITIAL_ZONES__ : [];
  let tablesData = Array.isArray(window.__INITIAL_TABLES__) ? window.__INITIAL_TABLES__ : [];
  let activeZoneFilter = 'all';

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function updateStats(stats) {
    if (!stats) return;
    if (statTotalTables) statTotalTables.textContent = stats.totalTables ?? 0;
    if (statFreeTables) statFreeTables.textContent = stats.freeTables ?? 0;
    if (statReservedTables) statReservedTables.textContent = stats.reservedTables ?? 0;
    if (statOccupiedTables) statOccupiedTables.textContent = stats.occupiedTables ?? 0;
    if (statMaintenanceTables) statMaintenanceTables.textContent = stats.maintenanceTables ?? 0;
    if (statTotalCapacity) statTotalCapacity.textContent = stats.totalCapacity ?? 0;
  }

  function getStatusStyle(status) {
    if (status === 'Reservada') {
      return {
        borderClass: 'border-[#d4af37]/50',
        badgeClass: 'border-[#d4af37]/50 text-[#d4af37] bg-[#d4af37]/10',
        dotClass: 'bg-[#d4af37]'
      };
    }
    if (status === 'Ocupada') {
      return {
        borderClass: 'border-red-500/45',
        badgeClass: 'border-red-500/45 text-red-300 bg-red-950/30',
        dotClass: 'bg-red-400'
      };
    }
    if (status === 'Mantenimiento') {
      return {
        borderClass: 'border-neutral-600/50 opacity-75',
        badgeClass: 'border-neutral-500/40 text-neutral-400 bg-neutral-900',
        dotClass: 'bg-neutral-500'
      };
    }
    return {
      borderClass: 'border-emerald-500/35',
      badgeClass: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30',
      dotClass: 'bg-emerald-400'
    };
  }

  function renderMap() {
    if (!zonesContainer) return;
    const selectedStatus = statusFilter ? statusFilter.value : 'all';

    const visibleZones = zonesData.filter(
      (z) => activeZoneFilter === 'all' || z.id === activeZoneFilter
    );

    zonesContainer.innerHTML = visibleZones
      .map((zone) => {
        const zoneTables = tablesData.filter((t) => {
          const matchesZone = t.zone_id === zone.id;
          const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus;
          return matchesZone && matchesStatus;
        });

        const cardsHtml =
          zoneTables.length === 0
            ? `<div class="col-span-full py-10 text-center border border-dashed border-white/10 text-neutral-500 text-xs">
                 No hay mesas en este salón con el filtro de estado seleccionado.
               </div>`
            : zoneTables
                .map((table) => {
                  const st = getStatusStyle(table.status);
                  const activeResHtml = table.activeReservation
                    ? `<div class="bg-[#111115] border border-[#d4af37]/30 p-3">
                         <div class="flex items-center justify-between text-[10px] text-[#d4af37] uppercase tracking-wider">
                           <span>RESERVA ASIGNADA</span>
                           <span class="font-mono">${escapeHtml(
                             table.activeReservation.reservation_code
                           )}</span>
                         </div>
                         <p class="text-xs text-[#f4f1ea] font-normal mt-1">
                           ${escapeHtml(table.activeReservation.customer_name)} (${Number(
                        table.activeReservation.guests
                      )} pax)
                         </p>
                         <p class="text-[11px] text-neutral-400 mt-0.5">
                           ${escapeHtml(table.activeReservation.reservation_date)} · ${escapeHtml(
                        table.activeReservation.reservation_time
                      )} h
                         </p>
                       </div>`
                    : `<div class="border border-dashed border-white/10 p-3 text-center">
                         <span class="text-[11px] text-neutral-500">Sin reserva asignada actualmente</span>
                       </div>`;

                  return `
                    <article
                      class="table-card bg-[#050506] border ${st.borderClass} p-6 flex flex-col justify-between transition-all hover:border-[#d4af37]"
                      data-table-id="${table.id}"
                      data-zone-id="${escapeHtml(table.zone_id)}"
                      data-status="${escapeHtml(table.status)}"
                    >
                      <div>
                        <div class="flex items-start justify-between gap-3">
                          <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-sm border border-[#d4af37]/40 bg-[#111115] flex flex-col items-center justify-center">
                              <span class="font-mono text-sm font-medium text-[#f4f1ea]">${escapeHtml(
                                table.table_number
                              )}</span>
                              <span class="text-[9px] text-[#d4af37]">${Number(
                                table.capacity
                              )} PAX</span>
                            </div>
                            <div>
                              <h3 class="font-serif text-xl text-[#f4f1ea]">Mesa ${escapeHtml(
                                table.table_number
                              )}</h3>
                              <span class="text-[11px] text-neutral-400 block">
                                Capacidad máx.: <strong class="text-[#e5e5e5] font-normal">${Number(
                                  table.capacity
                                )} comensales</strong>
                              </span>
                            </div>
                          </div>

                          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] tracking-[0.18em] uppercase border ${
                            st.badgeClass
                          }">
                            <span class="w-1.5 h-1.5 rounded-full ${st.dotClass}"></span>
                            ${escapeHtml(table.status)}
                          </span>
                        </div>

                        <p class="text-xs text-neutral-400 mt-4 pb-4 border-b border-white/5">
                          ${escapeHtml(table.notes || 'Ubicación estándar en sala')}
                        </p>

                        <div class="mt-4 min-h-[64px] flex flex-col justify-center">
                          ${activeResHtml}
                        </div>
                      </div>

                      <div class="mt-5 pt-4 border-t border-white/10 space-y-3">
                        <span class="text-[9px] tracking-[0.22em] uppercase text-neutral-500 block">
                          CAMBIAR ESTADO EN TIEMPO REAL
                        </span>
                        <div class="grid grid-cols-4 gap-1.5">
                          <button
                            type="button"
                            data-action="quick-status"
                            data-id="${table.id}"
                            data-status="Libre"
                            class="px-2 py-1.5 text-[9px] tracking-wider uppercase border transition ${
                              table.status === 'Libre'
                                ? 'border-emerald-400 bg-emerald-950/60 text-emerald-200'
                                : 'border-white/10 text-neutral-400 hover:border-emerald-500/40 hover:text-emerald-300'
                            }"
                          >
                            Libre
                          </button>
                          <button
                            type="button"
                            data-action="quick-status"
                            data-id="${table.id}"
                            data-status="Reservada"
                            class="px-2 py-1.5 text-[9px] tracking-wider uppercase border transition ${
                              table.status === 'Reservada'
                                ? 'border-[#d4af37] bg-[#d4af37]/20 text-[#d4af37]'
                                : 'border-white/10 text-neutral-400 hover:border-[#d4af37]/40 hover:text-[#d4af37]'
                            }"
                          >
                            Reserv.
                          </button>
                          <button
                            type="button"
                            data-action="quick-status"
                            data-id="${table.id}"
                            data-status="Ocupada"
                            class="px-2 py-1.5 text-[9px] tracking-wider uppercase border transition ${
                              table.status === 'Ocupada'
                                ? 'border-red-400 bg-red-950/60 text-red-200'
                                : 'border-white/10 text-neutral-400 hover:border-red-500/40 hover:text-red-300'
                            }"
                          >
                            Ocupada
                          </button>
                          <button
                            type="button"
                            data-action="quick-status"
                            data-id="${table.id}"
                            data-status="Mantenimiento"
                            class="px-2 py-1.5 text-[9px] tracking-wider uppercase border transition ${
                              table.status === 'Mantenimiento'
                                ? 'border-neutral-400 bg-neutral-800 text-neutral-200'
                                : 'border-white/10 text-neutral-400 hover:border-neutral-400'
                            }"
                          >
                            Mant.
                          </button>
                        </div>

                        <div class="flex items-center justify-between pt-2">
                          <button
                            type="button"
                            data-action="edit-table"
                            data-id="${table.id}"
                            class="text-[10px] tracking-[0.18em] uppercase text-neutral-400 hover:text-[#d4af37] transition"
                          >
                            EDITAR MESA
                          </button>
                          <button
                            type="button"
                            data-action="delete-table"
                            data-id="${table.id}"
                            data-number="${escapeHtml(table.table_number)}"
                            class="text-[10px] tracking-[0.18em] uppercase text-red-400/80 hover:text-red-300 transition"
                          >
                            ELIMINAR
                          </button>
                        </div>
                      </div>
                    </article>
                  `;
                })
                .join('');

        return `
          <section
            class="zone-section bg-[#111115] border border-white/10 p-6 sm:p-8 shadow-2xl"
            data-zone-section="${escapeHtml(zone.id)}"
          >
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div class="flex items-center gap-3">
                  <span class="text-[10px] tracking-[0.26em] uppercase text-[#d4af37]">
                    ${escapeHtml(zone.architectural_style)}
                  </span>
                  <span class="px-2.5 py-0.5 text-[10px] border border-white/15 text-neutral-300">
                    ${zoneTables.length} mesas
                  </span>
                </div>
                <h2 class="font-serif text-2xl sm:text-3xl text-[#f4f1ea] mt-1">
                  ${escapeHtml(zone.name)}
                </h2>
                <p class="text-xs text-neutral-400 mt-1">
                  ${escapeHtml(zone.description)}
                </p>
              </div>

              <div class="flex items-center gap-3 self-start md:self-center">
                <button
                  type="button"
                  data-QuickAddZone="${escapeHtml(zone.id)}"
                  class="quick-add-zone-btn lm-btn-outline py-2 px-4 text-[10px]"
                >
                  + MESA EN ESTE SALÓN
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              ${cardsHtml}
            </div>
          </section>
        `;
      })
      .join('');
  }

  async function fetchTablesData() {
    try {
      const res = await fetch('/api/admin/tables', {
        headers: { Accept: 'application/json' }
      });
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (data.success) {
        zonesData = data.zones || zonesData;
        tablesData = data.tables || [];
        updateStats(data.tableStats);
        renderMap();
      }
    } catch (err) {
      console.error('Error sincronizando mapa de mesas:', err);
    }
  }

  // Filtros de zona
  zoneFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeZoneFilter = btn.getAttribute('data-zone-filter') || 'all';
      zoneFilterBtns.forEach((b) => {
        b.classList.remove('bg-[#d4af37]', 'text-[#050506]');
        b.classList.add('border', 'border-white/10', 'text-neutral-300');
      });
      btn.classList.add('bg-[#d4af37]', 'text-[#050506]');
      btn.classList.remove('border', 'border-white/10', 'text-neutral-300');
      renderMap();
    });
  });

  if (statusFilter) statusFilter.addEventListener('change', renderMap);
  if (refreshBtn) refreshBtn.addEventListener('click', fetchTablesData);

  // Modal CRUD (Crear / Editar mesa)
  function openModalForCreate(defaultZoneId = 'salon-principal') {
    if (!modal) return;
    if (modalError) modalError.classList.add('hidden');
    if (modalTitle) modalTitle.textContent = 'Añadir Nueva Mesa';
    if (inputId) inputId.value = '';
    if (inputNumber) inputNumber.value = '';
    if (inputCapacity) inputCapacity.value = '4';
    if (inputZone) inputZone.value = defaultZoneId;
    if (inputStatus) inputStatus.value = 'Libre';
    if (inputNotes) inputNotes.value = '';
    modal.classList.remove('hidden');
  }

  function openModalForEdit(table) {
    if (!modal || !table) return;
    if (modalError) modalError.classList.add('hidden');
    if (modalTitle) modalTitle.textContent = `Editar Mesa ${table.table_number}`;
    if (inputId) inputId.value = String(table.id);
    if (inputNumber) inputNumber.value = table.table_number;
    if (inputCapacity) inputCapacity.value = String(table.capacity);
    if (inputZone) inputZone.value = table.zone_id;
    if (inputStatus) inputStatus.value = table.status;
    if (inputNotes) inputNotes.value = table.notes || '';
    modal.classList.remove('hidden');
  }

  function closeModal() {
    if (modal) modal.classList.add('hidden');
  }

  if (openNewBtn) openNewBtn.addEventListener('click', () => openModalForCreate('salon-principal'));
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

  // Delegación de eventos en el mapa de salones
  if (zonesContainer) {
    zonesContainer.addEventListener('click', async (e) => {
      const quickZoneBtn = e.target.closest('.quick-add-zone-btn');
      if (quickZoneBtn) {
        const zoneId = quickZoneBtn.getAttribute('data-QuickAddZone') || 'salon-principal';
        openModalForCreate(zoneId);
        return;
      }

      const actionBtn = e.target.closest('[data-action]');
      if (!actionBtn) return;

      const action = actionBtn.getAttribute('data-action');
      const id = Number(actionBtn.getAttribute('data-id'));

      if (action === 'quick-status') {
        const status = actionBtn.getAttribute('data-status');
        const res = await fetch(`/api/admin/tables/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ status })
        });
        if (res.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
        await fetchTablesData();
      } else if (action === 'edit-table') {
        const table = tablesData.find((t) => Number(t.id) === id);
        if (table) openModalForEdit(table);
      } else if (action === 'delete-table') {
        const res = await fetch(`/api/admin/tables/${id}`, {
          method: 'DELETE',
          headers: { Accept: 'application/json' }
        });
        if (res.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
        await fetchTablesData();
      }
    });
  }

  if (tableForm) {
    tableForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (modalError) modalError.classList.add('hidden');

      const editingId = inputId?.value;
      const payload = {
        tableNumber: inputNumber?.value.trim(),
        capacity: Number(inputCapacity?.value || 4),
        zoneId: inputZone?.value,
        status: inputStatus?.value,
        notes: inputNotes?.value.trim()
      };

      const url = editingId ? `/api/admin/tables/${editingId}` : '/api/admin/tables';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (modalError) {
          modalError.textContent = data.message || 'No se pudo guardar la mesa.';
          modalError.classList.remove('hidden');
        }
        return;
      }

      closeModal();
      await fetchTablesData();
    });
  }
});
