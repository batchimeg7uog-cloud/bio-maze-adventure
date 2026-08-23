// NO-REPEAT TASK HISTORY ONLY.
// Adds persistent per-student/per-grade/per-topic task history and procedural task variants.
// Maze, UI, scoring, lives, audio, save/resume and level progression are untouched.
(() => {
    const originalGetSelectedTaskBank = getSelectedTaskBank;
    const TASKS_PER_RUN = 5;
    const MISSION_TEMPLATES = [
        names => `Дараах 3 ойлголтыг ол: ${names.join(', ')}.`,
        names => `Сэдэвтэй холбоотой ${names.join(', ')} гэсэн 3 өгөгдлийг илрүүл.`,
        names => `${names.join(', ')} гэсэн 3 биологийн ойлголтыг зөв ялган ол.`,
        names => `Эдгээр 3 биологийн өгөгдлийг цуглуул: ${names.join(', ')}.`
    ];

    let cachedKey = '';
    let cachedBank = null;

    function objectKey(o) {
        return `${o && o.name || ''}|${o && o.clue || ''}|${o && o.desc || ''}`;
    }

    function uniqueObjects(items) {
        const seen = new Set();
        const out = [];
        items.forEach(o => {
            const k = objectKey(o);
            if (!k || seen.has(k)) return;
            seen.add(k);
            out.push({...o});
        });
        return out;
    }

    function choose3(n) {
        const out = [];
        for (let a = 0; a < n - 2; a++) {
            for (let b = a + 1; b < n - 1; b++) {
                for (let c = b + 1; c < n; c++) out.push([a,b,c]);
            }
        }
        return out;
    }

    function pairs(n) {
        const out = [];
        for (let a = 0; a < n - 1; a++) {
            for (let b = a + 1; b < n; b++) out.push([a,b]);
        }
        return out;
    }

    function rotate(arr, amount) {
        if (!arr.length) return [];
        const n = ((amount % arr.length) + arr.length) % arr.length;
        return arr.slice(n).concat(arr.slice(0,n));
    }

    function createVirtualBank(baseBank) {
        const concepts = uniqueObjects(baseBank.flatMap(t => t.correct || []));
        const allData = uniqueObjects(baseBank.flatMap(t => [...(t.correct || []), ...(t.wrong || [])]));
        const triples = choose3(concepts.length);

        // If a topic unexpectedly has fewer than 3 unique target concepts, keep its original bank.
        if (!triples.length) return baseBank;

        const blocks = [];
        let total = 0;
        triples.forEach(triple => {
            const selected = new Set(triple.map(i => objectKey(concepts[i])));
            const distractors = allData.filter(o => !selected.has(objectKey(o)));
            const pairList = pairs(distractors.length);
            if (!pairList.length) return;
            const size = 3 * pairList.length * MISSION_TEMPLATES.length;
            blocks.push({start: total, size, triple, distractors, pairList});
            total += size;
        });

        if (total < TASKS_PER_RUN) return baseBank;

        function makeTask(index) {
            index = Math.max(0, Math.min(total - 1, Number(index) || 0));
            let lo = 0, hi = blocks.length - 1, block = blocks[0];
            while (lo <= hi) {
                const mid = (lo + hi) >> 1;
                const b = blocks[mid];
                if (index < b.start) hi = mid - 1;
                else if (index >= b.start + b.size) lo = mid + 1;
                else { block = b; break; }
            }

            let rem = index - block.start;
            const templateIndex = rem % MISSION_TEMPLATES.length;
            rem = Math.floor(rem / MISSION_TEMPLATES.length);
            const focusIndex = rem % 3;
            rem = Math.floor(rem / 3);
            const pair = block.pairList[rem % block.pairList.length];

            const correct = block.triple.map(i => ({...concepts[i]}));
            const focus = correct[focusIndex];
            const firstTwo = [block.distractors[pair[0]], block.distractors[pair[1]]];

            // Keep enough non-target data available for the existing Level 1→5 growth logic.
            const extraWrong = [];
            const used = new Set(correct.map(objectKey));
            firstTwo.forEach(o => used.add(objectKey(o)));
            firstTwo.forEach(o => extraWrong.push({...o}));
            const rotated = rotate(block.distractors, index % Math.max(1, block.distractors.length));
            rotated.forEach(o => {
                if (extraWrong.length >= 8) return;
                const k = objectKey(o);
                if (!used.has(k)) {
                    used.add(k);
                    extraWrong.push({...o});
                }
            });

            const opts = [focus.name, firstTwo[0].name, firstTwo[1].name];
            const rotatedOpts = rotate(opts, index % 3);
            const names = correct.map(o => o.name);

            return {
                mission: MISSION_TEMPLATES[templateIndex](names),
                correct,
                wrong: extraWrong,
                doorQ: `${focus.clue || focus.desc || focus.name} Энэ нь аль нь вэ?`,
                doorOpts: rotatedOpts,
                doorAns: rotatedOpts.indexOf(focus.name),
                __variantId: index
            };
        }

        const target = {length: total, __isNoRepeatVirtualBank: true};
        return new Proxy(target, {
            get(obj, prop) {
                if (prop === 'length' || prop === '__isNoRepeatVirtualBank') return obj[prop];
                if (prop === 'forEach') {
                    // Existing growth code only uses forEach as a safety fallback.
                    return callback => {
                        const limit = Math.min(total, 250);
                        for (let i = 0; i < limit; i++) callback(makeTask(i), i, proxy);
                    };
                }
                if (typeof prop === 'string' && /^\d+$/.test(prop)) return makeTask(Number(prop));
                return obj[prop];
            }
        });
        var proxy;
    }

    // Re-declare with a small fix so Proxy callbacks can reference the proxy itself safely.
    function buildBank(baseBank) {
        const concepts = uniqueObjects(baseBank.flatMap(t => t.correct || []));
        const allData = uniqueObjects(baseBank.flatMap(t => [...(t.correct || []), ...(t.wrong || [])]));
        const triples = choose3(concepts.length);
        if (!triples.length) return baseBank;
        const blocks = [];
        let total = 0;
        triples.forEach(triple => {
            const selected = new Set(triple.map(i => objectKey(concepts[i])));
            const distractors = allData.filter(o => !selected.has(objectKey(o)));
            const pairList = pairs(distractors.length);
            if (!pairList.length) return;
            const size = 3 * pairList.length * MISSION_TEMPLATES.length;
            blocks.push({start: total, size, triple, distractors, pairList});
            total += size;
        });
        if (total < TASKS_PER_RUN) return baseBank;

        const makeTask = index => {
            index = Math.max(0, Math.min(total - 1, Number(index) || 0));
            let lo = 0, hi = blocks.length - 1, block = blocks[0];
            while (lo <= hi) {
                const mid = (lo + hi) >> 1;
                const b = blocks[mid];
                if (index < b.start) hi = mid - 1;
                else if (index >= b.start + b.size) lo = mid + 1;
                else { block = b; break; }
            }
            let rem = index - block.start;
            const templateIndex = rem % MISSION_TEMPLATES.length;
            rem = Math.floor(rem / MISSION_TEMPLATES.length);
            const focusIndex = rem % 3;
            rem = Math.floor(rem / 3);
            const pair = block.pairList[rem % block.pairList.length];
            const correct = block.triple.map(i => ({...concepts[i]}));
            const focus = correct[focusIndex];
            const firstTwo = [block.distractors[pair[0]], block.distractors[pair[1]]];
            const wrong = [];
            const used = new Set(correct.map(objectKey));
            firstTwo.forEach(o => { used.add(objectKey(o)); wrong.push({...o}); });
            rotate(block.distractors, index % Math.max(1, block.distractors.length)).forEach(o => {
                if (wrong.length >= 8) return;
                const k = objectKey(o);
                if (!used.has(k)) { used.add(k); wrong.push({...o}); }
            });
            const opts = rotate([focus.name, firstTwo[0].name, firstTwo[1].name], index % 3);
            return {
                mission: MISSION_TEMPLATES[templateIndex](correct.map(o => o.name)),
                correct,
                wrong,
                doorQ: `${focus.clue || focus.desc || focus.name} Энэ нь аль нь вэ?`,
                doorOpts: opts,
                doorAns: opts.indexOf(focus.name),
                __variantId: index
            };
        };

        let proxy = null;
        proxy = new Proxy({length: total, __isNoRepeatVirtualBank: true}, {
            get(obj, prop) {
                if (prop === 'length' || prop === '__isNoRepeatVirtualBank') return obj[prop];
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
            cachedBank = buildBank(base);
        }
        return cachedBank;
    };

    function historyStorageKey() {
        try {
            return `${progressStorageKey()}::played-task-history-v2`;
        } catch (_) {
            return `bioMazePlayed::${state.grade || ''}::${state.topic || ''}`;
        }
    }

    function readHistory(limit) {
        try {
            const raw = JSON.parse(localStorage.getItem(historyStorageKey()) || '[]');
            if (!Array.isArray(raw)) return new Set();
            return new Set(raw.filter(v => Number.isInteger(v) && v >= 0 && v < limit));
        } catch (_) {
            return new Set();
        }
    }

    function writeHistory(seen) {
        try { localStorage.setItem(historyStorageKey(), JSON.stringify([...seen])); } catch (_) {}
    }

    function randomUnseen(limit, seen, count) {
        const chosen = [];
        const picked = new Set();
        let attempts = 0;
        const maxAttempts = Math.max(500, count * 200);
        while (chosen.length < count && attempts < maxAttempts) {
            const id = Math.floor(Math.random() * limit);
            attempts++;
            if (seen.has(id) || picked.has(id)) continue;
            picked.add(id);
            chosen.push(id);
        }
        if (chosen.length < count) {
            const start = Math.floor(Math.random() * Math.max(1, limit));
            for (let step = 0; step < limit && chosen.length < count; step++) {
                const id = (start + step) % limit;
                if (seen.has(id) || picked.has(id)) continue;
                picked.add(id);
                chosen.push(id);
            }
        }
        return chosen;
    }

    makeTaskOrder = function(bankLength) {
        if (!bankLength) return [];
        const seen = readHistory(bankLength);
        const order = randomUnseen(bankLength, seen, TASKS_PER_RUN);

        // Never silently recycle a task. If the available procedural bank is ever exhausted,
        // leave the remaining slots empty rather than repeating an old task.
        if (order.length < TASKS_PER_RUN) {
            console.warn('Bio Maze: unique task bank exhausted for this student/grade/topic.');
            return order;
        }

        order.forEach(id => seen.add(id));
        writeHistory(seen);
        return order;
    };
})();
