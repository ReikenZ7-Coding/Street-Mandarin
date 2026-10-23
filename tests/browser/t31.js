const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch();
  for (const [w, h, name] of [[1300, 1000, 'rail-d'], [390, 800, 'rail-m']]) {
    const pg = await b.newPage({ viewport: { width: w, height: h } });
    const errs = []; pg.on('pageerror', e => errs.push(e.message));
    await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
    await pg.addInitScript(() => { Math.random = () => 0.99; });
    await pg.goto(require('./pw').APP);
    await pg.evaluate(() => localStorage.setItem('sm-done', JSON.stringify({ noodles: true, dumplings: true, taxi: true })));
    await pg.reload(); await pg.waitForTimeout(200);
    console.log(name, 'rail:', (await pg.locator('#rail').innerText()).replace(/\n+/g, ' | ').slice(0, 900));
    await pg.screenshot({ path: name + '.png', fullPage: w > 500 });
    if (w < 500) await pg.click('#menu-btn');
    await pg.locator('.folder', { hasText: 'Day 2' }).click();
    console.log(name, 'after open:', (await pg.locator('.folder[aria-expanded=true]').innerText()).replace(/\n+/g,' '), '| places shown:', await pg.locator('#rail .scn:not(.tool)').count());
    await pg.locator('.scn', { hasText: 'Metro ticket' }).click();
    console.log(name, 'head:', (await pg.locator('#place').innerText()));
    await pg.screenshot({ path: name + '2.png', fullPage: w > 500 });
    console.log('ERRORS', errs); await pg.close();
  }
  await b.close();
})();
