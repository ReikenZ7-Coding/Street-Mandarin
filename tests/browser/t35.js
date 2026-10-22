const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1300, height: 1000 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.addInitScript(() => { Math.random = () => 0.99; localStorage.setItem('sm-done', JSON.stringify({ noodles: true, taxi: true, toilet: true })); });
  await pg.goto(require('./pw').APP);
  for (const q of ['toilet', '多少', 'duoshao', 'train', 'zzz']) {
    await pg.fill('.rail-find', q); await pg.waitForTimeout(100);
    console.log(q, '→', (await pg.locator('.rail-places').innerText()).replace(/\n+/g, ' | ').slice(0, 200));
  }
  await pg.fill('.rail-find', 'train');
  await pg.locator('.rail-places .linkish').click();
  console.log('pocket:', (await pg.locator('#log').innerText()).replace(/\n+/g, ' | ').slice(0, 150));
  await pg.fill('.rail-find', '');
  console.log('cleared:', (await pg.locator('.rail-places').innerText()).replace(/\n+/g, ' | ').slice(0, 80));
  await pg.screenshot({ path: 'find.png' });
  console.log('ERRORS', errs); await b.close();
})();
