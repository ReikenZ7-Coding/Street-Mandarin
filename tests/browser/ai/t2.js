const H = require('./h.js');
(async () => {
  const { br, pg, errs, shot, ev, txt } = await H(1300, 900, { 'sm-said': '1' });
  await ev(() => startLong()); await pg.click('#move .btn:has-text("Begin the story")'); await pg.waitForTimeout(500);
  const picks = ['good', 'okay', 'wrong', 'good'];
  for (let c = 1; c <= 4; c++) {
    console.log(`--- ch ${c}: view`, await ev(() => [lsView, JSON.stringify(lsAt), !!lsMoment]));
    await pg.click('#move .btn:has-text("Your line")'); await pg.waitForTimeout(100);
    console.log('moment move:', (await txt('#move')).replace(/\s+/g, ' ').slice(0, 300));
    // pick option by kind
    const k = picks[c - 1];
    const idx = await ev(k => order.findIndex(o => o.k === k), k);
    await pg.locator('#move .opt').nth(idx).click(); await pg.waitForTimeout(150);
    console.log('after pick move:', (await txt('#move')).replace(/\s+/g, ' '));
    if (c === 2) await shot('ls-after-pick');
    await pg.waitForTimeout(300);
    const nextBtn = pg.locator('#move .endcard .btn:not(.ghost)').first();
    console.log('next btn:', await nextBtn.innerText());
    await nextBtn.click(); await pg.waitForTimeout(400);
  }
  console.log('recap head:', (await txt('.scene-head')).replace(/\s+/g, ' ').slice(0, 200));
  console.log('recap log:', (await txt('#log')).replace(/\s+/g, ' '));
  console.log('recap move:', (await txt('#move')).replace(/\s+/g, ' '));
  await shot('ls-recap');
  await pg.click('#move .btn:has-text("Story home")'); await pg.waitForTimeout(200);
  console.log('home log:', (await txt('#log')).replace(/\s+/g, ' ').slice(0, 800));
  console.log('home move:', (await txt('#move')).replace(/\s+/g, ' '));
  console.log('rail:', (await txt('.rail, #rail')).replace(/\s+/g, ' ').slice(0, 300));
  await shot('ls-home');
  console.log('notebook len', await ev(() => notebook.length), await ev(() => notebook.map(n => n.sid + ':' + n.kind).join(',')));
  console.log('calls', await ev(() => window.__calls.length));
  console.log('errs', errs);
  await br.close();
})();
