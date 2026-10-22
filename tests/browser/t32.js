const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1300, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.addInitScript(() => { Math.random = () => 0.99; });
  await pg.goto(require('./pw').APP);
  console.log('sample?', await pg.evaluate(() => !!sample), 'WHY entries', await pg.evaluate(() => Object.keys(WHY).length));
  // scripted slip: Why works with no Claude
  await pg.locator('.opt', { hasText: '我要一个牛肉面。' }).click();
  await pg.locator('#log .why-btn').last().click();
  console.log('SCENE WHY:', (await pg.locator('#log .why-out').last().innerText()).slice(0, 160));
  // notebook why
  await pg.locator('#tool-nb').click();
  await pg.locator('#nb-list .why-btn').first().click();
  console.log('NB WHY:', (await pg.locator('#nb-list .why-out').first().innerText()).slice(0, 100));
  // typed off-script answers, noodles turn 2 (spicy question) and others
  const typeAt = async (sid, turnIx, text) => {
    await pg.evaluate(([sid, ti]) => { start(sid); prefs.how = 'type'; turn = ti; beginTurn ? null : null; renderMove(); }, [sid, turnIx]);
    await pg.waitForTimeout(150);
    await pg.fill('#move input[type=text]', text); await pg.press('#move input[type=text]', 'Enter');
    await pg.waitForTimeout(250);
    const fb = await pg.locator('#log .fb').last().innerText();
    console.log(`[${sid} ${turnIx}] "${text}" →`, fb.replace(/\n+/g, ' | ').slice(0, 220));
  };
  await typeAt('noodles', 0, '我要二碗牛肉面');
  await typeAt('noodles', 0, '我要一杯牛肉面');
  await typeAt('noodles', 0, '我要一个牛肉面吧');
  await typeAt('noodles', 0, 'I want beef noodles please');
  await typeAt('noodles', 0, '牛肉面');
  await typeAt('noodles', 0, '今天天气很好');
  await typeAt('noodles', 3, '给你八十块');
  console.log('ERRORS', errs); await b.close();
})();
