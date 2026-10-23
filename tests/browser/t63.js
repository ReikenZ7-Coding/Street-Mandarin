// A change made just before closing the page still reaches the account (the page-close beacon)
const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [], bad = [];
  const ctx = await b.newContext(); const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto('http://localhost:8799/'); await pg.waitForTimeout(500);
  const email = `beacon${Date.now()}@example.com`;
  await pg.evaluate(async e => { await fetch('/api/auth/signup', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: e, password: 'longenough1' }) }); }, email);
  await pg.reload(); await pg.waitForTimeout(800);
  await pg.evaluate(() => localStorage.setItem('sm-said', '777'));
  await pg.close({ runBeforeUnload: true });
  await new Promise(r => setTimeout(r, 800));
  const pg2 = await ctx.newPage();
  await pg2.goto('http://localhost:8799/health');
  const keys = await pg2.evaluate(async () => (await (await fetch('/api/progress')).json()).keys);
  if (!keys['sm-said'] || keys['sm-said'].v !== '777') bad.push('beacon save missing: ' + JSON.stringify(keys['sm-said']));
  console.log('ERRORS', errs.concat(bad)); await b.close();
})();
