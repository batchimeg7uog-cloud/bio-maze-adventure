// MAZE POSITION ONLY.
// Moves only the rendered maze group slightly downward so it no longer overlaps the mission banner.
// Does not change maze data, tile size, collision, movement, tasks, scoring, controls or progression.
(() => {
  const SHIFT_Y = 26;
  try {
    if (!ctx || typeof ctx.translate !== 'function' || ctx.translate.__bioMazePositionPatched) return;

    const originalTranslate = ctx.translate.bind(ctx);
    const patchedTranslate = function(x, y) {
      try {
        if (Array.isArray(map) && map.length && map[0] && typeof tileSize === 'number' && canvas) {
          const expectedX = (canvas.width - map[0].length * tileSize) / 2;
          const expectedY = Math.max(120, (canvas.height - map.length * tileSize) / 2 + 40);
          if (Math.abs(Number(x) - expectedX) < 0.75 && Math.abs(Number(y) - expectedY) < 0.75) {
            return originalTranslate(x, y + SHIFT_Y);
          }
        }
      } catch (_) {}
      return originalTranslate(x, y);
    };

    patchedTranslate.__bioMazePositionPatched = true;
    ctx.translate = patchedTranslate;
  } catch (_) {}
})();
