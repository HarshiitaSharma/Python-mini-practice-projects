(() => {
  const STORAGE_KEY = 'tomato-records';
  const SETTINGS_KEY = 'tomato-settings';

  const defaults = { focus: 25, short: 5, long: 15, cycle: 4 };
  const settings = { ...defaults, ...loadJSON(SETTINGS_KEY, {}) };

  const modeMinutes = () => ({ focus: settings.focus, short: settings.short, long: settings.long });

  const state = {
    mode: 'focus',
    secondsLeft: settings.focus * 60,
    totalSeconds: settings.focus * 60,
    running: false,
    timerId: null,
    completedInCycle: 0,
    viewYear: new Date().getFullYear(),
    viewMonth: new Date().getMonth(), // 0-indexed
  };

  // ---------- DOM ----------
  const timeDisplay = document.getElementById('timeDisplay');
  const modeLabel = document.getElementById('modeLabel');
  const startPauseBtn = document.getElementById('startPauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const modeButtons = document.querySelectorAll('.mode-btn');
  const dialProgress = document.querySelector('.dial-progress');
  const cycleDotsEl = document.getElementById('cycleDots');
  const monthTotalEl = document.getElementById('monthTotal');
  const monthLabelEl = document.getElementById('monthLabel');
  const patchGrid = document.getElementById('patchGrid');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');
  const settingsToggle = document.getElementById('settingsToggle');
  const settingsPanel = document.getElementById('settingsPanel');
  const saveSettingsBtn = document.getElementById('saveSettings');
  const focusInput = document.getElementById('focusInput');
  const shortInput = document.getElementById('shortInput');
  const longInput = document.getElementById('longInput');
  const cycleInput = document.getElementById('cycleInput');

  focusInput.value = settings.focus;
  shortInput.value = settings.short;
  longInput.value = settings.long;
  cycleInput.value = settings.cycle;

  // ---------- Storage helpers ----------
  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  }
  function saveJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
  }
  function dateKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  function logCompletedFocusSession() {
    const records = loadJSON(STORAGE_KEY, {});
    const key = dateKey(new Date());
    records[key] = (records[key] || 0) + 1;
    saveJSON(STORAGE_KEY, records);
    renderPatch();
  }

  // ---------- Timer core ----------
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function setMode(mode, { resetCycle = false } = {}) {
    state.mode = mode;
    const minutes = modeMinutes()[mode];
    state.totalSeconds = minutes * 60;
    state.secondsLeft = state.totalSeconds;
    if (resetCycle) state.completedInCycle = 0;
    modeButtons.forEach(btn => {
      const active = btn.dataset.mode === mode;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active);
    });
    modeLabel.textContent = mode === 'focus' ? 'focus session' : mode === 'short' ? 'short break' : 'long break';
    stopTicking();
    updateDisplay();
    renderCycleDots();
  }

  function updateDisplay() {
    timeDisplay.textContent = formatTime(state.secondsLeft);
    const fraction = state.secondsLeft / state.totalSeconds;
    dialProgress.style.strokeDashoffset = String(1000 * (1 - fraction));
    document.title = state.running ? `${formatTime(state.secondsLeft)} — Tomato.` : 'Tomato. — a pomodoro timer';
  }

  function tick() {
    state.secondsLeft -= 1;
    if (state.secondsLeft <= 0) {
      handleSessionComplete();
      return;
    }
    updateDisplay();
  }

  function handleSessionComplete() {
    stopTicking();
    playChime();

    if (state.mode === 'focus') {
      state.completedInCycle += 1;
      logCompletedFocusSession();
      const longBreakDue = state.completedInCycle >= settings.cycle;
      setMode(longBreakDue ? 'long' : 'short', { resetCycle: longBreakDue });
    } else {
      setMode('focus');
    }
    updateDisplay();
  }

  function startTicking() {
    state.running = true;
    startPauseBtn.textContent = 'Pause';
    startPauseBtn.classList.add('is-running');
    state.timerId = setInterval(tick, 1000);
  }
  function stopTicking() {
    state.running = false;
    startPauseBtn.textContent = 'Start';
    startPauseBtn.classList.remove('is-running');
    clearInterval(state.timerId);
  }

  function renderCycleDots() {
    cycleDotsEl.innerHTML = '';
    for (let i = 0; i < settings.cycle; i++) {
      const pip = document.createElement('span');
      pip.className = 'pip' + (i < state.completedInCycle ? ' filled' : '');
      cycleDotsEl.appendChild(pip);
    }
  }

  function playChime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [660, 880];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + i * 0.18 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.35);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.18);
        osc.stop(ctx.currentTime + i * 0.18 + 0.4);
      });
    } catch { /* audio unavailable */ }
  }

  // ---------- Monthly patch (heatmap) ----------
  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  function levelFor(count) {
    if (!count) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count <= 4) return 3;
    return 4;
  }

  function renderPatch() {
    const records = loadJSON(STORAGE_KEY, {});
    const { viewYear, viewMonth } = state;
    monthLabelEl.textContent = `${MONTH_NAMES[viewMonth]} ${viewYear}`;

    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    // Monday-first offset
    const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;

    patchGrid.innerHTML = '';
    let monthTotal = 0;

    for (let i = 0; i < leadingBlanks; i++) {
      const pad = document.createElement('div');
      pad.className = 'cell pad';
      patchGrid.appendChild(pad);
    }

    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(viewYear, viewMonth, day);
      const key = dateKey(d);
      const count = records[key] || 0;
      monthTotal += count;

      const cell = document.createElement('div');
      cell.className = `cell level-${levelFor(count)}`;
      if (dateKey(today) === key) cell.classList.add('is-today');
      cell.title = `${d.toDateString()}: ${count} session${count === 1 ? '' : 's'}`;
      patchGrid.appendChild(cell);
    }

    monthTotalEl.textContent = String(monthTotal);
  }

  // ---------- Event wiring ----------
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => setMode(btn.dataset.mode, { resetCycle: false }));
  });

  startPauseBtn.addEventListener('click', () => {
    if (state.running) stopTicking();
    else startTicking();
    updateDisplay();
  });

  resetBtn.addEventListener('click', () => {
    stopTicking();
    state.secondsLeft = state.totalSeconds;
    updateDisplay();
  });

  prevMonthBtn.addEventListener('click', () => {
    state.viewMonth -= 1;
    if (state.viewMonth < 0) { state.viewMonth = 11; state.viewYear -= 1; }
    renderPatch();
  });
  nextMonthBtn.addEventListener('click', () => {
    state.viewMonth += 1;
    if (state.viewMonth > 11) { state.viewMonth = 0; state.viewYear += 1; }
    renderPatch();
  });

  settingsToggle.addEventListener('click', () => {
    const isHidden = settingsPanel.hasAttribute('hidden');
    if (isHidden) settingsPanel.removeAttribute('hidden');
    else settingsPanel.setAttribute('hidden', '');
    settingsToggle.setAttribute('aria-expanded', String(isHidden));
  });

  saveSettingsBtn.addEventListener('click', () => {
    settings.focus = clamp(+focusInput.value || defaults.focus, 1, 90);
    settings.short = clamp(+shortInput.value || defaults.short, 1, 30);
    settings.long = clamp(+longInput.value || defaults.long, 1, 60);
    settings.cycle = clamp(+cycleInput.value || defaults.cycle, 2, 8);
    saveJSON(SETTINGS_KEY, settings);
    setMode(state.mode, { resetCycle: false });
    renderCycleDots();
  });

  function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }

  // ---------- Init ----------
  setMode('focus', { resetCycle: true });
  renderPatch();
})();
