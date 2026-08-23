// RESPONSIVE DEVICE FIT ONLY.
// Rebuilds phone/tablet visual sizing and spacing without changing game structure or logic.
// No maze data, collision, movement, tasks, scoring, lives, progression, 2X bonus,
// save/resume, timer logic or control behavior is changed.
(() => {
  const STYLE_ID = 'bio-responsive-device-fit';
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    html, body { width:100%; min-height:100%; overflow:hidden; }
    #game-ui { width:100%; height:100%; }
    button, .d-btn, #btn-scan { touch-action:manipulation; -webkit-tap-highlight-color:transparent; }

    /* Tablet / compact laptop */
    @media (max-width:1180px) and (min-width:601px) {
      #game-ui > .absolute.top-2 { top:8px!important; left:8px!important; right:8px!important; }
      #game-ui > .absolute.top-2 > .hud-panel {
        min-height:54px!important; padding:7px 10px!important; border-radius:17px!important;
      }
      #hud-name { font-size:10px!important; }
      #hud-level { font-size:17px!important; }
      #hud-lives, #hud-score { font-size:17px!important; }
      #bio-level-timer { font-size:11px!important; margin-left:8px!important; padding-left:8px!important; gap:4px!important; }
      #game-ui > .absolute.top-2 .flex.gap-2 { gap:6px!important; }
      #btn-inventory-top, #btn-hint, #btn-sound, #movement-speed-control {
        min-height:46px!important; min-width:46px!important; border-radius:15px!important;
      }
      #movement-speed-control { height:46px!important; }
      #movement-speed-control button { font-size:17px!important; padding:0 7px!important; }
      #movement-speed-control span { min-width:40px!important; font-size:11px!important; }
      #btn-exit { min-height:46px!important; min-width:100px!important; padding:7px 9px!important; border-radius:15px!important; }
      #btn-exit .exit-label { font-size:9px!important; }
      #game-ui > .absolute.top-16 { top:72px!important; width:calc(100vw - 20px)!important; max-width:820px!important; }
      #game-ui > .absolute.top-16 > .hud-panel { padding:9px 12px!important; border-radius:18px!important; }
      #hud-mission-title { font-size:14px!important; }
      #hud-mission-text { font-size:12px!important; line-height:1.35!important; }
      #hud-keys, #hud-progress { font-size:14px!important; }
      #scanner-btn-container { right:18px!important; bottom:168px!important; gap:8px!important; }
      #btn-scan { width:68px!important; height:68px!important; border-radius:19px!important; }
      #d-pad { right:12px!important; bottom:12px!important; transform:scale(.86); transform-origin:bottom right; }
      #background-view-toggle { transform:scale(.88); transform-origin:bottom left; }
    }

    /* Phone portrait: rebuild layout from a clean baseline. */
    @media (max-width:600px) and (orientation:portrait) {
      #game-ui > .absolute.top-2 {
        top:6px!important; left:8px!important; right:8px!important;
        display:flex!important; flex-direction:column!important; align-items:stretch!important; gap:6px!important;
      }

      /* Player / level / lives / score / timer: readable first row. */
      #game-ui > .absolute.top-2 > .hud-panel {
        width:100%!important; min-height:58px!important; padding:7px 10px!important;
        border-radius:16px!important; box-sizing:border-box!important;
      }
      #hud-name { font-size:10px!important; line-height:1.1!important; }
      #hud-level { font-size:18px!important; line-height:1.05!important; }
      #hud-lives, #hud-score { font-size:18px!important; }
      #bio-level-timer {
        font-size:11px!important; margin-left:8px!important; padding-left:8px!important;
        gap:4px!important; white-space:nowrap!important;
      }

      /* Controls: own row, no overlap, no whole-row scaling. */
      #game-ui > .absolute.top-2 .flex.gap-2 {
        width:100%!important; max-width:none!important; display:flex!important;
        flex-wrap:nowrap!important; justify-content:center!important; align-items:center!important;
        gap:6px!important; transform:none!important;
      }
      #btn-inventory-top, #btn-hint, #btn-sound {
        width:44px!important; min-width:44px!important; height:44px!important; min-height:44px!important;
        padding:0!important; border-radius:13px!important; font-size:18px!important;
      }
      #movement-speed-control {
        height:44px!important; min-height:44px!important; min-width:112px!important;
        border-radius:13px!important;
      }
      #movement-speed-control button { font-size:16px!important; padding:0 7px!important; }
      #movement-speed-control span { min-width:42px!important; font-size:11px!important; }
      #btn-exit {
        width:44px!important; min-width:44px!important; height:44px!important; min-height:44px!important;
        padding:0!important; border-radius:13px!important;
      }
      #btn-exit .exit-label { display:none!important; }

      /* Mission panel: full width, readable, below both HUD rows. */
      #game-ui > .absolute.top-16 {
        top:118px!important; width:calc(100vw - 16px)!important; max-width:none!important;
        left:8px!important; right:8px!important; transform:none!important;
      }
      #game-ui > .absolute.top-16 > .hud-panel {
        width:100%!important; padding:10px 11px!important; border-radius:16px!important;
        box-sizing:border-box!important;
      }
      #hud-mission-title { font-size:13px!important; line-height:1.2!important; }
      #hud-mission-text { font-size:12px!important; line-height:1.4!important; }
      #hud-keys, #hud-progress { font-size:12px!important; }

      /* Maze visual only: remove the previous aggressive offset and use one controlled offset. */
      #game-ui canvas {
        transform:translateY(-285px)!important;
        transform-origin:center top!important;
      }

      /* Touch controls kept clear of mobile browser safe areas. */
      #scanner-btn-container {
        right:10px!important; bottom:calc(188px + env(safe-area-inset-bottom))!important; gap:6px!important;
      }
      #btn-scan { width:62px!important; height:62px!important; border-radius:17px!important; }
      #d-pad {
        right:8px!important; bottom:calc(18px + env(safe-area-inset-bottom))!important;
        transform:scale(.86)!important; transform-origin:bottom right!important;
      }
      #background-view-toggle {
        left:10px!important; bottom:calc(16px + env(safe-area-inset-bottom))!important;
        transform:scale(.82)!important; transform-origin:bottom left!important;
      }
      #knowledge-bonus-status { top:174px!important; font-size:11px!important; padding:5px 9px!important; }
    }

    /* Phone landscape: readable, compact, single-line HUD. */
    @media (max-width:900px) and (orientation:landscape) {
      #game-ui > .absolute.top-2 { top:4px!important; left:6px!important; right:6px!important; }
      #game-ui > .absolute.top-2 > .hud-panel { min-height:44px!important; padding:5px 8px!important; border-radius:13px!important; }
      #hud-name { font-size:9px!important; }
      #hud-level { font-size:15px!important; }
      #hud-lives, #hud-score { font-size:15px!important; }
      #bio-level-timer { font-size:10px!important; margin-left:6px!important; padding-left:6px!important; }
      #game-ui > .absolute.top-2 .flex.gap-2 { gap:4px!important; flex-wrap:nowrap!important; transform:none!important; }
      #btn-inventory-top, #btn-hint, #btn-sound {
        width:40px!important; min-width:40px!important; height:40px!important; min-height:40px!important; border-radius:12px!important;
      }
      #movement-speed-control { height:40px!important; min-width:102px!important; border-radius:12px!important; }
      #movement-speed-control button { font-size:14px!important; padding:0 5px!important; }
      #movement-speed-control span { min-width:36px!important; font-size:10px!important; }
      #btn-exit { width:40px!important; min-width:40px!important; height:40px!important; min-height:40px!important; padding:0!important; border-radius:12px!important; }
      #btn-exit .exit-label { display:none!important; }
      #game-ui > .absolute.top-16 { top:52px!important; width:calc(100vw - 12px)!important; max-width:760px!important; }
      #game-ui > .absolute.top-16 > .hud-panel { padding:7px 10px!important; border-radius:14px!important; }
      #hud-mission-title { font-size:12px!important; }
      #hud-mission-text { font-size:11px!important; line-height:1.3!important; }
      #hud-keys, #hud-progress { font-size:11px!important; }
      #scanner-btn-container { right:8px!important; bottom:112px!important; gap:5px!important; }
      #btn-scan { width:54px!important; height:54px!important; border-radius:15px!important; }
      #d-pad { right:5px!important; bottom:5px!important; transform:scale(.72)!important; transform-origin:bottom right!important; }
      #background-view-toggle { left:8px!important; bottom:8px!important; transform:scale(.74)!important; transform-origin:bottom left!important; }
      #knowledge-bonus-status { top:54px!important; font-size:10px!important; padding:4px 8px!important; }
    }
  `;
  document.head.appendChild(style);
})();
