const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [];
  const pg = await b.newPage({ viewport: { width: 1300, height: 1000 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.addInitScript(() => {
    if (localStorage.getItem('seeded')) return; localStorage.setItem('seeded', '1');
    localStorage.setItem('sm-said', '9'); localStorage.setItem('sm-done', JSON.stringify({ noodles: true }));
    const nb = [0, 1, 2].map(i => ({ sid: 'noodles', turn: i, said: 'x' + i, why: 'old why', due: 0, step: i, t: Date.now() }));
    localStorage.setItem('sm-notebook', JSON.stringify(nb));
  });
  await pg.goto(require('./pw').APP);
  await pg.locator('.today-card').first().click();
  const move = async () => (await pg.locator('#move').innerText()).replace(/\n+/g, ' | ');
  const items = await pg.evaluate(() => rq.map(n => n.step));
  console.log('steps in queue', items);
  for (let k = 0; k < 3; k++) {
    const step = await pg.evaluate(() => rq[ri].step || 0);
    console.log('--- step', step, ':', await move());
    if (step === 0) { await pg.locator('#move .opt').first().click(); }
    else if (step === 1) {
      const ans = await pg.evaluate(() => rTiles.ans);
      for (const w of ans) await pg.locator('#move .bank .tile', { hasText: w }).first().click();
      await pg.screenshot({ path: 'ladder-build.png' });
      await pg.locator('#move .build .btn', { hasText: 'Send it' }).click();
    } else {
      await pg.screenshot({ path: 'ladder-type.png' });
      const good = await pg.evaluate(() => rGood.p);
      await pg.fill('#move input', good.normalize('NFD').replace(/[̀-ͯ]/g, ''));
      await pg.locator('#move form .btn').click();
    }
    console.log('    log tail:', (await pg.locator('#log').innerText()).split('\n').slice(-3).join(' | '));
    await pg.locator('#move .btn', { hasText: /Next mistake|Finish round/ }).click();
  }
  console.log('end:', await move());
  console.log('notebook steps', await pg.evaluate(() => notebook.map(n => [n.step, !!n.learned])));
  // stuck path: step 2 item, step down
  await pg.evaluate(() => { notebook.forEach(n => { n.learned = false; n.step = 2; n.due = 0; }); saveNotebook(); startReview(); });
  await pg.locator('#move .linkish', { hasText: 'stuck' }).click();
  console.log('stepped down:', await move());
  const goodH = await pg.evaluate(() => rGood.h);
  await pg.locator('#move .opt', { hasText: goodH }).first().click();
  console.log('held:', (await pg.locator('#log').innerText()).split('\n').slice(-2).join(' | '), await pg.evaluate(() => rq[0].step));
  // wrong typed
  await pg.locator('#move .btn', { hasText: /Next mistake/ }).click();
  await pg.fill('#move input', '我要不辣'); await pg.locator('#move form .btn').click();
  console.log('wrong typed:', (await pg.locator('#log').innerText()).split('\n').slice(-4).join(' | '), await pg.evaluate(() => rq[1].step));
  console.log('ERRORS', errs); await b.close();
})();
