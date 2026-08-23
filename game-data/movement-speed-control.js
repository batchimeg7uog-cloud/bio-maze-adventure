// MOVEMENT SPEED CONTROL ONLY.
// Adds a small - / + player movement-speed selector. No game rules, maze logic,
// scoring, lives, tasks, progression, audio or save/resume behavior is changed.
(() => {
    const STORAGE_KEY = 'bioMazeMovementSpeedV1';
    const SPEEDS = [
        { label: '0.8×', value: 0.12, title: 'Удаан' },
        { label: '1.0×', value: 0.15, title: 'Хэвийн' },
        { label: '1.25×', value: 0.1875, title: 'Хурдан' }
    ];

    let speedIndex = 1;
    try {
        const saved = Number(localStorage.getItem(STORAGE_KEY));
        if (Number.isInteger(saved) && saved >= 0 && saved < SPEEDS.length) speedIndex = saved;
    } catch (_) {}

    function applySpeed() {
        if (typeof player !== 'undefined' && player) player.speed = SPEEDS[speedIndex].value;
        if (valueEl) {
            valueEl.textContent = SPEEDS[speedIndex].label;
            valueEl.title = `Хөдөлгөөний хурд: ${SPEEDS[speedIndex].title}`;
        }
        if (minusBtn) minusBtn.disabled = speedIndex === 0;
        if (plusBtn) plusBtn.disabled = speedIndex === SPEEDS.length - 1;
        try { localStorage.setItem(STORAGE_KEY, String(speedIndex)); } catch (_) {}
    }

    const controls = document.querySelector('#btn-sound')?.parentElement;
    if (!controls || document.getElementById('movement-speed-control')) {
        applySpeed();
        return;
    }

    const wrap = document.createElement('div');
    wrap.id = 'movement-speed-control';
    wrap.className = 'hud-panel flex items-center overflow-hidden';
    wrap.title = 'Хөдөлгөөний хурд';
    wrap.style.height = '40px';
    wrap.style.pointerEvents = 'auto';

    const makeButton = (text, title) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = text;
        b.title = title;
        b.className = 'h-full px-2 font-black text-blue-300 hover:bg-slate-700 transition disabled:opacity-30 disabled:cursor-not-allowed';
        return b;
    };

    const minusBtnLocal = makeButton('−', 'Хурд хасах');
    const valueElLocal = document.createElement('span');
    valueElLocal.className = 'min-w-[42px] text-center text-[11px] font-black text-slate-100 select-none';
    const plusBtnLocal = makeButton('+', 'Хурд нэмэх');

    wrap.append(minusBtnLocal, valueElLocal, plusBtnLocal);
    controls.insertBefore(wrap, document.getElementById('btn-sound'));

    // Expose through closure variables used by applySpeed.
    minusBtn = minusBtnLocal;
    plusBtn = plusBtnLocal;
    valueEl = valueElLocal;

    minusBtn.addEventListener('click', () => {
        if (speedIndex > 0) {
            speedIndex--;
            applySpeed();
        }
    });
    plusBtn.addEventListener('click', () => {
        if (speedIndex < SPEEDS.length - 1) {
            speedIndex++;
            applySpeed();
        }
    });

    applySpeed();

    var minusBtn, plusBtn, valueEl;
})();
