const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1300, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP);
  // a sounds slip in the café, then sound-alikes should include it
  await pg.locator('.rail-find').fill('Café'); await pg.locator('.scn', { hasText: 'Café' }).click();
  await pg.locator('.opt', { hasText: '一杯病拿铁。' }).click();
  await pg.locator('.scn', { hasText: 'Train your ear' }).click(); await pg.locator('.chip', { hasText: 'Sound-alikes' }).click();
  let mine = 0;
  for (let i = 0; i < 8; i++) { if ((await pg.locator('#move .prompt').innerText()).includes('your own')) mine++; await pg.locator('#move .opt').first().click(); await pg.locator('#move .endcard .btn').first().click(); }
  console.log('own pairs in round:', mine);
  // off-script review typed
  await pg.evaluate(() => { localStorage.setItem('sm-notebook', JSON.stringify([{ sid: 'wander', turn: null, kind: 'wrong', said: 'my code is 1234', fix: '我的取件码是1234。', fixPy: 'Wǒ de qǔjiànmǎ shì 1234.', why: 'English only.', t: 1, step: 0, due: 0 }])); localStorage.setItem('sm-wander-lines', JSON.stringify([{ h: '我要退货', p: '', e: 'Shoe shop' }])); });
  await pg.reload();
  await pg.locator('#tool-nb').click(); await pg.locator('#nb-actions .btn').first().click();
  await pg.fill('#move input', 'wo de qujianma shi 1234'); await pg.press('#move input', 'Enter');
  console.log('TYPED REVIEW:', (await pg.locator('#log').innerText()).replace(/\n+/g,' | ').slice(-160));
  await pg.locator('.scn', { hasText: 'Your pocket' }).click(); await pg.locator('.chip', { hasText: 'Every line' }).click();
  console.log('PB:', await pg.locator('.pb-title').allInnerTexts());
  console.log('ERRORS', errs); await b.close();
})();
