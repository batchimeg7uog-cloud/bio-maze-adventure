// UI DESIGN STAGE 2 — VISUAL ONLY.
// Refines color, panel layout, button style, maze palette and item icon presentation.
// Does not change tasks, scoring rules, lives, movement rules, level progression,
// scanner logic, 2X bonus logic, save/resume, audio, key/door logic or task selection.
(() => {
    const STYLE_ID = 'bio-ui-design-stage2';
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
        body{
            background:
                radial-gradient(circle at 18% 18%,rgba(34,197,94,.14),transparent 28%),
                radial-gradient(circle at 82% 16%,rgba(59,130,246,.14),transparent 24%),
                linear-gradient(180deg,#06101b 0%,#071722 100%)!important;
        }
        #game-ui{z-index:20}
        .hud-panel{
            background:rgba(6,19,28,.91)!important;
            border:1px solid rgba(74,222,128,.28)!important;
            border-radius:22px!important;
            box-shadow:0 14px 34px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.06),0 0 0 1px rgba(6,182,212,.05)!important;
            backdrop-filter:blur(12px)!important;
        }
        #game-ui>.absolute.top-2{
            top:14px!important;left:18px!important;right:18px!important;align-items:flex-start!important;
        }
        #game-ui>.absolute.top-2>.hud-panel{min-height:68px;padding:10px 16px!important}
        #hud-name{font-size:12px!important;color:#cbd5e1!important;font-weight:900!important;letter-spacing:.04em}
        #hud-level{font-size:20px!important;color:#60a5fa!important;font-weight:1000!important}
        #hud-lives,#hud-score{font-size:20px!important}
        #game-ui>.absolute.top-2 .flex.gap-2{gap:10px!important;align-items:center!important}
        #btn-inventory-top,#btn-hint,#btn-sound,#btn-exit,#movement-speed-control{
            min-height:54px!important;border-radius:18px!important;
            box-shadow:0 10px 22px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.08)!important;
        }
        #btn-inventory-top,#btn-hint,#btn-sound{min-width:54px!important;font-size:23px!important}
        #movement-speed-control{height:54px!important;overflow:hidden!important}
        #movement-speed-control button{font-size:20px!important;padding:0 10px!important}
        #movement-speed-control span{font-size:12px!important;min-width:46px!important;color:#e2e8f0!important}
        #btn-exit{
            width:auto!important;min-width:126px!important;padding:9px 14px!important;
            background:linear-gradient(180deg,#dc503d,#9f2f24)!important;
            color:#fff!important;border:2px solid rgba(254,202,202,.62)!important;
            display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;
        }
        #btn-exit .exit-label{display:inline!important;font-size:11px!important;line-height:1.05!important;font-weight:1000!important}
        #game-ui>.absolute.top-16{
            top:96px!important;left:50%!important;transform:translateX(-50%)!important;
            width:min(900px,calc(100vw - 390px))!important;max-width:none!important;margin-top:0!important;
        }
        #game-ui>.absolute.top-16>.hud-panel{
            padding:13px 18px!important;border-radius:26px!important;
            background:linear-gradient(180deg,rgba(5,23,31,.97),rgba(6,25,34,.91))!important;
            border-color:rgba(74,222,128,.35)!important;
        }
        #hud-mission-title{color:#67e8f9!important;font-size:17px!important;font-weight:1000!important}
        #hud-mission-text{color:#f8fafc!important;font-size:15px!important;line-height:1.45!important;font-weight:800!important}
        #hud-keys,#hud-progress{font-size:16px!important;font-weight:1000!important}
        #stage2-left-rail{
            position:absolute;left:18px;top:150px;width:292px;z-index:34;display:flex;flex-direction:column;gap:14px;pointer-events:auto;
        }
        .stage2-card{
            background:linear-gradient(180deg,rgba(4,21,25,.96),rgba(6,28,31,.92));
            border:1px solid rgba(74,222,128,.32);border-radius:26px;padding:19px 18px;
            box-shadow:0 18px 38px rgba(0,0,0,.32),inset 0 1px 0 rgba(255,255,255,.06),0 0 24px rgba(34,197,94,.07);
            color:#ecfeff;
        }
        .stage2-title{display:flex;align-items:center;gap:8px;color:#86efac;font-size:17px;font-weight:1000;letter-spacing:.02em;margin-bottom:12px}
        .stage2-level{display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;background:rgba(8,47,73,.5);border:1px solid rgba(125,211,252,.28);color:#93c5fd;font-size:11px;font-weight:1000;margin-bottom:10px}
        #stage2-mission{margin:0;color:#f8fafc;font-size:17px;line-height:1.5;font-weight:800}
        .stage2-rule{height:1px;border:0;margin:14px 0;background:linear-gradient(90deg,transparent,rgba(74,222,128,.35),transparent)}
        .stage2-help{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}
        .stage2-help li{display:grid;grid-template-columns:28px 1fr;gap:9px;align-items:start;color:#e2e8f0;font-size:14px;line-height:1.42;font-weight:700}
        .stage2-help .ico{width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;background:rgba(15,23,42,.9);border:1px solid rgba(125,211,252,.22);font-size:15px}
        #d-pad{right:26px!important;bottom:24px!important}
        .d-btn{
            background:linear-gradient(180deg,rgba(100,116,139,.96),rgba(51,65,85,.96))!important;
            border:1px solid rgba(226,232,240,.3)!important;border-radius:18px!important;
            box-shadow:0 11px 24px rgba(0,0,0,.29),inset 0 1px 0 rgba(255,255,255,.12)!important;
            color:#fff!important;font-weight:1000!important;
        }
        #scanner-btn-container{right:42px!important;bottom:210px!important;gap:12px!important}
        #btn-scan{
            width:86px!important;height:86px!important;border-radius:26px!important;
            background:linear-gradient(180deg,#0ea5e9,#2563eb)!important;border:2px solid rgba(191,219,254,.72)!important;
            box-shadow:0 18px 34px rgba(37,99,235,.3),0 0 0 7px rgba(14,165,233,.11)!important;
        }
        #knowledge-bonus-token{border-width:3px!important;box-shadow:0 0 0 7px rgba(250,204,21,.13),0 0 30px rgba(250,204,21,.78)!important}
        #knowledge-bonus-status{top:78px!important;border-radius:999px!important}
        #game-canvas{filter:saturate(1.08) contrast(1.025)}
        .modal{border-radius:26px!important;border-color:rgba(125,211,252,.28)!important;box-shadow:0 26px 60px rgba(0,0,0,.48)!important}
        .btn-game{border-radius:16px!important;box-shadow:0 7px 0 rgba(0,0,0,.28),0 10px 20px rgba(0,0,0,.18)!important}
        .btn-game:active{transform:translateY(5px)!important;box-shadow:0 2px 0 rgba(0,0,0,.28)!important}
        @media (max-width:1279px){
            #stage2-left-rail{display:none}
            #game-ui>.absolute.top-16{width:min(900px,calc(100vw - 24px))!important}
        }
        @media (max-width:820px){
            #game-ui>.absolute.top-2{top:8px!important;left:8px!important;right:8px!important}
            #game-ui>.absolute.top-2>.hud-panel{min-height:52px;padding:7px 10px!important}
            #hud-level{font-size:17px!important}
            #game-ui>.absolute.top-2 .flex.gap-2{gap:6px!important}
            #btn-inventory-top,#btn-hint,#btn-sound,#movement-speed-control{min-height:46px!important;min-width:46px!important}
            #btn-exit{min-width:50px!important;width:50px!important;padding:0!important}
            #btn-exit .exit-label{display:none!important}
            #game-ui>.absolute.top-16{top:76px!important;width:calc(100vw - 16px)!important}
            #game-ui>.absolute.top-16>.hud-panel{padding:9px 11px!important;border-radius:18px!important}
            #hud-mission-title{font-size:13px!important}
            #hud-mission-text{font-size:12px!important}
            #scanner-btn-container{right:20px!important;bottom:175px!important}
            #btn-scan{width:72px!important;height:72px!important;border-radius:22px!important}
            #d-pad{right:14px!important;bottom:14px!important}
            .d-btn{border-radius:15px!important}
        }
    `;
    document.head.appendChild(style);

    // Visual palette only: updates existing level colors used by the current canvas renderer.
    try {
        if (Array.isArray(levels)) {
            const palettes = [
                {bg:'#07121f',floor:'#14375c',wall:'#285cc4',wallTop:'#6fb1ff',glow:'#7dd3fc'},
                {bg:'#071d14',floor:'#17613d',wall:'#2faa69',wallTop:'#86efac',glow:'#bbf7d0'},
                {bg:'#190f29',floor:'#4f2a86',wall:'#7c3aed',wallTop:'#c4b5fd',glow:'#d8b4fe'},
                {bg:'#072117',floor:'#21633f',wall:'#2fb06c',wallTop:'#86efac',glow:'#6ee7b7'},
                {bg:'#180b31',floor:'#44247f',wall:'#7c3aed',wallTop:'#c4b5fd',glow:'#d8b4fe'},
                {bg:'#111827',floor:'#0f5f61',wall:'#0f9da8',wallTop:'#67e8f9',glow:'#99f6e4'}
            ];
            levels.forEach((lvl, i) => {
                if (!lvl) return;
                lvl.colors = Object.assign({}, lvl.colors || {}, palettes[Math.min(i, palettes.length - 1)]);
            });
        }
    } catch (_) {}

    // Add a reference-style information rail without changing mission data or mechanics.
    const gameUi = document.getElementById('game-ui');
    if (gameUi && !document.getElementById('stage2-left-rail')) {
        const rail = document.createElement('div');
        rail.id = 'stage2-left-rail';
        rail.innerHTML = `
            <div class="stage2-card">
                <div class="stage2-title">🎯 ДААЛГАВАР</div>
                <div id="stage2-level" class="stage2-level">ТҮВШИН</div>
                <p id="stage2-mission">Даалгавар</p>
            </div>
            <div class="stage2-card">
                <div class="stage2-title">🕹️ ХЭРХЭН ТОГЛОХ ВЭ?</div>
                <ul class="stage2-help">
                    <li><span class="ico">👣</span><span>Дүрээ хөдөлгөж биологийн ойлголтуудыг хайна.</span></li>
                    <li><span class="ico">🔍</span><span><b>Шинжлэх</b> товчоор мэдээллийг харна.</span></li>
                    <li><span class="ico">🧬</span><span>Даалгаварт хамаарах <b>3 зөв ойлголт</b> цуглуулна.</span></li>
                    <li><span class="ico">🔑</span><span><b>3 түлхүүр</b> цуглуулаад хаалгаа нээнэ.</span></li>
                </ul>
            </div>`;
        gameUi.appendChild(rail);
    }

    const syncRail = () => {
        const missionSource = document.getElementById('hud-mission-text');
        const levelSource = document.getElementById('hud-level');
        const missionTarget = document.getElementById('stage2-mission');
        const levelTarget = document.getElementById('stage2-level');
        if (missionSource && missionTarget) missionTarget.textContent = missionSource.textContent || 'Даалгавар';
        if (levelTarget) {
            const grade = (typeof state !== 'undefined' && state && state.grade) ? state.grade : '';
            const level = levelSource ? levelSource.textContent : '';
            levelTarget.textContent = [level, grade].filter(Boolean).join(' — ');
        }
    };
    syncRail();
    const hudMission = document.getElementById('hud-mission-text');
    const hudLevel = document.getElementById('hud-level');
    if (hudMission) new MutationObserver(syncRail).observe(hudMission, {childList:true,subtree:true,characterData:true});
    if (hudLevel) new MutationObserver(syncRail).observe(hudLevel, {childList:true,subtree:true,characterData:true});
    setInterval(syncRail, 1200);

    // Item icon presentation only: keep the exact existing biology icon renderer,
    // but add a consistent soft backplate and clearer silhouette around it.
    try {
        if (typeof drawBioIcon === 'function' && !drawBioIcon.__stage2Wrapped) {
            const originalDrawBioIcon = drawBioIcon;
            const wrapped = function(ctx, data, cx, cy, size) {
                ctx.save();
                const rr = size * .35;
                const g = ctx.createRadialGradient(cx - rr*.22, cy - rr*.26, rr*.12, cx, cy, rr);
                g.addColorStop(0, 'rgba(255,255,255,.14)');
                g.addColorStop(.5, 'rgba(15,23,42,.46)');
                g.addColorStop(1, 'rgba(2,6,23,.12)');
                ctx.fillStyle = g;
                ctx.strokeStyle = 'rgba(134,239,172,.38)';
                ctx.lineWidth = Math.max(1.2, size*.018);
                ctx.shadowColor = 'rgba(45,212,191,.25)';
                ctx.shadowBlur = Math.max(5, size*.10);
                ctx.beginPath();
                ctx.arc(cx, cy, rr, 0, Math.PI*2);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
                return originalDrawBioIcon(ctx, data, cx, cy, size * .94);
            };
            wrapped.__stage2Wrapped = true;
            drawBioIcon = wrapped;
            window.drawBioIcon = wrapped;
        }
    } catch (_) {}
})();
