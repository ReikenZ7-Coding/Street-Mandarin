const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [];
  const pg = await b.newPage({ viewport: { width: 1300, height: 1000 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.addInitScript(() => { Math.random = () => 0.99; });
  await pg.goto(require('./pw').APP);
  await pg.locator('#move .chip', { hasText: 'Build it' }).click();
  console.log('bank:', (await pg.locator('#move .bank').innerText()).replace(/\n+/g, ' '));
  for (const w of ['我', '要', '一碗', '牛肉面']) await pg.locator('#move .bank .tile', { hasText: w }).first().click();
  await pg.screenshot({ path: 'tiles.png' });
  await pg.locator('#move .build .btn', { hasText: 'Send it' }).click();
  console.log('after:', (await pg.locator('#log').innerText()).split('\n').slice(-3).join(' | '));
  await pg.evaluate(() => (prefs.py = true, prefs.en = false, setShow('py'))); await pg.evaluate(() => renderMove());
  console.log('chars level bank:', (await pg.locator('#move .bank').innerText()).replace(/\n+/g, ' '));
  console.log('ERRORS', errs); await b.close();
})();
