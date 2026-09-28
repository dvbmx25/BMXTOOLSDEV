// training.js — training plan builder with Supabase, drag-drop workout library, and journal.

(function () {
  const wrap = document.getElementById('trainingApp');
  if (!wrap) return;

  const authPopup     = document.getElementById('trainingAuthPopup');
  const wizard        = document.getElementById('tpWizard');
  const sheet         = document.getElementById('tpSheet');
  const goalInput     = document.getElementById('tpGoal');
  const raceNameInput = document.getElementById('tpRaceName');
  const raceDateInput = document.getElementById('tpRaceDate');
  const daysPicker    = document.getElementById('tpDaysPicker');
  const buildBtn      = document.getElementById('tpBuildBtn');
  const goalDisplay   = document.getElementById('tpGoalDisplay');
  const raceDisplay   = document.getElementById('tpRaceDisplay');
  const countdownEl   = document.getElementById('tpCountdown');
  const sessionsList  = document.getElementById('tpSessionsList');
  const libraryEl     = document.getElementById('tpLibrary');
  const addCategoryBtn= document.getElementById('tpAddCategoryBtn');
  const editPlanBtn   = document.getElementById('tpEditPlan');

  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const SEED_LIBRARY = {
    'Gate Work': [
      'Gate starts — gate form',
      '30ft sprints',
      '15-30ft uphill sprints'
    ],
    'Skills': [
      'Pump laps',
      'Manuals',
      'Double manuals'
    ],
    'Endurance': [
      'X half laps, first half',
      'X half laps, second half',
      'X full laps'
    ],
    'Custom': []
  };

  // Workouts that prompt for a number when dragged
  const NUMBER_PROMPT_WORKOUTS = new Set([
    'Pump laps',
    'X half laps, first half',
    'X half laps, second half',
    'X full laps'
  ]);

  let sb = null;
  let user = null;
  let plan = null;
  let sessions = [];
  let library = []; // [{ id, category, name, sort_order }]

  // ─────────────── BOOT ───────────────
  async function boot() {
    if (!window.BMX || !window.BMX.sb) {
      console.warn('training.js: waiting for supabase client');
      setTimeout(boot, 100);
      return;
    }
    if (window.BMX.authReady) await window.BMX.authReady;
    sb = window.BMX.sb;
    user = window.BMX.auth?.getUser?.() || null;

    if (!user) {
      showAuthPopup();
      return;
    }

    wrap.style.display = '';
    await ensureLibrary();
    await loadPlan();
  }

  function showAuthPopup() {
    authPopup.style.display = 'flex';
    wrap.style.display = 'none';
  }

  // ─────────────── WORKOUT LIBRARY ───────────────
  async function ensureLibrary() {
    const { data, error } = await sb
      .from('workout_library')
      .select('*')
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true });

    if (error) { console.error('library load:', error); return; }

    if (!data || data.length === 0) {
      // Seed the library on first load
      const rows = [];
      Object.entries(SEED_LIBRARY).forEach(([category, items]) => {
        items.forEach((name, i) => {
          rows.push({ user_id: user.id, category, name, sort_order: i });
        });
      });
      if (rows.length) {
        const { error: insertErr } = await sb.from('workout_library').insert(rows);
        if (insertErr) console.error('seed library:', insertErr);
        const { data: fresh } = await sb
          .from('workout_library')
          .select('*')
          .order('category', { ascending: true })
          .order('sort_order', { ascending: true });
        library = fresh || [];
      } else {
        library = [];
      }
    } else {
      library = data;
    }
  }

  function renderLibrary() {
    libraryEl.innerHTML = '';
    const grouped = {};
    library.forEach(w => {
      if (!grouped[w.category]) grouped[w.category] = [];
      grouped[w.category].push(w);
    });

    // Ensure Custom always appears
    if (!grouped['Custom']) grouped['Custom'] = [];

    Object.keys(grouped).forEach(category => {
      const group = document.createElement('div');
      group.className = 'tp-lib-group';

      const header = document.createElement('div');
      header.className = 'tp-lib-header';
      header.innerHTML = `<span class="tp-lib-toggle">▼</span> ${escapeHtml(category)} <span class="tp-lib-count">${grouped[category].length}</span>`;
      header.addEventListener('click', () => group.classList.toggle('collapsed'));
      group.appendChild(header);

      const body = document.createElement('div');
      body.className = 'tp-lib-body';

      grouped[category].forEach(w => {
        const item = document.createElement('div');
        item.className = 'tp-lib-item';
        item.draggable = true;
        item.dataset.id = w.id;
        item.dataset.category = w.category;
        item.dataset.name = w.name;
        item.innerHTML = `
          <span class="tp-lib-name">${escapeHtml(w.name)}</span>
          <button class="tp-lib-del" type="button" title="Delete">×</button>
        `;
        item.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', JSON.stringify({ id: w.id, name: w.name }));
          item.classList.add('dragging');
        });
        item.addEventListener('dragend', () => item.classList.remove('dragging'));
        item.querySelector('.tp-lib-del').addEventListener('click', async (e) => {
          e.stopPropagation();
          if (!window.confirm(`Delete "${w.name}" from your library?`)) return;
          await sb.from('workout_library').delete().eq('id', w.id);
          library = library.filter(x => x.id !== w.id);
          renderLibrary();
        });
        body.appendChild(item);
      });

      // Add workout input
      const addRow = document.createElement('div');
      addRow.className = 'tp-lib-add-row';
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = '+ Add workout';
      input.className = 'tp-lib-add-input';
      input.addEventListener('keydown', async (e) => {
        if (e.key !== 'Enter') return;
        const name = input.value.trim();
        if (!name) return;
        const sortOrder = (grouped[category].length || 0);
        const { data, error } = await sb.from('workout_library').insert({
          user_id: user.id, category, name, sort_order: sortOrder
        }).select().single();
        if (error) { console.error('add workout:', error); return; }
        library.push(data);
        input.value = '';
        renderLibrary();
      });
      addRow.appendChild(input);
      body.appendChild(addRow);

      group.appendChild(body);
      libraryEl.appendChild(group);
    });
  }

  addCategoryBtn.addEventListener('click', async () => {
    const name = window.prompt('New category name:');
    if (!name || !name.trim()) return;
    // We create a category by inserting a placeholder — but the user asked for no auto-fill,
    // so instead just add it as an empty category client-side until a workout is added.
    // Simplest: add a workout to that category immediately.
    const firstWorkout = window.prompt(`Add first workout to "${name}":`);
    if (!firstWorkout || !firstWorkout.trim()) return;
    const { data, error } = await sb.from('workout_library').insert({
      user_id: user.id, category: name.trim(), name: firstWorkout.trim(), sort_order: 0
    }).select().single();
    if (error) { console.error('add category:', error); return; }
    library.push(data);
    renderLibrary();
  });

  // ─────────────── PLAN ───────────────
  async function loadPlan() {
    const { data: plans, error } = await sb
      .from('training_plans')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) { console.error('plan load:', error); return; }

    if (!plans || plans.length === 0) {
      showWizard();
      return;
    }

    plan = plans[0];
    await loadSessions();
    renderDashboard();
  }

  async function loadSessions() {
    const { data, error } = await sb
      .from('training_sessions')
      .select('*')
      .eq('plan_id', plan.id)
      .order('session_date', { ascending: true });

    if (error) { console.error('sessions load:', error); return; }
    sessions = data || [];
  }

  function showWizard() {
    wizard.style.display = '';
    sheet.style.display = 'none';

    // Days picker
    daysPicker.innerHTML = '';
    DAYS.forEach((d, i) => {
      const label = document.createElement('label');
      label.className = 'tp-day-chip';
      label.innerHTML = `<input type="checkbox" value="${i}"> ${d}`;
      daysPicker.appendChild(label);
    });

    // Default race date: 6 weeks out
    if (!raceDateInput.value) {
      const d = new Date();
      d.setDate(d.getDate() + 42);
      raceDateInput.value = d.toISOString().slice(0, 10);
    }

    // Pre-fill if editing
    if (plan) {
      goalInput.value = plan.goal || '';
      raceNameInput.value = plan.race_name || '';
      raceDateInput.value = plan.race_date || '';
      (plan.training_days || []).forEach(d => {
        const cb = daysPicker.querySelector(`input[value="${d}"]`);
        if (cb) cb.checked = true;
      });
    }
  }

  buildBtn.addEventListener('click', async () => {
    const goal = goalInput.value.trim();
    const raceName = raceNameInput.value.trim();
    const raceDate = raceDateInput.value;
    const trainingDays = Array.from(daysPicker.querySelectorAll('input:checked')).map(cb => Number(cb.value));

    if (!goal) { alert('Please enter a goal.'); return; }
    if (!raceDate) { alert('Please pick a race date.'); return; }
    if (trainingDays.length === 0) { alert('Please pick at least one training day.'); return; }

    if (plan) {
      // Update existing plan
      const { error } = await sb.from('training_plans').update({
        goal, race_name: raceName, race_date: raceDate,
        training_days: trainingDays, updated_at: new Date().toISOString()
      }).eq('id', plan.id);
      if (error) { console.error('plan update:', error); return; }

      const regen = window.confirm('Do you want to rebuild your training sessions?\n\nOK = rebuild sessions from today until race day (past journals are kept).\nCancel = only add any new sessions that don\'t exist yet.');
      if (regen) {
        await rebuildSessions(trainingDays, raceDate);
      } else {
        await addMissingSessions(trainingDays, raceDate);
      }

      Object.assign(plan, { goal, race_name: raceName, race_date: raceDate, training_days: trainingDays });
      await loadSessions();
      renderDashboard();
    } else {
      // Create new plan
      const { data, error } = await sb.from('training_plans').insert({
        user_id: user.id, goal, race_name: raceName, race_date: raceDate, training_days: trainingDays
      }).select().single();
      if (error) { console.error('plan insert:', error); return; }
      plan = data;
      await generateSessions(trainingDays, raceDate);
      await loadSessions();
      renderDashboard();
    }
  });

  async function generateSessions(trainingDays, raceDate) {
    const rows = [];
    const today = new Date(); today.setHours(0,0,0,0);
    const end = new Date(raceDate + 'T00:00:00');
    const cursor = new Date(today);
    while (cursor <= end) {
      if (trainingDays.includes(cursor.getDay())) {
        rows.push({
          plan_id: plan.id,
          user_id: user.id,
          session_date: cursor.toISOString().slice(0, 10),
          focus: plan.goal || '',
          journal: '',
          completed: false
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    if (rows.length) {
      const { error } = await sb.from('training_sessions').insert(rows);
      if (error) console.error('session insert:', error);
    }
  }

  async function rebuildSessions(trainingDays, raceDate) {
    // Delete all future (non-completed) sessions
    const todayStr = new Date().toISOString().slice(0, 10);
    const { error: delErr } = await sb
      .from('training_sessions')
      .delete()
      .eq('plan_id', plan.id)
      .gte('session_date', todayStr)
      .eq('completed', false);
    if (delErr) { console.error('session cleanup:', delErr); return; }

    const rows = [];
    const today = new Date(); today.setHours(0,0,0,0);
    const end = new Date(raceDate + 'T00:00:00');
    const cursor = new Date(today);
    while (cursor <= end) {
      if (trainingDays.includes(cursor.getDay())) {
        rows.push({
          plan_id: plan.id,
          user_id: user.id,
          session_date: cursor.toISOString().slice(0, 10),
          focus: plan.goal || '',
          journal: '',
          completed: false
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    if (rows.length) {
      const { error } = await sb.from('training_sessions').insert(rows);
      if (error) console.error('session rebuild:', error);
    }
  }

  async function addMissingSessions(trainingDays, raceDate) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const existing = new Set(sessions.map(s => s.session_date));
    const rows = [];
    const today = new Date(); today.setHours(0,0,0,0);
    const end = new Date(raceDate + 'T00:00:00');
    const cursor = new Date(today);
    while (cursor <= end) {
      const iso = cursor.toISOString().slice(0, 10);
      if (trainingDays.includes(cursor.getDay()) && !existing.has(iso)) {
        rows.push({
          plan_id: plan.id, user_id: user.id,
          session_date: iso, focus: plan.goal || '',
          journal: '', completed: false
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    if (rows.length) {
      const { error } = await sb.from('training_sessions').insert(rows);
      if (error) console.error('session add:', error);
    }
  }

  editPlanBtn.addEventListener('click', () => {
    showWizard();
  });

  // ─────────────── DASHBOARD ───────────────
  function renderDashboard() {
    wizard.style.display = 'none';
    sheet.style.display = '';

    goalDisplay.textContent = plan.goal || '—';
    raceDisplay.textContent = `${plan.race_name || 'Race'} · ${formatDate(plan.race_date)}`;

    // Countdown
    if (plan.race_date) {
      const today = new Date(); today.setHours(0,0,0,0);
      const race = new Date(plan.race_date + 'T00:00:00');
      const days = Math.round((race - today) / (1000 * 60 * 60 * 24));
      if (days > 0) countdownEl.textContent = `${days} day${days === 1 ? '' : 's'} until race`;
      else if (days === 0) countdownEl.textContent = 'Race day!';
      else countdownEl.textContent = `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} since race`;
    } else {
      countdownEl.textContent = '';
    }

    renderSessions();
    renderLibrary();
  }

  function renderSessions() {
    sessionsList.innerHTML = '';
    if (!sessions.length) {
      sessionsList.innerHTML = '<p class="tp-empty">No sessions yet. Click Edit Plan to generate your schedule.</p>';
      return;
    }

    // Group by week starting Sunday
    const groups = {};
    const today = new Date(); today.setHours(0,0,0,0);
    sessions.forEach(s => {
      const d = new Date(s.session_date + 'T00:00:00');
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().slice(0, 10);
      if (!groups[key]) groups[key] = [];
      groups[key].push(s);
    });

    const pastGroups = [];
    const currentAndFuture = [];

    Object.entries(groups).forEach(([key, list]) => {
      const weekStart = new Date(key + 'T00:00:00');
      const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);
      const isPast = weekEnd < today;
      (isPast ? pastGroups : currentAndFuture).push({ key, list, weekStart, weekEnd });
    });

    currentAndFuture.forEach(g => sessionsList.appendChild(renderWeekGroup(g, false)));

    if (pastGroups.length) {
      const pastWrap = document.createElement('div');
      pastWrap.className = 'tp-past-wrap';
      const pastHeader = document.createElement('button');
      pastHeader.className = 'tp-past-toggle';
      pastHeader.textContent = `▼ Past Sessions (${pastGroups.reduce((a, g) => a + g.list.length, 0)})`;
      pastWrap.appendChild(pastHeader);
      const pastBody = document.createElement('div');
      pastBody.className = 'tp-past-body';
      pastBody.style.display = 'none';
      pastGroups.forEach(g => pastBody.appendChild(renderWeekGroup(g, true)));
      pastWrap.appendChild(pastBody);
      pastHeader.addEventListener('click', () => {
        const open = pastBody.style.display !== 'none';
        pastBody.style.display = open ? 'none' : '';
        pastHeader.textContent = `${open ? '▼' : '▶'} Past Sessions (${pastGroups.reduce((a, g) => a + g.list.length, 0)})`;
      });
      sessionsList.appendChild(pastWrap);
    }
  }

  function renderWeekGroup(g, isPast) {
    const wrap = document.createElement('div');
    wrap.className = 'tp-week-group';

    const label = document.createElement('div');
    label.className = 'tp-week-label';
    const sameMonth = g.weekStart.getMonth() === g.weekEnd.getMonth();
    label.textContent = sameMonth
      ? `Week of ${g.weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
      : `${g.weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${g.weekEnd.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
    wrap.appendChild(label);

    g.list.forEach(s => wrap.appendChild(renderSessionRow(s, isPast)));
    return wrap;
  }

  function renderSessionRow(s, isPast) {
    const row = document.createElement('div');
    row.className = 'tp-session-row' + (s.completed ? ' completed' : '');
    row.dataset.id = s.id;

    const d = new Date(s.session_date + 'T00:00:00');
    const dateLabel = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

    row.innerHTML = `
      <div class="tp-session-head">
        <label class="tp-session-check">
          <input type="checkbox" ${s.completed ? 'checked' : ''}>
        </label>
        <div class="tp-session-date">${dateLabel}</div>
        <div class="tp-session-focus">${escapeHtml(s.focus || 'Drop a workout here…')}</div>
      </div>
      <div class="tp-session-body">
        <textarea class="tp-session-journal" placeholder="How did it go?">${escapeHtml(s.journal || '')}</textarea>
      </div>
    `;

    // Complete toggle
    row.querySelector('input[type="checkbox"]').addEventListener('change', async (e) => {
      const completed = e.target.checked;
      s.completed = completed;
      row.classList.toggle('completed', completed);
      await sb.from('training_sessions').update({ completed, updated_at: new Date().toISOString() }).eq('id', s.id);
    });

    // Journal auto-save on blur
    const journalEl = row.querySelector('.tp-session-journal');
    journalEl.addEventListener('blur', async () => {
      const journal = journalEl.value;
      if (journal === (s.journal || '')) return;
      s.journal = journal;
      await sb.from('training_sessions').update({ journal, updated_at: new Date().toISOString() }).eq('id', s.id);
      flashRow(row);
    });

    // Drop target for workouts
    row.addEventListener('dragover', (e) => {
      e.preventDefault();
      row.classList.add('drop-target');
    });
    row.addEventListener('dragleave', () => row.classList.remove('drop-target'));
    row.addEventListener('drop', async (e) => {
      e.preventDefault();
      row.classList.remove('drop-target');
      const data = e.dataTransfer.getData('text/plain');
      if (!data) return;
      let payload;
      try { payload = JSON.parse(data); } catch { return; }

      let newFocus = payload.name;
      if (NUMBER_PROMPT_WORKOUTS.has(payload.name)) {
        const num = window.prompt(`How many for "${payload.name}"?`, '5');
        if (num === null) return;
        newFocus = payload.name.replace(/^X\s+/i, `${num} `);
      }

      s.focus = newFocus;
      row.querySelector('.tp-session-focus').textContent = newFocus;
      await sb.from('training_sessions').update({ focus: newFocus, updated_at: new Date().toISOString() }).eq('id', s.id);
      flashRow(row);
    });

    return row;
  }

  function flashRow(row) {
    row.classList.add('flash-saved');
    setTimeout(() => row.classList.remove('flash-saved'), 700);
  }

  // ─────────────── HELPERS ───────────────
  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ─────────────── INIT ───────────────
  boot();

  // Re-check auth when it changes
  if (window.BMX && window.BMX.auth) {
    window.BMX.auth.onChange((u) => {
      user = u;
      if (user) {
        authPopup.style.display = 'none';
        wrap.style.display = '';
        ensureLibrary().then(loadPlan);
      } else {
        showAuthPopup();
      }
    });
  }
})();
