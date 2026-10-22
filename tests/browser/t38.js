const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h] of [[1300, 900], [390, 844]]) {
    const pg = await b.newPage({ viewport: { width: w, height: h } }); pg.on('pageerror', e => errs.push(e.message));
    await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
    await pg.addInitScript(() => {
      localStorage.setItem('sm-said', '12'); localStorage.setItem('sm-done', JSON.stringify({ noodles: true }));
      localStorage.setItem('sm-notebook', JSON.stringify([0, 1].map(i => ({ sid: 'noodles', turn: i, said: 'x' + i, why: 'Because.', fix: '我要一碗牛肉面。', fixPy: 'Wǒ yào', due: i ? Date.now() + 3e8 : 0, step: i, t: Date.now() }))));
    });
    await pg.goto(require('./pw').APP);
    await pg.screenshot({ path: `hdr-${w}.png` });
    if (w < 500) await pg.click('#menu-btn');
    await pg.click('#tool-nb');
    await pg.screenshot({ path: `nb-${w}.png`, fullPage: w > 500 });
    await pg.close();
  }
  console.log('ERRORS', errs); await b.close();
})();
