// auth.js — shared auth helpers used by every page.

(function () {
  if (!window.BMX || !window.BMX.sb) {
    console.warn('auth.js: Supabase client not loaded');
    return;
  }
  const sb = window.BMX.sb;

  /* ─────────────── CURRENT USER ─────────────── */
  let currentUser = null;
  const listeners = [];

  function emit() {
    listeners.forEach(fn => { try { fn(currentUser); } catch (e) { console.error(e); } });
  }

  async function refreshUser() {
    const { data } = await sb.auth.getUser();
    currentUser = data?.user || null;
    emit();
    renderNavAuth();
  }

  function onChange(fn) { listeners.push(fn); fn(currentUser); }
  function getUser() { return currentUser; }

  /* ─────────────── AUTH ACTIONS ─────────────── */
  async function signUp(email, password) {
    const { data, error } = await sb.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }

  async function signIn(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    await sb.auth.signOut();
    currentUser = null;
    emit();
    renderNavAuth();
  }

  /* ─────────────── NAV AUTH UI ─────────────── */
  // Injected into any <div id="navAuth"></div> found in the header.
  function renderNavAuth() {
    const slot = document.getElementById('navAuth');
    if (!slot) return;

    if (currentUser) {
      const initial = (currentUser.email || '?')[0].toUpperCase();
      slot.innerHTML = `
        <div class="nav-user" id="navUser">
          <button class="nav-user-btn" type="button" id="navUserBtn">
            <span class="nav-user-avatar">${initial}</span>
            <span class="nav-user-email">${escapeHtml(currentUser.email)}</span>
          </button>
          <div class="nav-user-menu" id="navUserMenu" hidden>
            <button class="nav-menu-item" type="button" id="navLogoutBtn">Log out</button>
          </div>
        </div>
      `;
      const btn = document.getElementById('navUserBtn');
      const menu = document.getElementById('navUserMenu');
      const logout = document.getElementById('navLogoutBtn');

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.hidden = !menu.hidden;
      });
      document.addEventListener('click', () => { menu.hidden = true; });
      logout.addEventListener('click', async () => {
        await signOut();
        window.location.href = 'index.html';
      });
    } else {
      slot.innerHTML = `<a class="nav-login-btn" href="login.html">Log in</a>`;
    }
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ─────────────── BOOT ─────────────── */
  sb.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user || null;
    emit();
    renderNavAuth();
  });

    // Expose a promise so other scripts can wait until we know the auth state.
  window.BMX = window.BMX || {};
  window.BMX.authReady = refreshUser();

  // Expose public API
  window.BMX.auth = {
    getUser, onChange, signUp, signIn, signOut, refreshUser
  };
})();
