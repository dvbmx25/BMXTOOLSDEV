(function () {
  const grid = document.getElementById('tsGrid');
  if (!grid) return;

  const monthLabel = document.getElementById('tsMonthLabel');
  const prevBtn    = document.getElementById('tsPrev');
  const nextBtn    = document.getElementById('tsNext');
  const todayBtn   = document.getElementById('tsToday');

  const LS_KEY = 'bmxtools.training';
  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];

  /* ─────────────── STORAGE ─────────────── */
  function readAll() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
    catch { return {}; }
  }
  function writeAll(data) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
  }
  function monthKey(y, m) {
    return `${y}-${String(m + 1).padStart(2, '0')}`;
  }

  /* ─────────────── STATE ─────────────── */
  const now = new Date();
  let viewYear  = now.getFullYear();
  let viewMonth = now.getMonth();

  /* ─────────────── RENDER ─────────────── */
  function render() {
    monthLabel.textContent = `${MONTHS[viewMonth]} ${viewYear}`;
    grid.innerHTML = '';

    const firstDow = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    for (let i = 0; i < firstDow; i++) {
      const blank = document.createElement('div');
      blank.className = 'ts-day ts-day-blank';
      grid.appendChild(blank);
    }

    const all = readAll();
    const mk = monthKey(viewYear, viewMonth);
    const monthData = all[mk] || {};

    const todayY = now.getFullYear();
    const todayM = now.getMonth();
    const todayD = now.getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement('div');
      cell.className = 'ts-day';
      if (viewYear === todayY && viewMonth === todayM && d === todayD) {
        cell.classList.add('ts-today');
      }
      cell.dataset.day = d;
      renderDayCell(cell, d, monthData[d] || null);
      grid.appendChild(cell);
    }
  }

  function renderDayCell(cell, day, data) {
    cell.innerHTML = '';
    cell.classList.remove('ts-day-training', 'ts-day-has-race');

    const hasTraining = !!(data && (data.goals || data.journal));
    const hasRace = !!(data && data.race && (data.race.name || data.race.location));
    const isTrainingMarked = !!data; // Day has any entry at all

    if (!isTrainingMarked && !hasRace) {
      // Completely empty day
      cell.innerHTML = `
        <div class="ts-day-num">${day}</div>
        <button class="ts-train-btn" type="button">+ Train</button>
      `;
      cell.querySelector('.ts-train-btn').addEventListener('click', () => {
        openDayPopup(day, null);
      });
      return;
    }

    if (hasTraining) cell.classList.add('ts-day-training');
    if (hasRace) cell.classList.add('ts-day-has-race');

    // Build the top row: day number, training badge, race badge
    const trainingBadge = hasTraining
      ? `<span class="ts-badge">✓ Training</span>`
      : '';

    const raceBadge = hasRace
      ? `<span class="ts-race-badge" title="${escapeHtml(data.race.name || 'Race')}">🏁 ${escapeHtml(data.race.name || 'Race')}</span>`
      : '';

    const preview = hasTraining && data.goals
      ? (data.goals || '').trim().split('\n')[0].slice(0, 60)
      : '';

    const hasJournal = hasTraining && !!(data.journal || '').trim();

    cell.innerHTML = `
      <div class="ts-day-top">
        <div class="ts-day-num">${day}</div>
        ${trainingBadge}
      </div>
      ${raceBadge}
      ${preview ? `<div class="ts-day-preview">${escapeHtml(preview)}${preview.length === 60 ? '…' : ''}</div>` : ''}
      ${hasJournal ? `<div class="ts-day-hint">📝 Journal saved</div>` : ''}
      <button class="ts-edit-btn" type="button">${hasTraining ? 'Edit' : 'Add Training'}</button>
    `;

    cell.querySelector('.ts-edit-btn').addEventListener('click', () => {
      openDayPopup(day, data);
    });
  }

  /* ─────────────── DAY POPUP ─────────────── */
  let activePopup = null;

  function openDayPopup(day, existingData) {
    closeDayPopup();

    const sheet = document.getElementById('trainingSheet');
    if (!sheet) return;

    const label = new Date(viewYear, viewMonth, day)
      .toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

    const race = existingData?.race || null;
    const hasRace = !!(race && (race.name || race.location));

    // Default race date to the cell's day
    const defaultRaceDate = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const overlay = document.createElement('div');
    overlay.className = 'ts-popup-overlay';
    overlay.innerHTML = `
      <div class="ts-popup" role="dialog" aria-modal="true">
        <div class="ts-popup-header">
          <h3>${escapeHtml(label)}</h3>
          <button class="ts-popup-close" type="button" title="Close">×</button>
        </div>

        <div class="ts-race-section">
          <button class="ts-race-toggle" type="button" ${hasRace ? 'style="display:none;"' : ''}>🏁 Schedule a Race</button>
          <div class="ts-race-fields" ${hasRace ? '' : 'style="display:none;"'}>
            <div class="ts-race-heading">
              <span>🏁 Race Scheduled</span>
              <button class="ts-race-remove" type="button" title="Remove race">Remove</button>
            </div>
            <label class="ts-field-label">Race Name</label>
            <input type="text" class="ts-text-input ts-race-name" placeholder="e.g. State Qualifier"
                   value="${escapeHtml(race?.name || '')}">
            <label class="ts-field-label">Location</label>
            <input type="text" class="ts-text-input ts-race-location" placeholder="Track / city"
                   value="${escapeHtml(race?.location || '')}">
            <label class="ts-field-label">Race Date</label>
            <input type="date" class="ts-text-input ts-race-date" value="${escapeHtml(race?.date || defaultRaceDate)}">
          </div>
        </div>

        <label class="ts-field-label">Goals</label>
        <textarea class="ts-textarea ts-popup-goals" placeholder="What to work on…">${escapeHtml(existingData?.goals || '')}</textarea>
        <label class="ts-field-label">Journal</label>
        <textarea class="ts-textarea ts-popup-journal" placeholder="How it went…">${escapeHtml(existingData?.journal || '')}</textarea>
        <div class="ts-popup-actions">
          ${existingData ? '<button class="ts-popup-clear" type="button">Clear Day</button>' : ''}
          <div class="ts-popup-spacer"></div>
          <button class="ts-popup-cancel" type="button">Cancel</button>
          <button class="ts-popup-save" type="button">Save</button>
        </div>
      </div>
    `;

    sheet.appendChild(overlay);
    activePopup = overlay;

    const goalsEl    = overlay.querySelector('.ts-popup-goals');
    const journalEl  = overlay.querySelector('.ts-popup-journal');
    const raceToggle = overlay.querySelector('.ts-race-toggle');
    const raceFields = overlay.querySelector('.ts-race-fields');
    const raceName   = overlay.querySelector('.ts-race-name');
    const raceLoc    = overlay.querySelector('.ts-race-location');
    const raceDate   = overlay.querySelector('.ts-race-date');
    const raceRemove = overlay.querySelector('.ts-race-remove');

    setTimeout(() => goalsEl.focus(), 30);

    overlay.querySelector('.ts-popup-close').addEventListener('click', closeDayPopup);
    overlay.querySelector('.ts-popup-cancel').addEventListener('click', closeDayPopup);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDayPopup();
    });

    raceToggle.addEventListener('click', () => {
      raceToggle.style.display = 'none';
      raceFields.style.display = '';
      raceName.focus();
    });

    raceRemove.addEventListener('click', () => {
      raceName.value = '';
      raceLoc.value = '';
      raceDate.value = defaultRaceDate;
      raceFields.style.display = 'none';
      raceToggle.style.display = '';
    });

    overlay.querySelector('.ts-popup-save').addEventListener('click', () => {
      const all = readAll();
      const mk = monthKey(viewYear, viewMonth);
      if (!all[mk]) all[mk] = {};

      const goals   = goalsEl.value.trim();
      const journal = journalEl.value.trim();

      const raceOn = raceFields.style.display !== 'none';
      const newRace = raceOn ? {
        name: raceName.value.trim(),
        location: raceLoc.value.trim(),
        date: raceDate.value || defaultRaceDate
      } : null;

      const hasAnything =
        goals || journal || (newRace && (newRace.name || newRace.location));

      if (!hasAnything) {
        // Nothing to save — remove the day entirely
        delete all[mk][day];
        if (Object.keys(all[mk]).length === 0) delete all[mk];
      } else {
        all[mk][day] = { goals, journal };
        if (newRace && (newRace.name || newRace.location)) {
          all[mk][day].race = newRace;
        }
      }

      writeAll(all);

      const cellEl = grid.querySelector(`.ts-day[data-day="${day}"]`);
      if (cellEl) {
        renderDayCell(cellEl, day, all[mk]?.[day] || null);
      }
      closeDayPopup();
    });

    const clearBtn = overlay.querySelector('.ts-popup-clear');
    if (clearBtn) clearBtn.addEventListener('click', () => {
      if (!window.confirm('Clear everything on this day?')) return;
      const all = readAll();
      const mk = monthKey(viewYear, viewMonth);
      if (all[mk] && all[mk][day]) {
        delete all[mk][day];
        if (Object.keys(all[mk]).length === 0) delete all[mk];
        writeAll(all);
      }
      const cellEl = grid.querySelector(`.ts-day[data-day="${day}"]`);
      if (cellEl) renderDayCell(cellEl, day, null);
      closeDayPopup();
    });

    document.addEventListener('keydown', escClose);
  }

  function escClose(e) {
    if (e.key === 'Escape') closeDayPopup();
  }

  function closeDayPopup() {
    if (activePopup) {
      activePopup.remove();
      activePopup = null;
    }
    document.removeEventListener('keydown', escClose);
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ─────────────── NAVIGATION ─────────────── */
  prevBtn.addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    render();
  });
  nextBtn.addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    render();
  });
  todayBtn.addEventListener('click', () => {
    viewYear  = now.getFullYear();
    viewMonth = now.getMonth();
    render();
  });

  /* ─────────────── INIT ─────────────── */
  render();
})();