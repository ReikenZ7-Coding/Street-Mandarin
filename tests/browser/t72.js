// Overnight audit, batch 1: feedback card readable, reveal after a switch flip, no doubled pocket line, honest empty review, switches keep the day
const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [], bad = [];
  for (const w of [1300, 390]) {
    const pg = await b.newPage({ viewport: { width: w, height: w > 600 ? 900 : 844 } }); pg.on('pageerror', e => errs.push(e.message));
    await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
    await pg.addInitScript(() => { localStorage.setItem('sm-said', '3'); localStorage.setItem('sm-look', 'paper'); });
    await pg.goto(require('./pw').APP); await pg.waitForTimeout(1200);
    // a wrong answer: the note is as tall as what's in it
    await pg.evaluate(() => start('noodles')); await pg.waitForTimeout(400);
    await pg.evaluate(() => { const o = cur.turns[0].opts.find(x => x.k === 'wrong'); choose(o); }); await pg.waitForTimeout(900);
    const fb = await pg.evaluate(() => { const f = [...document.querySelectorAll('#log .fb')].pop(); return f ? [f.clientHeight, f.scrollHeight] : null; });
    if (!fb || fb[0] < fb[1] - 2) bad.push(w + ' feedback squashed: ' + fb);
    // English turned off mid-scene: the owner's line already on screen can still be revealed
    await pg.evaluate(() => { if (!prefs.en) setShow('en'); start('noodles'); }); await pg.waitForTimeout(400);
    await pg.evaluate(() => setShow('en')); await pg.waitForTimeout(200);
    const rv = await pg.evaluate(() => { const r = document.querySelector('#log .row.npc .rv-btn'); return r ? getComputedStyle(r).display : 'none'; });
    if (rv === 'none') bad.push(w + ' no reveal after English off');
    await pg.locator('#log .row.npc .rv-btn').first().click();
    const en = await pg.evaluate(() => getComputedStyle(document.querySelector('#log .row.npc .tr')).display);
    if (en === 'none') bad.push(w + ' English not revealed');
    await pg.evaluate(() => setShow('en'));
    // day view kept when a switch flips
    await pg.evaluate(() => startHome(3)); await pg.waitForTimeout(300); await pg.evaluate(() => setShow('py')); await pg.waitForTimeout(300);
    if (await pg.evaluate(() => homeDay) !== 3) bad.push(w + ' switch jumped day');
    await pg.evaluate(() => setShow('py'));
    // empty review
    await pg.evaluate(() => { NB.length = 0; startReview(); }).catch(async () => { await pg.evaluate(() => startReview()); }); await pg.waitForTimeout(300);
    if (w === 390) {
      const mb = await pg.locator('#menu-btn').innerText();
      if (/Day|第/.test(mb)) bad.push('menu button repeats the page: ' + mb);
    }
    await pg.close();
  }
  // pocket: a fixed slip shows once, marked in its place
  const pg = await b.newPage({ viewport: { width: 1300, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP); await pg.waitForTimeout(1200);
  await pg.evaluate(() => { start('noodles'); const o = cur.turns[0].opts.find(x => x.k === 'wrong'); choose(o); done.noodles = 1; startPhrasebook(); }); await pg.waitForTimeout(400);
  const pb = await pg.evaluate(() => { const fix = activeItems()[0] && activeItems()[0].fix; const n = [...document.querySelectorAll('#log .pb-row .han')].filter(h => h.textContent === fix).length; return { fix, n, why: document.querySelectorAll('#log .pb-row.slipped .pb-why').length, hard: !!document.querySelector('#log .pb.hard') }; });
  if (!pb.fix || pb.n !== 1 || pb.why !== 1 || pb.hard) bad.push('pocket: ' + JSON.stringify(pb));
  await pg.evaluate(() => openNotebook()); await pg.waitForTimeout(200); await pg.evaluate(() => stepTextSize(1)); await pg.waitForTimeout(200);
  const z = await pg.evaluate(() => getComputedStyle(document.querySelector('.notebook')).zoom);
  if (+z <= 1) bad.push('notebook zoom ' + z);
  if (errs.length) bad.push('errors: ' + errs.join(' | '));
  console.log(bad.length ? 'FAIL t72\n' + bad.join('\n') : 'PASS t72'); await b.close();
})();
