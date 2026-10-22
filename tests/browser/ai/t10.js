const H = require('./h.js');
(async () => {
  for (const [w, h] of [[390, 844], [1300, 900]]) {
    const { br, pg, errs, shot, ev, txt } = await H(w, h, { 'sm-said': '1' });
    await ev(() => { startLong(); }); await pg.click('#move .btn:has-text("Begin the story")'); await pg.waitForTimeout(500);
    for (let i = 0; i < 6; i++) { const b = pg.locator('#ts-seg [data-d="1"]'); if (await b.isDisabled()) break; await b.click(); }
    await pg.click('#move .btn:has-text("Your line")'); await pg.waitForTimeout(300);
    await pg.evaluate(() => window.scrollTo(0, 1e6)); await pg.waitForTimeout(200);
    await shot(`ls-moment-${w}-bottom`);
    const r = await ev(() => [...document.querySelectorAll('#move .opt')].map(o => { const b = o.getBoundingClientRect(); return [Math.round(b.top), Math.round(b.bottom)]; }));
    console.log(w, 'opts', JSON.stringify(r), 'vh', h, 'scrollY', await ev(() => [scrollY, document.documentElement.scrollHeight]));
    await br.close();
  }
})();
