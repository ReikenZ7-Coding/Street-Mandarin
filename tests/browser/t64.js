// Solo mode in a browser: no sign-in, your own model chats, progress kept on the server, and an offline model is explained.
// Needs the solo server on 8798 with LOCAL_AI_URL at the stand-in model (SM_MODEL_URL); tools/run-tests.js --server starts both.
const { chromium } = require('./pw');
const URL = process.env.SM_URL || 'http://localhost:8798/';
const MODEL = process.env.SM_MODEL_URL || 'http://localhost:18234/v1';
(async () => {
  const b = await chromium.launch(); const errs = [], bad = [];
  const ctx = await b.newContext({ viewport: { width: 1300, height: 900 } }); const a = await ctx.newPage();
  a.on('pageerror', e => errs.push(e.message)); await a.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await a.goto(URL); await a.waitForTimeout(1000);
  const btn = await a.locator('#acct-btn').innerText();
  if (!btn.includes('You')) bad.push('button: ' + btn);
  await a.click('#acct-btn'); await a.waitForTimeout(400);
  const dlg = await a.locator('dialog.acct').innerText();
  for (const s of ['Just you', 'Written by Qwen', 'Your AI']) if (!dlg.includes(s)) bad.push('dialog lacks ' + s + ': ' + dlg.slice(0, 300));
  for (const s of ['Sign out', 'Claude key', 'Delete']) if (dlg.includes(s)) bad.push('dialog shows ' + s);
  await a.screenshot({ path: 'solo-account.png' });
  // Your AI reaches a model on this computer through the server (no CORS setting needed), tests it and keeps it
  await a.locator('dialog.acct button', { hasText: 'Your AI' }).click(); await a.waitForTimeout(200);
  if (!/on this computer/.test(await a.locator('.ai-now').innerText())) bad.push('solo now-line: ' + await a.locator('.ai-now').innerText());
  await a.click('.ai-tabs button:has-text("On this computer")');
  if (await a.locator('.ai-sec', { hasText: 'Allow' }).count()) bad.push('solo warns about a browser prompt it never shows');
  await a.locator('.ai-other summary').click(); await a.fill('.ai-other input', MODEL); await a.click('.ai-other button:has-text("Look there")'); await a.waitForTimeout(800);
  if (!/Found it/.test(await a.locator('.ai-sec').innerText())) bad.push('model not found: ' + await a.locator('.ai-sec').innerText());
  await a.click('.ai-found button:has-text("Use it")'); await a.waitForTimeout(1500);
  if (!/Now using Qwen\. Everything passed/.test(await a.locator('.ai-outcome').innerText())) bad.push('solo test: ' + await a.locator('.ai-outcome').innerText());
  await a.screenshot({ path: 'solo-yourai.png' });
  await a.keyboard.press('Escape');
  await a.evaluate(() => startChat('chen')); await a.waitForTimeout(400);
  const inp = a.locator('#move input[type=text]').first();
  await inp.fill('明天见'); await inp.press('Enter');
  await a.locator('#log >> text=好啊，明天见').last().waitFor({ timeout: 8000 });
  await a.screenshot({ path: 'solo-chat.png' });
  await a.waitForTimeout(3500);
  // A fresh browser on the same laptop has it all
  const c = await (await b.newContext()).newPage(); await c.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await c.goto(URL); await c.waitForTimeout(1500);
  if (!(await c.evaluate(() => localStorage.getItem('sm-chats') || '')).includes('好啊，明天见')) bad.push('chat not kept on the server');
  // The page names your model, and a stopped model is explained rather than blamed on you
  if (!(await c.locator('text=A novel Qwen writes around you').count())) bad.push('Long Story card not named Qwen');
  if (await c.locator('text=A novel Claude writes').count()) bad.push('still says Claude');
  if (process.env.FAKE_PID) process.kill(Number(process.env.FAKE_PID));
  await c.evaluate(() => startChat('chen')); await c.waitForTimeout(400);
  const i2 = c.locator('#move input[type=text]').first(); await i2.fill('你好'); await i2.press('Enter');
  await c.waitForTimeout(6000);
  const page = await c.locator('body').innerText();
  if (!page.includes('LM Studio') || !(await c.locator('.sm-banner button', { hasText: 'Your AI' }).count())) bad.push('offline model not explained: ' + page.slice(0, 400));
  await c.screenshot({ path: 'solo-offline.png' });
  console.log(bad.length || errs.length ? 'FAIL ' + JSON.stringify({ bad, errs }) : 'PASS t64 solo');
  await b.close();
})();
