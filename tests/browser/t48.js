const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h, dark] of [[1300, 1000, false], [390, 844, false], [390, 844, true]]) {
    const pg = await b.newPage({ viewport: { width: w, height: h }, colorScheme: dark ? 'dark' : 'light' }); pg.on('pageerror', e => errs.push(e.message));
    await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
    await pg.addInitScript(() => { localStorage.setItem('sm-said', '40'); localStorage.setItem('sm-done', JSON.stringify({ noodles: true })); });
    await pg.goto(require('./pw').APP);
    const t1 = (await pg.locator('.daily').innerText()).replace(/\n+/g, ' | ');
    console.log(w, dark, t1.slice(0, 400));
    console.log('cards', await pg.locator('.daily-card').count(), 'hscroll', await pg.evaluate(() => document.documentElement.scrollWidth > innerWidth));
    await pg.locator('.daily').scrollIntoViewIfNeeded();
    await pg.screenshot({ path: `daily-${w}${dark ? '-dark' : ''}.png`, fullPage: false });
    await pg.getByRole('button', { name: 'Another three' }).click();
    const t2 = (await pg.locator('.daily').innerText()).replace(/\n+/g, ' | ');
    console.log('changed', t1 !== t2);
    const go = pg.locator('.daily-card button', { hasText: /^Try it:/ }).first();
    if (await go.count()) { const lab = await go.innerText(); await go.click(); console.log(lab, '->', await pg.locator('#place-en').innerText()); }
    await pg.close();
  }
  // every day for a month: all three present, and no set repeats
  const pg = await b.newPage(); await pg.goto(require('./pw').APP);
  const r = await pg.evaluate(() => { const seen = new Set(); let miss = 0; for (let s = 0; s < 30; s++) { const set = DAILY_KINDS.map(([k]) => (dailyPick(k, s) || {}).h); if (set.includes(undefined)) miss++; seen.add(set.join()); } const words = new Set([...Array(30)].map((_, s) => dailyPick('word', s).h)); return { miss, sets: seen.size, words: words.size }; });
  console.log('month', JSON.stringify(r));
  console.log('ERRORS', errs); await b.close();
})();
