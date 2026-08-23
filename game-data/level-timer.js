// LEVEL TIMER ONLY.
// Adds a small elapsed-time display for the current learner Level.
// Counts only while state.isPlaying is true and resets when the learner Level/task changes.
// No game rules, scoring, movement, tasks, lives, bonus, save/resume or progression are changed.
(() => {
  const TIMER_ID = 'bio-level-timer';
  let levelKey = '';
  let elapsedMs = 0;
  let lastTick = performance.now();

  const formatTime = (ms) => {
    const total = Math.floor(Math.max(0, ms) / 1000);
    const min = Math.floor(total / 60);
    const sec = total % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const getLevelKey = () => {
    try {
      return `${state.grade || ''}|${state.topic || ''}|${state.gradeLevel || 1}|${state.taskIndex || 0}`;
    } catch (_) {
      return '';
    }
  };

  const ensureTimer = () => {
    let timer = document.getElementById(TIMER_ID);
    if (timer) return timer;

    const levelEl = document.getElementById('hud-level');
    const panel = levelEl ? levelEl.closest('.hud-panel') : null;
    if (!panel) return null;

    const wrap = document.createElement('div');
    wrap.id = TIMER_ID;
    wrap.setAttribute('aria-label', 'Түвшний хугацаа');
    wrap.title = 'Одоогийн Level дээр өнгөрсөн хугацаа';
    wrap.style.cssText = [
      'display:flex','align-items:center','gap:6px','margin-left:12px','padding-left:12px',
      'border-left:1px solid rgba(148,163,184,.28)','color:#cbd5e1','font-weight:900',
      'font-size:13px','line-height:1','white-space:nowrap','font-variant-numeric:tabular-nums'
    ].join(';');
    wrap.innerHTML = '<span aria-hidden="true">⏱️</span><span id="bio-level-timer-value">00:00</span>';

    const scoreEl = document.getElementById('hud-score');
    const scoreGroup = scoreEl ? scoreEl.parentElement : null;
    if (scoreGroup && scoreGroup.parentElement) {
      scoreGroup.parentElement.appendChild(wrap);
    } else {
      panel.appendChild(wrap);
    }
    return wrap;
  };

  const updateDisplay = () => {
    const timer = ensureTimer();
    if (!timer) return;
    const value = document.getElementById('bio-level-timer-value');
    if (value) value.textContent = formatTime(elapsedMs);
  };

  const tick = (now) => {
    const key = getLevelKey();
    if (key && key !== levelKey) {
      levelKey = key;
      elapsedMs = 0;
      lastTick = now;
    }

    try {
      if (state && state.isPlaying && levelKey) {
        elapsedMs += Math.max(0, now - lastTick);
      }
    } catch (_) {}

    lastTick = now;
    updateDisplay();
    requestAnimationFrame(tick);
  };

  ensureTimer();
  requestAnimationFrame(tick);
})();
