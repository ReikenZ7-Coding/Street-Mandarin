const { chromium } = require('./pw');
const openPlace = (pg, n) => pg.evaluate(n => { const s = S.find(x => x.en.includes(n) || x.place === n); if (s && groupOf(s.id) !== railOpen) { setRailOpen(groupOf(s.id)); renderRail(); } }, n);
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1300, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { Math.random=()=>0.99; });
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP);
  for (const [name, picks] of [['Fruit stall',['橘子多少钱一斤？','要十斤。','便宜一点行吗？']],['Food delivery',['好的，我马上下来，南门。','八号楼。不用了，我下去拿。','谢谢，辛苦了！']],['Train station',['一张去杭州的票，今天的。','三点十分可以，高铁。','给你。要靠窗的，谢谢。']],['Returning',['这件衣服我昨天买的，太小了。','好，换大一号的。','这件正好，谢谢！']]]) {
    await openPlace(pg, name); await pg.locator('.scn', { hasText: name }).click();
    for (const h of picks) await pg.locator('.opt', { hasText: h }).first().click();
    console.log(name, '→', (await pg.locator('#move').innerText()).replace(/\n+/g,' | ').slice(0,140));
  }
  console.log('RAIL:', await pg.locator('.rail-sub').innerText().catch(()=>'-'));
  console.log('ERRORS', errs); await b.close();
})();
