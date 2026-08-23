// VISUAL POSITION ONLY: move the existing Level/Mission banner upward for every grade.
// No game rules, logic, tasks, scoring, movement, icons, controls or other UI are changed.
(() => {
  const id = 'bio-mission-position-up';
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  const desktopTop = '58px';
  const mobileTop = '54px';

  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
    #game-ui #hud-mission-text{position:relative;}
    @media (max-width:820px){}
  `;
  document.head.appendChild(style);

  const findBanner = () => {
    const mission = document.getElementById('hud-mission-text');
    if (!mission) return null;
    const panel = mission.closest('.hud-panel');
    return panel ? panel.parentElement : null;
  };

  const applyPosition = () => {
    const banner = findBanner();
    if (!banner) return;
    banner.style.setProperty('top', window.innerWidth <= 820 ? mobileTop : desktopTop, 'important');
  };

  applyPosition();
  setTimeout(applyPosition, 100);
  setTimeout(applyPosition, 400);
  setTimeout(applyPosition, 1000);

  const observer = new MutationObserver(applyPosition);
  observer.observe(document.body, {attributes:true, attributeFilter:['class'], childList:true, subtree:true});
  window.addEventListener('resize', applyPosition, {passive:true});
})();
