const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [];
  const pg = await b.newPage({ viewport: { width: 1300, height: 1000 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.addInitScript(() => {
    const d = new Date(), k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    localStorage.setItem('sm-said', '5'); localStorage.setItem('sm-trip', JSON.stringify({ ids: ['noodles'], day: k }));
    localStorage.setItem('sm-notebook', JSON.stringify([{ sid: 'noodles', turn: 0, said: '我是牛肉面', why: '是 links two things that are the same.', fix: '我要一碗牛肉面。', fixPy: 'x', due: 9e15, step: 0, t: 1 }]));
  });
  await pg.goto(require('./pw').APP);
  console.log('today:', (await pg.locator('#log').innerText()).replace(/\n+/g, ' | '));
  await pg.locator('.today-card', { hasText: 'Lines for' }).click();
  console.log('traps:', (await pg.locator('.trip-card details').first().innerText()).replace(/\n+/g, ' | ').slice(0, 400));
  await pg.screenshot({ path: 'mytraps.png', fullPage: true });
  // counter
  await pg.evaluate(() => start('noodles'));
  console.log('counter:', await pg.locator('#move h3').first().innerText());
  console.log('ERRORS', errs); await b.close();
})();
