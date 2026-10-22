const { chromium } = require('./pw');
const openPlace = (pg, n) => pg.evaluate(n => { const s = S.find(x => x.en.includes(n) || x.place === n); if (s && groupOf(s.id) !== railOpen) { setRailOpen(groupOf(s.id)); renderRail(); } }, n);
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1300, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { Math.random=()=>0.99; });
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP);
  for (const [name, picks] of [['Café',['一杯冰拿铁，谢谢。','中杯就行。','Wi-Fi密码是多少？']],['Bike share',['大爷，能帮我一下吗？','我扫了码，可是打不开。','谢谢！']],['Hospital',['我兔子疼。','我肚子疼，不知道挂什么科。','没有，我自费。','三楼，等叫号，对吗？']]]) {
    await openPlace(pg, name); await pg.locator('.scn', { hasText: name }).click();
    for (const h of picks) await pg.locator('.opt', { hasText: h }).first().click();
    console.log(name, '→', (await pg.locator('#move').innerText()).replace(/\n+/g,' | ').slice(0,90));
  }
  // type mode on cafe wifi line (fresh visit, so no surprise)
  await pg.evaluate(() => localStorage.removeItem('sm-done')); await pg.reload();
  await openPlace(pg, 'Café'); await pg.locator('.scn', { hasText: 'Café' }).click();
  await pg.locator('.opt', { hasText: '一杯冰拿铁，谢谢。' }).click();
  await pg.locator('.opt', { hasText: '中杯就行。' }).click();
  await pg.locator('button', { hasText: /^Type/ }).click();
  const inp = pg.locator('#move input[type=text]').first();
  await inp.fill('wifi mima shi duoshao'); await inp.press('Enter');
  console.log('TYPED:', (await pg.locator('.fb').last().innerText().catch(()=>pg.locator('#log').innerText())).replace(/\n+/g,' | ').slice(0,160));
  console.log('ERRORS', errs); await b.close();
})();
