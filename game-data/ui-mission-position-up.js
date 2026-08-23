// VISUAL POSITION ONLY: move the existing Level/Mission banner slightly upward.
// No game rules, logic, tasks, scoring, movement, icons, controls or other UI are changed.
(() => {
  const id = 'bio-mission-position-up';
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
    #game-ui>.absolute.top-16{top:82px!important;}
    @media (max-width:820px){
      #game-ui>.absolute.top-16{top:68px!important;}
    }
  `;
  document.head.appendChild(style);
})();
