const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP);
  await pg.evaluate(() => { localStorage.setItem('sm-done', JSON.stringify({ noodles: 1 })); localStorage.setItem('sm-mastery', JSON.stringify({ noodles: { survived: 1, clean: 1 } })); localStorage.setItem('sm-notebook', JSON.stringify([{ sid: 'noodles', turn: 3, kind: 'wrong', said: '给你八十块。', fix: '扫码。', fixPy: 'Sǎo mǎ.', why: '十八 is 18.', t: 1, step: 0, due: 9e15 }, { sid: 'noodles', turn: 0, kind: 'wrong', said: '我是牛肉面。', fix: '我要一碗牛肉面。', fixPy: '', why: 'x', t: 1, step: 0, due: 9e15 }])); });
  await pg.reload();
  const w = await pg.evaluate(() => document.documentElement.scrollWidth); console.log('scrollW', w);
  await pg.click('#menu-btn'); await pg.locator('.scn', { hasText: 'Your pocket' }).click();
  await pg.screenshot({ path: 'm-trip.png' });
  await pg.click('#menu-btn'); await pg.locator('#tool-nb').click(); await pg.locator('#nb-patterns').scrollIntoViewIfNeeded();
  await pg.locator('#nb-patterns').screenshot({ path: 'm-pat.png' });
  console.log('scrollW', await pg.evaluate(() => document.documentElement.scrollWidth));
  console.log('ERRORS', errs); await b.close();
})();
