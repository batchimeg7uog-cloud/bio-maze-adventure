// KNOWLEDGE TASK PRESENTATION ONLY.
// Keeps the existing maze, 3 correct collectibles, 3 lives, Level 1→5,
// growing distractor count, scoring, audio, save/resume, no-repeat history and UI unchanged.
// Restores concise “find 3 related concepts” missions; learning information stays on the objects.
(() => {
    const TASKS_PER_RUN = 5;
    const originalGetSelectedTaskBank = getSelectedTaskBank;
    let cachedKey = '';
    let cachedBank = null;

    const termRules = [
        [/Цөмийн/g, 'Бөөмийн'], [/цөмийн/g, 'бөөмийн'],
        [/Цөмүүд/g, 'Бөөмүүд'], [/цөмүүд/g, 'бөөмүүд'],
        [/Цөм/g, 'Бөөм'], [/цөм/g, 'бөөм'],
        [/Ферментийн/g, 'Энзимийн'], [/ферментийн/g, 'энзимийн'],
        [/Фермент/g, 'Энзим'], [/фермент/g, 'энзим']
    ];

    function normalizeText(value) {
        let s = String(value || '');
        termRules.forEach(([from, to]) => { s = s.replace(from, to); });
        return s;
    }

    function normalizeObject(obj) {
        return {
            ...obj,
            name: normalizeText(obj && obj.name),
            clue: normalizeText(obj && obj.clue),
            desc: normalizeText(obj && obj.desc)
        };
    }

    // Keep textbook terminology consistent in labels, learning information and distractors.
    if (window.__B5C) {
        Object.keys(window.__B5C).forEach(key => {
            const row = window.__B5C[key];
            if (!Array.isArray(row)) return;
            if (row.length > 2) row[2] = normalizeText(row[2]);
            if (row.length > 3) row[3] = normalizeText(row[3]);
        });
    }

    function clueFor(obj) {
        const o = normalizeObject(obj);
        let clue = (o.clue || o.desc || '').trim();
        if (o.name) {
            const escaped = o.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            clue = clue.replace(new RegExp(escaped, 'gi'), 'энэ ойлголт');
        }
        return clue || 'Тодорхойлолтод тохирох биологийн ойлголтыг сонго.';
    }

    const perms = [
        [0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]
    ];

    function rotate(arr, n) {
        if (!arr.length) return [];
        n = ((n % arr.length) + arr.length) % arr.length;
        return arr.slice(n).concat(arr.slice(0,n));
    }

    function buildKnowledgeBank(baseBank) {
        if (!Array.isArray(baseBank) || !baseBank.length) return baseBank;

        // Preserve the reviewed scientific grouping of each task.
        // Variants affect order/door focus only; the visible mission stays concise like the original game.
        const variantsPerBase = perms.length * 3;
        const total = baseBank.length * variantsPerBase;

        const makeTask = index => {
            index = Math.max(0, Math.min(total - 1, Number(index) || 0));
            const baseIndex = Math.floor(index / variantsPerBase);
            let rem = index % variantsPerBase;
            const doorFocus = rem % 3;
            rem = Math.floor(rem / 3);
            const perm = perms[rem % perms.length];
            const src = baseBank[baseIndex];

            const correctRaw = (src.correct || []).slice(0, 3).map(normalizeObject);
            const orderedCorrect = perm.map(i => correctRaw[i]);
            const wrong = (src.wrong || []).map(normalizeObject);
            const focus = orderedCorrect[doorFocus % orderedCorrect.length];
            const fallbackWrong = wrong.length >= 2 ? wrong : baseBank.flatMap(t => t.wrong || []).map(normalizeObject);
            const distractors = fallbackWrong.filter(o => o.name !== focus.name).slice(0, 2);
            const opts = rotate([focus.name, ...(distractors.map(o => o.name))].slice(0, 3), index % 3);

            return {
                // Short mission only. Object clue/desc remains intact so information appears while exploring.
                mission: normalizeText(src.mission),
                correct: orderedCorrect,
                wrong,
                doorQ: clueFor(focus) + ' Аль ойлголт тохирох вэ?',
                doorOpts: opts,
                doorAns: opts.indexOf(focus.name),
                __knowledgeVariantId: index,
                __baseTaskIndex: baseIndex
            };
        };

        let proxy = null;
        proxy = new Proxy({length: total, __knowledgeBank: true}, {
            get(obj, prop) {
                if (prop === 'length' || prop === '__knowledgeBank') return obj[prop];
                if (prop === 'forEach') return callback => {
                    const limit = Math.min(total, 250);
                    for (let i = 0; i < limit; i++) callback(makeTask(i), i, proxy);
                };
                if (typeof prop === 'string' && /^\d+$/.test(prop)) return makeTask(Number(prop));
                return obj[prop];
            }
        });
        return proxy;
    }

    getSelectedTaskBank = function() {
        const base = originalGetSelectedTaskBank();
        const key = `${state.grade || ''}|${state.topic || ''}`;
        if (!cachedBank || cachedKey !== key) {
            cachedKey = key;
            cachedBank = buildKnowledgeBank(base);
        }
        return cachedBank;
    };

    function historyStorageKey() {
        try {
            return `${progressStorageKey()}::knowledge-task-history-v3`;
        } catch (_) {
            return `bioMazeKnowledgePlayed::${state.grade || ''}::${state.topic || ''}`;
        }
    }

    function readHistory(limit) {
        try {
            const data = JSON.parse(localStorage.getItem(historyStorageKey()) || '[]');
            return new Set(Array.isArray(data) ? data.filter(v => Number.isInteger(v) && v >= 0 && v < limit) : []);
        } catch (_) { return new Set(); }
    }

    function writeHistory(seen) {
        try { localStorage.setItem(historyStorageKey(), JSON.stringify([...seen])); } catch (_) {}
    }

    function pickUnseen(limit, seen, count) {
        const available = [];
        for (let i = 0; i < limit; i++) if (!seen.has(i)) available.push(i);
        for (let i = available.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [available[i], available[j]] = [available[j], available[i]];
        }
        return available.slice(0, count);
    }

    makeTaskOrder = function(bankLength) {
        if (!bankLength) return [];
        const seen = readHistory(bankLength);
        const order = pickUnseen(bankLength, seen, TASKS_PER_RUN);
        if (order.length < TASKS_PER_RUN) {
            console.warn('Bio Maze: unused knowledge-task variants are exhausted for this student/grade/topic.');
            return order;
        }
        order.forEach(id => seen.add(id));
        writeHistory(seen);
        return order;
    };
})();
