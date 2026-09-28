// training.js — training plan builder with Supabase, collapsible sessions, drag-drop library,
// 3-day race finish archiving, and past-plan viewer.

(function () {
  const wrap = document.getElementById('trainingApp');
  if (!wrap) return;

  // Element refs
  const authPopup     = document.getElementById('trainingAuthPopup');
  const wizard        = document.getElementById('tpWizard');
  const wizardTitle   = document.getElementById('tpWizardTitle');
  const wizardCancel  = document.getElementById('tpWizardCancel');
  const sheet         = document.getElementById('tpSheet');
  const goalInput     = document.getElementById('tpGoal');
  const raceNameInput = document.getElementById('tpRaceName');
  const raceDateInput = document.getElementById('tpRaceDate');
  const buildBtn      = document.getElementById('tpBuildBtn');
  const goalDisplay   = document.getElementById('tpGoalDisplay');
  const raceDisplay   = document.getElementById('tpRaceDisplay');
  const countdownEl   = document.getElementById('tpCountdown');
  const sessionsList  = document.getElementById('tpSessionsList');
  const libraryEl     = document.getElementById('tpLibrary');
  const addCategoryBtn= document.getElementById('tpAddCategoryBtn');
  const editPlanBtn   = document.getElementById('tpEditPlan');

  const pastPlansSection = document.getElementById('tpPastPlansSection');
  const pastPlansToggle  = document.getElementById('tpPastPlansToggle');
  const pastPlansCount   = document.getElementById('tpPastPlansCount');
  const pastPlansBody    = document.getElementById('tpPastPlansBody');

  const numberPopup   = document.getElementById('tpNumberPopup');
  const numberPopupTitle = document.getElementById('tpNumberPopupTitle');
  const numberPopupSub   = document.getElementById('tpNumberPopupSub');
  const numberInput   = document.getElementById('tpNumberInput');
  const numberConfirm = document.getElementById('tpNumberConfirm');
  const numberCancel  = document.getElementById('tpNumberCancel');

  const categoryPopup       = document.getElementById('tpCategoryPopup');
  const categoryName        = document.getElementById('tpCategoryName');
  const categoryFirstWorkout= document.getElementById('tpCategoryFirstWorkout');
  const categoryConfirm     = document.getElementById('tpCategoryConfirm');
  const categoryCancel      = document.getElementById('tpCategoryCancel');

  const confirmPopup   = document.getElementById('tpConfirmPopup');
  const confirmTitle   = document.getElementById('tpConfirmTitle');
  const confirmMessage = document.getElementById('tpConfirmMessage');
  const confirmOk      = document.getElementById('tpConfirmOk');
  const confirmCancel  = document.getElementById('tpConfirmCancel');

  const raceResultPopup = document.getElementById('tpRaceResultPopup');
  const finishDay1      = document.getElementById('tpFinishDay1');
  const finishDay2      = document.getElementById('tpFinishDay2');
  const finishDay3      = document.getElementById('tpFinishDay3');
  const raceResultSave  = document.getElementById('tpRaceResultSave');
  const raceResultCancel= document.getElementById('tpRaceResultCancel');

  const DEFAULT_TRAINING_DAYS = [1, 3, 5];

  const SEED_LIBRARY = {
    'Gate Work': ['Gate starts — gate form', '30ft sprints', '15-30ft uphill sprints'],
    'Skills':    ['Pump laps', 'Manuals', 'Double manuals'],
    'Endurance': ['X half laps, first half', 'X half laps, second half', 'X full laps'],
    'Custom':    []
  };

  const NUMBER_PROMPT_WORKOUTS = new Set([
    'Pump laps', 'X half laps, first half', 'X half laps, second half', 'X full laps'
  ]);

  let sb = null;
  let user = null;
  let plan = null;               // active (non-archived) plan
  let sessions = [];             // sessions for active plan
  let library = [];
  let archivedPlans = [];        // [{ plan, sessions }]
  let initialized = false;

  // Session expansion state — expanded ones are tracked; default is collapsed
  const expandedSessions = new Set();

  async function boot() {
    if (!window.BMX || !window.BMX.sb) { setTimeout(boot, 100); return; }
    if (window.BMX.authReady) await window.BMX.authReady;
    sb = window.BMX.sb;
    user = window.BMX.auth?.getUser?.() || null;
    if (!user) { showAuthPopup(); return; }
    wrap.style.display = '';
    if (!initialized) {
      initialized = true;
      await ensureLibrary();
      await loadActivePlan();
      await loadArchivedPlans();
    }
  }

  function showAuthPopup() {
    authPopup.style.display = 'flex';
    wrap.style.display = 'none';
  }

  /* ─────────────── CONFIRM POPUP ─────────────── */
  let confirmResolve = null;
  function showConfirm(title, message, okLabel) {
    return new Promise(resolve => {
      confirmResolve = resolve;
      confirmTitle.textContent = title;
      confirmMessage.textContent = message;
      confirmOk.textContent = okLabel || 'Confirm';
      confirmPopup.style.display = 'flex';
    });
  }
  function closeConfirm(result) {
    confirmPopup.style.display = 'none';
    if (confirmResolve) { confirmResolve(result); confirmResolve = null; }
  }
  confirmOk.addEventListener('click', () => closeConfirm(true));
  confirmCancel.addEventListener('click', () => closeConfirm(false));
  confirmPopup.addEventListener('click', (e) => { if (e.target === confirmPopup) closeConfirm(false); });

  /* ─────────────── LIBRARY ─────────────── */
  async function ensureLibrary() {
    if (!sb || !user) return;
    const { data, error } = await sb.from('workout_library').select('*')
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true });
    if (error) { console.error('library load:', error); return; }

    if (!data || data.length === 0) {
      const rows = [];
      Object.entries(SEED_LIBRARY).forEach(([category, items]) => {
        items.forEach((name, i) => rows.push({ user_id: user.id, category, name, sort_order: i }));
      });
      if (rows.length) {
        const { error: insertErr } = await sb.from('workout_library').insert(rows);
        if (insertErr) console.error('seed library:', insertErr);
        const { data: fresh } = await sb.from('workout_library').select('*')
          .order('category', { ascending: true })
          .order('sort_order', { ascending: true });
        library = fresh || [];
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
    if (!grouped['Custom']) grouped['Custom'] = [];

    Object.keys(grouped).forEach(category => {
      const group = document.createElement('div');
      group.className = 'tp-lib-group collapsed';

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
        item.dataset.name = w.name;
        item.innerHTML = `<span class="tp-lib-name">${escapeHtml(w.name)}</span>
          <button class="tp-lib-del" type="button" title="Delete">×</button>`;
        item.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', JSON.stringify({ id: w.id, name: w.name }));
          item.classList.add('dragging');
        });
        item.addEventListener('dragend', () => item.classList.remove('dragging'));
        item.querySelector('.tp-lib-del').addEventListener('click', async (e) => {
          e.stopPropagation();
          const ok = await showConfirm('Delete workout', `Delete "${w.name}" from your library?`, 'Delete');
          if (!ok) return;
          await sb.from('workout_library').delete().eq('id', w.id);
          library = library.filter(x => x.id !== w.id);
          renderLibrary();
        });
        body.appendChild(item);
      });

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

  /* ─────────────── ADD CATEGORY ─────────────── */
  function openCategoryPopup() {
    categoryName.value = '';
    categoryFirstWorkout.value = '';
    categoryPopup.style.display = 'flex';
    setTimeout(() => categoryName.focus(), 30);
  }
  function closeCategoryPopup() { categoryPopup.style.display = 'none'; }
  addCategoryBtn.addEventListener('click', openCategoryPopup);
  categoryCancel.addEventListener('click', closeCategoryPopup);
  categoryPopup.addEventListener('click', (e) => { if (e.target === categoryPopup) closeCategoryPopup(); });

  categoryConfirm.addEventListener('click', async () => {
    const name = categoryName.value.trim();
    const firstWorkout = categoryFirstWorkout.value.trim();
    if (!name) { categoryName.focus(); return; }
    if (!firstWorkout) { categoryFirstWorkout.focus(); return; }
    const { data, error } = await sb.from('workout_library').insert({
      user_id: user.id, category: name, name: firstWorkout, sort_order: 0
    }).select().single();
    if (error) { console.error('add category:', error); return; }
    library.push(data);
    closeCategoryPopup();
    renderLibrary();
  });
  categoryFirstWorkout.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); categoryConfirm.click(); }
  });
  categoryName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); categoryFirstWorkout.focus(); }
    if (e.key === 'Escape') { e.preventDefault(); closeCategoryPopup(); }
  });

  /* ─────────────── ACTIVE PLAN ─────────────── */
  async function loadActivePlan() {
    if (!sb || !user) return;
    const { data: plans, error } = await sb.from('training_plans').select('*')
      .eq('archived', false)
      .order('created_at', { ascending: false })
      .limit(1);
    if (error) { console.error('plan load:', error); return; }

    if (!plans || plans.length === 0) {
      plan = null; sessions = [];
      showWizard(false);
      return;
    }
    plan = plans[0];
    await loadSessions();
    renderDashboard();
    maybePromptRaceResult();
  }

  async function loadSessions() {
    if (!sb || !plan) return;
    const { data, error } = await sb.from('training_sessions').select('*')
      .eq('plan_id', plan.id)
      .order('session_date', { ascending: true });
    if (error) { console.error('sessions load:', error); return; }
    sessions = data || [];
  }

  function showWizard(isEdit) {
    wizard.style.display = '';
    sheet.style.display = 'none';

    if (isEdit) {
      wizardTitle.textContent = 'Edit your training plan';
      buildBtn.textContent = 'Save Plan';
      wizardCancel.style.display = '';
    } else {
      wizardTitle.textContent = 'Set up your training plan';
      buildBtn.textContent = 'Build My Plan';
      wizardCancel.style.display = 'none';
    }

    goalInput.value = plan?.goal || '';
    raceNameInput.value = plan?.race_name || '';
    raceDateInput.value = plan?.race_date || '';

    if (!raceDateInput.value) {
      const d = new Date();
      d.setDate(d.getDate() + 42);
      raceDateInput.value = d.toISOString().slice(0, 10);
    }
  }

  wizardCancel.addEventListener('click', () => { if (plan) renderDashboard(); });

  buildBtn.addEventListener('click', async () => {
    const goal = goalInput.value.trim();
    const raceName = raceNameInput.value.trim();
    const raceDate = raceDateInput.value;
    const trainingDays = DEFAULT_TRAINING_DAYS;

    if (!goal) { alert('Please enter a goal.'); return; }
    if (!raceDate) { alert('Please pick a race date.'); return; }

    if (plan) {
      const { error } = await sb.from('training_plans').update({
        goal, race_name: raceName, race_date: raceDate,
        training_days: trainingDays, updated_at: new Date().toISOString()
      }).eq('id', plan.id);
      if (error) { console.error('plan update:', error); return; }

      const regen = await showConfirm(
        'Rebuild sessions?',
        'OK = rebuild future sessions until race day (past journals are kept). Cancel = only add missing sessions.',
        'Rebuild'
      );
      if (regen) await rebuildSessions(trainingDays, raceDate);
      else       await addMissingSessions(trainingDays, raceDate);

      Object.assign(plan, { goal, race_name: raceName, race_date: raceDate, training_days: trainingDays });
      await loadSessions();
      renderDashboard();
      maybePromptRaceResult();
    } else {
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
        rows.push({ plan_id: plan.id, user_id: user.id,
          session_date: cursor.toISOString().slice(0,10),
          focus: '', journal: '', completed: false });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    if (rows.length) {
      const { error } = await sb.from('training_sessions').insert(rows);
      if (error) console.error('session insert:', error);
    }
  }

  async function rebuildSessions(trainingDays, raceDate) {
    const todayStr = new Date().toISOString().slice(0,10);
    await sb.from('training_sessions').delete()
      .eq('plan_id', plan.id).gte('session_date', todayStr).eq('completed', false);
    await generateSessions(trainingDays, raceDate);
  }

  async function addMissingSessions(trainingDays, raceDate) {
    const existing = new Set(sessions.map(s => s.session_date));
    const rows = [];
    const today = new Date(); today.setHours(0,0,0,0);
    const end = new Date(raceDate + 'T00:00:00');
    const cursor = new Date(today);
    while (cursor <= end) {
      const iso = cursor.toISOString().slice(0,10);
      if (trainingDays.includes(cursor.getDay()) && !existing.has(iso)) {
        rows.push({ plan_id: plan.id, user_id: user.id,
          session_date: iso, focus: '', journal: '', completed: false });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    if (rows.length) {
      const { error } = await sb.from('training_sessions').insert(rows);
      if (error) console.error('session add:', error);
    }
  }

  editPlanBtn.addEventListener('click', () => showWizard(true));

  /* ─────────────── NUMBER POPUP ─────────────── */
  let numberPopupResolve = null;
  function openNumberPopup(workoutName) {
    return new Promise(resolve => {
      numberPopupResolve = resolve;
      numberPopupTitle.textContent = workoutName;
      numberPopupSub.textContent = 'How many reps?';
      numberInput.value = '5';
      numberPopup.style.display = 'flex';
      setTimeout(() => { numberInput.focus(); numberInput.select(); }, 30);
    });
  }
  function closeNumberPopup(result) {
    numberPopup.style.display = 'none';
    if (numberPopupResolve) { numberPopupResolve(result); numberPopupResolve = null; }
  }
  numberConfirm.addEventListener('click', () => {
    const val = numberInput.value.trim();
    const num = val ? Number(val) : null;
    if (!num || isNaN(num) || num < 1) { numberInput.focus(); return; }
    closeNumberPopup(num);
  });
  numberCancel.addEventListener('click', () => closeNumberPopup(null));
  numberInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  { e.preventDefault(); numberConfirm.click(); }
    if (e.key === 'Escape') { e.preventDefault(); closeNumberPopup(null); }
  });
  numberPopup.addEventListener('click', (e) => { if (e.target === numberPopup) closeNumberPopup(null); });

  /* ─────────────── RACE RESULT POPUP ─────────────── */
  let raceResultResolve = null;

  function openRaceResultPopup() {
    return new Promise(resolve => {
      raceResultResolve = resolve;
      const existing = Array.isArray(plan?.race_finishes) ? plan.race_finishes : [];
      finishDay1.value = existing[0]?.result || '';
      finishDay2.value = existing[1]?.result || '';
      finishDay3.value = existing[2]?.result || '';
      raceResultPopup.style.display = 'flex';
      setTimeout(() => finishDay1.focus(), 30);
    });
  }

  function closeRaceResultPopup(result) {
    raceResultPopup.style.display = 'none';
    if (raceResultResolve) { raceResultResolve(result); raceResultResolve = null; }
  }

  raceResultSave.addEventListener('click', () => {
    const finishes = [
      { label: 'Day 1', result: finishDay1.value.trim() },
      { label: 'Day 2', result: finishDay2.value.trim() },
      { label: 'Day 3', result: finishDay3.value.trim() }
    ];
    closeRaceResultPopup(finishes);
  });

  raceResultCancel.addEventListener('click', () => closeRaceResultPopup(null));
  raceResultPopup.addEventListener('click', (e) => {
    if (e.target === raceResultPopup) closeRaceResultPopup(null);
  });

  // Detect that the race has happened and prompt if we haven't archived yet
  function maybePromptRaceResult() {
    if (!plan || plan.archived) return;
    if (!plan.race_date) return;
    const today = new Date(); today.setHours(0,0,0,0);
    const race = new Date(plan.race_date + 'T00:00:00');
    // Prompt starting the day AFTER the race
    if (race >= today) return;
    // Only auto-prompt once per session, and only if we haven't already got finishes stored
    const existing = Array.isArray(plan.race_finishes) ? plan.race_finishes : [];
    if (existing.some(f => f.result)) return; // already has finishes, don't nag

    setTimeout(() => promptRaceResultAndArchive(), 500);
  }

  async function promptRaceResultAndArchive() {
    const finishes = await openRaceResultPopup();
    if (!finishes) return; // user clicked Later
    await archivePlan(finishes);
  }

  async function archivePlan(finishes) {
    const { error } = await sb.from('training_plans').update({
      race_finishes: finishes,
      archived: true,
      archived_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).eq('id', plan.id);
    if (error) { console.error('archive error:', error); return; }

    // Reload everything: clear active plan, refresh archived, show wizard for next block
    plan = null;
    sessions = [];
    await loadArchivedPlans();
    showWizard(false);
  }

  /* ─────────────── ARCHIVED PLANS ─────────────── */
  async function loadArchivedPlans() {
    if (!sb || !user) return;
    const { data: plans, error } = await sb.from('training_plans').select('*')
      .eq('archived', true)
      .order('archived_at', { ascending: false });
    if (error) { console.error('archived plans load:', error); return; }

    archivedPlans = [];
    for (const p of (plans || [])) {
      const { data: sess } = await sb.from('training_sessions').select('*')
        .eq('plan_id', p.id)
        .order('session_date', { ascending: true });
      archivedPlans.push({ plan: p, sessions: sess || [] });
    }
    renderPastPlans();
  }

  pastPlansToggle.addEventListener('click', () => {
    const open = pastPlansBody.style.display !== 'none';
    pastPlansBody.style.display = open ? 'none' : '';
    pastPlansToggle.querySelector('.tp-past-plans-chevron').textContent = open ? '▶' : '▼';
  });

  function renderPastPlans() {
    if (!archivedPlans.length) {
      pastPlansSection.style.display = 'none';
      return;
    }
    pastPlansSection.style.display = '';
    pastPlansCount.textContent = archivedPlans.length;

    pastPlansBody.innerHTML = '';
    archivedPlans.forEach(entry => {
      pastPlansBody.appendChild(renderArchivedPlan(entry));
    });
  }

  function renderArchivedPlan(entry) {
    const { plan: p, sessions: sess } = entry;

    const wrapEl = document.createElement('div');
    wrapEl.className = 'tp-archived-plan';

    const completed = sess.filter(s => s.completed).length;
    const total = sess.length;

    // Summary line from the finishes
    const finishes = Array.isArray(p.race_finishes) ? p.race_finishes : [];
    const finishSummary = finishes
      .filter(f => f.result)
      .map(f => `${f.label}: ${f.result}`)
      .join(' · ') || 'No results recorded';

    const header = document.createElement('div');
    header.className = 'tp-archived-header';
    header.innerHTML = `
      <div class="tp-archived-header-main">
        <div class="tp-archived-goal">${escapeHtml(p.goal || 'Training block')}</div>
        <div class="tp-archived-meta">${escapeHtml(p.race_name || 'Race')} · ${formatDate(p.race_date)} · ${completed}/${total} sessions completed</div>
        <div class="tp-archived-results">${escapeHtml(finishSummary)}</div>
      </div>
      <span class="tp-archived-chevron">▶</span>
    `;
    wrapEl.appendChild(header);

    const body = document.createElement('div');
    body.className = 'tp-archived-body';
    body.style.display = 'none';

    if (!sess.length) {
      body.innerHTML = '<p class="tp-empty">No sessions recorded.</p>';
    } else {
      sess.forEach(s => {
        const row = document.createElement('div');
        row.className = 'tp-archived-session' + (s.completed ? ' completed' : '');
        const d = new Date(s.session_date + 'T00:00:00');
        const dateLabel = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        const workouts = parseFocus(s.focus);
        const workoutsHtml = workouts.length
          ? `<ul class="tp-workout-list">${workouts.map(w => `<li class="tp-workout-item"><span class="tp-workout-name">${escapeHtml(w)}</span></li>`).join('')}</ul>`
          : '';
        row.innerHTML = `
          <div class="tp-archived-session-head">
            <span class="tp-archived-session-date">${dateLabel}</span>
            <span class="tp-archived-session-status">${s.completed ? '✓' : '—'}</span>
          </div>
          ${workoutsHtml}
          ${s.journal ? `<div class="tp-archived-journal">${escapeHtml(s.journal)}</div>` : ''}
        `;
        body.appendChild(row);
      });
    }

    wrapEl.appendChild(body);

    header.addEventListener('click', () => {
      const open = body.style.display !== 'none';
      body.style.display = open ? 'none' : '';
      header.querySelector('.tp-archived-chevron').textContent = open ? '▶' : '▼';
    });

    return wrapEl;
  }

  /* ─────────────── DASHBOARD ─────────────── */
  function renderDashboard() {
    wizard.style.display = 'none';
    sheet.style.display = '';

    goalDisplay.textContent = plan.goal || '—';
    raceDisplay.textContent = `${plan.race_name || 'Race'} · ${formatDate(plan.race_date)}`;

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
    const groups = {};
    const today = new Date(); today.setHours(0,0,0,0);
    sessions.forEach(s => {
      const d = new Date(s.session_date + 'T00:00:00');
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().slice(0,10);
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

  function parseFocus(focus) {
    if (!focus) return [];
    return focus.split('\n').map(x => x.trim()).filter(Boolean);
  }
  function joinFocus(list) { return list.join('\n'); }

  function renderSessionRow(s, isPast) {
    const row = document.createElement('div');
    row.className = 'tp-session-row' + (s.completed ? ' completed' : '');
    row.dataset.id = s.id;
    // Start collapsed unless the user has explicitly expanded this session in this visit
    if (!expandedSessions.has(s.id)) row.classList.add('collapsed');

    const d = new Date(s.session_date + 'T00:00:00');
    const dateLabel = d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

    const workouts = parseFocus(s.focus);
    const countBadge = workouts.length ? `<span class="tp-session-badge">${workouts.length}</span>` : '';
    const workoutsHtml = workouts.length
      ? workouts.map((w, i) => `
          <li class="tp-workout-item" data-index="${i}">
            <span class="tp-workout-name">${escapeHtml(w)}</span>
            <button class="tp-workout-remove" type="button" title="Remove">×</button>
          </li>`).join('')
      : `<li class="tp-workout-empty">Drop a workout here…</li>`;

    row.innerHTML = `
      <div class="tp-session-head">
        <button class="tp-session-toggle" type="button" aria-label="Toggle">
          <span class="tp-session-chevron">▼</span>
        </button>
        <label class="tp-session-check" title="Mark complete">
          <input type="checkbox" ${s.completed ? 'checked' : ''}>
        </label>
        <div class="tp-session-date">${dateLabel}</div>
        ${countBadge}
      </div>
      <div class="tp-session-content">
        <ul class="tp-workout-list">${workoutsHtml}</ul>
        <div class="tp-session-body">
          <textarea class="tp-session-journal" placeholder="How did it go?">${escapeHtml(s.journal || '')}</textarea>
        </div>
      </div>
    `;

    row.querySelector('.tp-session-toggle').addEventListener('click', (e) => {
      e.stopPropagation();
      if (expandedSessions.has(s.id)) {
        expandedSessions.delete(s.id);
        row.classList.add('collapsed');
      } else {
        expandedSessions.add(s.id);
        row.classList.remove('collapsed');
      }
    });

    row.querySelector('input[type="checkbox"]').addEventListener('change', async (e) => {
      const completed = e.target.checked;
      s.completed = completed;
      row.classList.toggle('completed', completed);
      await sb.from('training_sessions').update({ completed, updated_at: new Date().toISOString() }).eq('id', s.id);
    });

    row.querySelectorAll('.tp-workout-remove').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const idx = Number(btn.closest('.tp-workout-item').dataset.index);
        const list = parseFocus(s.focus);
        list.splice(idx, 1);
        s.focus = joinFocus(list);
        await sb.from('training_sessions').update({ focus: s.focus, updated_at: new Date().toISOString() }).eq('id', s.id);
        refreshSessionRow(row, s, isPast);
      });
    });

    const journalEl = row.querySelector('.tp-session-journal');
    journalEl.addEventListener('blur', async () => {
      const journal = journalEl.value;
      if (journal === (s.journal || '')) return;
      s.journal = journal;
      await sb.from('training_sessions').update({ journal, updated_at: new Date().toISOString() }).eq('id', s.id);
      flashRow(row);
    });

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

      let workoutText = payload.name;
      if (NUMBER_PROMPT_WORKOUTS.has(payload.name)) {
        const num = await openNumberPopup(payload.name);
        if (num === null) return;
        workoutText = payload.name.replace(/^X\s+/i, `${num} `);
      }

      const list = parseFocus(s.focus);
      list.push(workoutText);
      s.focus = joinFocus(list);
      await sb.from('training_sessions').update({ focus: s.focus, updated_at: new Date().toISOString() }).eq('id', s.id);
      expandedSessions.add(s.id);
      refreshSessionRow(row, s, isPast);
      flashRow(row);
    });

    return row;
  }

  function refreshSessionRow(oldRow, s, isPast) {
    const newRow = renderSessionRow(s, isPast);
    oldRow.replaceWith(newRow);
  }

  function flashRow(row) {
    row.classList.add('flash-saved');
    setTimeout(() => row.classList.remove('flash-saved'), 700);
  }

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }
  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  boot();

  if (window.BMX && window.BMX.auth) {
    window.BMX.auth.onChange((u) => {
      user = u;
      sb = window.BMX.sb;
      if (user) {
        authPopup.style.display = 'none';
        wrap.style.display = '';
        if (!initialized) {
          initialized = true;
          ensureLibrary()
            .then(loadActivePlan)
            .then(loadArchivedPlans);
        }
      } else {
        initialized = false;
        showAuthPopup();
      }
    });
  }
})();
