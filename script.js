(function () {
  const wrapper = document.getElementById('imageWrapper');
  const staticImage = document.getElementById('staticImage');
  const pinsPanel = document.getElementById('pinsPanel');

  // If this page has no map, exit quietly
  if (!wrapper || !staticImage || !pinsPanel) return;

  const page = document.body.dataset.page || 'creator';
  const mapId = wrapper.dataset.mapId || 'default';

  /* ─────────────── STORAGE ─────────────── */
  const LS_DRAFT = 'bmxtools.creatorDraft';
  const LS_USER_MAPS = 'bmxtools.userMaps';

  // In-memory cache of the user's maps so readUserMaps() stays synchronous.
  let userMapsCache = [];

  function readLocalUserMaps() {
    try { return JSON.parse(localStorage.getItem(LS_USER_MAPS)) || []; }
    catch { return []; }
  }
  function writeLocalUserMaps(list) {
    try { localStorage.setItem(LS_USER_MAPS, JSON.stringify(list)); } catch {}
  }

  // Returns the cached list — populated by loadUserMaps() at boot and after writes.
  function readUserMaps() {
    return userMapsCache;
  }

  // Still used by write-path code for now (until write migration lands).
  function writeUserMaps(list) {
    userMapsCache = list;
    writeLocalUserMaps(list);
  }

  // Load maps from Supabase when logged in, else from localStorage.
  async function loadUserMaps() {
    const user = window.BMX?.auth?.getUser();
    if (user && window.BMX?.sb) {
      const { data, error } = await window.BMX.sb
        .from('maps')
        .select('id, name, pins, created_at, updated_at')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Failed to load maps:', error);
        userMapsCache = readLocalUserMaps();
      } else {
        userMapsCache = (data || []).map(r => ({
          id: r.id,
          name: r.name,
          seed: false,
          pins: r.pins || [],
          createdAt: new Date(r.created_at).getTime(),
          updatedAt: new Date(r.updated_at).getTime()
        }));
      }
    } else {
      userMapsCache = readLocalUserMaps();
    }

    // If the maps page is open, redraw its sidebar
    if (page === 'maps' && typeof renderMapLists === 'function') {
      renderMapLists();
    }
  }

  function readDraft() {
    try { return JSON.parse(localStorage.getItem(LS_DRAFT)) || null; }
    catch { return null; }
  }
  function writeDraft(data) {
    try { localStorage.setItem(LS_DRAFT, JSON.stringify(data)); } catch {}
  }
  /* ─────────────── SUPABASE WRITE HELPERS ─────────────── */
  async function saveMapToSupabase(name, pins) {
    const user = window.BMX?.auth?.getUser();
    if (!user || !window.BMX?.sb) return { ok: false, reason: 'not-logged-in' };

    const { error } = await window.BMX.sb
      .from('maps')
      .insert({ user_id: user.id, name, pins });

    if (error) {
      console.error('saveMapToSupabase:', error);
      return { ok: false, error };
    }
    return { ok: true };
  }

  async function updateMapInSupabase(id, pins) {
    const user = window.BMX?.auth?.getUser();
    if (!user || !window.BMX?.sb) return { ok: false, reason: 'not-logged-in' };

    const { error } = await window.BMX.sb
      .from('maps')
      .update({ pins, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('updateMapInSupabase:', error);
      return { ok: false, error };
    }
    return { ok: true };
  }

  async function deleteMapFromSupabase(id) {
    const user = window.BMX?.auth?.getUser();
    if (!user || !window.BMX?.sb) return { ok: false, reason: 'not-logged-in' };

    const { error } = await window.BMX.sb
      .from('maps')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('deleteMapFromSupabase:', error);
      return { ok: false, error };
    }
    return { ok: true };
  }
  /* ─────────────── ONE-TIME MIGRATION ───────────────
     If the user is logged in, has nothing in Supabase yet,
     but has maps in localStorage, upload them once. */
  async function migrateLocalMapsIfNeeded() {
    const user = window.BMX?.auth?.getUser();
    if (!user || !window.BMX?.sb) return;

    const local = readLocalUserMaps();
    if (!local.length) return;

    // Only migrate if Supabase has zero maps for this user
    const { count, error } = await window.BMX.sb
      .from('maps')
      .select('*', { count: 'exact', head: true });

    if (error || count > 0) return;

    const rows = local.map(m => ({
      user_id: user.id,
      name: m.name || 'Untitled Map',
      pins: m.pins || []
    }));

    const { error: insertErr } = await window.BMX.sb.from('maps').insert(rows);
    if (insertErr) {
      console.error('Map migration failed:', insertErr);
      return;
    }

    // Keep localStorage as a backup (don't delete), but let users know
    console.log(`Migrated ${rows.length} map(s) to your account.`);
  }

  /* ─────────────── STATE ─────────────── */
  let pins = [];
  let nextId = 0;
  let activePopupPinId = null;
  let activeSection = 'race';

  // On the maps page: currently loaded map (null = nothing selected yet)
  let currentMap = null;       // { id, name, seed:true|false, pins:[...] }
  let seedMaps = (typeof BMX_SEED_MAPS !== 'undefined') ? BMX_SEED_MAPS : [];

  const sectionVisibility = {
    race: true, track: true, dirt: true, pump: true, bikepark: true
  };

  /* ─────────────── DROPDOWN OPTION SETS ─────────────── */
  const AGE_OPTIONS_STANDARD = [
    '5 & Under', '6', '7', '8', '9', '10', '11', '12', '13',
    '14', '15', '16', '17-18', '19-27', '28-35',
    '36-40', '41-45', '46 & Over'
  ];
  const AGE_OPTIONS_BOYS_CRUISER = [
    '7 & Under', '8', '9', '10', '11', '12', '13',
    '14', '15', '16', '17-20', '21-25', '26-30',
    '31-35', '36-40', '41-45', '46-50', '51-55',
    '56-60', '61 & Over'
  ];
  const AGE_OPTIONS_GIRLS_CRUISER = [
    '10 & Under', '11-13', '14-16', '17-20', '21-25', '26-30',
    '31-35', '36-40', '41-45', '46-50', '51-55', '56 & Over'
  ];

  /* ─────────────── HELPERS ─────────────── */
  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function buildOptions(list, selected, placeholder) {
    let html = `<option value="">${placeholder || 'Select…'}</option>`;
    list.forEach(v => {
      const safe = escapeHtml(v);
      html += `<option value="${safe}"${v === selected ? ' selected' : ''}>${safe}</option>`;
    });
    return html;
  }

  function formatDate(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return iso;
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function uid(prefix) {
    return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  }

  /* ─────────────── SIDEBAR INJECTION ─────────────── */
  const SECTION_KINDS = [
    { key: 'race',     label: 'Your Races',  dot: 'red' },
    { key: 'track',    label: 'Tracks',      dot: 'blue' },
    { key: 'dirt',     label: 'Dirt Jumps',  dot: 'green' },
    { key: 'pump',     label: 'Pump Tracks', dot: 'yellow' },
    { key: 'bikepark', label: 'Bike Parks',  dot: 'white' }
  ];

  function pinSectionsHtml(collapsedDefault) {
    return SECTION_KINDS.map(k => `
      <div class="section${collapsedDefault ? '' : (k.key === 'race' ? ' open' : '')}" id="section-${k.key}">
        <div class="section-header" data-section="${k.key}">
          <div class="section-title">
            <span class="section-dot ${k.dot}"></span>
            ${k.label}
          </div>
          <span class="section-count" id="count-${k.key}">0</span>
          <input type="checkbox" class="section-visibility" id="vis-${k.key}" checked title="show / hide this list on map" />
          <span class="section-chevron">▼</span>
        </div>
        <div class="section-body">
          <ul class="pins-list" id="list-${k.key}"></ul>
        </div>
      </div>
    `).join('');
  }

  function buildCreatorSidebar() {
    pinsPanel.innerHTML = pinSectionsHtml(false) + `
      <button class="save-map-btn" id="saveMapBtn">Save Your Map!</button>
    `;
  }

   function buildMapsSidebar() {
    pinsPanel.innerHTML = `
      <div class="map-library">
        <div class="map-library-group" id="group-seed">
          <div class="map-library-header" data-group="seed">
            <span>🗺️ Curated Maps</span>
            <span class="map-library-chevron">▼</span>
          </div>
          <div class="map-library-body">
            <ul class="map-list" id="seedMapList"></ul>
          </div>
        </div>
        <div class="map-library-group" id="group-user">
          <div class="map-library-header" data-group="user">
            <span>⭐ Your Maps</span>
            <span class="map-library-chevron">▼</span>
          </div>
          <div class="map-library-body">
            <ul class="map-list" id="userMapList"></ul>
          </div>
        </div>
      </div>
      <div class="map-library-divider" id="mapSectionsDivider" style="display:none;"></div>
      <div class="map-pin-sections" id="mapPinSections" style="display:none;">
        ${pinSectionsHtml(true)}
      </div>
      <button class="save-map-btn" id="saveMapBtn" style="display:none;">Save Changes</button>    `;

    // Wire collapse toggles (start collapsed — no .open class)
    pinsPanel.querySelectorAll('.map-library-header').forEach(header => {
      header.addEventListener('click', () => {
        const group = header.closest('.map-library-group');
        if (group) group.classList.toggle('open');
      });
    });
  }
    /* ─────────────── SIDEBAR BUILD DISPATCH ─────────────── */
  if (page === 'maps') buildMapsSidebar();
  else buildCreatorSidebar();

  /* ─────────────── SECTION REFS ─────────────── */
  const sections = {};
  SECTION_KINDS.forEach(k => {
    sections[k.key] = {
      el:    document.getElementById('section-' + k.key),
      list:  document.getElementById('list-' + k.key),
      count: document.getElementById('count-' + k.key),
      vis:   document.getElementById('vis-' + k.key)
    };
  });

  const saveBtn = document.getElementById('saveMapBtn');

  /* ─────────────── PIN SVG ─────────────── */
  function pinSvg(kind) {
    const config = {
      race:     { grad: 'pinGradientRed',    stops: '<stop stop-color="#FF7B9C"/><stop offset="1" stop-color="#FF3B6F"/>' },
      track:    { grad: 'pinGradientBlue',   stops: '<stop stop-color="#7CC3FF"/><stop offset="1" stop-color="#1E7BE0"/>' },
      dirt:     { grad: 'pinGradientGreen',  stops: '<stop stop-color="#86EFAC"/><stop offset="1" stop-color="#22C55E"/>' },
      pump:     { grad: 'pinGradientYellow', stops: '<stop stop-color="#FDE68A"/><stop offset="1" stop-color="#EAB308"/>' },
      bikepark: { grad: 'pinGradientWhite',  stops: '<stop stop-color="#FFFFFF"/><stop offset="1" stop-color="#C7DBFF"/>' }
    };
    const c = config[kind] || config.race;
    return `
      <svg viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${c.grad}" x1="0" y1="0" x2="0" y2="1">
            ${c.stops}
          </linearGradient>
        </defs>
        <path d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 20 12 20s12-11.6 12-20C24 5.4 18.6 0 12 0z"
              fill="url(#${c.grad})" stroke="#0a2547" stroke-width="1"/>
        <circle cx="12" cy="12" r="4.5" fill="#0a2547" opacity="0.6"/>
      </svg>
    `;
  }

  /* ─────────────── RENDER: PIN LIST ─────────────── */
  function renderAll() {
    Object.keys(sections).forEach(kind => renderSection(kind));
  }

  function renderSection(kind) {
    const sec = sections[kind];
    if (!sec || !sec.list) return;

    const list = pins.filter(p => p.kind === kind);
    if (sec.count) sec.count.textContent = list.length;

    if (list.length === 0) {
      sec.list.innerHTML = `<li class="pins-empty-message">No ${kind} pins yet.<br>Click the map to add one.</li>`;
      return;
    }

    sec.list.innerHTML = list.map(p => `
      <li class="pin-item${p.id === activePopupPinId ? ' active' : ''}" data-id="${p.id}">
        <div class="pin-item-info">
          <div class="pin-item-title">${escapeHtml(p.title || 'Untitled')}</div>
          ${p.racer ? `<div class="pin-item-racer">${escapeHtml(p.racer)}</div>` : ''}
          ${p.date ? `<div class="pin-item-meta"><span>📅 ${formatDate(p.date)}</span>${p.age ? `<span>${escapeHtml(p.age)}</span>` : ''}</div>` : ''}
          ${p.description ? `<div class="pin-item-desc">${escapeHtml(p.description)}</div>` : ''}
          ${p.results ? `<div class="pin-item-results">${escapeHtml(p.results)}</div>` : ''}
        </div>
        ${isReadOnly() ? '' : `<button class="pin-remove-btn" data-remove="${p.id}" title="Remove">×</button>`}
      </li>
    `).join('');
  }

  /* ─────────────── RENDER: MAP PINS ─────────────── */
  function renderPins() {
    wrapper.querySelectorAll('.pin').forEach(el => el.remove());
    pins.forEach(p => {
      if (!sectionVisibility[p.kind]) return;
      const el = document.createElement('div');
      el.className = `pin kind-${p.kind}${p.id === activePopupPinId ? ' active' : ''}`;
      el.style.left = p.x + '%';
      el.style.top = p.y + '%';
      el.dataset.id = p.id;
      el.innerHTML = pinSvg(p.kind);
      wrapper.appendChild(el);
    });
  }

  /* ─────────────── READ-ONLY CHECK ─────────────── */
  function isReadOnly() {
    return page === 'maps' && currentMap && currentMap.seed === true;
  }

  /* ─────────────── POPUP ─────────────── */
  function closePopup() {
    const existing = wrapper.querySelector('.pin-popup');
    if (existing) existing.remove();
    activePopupPinId = null;
    renderPins();
    renderAll();
  }

  function openPopup(pin) {
    closePopup();
    activePopupPinId = pin.id;

    const popup = document.createElement('div');
    popup.className = 'pin-popup';
    popup.style.left = pin.x + '%';
    popup.style.top = pin.y + '%';

    const ro = isReadOnly();
    const isRace = pin.kind === 'race';
    const ageList = pin.ageList === 'boysCruiser' ? AGE_OPTIONS_BOYS_CRUISER
                  : pin.ageList === 'girlsCruiser' ? AGE_OPTIONS_GIRLS_CRUISER
                  : AGE_OPTIONS_STANDARD;

    popup.innerHTML = `
      <div class="pin-popup-header">
        <h4>${pin.kind.toUpperCase()}${ro ? ' · READ ONLY' : ''}</h4>
        <button class="pin-popup-close" type="button">×</button>
      </div>
      <div>
        <label>Title</label>
        <input type="text" class="f-title" value="${escapeHtml(pin.title || '')}" placeholder="Name" ${ro ? 'readonly' : ''}>
      </div>
      ${isRace ? `
      <div>
        <label>Racer</label>
        <input type="text" class="f-racer" value="${escapeHtml(pin.racer || '')}" placeholder="Rider name" ${ro ? 'readonly' : ''}>
      </div>
      <div class="pin-popup-row">
        <div>
          <label>Date</label>
          <input type="date" class="f-date" value="${escapeHtml(pin.date || '')}" ${ro ? 'readonly' : ''}>
        </div>
        <div>
          <label>Age Group</label>
          <select class="f-age" ${ro ? 'disabled' : ''}>
            ${buildOptions(ageList, pin.age || '', 'Select age…')}
          </select>
        </div>
      </div>
      <div>
        <label>Event / Notes</label>
        <textarea class="f-desc event-field" placeholder="Details…" ${ro ? 'readonly' : ''}>${escapeHtml(pin.description || '')}</textarea>
      </div>
      <div>
        <label>Results</label>
        <textarea class="f-results results-field" placeholder="Placing, time…" ${ro ? 'readonly' : ''}>${escapeHtml(pin.results || '')}</textarea>
      </div>
      ` : `
      <div>
        <label>Description</label>
        <textarea class="f-desc" placeholder="Notes…" ${ro ? 'readonly' : ''}>${escapeHtml(pin.description || '')}</textarea>
      </div>
      `}
      <div class="pin-popup-actions">
        ${ro ? '<button class="pin-popup-close-2" type="button">Close</button>' : `
          <button class="pin-popup-delete" type="button">Delete</button>
          <button class="pin-popup-save" type="button">Save</button>
        `}
      </div>
    `;

    wrapper.appendChild(popup);

    popup.querySelector('.pin-popup-close').onclick = closePopup;
    const close2 = popup.querySelector('.pin-popup-close-2');
    if (close2) close2.onclick = closePopup;

    const delBtn = popup.querySelector('.pin-popup-delete');
    if (delBtn) delBtn.onclick = () => {
      pins = pins.filter(p => p.id !== pin.id);
      persist();
      closePopup();
    };

    const savePinBtn = popup.querySelector('.pin-popup-save');
    if (savePinBtn) savePinBtn.onclick = () => {
      pin.title = popup.querySelector('.f-title').value.trim();
      const dEl = popup.querySelector('.f-desc');
      if (dEl) pin.description = dEl.value.trim();
      const rEl = popup.querySelector('.f-racer');
      if (rEl) pin.racer = rEl.value.trim();
      const dtEl = popup.querySelector('.f-date');
      if (dtEl) pin.date = dtEl.value;
      const aEl = popup.querySelector('.f-age');
      if (aEl) pin.age = aEl.value;
      const resEl = popup.querySelector('.f-results');
      if (resEl) pin.results = resEl.value.trim();
      persist();
      closePopup();
    };

    renderPins();
    renderAll();
  }

  /* ─────────────── PERSIST ─────────────── */
  // Where do edits go? Creator → draft. Maps page → user map (if editable).
  function persist() {
    if (page === 'creator') {
      writeDraft({ pins, name: getCreatorName(), savedAt: Date.now() });
    } else if (page === 'maps' && currentMap && !currentMap.seed) {
      const list = readUserMaps();
      const idx = list.findIndex(m => m.id === currentMap.id);
      if (idx >= 0) {
        list[idx].pins = pins.map(p => ({ ...p }));
        list[idx].updatedAt = Date.now();
        writeUserMaps(list);
      }
      currentMap.pins = pins.map(p => ({ ...p }));
      renderMapLists();
    }
  }

  function getCreatorName() {
    const el = document.getElementById('creatorMapName');
    return el ? el.value.trim() : '';
  }

  /* ─────────────── MAP CLICK = ADD PIN ─────────────── */
  wrapper.addEventListener('click', (e) => {
    if (e.target.closest('.pin') || e.target.closest('.pin-popup')) return;
    if (isReadOnly()) return;
    if (page === 'maps' && !currentMap) return; // must select a map first

    const rect = wrapper.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newPin = {
      id: ++nextId,
      kind: activeSection,
      x, y,
      title: '', racer: '', date: '', age: '',
      description: '', results: ''
    };
    pins.push(newPin);
    persist();
    renderPins();
    renderAll();

    const el = wrapper.querySelector(`.pin[data-id="${newPin.id}"]`);
    if (el) openPopup(newPin);
  });

  /* ─────────────── PIN CLICK = EDIT / CTRL+CLICK = DELETE ─────────────── */
  wrapper.addEventListener('click', (e) => {
    const pinEl = e.target.closest('.pin');
    if (!pinEl) return;
    e.stopPropagation();

    const id = Number(pinEl.dataset.id);
    const pin = pins.find(p => p.id === id);
    if (!pin) return;

    if ((e.ctrlKey || e.metaKey) && !isReadOnly()) {
      pins = pins.filter(p => p.id !== id);
      persist();
      closePopup();
      return;
    }

    openPopup(pin);
  });

  /* ─────────────── SECTION HEADER COLLAPSE / VISIBILITY ─────────────── */
  Object.keys(sections).forEach(kind => {
    const sec = sections[kind];
    if (!sec.el) return;
    const header = sec.el.querySelector('.section-header');
    if (header) {
      header.addEventListener('click', (e) => {
        if (e.target.classList.contains('section-visibility')) return;
        sec.el.classList.toggle('open');
      });
    }
    if (sec.vis) {
      sec.vis.addEventListener('change', () => {
        sectionVisibility[kind] = sec.vis.checked;
        renderPins();
      });
    }
  });

  /* ─────────────── PIN LIST CLICK ─────────────── */
  Object.keys(sections).forEach(kind => {
    const sec = sections[kind];
    if (!sec.list) return;
    sec.list.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-remove]');
      if (removeBtn) {
        if (isReadOnly()) return;
        const id = Number(removeBtn.dataset.remove);
        pins = pins.filter(p => p.id !== id);
        persist();
        closePopup();
        return;
      }
      const item = e.target.closest('.pin-item');
      if (!item) return;
      const id = Number(item.dataset.id);
      const pin = pins.find(p => p.id === id);
      if (pin) openPopup(pin);
    });
  });

  /* ─────────────── ACTIVE SECTION (which pin kind gets placed) ─────────────── */
  Object.keys(sections).forEach(kind => {
    const sec = sections[kind];
    if (!sec.el) return;
    sec.el.addEventListener('mousedown', () => { activeSection = kind; });
  });

  /* ─────────────── SAVE BUTTON ─────────────── */
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      if (page === 'creator') {
        const suggested = getCreatorName() || 'My Map';
        const name = window.prompt('Name this map:', suggested);
        if (name === null) return;
        const trimmed = name.trim() || 'Untitled Map';
        const cleanPins = pins.map(p => ({ ...p }));

        const user = window.BMX?.auth?.getUser();
        if (user && window.BMX?.sb) {
          // Save to Supabase
          const existing = userMapsCache.find(m => m.name === trimmed);
          let result;
          if (existing) {
            if (!window.confirm(`A map named "${trimmed}" already exists. Overwrite it?`)) return;
            result = await updateMapInSupabase(existing.id, cleanPins);
          } else {
            result = await saveMapToSupabase(trimmed, cleanPins);
          }

          if (!result.ok) {
            window.alert('Save failed. Check the console for details.');
            return;
          }

          await loadUserMaps();
          const nameEl = document.getElementById('creatorMapName');
          if (nameEl) nameEl.value = trimmed;
          window.alert(`Saved "${trimmed}" to your maps.`);
        } else {
          // Fallback: save to localStorage (logged out)
          const userMaps = readLocalUserMaps();
          const existing = userMaps.find(m => m.name === trimmed);
          if (existing) {
            if (!window.confirm(`A map named "${trimmed}" already exists. Overwrite it?`)) return;
            existing.pins = cleanPins;
            existing.updatedAt = Date.now();
          } else {
            userMaps.push({
              id: uid('map'),
              name: trimmed,
              seed: false,
              pins: cleanPins,
              createdAt: Date.now(),
              updatedAt: Date.now()
            });
          }
          writeUserMaps(userMaps);
          const nameEl = document.getElementById('creatorMapName');
          if (nameEl) nameEl.value = trimmed;
          window.alert(`Saved "${trimmed}" locally. Log in to sync it to your account.`);
        }
      }
       } else if (page === 'maps' && currentMap && !currentMap.seed) {
        const cleanPins = pins.map(p => ({ ...p }));
        const user = window.BMX?.auth?.getUser();

        if (user && window.BMX?.sb) {
          const result = await updateMapInSupabase(currentMap.id, cleanPins);
          if (!result.ok) {
            window.alert('Save failed. Check the console for details.');
            return;
          }
          await loadUserMaps();
          currentMap.pins = cleanPins;
          flashSaveButton('Saved!');
        } else {
          // Fallback: localStorage
          const list = readLocalUserMaps();
          const idx = list.findIndex(m => m.id === currentMap.id);
          if (idx >= 0) {
            list[idx].pins = cleanPins;
            list[idx].updatedAt = Date.now();
            writeUserMaps(list);
          }
          currentMap.pins = cleanPins;
          renderMapLists();
          flashSaveButton('Saved!');
        }
      }
    });
  }

  function flashSaveButton(text) {
    if (!saveBtn) return;
    const original = saveBtn.textContent;
    saveBtn.textContent = text;
    saveBtn.disabled = true;
    setTimeout(() => {
      saveBtn.textContent = original;
      saveBtn.disabled = false;
    }, 900);
  }

  function downloadJson(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bmx-map-${(data.name || mapId).replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }


  /* ─────────────── MAPS PAGE: MAP LIST ─────────────── */
    function renderMapLists() {
    if (page !== 'maps') return;

    const seedList = document.getElementById('seedMapList');
    const userList = document.getElementById('userMapList');
    if (!seedList || !userList) return;

    seedList.innerHTML = seedMaps.length
      ? seedMaps.map(m => mapListItemHtml(m, true)).join('')
      : `<li class="map-list-empty">No curated maps yet.</li>`;

    const userMaps = readUserMaps();
    userList.innerHTML = userMaps.length
      ? userMaps.map(m => mapListItemHtml(m, false)).join('')
      : `<li class="map-list-empty">No saved maps yet.<br>Create one on the Map Creator.</li>`;

    // Auto-open whichever group holds the active map
    if (currentMap) {
      const seedGroup = document.getElementById('group-seed');
      const userGroup = document.getElementById('group-user');
      const inSeed = seedMaps.some(m => m.id === currentMap.id);
      const inUser = userMaps.some(m => m.id === currentMap.id);
      if (inSeed && seedGroup) seedGroup.classList.add('open');
      if (inUser && userGroup) userGroup.classList.add('open');
    }
  }

  function mapListItemHtml(m, isSeed) {
    const pinCount = (m.pins || []).length;
    const active = currentMap && currentMap.id === m.id ? ' active' : '';
    return `
      <li class="map-list-item${isSeed ? ' seed' : ''}${active}" data-map-id="${m.id}">
        <div class="map-list-item-info">
          <div class="map-list-item-name">
            ${isSeed ? '<span class="map-lock" title="Curated — read only">🔒</span>' : ''}
            ${escapeHtml(m.name)}
          </div>
          <div class="map-list-item-meta">${pinCount} pin${pinCount === 1 ? '' : 's'}</div>
        </div>
        ${isSeed ? '' : `<button class="map-list-delete" data-delete-map="${m.id}" title="Delete map">×</button>`}
      </li>
    `;
  }

  function loadMap(mapIdToLoad) {
    const seed = seedMaps.find(m => m.id === mapIdToLoad);
    const user = readUserMaps().find(m => m.id === mapIdToLoad);
    const src = seed || user;
    if (!src) return;

    currentMap = { id: src.id, name: src.name, seed: !!seed, pins: [] };

    nextId = 0;
    pins = (src.pins || []).map(p => ({ ...p, id: ++nextId }));
    closePopup();
    renderPins();
    renderAll();
    renderMapLists();
    updateSaveButtonVisibility();
  }

  function updateSaveButtonVisibility() {
    if (page !== 'maps') return;

    const showEditor = !!(currentMap && !currentMap.seed);

    if (saveBtn) saveBtn.style.display = showEditor ? '' : 'none';

    const sectionsWrap = document.getElementById('mapPinSections');
    const divider = document.getElementById('mapSectionsDivider');
    if (sectionsWrap) sectionsWrap.style.display = showEditor ? '' : 'none';
    if (divider) divider.style.display = showEditor ? '' : 'none';
  }
  // Wire map list clicks (delegated — list is re-rendered often)
  pinsPanel.addEventListener('click', (e) => {
    if (page !== 'maps') return;

    const delBtn = e.target.closest('[data-delete-map]');
    if (delBtn) {
      e.stopPropagation();
      const id = delBtn.dataset.deleteMap;
      const map = userMapsCache.find(m => m.id === id);
      if (!map) return;
      if (!window.confirm(`Delete "${map.name}"? This can't be undone.`)) return;

      const user = window.BMX?.auth?.getUser();
      if (user && window.BMX?.sb) {
        const result = await deleteMapFromSupabase(id);
        if (!result.ok) {
          window.alert('Delete failed. Check the console for details.');
          return;
        }
        await loadUserMaps();
      } else {
        const list = readLocalUserMaps().filter(m => m.id !== id);
        writeUserMaps(list);
      }

      if (currentMap && currentMap.id === id) {
        currentMap = null;
        pins = [];
        closePopup();
        renderPins();
        renderAll();
        updateSaveButtonVisibility();
      }
      renderMapLists();
      return;
    }

    const item = e.target.closest('.map-list-item');
    if (!item) return;

    const clickedId = item.dataset.mapId;

    // If clicking the already-active map, deselect it
    if (currentMap && currentMap.id === clickedId) {
      currentMap = null;
      pins = [];
      closePopup();
      renderPins();
      renderAll();
      renderMapLists();
      updateSaveButtonVisibility();
      return;
    }

    loadMap(clickedId);
  });
  /* ─────────────── OUTSIDE CLICK CLOSES POPUP ─────────────── */
  document.addEventListener('click', (e) => {
    if (e.target.closest('.pin-popup') || e.target.closest('.pin') || e.target.closest('.pin-item')) return;
    if (e.target.closest('#imageWrapper')) return;
    if (e.target.closest('.map-list-item')) return;
    closePopup();
  });

   /* ─────────────── INIT ─────────────── */
    async function boot() {
    // Wait for auth.js to finish its initial check before deciding where to load from.
    if (window.BMX?.authReady) {
      await window.BMX.authReady;
    }

    // Load maps from the right source first
    await migrateLocalMapsIfNeeded();
    await loadUserMaps();

    if (page === 'creator') {
      const draft = readDraft();
      if (draft && Array.isArray(draft.pins)) {
        nextId = 0;
        pins = draft.pins.map(p => ({ ...p, id: ++nextId }));
      }
      const nameEl = document.getElementById('creatorMapName');
      if (nameEl && draft && draft.name) nameEl.value = draft.name;
    } else {
      renderMapLists();
      updateSaveButtonVisibility();
    }

    renderPins();
    renderAll();
  }
  boot();

  // When auth changes (login/logout), reload the map list
  if (window.BMX?.auth) {
    window.BMX.auth.onChange(() => {
      migrateLocalMapsIfNeeded().then(() => loadUserMaps());
    });
  }

})();
