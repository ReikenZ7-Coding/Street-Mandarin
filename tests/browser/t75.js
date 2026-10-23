// Audit of 23 October, the parts that use Claude (played against the stand-in in ai/mock.js):
// your own typed words are kept, chapters open at the top, "start a new story" doesn't stay armed, clearing your own idea
// keeps your pick, chat notes follow the Pinyin switch, the newest message sits above the message box
const H = require('./ai/h.js');
(async () => {
  const bad = [], allErrs = [];
  for (const [w, h] of [[1300, 900], [390, 844]]) {
    const { br, pg, errs, ev } = await H(w, h, { 'sm-said': '1' });
    // setup: Surprise me, type an idea, clear it: Surprise me is still the pick, and shows as picked
    await ev(() => startLong()); await pg.waitForTimeout(200);
    await pg.locator('.today-card', { hasText: 'Surprise me' }).click(); await pg.waitForTimeout(100);
    await pg.fill('.ls-own >> nth=0', 'a mystery'); await pg.fill('.ls-own >> nth=0', '');
    const pick = await ev(() => [lsPick.theme, document.querySelector('.today-card[aria-pressed="true"] .tc-title')?.textContent]);
    if (pick[0] !== -2 || pick[1] !== 'Surprise me') bad.push(w + ' cleared idea: ' + pick);
    // begin, then answer the first moment in your own slightly-off words: the story keeps what you typed
    await pg.click('#move .btn:has-text("Begin the story")'); await pg.waitForTimeout(700);
    await ev(() => { if (lsView !== 'read') lsRead(1, 1); }); await pg.waitForTimeout(200);
    await ev(() => { prefs.how = 'type'; renderMove(); }); await pg.waitForTimeout(100);
    const typed = await ev(() => { const ch = lsCh(1, 1); submitTyped('我要小得', ch.moment); return (lsCh(1, 1).said || {}).h; });
    if (typed !== '我要小得') bad.push(w + ' typed line kept as ' + typed);
    // the next chapter opens at its top
    await pg.waitForTimeout(600); await ev(() => window.scrollTo(0, 99999));
    await ev(() => { lsAt = { v: 1, c: 2 }; lsCh(1, 2) ? lsRead(1, 2) : lsWrite(1, 2); }); await pg.waitForTimeout(700);
    await ev(() => { if (lsCh(1, 2) && lsView !== 'read') lsRead(1, 2); }); await pg.waitForTimeout(200);
    const y = await ev(() => scrollY);
    if (y > 5) bad.push(w + ' chapter 2 opens scrolled to ' + y);
    // "Start a new story" armed, then leave and come back: it's not armed any more
    await ev(() => { startLong(); }); await pg.waitForTimeout(150);
    await pg.locator('#move .btn', { hasText: 'Start a new story' }).click(); await pg.waitForTimeout(100);
    if (!(await pg.locator('#move .btn', { hasText: 'Keep it' }).count())) bad.push(w + ' no Keep it');
    await ev(() => { startChats(); startLong(); }); await pg.waitForTimeout(150);
    if (await pg.locator('#move .btn', { hasText: 'Yes, start a new story' }).count()) bad.push(w + ' new story still armed');
    // Unscripted: three messages, then the newest one is above the message box, and its note follows the Pinyin switch
    await ev(() => startChat('chen')); await pg.waitForTimeout(300);
    for (const t of ['你好', '我很好', '明天见']) { await pg.fill('#chat-input', t); await pg.press('#chat-input', 'Enter'); await pg.waitForTimeout(400); }
    await pg.waitForTimeout(500);
    const fit = await ev(() => { const l = $('#log'), last = l.lastElementChild.getBoundingClientRect(), mv = $('#move').getBoundingClientRect(); return [Math.round(last.bottom), Math.round(mv.top)]; });
    if (fit[0] > fit[1] + 2) bad.push(w + ' newest message under the box: ' + fit);
    const lab = await ev(() => document.querySelector('.chat-fb .cf-k')?.textContent || '');
    if (/Close$/.test(lab)) bad.push(w + ' chat label ' + lab);
    await ev(() => { if (prefs.py) setShow('py'); }); await pg.waitForTimeout(200);
    const py = await ev(() => { const p = document.querySelector('.chat-fb .py'); return p ? getComputedStyle(p).display : 'none'; });
    if (py !== 'none') bad.push(w + ' chat note pinyin shows with Pinyin off');
    await ev(() => setShow('py'));
    allErrs.push(...errs); await br.close();
  }
  if (allErrs.length) bad.push('errors: ' + allErrs.join(' | '));
  console.log(bad.length ? 'FAIL t75\n' + bad.join('\n') : 'PASS t75');
})();
