const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1300, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP);
  await pg.locator('.scn', { hasText: 'Train your ear' }).click();
  await pg.locator('button', { hasText: 'Number reader' }).click();
  await pg.fill('#move input', '105'); await pg.press('#move input', 'Enter');
  await pg.locator('#move button', { hasText: 'Phone or code' }).click();
  await pg.fill('#move input', '13912345678'); await pg.press('#move input', 'Enter');
  await pg.locator('#move button', { hasText: 'Time' }).click();
  await pg.fill('#move input', 'abc'); await pg.press('#move input', 'Enter');
  console.log((await pg.locator('#log').innerText()).replace(/\n+/g,' | '));
  await pg.screenshot({ path: 'reader.png' });
  console.log('ERRORS', errs); await b.close();
})();
