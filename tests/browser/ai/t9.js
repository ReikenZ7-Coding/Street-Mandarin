const H = require('./h.js');
(async () => {
  for (const [w, h] of [[390, 844], [1300, 900]]) {
    const { br, pg, errs, shot, ev, txt } = await H(w, h, { 'sm-said': '1' });
    await ev(() => { startLong(); }); await pg.waitForTimeout(100);
    await shot(`ls-setup-${w}`);
    await pg.evaluate(() => window.scrollTo(0, 99999)); await shot(`ls-setup-${w}-bottom`);
    await ev(() => { window.__delay = 600; });
    await pg.click('#move .btn:has-text("Begin the story")'); await pg.waitForTimeout(50);
    await pg.evaluate(() => window.scrollTo(0, 0)); await shot(`ls-planning-${w}`);
    await pg.waitForTimeout(800);
    await shot(`ls-writing-${w}`);
    await pg.waitForTimeout(700);
    for (let i = 0; i < 6; i++) { const b = pg.locator('#ts-seg [data-d="1"]'); if (await b.isDisabled()) break; await b.click(); }
    await ev(() => { window.__delay = 30; });
    await pg.click('#move .btn:has-text("Your line")'); await pg.waitForTimeout(300);
    await shot(`ls-moment-${w}-big`);
    console.log(w, 'sw', await ev(() => [document.documentElement.scrollWidth, innerWidth, $('#scene').style.zoom]));
    console.log(w, 'move rect', await ev(() => JSON.stringify($('#move').getBoundingClientRect())));
    await pg.click('#move .chip:has-text("Build")'); await pg.waitForTimeout(100);
    await shot(`ls-build-${w}-big`);
    const idx = await ev(() => order.findIndex(o => o.k === 'good'));
    await pg.click('#move .chip:has-text("Pick")');
    await pg.locator('#move .opt').nth(idx).click(); await pg.waitForTimeout(200);
    await shot(`ls-picked-${w}-big`);
    console.log('errs', errs);
    await br.close();
  }
})();
