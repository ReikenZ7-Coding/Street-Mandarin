const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1300, height: 1000 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { Math.random=()=>0.99; });
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP);
  // noodle run with two misses
  await pg.locator('.opt', { hasText: '我是牛肉面。' }).click();
  await pg.locator('.opt', { hasText: '我要一碗牛肉面。' }).click();
  await pg.locator('.opt', { hasText: '不要辣，谢谢。' }).click();
  await pg.locator('.opt', { hasText: '在这儿吃' }).click();
  await pg.locator('.opt', { hasText: '给你八十块。' }).click();
  for (let i = 0; i < 3; i++) { const o = pg.locator('#move .opt'); if (await o.count()) { const g = pg.locator('.opt', { hasText: '扫码' }); if (await g.count()) await g.first().click(); else break; } }
  console.log('END:', (await pg.locator('#move').innerText()).replace(/\n+/g,' | ').slice(0,200));
  console.log('PATTERNS:', (await pg.locator('#nb-patterns').innerText()).replace(/\n+/g,' | '));
  await pg.locator('button', { hasText: /^Rematch/ }).click();
  console.log('REMATCH:', (await pg.locator('#log').innerText()).replace(/\n+/g,' | ').slice(0,260));
  await pg.locator('.opt', { hasText: '我要一碗牛肉面。' }).click();
  console.log('REMATCH 2:', (await pg.locator('#log').innerText()).replace(/\n+/g,' | ').slice(-200));
  await pg.screenshot({ path: 'rematch.png' });
  // pattern drill
  await pg.locator('#tool-nb').click(); await pg.locator('.pt-row').first().click();
  console.log('DRILL:', (await pg.locator('.scene-head, header.scene-head, #scene').first().innerText()).replace(/\n+/g,' | ').slice(0,260));
  for (let i = 0; i < 8; i++) { await pg.locator('#move .opt').first().click(); await pg.locator('#move .endcard .btn').first().click(); }
  console.log('DRILL END:', (await pg.locator('#move').innerText()).replace(/\n+/g,' | '));
  await pg.screenshot({ path: 'patterns.png' });
  console.log('ERRORS', errs); await b.close();
})();
