(function () {
  const stage = document.getElementById('challengesStage');
  const tabs  = document.getElementById('challengesTabs');
  const clBody = document.getElementById('clBody');
  const clSubtitle = document.getElementById('clSubtitle');

  if (!stage || !tabs) return;

  /* ─────────────── PLACEHOLDER PLAYER ─────────────── */
  const PLAYER_NAME = 'Racer';

  /* ─────────────── STORAGE ─────────────── */
  const LS_LEADERBOARDS = 'bmxtools.challenges.leaderboards';
  const LS_STATS        = 'bmxtools.challenges.stats';
  const LS_MUTED        = 'bmxtools.challenges.muted';
  const LS_MEM_DIFF     = 'bmxtools.challenges.memoryDifficulty';

  function readBoards() {
    try {
      const raw = localStorage.getItem(LS_LEADERBOARDS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  }
  function writeBoards(boards) {
    try { localStorage.setItem(LS_LEADERBOARDS, JSON.stringify(boards)); } catch {}
  }
  function readStats() {
    try {
      const raw = localStorage.getItem(LS_STATS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {};
  }
  function writeStats(stats) {
    try { localStorage.setItem(LS_STATS, JSON.stringify(stats)); } catch {}
  }
  function readMuted() {
    return localStorage.getItem(LS_MUTED) === '1';
  }
  function writeMuted(muted) {
    try { localStorage.setItem(LS_MUTED, muted ? '1' : '0'); } catch {}
  }
  function readMemDiff() {
    const v = localStorage.getItem(LS_MEM_DIFF);
    return (v === 'easy' || v === 'medium' || v === 'hard') ? v : 'medium';
  }
  function writeMemDiff(d) {
    try { localStorage.setItem(LS_MEM_DIFF, d); } catch {}
  }

  /* ─────────────── SEED DATA ─────────────── */
  const SEED = {
    reaction: [
      { name: 'SpeedKing',   bestMs: 182, avgMs: 198, plays: 34 },
      { name: 'GateSnapper', bestMs: 195, avgMs: 214, plays: 21 },
      { name: 'Dialed',      bestMs: 208, avgMs: 226, plays: 17 },
      { name: 'Rookie',      bestMs: 241, avgMs: 268, plays: 6  }
    ],
    'memory-easy': [
      { name: 'QuickFingers', bestMs: 11200, avgMs: 14300, plays: 22 },
      { name: 'SnapMatch',    bestMs: 13400, avgMs: 16200, plays: 15 },
      { name: 'Dialed',       bestMs: 14800, avgMs: 17900, plays: 9  }
    ],
    'memory-medium': [
      { name: 'MemoryAce',    bestMs: 28500, avgMs: 35200, plays: 18 },
      { name: 'QuickFingers', bestMs: 31200, avgMs: 38800, plays: 12 },
      { name: 'SnapMatch',    bestMs: 36700, avgMs: 42600, plays: 7  }
    ],
    'memory-hard': [
      { name: 'MemoryAce',    bestMs: 54300, avgMs: 62100, plays: 8  },
      { name: 'QuickFingers', bestMs: 58900, avgMs: 67800, plays: 4  }
    ]
  };

  let boards = readBoards();
  if (!boards) {
    boards = JSON.parse(JSON.stringify(SEED));
    writeBoards(boards);
  }

  function getBoard(gameId) {
    if (!boards[gameId]) boards[gameId] = [];
    return boards[gameId];
  }

  function recordScore(gameId, { bestMs, avgMs }) {
    const board = getBoard(gameId);
    const existing = board.find(r => r.name === PLAYER_NAME);
    if (existing) {
      existing.bestMs = Math.min(existing.bestMs, bestMs);
      existing.avgMs = Math.round((existing.avgMs * existing.plays + avgMs) / (existing.plays + 1));
      existing.plays += 1;
    } else {
      board.push({ name: PLAYER_NAME, bestMs, avgMs, plays: 1 });
    }
    writeBoards(boards);

    const stats = readStats();
    const s = stats[gameId] || { bestMs: Infinity, totalAvgMs: 0, sessions: 0 };
    s.bestMs = Math.min(s.bestMs, bestMs);
    s.totalAvgMs = Math.round((s.totalAvgMs * s.sessions + avgMs) / (s.sessions + 1));
    s.sessions += 1;
    stats[gameId] = s;
    writeStats(stats);

    return s;
  }

  function getPersonalStats(gameId) {
    const stats = readStats();
    return stats[gameId] || null;
  }

  /* ─────────────── SORT STATE ─────────────── */
  const sortState = {};

  function getSort(gameId) {
    if (!sortState[gameId]) sortState[gameId] = { col: 'best', dir: 'asc' };
    return sortState[gameId];
  }

  /* ─────────────── LEADERBOARD RENDER ─────────────── */
  function formatMs(ms) {
    if (ms == null) return '—';
    if (ms < 60000) return (ms / 1000).toFixed(1) + 's';
    const m = Math.floor(ms / 60000);
    const s = ((ms % 60000) / 1000).toFixed(1);
    return `${m}:${s.padStart(4, '0')}`;
  }

  function renderLeaderboard(gameId) {
    const board = getBoard(gameId);
    const { col, dir } = getSort(gameId);

    const keyMap = { best: 'bestMs', avg: 'avgMs', plays: 'plays' };
    const key = keyMap[col] || 'bestMs';

    const sorted = [...board].sort((a, b) => {
      const diff = a[key] - b[key];
      return dir === 'asc' ? diff : -diff;
    }).slice(0, 10);

    if (sorted.length === 0) {
      clBody.innerHTML = `<tr><td colspan="5" class="cl-empty">No scores yet — be the first!</td></tr>`;
      return;
    }

    const isMemory = gameId.startsWith('memory-');

    clBody.innerHTML = sorted.map((row, i) => {
      const isYou = row.name === PLAYER_NAME;
      const bestCell = isMemory ? formatMs(row.bestMs) : `${row.bestMs}<span class="cl-unit">ms</span>`;
      const avgCell  = isMemory ? formatMs(row.avgMs)  : `${row.avgMs}<span class="cl-unit">ms</span>`;
      return `
        <tr class="${isYou ? 'cl-you' : ''}">
          <td class="cl-rank">${i + 1}</td>
          <td class="cl-name">${escapeHtml(row.name)}${isYou ? ' <span class="cl-badge">you</span>' : ''}</td>
          <td class="cl-best">${bestCell}</td>
          <td class="cl-avg">${avgCell}</td>
          <td class="cl-plays">${row.plays}</td>
        </tr>
      `;
    }).join('');

    document.querySelectorAll('.cl-sortable').forEach(th => {
      const active = th.dataset.sort === col;
      th.classList.toggle('active', active);
      const arrow = th.querySelector('.cl-arrow');
      if (arrow) arrow.textContent = active ? (dir === 'asc' ? '▲' : '▼') : '';
    });
  }

  function wireSortHeaders(gameId) {
    document.querySelectorAll('.cl-sortable').forEach(th => {
      th.onclick = () => {
        const col = th.dataset.sort;
        const s = getSort(gameId);
        if (s.col === col) {
          s.dir = s.dir === 'asc' ? 'desc' : 'asc';
        } else {
          s.col = col;
          s.dir = col === 'plays' ? 'desc' : 'asc';
        }
        renderLeaderboard(gameId);
      };
    });
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

  /* ─────────────── AUDIO ─────────────── */
  let audioCtx = null;
  function ensureAudio() {
    if (audioCtx) return audioCtx;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {}
    return audioCtx;
  }
  let audioWarmed = false;
  function warmAudio() {
    if (audioWarmed) return;
    audioWarmed = true;
    const ctx = ensureAudio();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.01);
    } catch {}
  }
  function beep(freq = 700, durationMs = 80, volume = 0.15) {
    if (readMuted()) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    osc.start(now);
    gain.gain.setValueAtTime(volume, now + durationMs / 1000 - 0.02);
    gain.gain.linearRampToValueAtTime(0, now + durationMs / 1000);
    osc.stop(now + durationMs / 1000 + 0.02);
  }
  function startHeldTone(freq = 700, volume = 0.15) {
    if (readMuted()) return () => {};
    const ctx = ensureAudio();
    if (!ctx) return () => {};
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    osc.start(now);

    let stopped = false;
    return function stopHeldTone() {
      if (stopped) return;
      stopped = true;
      const stopAt = ctx.currentTime + 0.03;
      try {
        gain.gain.cancelScheduledValues(ctx.currentTime);
        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, stopAt);
        osc.stop(stopAt + 0.02);
      } catch {}
    };
  }

  /* ─────────────── GAME REGISTRY ─────────────── */
  const GAMES = {
    reaction: {
      id: 'reaction',
      label: 'Reaction Time',
      leaderboardSubtitle: 'Reaction Time',
      mount: mountReaction
    },
    memory: {
      id: 'memory',
      label: 'Memory Pairs',
      leaderboardSubtitle: 'Memory Pairs',
      mount: mountMemory
    }
  };

  function setActiveGame(gameId) {
    const game = GAMES[gameId];
    if (!game) return;

    if (stage._cleanup) {
      try { stage._cleanup(); } catch {}
      stage._cleanup = null;
    }

    tabs.querySelectorAll('.ch-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.game === gameId);
    });

    stage.innerHTML = '';
    game.mount(stage);

    if (gameId === 'memory') {
      // mountMemory handles its own leaderboard wiring
    } else {
      if (clSubtitle) clSubtitle.textContent = game.leaderboardSubtitle;
      wireSortHeaders(gameId);
      renderLeaderboard(gameId);
    }
  }

  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.ch-tab');
    if (!btn) return;
    setActiveGame(btn.dataset.game);
  });

  /* ─────────────── GAME 1: REACTION TIME ─────────────── */
  function mountReaction(root) {
    const ROUNDS = 3;
    const PRE_DELAY_MIN   = 1000;
    const PRE_DELAY_MAX   = 3000;
    const RED_GAP_MS      = 130;
    const GREEN_HOLD_MS   = 500;

    let state = 'idle';
    let times = [];
    let readyAt = 0;
    let greenStop = null;
    const timeoutIds = [];

    function clearTimers() {
      timeoutIds.forEach(id => clearTimeout(id));
      timeoutIds.length = 0;
      if (greenStop) { greenStop(); greenStop = null; }
    }
    function later(fn, ms) {
      const id = setTimeout(fn, ms);
      timeoutIds.push(id);
      return id;
    }

    root.innerHTML = `
      <div class="rt-wrap">
        <div class="rt-instructions">
          Click the light tree to begin. Wait through the random pause, watch the lights,
          and tap the moment <strong>green</strong> turns on. 3 rounds.
        </div>

        <div class="rt-tree-wrap">
          <button class="rt-tree" id="rtTree" type="button" aria-label="Reaction light tree">
            <div class="rt-light" data-light="1"></div>
            <div class="rt-light" data-light="2"></div>
            <div class="rt-light" data-light="3"></div>
            <div class="rt-light rt-green" data-light="4"></div>
          </button>
          <button class="rt-mute" id="rtMute" type="button" title="Toggle sound"></button>
        </div>

        <div class="rt-status-line" id="rtStatusLine">Click to Start</div>
        <div class="rt-timer" id="rtTimer"></div>
        <div class="rt-progress" id="rtProgress"></div>

        <div class="rt-personal" id="rtPersonal"></div>
      </div>
    `;

    const tree      = root.querySelector('#rtTree');
    const muteBtn   = root.querySelector('#rtMute');
    const statusEl  = root.querySelector('#rtStatusLine');
    const timerEl   = root.querySelector('#rtTimer');
    const progressEl= root.querySelector('#rtProgress');
    const personalEl= root.querySelector('#rtPersonal');

    const lights = {
      1: tree.querySelector('[data-light="1"]'),
      2: tree.querySelector('[data-light="2"]'),
      3: tree.querySelector('[data-light="3"]'),
      4: tree.querySelector('[data-light="4"]')
    };

    function setMuteUi() {
      muteBtn.textContent = readMuted() ? '🔇' : '🔊';
    }
    setMuteUi();

    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      warmAudio();
      writeMuted(!readMuted());
      setMuteUi();
    });

    function lightsOff() {
      Object.values(lights).forEach(el => el.classList.remove('lit'));
    }
    function lit(n) { lights[n].classList.add('lit'); }

    function renderProgress() {
      const parts = [];
      for (let i = 0; i < ROUNDS; i++) {
        if (i < times.length) parts.push(`<span class="rt-dot rt-dot-done">${times[i]}ms</span>`);
        else parts.push(`<span class="rt-dot">–</span>`);
      }
      progressEl.innerHTML = parts.join('');
    }

    function renderPersonal() {
      const s = getPersonalStats('reaction');
      if (!s || !isFinite(s.bestMs) || s.sessions === 0) {
        personalEl.innerHTML = '';
        return;
      }
      personalEl.innerHTML = `
        <div class="rt-personal-title">Your Stats</div>
        <div class="rt-personal-grid">
          <div class="rt-stat">
            <div class="rt-stat-label">Best</div>
            <div class="rt-stat-value">${s.bestMs}<span class="rt-stat-unit">ms</span></div>
          </div>
          <div class="rt-stat">
            <div class="rt-stat-label">Average</div>
            <div class="rt-stat-value">${s.totalAvgMs}<span class="rt-stat-unit">ms</span></div>
          </div>
          <div class="rt-stat">
            <div class="rt-stat-label">Sessions</div>
            <div class="rt-stat-value">${s.sessions}</div>
          </div>
        </div>
      `;
    }

    function reset() {
      clearTimers();
      times = [];
      lightsOff();
      timerEl.textContent = '';
      statusEl.textContent = 'Click to Start';
      state = 'idle';
      renderProgress();
    }

    function startRound() {
      lightsOff();
      timerEl.textContent = '';
      statusEl.textContent = 'Riders, watch the lights';
      state = 'prewait';

      const preDelay = Math.floor(Math.random() * (PRE_DELAY_MAX - PRE_DELAY_MIN) + PRE_DELAY_MIN);
      later(() => { runLightSequence(); }, preDelay);
    }

    function runLightSequence() {
      state = 'sequence';
      lit(1);
      beep(700, 80);
      statusEl.textContent = 'Eyes up…';

      later(() => { lit(2); beep(700, 80); }, RED_GAP_MS);
      later(() => { lit(3); beep(700, 80); }, RED_GAP_MS * 2);
      later(() => {
        lit(4);
        greenStop = startHeldTone(700, 0.15);
        statusEl.textContent = 'GO!';
        readyAt = performance.now();
        state = 'green';
      }, RED_GAP_MS * 3);
    }

    function handleClick() {
      warmAudio();

      if (state === 'idle' || state === 'done') {
        reset();
        renderPersonal();
        startRound();
        return;
      }

      if (state === 'prewait' || state === 'sequence') {
        clearTimers();
        lightsOff();
        statusEl.textContent = 'Too soon!';
        timerEl.textContent = '';
        tree.classList.add('rt-shake');
        setTimeout(() => tree.classList.remove('rt-shake'), 350);
        state = 'toosoon';
        later(() => { startRound(); }, 900);
        return;
      }

      if (state === 'green') {
        const ms = Math.round(performance.now() - readyAt);
        if (greenStop) {
          const stopFn = greenStop;
          greenStop = null;
          setTimeout(stopFn, GREEN_HOLD_MS);
        }
        times.push(ms);
        timerEl.textContent = ms + ' ms';
        renderProgress();

        if (times.length >= ROUNDS) {
          finishSession();
        } else {
          state = 'between';
          statusEl.textContent = `${ms} ms — next round`;
          lightsOff();
          later(() => { startRound(); }, 1000);
        }
      }
    }

    function finishSession() {
      state = 'done';
      const best = Math.min(...times);
      const avg  = Math.round(times.reduce((a, b) => a + b, 0) / times.length);

      statusEl.innerHTML = `Done · best <strong>${best} ms</strong> · avg <strong>${avg} ms</strong>`;
      timerEl.textContent = '';

      recordScore('reaction', { bestMs: best, avgMs: avg });
      renderLeaderboard('reaction');
      renderPersonal();

      later(() => {
        statusEl.textContent = 'Click to play again';
        lightsOff();
      }, 1400);
    }

    tree.addEventListener('click', handleClick);

    function onKey(e) {
      if (e.code === 'Space') {
        e.preventDefault();
        handleClick();
      }
    }
    document.addEventListener('keydown', onKey);

    lightsOff();
    renderProgress();
    renderPersonal();

    root._cleanup = () => {
      clearTimers();
      document.removeEventListener('keydown', onKey);
    };
  }

  /* ─────────────── GAME 2: MEMORY PAIRS ─────────────── */
  const MEMORY_ICONS = ['🚴','🏁','🥇','🛞','⚙️','🧢','🏆','🎯','🔥','🚵'];

  const MEMORY_LEVELS = {
    easy:   { label: 'Easy',   cols: 4, rows: 3, pairs: 6  },
    medium: { label: 'Medium', cols: 4, rows: 4, pairs: 8  },
    hard:   { label: 'Hard',   cols: 4, rows: 5, pairs: 10 }
  };

  function mountMemory(root) {
    let difficulty = readMemDiff();
    let cards = [];              // [{ id, icon, matched, flipped }]
    let firstIdx = null;
    let lockBoard = false;
    let moves = 0;
    let matchedPairs = 0;
    let startedAt = 0;
    let elapsed = 0;
    let timerInterval = null;
    let gameStarted = false;
    let gameFinished = false;
    let flipBackTimeout = null;

    root.innerHTML = `
      <div class="mem-wrap">
        <div class="mem-instructions">
          Flip two cards to find a match. Clear the board as fast as you can.
        </div>

        <div class="mem-difficulty" id="memDifficulty">
          <button class="mem-diff-btn" data-diff="easy">Easy <span class="mem-diff-sub">4×3</span></button>
          <button class="mem-diff-btn" data-diff="medium">Medium <span class="mem-diff-sub">4×4</span></button>
          <button class="mem-diff-btn" data-diff="hard">Hard <span class="mem-diff-sub">4×5</span></button>
        </div>

        <div class="mem-hud">
          <div class="mem-hud-item"><span class="mem-hud-label">Time</span><span class="mem-hud-value" id="memTime">0.0s</span></div>
          <div class="mem-hud-item"><span class="mem-hud-label">Pairs</span><span class="mem-hud-value" id="memPairs">0/0</span></div>
          <div class="mem-hud-item"><span class="mem-hud-label">Moves</span><span class="mem-hud-value" id="memMoves">0</span></div>
        </div>

        <div class="mem-grid" id="memGrid"></div>

        <div class="mem-status" id="memStatus">Click any card to start</div>
        <div class="mem-personal" id="memPersonal"></div>
      </div>
    `;

    const diffBar  = root.querySelector('#memDifficulty');
    const gridEl   = root.querySelector('#memGrid');
    const timeEl   = root.querySelector('#memTime');
    const pairsEl  = root.querySelector('#memPairs');
    const movesEl  = root.querySelector('#memMoves');
    const statusEl = root.querySelector('#memStatus');
    const personalEl = root.querySelector('#memPersonal');

    function currentGameId() {
      return 'memory-' + difficulty;
    }

    function refreshDiffUi() {
      diffBar.querySelectorAll('.mem-diff-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.diff === difficulty);
      });
    }

    function updateLeaderboard() {
      if (clSubtitle) clSubtitle.textContent = 'Memory Pairs · ' + MEMORY_LEVELS[difficulty].label;
      wireSortHeaders(currentGameId());
      renderLeaderboard(currentGameId());
    }

    function shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function buildDeck() {
      const cfg = MEMORY_LEVELS[difficulty];
      const icons = MEMORY_ICONS.slice(0, cfg.pairs);
      const deck = [];
      icons.forEach((icon, i) => {
        deck.push({ icon, pairId: i });
        deck.push({ icon, pairId: i });
      });
      return shuffle(deck).map((c, i) => ({ id: i, icon: c.icon, pairId: c.pairId, matched: false, flipped: false }));
    }

    function formatElapsed(ms) {
      if (ms < 60000) return (ms / 1000).toFixed(1) + 's';
      const m = Math.floor(ms / 60000);
      const s = ((ms % 60000) / 1000).toFixed(1);
      return `${m}:${s.padStart(4, '0')}`;
    }

    function stopTimer() {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }

    function startTimer() {
      startedAt = performance.now();
      stopTimer();
      timerInterval = setInterval(() => {
        elapsed = performance.now() - startedAt;
        timeEl.textContent = formatElapsed(elapsed);
      }, 100);
    }

    function renderGrid() {
      const cfg = MEMORY_LEVELS[difficulty];
      gridEl.style.setProperty('--mem-cols', cfg.cols);
       gridEl.style.setProperty('--mem-rows', cfg.rows);
      gridEl.innerHTML = cards.map((c, i) => {
        const classes = ['mem-card'];
        if (c.flipped) classes.push('is-flipped');
        if (c.matched) classes.push('is-matched');
        return `
          <button class="${classes.join(' ')}" data-idx="${i}" type="button" ${c.matched ? 'disabled' : ''}>
            <span class="mem-card-inner">
              <span class="mem-card-face mem-card-back">?</span>
              <span class="mem-card-face mem-card-front">${c.icon}</span>
            </span>
          </button>
        `;
      }).join('');
    }

    function updateHud() {
      const cfg = MEMORY_LEVELS[difficulty];
      pairsEl.textContent = `${matchedPairs}/${cfg.pairs}`;
      movesEl.textContent = moves;
      if (!gameStarted) timeEl.textContent = '0.0s';
    }

    function renderPersonal() {
      const s = getPersonalStats(currentGameId());
      if (!s || !isFinite(s.bestMs) || s.sessions === 0) {
        personalEl.innerHTML = '';
        return;
      }
      personalEl.innerHTML = `
        <div class="rt-personal-title">Your Stats · ${MEMORY_LEVELS[difficulty].label}</div>
        <div class="rt-personal-grid">
          <div class="rt-stat">
            <div class="rt-stat-label">Best</div>
            <div class="rt-stat-value">${formatElapsed(s.bestMs)}</div>
          </div>
          <div class="rt-stat">
            <div class="rt-stat-label">Average</div>
            <div class="rt-stat-value">${formatElapsed(s.totalAvgMs)}</div>
          </div>
          <div class="rt-stat">
            <div class="rt-stat-label">Sessions</div>
            <div class="rt-stat-value">${s.sessions}</div>
          </div>
        </div>
      `;
    }

    function resetGame(autoStart) {
      stopTimer();
      clearTimeout(flipBackTimeout);
      cards = buildDeck();
      firstIdx = null;
      lockBoard = false;
      moves = 0;
      matchedPairs = 0;
      startedAt = 0;
      elapsed = 0;
      gameStarted = false;
      gameFinished = false;
      statusEl.textContent = 'Click any card to start';
      renderGrid();
      updateHud();
      renderPersonal();
    }

    function onCardClick(idx) {
      warmAudio();
      if (lockBoard) return;
      const card = cards[idx];
      if (!card || card.matched || card.flipped) return;

      if (!gameStarted) {
        gameStarted = true;
        startTimer();
        statusEl.textContent = '';
      }

      card.flipped = true;
      renderGrid();

      if (firstIdx === null) {
        firstIdx = idx;
        beep(600, 60, 0.08);
        return;
      }

      const firstCard = cards[firstIdx];
      moves += 1;
      updateHud();
      lockBoard = true;

      if (firstCard.pairId === card.pairId) {
        // Match
        firstCard.matched = true;
        card.matched = true;
        matchedPairs += 1;
        beep(900, 90, 0.12);
        firstIdx = null;
        lockBoard = false;
        renderGrid();
        updateHud();

        const cfg = MEMORY_LEVELS[difficulty];
        if (matchedPairs >= cfg.pairs) {
          finishGame();
        }
      } else {
        // No match — flip back after delay
        beep(400, 70, 0.08);
        flipBackTimeout = setTimeout(() => {
          firstCard.flipped = false;
          card.flipped = false;
          firstIdx = null;
          lockBoard = false;
          renderGrid();
        }, 500);
      }
    }

    function finishGame() {
      stopTimer();
      gameFinished = true;
      elapsed = performance.now() - startedAt;

      const best = Math.round(elapsed);
      const avg  = best; // One session = one score; running avg handled in stats

      statusEl.innerHTML = `Cleared! <strong>${formatElapsed(elapsed)}</strong> · ${moves} moves`;

      recordScore(currentGameId(), { bestMs: best, avgMs: avg });
      renderLeaderboard(currentGameId());
      renderPersonal();

      // Play-again button
      const btn = document.createElement('button');
      btn.className = 'mem-play-again';
      btn.textContent = 'Play Again';
      btn.addEventListener('click', () => resetGame());
      statusEl.appendChild(document.createElement('br'));
      statusEl.appendChild(btn);
    }

    // Wire grid (delegated)
    gridEl.addEventListener('click', (e) => {
      const cardEl = e.target.closest('.mem-card');
      if (!cardEl) return;
      onCardClick(Number(cardEl.dataset.idx));
    });

    // Wire difficulty buttons
    diffBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.mem-diff-btn');
      if (!btn) return;
      const d = btn.dataset.diff;
      if (!MEMORY_LEVELS[d]) return;
      difficulty = d;
      writeMemDiff(d);
      refreshDiffUi();
      resetGame();
      updateLeaderboard();
    });

    // Init
    refreshDiffUi();
    resetGame();
    updateLeaderboard();

    root._cleanup = () => {
      stopTimer();
      clearTimeout(flipBackTimeout);
    };
  }

  /* ─────────────── INIT ─────────────── */
  setActiveGame('reaction');

})();