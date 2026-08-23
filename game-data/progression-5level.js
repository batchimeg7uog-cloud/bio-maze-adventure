(() => {
    const TOTAL_LEVELS_PER_GRADE = 5;

    makeTaskOrder = function(bankLength) {
        if (!bankLength) return [];
        const shuffle = () => {
            const arr = Array.from({length: bankLength}, (_, i) => i);
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        };
        const order = [];
        while (order.length < TOTAL_LEVELS_PER_GRADE) {
            const batch = shuffle();
            if (bankLength > 1 && order.length && batch[0] === order[order.length - 1]) {
                const swapAt = batch.findIndex(v => v !== order[order.length - 1]);
                if (swapAt > 0) [batch[0], batch[swapAt]] = [batch[swapAt], batch[0]];
            }
            for (const taskIndex of batch) {
                order.push(taskIndex);
                if (order.length === TOTAL_LEVELS_PER_GRADE) break;
            }
        }
        return order;
    };

    applySelectedTask = function() {
        const bank = getSelectedTaskBank();
        if (!bank.length) return false;
        if (!Array.isArray(state.taskOrder) || state.taskOrder.length !== TOTAL_LEVELS_PER_GRADE) {
            state.taskOrder = makeTaskOrder(bank.length);
            state.taskIndex = 0;
        }
        const safeIndex = Math.max(0, Math.min(state.taskIndex, state.taskOrder.length - 1));
        const picked = bank[state.taskOrder[safeIndex]];
        const lvl = levels[state.level - 1];
        lvl.mission = picked.mission;
        lvl.correct = picked.correct.map(x => ({...x}));
        lvl.wrong = picked.wrong.map(x => ({...x}));
        lvl.req = Math.min(3, lvl.correct.length);
        lvl.doorQ = picked.doorQ;
        lvl.doorOpts = [...picked.doorOpts];
        lvl.doorAns = picked.doorAns;
        lvl.name = `${state.grade}: ${state.topic}`;
        return true;
    };

    restoreSavedProgress = function(data) {
        const bank = getSelectedTaskBank();
        state.characterIdx = Number.isInteger(data.characterIdx) ? data.characterIdx : state.characterIdx;
        state.level = Number.isInteger(data.level) ? data.level : state.level;
        state.gradeLevel = Math.min(TOTAL_LEVELS_PER_GRADE, Math.max(1, Number(data.gradeLevel) || 1));
        state.taskIndex = Math.min(TOTAL_LEVELS_PER_GRADE - 1, Math.max(0, Number(data.taskIndex) || 0));
        state.taskOrder = Array.isArray(data.taskOrder) && data.taskOrder.length === TOTAL_LEVELS_PER_GRADE
            ? [...data.taskOrder]
            : makeTaskOrder(bank.length);
        state.score = Math.max(0, Number(data.score) || 0);
        state.lives = Math.max(1, Number(data.lives) || 3);
        state.hintsUsed = Math.max(0, Number(data.hintsUsed) || 0);
        applySelectedTask();
    };

    window.submitDoor = function(sel, ans) {
        if (sel === ans) {
            audio.play('door');
            state.score += 100;
            closeModal();
            const hasNextTask = state.gradeLevel < TOTAL_LEVELS_PER_GRADE;
            if (hasNextTask) {
                state.taskIndex++;
                state.gradeLevel++;
                applySelectedTask();
                saveCurrentProgress();
                showModal("🔓 ТҮВШИН ДАВЛАА!",
                    `Гайхалтай! <b>Level ${state.gradeLevel - 1}</b>-ийг амжилттай дуусгалаа.<br><br>Дараагийн даалгавар руу орно.`,
                    [{ text: `▶ LEVEL ${state.gradeLevel} ЭХЛҮҮЛЭХ`, class: 'btn-primary w-full', action: () => {
                        closeModal();
                        startLevel();
                    }}]
                );
            } else {
                clearSavedProgress();
                winGame();
            }
        } else {
            audio.play('wrong');
            state.lives--;
            updateHUD();
            closeModal();
            if (state.lives <= 0) { gameOver(); return; }
            showModal("❌ БУРУУ", "Таавар буруу байна. Дахин оролдоно уу.", [
                { text: 'Ойлголоо', class: 'btn-warning w-full', action: () => {
                    player.targetY += 1;
                    state.isPlaying = true;
                    closeModal();
                }}
            ]);
        }
    };
})();
