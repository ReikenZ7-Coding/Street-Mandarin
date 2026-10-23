// The loop holds: taught lines count when typed, the day's button follows the day, playing straight on
// still brings yesterday's slips to the morning, and practice rounds end back on your day
const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [], bad = [];
  for (const w of [1300, 390]) {
    const pg = await b.newPage({ viewport: { width: w, height: w > 500 ? 900 : 844 } }); pg.on('pageerror', e => errs.push(e.message));
    await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
    await pg.goto(require('./pw').APP); await pg.waitForTimeout(500);
    // 1. In the noodle shop, typing the taught fix for 给你八十块 counts as right
    await pg.evaluate(() => start('noodles')); await pg.waitForTimeout(200);
    const r1 = await pg.evaluate(() => { const s = SCENES.find(x => x.id === 'noodles'); return [matchTyped('十八块，扫码', s.turns[3]), matchTyped('shiba kuai sao ma', s.turns[3]), matchTyped('没用', s.turns[3])].map(m => m.how + ':' + (m.o ? m.o.k : '')); });
    if (r1[0] !== 'exact:good' || r1[1] !== 'exact:good' || r1[2].startsWith('exact')) bad.push('taught fix: ' + r1);
    // 2. Day 1 done with two slips, day 2 just reached the same evening
    await pg.evaluate(() => {
      const ids = DAYS[0].stops.map(x => x.id); ids.forEach(id => done[id] = true); store.set('sm-done', done);
      const now = Date.now();
      notebook.unshift({ sid: 'noodles', turn: 3, cb: null, kind: 'wrong', said: '给你八十块。', fix: '十八块，扫码。', fixPy: 'Shíbā kuài, sǎo mǎ.', why: 'x', t: now, step: 0, due: now + 864e5 },
        { sid: ids[1], turn: 0, cb: null, kind: 'wrong', said: 'x', fix: 'y', fixPy: '', why: 'x', t: now, step: 0, due: now + 864e5 });
      saveNotebook(); startHome();
    }); await pg.waitForTimeout(400);
    const day2 = await pg.evaluate(() => homeDay);
    const am = await pg.locator('.today-card.first').first().innerText();
    if (day2 !== 1 || !am.includes('2 mistakes are back')) bad.push('day 2 morning: ' + day2 + ' ' + am.replace(/\n/g, ' | '));
    const btn = await pg.locator('#move .endcard .btn').first().innerText();
    if (btn !== 'Review 2 mistakes first') bad.push('main button: ' + btn);
    if (w < 500) await pg.screenshot({ path: 't65-morning-390.png' });
    // Review them: the first is the noodle shop; typing the taught line is right
    await pg.locator('#move .endcard .btn').first().click(); await pg.waitForTimeout(300);
    // the side list and Mistakes agree with the morning: they're due now, not "none due yet"
    const meta = await pg.evaluate(() => [$('#tool-nb .meta').textContent, whenText(rq[0])]);
    if (!meta[0].startsWith('2 due now') || meta[1] !== 'Due now') bad.push('due disagrees: ' + meta.join(' | '));
    const t = await pg.evaluate(() => { const n = rq[0]; return matchTyped('十八块，扫码', scriptedTurn(sceneFor(n), n)).how; });
    if (t !== 'exact') bad.push('review typed: ' + t);
    await pg.evaluate(() => { rq.forEach(n => markReviewed(n, true)); ri = rq.length; renderReviewMove(); }); await pg.waitForTimeout(200);
    const end = await pg.locator('#move .endcard').innerText();
    if (!end.includes('Back to your day') || end.includes('Back to 面馆')) bad.push('review end: ' + end);
    await pg.locator('#move .endcard .btn', { hasText: 'Back to your day' }).click(); await pg.waitForTimeout(300);
    const am2 = await pg.locator('.today-card.first').count() ? await pg.locator('.today-card.first').first().innerText() : '';
    if (am2.includes('mistakes are back')) bad.push('slips still offered after review');
    const btn2 = await pg.locator('#move .endcard .btn').first().innerText();
    if (!btn2.startsWith('Go: ')) bad.push('after review button: ' + btn2);
    // 3. Day 1 again: finished, so it opens at Evening, without AI cards
    await pg.evaluate(() => { startHome(0); scrollTo(0, 0); }); await pg.waitForTimeout(500); // from the top: on a phone the evening is just under the fold
    const evTop = await pg.evaluate(() => { const h = [...document.querySelectorAll('.day-part')].find(x => x.textContent.includes('Evening')); const r = h.getBoundingClientRect(); return r.top; });
    if (evTop < -5 || evTop > (w > 500 ? 750 : 950)) bad.push('evening not in view: ' + evTop);
    const ev = await pg.locator('#log').innerText();
    if (ev.includes('Start a Long Story') || ev.includes('added you on WeChat')) bad.push('AI cards without AI');
    if (w < 500) await pg.screenshot({ path: 't65-evening-390.png' });
    // 4. Side list: Next up only once
    if (w > 500) { const nu = await pg.locator('.f-next').count(); if (nu > 1) bad.push('next up x' + nu); }
    await pg.close();
  }
  console.log(bad.length || errs.length ? 'FAIL ' + JSON.stringify({ bad, errs }) : 'PASS t65');
  await b.close();
})();
