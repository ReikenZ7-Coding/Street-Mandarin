const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1300, height: 1000 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { Math.random=()=>0.99; });
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP);
  await pg.evaluate(() => { Math.random = () => 0.99; });
  const good = ['我要一碗牛肉面。','不要辣，谢谢。','在这儿吃','扫码'];
  // run 1 with a mistake
  await pg.locator('.opt', { hasText: good[0] }).click();
  await pg.locator('.opt', { hasText: '好的！' }).click();
  for (const h of good.slice(1)) { const o = pg.locator('.opt', { hasText: h }); if (await o.count()) await o.first().click(); }
  for (const h of good) { const o = pg.locator('.opt', { hasText: h }); if (await o.count()) await o.first().click(); }
  console.log('RUN1:', (await pg.locator('.score').innerText()).replace(/\n+/g,' | '));
  await pg.locator('.again .chip', { hasText: 'Normally' }).click();
  for (let i = 0; i < 12 && !(await pg.locator('.score').count()); i++) {
    const h = await pg.evaluate(() => { const t = cur.turns[turn]; return t && t.opts ? t.opts.find(o => o.k === 'good').h : null; });
    if (h && await pg.locator('.opt', { hasText: h }).count()) await pg.locator('.opt', { hasText: h }).first().click(); else await pg.waitForTimeout(300);
  }
  console.log('RUN2:', (await pg.locator('.score').innerText()).replace(/\n+/g,' | '));
  console.log('RAIL:', (await pg.locator('.scn', { hasText: 'Noodle shop' }).innerText()).replace(/\n+/g,' | '), '|', await pg.locator('.rail-sub').last().innerText());
  await pg.locator('.score').screenshot({ path: 'mastery.png' });
  console.log('ERRORS', errs); await b.close();
})();
