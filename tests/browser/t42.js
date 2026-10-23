const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [];
  const pg = await b.newPage({ viewport: { width: 1300, height: 1000 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP);
  const first = async () => (await pg.locator('#log .row.npc .bubble').first().innerText()).split('\n')[0];
  console.log('first visit:', await first());
  await pg.evaluate(() => { done.noodles = true; });
  const seen = [];
  for (let k = 0; k < 5; k++) { await pg.evaluate(() => start('noodles')); seen.push(await first()); }
  console.log('later visits:', seen.join(' / '));
  await pg.evaluate(() => { trip = { ids: ['noodles'], day: dayKey() }; startTrip(); });
  await pg.locator('.trip-card details', { hasText: "What you'll hear" }).first().click();
  console.log('pocket:', (await pg.locator('.trip-card details', { hasText: "What you'll hear" }).first().innerText()).replace(/\n+/g, ' | ').slice(0, 220));
  console.log('ERRORS', errs); await b.close();
})();
