const { chromium } = require('./pw');
const fs = require('fs');
const st = JSON.parse(fs.readFileSync(__dirname + '/fixtures/long-story/state.json', 'utf8')), ch = JSON.parse(fs.readFileSync(__dirname + '/fixtures/long-story/ch-6.2.json', 'utf8'));
st.pace = 'free'; st.n = 7;
(async () => {
  const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 390, height: 844 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.addInitScript(([st, ch]) => { localStorage.setItem('sm-long', JSON.stringify(st)); localStorage.setItem('sm-said', '9'); window.claude = { use: async () => ({ json: async () => ch }) }; }, [st, ch]);
  await pg.goto(require('./pw').APP); await pg.waitForTimeout(500);
  await pg.evaluate(() => { startLong(); lsWrite(6, 2); });
  await pg.waitForFunction(() => lsView === 'read', null, { timeout: 8000 });
  console.log('tags', await pg.locator('.lw').count(), 'glossed', await pg.locator('.lw-gloss').count());
  await pg.screenshot({ path: 'ls-late-390.png', fullPage: true });
  console.log('ERRORS', errs); await b.close();
})();
