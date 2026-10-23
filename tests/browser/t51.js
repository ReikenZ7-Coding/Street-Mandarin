const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = []; const pg = await b.newPage(); pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP);
  for (const id of ['noodles', 'sim', 'hotel']) {
    await pg.evaluate(id => start(id), id);
    for (let i = 0; i < 12; i++) {
      if (await pg.locator('#move .score').count()) break;
      const good = await pg.evaluate(() => { const t = cur.turns[turn]; return t && t.opts.find(o => o.k === 'good').h; });
      if (!good) break;
      const c = pg.locator('#move .opt', { hasText: good }).first();
      if (await c.count()) await c.click(); else { const ch = pg.locator('#move .chip', { hasText: 'Pick it' }); await ch.click(); await pg.locator('#move .opt', { hasText: good }).first().click(); }
      await pg.waitForTimeout(1300);
    }
    console.log(id, '|', (await pg.locator('#move .score').innerText()).replace(/\n+/g, ' | '), '| BTN', await pg.locator('#move .endcard .btn').first().innerText());
  }
  await pg.locator('#move .endcard .btn').first().click();
  console.log('EVENING', (await pg.locator('#log').innerText()).replace(/\n+/g, ' | ').slice(-500));
  console.log('MOVE', await pg.locator('#move').innerText());
  console.log('ERRORS', errs); await b.close();
})();
