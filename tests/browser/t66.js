// The filmed world: with films.js listing clips, the world is video (no 3D engine), shots dissolve and cut on page
// changes, a new day passes through the bamboo, the opening plays the grove into the peaks, and a broken clip falls back
const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [], bad = [];
  const pg = await b.newPage({ viewport: { width: 1300, height: 860 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP + '#opening'); await pg.waitForTimeout(400);
  const s0 = await pg.evaluate(() => ({ f: !!jadeF, w: !!jadeW, op: !!document.querySelector('.opening'), pass: jadeF && jadeF.pass && getComputedStyle(jadeF.pass).opacity, vids: document.querySelectorAll('.jw-film video').length }));
  if (!s0.f || s0.w || !s0.op || s0.vids !== 2) bad.push('start: ' + JSON.stringify(s0));
  await pg.waitForTimeout(1300);
  const s1 = await pg.evaluate(() => ({ pass: +getComputedStyle(jadeF.pass).opacity, playing: !jadeF.pass.paused, br: jadeF.box.style.filter, shot: jadeF.shot && jadeF.shot.src }));
  if (s1.pass < 0.9 || !s1.playing || !/brightness/.test(s1.br) || s1.shot !== 'films/dawn.webm') bad.push('opening mid: ' + JSON.stringify(s1));
  await pg.screenshot({ path: 't66-opening.png' });
  await pg.waitForTimeout(3200);
  const s2 = await pg.evaluate(() => ({ op: !!document.querySelector('.opening'), br: jadeF.box.style.filter, on: [...document.querySelectorAll('.jw-film video.on')].map(v => v.src.split('/').pop() + (v.paused ? ':paused' : ':playing')), foot: (document.querySelector('.look-note') || {}).textContent || '' }));
  if (s2.op || s2.br || !s2.on.length || s2.on.length > 2 || !/playing/.test(s2.on.join()) || /Filmed world/.test(s2.foot)) bad.push('after opening: ' + JSON.stringify(s2));
  await pg.screenshot({ path: 't66-world.png' });
  // a page change cuts to another shot
  const onIx = () => pg.evaluate(() => [...document.querySelectorAll('.jw-film video')].findIndex(v => v.classList.contains('on')) + ':' + document.querySelectorAll('.jw-film video.on').length);
  const before = await onIx();
  await pg.evaluate(() => { sweepAt = 0; openNotebook(); }); await pg.waitForTimeout(1200);
  const after = await onIx(), fit = await pg.evaluate(() => !jadeF.shot.time || jadeF.shot.time === document.querySelector('.scenery').dataset.time);
  if (after === before || !after.endsWith(':1') || !fit) bad.push('page cut: ' + before + ' -> ' + after + ' fits ' + fit);
  // a new day goes through the bamboo into the dawn
  await pg.evaluate(() => { sweepAt = 0; startHome(); window.__mx = 0; jadeDawn(1); (function f() { __mx = Math.max(__mx, +getComputedStyle(jadeF.pass).opacity); if (performance.now() < 1e9) requestAnimationFrame(f); })(); }); await pg.waitForTimeout(700);
  const d = await pg.evaluate(() => ({ pass: __mx, shot: jadeF.shot.src }));
  if (d.pass < 0.7 || d.shot !== 'films/dawn.webm') bad.push('dawn: ' + JSON.stringify(d));
  await pg.screenshot({ path: 't66-dawn.png' });
  await pg.waitForTimeout(1000);
  if (await pg.evaluate(() => +getComputedStyle(jadeF.pass).opacity) > 0.05) bad.push('pass stays');
  // a shot near its end dissolves into the next on its own
  await pg.waitForTimeout(1500);
  const auto0 = await onIx(); await pg.evaluate(() => { const v = document.querySelector('.jw-film video.on'); v.currentTime = v.duration - 1.6; });
  await pg.waitForTimeout(2600);
  if (await onIx() === auto0) bad.push('no auto dissolve');
  // Paper look pauses the film
  await pg.evaluate(() => setLook('paper')); await pg.waitForTimeout(200);
  if (await pg.evaluate(() => [...document.querySelectorAll('.jw-film video.on')].some(v => !v.paused))) bad.push('paper still plays');
  await pg.evaluate(() => setLook('jade'));
  // a broken clip on a first visit falls back to the 3D world
  const p2 = await b.newPage({ viewport: { width: 900, height: 700 } }); p2.on('pageerror', e => errs.push('p2 ' + e.message));
  await p2.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await p2.route(/\.webm$/, r => r.abort());
  await p2.goto(require('./pw').APP); await p2.waitForTimeout(1500);
  const fb = await p2.evaluate(() => ({ f: !!jadeF, w: !!jadeW, film: !!document.querySelector('.jw-film'), foot: (document.querySelector('.look-note') || {}).textContent || '' }));
  if (fb.f || fb.film || !/3D world on|3D is off/.test(fb.foot)) bad.push('fallback: ' + JSON.stringify(fb));
  // reduced motion: one still shot, nothing plays
  const p3 = await b.newPage({ viewport: { width: 900, height: 700 }, reducedMotion: 'reduce' }); p3.on('pageerror', e => errs.push('p3 ' + e.message));
  await p3.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await p3.goto(require('./pw').APP); await p3.waitForTimeout(1200);
  const rm = await p3.evaluate(() => ({ f: !!jadeF, on: [...document.querySelectorAll('.jw-film video.on')].map(v => v.paused), pass: !!document.querySelector('.film-pass') }));
  if (!rm.f || rm.on.length !== 1 || !rm.on[0] || rm.pass) bad.push('reduced: ' + JSON.stringify(rm));
  console.log(errs.length || bad.length ? 'FAIL ' + JSON.stringify({ errs, bad }, null, 1) : 'PASS t66');
  await b.close();
})();
