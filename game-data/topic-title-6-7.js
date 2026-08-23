// TOPIC TITLE DISPLAY ONLY — grades 6 and 7, topic 1.
// Changes only the visible group-topic name. Task data and game logic remain unchanged.
(() => {
  const OLD = 'АМЬД БИЕИЙН ҮНДСЭН ШИНЖ, АНГИЛАЛ, АМЬД БИЕИЙН БҮТЭЦ';
  const NEW = 'АМЬД БИЕИЙН ҮНДСЭН ШИНЖ, АНГИЛАЛ';

  function currentGrade() {
    try {
      const g = String((typeof state !== 'undefined' && state && state.grade) || '').trim();
      if (g === '6' || g === '7') return g;
    } catch (_) {}
    const selectors = ['#grade-select','select[name="grade"]','[data-grade].selected','[data-grade].active'];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const v = String(el.value || el.dataset?.grade || el.textContent || '').trim();
      if (/\b6\b/.test(v)) return '6';
      if (/\b7\b/.test(v)) return '7';
    }
    return '';
  }

  function replaceVisibleTitle() {
    const grade = currentGrade();
    if (grade !== '6' && grade !== '7') return;

    document.querySelectorAll('option, button, label, div, span, p').forEach(el => {
      if (el.children.length) return;
      const txt = String(el.textContent || '').trim();
      if (txt === OLD || txt === `1. ${OLD}`) {
        el.textContent = txt.startsWith('1.') ? `1. ${NEW}` : NEW;
      }
    });
  }

  replaceVisibleTitle();
  const observer = new MutationObserver(replaceVisibleTitle);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  setInterval(replaceVisibleTitle, 500);
})();
