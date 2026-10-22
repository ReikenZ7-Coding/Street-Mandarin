// Fixes from the fresh-eyes audit: scrolling, glosses, rewrite, going away, errors, tonight's card, the ending
const { chromium } = require('./pw');
const fs = require('fs');
const bible = fs.readFileSync(__dirname + '/fixtures/long-story/bible.json', 'utf8'), c1 = fs.readFileSync(__dirname + '/fixtures/long-story/ch-1.1.json', 'utf8'), c2 = fs.readFileSync(__dirname + '/fixtures/long-story/ch-1.2.json', 'utf8');
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h, dark] of [[1300, 950, false], [390, 844, true]]) {
    const pg = await b.newPage({ viewport: { width: w, height: h }, colorScheme: dark ? 'dark' : 'light' }); pg.on('pageerror', e => errs.push(e.message));
    await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
    await pg.addInitScript(([bible, c1, c2]) => { localStorage.setItem('sm-said', '9'); window.__fail = 0; window.__delay = 200; window.claude = { use: async () => ({ json: async (p) => { await new Promise(r => setTimeout(r, window.__delay)); if (window.__fail) { const e = new Error('x'); e.code = 'rate_limited'; throw e; } if (/planning a light novel/.test(p)) return JSON.parse(bible); return JSON.parse(/chapter 1 of/.test(p) ? c1 : c2); } }) }; }, [bible, c1, c2]);
    await pg.goto(require('./pw').APP); await pg.waitForTimeout(700);
    const open = async () => { if (w < 500) await pg.locator('#menu-btn').click(); await pg.locator('#tool-long').click(); };
    // going away while it plans: you stay where you went
    await open(); await pg.evaluate(() => { window.__delay = 1200; lsPick.pace = 'free'; });
    await pg.locator('#move .btn').first().click(); await pg.waitForTimeout(100);
    console.log('FORM BUSY', await pg.locator('.ls-setup.busy').count());
    await pg.evaluate(() => startHome(0)); await pg.waitForTimeout(3000);
    console.log('AWAY mode', await pg.evaluate(() => mode), '| move:', (await pg.locator('#move').innerText()).slice(0, 60).replace(/\n/g, ' '), '| 1.1 written quietly:', await pg.evaluate(() => !!lsCh(1, 1)));
    await pg.evaluate(() => startHome(0)); console.log('TONIGHT card with no stop done:', await pg.locator('.today-card', { hasText: 'Tonight' }).count());
    await pg.evaluate(() => { window.__delay = 200; }); await open();
    await pg.locator('#move .btn', { hasText: 'Continue' }).click();
    await pg.waitForFunction(() => lsView === 'read' && lsMoment);
    // rewrite needs a second tap
    await pg.locator('.ls-rewrite').click(); console.log('REWRITE asks:', await pg.locator('.ls-rewrite').innerText(), '| still 1.1:', await pg.evaluate(() => !!lsCh(1, 1)));
    const seen0 = await pg.evaluate(() => LS.words['物业'] && LS.words['物业'].seen);
    await pg.locator('.ls-rewrite').click(); await pg.waitForFunction(() => lsView === 'read' && lsMoment);
    console.log('SEEN after rewrite (no doubling):', seen0, '->', await pg.evaluate(() => LS.words['物业'].seen));
    // answer: the line you're answering and the reply come into view
    await pg.locator('#move .btn', { hasText: 'Your line' }).click(); await pg.waitForTimeout(700);
    const vis = async () => pg.evaluate(() => { const l = $('#log').lastElementChild.getBoundingClientRect(), bar = $('#move').getBoundingClientRect(); return Math.round(l.bottom) + ' <= ' + Math.round(Math.min(bar.top, innerHeight)); });
    console.log('YOUR LINE last row', await vis());
    const good = await pg.evaluate(() => lsMoment.opts.find(o => o.k === 'wrong').h);
    await pg.locator('#move .opt', { hasText: good }).click(); await pg.waitForTimeout(800);
    console.log('AFTER last row', await vis(), '| rewrite gone:', await pg.locator('.ls-rewrite').count() === 0);
    // chapter 2 fails, then works
    await pg.evaluate(() => { window.__fail = 1; delete lsJobs['1.2']; delete LS.chapters['1.2']; });
    await pg.locator('#move .endcard .btn').first().click(); await pg.waitForTimeout(800);
    console.log('ERR', (await pg.locator('#move').innerText()).replace(/\n+/g, ' | '), '| head:', (await pg.locator('#scene .scene-head').innerText()).replace(/\n+/g, ' ').slice(0, 90));
    await pg.evaluate(() => { window.__fail = 0; }); await pg.locator('#move .btn', { hasText: 'Try again' }).click();
    await pg.waitForFunction(() => lsView === 'read' && lsAt.c === 2, null, { timeout: 5000 });
    // glosses in chapter 2: words met once in chapter 1 still glossed
    console.log('CH2 glosses', await pg.evaluate(() => [...document.querySelectorAll('.ls-narr .lw')].map(b => b.textContent + (b.nextSibling && b.nextSibling.classList && b.nextSibling.classList.contains('lw-gloss') ? '+' : '-')).join(' ')));
    console.log('SEEN', await pg.evaluate(() => JSON.stringify(Object.fromEntries(Object.entries(LS.words).map(([k, v]) => [k, v.seen])))));
    // help change redraws
    await pg.evaluate(() => (prefs.py = true, prefs.en = false, setShow('py'))); console.log('CHARS gloss has pinyin:', await pg.evaluate(() => /[āáǎàēéěèīíǐìōóǒòūúǔù]/.test([...document.querySelectorAll('.lw-gloss')].map(g => g.textContent).join(''))));
    await pg.evaluate(() => (prefs.py = false, prefs.en = false, setShow('py')));
    await pg.screenshot({ path: `t55-${w}.png` });
    // ending marker
    await pg.evaluate(() => { const ch = lsCh(1, 2); delete ch.moment; lsSay({ h: '' }, 'end'); lsRecap(1); });
    console.log('RECAP said', (await pg.locator('.score ul').first().innerText()).replace(/\n/g, ' / '), '| colours:', await pg.evaluate(() => [...document.querySelectorAll('.score ul li')].map(l => l.className).join(',')));
    await pg.close();
  }
  console.log('ERRORS', errs); await b.close();
})();
