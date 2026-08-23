// BACKGROUND VIEW TOGGLE ONLY.
// Adds a dark/white background viewing control. No game rules, logic, content,
// scoring, movement, maze, icons, controls, progression, audio or save data are changed.
(() => {
  const STYLE_ID = 'bio-background-view-toggle-style';
  const BUTTON_ID = 'bio-background-view-toggle';
  const STORAGE_KEY = 'bioMazeBackgroundViewV1';

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      html.bio-bg-white body{background:#ffffff!important;}
      #${BUTTON_ID}{
        min-width:54px;height:54px;padding:0 10px;border-radius:18px;
        display:inline-flex;align-items:center;justify-content:center;gap:5px;
        background:rgba(6,19,28,.91);border:1px solid rgba(125,211,252,.26);
        box-shadow:0 10px 22px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.08);
        color:#fff;font-weight:900;font-size:20px;cursor:pointer;user-select:none;
      }
      #${BUTTON_ID}:hover{transform:translateY(-1px);}
      #${BUTTON_ID} .bio-bg-label{font-size:10px;line-height:1;font-weight:1000;letter-spacing:.02em;}
      @media (max-width:820px){
        #${BUTTON_ID}{min-width:46px;height:46px;border-radius:16px;padding:0 7px;font-size:18px;}
        #${BUTTON_ID} .bio-bg-label{display:none;}
      }
    `;
    document.head.appendChild(style);
  }

  let mode = 'dark';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'white' || saved === 'dark') mode = saved;
  } catch (_) {}

  const applyMode = () => {
    document.documentElement.classList.toggle('bio-bg-white', mode === 'white');
    const btn = document.getElementById(BUTTON_ID);
    if (btn) {
      btn.innerHTML = mode === 'white'
        ? '<span aria-hidden="true">☀️</span><span class="bio-bg-label">ЦАГААН</span>'
        : '<span aria-hidden="true">🌙</span><span class="bio-bg-label">ХАР</span>';
      btn.title = mode === 'white' ? 'Дэвсгэрийг хар болгох' : 'Дэвсгэрийг цагаан болгох';
      btn.setAttribute('aria-label', btn.title);
    }
  };

  const toggle = () => {
    mode = mode === 'white' ? 'dark' : 'white';
    try { localStorage.setItem(STORAGE_KEY, mode); } catch (_) {}
    applyMode();
  };

  const installButton = () => {
    if (document.getElementById(BUTTON_ID)) return true;
    const sound = document.getElementById('btn-sound');
    if (!sound || !sound.parentElement) return false;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = BUTTON_ID;
    btn.addEventListener('click', toggle);
    sound.parentElement.insertBefore(btn, sound);
    applyMode();
    return true;
  };

  applyMode();
  if (!installButton()) {
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (installButton() || tries > 40) clearInterval(timer);
    }, 250);
  }
})();
