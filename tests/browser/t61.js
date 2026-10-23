// The chat prompt carries phrases being fixed in Mistakes, so people use them in passing
const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.addInitScript(() => {
    localStorage.setItem('sm-notebook', JSON.stringify([{ sid: 'noodles', turn: 0, kind: 'wrong', said: '我要一碗面', fix: '来一碗牛肉面。', fixPy: '', why: '', t: 1, step: 0, due: 5 }, { sid: 'taxi', turn: 0, kind: 'wrong', said: 'x', fix: '这是一句非常非常非常非常长的句子不应该出现。', why: '', t: 1, step: 0, due: 1 }, { sid: 'fruit', turn: 0, kind: 'wrong', said: 'y', fix: '便宜点儿吧', why: '', t: 1, step: 3, due: 0, learned: true }]));
    window.__p = []; window.claude = { use: async () => ({ json: async (p) => { __p.push(p); return { messages: [{ h: '好！', p: 'Hǎo!', e: 'OK!' }] }; } }) }; });
  await pg.goto(require('./pw').APP); await pg.waitForTimeout(800);
  await pg.evaluate(() => startChat('chen')); await pg.fill('#move input[type=text], #move textarea, #chat-input', '你好'); await pg.press('#move input[type=text], #move textarea, #chat-input', 'Enter');
  await pg.waitForTimeout(1500);
  const p = await pg.evaluate(() => __p.find(x => x.includes('They just sent')) || '');
  const line = (p.match(/Phrases they're practising: [^\n]*/) || [''])[0];
  console.log(line);
  const bad = [];
  if (!line.includes('来一碗牛肉面')) bad.push('missing due fix');
  if (line.includes('非常') || line.includes('便宜')) bad.push('long or learned fix included');
  console.log('ERRORS', errs.concat(bad)); await b.close();
})();
