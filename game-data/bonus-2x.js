// 2X KNOWLEDGE BONUS ONLY.
// Adds one optional 2X score opportunity per level. Existing maze, tasks, lives,
// progression, movement, scoring rules, audio and save/resume remain otherwise unchanged.
(() => {
    const BONUS_DURATION_MS = 12000;
    const MIN_SPAWN_DELAY_MS = 8000;
    const MAX_SPAWN_DELAY_MS = 18000;

    let currentLevelKey = '';
    let spawnedForLevel = false;
    let spawnTimer = null;
    let bonusUntil = 0;
    let bonusToken = null;
    let statusPill = null;
    let originalScore = Number(state.score) || 0;
    let internalScoreWrite = false;

    // Keep state.score fully compatible, but double positive score gains while 2X is active.
    try {
        Object.defineProperty(state, 'score', {
            configurable: true,
            enumerable: true,
            get() { return originalScore; },
            set(nextValue) {
                const next = Number(nextValue) || 0;
                if (!internalScoreWrite && Date.now() < bonusUntil && state.isPlaying && next > originalScore) {
                    const gain = next - originalScore;
                    originalScore += gain * 2;
                } else {
                    originalScore = next;
                }
            }
        });
    } catch (_) {
        // If the property cannot be wrapped, leave the game untouched.
        return;
    }

    function removeToken() {
        if (bonusToken && bonusToken.parentNode) bonusToken.parentNode.removeChild(bonusToken);
        bonusToken = null;
    }

    function removeStatus() {
        if (statusPill && statusPill.parentNode) statusPill.parentNode.removeChild(statusPill);
        statusPill = null;
    }

    function positionToken(token) {
        const marginX = Math.max(70, window.innerWidth * 0.12);
        const topMin = Math.max(150, window.innerHeight * 0.22);
        const topMax = Math.max(topMin + 80, window.innerHeight * 0.72);
        const left = marginX + Math.random() * Math.max(80, window.innerWidth - marginX * 2 - 80);
        const top = topMin + Math.random() * Math.max(80, topMax - topMin);
        token.style.left = `${Math.round(left)}px`;
        token.style.top = `${Math.round(top)}px`;
    }

    function showActiveStatus() {
        removeStatus();
        const pill = document.createElement('div');
        pill.id = 'knowledge-bonus-status';
        pill.style.cssText = [
            'position:fixed','left:50%','top:72px','transform:translateX(-50%)','z-index:10020',
            'padding:7px 13px','border-radius:999px','background:rgba(124,58,237,.94)',
            'border:1px solid rgba(196,181,253,.8)','box-shadow:0 0 22px rgba(139,92,246,.65)',
            'color:white','font-weight:900','font-size:13px','letter-spacing:.02em','pointer-events:none'
        ].join(';');
        document.body.appendChild(pill);
        statusPill = pill;

        const tick = () => {
            if (!statusPill) return;
            const left = Math.max(0, bonusUntil - Date.now());
            statusPill.textContent = `✨ 2X МЭДЛЭГИЙН БОНУС · ${(left / 1000).toFixed(1)}с`;
            if (left <= 0) {
                removeStatus();
                try { updateHUD(); } catch (_) {}
                return;
            }
            requestAnimationFrame(tick);
        };
        tick();
    }

    function activateBonus() {
        if (!state.isPlaying) return;
        removeToken();
        bonusUntil = Date.now() + BONUS_DURATION_MS;
        showActiveStatus();
        try { audio.play('correct'); } catch (_) {}
    }

    function spawnBonus() {
        spawnTimer = null;
        if (spawnedForLevel || !state.isPlaying) return;
        spawnedForLevel = true;

        const token = document.createElement('button');
        token.type = 'button';
        token.id = 'knowledge-bonus-token';
        token.setAttribute('aria-label', '2X Мэдлэгийн Бонус авах');
        token.title = 'Дарж 12 секундийн 2X онооны бонус идэвхжүүлнэ';
        token.innerHTML = '<span style="font-size:20px">✨</span><span>2X</span>';
        token.style.cssText = [
            'position:fixed','z-index:10010','width:64px','height:64px','border-radius:50%',
            'display:flex','flex-direction:column','align-items:center','justify-content:center','gap:0',
            'border:2px solid rgba(253,224,71,.95)','background:radial-gradient(circle at 35% 30%,#fde047,#f59e0b 55%,#7c2d12)',
            'box-shadow:0 0 0 5px rgba(250,204,21,.15),0 0 28px rgba(250,204,21,.85)',
            'color:#1f2937','font-weight:1000','font-size:17px','cursor:pointer','user-select:none',
            'animation:bioBonusPulse 1s ease-in-out infinite alternate','pointer-events:auto'
        ].join(';');
        token.addEventListener('click', activateBonus, {once:true});
        document.body.appendChild(token);
        bonusToken = token;
        positionToken(token);

        // Opportunity remains visible for 8 seconds; missing it has no penalty.
        setTimeout(() => {
            if (bonusToken === token) removeToken();
        }, 8000);
    }

    function scheduleForCurrentLevel() {
        if (spawnTimer) clearTimeout(spawnTimer);
        spawnTimer = null;
        removeToken();
        removeStatus();
        bonusUntil = 0;
        spawnedForLevel = false;

        const delay = MIN_SPAWN_DELAY_MS + Math.random() * (MAX_SPAWN_DELAY_MS - MIN_SPAWN_DELAY_MS);
        spawnTimer = setTimeout(() => {
            if (state.isPlaying) spawnBonus();
            else spawnedForLevel = false;
        }, delay);
    }

    const style = document.createElement('style');
    style.textContent = '@keyframes bioBonusPulse{from{transform:scale(1) rotate(-3deg)}to{transform:scale(1.12) rotate(3deg)}}';
    document.head.appendChild(style);

    setInterval(() => {
        const key = `${state.grade || ''}|${state.topic || ''}|${state.gradeLevel || 1}|${state.taskIndex || 0}`;
        if (key !== currentLevelKey) {
            currentLevelKey = key;
            scheduleForCurrentLevel();
        } else if (!spawnedForLevel && !spawnTimer && state.isPlaying) {
            scheduleForCurrentLevel();
        }

        if (!state.isPlaying) {
            // Do not leave a pickup floating on menus/modals; it may respawn when play resumes.
            if (bonusToken) {
                removeToken();
                if (!spawnedForLevel) return;
            }
        }
    }, 500);
})();
