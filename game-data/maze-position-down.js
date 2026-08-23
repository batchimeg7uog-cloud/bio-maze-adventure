// MAZE POSITION + GRADE 6 VISUAL SIZE ONLY.
// Keeps every maze below the mission banner, and enlarges only grade 6 visually.
// Does not change maze data, tile size, collision, movement, tasks, scoring, controls or progression.
(() => {
  const MIN_RENDER_Y = 170;
  const GRADE6_SCALE = 1.18;
  try {
    if (!ctx || typeof ctx.translate !== 'function' || ctx.translate.__bioMazePositionPatched) return;

    const originalTranslate = ctx.translate.bind(ctx);
    const nativeScale = CanvasRenderingContext2D.prototype.scale;

    const isGrade6 = () => {
      try {
        if (typeof state !== 'undefined' && state) {
          if (String(state.grade) === '6') return true;
          if (Number(state.level) === 1) return true;
        }
      } catch (_) {}
      return false;
    };

    const patchedTranslate = function(x, y) {
      try {
        if (Array.isArray(map) && map.length && map[0] && typeof tileSize === 'number' && canvas) {
          const mazeWidth = map[0].length * tileSize;
          const expectedX = (canvas.width - mazeWidth) / 2;
          const expectedY = Math.max(120, (canvas.height - map.length * tileSize) / 2 + 40);

          if (Math.abs(Number(x) - expectedX) < 0.75 && Math.abs(Number(y) - expectedY) < 0.75) {
            const renderY = Math.max(Number(y), MIN_RENDER_Y);

            if (isGrade6()) {
              const scaledWidth = mazeWidth * GRADE6_SCALE;
              const renderX = (canvas.width - scaledWidth) / 2;
              originalTranslate(renderX, renderY);
              nativeScale.call(ctx, GRADE6_SCALE, GRADE6_SCALE);
              return;
            }

            return originalTranslate(x, renderY);
          }
        }
      } catch (_) {}
      return originalTranslate(x, y);
    };

    patchedTranslate.__bioMazePositionPatched = true;
    ctx.translate = patchedTranslate;
  } catch (_) {}
})();
