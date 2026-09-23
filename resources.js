(function () {
  const tabsEl = document.getElementById('resourcesTabs');
  const bodyEl = document.getElementById('resourcesBody');

  if (!tabsEl || !bodyEl || typeof RESOURCES === 'undefined') return;

  /* ─────────────── FAVORITES STORAGE ─────────────── */
  const LS_FAVS = 'bmxtools.favorites';

  function readFavs() {
    try {
      const raw = localStorage.getItem(LS_FAVS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  }
  function writeFavs(favs) {
    try { localStorage.setItem(LS_FAVS, JSON.stringify(favs)); } catch {}
  }

  function isFav(key, kind = 'resource') {
    if (!key) return false;
    return readFavs().some(f => f.type === kind && f.key === key);
  }

  function toggleFav({ kind, key, title, note }) {
    if (!key) return;
    const favs = readFavs();
    const idx = favs.findIndex(f => f.type === kind && f.key === key);
    if (idx >= 0) {
      favs.splice(idx, 1);
    } else {
      favs.push({ type: kind, key, title: title || '', note: note || '', savedAt: Date.now() });
    }
    writeFavs(favs);
  }

  /* ─────────────── HELPERS ─────────────── */
  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function hashString(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) + h) + str.charCodeAt(i);
      h = h & 0xffffffff;
    }
    return (h >>> 0).toString(36);
  }

  /* ─────────────── RENDER ─────────────── */
  function renderTab(tabId) {
    tabsEl.querySelectorAll('.res-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    const raw = RESOURCES[tabId];

    let categories = [];
    let disclaimer = '';

    if (Array.isArray(raw)) {
      categories = raw;
    } else if (raw && typeof raw === 'object') {
      categories = raw.categories || [];
      disclaimer = raw.disclaimer || '';
    }

    if (categories.length === 0 && !disclaimer) {
      bodyEl.innerHTML = `<div class="res-coming-soon">Coming soon.</div>`;
      return;
    }

    const disclaimerHtml = disclaimer
      ? `<div class="res-disclaimer">
           <span class="res-disclaimer-icon">ℹ️</span>
           <p>${escapeHtml(disclaimer)}</p>
         </div>`
      : '';

    bodyEl.innerHTML = `
      ${disclaimerHtml}
      <div class="res-grid">${
        categories.map((cat, i) => renderCategory(cat, i)).join('')
      }</div>
    `;

    wireToggles();
    wireFavButtons();
  }

  function renderCategory(cat, index) {
    const hasSubs = Array.isArray(cat.subcategories) && cat.subcategories.length > 0;

    let inner = '';
    if (hasSubs) {
      inner = cat.subcategories.map((sub, j) => renderSubcategory(sub, j)).join('');
    } else {
      const items = cat.items || [];
      inner = items.length
        ? items.map(item => renderItem(item)).join('')
        : `<li class="res-empty">Nothing here yet.</li>`;
    }

    return `
      <div class="res-category" data-cat="${index}">
        <div class="res-category-header" role="button" tabindex="0">
          <span class="res-category-name">${escapeHtml(cat.category)}</span>
          <span class="res-category-chevron">▼</span>
        </div>
        <div class="res-category-body">
          ${hasSubs
            ? `<div class="res-subcats">${inner}</div>`
            : `<ul class="res-list">${inner}</ul>`}
        </div>
      </div>
    `;
  }

  function renderSubcategory(sub, index) {
    const items = sub.items || [];
    const itemsHtml = items.length
      ? items.map(item => renderItem(item)).join('')
      : `<li class="res-empty">Nothing here yet.</li>`;

    return `
      <div class="res-subcat" data-subcat="${index}">
        <div class="res-subcat-header" role="button" tabindex="0">
          <span class="res-subcat-name">${escapeHtml(sub.category)}</span>
          <span class="res-subcat-chevron">▼</span>
        </div>
        <ul class="res-list">${itemsHtml}</ul>
      </div>
    `;
  }

  function renderItem(item) {
    // Quote-style item
    if (item.quote) {
      const key = 'quote:' + hashString(item.quote + '|' + (item.who || ''));
      const fav = isFav(key, 'quote');
      const favTitle = fav ? 'Remove from favorites' : 'Add to favorites';

      return `
        <li class="res-item res-quote">
          <div class="res-row">
            <div class="res-quote-body">
              <div class="res-quote-text">“${escapeHtml(item.quote)}”</div>
              ${item.who ? `<div class="res-quote-who">— ${escapeHtml(item.who)}</div>` : ''}
            </div>
            <button
              class="res-fav-btn${fav ? ' is-fav' : ''}"
              type="button"
              title="${favTitle}"
              data-fav-key="${key}"
              data-title="${escapeHtml(item.quote)}"
              data-note="${escapeHtml(item.who || '')}"
              data-fav-kind="quote"
              aria-pressed="${fav ? 'true' : 'false'}"
            >${fav ? '★' : '☆'}</button>
          </div>
        </li>
      `;
    }

    // Regular link item
    const safeUrl = escapeHtml(item.url || '#');
    const fav = isFav(item.url);
    const favTitle = fav ? 'Remove from favorites' : 'Add to favorites';

    return `
      <li class="res-item">
        <div class="res-row">
          <a class="res-link" href="${safeUrl}" target="_blank" rel="noopener noreferrer">
            <div class="res-link-info">
              <div class="res-link-title">${escapeHtml(item.title || 'Untitled')}</div>
              ${item.note ? `<div class="res-link-note">${escapeHtml(item.note)}</div>` : ''}
            </div>
            <span class="res-link-action">open →</span>
          </a>
          <button
            class="res-fav-btn${fav ? ' is-fav' : ''}"
            type="button"
            title="${favTitle}"
            data-fav-key="${safeUrl}"
            data-title="${escapeHtml(item.title || '')}"
            data-note="${escapeHtml(item.note || '')}"
            data-fav-kind="resource"
            aria-pressed="${fav ? 'true' : 'false'}"
          >${fav ? '★' : '☆'}</button>
        </div>
      </li>
    `;
  }

  /* ─────────────── TOGGLES ─────────────── */
  function wireToggles() {
    bodyEl.querySelectorAll('.res-category-header').forEach(header => {
      header.addEventListener('click', () => {
        const cat = header.closest('.res-category');
        if (cat) cat.classList.toggle('open');
      });
    });

    bodyEl.querySelectorAll('.res-subcat-header').forEach(header => {
      header.addEventListener('click', (e) => {
        e.stopPropagation();
        const sub = header.closest('.res-subcat');
        if (sub) sub.classList.toggle('open');
      });
    });
  }

  /* ─────────────── FAVORITES WIRING ─────────────── */
  function wireFavButtons() {
    bodyEl.querySelectorAll('.res-fav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const kind = btn.dataset.favKind || 'resource';
        const key = btn.dataset.favKey;
        const title = btn.dataset.title;
        const note = btn.dataset.note;

        toggleFav({ kind, key, title, note });

        const nowFav = isFav(key, kind);
        btn.classList.toggle('is-fav', nowFav);
        btn.textContent = nowFav ? '★' : '☆';
        btn.title = nowFav ? 'Remove from favorites' : 'Add to favorites';
        btn.setAttribute('aria-pressed', nowFav ? 'true' : 'false');

        btn.classList.remove('fav-pop');
        void btn.offsetWidth;
        btn.classList.add('fav-pop');
      });
    });
  }

  /* ─────────────── TAB SWITCHING ─────────────── */
  tabsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.res-tab');
    if (!btn) return;
    renderTab(btn.dataset.tab);
  });

  /* ─────────────── INIT ─────────────── */
  renderTab('motivation');

})();