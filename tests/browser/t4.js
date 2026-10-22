const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1300, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { Math.random=()=>0.99; });
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP);
  await pg.evaluate(() => { localStorage.setItem('sm-done', JSON.stringify({ noodles: true, hotel: true })); localStorage.setItem('sm-seen-cb', JSON.stringify({ noodles: ['1','2','3'] })); });
  await pg.reload();
  await pg.evaluate(() => { Math.random = () => 0.5; });
  await pg.locator('.scn', { hasText: 'Noodle shop' }).click();
  await pg.locator('.opt', { hasText: '我要一碗牛肉面。' }).click();
  console.log('CB line:', await pg.locator('.row.npc .han').last().innerText());
  await pg.locator('.opt', { hasText: '好，我要牛肉面。' }).click();   // wrong in curveball
  await pg.locator('.opt', { hasText: '那你推荐什么？' }).click();
  for (const h of ['不要辣，谢谢。', '在这儿吃。', '扫码。我扫你吧。']) await pg.locator('.opt', { hasText: h }).first().click();
  console.log('END:', await pg.locator('.row.npc .han').last().innerText(), '|', (await pg.locator('.score').innerText()).replace(/\n+/g,' | '));
  console.log('RAIL sub:', await pg.locator('.rail-sub').last().innerText());
  // review the curveball mistake
  await pg.evaluate(() => { const n = JSON.parse(localStorage.getItem('sm-notebook')); n.forEach(x => x.due = 0); localStorage.setItem('sm-notebook', JSON.stringify(n)); });
  await pg.reload();
  await pg.locator('#tool-nb').click(); await pg.locator('#nb-actions .btn').first().click();
  console.log('REVIEW CB:', (await pg.locator('#log').innerText()).replace(/\n+/g,' | ').slice(0, 160));
  console.log('ERRORS', errs);
  await b.close();
})();
