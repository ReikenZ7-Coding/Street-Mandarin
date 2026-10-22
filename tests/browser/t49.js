const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h] of [[1300, 900], [390, 844]]) {
    const pg = await b.newPage({ viewport: { width: w, height: h } }); pg.on('pageerror', e => errs.push(e.message));
    await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
    await pg.addInitScript(() => { localStorage.setItem('sm-prefs', JSON.stringify({ how: 'build' })); window.claude = { use: async () => ({ json: async () => ({ reply: ['好的', 'hǎo de', 'OK'] }) }) }; });
    await pg.goto(require('./pw').APP);
    await pg.waitForTimeout(1500);
    console.log(w, 'form before:', await pg.locator('#move form.free').count(), '| link:', await pg.locator('#move .free-open').count());
    for (const word of ['我', '要', '一碗', '牛肉面']) await pg.locator('#move .bank .tile', { hasText: word }).first().click();
    await pg.screenshot({ path: `build-${w}.png` });
    await pg.locator('#move .build .btn', { hasText: 'Send it' }).click();
    await pg.waitForTimeout(800);
    console.log(w, 'after send:', (await pg.locator('#log .me').last().innerText()).replace(/\n+/g, ' '));
    await pg.locator('#move .free-open').click();
    console.log(w, 'form after open:', await pg.locator('#move form.free').count(), 'focused:', await pg.evaluate(() => document.activeElement.id));
    await pg.close();
  }
  console.log('ERRORS', errs); await b.close();
})();
