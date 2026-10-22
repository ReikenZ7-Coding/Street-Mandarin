const { chromium } = require('./pw');
const openPlace = (pg, n) => pg.evaluate(n => { const s = S.find(x => x.en.includes(n) || x.place === n); if (s && groupOf(s.id) !== railOpen) { setRailOpen(groupOf(s.id)); renderRail(); } }, n);
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1300, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { Math.random=()=>0.99; });
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP);
  const scenes = await pg.evaluate(() => window.SCENES.map(s => ({ en: s.en, goods: s.turns.map(t => t.opts.find(o => o.k === 'good').h) })));
  for (const s of scenes) {
    await openPlace(pg, s.en); await pg.locator('.scn', { hasText: s.en }).click();
    for (const h of s.goods) await pg.locator('.opt', { hasText: h }).first().click();
    const end = await pg.locator('#move h3').innerText();
    if (!/survived/i.test(end)) console.log('PROBLEM', s.en, end);
  }
  console.log('played', scenes.length);
  // Type mode
  await openPlace(pg, 'Bubble tea'); await pg.locator('.scn', { hasText: 'Bubble tea' }).click();
  await pg.locator('.chip', { hasText: /^Type/ }).click();
  const typ = async v => { await pg.fill('#type-input', v); await pg.locator('#move button[type=submit]').click(); };
  await typ('yao yi ge da bei de zhenzhu naicha');   // pinyin no tones
  console.log('T1 ->', await pg.locator('.row.npc .han').last().innerText());
  await typ('正常');  // a wrong option typed -> carry
  console.log('T2 carry ->', await pg.locator('.fb .label').last().innerText());
  await typ('冰的少冰吗'); // near miss (1 extra char)
  console.log('T3 near ->', await pg.locator('.fb .label').last().innerText(), '|', await pg.locator('#move h3').innerText());
  await openPlace(pg, 'Noodle shop'); await pg.locator('.scn', { hasText: 'Noodle shop' }).click();
  await typ('我要吃东西'); // no match, no sample
  console.log('NOMATCH ->', (await pg.locator('.fb').last().innerText()).replace(/\n+/g,' | '));
  // Drill
  await pg.locator('.scn', { hasText: 'Train your ear' }).click();
  const n0 = await pg.evaluate(() => dq[0]);
  await pg.evaluate(() => document.querySelectorAll('.ear .reveal').forEach(b => b.click()));
  console.log('DRILL line:', await pg.locator('.row.npc .han').last().innerText(), 'answer', n0);
  await pg.fill('#price-input', String(n0)); await pg.locator('#move button[type=submit]').click();
  console.log('DRILL fb:', (await pg.locator('.fb').last().innerText()).replace(/\n+/g,' | '));
  await pg.locator('button', { hasText: 'Next total' }).click();
  await pg.fill('#price-input', '999'); await pg.locator('#move button[type=submit]').click();
  console.log('DRILL wrong fb:', (await pg.locator('.fb').last().innerText()).replace(/\n+/g,' | '));
  await pg.screenshot({ path: 'drill.png' });
  // Phrasebook
  await pg.locator('.scn', { hasText: 'Your pocket' }).click(); await pg.locator('.chip', { hasText: 'Every line' }).click();
  console.log('PHRASEBOOK:', await pg.locator('#move h3').innerText(), await pg.locator('.pb').count(), 'sections');
  await pg.screenshot({ path: 'phrasebook.png' });
  await pg.setViewportSize({ width: 390, height: 800 });
  console.log('scrollW', await pg.evaluate(() => document.documentElement.scrollWidth));
  console.log('ERRORS', errs);
  await b.close();
})();
