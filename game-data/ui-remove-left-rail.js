// VISUAL ONLY: remove the Stage 2 left-side mission/help rail and restore the mission banner to the previous centered width.
// No game rules, tasks, scoring, lives, movement, progression, scanner, bonus, save/resume or audio logic is changed.
(() => {
    const removeRail = () => {
        const rail = document.getElementById('stage2-left-rail');
        if (rail) rail.remove();
    };

    const style = document.createElement('style');
    style.id = 'bio-remove-stage2-left-rail';
    style.textContent = `
        #stage2-left-rail{display:none!important}
        #game-ui>.absolute.top-16{
            width:min(900px,calc(100vw - 24px))!important;
            left:50%!important;
            transform:translateX(-50%)!important;
            max-width:none!important;
        }
        @media (max-width:820px){
            #game-ui>.absolute.top-16{width:calc(100vw - 16px)!important}
        }
    `;
    document.head.appendChild(style);

    removeRail();
    new MutationObserver(removeRail).observe(document.documentElement, {childList:true, subtree:true});
})();
