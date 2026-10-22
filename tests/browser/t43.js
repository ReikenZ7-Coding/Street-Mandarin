const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [];
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.addInitScript(() => { localStorage.setItem('sm-said', '20'); localStorage.setItem('sm-done', JSON.stringify({ noodles: true, taxi: true })); localStorage.setItem('sm-notebook', JSON.stringify([{ sid: 'noodles', turn: 1, said: '我不辣', why: 'Needs a verb.', fix: '不要辣。', fixPy: 'Bú yào là.', due: 0, step: 1, t: 1 }])); });
  await pg.goto(require('./pw').APP);
  const shot = async n => pg.screenshot({ path: `ph-${n}.png`, fullPage: true });
  await shot('today');
  await pg.click('#menu-btn'); await shot('menu');
  await pg.locator('#tool-nb').click(); await shot('nb');
  await pg.locator('#nb-actions .btn').first().click(); await shot('review');
  await pg.click('#menu-btn'); await pg.locator('.scn.tool', { hasText: 'Train your ear' }).click(); await shot('ear');
  await pg.click('#menu-btn'); await pg.locator('.scn.tool', { hasText: 'Your pocket' }).click(); await shot('pocket');
  console.log('ERRORS', errs); await b.close();
})();
