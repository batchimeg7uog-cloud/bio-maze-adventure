// KNOWLEDGE TASK MODE ONLY.
// Keeps the existing maze, 3 correct collectibles, 3 lives, Level 1→5,
// growing distractor count, scoring, audio, save/resume and UI unchanged.
// Replaces game-like word prompts with knowledge clues based on the vetted task content.
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

    // Normalize the shared catalog too, so distractors and labels use the same textbook terminology.
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
        // A knowledge clue must not reveal the answer itself.
        if (o.name) {
            const escaped = o.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            clue = clue.replace(new RegExp(escaped, 'gi'), 'энэ ойлголт');
        }
        return clue || 'Тодорхойлолтод тохирох биологийн ойлголтыг сонго.';
    }

    const missionFrames = [
        clues => `Доорх 3 тодорхойлолтод тохирох 3 зөв хариултыг талбайгаас ол.<br>① ${clues[0]}<br>② ${clues[1]}<br>③ ${clues[2]}`,
        clues => `Сурах бичгийн мэдлэгээ ашиглан 3 зөв ойлголтыг цуглуул.<br>① ${clues[0]}<br>② ${clues[1]}<br>③ ${clues[2]}`,
        clues => `Дараах шинж, үүргийг уншаад тохирох 3 ойлголтыг ол.<br>① ${clues[0]}<br>② ${clues[1]}<br>③ ${clues[2]}`,
        clues => `Тодорхойлолт бүрт тохирох хариултыг ялган ол. Нийт 3 зөв зүйл цуглуулна.<br>① ${clues[0]}<br>② ${clues[1]}<br>③ ${clues[2]}`
    ];

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
        // Each reviewed base task keeps its own coherent set of 3 correct concepts.
        // Variants change clue order/presentation and door focus, not the scientific grouping.
        const variantsPerBase = perms.length * missionFrames.length * 3; // 72 per reviewed task
        const total = baseBank.length * variantsPerBase;

        const makeTask = index => {
            index = Math.max(0, Math.min(total - 1, Number(index) || 0));
            const baseIndex = Math.floor(index / variantsPerBase);
            let rem = index % variantsPerBase;
            const doorFocus = rem % 3; rem = Math.floor(rem / 3);
            const frameIndex = rem % missionFrames.length; rem = Math.floor(rem / missionFrames.length);
            const perm = perms[rem % perms.length];
            const src = baseBank[baseIndex];
            const correctRaw = (src.correct || []).slice(0, 3).map(normalizeObject);
            const orderedCorrect = perm.map(i => correctRaw[i]);
            const clues = orderedCorrect.map(clueFor);
            const wrong = (src.wrong || []).map(normalizeObject);
            const focus = orderedCorrect[doorFocus % orderedCorrect.length];
            const fallbackWrong = wrong.length >= 2 ? wrong : baseBank.flatMap(t => t.wrong || []).map(normalizeObject);
            const distractors = fallbackWrong.filter(o => o.name !== focus.name).slice(0, 2);
            const opts = rotate([focus.name, ...(distractors.map(o => o.name))].slice(0,3), index % 3);

            return {
                mission: missionFrames[frameIndex](clues),
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
                    // Existing Level data-growth fallback only needs a bounded sample.
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
        // Never recycle an already played knowledge task silently.
        if (order.length < TASKS_PER_RUN) {
            console.warn('Bio Maze: unused knowledge-task variants are exhausted for this student/grade/topic.');
            return order;
        }
        order.forEach(id => seen.add(id));
        writeHistory(seen);
        return order;
    };
})();
