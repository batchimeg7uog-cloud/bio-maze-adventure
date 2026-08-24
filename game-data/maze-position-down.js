// RESPONSIVE MAZE FIT ONLY.
// Fits the rendered maze for grades 6–11 into the available viewport using one shared rule.
// Does not change maze data, tile data, collision, player movement, items, questions,
// scoring, lives, timer, progression, controls behavior or any gameplay mechanics.
(() => {
  const MAX_UPSCALE = 1.18;
  const EDGE_GAP_PX = 12;

  try {
    if (!ctx || typeof ctx.translate !== 'function' || ctx.translate.__bioMazePositionPatched) return;

    const originalTranslate = ctx.translate.bind(ctx);
    const nativeScale = CanvasRenderingContext2D.prototype.scale;

    const viewportHeight = () => {
      try {
        return Math.max(1, window.visualViewport ? window.visualViewport.height : window.innerHeight);
      } catch (_) {
        return Math.max(1, window.innerHeight || 1);
      }
    };

    const cssSafeBottom = () => {
      const w = Math.max(1, window.innerWidth || 1);
      const h = viewportHeight();
      if (w <= 600) return h > w ? 126 : 82;
      if (w <= 900) return 72;
      return 18;
    };

    const getMissionBottom = () => {
      try {
        const missionText = document.getElementById('hud-mission-text');
        const missionPanel = missionText ? missionText.closest('.hud-panel') : null;
        if (missionPanel) return missionPanel.getBoundingClientRect().bottom;

        const missionWrap = document.querySelector('#game-ui > .absolute.top-16');
        if (missionWrap) return missionWrap.getBoundingClientRect().bottom;
      } catch (_) {}
      return 150;
    };

    const patchedTranslate = function(x, y) {
      try {
        if (
          Array.isArray(map) && map.length && map[0] &&
          typeof tileSize === 'number' && tileSize > 0 &&
          canvas && canvas.width > 0 && canvas.height > 0
        ) {
          const rows = map.length;
          const cols = map[0].length;
          const mazeWidth = cols * tileSize;
          const mazeHeight = rows * tileSize;
          const expectedX = (canvas.width - mazeWidth) / 2;
          const expectedY = Math.max(120, (canvas.height - mazeHeight) / 2 + 40);

          // Patch only the renderer's single centered maze transform.
          if (Math.abs(Number(x) - expectedX) < 0.75 && Math.abs(Number(y) - expectedY) < 0.75) {
            const cssWidth = Math.max(1, canvas.clientWidth || window.innerWidth || 1);
            const cssHeight = Math.max(1, canvas.clientHeight || viewportHeight());
            const ratioX = canvas.width / cssWidth;
            const ratioY = canvas.height / cssHeight;

            const vw = Math.max(1, window.innerWidth || cssWidth);
            const vh = viewportHeight();
            const horizontalGap = vw <= 600 ? 10 : (vw <= 900 ? 14 : 24);
            const topCss = Math.max(0, getMissionBottom() + EDGE_GAP_PX);
            const bottomCss = Math.max(topCss + 1, vh - cssSafeBottom());

            const leftCanvas = horizontalGap * ratioX;
            const rightCanvas = horizontalGap * ratioX;
            const topCanvas = topCss * ratioY;
            const bottomCanvas = bottomCss * ratioY;

            const availableWidth = Math.max(1, canvas.width - leftCanvas - rightCanvas);
            const availableHeight = Math.max(1, bottomCanvas - topCanvas);
            const fitScale = Math.max(
              0.1,
              Math.min(
                MAX_UPSCALE,
                availableWidth / mazeWidth,
                availableHeight / mazeHeight
              )
            );

            const scaledWidth = mazeWidth * fitScale;
            const scaledHeight = mazeHeight * fitScale;
            const renderX = leftCanvas + Math.max(0, (availableWidth - scaledWidth) / 2);
            const renderY = topCanvas + Math.max(0, (availableHeight - scaledHeight) / 2);

            originalTranslate(renderX, renderY);
            if (Math.abs(fitScale - 1) > 0.001) {
              nativeScale.call(ctx, fitScale, fitScale);
            }
            return;
          }
        }
      } catch (_) {}

      return originalTranslate(x, y);
    };

    patchedTranslate.__bioMazePositionPatched = true;
    ctx.translate = patchedTranslate;
  } catch (_) {}
})();
