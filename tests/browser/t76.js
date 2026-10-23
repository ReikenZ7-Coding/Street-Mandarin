// Audit of 23 October, the side list and practice spaces: the side list's search counts what the pocket shows,
// learned mistakes say it once, pinyin follows the switch in Mistakes and "What you'll hear", the pocket's reasons are
// whole and its places in day order, sound-alikes don't repeat the answer, "Save to notes" isn't added twice, the reader's tip isn't gold
const { chromium } = require('./pw');
const STATE = require('./fixtures/progress/days-1-3.json');
(async () => {
  const b = await chromium.launch(); const errs = [], bad = [];
  for (const [w, look] of [[1300, null], [390, 'paper']]) {
    const pg = await b.newPage({ viewport: { width: w, height: w > 600 ? 900 : 844 }, reducedMotion: 'reduce' }); pg.on('pageerror', e => errs.push(e.message));
    await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
    await pg.addInitScript(([st, look]) => { if (sessionStorage.getItem('__init')) return; sessionStorage.setItem('__init', '1'); for (const k in st) localStorage.setItem(k, st[k]); if (look) localStorage.setItem('sm-look', look); }, [STATE, look]);
    await pg.goto(require('./pw').APP); await pg.waitForTimeout(1200);
    // the side list's count is the pocket's count
    for (const q of ['bu', 'ma', '谢谢']) {
      const side = await pg.evaluate(q => pocketFind(q).n, q);
      await pg.evaluate(q => { pbQuery = q; startPhrasebook(); }, q); await pg.waitForTimeout(150);
      const shown = await pg.evaluate(() => [document.querySelector('#pb-count').textContent, document.querySelectorAll('#log .pb-row').length]);
      if (!shown[0].startsWith(side + ' line') || shown[1] !== side) bad.push(`${w} "${q}": side ${side}, pocket ${shown}`);
    }
    // every line: day order, "lines", and each open mistake's reason in full
    await pg.evaluate(() => { pbQuery = ''; startPhrasebook(); }); await pg.waitForTimeout(150);
    const all = await pg.evaluate(() => [document.querySelector('#pb-count').textContent, [...document.querySelectorAll('#log .pb:not(.hard) .pb-title')].map(t => t.textContent.split(' · ')[1]), railOrder().filter(s => done[s.id]).map(s => s.en)]);
    if (!/line/.test(all[0])) bad.push(w + ' count says ' + all[0]);
    if (all[1].join() !== all[2].join()) bad.push(w + ' pocket order ' + all[1].join(', '));
    const whys = await pg.evaluate(() => [...document.querySelectorAll('#log .pb-why')].map(x => x.textContent));
    const full = await pg.evaluate(() => activeItems().filter(n => n.fix && n.why).map(n => unUnderstood(n.why)));
    if (whys.some(x => /: [^.]*\.$/.test(x) && !full.some(f => x.endsWith(f)))) bad.push(w + ' pocket reason cut: ' + whys.find(x => !full.some(f => x.endsWith(f))));
    // "What you'll hear" carries pinyin
    await pg.evaluate(() => { trip = { day: dayKey(), ids: ['noodles'], auto: false, dayIdx: 0 }; startTrip(); }); await pg.waitForTimeout(200);
    if (!(await pg.locator('.pb-heard .py').count())) bad.push(w + ' heard rows have no pinyin');
    // Mistakes: learned says it once; the fix's pinyin follows the switch
    await pg.evaluate(() => { notebook[0].learned = true; saveNotebook(); openNotebook(); }); await pg.waitForTimeout(200);
    const learned = await pg.evaluate(() => [...document.querySelectorAll('.nb-item.learned .where')].map(x => x.textContent).join(' | '));
    if (/Learned.*learned/i.test(learned)) bad.push(w + ' learned twice: ' + learned);
    await pg.evaluate(() => { if (prefs.py) setShow('py'); openNotebook(); }); await pg.waitForTimeout(200);
    const fp = await pg.evaluate(() => { const x = document.querySelector('.nb-item .fixpy'); return x ? getComputedStyle(x).display : 'none'; });
    if (fp !== 'none') bad.push(w + ' fix pinyin shows with Pinyin off');
    await pg.evaluate(() => setShow('py'));
    // Save to notes, reload, and it still says Saved
    await pg.locator('.nb-save').first().click(); await pg.reload(); await pg.waitForTimeout(1000);
    await pg.evaluate(() => openNotebook()); await pg.waitForTimeout(200);
    const sv = await pg.evaluate(() => { const x = document.querySelector('.nb-save'); return x && [x.textContent, x.disabled]; });
    if (!sv || sv[0] !== 'Saved' || !sv[1]) bad.push(w + ' save button after reload: ' + sv);
    // sound-alikes: a miss doesn't say the answer twice; your pick is English, in English type
    await pg.evaluate(() => startEars()); await pg.waitForTimeout(300);
    const wrongEn = await pg.evaluate(() => eq[ei].other[2]);
    await pg.locator('#move .opt', { hasText: wrongEn }).first().click(); await pg.waitForTimeout(300);
    const fb = await pg.evaluate(() => [...document.querySelectorAll('#log .fb')].pop().innerText);
    if (/They said/.test(fb)) bad.push(w + ' sound-alike miss repeats the answer');
    if (!(await pg.evaluate(() => !!document.querySelector('#log .row.me:last-of-type .han.as-en, #log .row.me .han.as-en')))) bad.push(w + ' sound-alike pick not set as English');
    // the number reader's tip is quiet, not gold
    await pg.evaluate(() => startReader()); await pg.waitForTimeout(200);
    await pg.evaluate(() => { const i = document.querySelector('#move input'); i.value = '250'; i.form.requestSubmit(); }); await pg.waitForTimeout(300);
    if (await pg.locator('#log .fb.okay').count() || !(await pg.locator('#log .fb.note').count())) bad.push(w + ' reader tip is gold (or missing)');
    // with reduced motion, the footer says why before offering the motion
    if (!look && await pg.locator('#foot button', { hasText: 'Play the motion anyway' }).count() && !(await pg.locator('#foot .look-note').count())) bad.push('motion offered without a reason');
    // the side list: "Next up" sits under the day name, past the chevron
    const nx = await pg.evaluate(() => { const n = document.querySelector('.folder .f-next'); if (!n || !n.getBoundingClientRect().width) return null; const f = n.closest('.folder').querySelector('.f-name'), c = f.querySelector('.f-chev');
      return [Math.round(n.getBoundingClientRect().left + parseFloat(getComputedStyle(n).paddingLeft)), Math.round(c.getBoundingClientRect().right + parseFloat(getComputedStyle(f).columnGap || 6))]; });
    if (nx && Math.abs(nx[0] - nx[1]) > 2) bad.push(w + ' next-up indent ' + nx);
    await pg.close();
  }
  if (errs.length) bad.push('errors: ' + errs.join(' | '));
  console.log(bad.length ? 'FAIL t76\n' + bad.join('\n') : 'PASS t76'); await b.close();
})();
