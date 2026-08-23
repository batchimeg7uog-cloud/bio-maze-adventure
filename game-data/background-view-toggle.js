// BACKGROUND VIEW TOGGLE ONLY.
// Adds a dark/white base-background viewing control. No game rules, task data,
// scoring, movement, maze geometry/tiles, icons, progression, audio or save logic are changed.
(() => {
  const STYLE_ID = 'bio-background-view-toggle-style';
  const BUTTON_ID = 'bio-background-view-toggle';
  const STORAGE_KEY = 'bioMazeBackgroundViewV1';
  const WHITE_BG = '#f8fafc';

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      html.bio-bg-white,
      html.bio-bg-white body{background:${WHITE_BG}!important;}
      html.bio-bg-white .overlay{background:rgba(248,250,252,.96)!important;}

      #${BUTTON_ID}{
        position:fixed;left:18px;bottom:18px;z-index:10080;
        width:50px;height:50px;padding:0;border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        background:rgba(6,19,28,.94);border:1px solid rgba(125,211,252,.38);
        box-shadow:0 10px 24px rgba(0,0,0,.30),inset 0 1px 0 rgba(255,255,255,.10);
        color:#fff;font-size:22px;cursor:pointer;user-select:none;
        transition:transform .15s ease,box-shadow .15s ease;
        pointer-events:auto;
      }
      #${BUTTON_ID}:hover{transform:translateY(-2px);box-shadow:0 13px 28px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.12);}
      #${BUTTON_ID}:active{transform:translateY(0) scale(.96);}
      html.bio-bg-white #${BUTTON_ID}{
        background:rgba(255,255,255,.96);color:#0f172a;
        border-color:rgba(15,23,42,.22);box-shadow:0 10px 24px rgba(15,23,42,.18);
      }
      @media (max-width:820px){
        #${BUTTON_ID}{left:12px;bottom:12px;width:44px;height:44px;font-size:20px;}
      }
    `;
    document.head.appendChild(style);
  }

  let mode = 'dark';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'white' || saved === 'dark') mode = saved;
  } catch (_) {}

  const originalLevelBackgrounds = new WeakMap();

  const applyCanvasBaseBackground = () => {
    try {
      if (!Array.isArray(levels)) return;
      levels.forEach(lvl => {
        if (!lvl || !lvl.colors) return;
        if (!originalLevelBackgrounds.has(lvl)) originalLevelBackgrounds.set(lvl, lvl.colors.bg);
        lvl.colors.bg = mode === 'white' ? WHITE_BG : originalLevelBackgrounds.get(lvl);
      });
    } catch (_) {}
  };

  const applyMode = () => {
    document.documentElement.classList.toggle('bio-bg-white', mode === 'white');
    applyCanvasBaseBackground();
    const btn = document.getElementById(BUTTON_ID);
    if (btn) {
      btn.textContent = mode === 'white' ? '☀️' : '🌙';
      btn.title = mode === 'white' ? 'Хар дэвсгэрээр харах' : 'Цагаан дэвсгэрээр харах';
      btn.setAttribute('aria-label', btn.title);
    }
  };

  const toggle = () => {
    mode = mode === 'white' ? 'dark' : 'white';
    try { localStorage.setItem(STORAGE_KEY, mode); } catch (_) {}
    applyMode();
  };

  const installButton = () => {
    let btn = document.getElementById(BUTTON_ID);
    if (btn) {
      // Remove the old top-HUD placement if this script is refreshed in-place.
      if (btn.parentElement !== document.body) document.body.appendChild(btn);
      applyMode();
      return true;
    }
    if (!document.body) return false;
    btn = document.createElement('button');
    btn.type = 'button';
    btn.id = BUTTON_ID;
    btn.addEventListener('click', toggle);
    document.body.appendChild(btn);
    applyMode();
    return true;
  };

  applyMode();
  installButton();

  // Keep only the base background synced if grade/level data is rebuilt later.
  setInterval(applyCanvasBaseBackground, 800);
})();
