const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [];
  const pg = await b.newPage({ viewport: { width: 1100, height: 900 }, colorScheme: 'dark' }); pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.addInitScript(() => { localStorage.setItem('sm-said', '9'); localStorage.setItem('sm-done', JSON.stringify({ noodles: true })); localStorage.setItem('sm-notebook', JSON.stringify([{ sid: 'noodles', turn: 1, said: '我不辣', why: 'Needs a verb.', fix: '不要辣。', fixPy: 'Bú yào là.', due: 0, step: 1, t: 1 }])); window.SpeechRecognition = class {}; });
  await pg.goto(require('./pw').APP);
  await pg.screenshot({ path: 'dark-today.png' });
  await pg.locator('.today-card').first().click();
  await pg.locator('#move .linkish', { hasText: 'stuck' }).click();
  await pg.locator('#move .opt').first().click();
  await pg.screenshot({ path: 'dark-review.png' });
  console.log('ERRORS', errs); await b.close();
})();
