// Themes: Jade stays the default; the footer's Theme picker offers 夜城 Cyberpunk, which draws a still night backdrop behind
// the page (nothing in it moves), keeps it after a reload, gives page changes a scan line, and hands back to Jade cleanly
const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [], bad = [];
  for (const [w, h] of [[1300, 860], [390, 844]]) {
    const pg = await b.newPage({ viewport: { width: w, height: h } });
    pg.on('pageerror', e => errs.push(e.message)); await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
    await pg.addInitScript(() => { if (!sessionStorage.getItem('__init')) { sessionStorage.setItem('__init', '1'); localStorage.setItem('sm-said', '1'); } });
    await pg.goto(require('./pw').APP); await pg.waitForTimeout(800);
    const look = () => pg.evaluate(() => document.documentElement.dataset.look);
    if (await look() !== 'jade') bad.push(w + ' default ' + await look());
    const names = await pg.locator('#foot .look-pick').last().locator('button[aria-pressed]').allTextContents();
    if (names.join() !== '玉境 Jade,夜城 Cyberpunk,Paper') bad.push(w + ' themes ' + names);
    if (!/Theme:/.test(await pg.locator('#foot').innerText())) bad.push(w + ' no Theme label');
    await pg.locator('#foot button', { hasText: '夜城 Cyberpunk' }).click(); await pg.waitForTimeout(700);
    if (await look() !== 'cyber' || !(await pg.locator('.scenery canvas.cy').isVisible())) bad.push(w + ' cyber not on');
    // the backdrop is drawn, and holds still
    const px = () => pg.evaluate(() => { const c = document.querySelector('canvas.cy'); return c.toDataURL('image/png').length; });
    const a = await pg.evaluate(() => document.querySelector('canvas.cy').toDataURL()); await pg.waitForTimeout(300);
    const c2 = await pg.evaluate(() => document.querySelector('canvas.cy').toDataURL());
    if ((await px()) < 2000) bad.push(w + ' backdrop not drawn'); if (a !== c2) bad.push(w + " city moving");
    if (await pg.locator('.jw-film video.on, .sc-bamboo').evaluateAll(n => n.some(x => x.offsetParent))) bad.push(w + ' jade or paper scenery showing');
    // kept after a reload; a page change gets the scan line
    await pg.reload(); await pg.waitForTimeout(800);
    if (await look() !== 'cyber' || !(await pg.locator('canvas.cy').count())) bad.push(w + ' not kept');
    await pg.evaluate(() => start('noodles')); await pg.waitForTimeout(100);
    if (!(await pg.locator('.cy-pass').count())) bad.push(w + ' no scan line on a page change');
    await pg.waitForTimeout(600);
    await pg.screenshot({ path: `t81-cyber-${w}.png` });
    // its opening plays and clears itself
    await pg.locator('#foot button', { hasText: 'Replay the opening' }).click(); await pg.waitForTimeout(300);
    if (!(await pg.locator('.cy-open').count())) bad.push(w + ' no opening'); await pg.waitForTimeout(2000);
    if (await pg.locator('.cy-open').count()) bad.push(w + ' opening stuck');
    // back to Jade: the city stops showing
    await pg.locator('#foot button', { hasText: '玉境 Jade' }).click(); await pg.waitForTimeout(300);
    if (await look() !== 'jade' || await pg.locator('canvas.cy').isVisible()) bad.push(w + ' jade back');
    await pg.close();
  }
  if (errs.length) bad.push('errors: ' + errs.join(' | '));
  console.log(bad.length ? 'FAIL t81\n' + bad.join('\n') : 'PASS t81');
  await b.close();
})();
