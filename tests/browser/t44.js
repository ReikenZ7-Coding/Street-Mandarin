const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [];
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.addInitScript(() => { localStorage.setItem('sm-said', '20'); });
  await pg.goto(require('./pw').APP);
  await pg.click('#menu-btn'); await pg.locator('.scn.tool', { hasText: 'Your pocket' }).click();
  await pg.locator('button', { hasText: 'Change places' }).click(); await pg.evaluate(() => { trip.ids = []; renderTrip(); renderMove(); });
  await pg.locator('.trip-pick .chip', { hasText: 'Taking a taxi' }).click();
  const box = await pg.locator('#move .btn', { hasText: 'Get me ready' }).boundingBox();
  console.log('button in view:', box.y > 0 && box.y + box.height <= 844, Math.round(box.y));
  await pg.screenshot({ path: 'sticky.png' });
  await pg.locator('#move .btn', { hasText: 'Get me ready' }).click();
  console.log('ready:', (await pg.locator('#log').innerText()).slice(0, 60));
  console.log('ERRORS', errs); await b.close();
})();
