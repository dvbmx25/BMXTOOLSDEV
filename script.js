(function () {
  const wrapper = document.getElementById('imageWrapper');
  const staticImage = document.getElementById('staticImage');
  const pinsPanel = document.getElementById('pinsPanel');
  const mapStage = document.getElementById('mapStage');

  if (!wrapper || !pinsPanel || !mapStage) return;

  const page = document.body.dataset.page || 'creator';
  const mapId = wrapper.dataset.mapId || 'default';

  const LS_DRAFT = 'bmxtools.creatorDraft';
  const LS_USER_MAPS = 'bmxtools.userMaps';

  /* ─────────────── LEAFLET MAP ─────────────── */
  const DEFAULT_CENTER = [39.5, -98.35];
  const DEFAULT_ZOOM = 4;

  let map = null;
  let markerLayer = null;
  const pinMarkers = new Map(); // pin.id -> L.Marker

  function initMap() {
    if (map) return;
    map = L.map('leafletMap', {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      worldCopyJump: true,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    markerLayer = L.layerGroup().addTo(map);

    map.on('click', (e) => {
      if (isReadOnly()) return;
      if (page === 'maps' && !currentMap) return;
      const orig = e.originalEvent;
      if (orig && orig.target && orig.target.closest && orig.target.closest('.leaflet-marker-icon')) return;

      const newPin = {
        id: ++nextId,
        kind: activeSection,
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        title: '', racer: '', date: '', age: '', ageList: 'standard',
        description: '', results: ''
      };
      pins.push(newPin);
      persist();
      renderPins();
      renderAll();
      openPopup(newPin);
    });
  }

  /* ─────────────── USER MAPS ─────────────── */
  let userMapsCache = [];

  function readLocalUserMaps() {
    try { return JSON.parse(localStorage.getItem(LS_USER_MAPS)) || []; }
    catch { return []; }
  }
  function writeLocalUserMaps(list) {
    try { localStorage.setItem(LS_USER_MAPS, JSON.stringify(list)); } catch {}
  }
  function readUserMaps() { return userMapsCache; }
  function writeUserMaps(list) {
    userMapsCache = list;
    writeLocalUserMaps(list);
  }

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
          id: r.id, name: r.name, seed: false, pins: r.pins || [],
          createdAt: new Date(r.created_at).getTime(),
          updatedAt: new Date(r.updated_at).getTime()
        }));
      }
    } else {
      userMapsCache = readLocalUserMaps();
    }

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

  /* ─────────────── STATE ─────────────── */
  let pins = [];
  let nextId = 0;
  let activePopupPinId = null;
  let activeSection = 'race';

  let currentMap = null;
  let seedMaps = (typeof BMX_SEED_MAPS !== 'undefined') ? BMX_SEED_MAPS : [];

  const sectionVisibility = {
    race: true, track: true, dirt: true, pump: true, bikepark: true
  };

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
    return new Date(y, m - 1, d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }
  function uid(prefix) {
    return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  }

  const AGE_OPTIONS_STANDARD = ['5 & Under','6','7','8','9','10','11','12','13','14','15','16','17-18','19-27','28-35','36-40','41-45','46-50','51 & Over'];
  const AGE_OPTIONS_BOYS_CRUISER = ['7 & Under','8','9','10','11','12','13','14','15','16','17-20','21-25','26-30','31-35','36-40','41-45','46-50','51-55','56-60','61 & Over'];
  const AGE_OPTIONS_GIRLS_CRUISER = ['10 & Under','11-13','14-16','17-20','21-25','26-30','31-35','36-40','41-45','46-50','51-55','56 & Over'];

  /* ─────────────── SIDEBAR ─────────────── */
  const SECTION_KINDS = [
    { key: 'race', label: 'Your Races', dot: 'red' },
    { key: 'track', label: 'Tracks', dot: 'blue' },
    { key: 'dirt', label: 'Dirt Jumps', dot: 'green' },
    { key: 'pump', label: 'Pump Tracks', dot: 'yellow' },
    { key: 'bikepark', label: 'Bike Parks', dot: 'white' }
  ];

  function pinSectionsHtml(collapsedDefault) {
    return SECTION_KINDS.map(k => `
      <div class="section${collapsedDefault ? '' : (k.key === 'race' ? ' open' : '')}" id="section-${k.key}">
        <div class="section-header" data-section="${k.key}">
          <div class="section-title"><span class="section-dot ${k.dot}"></span>${k.label}</div>
          <span class="section-count" id="count-${k.key}">0</span>
          <input type="checkbox" class="section-visibility" id="vis-${k.key}" checked />
          <span class="section-chevron">▼</span>
        </div>
        <div class="section-body"><ul class="pins-list" id="list-${k.key}"></ul></div>
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
      <button class="save-map-btn" id="saveMapBtn" style="display:none;">Save Changes</button>`;

    pinsPanel.querySelectorAll('.map-library-header').forEach(header => {
      header.addEventListener('click', () => {
        const group = header.closest('.map-library-group');
        if (group) group.classList.toggle('open');
      });
    });
  }

  if (page === 'maps') buildMapsSidebar();
  else buildCreatorSidebar();

  const sections = {};
  SECTION_KINDS.forEach(k => {
    sections[k.key] = {
      el: document.getElementById('section-' + k.key),
      list: document.getElementById('list-' + k.key),
      count: document.getElementById('count-' + k.key),
      vis: document.getElementById('vis-' + k.key)
    };
  });
  const saveBtn = document.getElementById('saveMapBtn');

  /* ─────────────── PIN ICON ─────────────── */
  const PIN_COLORS = {
    race:     { fill: '#FF3B6F', stroke: '#0a2547' },
    track:    { fill: '#1E7BE0', stroke: '#0a2547' },
    dirt:     { fill: '#22C55E', stroke: '#0a2547' },
    pump:     { fill: '#EAB308', stroke: '#0a2547' },
    bikepark: { fill: '#FFFFFF', stroke: '#0a2547' }
  };

  function makePinIcon(kind, isActive) {
    const c = PIN_COLORS[kind] || PIN_COLORS.race;
    const activeRing = isActive
      ? `<circle cx="14" cy="14" r="13" fill="none" stroke="${c.fill}" stroke-width="2.5" opacity="0.9"/>`
      : '';
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 40" width="28" height="40">
        ${activeRing}
        <path d="M14 0C6.3 0 0 6.3 0 14c0 9.8 14 26 14 26s14-16.2 14-26C28 6.3 21.7 0 14 0z"
              fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.5"/>
        <circle cx="14" cy="14" r="5.5" fill="${c.stroke}" opacity="0.55"/>
      </svg>`;
    return L.divIcon({
      html: svg,
      className: 'bmx-pin-icon',
      iconSize: [28, 40],
      iconAnchor: [14, 40],
      popupAnchor: [0, -40]
    });
  }

  /* ─────────────── RENDER LIST ─────────────── */
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
          ${p.city || p.state ? `<div class="pin-item-meta"><span>${escapeHtml([p.city, p.state].filter(Boolean).join(', '))}</span></div>` : ''}
          ${p.racer ? `<div class="pin-item-racer">${escapeHtml(p.racer)}</div>` : ''}
          ${p.date ? `<div class="pin-item-meta"><span>📅 ${formatDate(p.date)}</span>${p.age ? `<span>${escapeHtml(p.age)}</span>` : ''}</div>` : ''}
          ${p.description ? `<div class="pin-item-desc">${escapeHtml(p.description)}</div>` : ''}
          ${p.results ? `<div class="pin-item-results">${escapeHtml(p.results)}</div>` : ''}
        </div>
        ${isReadOnly() ? '' : `<button class="pin-remove-btn" data-remove="${p.id}">×</button>`}
      </li>`).join('');
  }

  /* ─────────────── RENDER PINS ─────────────── */
  function renderPins() {
    if (!map || !markerLayer) return;

    markerLayer.clearLayers();
    pinMarkers.clear();

    pins.forEach(p => {
      if (!sectionVisibility[p.kind]) return;
      if (!Number.isFinite(Number(p.lat)) || !Number.isFinite(Number(p.lng))) return;

      const isActive = p.id === activePopupPinId;
      const marker = L.marker([Number(p.lat), Number(p.lng)], {
        icon: makePinIcon(p.kind, isActive),
        draggable: !isReadOnly()
      });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        openPopup(p);
      });

      marker.on('dragend', () => {
        const ll = marker.getLatLng();
        p.lat = ll.lat;
        p.lng = ll.lng;
        persist();
      });

      marker.addTo(markerLayer);
      pinMarkers.set(p.id, marker);
    });
  }

  function isReadOnly() {
    return page === 'maps' && currentMap && currentMap.seed === true;
  }

  /* ─────────────── POPUP ─────────────── */
  let currentOpenPopup = null;

  function closePopup() {
    if (currentOpenPopup) {
      try { map.closePopup(currentOpenPopup); } catch {}
      currentOpenPopup = null;
    }
    activePopupPinId = null;
    renderPins();
    renderAll();
  }

  function openPopup(pin) {
    if (!map) return;

    // Close previous
    if (currentOpenPopup) {
      try { map.closePopup(currentOpenPopup); } catch {}
      currentOpenPopup = null;
    }

    activePopupPinId = pin.id;
    renderPins();
    renderAll();

    const marker = pinMarkers.get(pin.id);
    if (!marker) return;

    const ro = isReadOnly();
    const isRace = pin.kind === 'race';
    const ageList = pin.ageList === 'boysCruiser' ? AGE_OPTIONS_BOYS_CRUISER
                  : pin.ageList === 'girlsCruiser' ? AGE_OPTIONS_GIRLS_CRUISER
                  : AGE_OPTIONS_STANDARD;
    const hasLocation = pin.city || pin.state || pin.address;
    const locationLine = [pin.address, pin.city, pin.state].filter(Boolean).join(', ');

    const html = `
      <div class="pin-popup pin-popup-inline">
        <div class="pin-popup-header">
          <h4>${pin.kind.toUpperCase()}${ro ? ' · READ ONLY' : ''}</h4>
          <button class="pin-popup-close" type="button">×</button>
        </div>
        <div><label>Title</label><input type="text" class="f-title" value="${escapeHtml(pin.title || '')}" ${ro ? 'readonly' : ''}></div>
        ${hasLocation ? `<div><label>Location</label><div class="pin-popup-static">${escapeHtml(locationLine)}</div></div>` : ''}
        ${pin.phone ? `<div><label>Phone</label><a class="pin-popup-link" href="tel:${escapeHtml(String(pin.phone).replace(/[^\d+]/g,''))}">${escapeHtml(pin.phone)}</a></div>` : ''}
        ${pin.website ? `<div><label>Website</label><a class="pin-popup-link" href="${escapeHtml(pin.website)}" target="_blank" rel="noopener">${escapeHtml(pin.website)}</a></div>` : ''}
        ${pin.contact ? `<div><label>Contact</label><div class="pin-popup-static">${escapeHtml(pin.contact)}</div></div>` : ''}
        ${isRace ? `
        <div><label>Racer</label><input type="text" class="f-racer" value="${escapeHtml(pin.racer || '')}" ${ro ? 'readonly' : ''}></div>
        <div class="pin-popup-row">
          <div><label>Date</label><input type="date" class="f-date" value="${escapeHtml(pin.date || '')}" ${ro ? 'readonly' : ''}></div>
          <div><label>Class</label>
            <select class="f-class" ${ro ? 'disabled' : ''}>
              <option value="standard"${(!pin.ageList || pin.ageList === 'standard') ? ' selected' : ''}>Standard</option>
              <option value="boysCruiser"${pin.ageList === 'boysCruiser' ? ' selected' : ''}>Boys Cruiser</option>
              <option value="girlsCruiser"${pin.ageList === 'girlsCruiser' ? ' selected' : ''}>Girls Cruiser</option>
            </select>
          </div>
        </div>
        <div class="pin-popup-row">
          <div style="flex:1;"><label>Age Group</label><select class="f-age" ${ro ? 'disabled' : ''}>${buildOptions(ageList, pin.age || '', 'Select age…')}</select></div>
        </div>
        <div><label>Event / Notes</label><textarea class="f-desc event-field" ${ro ? 'readonly' : ''}>${escapeHtml(pin.description || '')}</textarea></div>
        <div><label>Results</label><textarea class="f-results results-field" ${ro ? 'readonly' : ''}>${escapeHtml(pin.results || '')}</textarea></div>
        ` : `<div><label>Description</label><textarea class="f-desc" ${ro ? 'readonly' : ''}>${escapeHtml(pin.description || '')}</textarea></div>`}
        <div class="pin-popup-actions">
          ${ro ? '<button class="pin-popup-close-2" type="button">Close</button>' : `
            <button class="pin-popup-delete" type="button">Delete</button>
            <button class="pin-popup-save" type="button">Save</button>`}
        </div>
      </div>`;

    const popup = L.popup({
      closeButton: false,
      autoClose: false,
      closeOnClick: false,
      autoPan: true,
      autoPanPadding: [24, 24],
      className: 'bmx-popup-wrapper',
      offset: [0, -36],
      maxWidth: 380,
      minWidth: 340
    })
      .setLatLng(marker.getLatLng())
      .setContent(html)
      .openOn(map);

    currentOpenPopup = popup;

    // Wire everything after the popup content is in the DOM
    setTimeout(() => {
      const el = popup.getElement();
      if (!el) return;

      // Close button (header ×)
      const closeBtn = el.querySelector('.pin-popup-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          ev.preventDefault();
          closePopup();
        });
      }

      // Close button (read-only mode)
      const closeBtn2 = el.querySelector('.pin-popup-close-2');
      if (closeBtn2) {
        closeBtn2.addEventListener('click', (ev) => {
          ev.stopPropagation();
          ev.preventDefault();
          closePopup();
        });
      }

      // Delete button
      const delBtn = el.querySelector('.pin-popup-delete');
      if (delBtn) {
        delBtn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          ev.preventDefault();
          pins = pins.filter(p => p.id !== pin.id);
          persist();
          closePopup();
        });
      }

      // Save button
      const savePinBtn = el.querySelector('.pin-popup-save');
      if (savePinBtn) {
        savePinBtn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          ev.preventDefault();
          pin.title = el.querySelector('.f-title').value.trim();
          const dEl = el.querySelector('.f-desc'); if (dEl) pin.description = dEl.value.trim();
          const rEl = el.querySelector('.f-racer'); if (rEl) pin.racer = rEl.value.trim();
          const dtEl = el.querySelector('.f-date'); if (dtEl) pin.date = dtEl.value;
          const aEl = el.querySelector('.f-age'); if (aEl) pin.age = aEl.value;
          const resEl = el.querySelector('.f-results'); if (resEl) pin.results = resEl.value.trim();
          const clsEl = el.querySelector('.f-class'); if (clsEl) pin.ageList = clsEl.value;
          persist();
          closePopup();
        });
      }

      // Class → Age cascade
      const classEl = el.querySelector('.f-class');
      const ageEl = el.querySelector('.f-age');
      if (classEl && ageEl) {
        classEl.addEventListener('change', () => {
          const list = classEl.value === 'boysCruiser' ? AGE_OPTIONS_BOYS_CRUISER
                    : classEl.value === 'girlsCruiser' ? AGE_OPTIONS_GIRLS_CRUISER
                    : AGE_OPTIONS_STANDARD;
          ageEl.innerHTML = buildOptions(list, '', 'Select age…');
        });
      }
    }, 0);
  }

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

  /* ─────────────── SIDEBAR EVENTS ─────────────── */
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

  Object.keys(sections).forEach(kind => {
    const sec = sections[kind];
    if (!sec.el) return;
    sec.el.addEventListener('mousedown', () => { activeSection = kind; });
  });

  /* ─────────────── SAVE BUTTON ─────────────── */
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      if (page === 'creator') {
        const suggested = getCreatorName() || 'My Map';
        const name = window.prompt('Name this map:', suggested);
        if (name === null) return;
        const trimmed = name.trim() || 'Untitled Map';
        const cleanPins = pins.map(p => ({ ...p }));
        const user = window.BMX?.auth?.getUser();
        if (user && window.BMX?.sb) {
          const existing = userMapsCache.find(m => m.name === trimmed);
          let result;
          if (existing) {
            if (!window.confirm(`A map named "${trimmed}" already exists. Overwrite it?`)) return;
            result = await updateMapInSupabase(existing.id, cleanPins);
          } else {
            result = await saveMapToSupabase(trimmed, cleanPins);
          }
          if (!result.ok) { window.alert('Save failed.'); return; }
          await loadUserMaps();
          const nameEl = document.getElementById('creatorMapName');
          if (nameEl) nameEl.value = trimmed;
          window.alert(`Saved "${trimmed}".`);
        } else {
          const userMaps = readLocalUserMaps();
          const existing = userMaps.find(m => m.name === trimmed);
          if (existing) {
            if (!window.confirm(`A map named "${trimmed}" already exists. Overwrite it?`)) return;
            existing.pins = cleanPins; existing.updatedAt = Date.now();
          } else {
            userMaps.push({ id: uid('map'), name: trimmed, seed: false, pins: cleanPins, createdAt: Date.now(), updatedAt: Date.now() });
          }
          writeUserMaps(userMaps);
          const nameEl = document.getElementById('creatorMapName');
          if (nameEl) nameEl.value = trimmed;
          window.alert(`Saved "${trimmed}" locally.`);
        }
      } else if (page === 'maps' && currentMap && !currentMap.seed) {
        const cleanPins = pins.map(p => ({ ...p }));
        const user = window.BMX?.auth?.getUser();
        if (user && window.BMX?.sb) {
          const result = await updateMapInSupabase(currentMap.id, cleanPins);
          if (!result.ok) { window.alert('Save failed.'); return; }
          await loadUserMaps();
          currentMap.pins = cleanPins;
          flashSaveButton('Saved!');
        } else {
          const list = readLocalUserMaps();
          const idx = list.findIndex(m => m.id === currentMap.id);
          if (idx >= 0) { list[idx].pins = cleanPins; list[idx].updatedAt = Date.now(); writeUserMaps(list); }
          currentMap.pins = cleanPins;
          renderMapLists();
          flashSaveButton('Saved!');
        }
      }
    });
  }

  async function saveMapToSupabase(name, pins) {
    const user = window.BMX?.auth?.getUser();
    if (!user || !window.BMX?.sb) return { ok: false };
    const { error } = await window.BMX.sb.from('maps').insert({ user_id: user.id, name, pins });
    if (error) { console.error(error); return { ok: false }; }
    return { ok: true };
  }
  async function updateMapInSupabase(id, pins) {
    const user = window.BMX?.auth?.getUser();
    if (!user || !window.BMX?.sb) return { ok: false };
    const { error } = await window.BMX.sb.from('maps').update({ pins, updated_at: new Date().toISOString() }).eq('id', id).eq('user_id', user.id);
    if (error) { console.error(error); return { ok: false }; }
    return { ok: true };
  }
  async function deleteMapFromSupabase(id) {
    const user = window.BMX?.auth?.getUser();
    if (!user || !window.BMX?.sb) return { ok: false };
    const { error } = await window.BMX.sb.from('maps').delete().eq('id', id).eq('user_id', user.id);
    if (error) { console.error(error); return { ok: false }; }
    return { ok: true };
  }
  async function migrateLocalMapsIfNeeded() {
    const user = window.BMX?.auth?.getUser();
    if (!user || !window.BMX?.sb) return;
    const local = readLocalUserMaps();
    if (!local.length) return;
    const { count, error } = await window.BMX.sb.from('maps').select('*', { count: 'exact', head: true });
    if (error || count > 0) return;
    const rows = local.map(m => ({ user_id: user.id, name: m.name || 'Untitled Map', pins: m.pins || [] }));
    const { error: insertErr } = await window.BMX.sb.from('maps').insert(rows);
    if (insertErr) console.error(insertErr);
  }

  function flashSaveButton(text) {
    if (!saveBtn) return;
    const original = saveBtn.textContent;
    saveBtn.textContent = text;
    saveBtn.disabled = true;
    setTimeout(() => { saveBtn.textContent = original; saveBtn.disabled = false; }, 900);
  }

  /* ─────────────── MAP LIST ─────────────── */
  function renderMapLists() {
    if (page !== 'maps') return;
    const seedList = document.getElementById('seedMapList');
    const userList = document.getElementById('userMapList');
    if (!seedList || !userList) return;

    const grouped = { usabmx: [] };
    const ungrouped = [];
    seedMaps.forEach(m => {
      if (m.group) {
        if (!grouped[m.group]) grouped[m.group] = [];
        grouped[m.group].push(m);
      } else {
        ungrouped.push(m);
      }
    });

    if (grouped.usabmx) {
      grouped.usabmx.sort((a, b) => a.name.localeCompare(b.name));
    }

    let html = '';

    if (grouped.usabmx && grouped.usabmx.length) {
      html += `
        <li class="map-list-group">
          <div class="map-list-group-header" data-group="usabmx">
            <span class="map-list-group-chevron">▶</span>
            <span class="map-list-group-name">USA BMX Tracks</span>
            <span class="map-list-group-count">${grouped.usabmx.length}</span>
          </div>
          <ul class="map-list map-list-sub" data-subgroup="usabmx" style="display:none;">
            ${grouped.usabmx.map(m => mapListItemHtml(m, true)).join('')}
          </ul>
        </li>`;
    }

    if (ungrouped.length) {
      html += ungrouped.map(m => mapListItemHtml(m, true)).join('');
    }

    seedList.innerHTML = html || `<li class="map-list-empty">No curated maps yet.</li>`;

    seedList.querySelectorAll('.map-list-group-header').forEach(h => {
      h.addEventListener('click', (e) => {
        e.stopPropagation();
        const list = h.parentElement.querySelector('.map-list-sub');
        if (!list) return;
        const open = list.style.display !== 'none';
        list.style.display = open ? 'none' : '';
        h.querySelector('.map-list-group-chevron').textContent = open ? '▶' : '▼';
      });
    });

    const userMaps = readUserMaps();
    userList.innerHTML = userMaps.length
      ? userMaps.map(m => mapListItemHtml(m, false)).join('')
      : `<li class="map-list-empty">No saved maps yet.<br>Create one on the Map Creator.</li>`;

    if (currentMap) {
      const seedGroup = document.getElementById('group-seed');
      const userGroup = document.getElementById('group-user');
      const inSeed = seedMaps.some(m => m.id === currentMap.id);
      const inUser = userMaps.some(m => m.id === currentMap.id);
      if (inSeed && seedGroup) seedGroup.classList.add('open');
      if (inUser && userGroup) userGroup.classList.add('open');
      if (inSeed) {
        const grp = seedList.querySelector('.map-list-sub[data-subgroup="usabmx"]');
        const hdr = seedList.querySelector('.map-list-group-header[data-group="usabmx"]');
        if (grp) grp.style.display = '';
        if (hdr) hdr.querySelector('.map-list-group-chevron').textContent = '▼';
      }
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
        ${isSeed ? '' : `<button class="map-list-delete" data-delete-map="${m.id}">×</button>`}
      </li>`;
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
    fitMapToPins();
  }

  function fitMapToPins() {
    if (!map) return;
    const valid = pins
      .map(p => [Number(p.lat), Number(p.lng)])
      .filter(([la, ln]) => Number.isFinite(la) && Number.isFinite(ln));
    if (!valid.length) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      return;
    }
    if (valid.length === 1) {
      map.setView(valid[0], 10);
      return;
    }
    const bounds = L.latLngBounds(valid);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
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

  pinsPanel.addEventListener('click', async (e) => {
    if (page !== 'maps') return;

    const delBtn = e.target.closest('[data-delete-map]');
    if (delBtn) {
      e.stopPropagation();
      const id = delBtn.dataset.deleteMap;
      const map2 = userMapsCache.find(m => m.id === id);
      if (!map2) return;
      if (!window.confirm(`Delete "${map2.name}"?`)) return;
      const user = window.BMX?.auth?.getUser();
      if (user && window.BMX?.sb) {
        const result = await deleteMapFromSupabase(id);
        if (!result.ok) { window.alert('Delete failed.'); return; }
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
        if (map) map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      }
      renderMapLists();
      return;
    }

    const item = e.target.closest('.map-list-item');
    if (!item) return;
    const clickedId = item.dataset.mapId;
    if (currentMap && currentMap.id === clickedId) {
      currentMap = null;
      pins = [];
      closePopup();
      renderPins();
      renderAll();
      renderMapLists();
      updateSaveButtonVisibility();
      if (map) map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      return;
    }
    loadMap(clickedId);
  });

  /* ─────────────── BOOT ─────────────── */
  async function boot() {
    initMap();
    if (window.BMX?.authReady) await window.BMX.authReady;
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

  if (window.BMX?.auth) {
    window.BMX.auth.onChange(() => {
      migrateLocalMapsIfNeeded().then(() => loadUserMaps());
    });
  }

  window.addEventListener('resize', () => {
    if (map) setTimeout(() => map.invalidateSize(), 100);
  });
})();
