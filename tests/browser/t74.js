// Audit of 23 October: looking back at an earlier day, "mostly" only when it's true, one slip left, close enough said once,
// 什么纸 is only close, 没有 is a wrong word, the side list's one count, and phone pocket lines keep their words whole
const { chromium } = require('./pw');
const STATE = require('./fixtures/progress/days-1-3.json');
(async () => {
  const b = await chromium.launch(); const errs = [], bad = [];
  for (const w of [1300, 390]) {
    const pg = await b.newPage({ viewport: { width: w, height: w > 600 ? 900 : 844 } }); pg.on('pageerror', e => errs.push(e.message));
    await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
    await pg.addInitScript(st => { if (sessionStorage.getItem('__init')) return; sessionStorage.setItem('__init', '1'); for (const k in st) localStorage.setItem(k, st[k]); }, STATE);
    await pg.goto(require('./pw').APP); await pg.waitForTimeout(1200);
    // day 1 seen from day 4: no "tomorrow", no "tonight"
    await pg.evaluate(() => startHome(0)); await pg.waitForTimeout(300);
    const ev = await pg.evaluate(() => [...document.querySelectorAll('#log .today-card')].map(c => c.innerText.replace(/\n+/g, ' ')).join(' || '));
    if (/tomorrow|Tonight's drill|from today/.test(ev)) bad.push(w + ' day 1 evening reads as today: ' + ev.slice(0, 300));
    if (!/from day 1|That day's mistakes/.test(ev)) bad.push(w + ' day 1 evening has no past wording');
    // "mostly" needs more than one, and more than half
    const tk = await pg.evaluate(() => [topKind(['words', 'grammar']).most, topKind(['words']).most, topKind(['where', 'words', 'where']).most, topKind(['where', 'where', 'words', 'grammar']).most]);
    if (tk.join() !== 'false,false,true,false') bad.push('topKind ' + tk);
    // the side list counts places once; what you can do on your own is the day page's
    const sub = await pg.evaluate(() => [...document.querySelectorAll('.rail-sub')].map(x => x.textContent).join(' | '));
    if (/alone/.test(sub)) bad.push('rail sub: ' + sub);
    // a rematch with one slip left says so
    await pg.evaluate(() => { start('noodles'); cur._rematch = true; runMisses = [0]; finished = true; $('#move').textContent = ''; renderEnd(); }); await pg.waitForTimeout(200);
    const h3 = await pg.locator('#move .move-head h3').textContent();
    if (h3 !== 'Rematch over, one slip left') bad.push('rematch head: ' + h3);
    if (w === 390) {
      // pocket lines on a phone: Chinese keeps its words whole, and the buttons go under a long line
      await pg.evaluate(() => { trip = { day: dayKey(), ids: ['metro', 'toilet', 'pharmacy'], auto: false, dayIdx: 1 }; startTrip(); }); await pg.waitForTimeout(400);
      const wb = await pg.evaluate(() => { const h = document.querySelector('.pb-row .han'); return h ? getComputedStyle(h).wordBreak : 'none'; });
      if (wb !== 'keep-all') bad.push('pocket han word-break ' + wb);
      if (!(await pg.locator('#move .btn', { hasText: 'Back to your day' }).count())) bad.push('pocket has no way back to the day');
      await pg.screenshot({ path: 't74-pocket-390.png', fullPage: true });
    }
    await pg.close();
  }
  // the data: 什么纸 doesn't answer "did you bring paper", and 没有 is a wrong word, not a yes by accident
  const d = await (async () => { const pg = await b.newPage(); await pg.goto(require('./pw').APP); await pg.waitForTimeout(500);
    return pg.evaluate(() => { const t = S.find(s => s.id === 'toilet'), c = S.find(s => s.id === 'store');
      return [t.turns.flatMap(x => x.opts).find(o => o.h === '什么纸？').k, ((c || {}).turns || []).flatMap(x => x.opts).filter(o => o.h === '没有。').map(o => o.tag).join()]; }); })();
  if (d[0] !== 'okay') bad.push('什么纸 is ' + d[0]);
  if (d[1] && d[1].includes('agreeing')) bad.push('没有 tagged ' + d[1]);
  // close enough is said once: by the label, not again at the end of the note
  const src = require('fs').readFileSync(require('path').resolve(__dirname, '../../index.html'), 'utf8');
  if (/o\.note \+ " Close enough"/.test(src)) bad.push('close enough twice');
  if (errs.length) bad.push('errors: ' + errs.join(' | '));
  console.log(bad.length ? 'FAIL t74\n' + bad.join('\n') : 'PASS t74'); await b.close();
})();
