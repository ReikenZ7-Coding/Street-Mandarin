const { chromium } = require('../pw');
const D = __dirname;
module.exports = async (w = 1300, h = 900, ls = null) => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: w, height: h } });
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  pg.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_FAILED/.test(m.text())) errs.push('CONSOLE ' + m.text()); });
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.addInitScript({ path: D + '/mock.js' });
  if (ls) await pg.addInitScript(o => { if (!sessionStorage.getItem('__init')) { sessionStorage.setItem('__init', '1'); for (const k in o) localStorage.setItem(k, o[k]); } }, ls);
  await pg.goto(require('../pw').APP);
  await pg.waitForTimeout(400);
  const shot = n => pg.screenshot({ path: `${n}.png`, fullPage: false });
  const ev = (f, a) => pg.evaluate(f, a);
  const txt = s => pg.evaluate(s => [...document.querySelectorAll(s)].map(e => e.innerText.trim()).join(' | '), s);
  return { br, pg, errs, shot, ev, txt };
};
