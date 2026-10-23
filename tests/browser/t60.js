// Unscripted nudge: someone you've been chatting with messages first, at most once a day
const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.addInitScript(() => {
    if (!localStorage.getItem('sm-chats')) { localStorage.setItem('sm-said', '9'); localStorage.setItem('sm-chats', JSON.stringify({ zhao: { msgs: [{ h: '小朋友，吃了吗？', t: Date.now() - 30 * 36e5 }, { me: true, h: '吃了！', t: Date.now() - 29 * 36e5 }], about: 'Called Matt.' }, chen: { msgs: [{ h: '你好！', t: Date.now() - 40 * 36e5 }] } })); }
    window.__p = []; window.claude = { use: async () => ({ json: async (p) => { __p.push(p); return { messages: [{ h: '小朋友，今天来公园吗？', p: 'Xiǎopéngyou, jīntiān lái gōngyuán ma?', e: 'Coming to the park today?' }] }; } }) }; });
  await pg.goto(require('./pw').APP); await pg.waitForTimeout(1200);
  const p = await pg.evaluate(() => __p[0] || '');
  const bad = [];
  if (!p.includes('Message them first')) bad.push('no first-message instruction');
  if (p.includes('They just sent')) bad.push('still asks for a reply');
  if (/"you"/.test(p)) bad.push('asks to judge the learner');
  if (!p.includes('Pinyin everywhere')) bad.push('lost pinyin rule');
  if (!p.includes('赵') && !p.includes('zhao')) bad.push('wrong person? ' + p.slice(0, 80));
  console.log('RAIL', await pg.locator('#tool-chat .meta').innerText());
  const z = await pg.evaluate(() => JSON.parse(localStorage.getItem('sm-chats')).zhao.msgs.length);
  if (z !== 3) bad.push('zhao msgs ' + z);
  // A second try the same day does nothing (a reload can't be used here: Chromium sometimes hands
  // a quick reload of a file:// page a stale storage snapshot)
  await pg.evaluate(() => chatNudge()); await pg.waitForTimeout(300);
  if (await pg.evaluate(() => __p.length) !== 1) bad.push('nudged twice in a day');
  await pg.evaluate(() => { localStorage.setItem('sm-chat-nudge', String(Date.now() - 21 * 36e5)); });
  await pg.evaluate(() => chatNudge()); await pg.waitForTimeout(300);
  if (await pg.evaluate(() => __p.length) !== 1) bad.push('nudged someone who just wrote');
  console.log('BAD', bad);
  console.log('ERRORS', errs.concat(bad)); await b.close();
})();
