// VISUAL POSITION ONLY: move the existing Level/Mission banner upward.
// No game rules, logic, tasks, scoring, movement, icons, controls or other UI are changed.
(() => {
  const id = 'bio-mission-position-up';
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
    body #game-ui > .absolute.top-16{top:58px!important;}
    @media (max-width:820px){
      body #game-ui > .absolute.top-16{top:54px!important;}
    }
  `;
  document.head.appendChild(style);

  const applyPosition = () => {
    const banner = document.querySelector('#game-ui > .absolute.top-16');
    if (!banner) return;
    banner.style.setProperty('top', window.innerWidth <= 820 ? '54px' : '58px', 'important');
  };

  applyPosition();
  setTimeout(applyPosition, 150);
  setTimeout(applyPosition, 700);
  window.addEventListener('resize', applyPosition, {passive:true});
})();
