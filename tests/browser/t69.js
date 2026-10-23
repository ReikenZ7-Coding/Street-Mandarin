// The game-style opening: dark, the dragon close then far, the title lands, then the world opens; screenshots along the way
const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [], bad = [];
  const pg = await b.newPage({ viewport: { width: 1300, height: 860 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { const g = WebGLRenderingContext.prototype.getParameter; WebGLRenderingContext.prototype.getParameter = function (p) { return p === 0x9246 ? 'ANGLE (NVIDIA, NVIDIA GeForce RTX 5070 Ti Laptop GPU, D3D11)' : g.call(this, p); }; });
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP + '#opening');
  await pg.waitForFunction(() => document.querySelector('.opening.run')); 
  const t0 = Date.now(), at = async (s) => { const w = s * 1000 - (Date.now() - t0); if (w > 0) await pg.waitForTimeout(w); };
  const shots = [1.6, 3.4, 5.0, 5.8, 7.9, 9.0];
  for (const s of shots) { await at(s); const st = await pg.evaluate(() => { const o = document.querySelector('.opening'); return o ? { game: o.classList.contains('game'), black: o.querySelector('.op-black').style.opacity } : null; }); console.log(s, JSON.stringify(st)); await pg.screenshot({ path: `t69-${s}.png` }); }
  await pg.waitForTimeout(1500);
  if (await pg.evaluate(() => !!document.querySelector('.opening'))) bad.push('opening stays');
  if (await pg.evaluate(() => document.querySelector('.wrap').classList.contains('op-wait'))) bad.push('page hidden');
  if (errs.length) bad.push('errors: ' + errs.join(' | '));
  console.log(bad.length ? 'FAIL t69\n' + bad.join('\n') : 'PASS t69'); await b.close();
})();
