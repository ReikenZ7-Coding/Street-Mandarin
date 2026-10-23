// Overnight audit, batch 3: pocket follows the day, honest review count, cut-short surprises, fresh tiles, look-back button, import with spaces
const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [], bad = [];
  const pg = await b.newPage({ viewport: { width: 1300, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP); await pg.waitForTimeout(1000);
  // 1. pocket: day 1 stops, then day 1 done -> day 2 stops
  await pg.evaluate(() => startTrip()); await pg.waitForTimeout(200);
  const t1 = await pg.evaluate(() => trip.ids.join());
  await pg.evaluate(() => { DAYS[0].stops.forEach(x => done[x.id] = true); store.set('sm-done', done); startTrip(); }); await pg.waitForTimeout(200);
  const t2 = await pg.evaluate(() => [trip.ids.join(), DAYS[1].stops.map(x => x.id).join()]);
  if (t1 !== await pg.evaluate(() => DAYS[0].stops.map(x => x.id).join()) || t2[0] !== t2[1]) bad.push('pocket day: ' + t1 + ' / ' + t2);
  // a hand-picked trip stays
  await pg.evaluate(() => { trip = { day: dayKey(), ids: ['taxi'], auto: false }; store.set('sm-trip', trip); DAYS[1].stops.forEach(x => done[x.id] = true); startTrip(); });
  if (await pg.evaluate(() => trip.ids.join()) !== 'taxi') bad.push('hand-picked trip replaced');
  // 2. review: a miss comes back but the count and score stay on the first pass
  await pg.evaluate(() => { const now = Date.now(); notebook.length = 0; ['noodles', 'sim', 'hotel'].forEach((sid, i) => notebook.push({ sid, turn: 0, cb: null, kind: 'wrong', said: 'x' + i, fix: S.find(s => s.id === sid).turns[0].opts.find(o => o.k === 'good').h, fixPy: '', why: 'x', t: now - i, step: 0, due: 0 })); saveNotebook(); startReview(); });
  await pg.waitForTimeout(300);
  const goal = await pg.locator('#goal').innerText();
  await pg.evaluate(() => { const o = [...document.querySelectorAll('#move .opt')].find(b => b.textContent.indexOf(rq[ri].fix) < 0); o.click(); }); await pg.waitForTimeout(300);
  await pg.evaluate(() => { const b = [...document.querySelectorAll('#move .btn')].find(x => /Next|Finish/.test(x.textContent)); if (b) b.click(); }); await pg.waitForTimeout(300);
  const h2 = await pg.locator('#move .move-head h3').innerText();
  if (!/3 mistakes/.test(goal) || !/of 3/i.test(h2)) bad.push('review count: ' + goal + ' | ' + h2);
  // 3. build tiles follow the answer, not the moment number
  await pg.evaluate(() => { prefs.how = 'build'; start('noodles'); }); await pg.waitForTimeout(300);
  await pg.evaluate(() => { bState = { key: cur.id + ':' + turn + ':stale', ans: ['旧'], tiles: [{ w: '旧', i: 0 }], chosen: [] }; renderMove(); });
  const tiles = await pg.evaluate(() => [...document.querySelectorAll('#move .tile')].map(t => t.textContent).join('|'));
  if (/旧/.test(tiles)) bad.push('stale tiles: ' + tiles);
  await pg.evaluate(() => { prefs.how = 'pick'; });
  // 4. looking back at a day whose next day is done
  await pg.evaluate(() => startHome(0)); await pg.waitForTimeout(300);
  const bt = await pg.locator('#move .btn').first().innerText();
  if (/Start day 2/.test(bt)) bad.push('look-back button: ' + bt);
  // 5. import with a line break inside
  const ok = await pg.evaluate(() => { const c = progressCode(); return loadProgress(c.slice(0, 20) + '\n  ' + c.slice(20)); });
  if (!ok) bad.push('import with whitespace rejected');
  if (errs.length) bad.push('errors: ' + errs.join(' | '));
  console.log(bad.length ? 'FAIL t73\n' + bad.join('\n') : 'PASS t73'); await b.close();
})();
