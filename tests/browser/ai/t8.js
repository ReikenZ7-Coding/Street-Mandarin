const H = require('./h.js');
(async () => {
  for (const [w, h] of [[1300, 900], [390, 844]]) {
    const { br, pg, errs, shot, ev, txt } = await H(w, h, { 'sm-said': '1' });
    await ev(() => startChat('chen')); await pg.waitForTimeout(100);
    for (const m of ['我今天很累，工作太多了。', '你的店几点开门？', '明天见']) { await pg.fill('#chat-input', m); await pg.press('#chat-input', 'Enter'); await pg.waitForTimeout(900); }
    await shot(`chat-${w}-100`);
    for (let i = 0; i < 6; i++) { const b = pg.locator('#ts-seg [data-d="1"]'); if (await b.isDisabled()) break; await b.click(); }
    await pg.waitForTimeout(100);
    const z = await ev(() => $('#scene').style.zoom);
    await ev(() => { const l = $('#log'); l.scrollTop = l.scrollHeight; });
    await shot(`chat-${w}-big`);
    const info = await ev(() => { const r = s => { const e = $(s); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.top), Math.round(b.bottom), Math.round(b.height)]; }; return { scene: r('#scene'), head: r('.scene-head'), log: r('#log'), move: r('#move'), sw: document.documentElement.scrollWidth, sh: document.documentElement.scrollHeight, logScroll: [$('#log').scrollHeight, $('#log').clientHeight] }; });
    console.log(w, 'zoom', z, JSON.stringify(info));
    console.log('errs', errs);
    await br.close();
  }
})();
