const H = require('./h.js');
(async () => {
  const { br, pg, errs, shot, ev, txt } = await H(1300, 900, { 'sm-said': '1' });
  await ev(() => { window.__delay = 5; startLong(); lsPick.pace = 'free'; });
  await pg.click('#move .btn:has-text("Begin the story")'); await pg.waitForTimeout(400);
  // fast-forward: answer every chapter good via UI-free calls up to the last
  for (let i = 0; i < 27; i++) {
    await ev(async () => { const { v, c } = lsAt; if (!lsCh(v, c)) await lsFetch(v, c); lsRead(v, c); lsReady = true; renderMove(); });
    const idx = await ev(() => order.findIndex(o => o.k === 'good'));
    await pg.locator('#move .opt').nth(idx).click();
    await pg.waitForTimeout(30);
    await ev(async () => { const { v, c } = lsAt; const nv = c < 4 ? v : v + 1, nc = c < 4 ? c + 1 : 1; await lsFetch(nv, nc); lsAt = { v: nv, c: nc }; });
  }
  await ev(() => lsRead(lsAt.v, lsAt.c)); await pg.waitForTimeout(100);
  console.log('at', await ev(() => JSON.stringify(lsAt)), 'moment', await ev(() => !!lsMoment));
  console.log('last ch move:', (await txt('#move')).replace(/\s+/g, ' '));
  await pg.click('#move .btn:has-text("The end")'); await pg.waitForTimeout(200);
  console.log('end head:', (await txt('.scene-head')).replace(/\s+/g, ' ').slice(0, 120));
  console.log('end log:', (await txt('#log')).replace(/\s+/g, ' '));
  console.log('end move:', (await txt('#move')).replace(/\s+/g, ' '));
  await shot('ls-end');
  await pg.click('#move .btn:has-text("Story home")'); await pg.waitForTimeout(200);
  console.log('home log:', (await txt('#log')).replace(/\s+/g, ' ').slice(0, 300));
  console.log('home move:', (await txt('#move')).replace(/\s+/g, ' '));
  console.log('rail long:', await ev(() => [...document.querySelectorAll('button')].map(b => b.innerText).find(t => /Finished|Chengdu Noodle/.test(t))));
  // reopen last chapter from toc
  await pg.locator('#log .ls-toc .today-card').last().click(); await pg.waitForTimeout(150);
  console.log('reread last move:', (await txt('#move')).replace(/\s+/g, ' '));
  console.log('reread tail:', (await txt('#log')).replace(/\s+/g, ' ').slice(-200));
  console.log('errs', errs);
  await br.close();
})();
