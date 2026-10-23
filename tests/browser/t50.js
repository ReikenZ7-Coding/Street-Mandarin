const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h, dark] of [[1300, 1000, false], [390, 844, false], [390, 844, true]]) {
    const pg = await b.newPage({ viewport: { width: w, height: h }, colorScheme: dark ? 'dark' : 'light' }); pg.on('pageerror', e => errs.push(e.message));
    await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
    await pg.addInitScript(() => {
      localStorage.setItem('sm-said', '40');
      localStorage.setItem('sm-done', JSON.stringify({ noodles: true, sim: true, hotel: true, directions: true }));
      localStorage.setItem('sm-mastery', JSON.stringify({ noodles: { survived: 1, clean: 1 }, sim: { survived: 1 }, hotel: { survived: 1, clean: 1 }, directions: { survived: 1 } }));
      localStorage.setItem('sm-notebook', JSON.stringify([{ sid: 'directions', turn: 1, said: '前', fix: '后', why: 'w', tag: 'places', t: Date.now(), step: 0, due: Date.now() + 864e5 }, { sid: 'sim', turn: 0, said: 'x', why: 'w', tag: 'numbers', t: Date.now() - 864e5, step: 0, due: 0 }]));
    });
    await pg.goto(require('./pw').APP);
    console.log(w, dark, 'HEAD', (await pg.locator('#scene .scene-head').innerText()).replace(/\n+/g, ' | '));
    console.log('LOG', (await pg.locator('#log').innerText()).replace(/\n+/g, ' | ').slice(0, 900));
    console.log('MOVE', (await pg.locator('#move').innerText()).replace(/\n+/g, ' | '), 'hscroll', await pg.evaluate(() => document.documentElement.scrollWidth > innerWidth));
    await pg.screenshot({ path: `day-${w}${dark ? '-dark' : ''}.png`, fullPage: true });
    if (w < 500) console.log('menu', await pg.locator('#menu-btn').innerText());
    // the can-do list opens
    await pg.locator('.cando-head').click(); console.log('CAN', (await pg.locator('.cd-list').innerText()).replace(/\n+/g, ' / ').slice(0, 200));
    // day 1 view shows evening
    await pg.locator('.day-dot', { hasText: /^1$/ }).click();
    console.log('DAY1', (await pg.locator('#log').innerText()).replace(/\n+/g, ' | ').slice(0, 400));
    // go to next stop from day 2 and see the bridge
    await pg.locator('.day-dot', { hasText: /^2$/ }).click();
    await pg.locator('#move .btn', { hasText: /^Go:/ }).click();
    console.log('SCENE', (await pg.locator('#log').innerText()).replace(/\n+/g, ' | ').slice(0, 250));
    if (w < 500) { await pg.locator('#menu-btn').click(); console.log('RAIL', (await pg.locator('#rail').innerText()).replace(/\n+/g, ' | ').slice(0, 400)); }
    await pg.close();
  }
  console.log('ERRORS', errs); await b.close();
})();
