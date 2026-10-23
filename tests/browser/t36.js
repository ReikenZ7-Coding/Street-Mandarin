const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h] of [[1300, 1000], [390, 844]]) {
    const pg = await b.newPage({ viewport: { width: w, height: h } }); pg.on('pageerror', e => errs.push(e.message));
    await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
    await pg.addInitScript(() => {
      const d = new Date(), k = x => `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`;
      const y = new Date(d); y.setDate(d.getDate() - 1);
      localStorage.setItem('sm-said', '40'); localStorage.setItem('sm-days', JSON.stringify([k(y), k(d)]));
      localStorage.setItem('sm-done', JSON.stringify({ noodles: true, dumplings: true }));
      localStorage.setItem('sm-mastery', JSON.stringify({ noodles: { survived: 1, clean: 1 }, dumplings: { survived: 1 } }));
      const nb = [0,1,2].map(i => ({ sid: 'noodles', turn: i, said: 'x' + i, why: 'w', due: 0, right: 0 }));
      localStorage.setItem('sm-notebook', JSON.stringify(nb));
    });
    await pg.goto(require('./pw').APP);
    console.log(w, 'head:', await pg.locator('#scene .scene-head').innerText().then(t => t.replace(/\n+/g, ' | ')));
    console.log(w, 'cards:', (await pg.locator('#log').innerText()).replace(/\n+/g, ' | '));
    if (w < 500) console.log('menu:', await pg.locator('#menu-btn').innerText().then(t => t.replace(/\n+/g, ' ')));
    await pg.screenshot({ path: `today-${w}.png`, fullPage: false });
    await pg.locator('.stops .today-card').nth(0).click();
    console.log(w, 'after click:', await pg.locator('#place-en').innerText());
    await pg.locator('#home-btn').click();
    console.log(w, 'back home:', await pg.locator('#place-en').innerText());
    await pg.close();
  }
  // first visit lands in the noodle shop
  const pg = await b.newPage(); await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP);
  console.log('first visit:', await pg.locator('#place-en').innerText(), '| home cards:', await pg.locator('.today-card').count());
  await pg.locator('#home-btn').click();
  console.log('new user home:', (await pg.locator('#log').innerText()).replace(/\n+/g, ' | '));
  console.log('ERRORS', errs); await b.close();
})();
