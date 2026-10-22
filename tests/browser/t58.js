// Fixes from the Unscripted/Notes audit
const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h, dark] of [[1300, 950, true], [390, 844, false]]) {
    const pg = await b.newPage({ viewport: { width: w, height: h }, colorScheme: dark ? 'dark' : 'light' }); pg.on('pageerror', e => errs.push(e.message));
    await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
    await pg.addInitScript(() => { localStorage.setItem('sm-said', '9');
      const msgs = []; for (let i = 0; i < 40; i++) msgs.push({ me: i % 2 === 1, h: i % 2 ? '好的好的' : '今天天气不错，你去哪儿玩？', p: '', e: '', t: Date.now() - (40 - i) * 6e4, seen: true });
      if (!localStorage.getItem('sm-chats')) localStorage.setItem('sm-chats', JSON.stringify({ chen: { msgs, about: '' } }));
      window.claude = { use: async () => ({ json: async (p) => { await new Promise(r => setTimeout(r, 900)); return { messages: [{ h: '哈哈，好！', p: 'Hāhā, hǎo!', e: 'Haha, great!' }], you: { h: '你好', p: 'Nǐ hǎo', e: 'Hello' }, verdict: 'english', note: '你好 nǐ hǎo is hello.', better_h: '你好！', better_p: 'Nǐ hǎo!', about: '' }; } }) }; });
    await pg.goto(require('./pw').APP); await pg.waitForTimeout(800);
    await pg.evaluate(() => startChat('chen')); await pg.waitForTimeout(300);
    console.log('OPENS AT NEWEST', await pg.evaluate(() => { const l = $('#log'); return l.scrollHeight - l.scrollTop - l.clientHeight < 5; }));
    const inBox = await pg.evaluate(() => { const r = $('#chat-input').getBoundingClientRect(); return r.bottom <= innerHeight; }); console.log('INPUT ON SCREEN', inBox);
    await pg.locator('#chat-input').fill('hello'); await pg.locator('#chat-input').press('Enter');
    await pg.waitForTimeout(100); console.log('FOCUS after send', await pg.evaluate(() => document.activeElement.id), '| send disabled', await pg.locator('#move .chat-form .btn').first().isDisabled());
    await pg.locator('#chat-input').type('我明'); await pg.waitForTimeout(1300);
    console.log('FOCUS after reply', await pg.evaluate(() => document.activeElement.id), '| draft kept', await pg.locator('#chat-input').inputValue());
    console.log('ZH MEANT', await pg.locator('.row.chat.me .zh-meant').last().innerText().catch(() => 'none'));
    // switching chats mid-reply
    await pg.locator('#chat-input').fill('hi again'); await pg.locator('#chat-input').press('Enter');
    await pg.evaluate(() => startChat('lin')); console.log('OTHER CHAT typing shown', await pg.locator('.chat-typing').count(), '| send enabled', !(await pg.locator('#move .chat-form .btn').first().isDisabled()));
    await pg.waitForTimeout(1300); console.log('OTHER CHAT after', await pg.locator('.chat-typing').count(), await pg.locator('#move .ls-err').count());
    // bubble contrast in dark
    console.log('ME BUBBLE colors', await pg.evaluate(() => { const b = document.querySelector('.row.chat.me .bubble') || null; return b ? getComputedStyle(b).backgroundColor + ' / ' + getComputedStyle(b).color : 'none'; }));
    // notes: save into Saved lines when the drawer is closed; above the pinyin list
    await pg.evaluate(() => { const n = noteNew('Mine\n饺子\n' + NOTE_GLOSS + '饺子 jiǎozi dumplings\n'); noteOpen = n.id; });
    await pg.evaluate(() => noteAdd('明天见', 'test')); console.log('SAVED TO', await pg.evaluate(() => NOTES.find(x => x.body.includes('明天见')).body.split('\n')[0]));
    await pg.evaluate(() => openNotes(noteOpen)); await pg.evaluate(() => noteAdd('后天见', 'test'));
    console.log('ABOVE GLOSS', await pg.evaluate(() => { const b = NOTES.find(x => x.body.startsWith('Mine')).body; return b.indexOf('后天见') < b.indexOf(NOTE_GLOSS); }));
    console.log('DRAWER beside page', await pg.evaluate(() => document.body.classList.contains('notes-open')), await pg.evaluate(() => { const r = $('#scene').getBoundingClientRect(), n = $('#notes').getBoundingClientRect(); return innerWidth < 1100 || r.right <= n.left + 2; }));
    await pg.screenshot({ path: `t58-${w}.png` });
    await pg.keyboard.press('Escape');
    // a message pending at reload becomes retryable
    await pg.evaluate(() => { startChat('chen'); }); await pg.locator('#chat-input').fill('reload me'); await pg.locator('#chat-input').press('Enter'); await pg.waitForTimeout(100);
    await pg.reload(); await pg.waitForTimeout(800); await pg.evaluate(() => startChat('chen')); console.log('PENDING -> !', await pg.locator('.chat-fail').count());
    console.log('hscroll', await pg.evaluate(() => document.documentElement.scrollWidth > innerWidth));
    await pg.close();
  }
  console.log('ERRORS', errs); await b.close();
})();
