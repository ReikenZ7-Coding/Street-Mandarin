const { chromium } = require('./pw');
const openPlace = (pg, n) => pg.evaluate(n => { const s = S.find(x => x.en.includes(n) || x.place === n); if (s && groupOf(s.id) !== railOpen) { setRailOpen(groupOf(s.id)); renderRail(); } }, n);
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1300, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { Math.random=()=>0.99; });
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP);
  for (const [name, picks] of [['Dumpling house',['一两有几个？','要三斤猪肉白菜的。','水饺，谢谢。']],['No hot water',['您好，我家没有热水了。','开了。','好的，谢谢。']],['Swapping WeChat',['没事！我们加个微信吧？','我扫你吧。','我叫马修。以后常联系！']]]) {
    await openPlace(pg, name); await pg.locator('.scn', { hasText: name }).click();
    for (const h of picks) await pg.locator('.opt', { hasText: h }).first().click();
    console.log(name, '→', (await pg.locator('#move').innerText()).replace(/\n+/g,' | ').slice(0,120));
  }
  console.log('ERRORS', errs); await b.close();
})();
