// MAZE POSITION ONLY.
// Keeps the rendered maze below the mission banner with the same minimum top clearance for every grade.
// Does not change maze data, tile size, collision, movement, tasks, scoring, controls or progression.
(() => {
  const MIN_RENDER_Y = 170;
  try {
    if (!ctx || typeof ctx.translate !== 'function' || ctx.translate.__bioMazePositionPatched) return;

    const originalTranslate = ctx.translate.bind(ctx);
    const patchedTranslate = function(x, y) {
      try {
        if (Array.isArray(map) && map.length && map[0] && typeof tileSize === 'number' && canvas) {
          const expectedX = (canvas.width - map[0].length * tileSize) / 2;
          const expectedY = Math.max(120, (canvas.height - map.length * tileSize) / 2 + 40);
          if (Math.abs(Number(x) - expectedX) < 0.75 && Math.abs(Number(y) - expectedY) < 0.75) {
            return originalTranslate(x, Math.max(Number(y), MIN_RENDER_Y));
          }
        }
      } catch (_) {}
      return originalTranslate(x, y);
    };

    patchedTranslate.__bioMazePositionPatched = true;
    ctx.translate = patchedTranslate;
  } catch (_) {}
})();
