const { chromium } = require('./pw');
const fs = require('fs');
const bible = fs.readFileSync(__dirname + '/fixtures/long-story/bible.json', 'utf8'), ch = fs.readFileSync(__dirname + '/fixtures/long-story/ch-1.1.json', 'utf8');
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h, dark] of [[1300, 950, false], [390, 844, true]]) {
    const pg = await b.newPage({ viewport: { width: w, height: h }, colorScheme: dark ? 'dark' : 'light' }); pg.on('pageerror', e => errs.push(e.message));
    await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
    await pg.addInitScript(([bible, ch]) => { localStorage.setItem('sm-said', '9'); window.__calls = []; window.claude = { use: async () => ({ json: async (p) => { window.__calls.push(p); await new Promise(r => setTimeout(r, 200)); if (/planning a light novel/.test(p)) return JSON.parse(bible); const c = JSON.parse(ch); if (/their own words/.test(p)) c.feedback = { kind: 'okay', note: 'She would follow you, but it answers a different question.', better_hanzi: '还没吃呢。', better_pinyin: 'Hái méi chī ne.' }; return c; } }) }; }, [bible, ch]);
    await pg.goto(require('./pw').APP);
    await pg.waitForTimeout(800);
    if (w < 500) await pg.locator('#menu-btn').click();
    await pg.locator('#tool-long').click();
    console.log(w, 'SETUP', (await pg.locator('#scene .scene-head').innerText()).replace(/\n+/g, ' | ').slice(0, 150));
    await pg.screenshot({ path: `ls-setup-${w}.png`, fullPage: true });
    await pg.locator('.ls-field .chip', { hasText: 'A week' }).click();
    await pg.locator('.ls-themes .today-card').first().click();
    if (w < 500) await pg.locator('.ls-field .chip', { hasText: 'As fast as I like' }).click();
    await pg.locator('.ls-own').last().fill('马修');
    console.log('BEGIN BTN', await pg.locator('#move .btn').first().innerText());
    await pg.locator('#move .btn').first().click();
    await pg.waitForTimeout(100); console.log('WAIT', await pg.locator('#move').innerText());
    await pg.waitForFunction(() => lsView === 'read' && lsMoment, null, { timeout: 10000 });
    console.log('HEAD', (await pg.locator('#scene .scene-head').innerText()).replace(/\n+/g, ' | '));
    console.log('CH', (await pg.locator('#log').innerText()).replace(/\n+/g, ' | ').slice(0, 300));
    console.log('MOVE', (await pg.locator('#move').innerText()).replace(/\n+/g, ' | '));
    await pg.screenshot({ path: `ls-read-${w}.png`, fullPage: false });
    // tap a word
    await pg.locator('.lw').first().click(); console.log('TAP', await pg.locator('.lw-gloss').first().innerText());
    for (let c = 1; c <= 4; c++) {
      // answer: chapter 1 wrong, chapter 2 build it, chapter 3 type, chapter 4 good pick
      await pg.locator('#move .btn', { hasText: 'Your line' }).click();
      const wrongOpt = await pg.evaluate(() => lsMoment.opts.find(o => o.k === 'wrong').h), goodOpt = await pg.evaluate(() => lsMoment.opts.find(o => o.k === 'good'));
      if (c === 1) await pg.locator('#move .opt', { hasText: wrongOpt }).click();
      else if (c === 2) { await pg.locator('#move .chip', { hasText: 'Build it' }).click(); for (const t of goodOpt.b.split('|')) await pg.locator('#move .bank .tile', { hasText: t }).first().click(); console.log('TILES py', await pg.locator('#move .tile .tp').count()); await pg.locator('#move .build .btn', { hasText: 'Send it' }).click(); }
      else if (c === 3) { await pg.locator('#move .chip', { hasText: /Type/ }).click(); await pg.locator('#type-input').fill('我想去成都玩'); await pg.locator('#type-input').press('Enter'); }
      else { await pg.locator('#move .chip', { hasText: 'Pick it' }).click(); await pg.locator('#move .opt', { hasText: goodOpt.h }).click(); }
      await pg.waitForTimeout(300);
      console.log('AFTER', c, (await pg.locator('#move').innerText()).replace(/\n+/g, ' | '));
      await pg.locator('#move .endcard .btn').first().click();
      if (c < 4) await pg.waitForFunction(() => !busy && lsView === 'read' && lsMoment, null, { timeout: 10000 });
    }
    console.log('RECAP', (await pg.locator('#log').innerText()).replace(/\n+/g, ' | '));
    console.log('FB', (await pg.locator('#log').innerText()).includes('x') , await pg.evaluate(() => JSON.stringify(LS.chapters['1.4'].fb))); console.log('CALLS', await pg.evaluate(() => window.__calls.length)); console.log('RECAP MOVE', (await pg.locator('#move').innerText()).replace(/\n+/g, ' | '));
    console.log('P2', await pg.evaluate(() => window.__calls.map(c => (c.match(/At the end of the last chapter[^\n]*/) || ['-'])[0].slice(0, 160)))); console.log('PROMPT2 has said:', await pg.evaluate(() => /the reader said/.test(window.__calls[2]) && /their own words/.test(window.__calls[3])), '| known words in prompt:', await pg.evaluate(() => /小区=/.test(window.__calls[3])));
    console.log('NOTEBOOK', await pg.evaluate(() => JSON.stringify(notebook.map(n => [n.sid, n.kind, n.said, !!n.mt, n.src]))));
    await pg.locator('#move .btn', { hasText: 'Story home' }).click();
    console.log('HOME', (await pg.locator('#log').innerText()).replace(/\n+/g, ' | ').slice(0, 500));
    await pg.screenshot({ path: `ls-home-${w}.png`, fullPage: true });
    // review the story slip in Mistakes
    await pg.evaluate(() => { notebook.forEach(n => n.due = 0); saveNotebook(); startReview(); });
    console.log('REVIEW', (await pg.locator('#log').innerText()).replace(/\n+/g, ' | ').slice(0, 200), '| opts', await pg.locator('#move .opt').count());
    console.log('hscroll', await pg.evaluate(() => document.documentElement.scrollWidth > innerWidth));
    await pg.close();
  }
  console.log('ERRORS', errs); await b.close();
})();
