// The real clips through the day: each time of day plays its own shot, graded so none goes too dark or too bright
const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [], bad = [];
  const pg = await b.newPage({ viewport: { width: 1300, height: 860 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP); await pg.waitForTimeout(5200);
  for (const t of ['morning', 'out', 'evening']) {
    await pg.evaluate(t => { document.querySelector('.scenery').dataset.time = t; }, t); await pg.waitForTimeout(2600);
    const s = await pg.evaluate(() => { const v = document.querySelector('.jw-film video.on'); return { shot: jadeF.shot.src, time: jadeF.shot.time, f: v && getComputedStyle(v).filter }; });
    if (s.time && s.time !== t) bad.push(t + ': ' + JSON.stringify(s));
    console.log(t, JSON.stringify(s));
    await pg.screenshot({ path: 't67-' + t + '.png' });
  }
  await pg.setViewportSize({ width: 390, height: 844 }); await pg.waitForTimeout(600);
  if (await pg.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) bad.push('hscroll at 390');
  await pg.screenshot({ path: 't67-390.png' });
  if (errs.length) bad.push('errors: ' + errs.join(' | '));
  console.log(bad.length ? 'FAIL t67\n' + bad.join('\n') : 'PASS t67'); await b.close();
})();
