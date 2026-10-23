const H = require('./h.js');
(async () => {
  const { br, pg, errs, shot, ev, txt } = await H(1300, 900, { 'sm-said': '1' });
  console.log('sample?', await ev(() => !!sample), 'mode', await ev(() => mode));
  await ev(() => startLong()); await pg.waitForTimeout(200);
  await shot('ls-setup');
  console.log('move:', await txt('#move'));
  await pg.click('#move .btn:has-text("Begin the story")');
  await pg.waitForTimeout(20);
  console.log('planning move:', await txt('#move'));
  await pg.waitForTimeout(500);
  console.log('after plan: view', await ev(() => [lsView, lsWaiting, JSON.stringify(lsAt)]));
  console.log('head:', await txt('.scene-head'));
  console.log('move:', await txt('#move'));
  await shot('ls-ch1');
  console.log('errs', errs);
  await br.close();
})();
