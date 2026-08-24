// RESPONSIVE DEVICE FIT ONLY.
// Adjusts only visual sizing/spacing for phones, tablets and smaller screens.
// Maze fitting itself is handled by maze-position-down.js with one shared viewport rule.
// No gameplay/data/mechanics are changed here.
(() => {
  const STYLE_ID = 'bio-responsive-device-fit';
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    html, body {
      width:100%;
      max-width:100%;
      min-height:100%;
      margin:0;
    }
    #game-ui {
      width:100%;
      max-width:100%;
      height:100vh;
      min-height:100vh;
      box-sizing:border-box;
    }
    @supports (height: 100dvh) {
      #game-ui { height:100dvh; min-height:100dvh; }
    }
    #game-ui *, #game-ui *::before, #game-ui *::after { box-sizing:border-box; }
    button, .d-btn, #btn-scan {
      touch-action:manipulation;
      -webkit-tap-highlight-color:transparent;
    }

    /* Tablet / compact notebook: size only, preserve current design. */
    @media (max-width:1180px) and (min-width:601px) {
      #game-ui > .absolute.top-2 {
        top:8px!important;
        left:8px!important;
        right:8px!important;
        max-width:calc(100% - 16px)!important;
      }
      #game-ui > .absolute.top-2 > .hud-panel {
        min-width:0!important;
        min-height:52px!important;
        padding:7px 10px!important;
        border-radius:17px!important;
      }
      #hud-name { font-size:10px!important; }
      #hud-level { font-size:17px!important; }
      #hud-lives, #hud-score { font-size:17px!important; }
      #bio-level-timer {
        font-size:11px!important;
        margin-left:8px!important;
        padding-left:8px!important;
        gap:4px!important;
      }
      #game-ui > .absolute.top-2 .flex.gap-2 {
        min-width:0!important;
        gap:6px!important;
        flex-wrap:nowrap!important;
      }
      #btn-inventory-top, #btn-hint, #btn-sound {
        width:46px!important;
        min-width:46px!important;
        height:46px!important;
        min-height:46px!important;
        border-radius:15px!important;
      }
      #movement-speed-control {
        height:46px!important;
        min-height:46px!important;
        min-width:106px!important;
        border-radius:15px!important;
      }
      #movement-speed-control button { font-size:17px!important; padding:0 6px!important; }
      #movement-speed-control span { min-width:38px!important; font-size:11px!important; }
      #btn-exit {
        min-height:46px!important;
        min-width:88px!important;
        padding:7px 9px!important;
        border-radius:15px!important;
      }
      #btn-exit .exit-label { font-size:9px!important; }

      #game-ui > .absolute.top-16 {
        top:70px!important;
        width:calc(100% - 20px)!important;
        max-width:min(820px, calc(100% - 20px))!important;
      }
      #game-ui > .absolute.top-16 > .hud-panel {
        width:100%!important;
        padding:9px 12px!important;
        border-radius:18px!important;
      }
      #hud-mission-title { font-size:14px!important; }
      #hud-mission-text { font-size:12px!important; line-height:1.35!important; }
      #hud-keys, #hud-progress { font-size:14px!important; }

      #scanner-btn-container { right:14px!important; bottom:158px!important; gap:8px!important; }
      #btn-scan { width:64px!important; height:64px!important; border-radius:18px!important; }
      #d-pad {
        right:10px!important;
        bottom:10px!important;
        transform:scale(.82)!important;
        transform-origin:bottom right!important;
      }
      #background-view-toggle {
        left:10px!important;
        bottom:10px!important;
        transform:scale(.86)!important;
        transform-origin:bottom left!important;
      }
    }

    /* Phone portrait: readable two-row HUD, no transforms on the canvas. */
    @media (max-width:600px) and (orientation:portrait) {
      #game-ui > .absolute.top-2 {
        top:6px!important;
        left:8px!important;
        right:8px!important;
        width:auto!important;
        max-width:calc(100% - 16px)!important;
        display:flex!important;
        flex-direction:column!important;
        align-items:stretch!important;
        gap:6px!important;
      }
      #game-ui > .absolute.top-2 > .hud-panel {
        width:100%!important;
        min-width:0!important;
        min-height:58px!important;
        padding:7px 10px!important;
        border-radius:16px!important;
      }
      #hud-name { font-size:10px!important; line-height:1.1!important; }
      #hud-level { font-size:18px!important; line-height:1.05!important; }
      #hud-lives, #hud-score { font-size:18px!important; }
      #bio-level-timer {
        font-size:11px!important;
        margin-left:7px!important;
        padding-left:7px!important;
        gap:4px!important;
        white-space:nowrap!important;
      }

      #game-ui > .absolute.top-2 .flex.gap-2 {
        width:100%!important;
        min-width:0!important;
        max-width:100%!important;
        display:flex!important;
        flex-wrap:nowrap!important;
        justify-content:center!important;
        align-items:center!important;
        gap:5px!important;
        transform:none!important;
      }
      #btn-inventory-top, #btn-hint, #btn-sound {
        width:42px!important;
        min-width:42px!important;
        height:42px!important;
        min-height:42px!important;
        padding:0!important;
        border-radius:13px!important;
        font-size:18px!important;
      }
      #movement-speed-control {
        width:108px!important;
        min-width:108px!important;
        height:42px!important;
        min-height:42px!important;
        border-radius:13px!important;
      }
      #movement-speed-control button { font-size:15px!important; padding:0 6px!important; }
      #movement-speed-control span { min-width:38px!important; font-size:10px!important; }
      #btn-exit {
        width:42px!important;
        min-width:42px!important;
        height:42px!important;
        min-height:42px!important;
        padding:0!important;
        border-radius:13px!important;
      }
      #btn-exit .exit-label { display:none!important; }

      #game-ui > .absolute.top-16 {
        top:116px!important;
        left:8px!important;
        right:8px!important;
        width:auto!important;
        max-width:calc(100% - 16px)!important;
        transform:none!important;
      }
      #game-ui > .absolute.top-16 > .hud-panel {
        width:100%!important;
        min-width:0!important;
        padding:9px 10px!important;
        border-radius:16px!important;
      }
      #hud-mission-title { font-size:13px!important; line-height:1.2!important; }
      #hud-mission-text {
        min-width:0!important;
        max-width:100%!important;
        font-size:12px!important;
        line-height:1.35!important;
        overflow-wrap:anywhere!important;
      }
      #hud-keys, #hud-progress { font-size:12px!important; white-space:nowrap!important; }

      /* Critical reset: the maze renderer now handles fit; CSS must not move/scale canvas. */
      #game-ui canvas {
        max-width:100%!important;
        max-height:100%!important;
        transform:none!important;
      }

      #scanner-btn-container {
        right:8px!important;
        bottom:calc(154px + env(safe-area-inset-bottom, 0px))!important;
        gap:6px!important;
      }
      #btn-scan { width:58px!important; height:58px!important; border-radius:17px!important; }
      #d-pad {
        right:6px!important;
        bottom:calc(12px + env(safe-area-inset-bottom, 0px))!important;
        transform:scale(.78)!important;
        transform-origin:bottom right!important;
      }
      #background-view-toggle {
        left:8px!important;
        bottom:calc(12px + env(safe-area-inset-bottom, 0px))!important;
        transform:scale(.78)!important;
        transform-origin:bottom left!important;
      }
      #knowledge-bonus-status {
        top:172px!important;
        max-width:calc(100% - 20px)!important;
        font-size:11px!important;
        padding:5px 9px!important;
      }

      /* Start screen only: keep the current form/card sizes and allow natural vertical access. */
      body.bio-mobile-start-scroll {
        height:auto!important;
        min-height:100dvh!important;
        overflow-x:hidden!important;
        overflow-y:auto!important;
        -webkit-overflow-scrolling:touch;
      }
      body.bio-mobile-start-scroll [data-bio-mobile-start-scroll] {
        max-height:none!important;
        overflow-x:hidden!important;
        padding-bottom:calc(32px + env(safe-area-inset-bottom, 0px))!important;
        -webkit-overflow-scrolling:touch;
      }
      body.bio-mobile-start-scroll [data-bio-mobile-start-scroll]:not([data-bio-start-fixed="1"]) {
        height:auto!important;
        min-height:100dvh!important;
        overflow-y:visible!important;
      }
      body.bio-mobile-start-scroll [data-bio-mobile-start-scroll][data-bio-start-fixed="1"] {
        height:100dvh!important;
        min-height:100dvh!important;
        max-height:100dvh!important;
        overflow-y:auto!important;
      }
    }

    /* Phone landscape: compact but readable; canvas remains untransformed. */
    @media (max-width:900px) and (orientation:landscape) {
      #game-ui > .absolute.top-2 {
        top:4px!important;
        left:6px!important;
        right:6px!important;
        max-width:calc(100% - 12px)!important;
      }
      #game-ui > .absolute.top-2 > .hud-panel {
        min-width:0!important;
        min-height:42px!important;
        padding:5px 8px!important;
        border-radius:13px!important;
      }
      #hud-name { font-size:9px!important; }
      #hud-level { font-size:15px!important; }
      #hud-lives, #hud-score { font-size:15px!important; }
      #bio-level-timer {
        font-size:10px!important;
        margin-left:6px!important;
        padding-left:6px!important;
      }
      #game-ui > .absolute.top-2 .flex.gap-2 {
        min-width:0!important;
        gap:4px!important;
        flex-wrap:nowrap!important;
        transform:none!important;
      }
      #btn-inventory-top, #btn-hint, #btn-sound {
        width:40px!important;
        min-width:40px!important;
        height:40px!important;
        min-height:40px!important;
        border-radius:12px!important;
      }
      #movement-speed-control {
        height:40px!important;
        min-height:40px!important;
        min-width:98px!important;
        border-radius:12px!important;
      }
      #movement-speed-control button { font-size:14px!important; padding:0 5px!important; }
      #movement-speed-control span { min-width:34px!important; font-size:10px!important; }
      #btn-exit {
        width:40px!important;
        min-width:40px!important;
        height:40px!important;
        min-height:40px!important;
        padding:0!important;
        border-radius:12px!important;
      }
      #btn-exit .exit-label { display:none!important; }

      #game-ui > .absolute.top-16 {
        top:50px!important;
        width:calc(100% - 12px)!important;
        max-width:min(760px, calc(100% - 12px))!important;
      }
      #game-ui > .absolute.top-16 > .hud-panel { padding:7px 10px!important; border-radius:14px!important; }
      #hud-mission-title { font-size:12px!important; }
      #hud-mission-text { font-size:11px!important; line-height:1.3!important; overflow-wrap:anywhere!important; }
      #hud-keys, #hud-progress { font-size:11px!important; }
      #game-ui canvas { max-width:100%!important; max-height:100%!important; transform:none!important; }

      #scanner-btn-container { right:8px!important; bottom:104px!important; gap:5px!important; }
      #btn-scan { width:52px!important; height:52px!important; border-radius:15px!important; }
      #d-pad {
        right:5px!important;
        bottom:5px!important;
        transform:scale(.68)!important;
        transform-origin:bottom right!important;
      }
      #background-view-toggle {
        left:8px!important;
        bottom:8px!important;
        transform:scale(.70)!important;
        transform-origin:bottom left!important;
      }
      #knowledge-bonus-status { top:52px!important; font-size:10px!important; padding:4px 8px!important; }
    }
  `;
  document.head.appendChild(style);

  // Start-screen scroll marker only. It is active only while the visible Start button exists on phone portrait.
  const clearStartScrollMarker = () => {
    document.body && document.body.classList.remove('bio-mobile-start-scroll');
    document.querySelectorAll('[data-bio-mobile-start-scroll]').forEach((el) => {
      el.removeAttribute('data-bio-mobile-start-scroll');
      el.removeAttribute('data-bio-start-fixed');
    });
  };

  const findVisibleStartButton = () => {
    const candidates = document.querySelectorAll('button,[role="button"]');
    for (const el of candidates) {
      const text = String(el.textContent || '').replace(/\s+/g, ' ').trim().toUpperCase();
      if (!text.includes('ТОГЛООМ ЭХЛҮҮЛЭХ')) continue;
      const cs = getComputedStyle(el);
      if (cs.display !== 'none' && cs.visibility !== 'hidden' && el.getClientRects().length) return el;
    }
    return null;
  };

  const findStartRoot = (button) => {
    const explicit = button.closest('#start-screen,.start-screen,[data-screen="start"],[data-view="start"]');
    if (explicit) return explicit;

    let node = button.parentElement;
    let best = node;
    const vw = Math.max(1, window.innerWidth || 1);
    while (node && node !== document.body) {
      const rect = node.getBoundingClientRect();
      if (rect.width >= vw * 0.82) best = node;
      node = node.parentElement;
    }
    return best || button.parentElement;
  };

  const syncMobileStartScroll = () => {
    clearStartScrollMarker();
    if (!window.matchMedia('(max-width:600px) and (orientation:portrait)').matches) return;

    const button = findVisibleStartButton();
    if (!button || !document.body) return;

    const root = findStartRoot(button);
    if (!root) return;

    root.setAttribute('data-bio-mobile-start-scroll', '1');
    const position = getComputedStyle(root).position;
    if (position === 'fixed' || position === 'absolute') {
      root.setAttribute('data-bio-start-fixed', '1');
    }
    document.body.classList.add('bio-mobile-start-scroll');
  };

  let startScrollRaf = 0;
  const scheduleStartScrollSync = () => {
    if (startScrollRaf) cancelAnimationFrame(startScrollRaf);
    startScrollRaf = requestAnimationFrame(() => {
      startScrollRaf = 0;
      syncMobileStartScroll();
    });
  };

  scheduleStartScrollSync();
  window.addEventListener('resize', scheduleStartScrollSync, {passive:true});
  window.addEventListener('orientationchange', scheduleStartScrollSync, {passive:true});
  if (document.body) {
    new MutationObserver(scheduleStartScrollSync).observe(document.body, {childList:true, subtree:true});
  }
})();
