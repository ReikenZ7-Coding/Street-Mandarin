const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1300, height: 1000 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP);
  await pg.locator('.scn', { hasText: 'Your pocket' }).click();
  // it opens on today's stops now; start from an empty plan to pick two
  await pg.locator('button', { hasText: 'Change places' }).click(); await pg.evaluate(() => { trip.ids = []; renderTrip(); renderMove(); });
  await pg.locator('.trip-pick .chip', { hasText: 'Hotpot' }).click();
  await pg.locator('.trip-pick .chip', { hasText: 'Metro ticket' }).click();
  await pg.locator('button', { hasText: 'Get me ready' }).click();
  console.log('SHEET:', await pg.locator('.pb-title').allInnerTexts(), '| rows', await pg.locator('.pb-row').count());
  await pg.screenshot({ path: 'trip.png' });
  console.log('RAIL:', (await pg.locator('.scn', { hasText: 'Your pocket' }).innerText()).replace(/\n/g,' | '));
  await pg.locator('button', { hasText: 'Warm up' }).click();
  let n = 0; while (await pg.locator('#move .opt').count()) { await pg.locator('#move .opt').first().click(); await pg.locator('#move .endcard .btn').first().click(); n++; if (n > 20) break; }
  console.log('WARMUP:', n, (await pg.locator('#move').innerText()).replace(/\n+/g,' | '));
  await pg.reload();
  await pg.locator('.scn', { hasText: 'Your pocket' }).click();
  console.log('PERSIST:', await pg.locator('.pb-title').allInnerTexts());
  console.log('ERRORS', errs); await b.close();
})();
