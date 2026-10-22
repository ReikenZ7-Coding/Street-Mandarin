// Text size per part of the app, and cards whose names line up (rail tags, place names, long chapter titles)
const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [], bad = [];
  const pg = await b.newPage({ viewport: { width: 1300, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.addInitScript(() => localStorage.setItem('sm-said', '3'));
  await pg.goto(require('./pw').APP); await pg.waitForTimeout(1500);
  // rail: the English names in each list start at the same x
  const xs = await pg.evaluate(() => { const g = sel => [...document.querySelectorAll(sel)].map(n => Math.round(n.getBoundingClientRect().left)); return { tools: g('#rail .scn.tool .name'), places: g('#rail .scn:not(.tool) .name') }; });
  if (new Set(xs.tools).size !== 1) bad.push('tool names not aligned: ' + xs.tools);
  if (new Set(xs.places).size !== 1) bad.push('place names not aligned: ' + xs.places);
  // a long chapter title stays inside its column
  const ov = await pg.evaluate(() => { const c = el('button', 'today-card'); c.append(el('span', 'tc-han', '巷子里的早晨'), el('span', 'tc-kind', 'Chapter 1'), el('span', 'tc-title', 'Arrival in the Alley'), el('span', 'tc-why', 'Waiting for your answer')); c.id = 'probe'; $('#scene').prepend(c);
    const h = c.querySelector('.tc-han').getBoundingClientRect(), t = c.querySelector('.tc-title').getBoundingClientRect(); return { hr: Math.round(h.right), tl: Math.round(t.left) }; });
  if (ov.hr > ov.tl) bad.push('chapter title overlaps: ' + JSON.stringify(ov));
  await pg.locator('#probe').screenshot({ path: 't70-card.png' }); await pg.evaluate(() => $('#probe').remove());
  await pg.locator('#rail').screenshot({ path: 't70-rail.png' });
  // text size: bigger for Long Story only
  await pg.evaluate(() => startLong()); await pg.waitForTimeout(400);
  for (let i = 0; i < 2; i++) await pg.click('#ts-seg [data-d="1"]');
  const a = await pg.evaluate(() => ({ z: $('#scene').style.zoom, label: $('#ts-seg').getAttribute('aria-label'), val: $('#ts-seg .ts-val').textContent }));
  if (a.z !== '1.3' || !/Long Story/.test(a.label) || a.val !== '130%') bad.push('long size: ' + JSON.stringify(a));
  await pg.screenshot({ path: 't70-long.png' });
  await pg.evaluate(() => startHome()); await pg.waitForTimeout(400);
  const h = await pg.evaluate(() => ({ z: $('#scene').style.zoom, label: $('#ts-seg').getAttribute('aria-label') }));
  if (h.z !== '' || !/Your day/.test(h.label)) bad.push('day size: ' + JSON.stringify(h));
  await pg.evaluate(() => startLong()); await pg.waitForTimeout(300);
  if (await pg.evaluate(() => $('#scene').style.zoom) !== '1.3') bad.push('long size not kept');
  await pg.click('#ts-seg .ts-val');
  if (await pg.evaluate(() => $('#scene').style.zoom) !== '') bad.push('reset failed');
  // biggest size on a phone: no sideways scroll
  await pg.setViewportSize({ width: 390, height: 844 }); await pg.evaluate(() => start('noodles')); await pg.waitForTimeout(400);
  for (let i = 0; i < 6; i++) { const d = pg.locator('#ts-seg [data-d="1"]'); if (await d.isEnabled()) await d.click(); }
  const p = await pg.evaluate(() => ({ z: $('#scene').style.zoom, hs: document.documentElement.scrollWidth > innerWidth + 1 }));
  if (p.z !== '1.3' || p.hs) bad.push('phone: ' + JSON.stringify(p));
  await pg.screenshot({ path: 't70-phone.png' });
  // and in Unscripted the chat still fits the screen at a large size
  await pg.setViewportSize({ width: 1300, height: 900 }); await pg.evaluate(() => startChats()); await pg.waitForTimeout(400);
  // the help dial: hidden on the day page and in Unscripted, back (with a pop) in a place and in Long Story
  await pg.evaluate(() => startHome()); await pg.waitForTimeout(300);
  const vis = () => pg.evaluate(() => ({ help: getComputedStyle($('#help-seg')).display !== 'none', size: getComputedStyle($('#ts-seg')).display !== 'none' }));
  const v1 = await vis(); await pg.locator('header.top').screenshot({ path: 't70-head-day.png' });
  await pg.evaluate(() => startLong()); await pg.waitForTimeout(500); const v2 = await vis(); await pg.locator('header.top').screenshot({ path: 't70-head-long.png' });
  await pg.evaluate(() => startChats()); await pg.waitForTimeout(300); const v3 = await vis();
  await pg.evaluate(() => start('noodles')); await pg.waitForTimeout(300); const v4 = await vis();
  if (!v1.help || !v1.size || !v2.help || !v3.help || !v4.help || !v4.size) bad.push('help shown: ' + JSON.stringify([v1, v2, v3, v4]));
  const al = await pg.evaluate(() => { const a = $('#ts-seg').getBoundingClientRect(), b = $('#help-seg').getBoundingClientRect(); return [Math.round(a.top), Math.round(b.top), Math.round(a.bottom), Math.round(b.bottom)]; });
  if (Math.abs(al[0] - al[1]) > 1 || Math.abs(al[2] - al[3]) > 1) bad.push('not aligned: ' + al);
  if (errs.length) bad.push('errors: ' + errs.join(' | '));
  console.log(bad.length ? 'FAIL t70\n' + bad.join('\n') : 'PASS t70'); await b.close();
})();
