// GRADE 6 MAZE VISUAL SIZE ONLY.
// Reliably enlarges only the rendered grade 6 maze so it visually matches grades 7–11 more closely.
// Does not change maze data, tile data, collision, movement, tasks, scoring, controls or progression.
(() => {
  const SCALE = 1.18;

  const isGrade6Now = () => {
    try {
      if (typeof state !== 'undefined' && state) {
        if (String(state.grade) === '6') return true;
        // Internal grade mapping: grade 6 uses base state.level === 1.
        if (Number(state.level) === 1) return true;
      }
      const title = document.getElementById('hud-mission-title');
      const text = title ? String(title.textContent || '') : '';
      return /6\s*-?\s*Р\s*АНГИ/i.test(text);
    } catch (_) {
      return false;
    }
  };

  try {
    if (typeof draw !== 'function' || draw.__bioGrade6VisualScaleWrapped) return;

    const originalDraw = draw;
    const wrappedDraw = function(...args) {
      if (!isGrade6Now() || !Array.isArray(map) || !map.length || !map[0] || typeof tileSize !== 'number' || !canvas || !ctx) {
        return originalDraw.apply(this, args);
      }

      const mazeWidth = map[0].length * tileSize;
      const mazeHeight = map.length * tileSize;
      const baseY = Math.max(170, (canvas.height - mazeHeight) / 2 + 40);
      const pivotX = canvas.width / 2;
      const pivotY = baseY + mazeHeight / 2;

      ctx.save();
      ctx.translate(pivotX, pivotY);
      ctx.scale(SCALE, SCALE);
      ctx.translate(-pivotX, -pivotY);
      try {
        return originalDraw.apply(this, args);
      } finally {
        ctx.restore();
      }
    };

    wrappedDraw.__bioGrade6VisualScaleWrapped = true;
    draw = wrappedDraw;
  } catch (_) {}
})();
