const { chromium } = require('./pw');
const openPlace = (pg, n) => pg.evaluate(n => { const s = S.find(x => x.en.includes(n) || x.place === n); if (s && groupOf(s.id) !== railOpen) { setRailOpen(groupOf(s.id)); renderRail(); } }, n);
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1300, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { Math.random=()=>0.99; });
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP);
  for (const [name, picks] of [['Hotpot',['两位。要鸳鸯锅。','特辣！','我们自己去拿，对吧？']],['Taking a photo',['拍我。','竖的，把塔都拍进去。','拍得真好，谢谢你！']],['Parcel pickup',['三一七四。','八八二零。','好的，谢谢！']]]) {
    await openPlace(pg, name); await pg.locator('.scn', { hasText: name }).click();
    for (const h of picks) await pg.locator('.opt', { hasText: h }).first().click();
    console.log(name, '→', (await pg.locator('#move').innerText()).replace(/\n+/g,' | ').slice(0,110));
  }
  console.log('ERRORS', errs); await b.close();
})();
