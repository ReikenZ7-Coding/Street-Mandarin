const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1300, height: 1000 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.addInitScript(() => { Math.random = () => 0.99; localStorage.setItem('sm-done', JSON.stringify({ noodles: true })); localStorage.setItem('sm-said', '5'); });
  await pg.goto(require('./pw').APP);
  // speed timers up
  await pg.evaluate(() => { const st = window.setTimeout; window.setTimeout = (f, ms, ...a) => st(f, Math.min(ms, 300), ...a); });
  await pg.evaluate(() => start('noodles', { rush: true }));
  console.log('bar?', await pg.locator('#move .rush').count());
  await pg.waitForTimeout(600);
  console.log('after wait:', (await pg.locator('#log').innerText()).replace(/\n+/g, ' | ').slice(-160));
  for (let i = 0; i < 10 && !(await pg.locator('.score').count()); i++) {
    const h = await pg.evaluate(() => { const t = cur.turns[turn]; return t && t.opts ? t.opts.find(o => o.k === 'good').h : null; });
    if (h) await pg.locator('.opt', { hasText: h }).first().click(); await pg.waitForTimeout(100);
  }
  console.log('END:', (await pg.locator('#move').innerText()).replace(/\n+/g, ' | '));
  await pg.locator('#move').screenshot({ path: 'rush-end.png' });
  // help dial
  await pg.locator('.seg button', { hasText: 'Ears' }).click().catch(() => console.log('no Ears button (no speech)'));
  console.log('prefs', await pg.evaluate(() => JSON.stringify(prefs)));
  console.log('ERRORS', errs); await b.close();
})();
