const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1300, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP);
  await pg.locator('.scn', { hasText: 'Train your ear' }).click(); await pg.locator('.chip', { hasText: 'Sound-alikes' }).click();
  for (let i = 0; i < 8; i++) {
    await pg.locator('#move .opt').first().click();
    await pg.locator('#move .btn').first().click();
  }
  console.log('END:', (await pg.locator('#move').innerText()).replace(/\n+/g,' | '));
  await pg.locator('.scn', { hasText: 'Train your ear' }).click(); await pg.locator('.chip', { hasText: 'Sound-alikes' }).click();
  await pg.locator('#move .opt').nth(1).click();
  await pg.screenshot({ path: 'ears.png' });
  console.log('NB count', await pg.evaluate(() => JSON.parse(localStorage.getItem('sm-notebook') || '[]').length));
  await pg.setViewportSize({ width: 390, height: 800 });
  console.log('scrollW', await pg.evaluate(() => document.documentElement.scrollWidth));
  console.log('ERRORS', errs); await b.close();
})();
