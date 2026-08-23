// GRADE 6 MAZE VISUAL SIZE ONLY.
// Makes only grade 6's rendered maze visually closer in size to grades 7–11.
// Does not change maze data, tile data, collision, movement, tasks, scoring, controls or progression.
(() => {
  const SCALE = 1.18;
  try {
    if (!ctx || typeof ctx.translate !== 'function' || ctx.translate.__bioGrade6VisualScalePatched) return;

    const currentTranslate = ctx.translate.bind(ctx);
    const nativeTranslate = CanvasRenderingContext2D.prototype.translate;
    const nativeScale = CanvasRenderingContext2D.prototype.scale;

    const isGrade6Now = () => {
      try {
        if (typeof state !== 'undefined' && state) {
          if (String(state.grade) === '6') return true;
          if (Number(state.level) === 1) return true;
        }
        const title = document.getElementById('hud-mission-title');
        const text = title ? String(title.textContent || '') : '';
        return /6\s*-?\s*Р\s*АНГИ/i.test(text);
      } catch (_) {
        return false;
      }
    };

    const patchedTranslate = function(x, y) {
      try {
        if (isGrade6Now() && Array.isArray(map) && map.length && map[0] && typeof tileSize === 'number' && canvas) {
          const mazeWidth = map[0].length * tileSize;
          const expectedX = (canvas.width - mazeWidth) / 2;

          // The maze renderer is the centered translate call. Match by X only because
          // the Y value can be changed by the separate visual-position patch.
          if (Math.abs(Number(x) - expectedX) < 0.75 && Number(y) > 80) {
            currentTranslate(x, y);
            nativeTranslate.call(ctx, -(mazeWidth * (SCALE - 1)) / 2, 0);
            nativeScale.call(ctx, SCALE, SCALE);
            return;
          }
        }
      } catch (_) {}
      return currentTranslate(x, y);
    };

    patchedTranslate.__bioGrade6VisualScalePatched = true;
    ctx.translate = patchedTranslate;
  } catch (_) {}
})();
