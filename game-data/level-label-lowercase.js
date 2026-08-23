// LEVEL LABEL TEXT ONLY.
// Replaces the visible HUD abbreviation "LVL" with lowercase "level".
// No game rules, logic, scoring, progression, tasks, controls or layout are changed.
(() => {
  const apply = () => {
    const el = document.getElementById('hud-level');
    if (!el) return;
    const txt = String(el.textContent || '').trim();
    const m = txt.match(/^(?:LVL|level)\s*(\d+)$/i);
    if (!m) return;
    const next = `level ${m[1]}`;
    if (txt !== next) el.textContent = next;
  };

  apply();
  const target = document.getElementById('hud-level');
  if (target) {
    new MutationObserver(apply).observe(target, { childList: true, subtree: true, characterData: true });
  }
})();
