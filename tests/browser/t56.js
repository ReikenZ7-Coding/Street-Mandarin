// All Chinese: switch the narration into Chinese and back, any time
const { chromium } = require('./pw');
const fs = require('fs');
const bible = fs.readFileSync(__dirname + '/fixtures/long-story/bible.json', 'utf8'), c1 = fs.readFileSync(__dirname + '/fixtures/long-story/ch-1.1.json', 'utf8'), c2 = fs.readFileSync(__dirname + '/fixtures/long-story/ch-1.2.json', 'utf8'), zh = fs.readFileSync(__dirname + '/fixtures/long-story/zh-1.1.json', 'utf8');
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h, dark] of [[1300, 950, false], [390, 844, true]]) {
    const pg = await b.newPage({ viewport: { width: w, height: h }, colorScheme: dark ? 'dark' : 'light' }); pg.on('pageerror', e => errs.push(e.message));
    await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
    await pg.addInitScript(([bible, c1, c2, zh]) => { localStorage.setItem('sm-said', '9'); window.__calls = []; window.claude = { use: async () => ({ json: async (p) => { window.__calls.push(p.slice(0, 40)); await new Promise(r => setTimeout(r, 300)); if (/planning a light novel/.test(p)) return JSON.parse(bible); if (/^Rewrite the narration/.test(p)) { const n = (p.match(/^Paragraph \d+:/gm) || []).length, z = JSON.parse(zh); while (z.blocks.length < n) z.blocks.push(z.blocks[0]); z.blocks.length = n; return z; } return JSON.parse(/chapter 1 of/.test(p) ? c1 : c2); } }) }; }, [bible, c1, c2, zh]);
    await pg.goto(require('./pw').APP); await pg.waitForTimeout(700);
    await pg.evaluate(() => { startLong(); lsPick.pace = 'free'; lsBegin(); });
    await pg.waitForFunction(() => lsView === 'read' && lsMoment);
    await pg.locator('#help-seg button', { hasText: 'English' }).click();
    console.log('NOTE', await pg.locator('.ls-zh-note').innerText());
    await pg.waitForFunction(() => document.querySelectorAll('.ls-zh .zs').length > 5, null, { timeout: 5000 });
    console.log('ZH sentences', await pg.locator('.ls-zh .zs').count(), '| english narration left:', await pg.locator('.ls-narr').count(), '| bubbles:', await pg.locator('#log .row.npc').count());
    await pg.locator('.ls-zh .zs').first().click(); console.log('TAP EN', await pg.locator('.ls-zh .ze').first().innerText());
    await pg.screenshot({ path: `t56-zh-${w}.png` });
    await pg.evaluate(() => (prefs.py = true, prefs.en = false, setShow('py'))); console.log('CHARS pinyin shown:', await pg.locator('.ls-zh .zp').count());
    await pg.evaluate(() => (prefs.py = false, prefs.en = false, setShow('py')));
    await pg.locator('#help-seg button', { hasText: 'English' }).click(); console.log('BACK english paras', await pg.locator('.ls-narr').count(), 'zh', await pg.locator('.ls-zh').count());
    await pg.locator('#help-seg button', { hasText: 'English' }).click(); console.log('AGAIN instant zh', await pg.locator('.ls-zh').count(), '| zh calls', await pg.evaluate(() => __calls.filter(c => /^Rewrite/.test(c)).length));
    // answer: next chapter arrives already in Chinese
    await pg.locator('#move .btn', { hasText: 'Your line' }).click();
    await pg.evaluate(() => longChoose(lsMoment.opts.find(o => o.k === 'good')));
    await pg.locator('#move .endcard .btn').first().click();
    await pg.waitForFunction(() => lsView === 'read' && lsAt.c === 2, null, { timeout: 8000 });
    console.log('CH2 in zh straight away', await pg.locator('.ls-zh').count(), '| note:', await pg.locator('.ls-zh-note').count());
    await pg.screenshot({ path: `t56-ch2-${w}.png`, fullPage: false });
    console.log('hscroll', await pg.evaluate(() => document.documentElement.scrollWidth > innerWidth));
    await pg.close();
  }
  console.log('ERRORS', errs); await b.close();
})();
