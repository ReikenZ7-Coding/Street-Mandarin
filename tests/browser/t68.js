// The filmed opening keeps the jade dragon: a live 3D dragon crosses the sky over the footage, then its canvas is let go
const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [], bad = [];
  const pg = await b.newPage({ viewport: { width: 1300, height: 860 } }); pg.on('pageerror', e => errs.push(e.message));
  pg.on('console', m => { if ((m.type() === 'warning' || m.type() === 'error') && !/Failed to load resource|swiftshader|GL Driver/i.test(m.text())) errs.push(m.text()); });
  // this machine has no graphics chip; pretend it has one so the dragon draws
  await pg.addInitScript(() => { const g = WebGLRenderingContext.prototype.getParameter; WebGLRenderingContext.prototype.getParameter = function (p) { return p === 0x9246 ? 'ANGLE (NVIDIA, NVIDIA GeForce RTX 5070 Ti Laptop GPU, D3D11)' : g.call(this, p); }; });
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP + '#opening'); await pg.waitForTimeout(300);
  const s0 = await pg.evaluate(() => ({ f: !!jadeF, w: !!jadeW, cv: !!document.querySelector('.opening .op-dragon') }));
  if (!s0.f || s0.w || !s0.cv) bad.push('start: ' + JSON.stringify(s0));
  // read the dragon's pixels right after it is drawn (WebGL clears them once they're on screen)
  await pg.evaluate(() => { const c = document.querySelector('.opening .op-dragon'), gl = c.getContext('webgl'); window.__dragon = 0;
    (function f() { if (!document.contains(c)) return; const w = c.width, h = c.height, d = new Uint8Array(w * h * 4); gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, d); let n = 0; for (let k = 3; k < d.length; k += 64) if (d[k] > 40) n++; __dragon = Math.max(__dragon, n); requestAnimationFrame(f); })(); });
  await pg.waitForTimeout(2100); await pg.screenshot({ path: 't68-dragon.png' });
  await pg.waitForTimeout(500); await pg.screenshot({ path: 't68-dragon2.png' }); await pg.waitForTimeout(400); await pg.screenshot({ path: 't68-dragon3.png' });
  const seen = await pg.evaluate(() => __dragon > 100);
  if (!seen) bad.push('no dragon drawn');
  await pg.waitForTimeout(8500);
  const s1 = await pg.evaluate(() => ({ op: !!document.querySelector('.opening'), why: jadeWhy, foot: (document.querySelector('.look-note') || {}).textContent || '' }));
  if (s1.op || /Filmed world/.test(s1.foot)) bad.push('after: ' + JSON.stringify(s1));
  if (errs.length) bad.push('errors: ' + errs.join(' | '));
  console.log(bad.length ? 'FAIL t68\n' + bad.join('\n') : 'PASS t68'); await b.close();
})();
