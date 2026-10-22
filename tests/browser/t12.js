const { chromium } = require('./pw');
const openPlace = (pg, n) => pg.evaluate(n => { const s = S.find(x => x.en.includes(n) || x.place === n); if (s && groupOf(s.id) !== railOpen) { setRailOpen(groupOf(s.id)); renderRail(); } }, n);
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1300, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { Math.random=()=>0.99; });
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.addInitScript(() => { window.__p = []; window.claude = { use: async () => ({ json: async (p) => { window.__p.push(p); return { why: '十 shí rises; 四 sì falls.', tip: 'Ten goes up the stairs.' }; } }) }; });
  await pg.goto(require('./pw').APP);
  await openPlace(pg, 'Hospital'); await pg.locator('.scn', { hasText: 'Hospital' }).click();
  await pg.locator('.opt', { hasText: '我兔子疼。' }).click();
  await pg.locator('.why-btn').first().click();
  await pg.locator('.why-out').waitFor();
  console.log('WHY:', await pg.locator('.why-out').innerText());
  console.log('Claude calls for a scripted slip (want 0):', await pg.evaluate(() => (window.__p||[]).length));
  console.log('ERRORS', errs); await b.close();
})();
