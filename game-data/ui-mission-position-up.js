// VISUAL POSITION ONLY: keep the existing Level/Mission banner clear of the top HUD.
// No game rules, logic, tasks, scoring, movement, icons, controls or other UI are changed.
(() => {
  const id = 'bio-mission-position-up';
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  const desktopTop = '82px';
  const mobileTop = '70px';

  const style = document.createElement('style');
  style.id = id;
  style.textContent = `#game-ui #hud-mission-text{position:relative;}`;
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
  window.addEventListener('resize', applyPosition, {passive:true});
})();
