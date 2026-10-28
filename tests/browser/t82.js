// 夜城's street: in the Cyberpunk theme, your ten days are a live 3D street behind the page. A place you've done is a
// lit sign, one with a mistake still in your notebook stutters, the rest stay dark; the camera goes to the place you're
// in; finishing a place lights its sign, learning its mistakes steadies it; another theme takes the street away.
// (Served over https, as the app and the artifact are: a module can't load from file://. The test machine has no
// graphics chip, so SM_FORCE_GL lets the software one draw it.)
const { chromium } = require('./pw');
const fs = require('fs'), path = require('path');
const STATE = require('./fixtures/progress/days-1-3.json');
const ROOT = path.resolve(__dirname, '../..');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const errs = [], bad = [];
  for (const [w, h] of [[1300, 860], [390, 844]]) {
    const pg = await b.newPage({ viewport: { width: w, height: h } });
    pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (/夜城/.test(m.text())) errs.push(m.text()); });
    await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
    await pg.route('https://street.test/**', r => {
      const f = decodeURIComponent(new URL(r.request().url()).pathname.slice(1)) || 'index.html', p = path.join(ROOT, f);
      if (!/^(index\.html|[a-z]+\.js|vendor\/three-street\.js|films\/[\w-]+\.(webm|jpg))$/.test(f) || !fs.existsSync(p)) return r.fulfill({ status: 404, body: '' });
      r.fulfill({ body: fs.readFileSync(p), contentType: /\.html$/.test(f) ? 'text/html' : /\.js$/.test(f) ? 'text/javascript' : 'application/octet-stream' });
    });
    await pg.addInitScript(s => {
      window.SM_FORCE_GL = true;
      if (!sessionStorage.getItem('__init')) { sessionStorage.setItem('__init', '1'); for (const k in s) localStorage.setItem(k, s[k]); localStorage.setItem('sm-look', 'cyber'); }
    }, STATE);
    await pg.goto('https://street.test/'); await pg.waitForFunction(() => window.cyStreet, null, { timeout: 15000 }).catch(() => {});
    if (!(await pg.evaluate(() => !!window.cyStreet))) { bad.push(w + ' street never started: ' + await pg.locator('#foot').innerText()); await pg.close(); continue; }
    if (await pg.locator('canvas.cy-street').count() !== 1) bad.push(w + ' street canvas');
    const signs = () => pg.evaluate(() => cyStreet.signs());
    let s = await signs();
    // days 1 to 3 done; the six places with notebook mistakes stutter; day 4 onward is dark
    const want = { noodles: 'tripped', sim: 'lit', hotel: 'tripped', directions: 'tripped', metro: 'lit', store: 'tripped', cafe: 'lit', photo: 'tripped', toilet: 'tripped', wechat: 'dark', train: 'dark' };
    for (const [id, st] of Object.entries(want)) if (s[id] !== st) bad.push(`${w} ${id} is ${s[id]}, not ${st}`);
    if (Object.keys(s).length < 25) bad.push(w + ' only ' + Object.keys(s).length + ' places on the street');
    // at home, the camera stands at the edge of what you've lit (day 4); in a place, in front of its sign
    const home = await pg.evaluate(() => cyStreet.where());
    if (home.reach !== 3) bad.push(w + ' reach ' + home.reach);
    await pg.evaluate(() => start('metro')); await pg.waitForTimeout(200);
    const metro = await pg.evaluate(() => cyStreet.where());
    if (!(metro.z > home.z)) bad.push(`${w} camera didn't go back to the metro (${home.z} → ${metro.z})`);
    await pg.waitForTimeout(2200); await pg.screenshot({ path: `t82-street-${w}.png` });
    // finishing a place lights it; learning a place's mistakes steadies it
    await pg.evaluate(() => { done.wechat = true; store.set('sm-done', done); notebook.filter(n => n.sid === 'noodles').forEach(n => (n.learned = true)); saveNotebook(); });
    s = await signs();
    if (s.wechat !== 'lit') bad.push(w + ' wechat not lit after finishing: ' + s.wechat);
    if (s.noodles !== 'lit') bad.push(w + ' noodles still stutters: ' + s.noodles);
    // another theme takes the street away; Cyberpunk brings it back
    await pg.locator('#foot button', { hasText: '玉境 Jade' }).click(); await pg.waitForTimeout(300);
    if (await pg.locator('canvas.cy-street').count() || await pg.evaluate(() => !!window.cyStreet)) bad.push(w + ' street left behind in Jade');
    await pg.locator('#foot button', { hasText: '夜城 Cyberpunk' }).click();
    await pg.waitForFunction(() => window.cyStreet, null, { timeout: 15000 }).catch(() => bad.push(w + ' not back in Cyberpunk'));
    if (/Your street is off/.test(await pg.locator('#foot').innerText())) bad.push(w + ' footer says off');
    await pg.close();
  }
  // without a graphics chip, the quiet night stays and the footer says why
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.addInitScript(() => { if (!sessionStorage.getItem('__init')) { sessionStorage.setItem('__init', '1'); localStorage.setItem('sm-said', '1'); localStorage.setItem('sm-look', 'cyber'); } });
  await pg.goto(require('./pw').APP); await pg.waitForTimeout(800);
  if (!/Your street is off here \(no graphics chip found\)/.test(await pg.locator('#foot').innerText())) bad.push('no-chip note: ' + await pg.locator('#foot').innerText());
  if (!(await pg.locator('canvas.cy').isVisible())) bad.push('no quiet night without a chip');
  if (errs.length) bad.push('errors: ' + errs.join(' | '));
  console.log(bad.length ? 'FAIL t82\n' + bad.join('\n') : 'PASS t82');
  await b.close();
})();
