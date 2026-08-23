// TASK DATA GROWTH ONLY: Level 1→5 gradually increases visible biology data.
// Core maze, scoring, lives, audio, save/resume, UI and progression mechanics are untouched.
(() => {
    const MAX_GRADE_LEVEL = 5;

    function dataKey(obj) {
        if (!obj) return '';
        return `${obj.name || ''}|${obj.clue || ''}|${obj.desc || ''}`;
    }

    function previouslyCollectedKeys(bank, stageIndex) {
        const keys = new Set();
        if (!Array.isArray(state.taskOrder)) return keys;
        for (let previousStage = 0; previousStage < stageIndex; previousStage++) {
            const previousTaskIndex = state.taskOrder[previousStage];
            const previousTask = bank[previousTaskIndex];
            if (!previousTask || !Array.isArray(previousTask.correct)) continue;
            previousTask.correct.forEach(obj => keys.add(dataKey(obj)));
        }
        return keys;
    }

    function buildGrowingWrongData(bank, picked, stageIndex) {
        // 3 mission targets stay unchanged. Non-target biology data grows by one each level:
        // L1: 2, L2: 3, L3: 4, L4: 5, L5: 6  => total bio objects 5,6,7,8,9.
        const targetWrongCount = 2 + stageIndex;
        const currentCorrect = new Set(picked.correct.map(dataKey));
        const alreadyCollected = previouslyCollectedKeys(bank, stageIndex);
        const seen = new Set();
        const result = [];

        const add = (obj) => {
            if (!obj || result.length >= targetWrongCount) return;
            const key = dataKey(obj);
            // Do not show the current correct targets as distractors, and do not bring back
            // concepts that the learner already collected in earlier levels of the same run.
            if (!key || currentCorrect.has(key) || alreadyCollected.has(key) || seen.has(key)) return;
            seen.add(key);
            result.push({...obj});
        };

        // Keep the current level's own distractors first.
        picked.wrong.forEach(add);

        // Add only other distractor data from the same topic bank. Previous correct answers
        // are deliberately excluded so Level 1 collected concepts do not reappear in Level 2+.
        if (result.length < targetWrongCount) {
            bank.forEach(task => {
                (task.wrong || []).forEach(add);
            });
        }

        // Last-resort same-topic fill: use not-yet-collected concepts only.
        if (result.length < targetWrongCount) {
            bank.forEach(task => {
                (task.correct || []).forEach(add);
            });
        }

        return result;
    }

    applySelectedTask = function() {
        const bank = getSelectedTaskBank();
        if (!bank.length) return false;

        if (!Array.isArray(state.taskOrder) || state.taskOrder.length !== MAX_GRADE_LEVEL) {
            state.taskOrder = makeTaskOrder(bank.length);
            state.taskIndex = 0;
        }

        const safeIndex = Math.max(0, Math.min(state.taskIndex, state.taskOrder.length - 1));
        const picked = bank[state.taskOrder[safeIndex]];
        const lvl = levels[state.level - 1];
        const stageIndex = Math.max(0, Math.min(MAX_GRADE_LEVEL - 1, (state.gradeLevel || 1) - 1));

        lvl.mission = picked.mission;
        lvl.correct = picked.correct.map(x => ({...x}));
        lvl.wrong = buildGrowingWrongData(bank, picked, stageIndex);
        lvl.req = Math.min(3, lvl.correct.length);
        lvl.doorQ = picked.doorQ;
        lvl.doorOpts = [...picked.doorOpts];
        lvl.doorAns = picked.doorAns;
        lvl.name = `${state.grade}: ${state.topic}`;
        return true;
    };
})();
