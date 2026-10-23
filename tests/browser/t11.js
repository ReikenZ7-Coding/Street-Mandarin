const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1300, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP);
  await pg.locator('.scn', { hasText: 'Train your ear' }).click(); await pg.locator('.chip', { hasText: 'Sound-alikes' }).click();
  for (let i = 0; i < 8; i++) { await pg.keyboard.press('2'); await pg.evaluate(() => document.activeElement.blur()); await pg.keyboard.press('Enter'); }
  console.log('KEYS END:', (await pg.locator('#move').innerText()).replace(/\n+/g,' | '));
  await pg.evaluate(() => { const n = JSON.parse(localStorage.getItem('sm-notebook')); n.forEach(x => x.due = 0); localStorage.setItem('sm-notebook', JSON.stringify(n)); });
  await pg.reload();
  await pg.locator('#tool-nb').click(); await pg.locator('#nb-actions .btn').first().click();
  console.log('REVIEW:', (await pg.locator('#log').innerText()).replace(/\n+/g,' | ').slice(0,120), '|| opts:', (await pg.locator('#move').innerText()).replace(/\n+/g,' | '));
  await pg.keyboard.press('1');
  console.log('AFTER:', (await pg.locator('#log').innerText()).replace(/\n+/g,' | ').slice(-200));
  console.log('ERRORS', errs); await b.close();
})();
