// Your AI inside Claude (the artifact, played against the stand-in in mock.js): it's always Claude, every part is on,
// the footer says so, and the panel explains where to go for another AI instead of offering what can't work here
const H = require('./h.js');
(async () => {
  const bad = [], allErrs = [];
  for (const [w, h] of [[1300, 900], [390, 844]]) {
    const { br, pg, errs, ev } = await H(w, h, { 'sm-said': '1' });
    await pg.waitForTimeout(300);
    const st = await ev(() => [AI_NAME, AI.via, aiCan('check'), aiCan('chat'), aiCan('long'), LOCAL_AI, document.querySelector('#ai-btn').textContent]);
    if (st.join() !== 'Claude,claude,true,true,true,false,Claude') bad.push(w + ' state ' + st);
    await pg.click('#ai-btn'); await pg.waitForTimeout(200);
    const t = await pg.locator('.ai-in').innerText();
    if (!/Claude, through your Claude account/.test(t) || !/always Claude/.test(t)) bad.push(w + ' panel: ' + t.slice(0, 300));
    if (await pg.locator('.ai-tabs').count()) bad.push(w + ' offers choices that can\'t work inside Claude');
    await pg.screenshot({ path: `ai-t12-${w}.png` });
    allErrs.push(...errs); await br.close();
  }
  if (allErrs.length) bad.push('errors: ' + allErrs.join(' | '));
  console.log(bad.length ? 'FAIL t12\n' + bad.join('\n') : 'PASS t12');
})();
