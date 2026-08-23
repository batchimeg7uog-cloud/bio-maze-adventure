// RESPONSIVE DEVICE FIT ONLY.
// Adjusts only visual sizing/spacing for phones, tablets and smaller screens.
// Does not change game rules, maze data, collision, movement, tasks, scoring, lives,
// progression, 2X bonus, save/resume, timer logic or controls behavior.
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
    @media (max-width: 1180px) {
      #game-ui > .absolute.top-2 {
        top:8px!important; left:8px!important; right:8px!important;
      }
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
      #game-ui > .absolute.top-16 {
        top:72px!important; width:calc(100vw - 20px)!important; max-width:820px!important;
      }
      #game-ui > .absolute.top-16 > .hud-panel {
        padding:9px 12px!important; border-radius:18px!important;
      }
      #hud-mission-title { font-size:14px!important; }
      #hud-mission-text { font-size:12px!important; line-height:1.35!important; }
      #hud-keys, #hud-progress { font-size:14px!important; }
      #scanner-btn-container { right:18px!important; bottom:168px!important; gap:8px!important; }
      #btn-scan { width:68px!important; height:68px!important; border-radius:19px!important; }
      #d-pad { right:12px!important; bottom:12px!important; transform:scale(.86); transform-origin:bottom right; }
      #background-view-toggle { transform:scale(.88); transform-origin:bottom left; }
    }

    /* Phone landscape */
    @media (max-width: 900px) and (orientation: landscape) {
      #game-ui > .absolute.top-2 { top:4px!important; left:5px!important; right:5px!important; }
      #game-ui > .absolute.top-2 > .hud-panel { min-height:42px!important; padding:4px 7px!important; border-radius:13px!important; }
      #hud-name { font-size:8px!important; }
      #hud-level { font-size:14px!important; }
      #hud-lives, #hud-score { font-size:14px!important; }
      #bio-level-timer { font-size:9px!important; margin-left:5px!important; padding-left:5px!important; }
      #game-ui > .absolute.top-2 .flex.gap-2 { gap:4px!important; }
      #btn-inventory-top, #btn-hint, #btn-sound, #movement-speed-control {
        min-height:38px!important; min-width:38px!important; border-radius:12px!important; font-size:17px!important;
      }
      #movement-speed-control { height:38px!important; }
      #movement-speed-control button { font-size:14px!important; padding:0 5px!important; }
      #movement-speed-control span { min-width:34px!important; font-size:9px!important; }
      #btn-exit { min-height:38px!important; min-width:42px!important; width:42px!important; padding:0!important; border-radius:12px!important; }
      #btn-exit .exit-label { display:none!important; }
      #game-ui > .absolute.top-16 { top:50px!important; width:calc(100vw - 12px)!important; max-width:720px!important; }
      #game-ui > .absolute.top-16 > .hud-panel { padding:6px 9px!important; border-radius:14px!important; }
      #hud-mission-title { font-size:11px!important; }
      #hud-mission-text { font-size:10px!important; line-height:1.25!important; }
      #hud-keys, #hud-progress { font-size:11px!important; }
      #scanner-btn-container { right:8px!important; bottom:104px!important; gap:5px!important; }
      #btn-scan { width:52px!important; height:52px!important; border-radius:15px!important; }
      #d-pad { right:4px!important; bottom:3px!important; transform:scale(.66); transform-origin:bottom right; }
      #background-view-toggle { transform:scale(.70); transform-origin:bottom left; left:8px!important; bottom:8px!important; }
      #knowledge-bonus-status { top:48px!important; font-size:10px!important; padding:4px 8px!important; }
    }

    /* Phone portrait — gameplay fit only */
    @media (max-width: 600px) and (orientation: portrait) {
      #game-ui > .absolute.top-2 {
        top:4px!important; left:5px!important; right:5px!important; align-items:flex-start!important;
      }
      #game-ui > .absolute.top-2 > .hud-panel { min-height:44px!important; padding:5px 7px!important; border-radius:14px!important; }
      #hud-name { font-size:8px!important; }
      #hud-level { font-size:14px!important; }
      #hud-lives, #hud-score { font-size:14px!important; }
      #bio-level-timer { font-size:9px!important; margin-left:5px!important; padding-left:5px!important; }

      /* Keep the right-side control strip compact and on one line. */
      #game-ui > .absolute.top-2 .flex.gap-2 {
        gap:3px!important; flex-wrap:nowrap!important; justify-content:flex-end!important;
        max-width:none!important; transform:scale(.78); transform-origin:top right;
      }
      #btn-inventory-top, #btn-hint, #btn-sound, #movement-speed-control {
        min-height:36px!important; min-width:36px!important; border-radius:11px!important; font-size:15px!important;
      }
      #movement-speed-control { height:36px!important; }
      #movement-speed-control button { font-size:13px!important; padding:0 4px!important; }
      #movement-speed-control span { min-width:30px!important; font-size:8px!important; }
      #btn-exit { min-height:36px!important; min-width:36px!important; width:36px!important; padding:0!important; border-radius:11px!important; }
      #btn-exit .exit-label { display:none!important; }

      /* Mission stays directly under the compact HUD. */
      #game-ui > .absolute.top-16 { top:84px!important; width:calc(100vw - 10px)!important; }
      #game-ui > .absolute.top-16 > .hud-panel { padding:7px 8px!important; border-radius:14px!important; }
      #hud-mission-title { font-size:10px!important; }
      #hud-mission-text { font-size:9px!important; line-height:1.25!important; }
      #hud-keys, #hud-progress { font-size:10px!important; }

      /* Move only the rendered gameplay canvas upward to remove the large blank gap.
         This is a visual CSS translation only; canvas data/collision coordinates are untouched. */
      #game-ui canvas { transform:translateY(-255px)!important; transform-origin:center top!important; }

      #scanner-btn-container { right:8px!important; bottom:calc(140px + env(safe-area-inset-bottom))!important; gap:5px!important; }
      #btn-scan { width:56px!important; height:56px!important; border-radius:16px!important; }
      #d-pad { right:4px!important; bottom:calc(14px + env(safe-area-inset-bottom))!important; transform:scale(.72); transform-origin:bottom right; }
      #background-view-toggle { transform:scale(.72); transform-origin:bottom left; left:8px!important; bottom:calc(12px + env(safe-area-inset-bottom))!important; }
      #knowledge-bonus-status { top:82px!important; font-size:9px!important; padding:4px 7px!important; }
    }
  `;
  document.head.appendChild(style);
})();
