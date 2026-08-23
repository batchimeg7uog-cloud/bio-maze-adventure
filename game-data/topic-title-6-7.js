// TOPIC TITLE DISPLAY ONLY — grades 6 and 7, topic 1.
// Changes only the visible group-topic name. Task data and game logic remain unchanged.
(() => {
  const OLD = 'АМЬД БИЕИЙН ҮНДСЭН ШИНЖ, АНГИЛАЛ, АМЬД БИЕИЙН БҮТЭЦ';
  const NEW = 'АМЬД БИЕИЙН ҮНДСЭН ШИНЖ, АНГИЛАЛ';

  function replaceVisibleTitle() {
    document.querySelectorAll('option, button, label, div, span, p').forEach(el => {
      if (el.children.length) return;
      const txt = String(el.textContent || '').trim();
      if (txt === OLD) el.textContent = NEW;
      else if (txt === `1. ${OLD}`) el.textContent = `1. ${NEW}`;
    });
  }

  replaceVisibleTitle();
  const observer = new MutationObserver(replaceVisibleTitle);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  setInterval(replaceVisibleTitle, 250);
})();
