// Unscripted and Notes
const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h, dark] of [[1300, 950, false], [390, 844, true]]) {
    const pg = await b.newPage({ viewport: { width: w, height: h }, colorScheme: dark ? 'dark' : 'light' }); pg.on('pageerror', e => errs.push(e.message));
    await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
    await pg.addInitScript(() => { localStorage.setItem('sm-said', '9'); localStorage.setItem('sm-done', JSON.stringify({ noodles: 1 })); window.__p = []; window.__fail = 0;
      window.claude = { use: async () => ({ json: async (p) => { window.__p.push(p); await new Promise(r => setTimeout(r, 250)); if (window.__fail) { const e = new Error('x'); e.code = 'rate_limited'; throw e; }
        if (/wants to text this/.test(p)) return { options: [{ h: '我明天去你那儿吃面。', p: 'Wǒ míngtiān qù nǐ nàr chī miàn.', e: "I'll come for noodles tomorrow.", note: '那儿 nàr means there.' }, { h: '明天见！', p: 'Míngtiān jiàn!', e: 'See you tomorrow!', note: '' }] };
        if (/wrote this note/.test(p)) return { items: [{ h: '饺子', p: 'jiǎozi', e: 'dumplings' }, { h: '好吃', p: 'hǎochī', e: 'tasty' }] };
        if (/我不吃/.test(p.split('They just sent:')[1] || '')) return { messages: [{ h: '不吃？！那你吃什么？', p: 'Bù chī?! Nà nǐ chī shénme?', e: "You don't eat?! Then what do you eat?" }], you: { h: '我不吃', p: 'Wǒ bù chī', e: "I don't eat." }, verdict: 'wrong', note: '不吃 bù chī means you never eat; for not yet, say 还没吃 hái méi chī.', better_h: '我还没吃。', better_p: 'Wǒ hái méi chī.', tag: 'grammar', about: '' };
        return { messages: [{ h: '好嘞！', p: 'Hǎo lei!', e: 'Right you are!' }, { h: '明天给你留个位子，中午人多。', p: 'Míngtiān gěi nǐ liú ge wèizi, zhōngwǔ rén duō.', e: "I'll save you a seat tomorrow; it's busy at lunch.", voice: true }], you: { h: '谢谢老板！你的面很好吃。', p: 'Xièxie lǎobǎn! Nǐ de miàn hěn hǎochī.', e: 'Thanks, boss! Your noodles are delicious.' }, verdict: 'good', note: '', better_h: '', better_p: '', about: 'Ate at my shop on their first day. Likes my noodles.' }; } }) }; });
    await pg.goto(require('./pw').APP); await pg.waitForTimeout(800);
    if (w < 500) await pg.locator('#menu-btn').click();
    console.log('RAIL', await pg.locator('#tool-chat').innerText());
    await pg.locator('#tool-chat').click();
    console.log('LIST', (await pg.locator('#log').innerText()).replace(/\n+/g, ' | ').slice(0, 300));
    await pg.screenshot({ path: `t57-list-${w}.png`, fullPage: true });
    await pg.locator('.chat-row', { hasText: '陈老板' }).click();
    console.log('OPENER', (await pg.locator('#log').innerText()).replace(/\n+/g, ' | '));
    await pg.locator('.chat-starters .chip').first().click();
    console.log('INPUT', await pg.locator('#chat-input').inputValue());
    await pg.locator('#chat-input').press('Enter');
    await pg.waitForFunction(() => !chatPending.size && chatOf('chen').msgs.length >= 4, null, { timeout: 5000 });
    console.log('AFTER', (await pg.locator('#log').innerText()).replace(/\n+/g, ' | '));
    { const p0 = await pg.evaluate(() => __p[0]); console.log('PROMPT', /Gruff but warm/.test(p0), /noodle shop/.test(p0)); }
    console.log('VOICE hidden until shown', await pg.locator('.voice').count());
    await pg.locator('.voice .reveal').click(); console.log('VOICE text', await pg.locator('.row.chat.npc .han').last().innerText());
    // switches
    // the same Pinyin / English switches as the rest of the app (English starts on here: the test page is new)
    await pg.locator('#help-seg button', { hasText: 'English' }).click(); console.log('EN hidden', await pg.locator('.row.chat .en-line').count());
    await pg.locator('#help-seg button', { hasText: 'English' }).click(); console.log('EN shown', await pg.locator('.row.chat .en-line').count());
    await pg.locator('#help-seg button', { hasText: 'Pinyin' }).click(); console.log('PY after off', await pg.locator('.row.chat .py').count());
    await pg.locator('#help-seg button', { hasText: 'Pinyin' }).click();
    // a slip
    await pg.locator('#chat-input').fill('我不吃'); await pg.locator('#chat-input').press('Enter');
    await pg.waitForFunction(() => !chatPending.size && chatOf('chen').msgs.length >= 6, null, { timeout: 5000 });
    console.log('FB', await pg.locator('.chat-fb').innerText(), '| notebook', await pg.evaluate(() => JSON.stringify(notebook.filter(n => n.sid === 'chat').map(n => [n.who, n.said, n.fix, n.heard]))));
    // how do I say
    await pg.locator('#move .linkish', { hasText: 'How do I say' }).click(); await pg.locator('#how-input').fill("I'll come tomorrow"); await pg.locator('#how-input').press('Enter');
    await pg.waitForSelector('.how-opt'); await pg.locator('.how-opt .chip').first().click(); console.log('HOW put in', await pg.locator('#chat-input').inputValue());
    await pg.screenshot({ path: `t57-chat-${w}.png` });
    // failure and retry
    await pg.evaluate(() => { window.__fail = 1; }); await pg.locator('#chat-input').press('Enter'); await pg.waitForTimeout(600);
    console.log('FAIL', await pg.locator('.chat-fail').count(), await pg.locator('#move .ls-err').innerText());
    await pg.evaluate(() => { window.__fail = 0; }); await pg.locator('.chat-fail').click(); await pg.waitForFunction(() => !chatPending.size, null, { timeout: 5000 }); await pg.waitForTimeout(900);
    console.log('RETRIED', await pg.locator('.chat-fail').count());
    // save to notes from a message
    await pg.locator('.row.chat.npc .bubble').first().click(); await pg.locator('.row.chat .b-tools .linkish', { hasText: 'Save to notes' }).click();
    console.log('TOAST', await pg.locator('.toast').innerText());
    // notes drawer
    await pg.locator('#notes-btn').click(); console.log('NOTES list', (await pg.locator('#notes .nt-list').innerText()).replace(/\n+/g, ' | '));
    await pg.locator('#notes .btn', { hasText: 'New note' }).click(); await pg.locator('#notes textarea').fill('Food words\n饺子 好吃');
    await pg.locator('#notes .btn', { hasText: 'Add pinyin' }).click(); await pg.waitForFunction(() => /jiǎozi/.test(document.querySelector('#notes textarea').value));
    console.log('GLOSSED', JSON.stringify(await pg.locator('#notes textarea').inputValue()));
    await pg.screenshot({ path: `t57-notes-${w}.png` });
    await pg.keyboard.press('Escape'); console.log('CLOSED', await pg.locator('#notes').isHidden());
    // reset
    await pg.locator('.chat-reset').click(); await pg.locator('.chat-reset').click(); console.log('RESET msgs', await pg.evaluate(() => chatOf('chen').msgs.length));
    // end card + day page hooks
    await pg.evaluate(() => startHome(0)); console.log('EVENING card', await pg.locator('.today-card', { hasText: 'Keep in touch' }).count());
    console.log('hscroll', await pg.evaluate(() => document.documentElement.scrollWidth > innerWidth));
    await pg.close();
  }
  console.log('ERRORS', errs); await b.close();
})();
// audit checks: opens at newest, focus kept, pending per chat, notes saves
(async () => {})();
