// Your AI on the website (needs `node server/test/e2e-server.js 8799`): an online AI with your key goes through the
// server, is tested before it's saved, and its key never comes back to the page; a model on your own computer is
// reached by the page itself; the Account dialog points at Your AI instead of holding a key form
const { chromium } = require('./pw');
const M = require('./ai/standin-model.js');
const URL = process.env.SM_URL || 'http://localhost:8799/';
(async () => {
  const mine = await M.serve(0, { models: ['qwen3.5-9b'] });
  const b = await chromium.launch(); const errs = [], bad = [];
  const pg = await b.newPage({ viewport: { width: 1300, height: 900 }, reducedMotion: 'reduce' });
  pg.on('pageerror', e => errs.push(e.message)); await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  const api = []; pg.on('request', r => { if (/\/api\/ai\//.test(r.url())) api.push(r.method() + ' ' + new globalThis.URL(r.url()).pathname); });
  await pg.goto(URL); await pg.waitForTimeout(800);
  // signed out: online needs an account, but a model on this computer doesn't
  await pg.click('#ai-btn'); await pg.click('.ai-tabs button:has-text("Online")');
  if (!/Sign in first/.test(await pg.locator('.ai-sec').innerText())) bad.push('online offered signed out');
  await pg.keyboard.press('Escape');
  await pg.evaluate(async () => { await fetch('/api/auth/signup', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'ai' + Date.now() + '@example.com', password: 'longenough1' }) }); });
  await pg.reload(); await pg.waitForTimeout(1200);
  // the Account dialog has no key form, just the way to Your AI
  await pg.click('#acct-btn'); await pg.waitForTimeout(200);
  const acct = await pg.locator('dialog.acct').innerText();
  if (/API key/.test(acct) || !/Your AI/.test(acct)) bad.push('account dialog: ' + acct.slice(0, 300));
  await pg.locator('dialog.acct button', { hasText: 'Your AI' }).click(); await pg.waitForTimeout(200);
  if (!(await pg.locator('dialog.ai-dlg[open]').count())) bad.push('account → Your AI opens nothing');
  // online: DeepSeek, wrong key, right key, a lax model isn't saved, then the real one is
  await pg.click('.ai-tabs button:has-text("Online")'); await pg.selectOption('.ai-sec select', 'deepseek');
  if (await pg.locator('.ai-sec select option[value=other]').count()) bad.push('website offers an address of your own');
  await pg.fill('.ai-sec input[type=password]', 'sk-bad'); await pg.click('.ai-sec button:has-text("Find models")'); await pg.waitForTimeout(400);
  if (!/didn't accept/.test(await pg.locator('.ai-err').innerText().catch(() => ''))) bad.push('bad key not refused');
  await pg.fill('.ai-sec input[type=password]', 'sk-good-1234'); await pg.click('.ai-sec button:has-text("Find models")'); await pg.waitForTimeout(400);
  await pg.selectOption('.ai-pick select', 'deepseek-lax'); await pg.click('.ai-pick button:has-text("Use it")'); await pg.waitForTimeout(1200);
  if (!/Not switched/.test(await pg.locator('.ai-outcome').innerText())) bad.push('lax model switched');
  if (api.includes('PUT /api/ai/conn')) bad.push('lax model saved');
  await pg.selectOption('.ai-pick select', 'deepseek-chat'); await pg.click('.ai-pick button:has-text("Use it")'); await pg.waitForTimeout(1500);
  if (!/Now using DeepSeek\. Everything passed/.test(await pg.locator('.ai-outcome').innerText())) bad.push('deepseek: ' + await pg.locator('.ai-outcome').innerText());
  const acc = await pg.evaluate(async () => await (await fetch('/api/account')).json());
  if (JSON.stringify(acc).includes('sk-good-1234') || acc.ai.keyHint !== '…1234' || !acc.ai.can.long) bad.push('account ai: ' + JSON.stringify(acc.ai));
  await pg.keyboard.press('Escape');
  // a chat goes through the server to it
  await pg.evaluate(() => startChat('chen')); await pg.waitForTimeout(300);
  await pg.fill('#chat-input', '明天见'); await pg.press('#chat-input', 'Enter');
  await pg.locator('text=好啊，明天见').first().waitFor({ timeout: 8000 }).catch(() => bad.push('no chat reply'));
  if (await pg.evaluate(() => AI_NAME) !== 'DeepSeek') bad.push('name ' + await pg.evaluate(() => AI_NAME));
  // a model on this computer, from the website: the page reaches it itself, and it wins on this device
  await pg.evaluate(() => openAiPanel()); await pg.click('.ai-tabs button:has-text("On this computer")');
  await pg.locator('.ai-other summary').click(); await pg.fill('.ai-other input', `http://localhost:${mine.port}/v1`);
  await pg.click('.ai-other button:has-text("Look there")'); await pg.waitForTimeout(500);
  const n0 = mine.seen.length;
  await pg.click('.ai-found button:has-text("Use it")'); await pg.waitForTimeout(1500);
  if (mine.seen.length - n0 !== 3) bad.push('tests not sent to the model on this computer: ' + (mine.seen.length - n0));
  if (await pg.evaluate(() => [AI.via, AI_NAME].join()) !== 'page,Qwen') bad.push('computer: ' + await pg.evaluate(() => [AI.via, AI_NAME].join()));
  await pg.screenshot({ path: 't78-website.png' });
  // stop it, and DeepSeek (still on the account) is back
  await pg.click('.ai-row button:has-text("Stop using it")'); await pg.waitForTimeout(600);
  if (await pg.evaluate(() => AI_NAME) !== 'DeepSeek') bad.push('after stopping the local model: ' + await pg.evaluate(() => AI_NAME));
  // OpenRouter's one-click connect: off to OpenRouter and back with a code, which this page swaps for a key (PKCE)
  const crypto = require('crypto'); let challenge = '', state = '', swapped = null;
  await pg.route(/^https:\/\/openrouter\.ai\/auth\?/, r => { const u = new globalThis.URL(r.request().url()); challenge = u.searchParams.get('code_challenge'); state = u.searchParams.get('state');
    if (u.searchParams.get('code_challenge_method') !== 'S256' || u.searchParams.get('callback_url') !== URL) bad.push('auth url ' + u.search);
    r.fulfill({ status: 302, headers: { location: `${URL}?code=or-code-1&state=${state}` } }); });
  await pg.route('https://openrouter.ai/api/v1/auth/keys', r => { swapped = JSON.parse(r.request().postData());
    const ok = crypto.createHash('sha256').update(swapped.code_verifier).digest('base64url') === challenge && swapped.code === 'or-code-1';
    r.fulfill({ status: ok ? 200 : 403, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(ok ? { key: 'sk-or-good-77' } : { error: 'bad' }) }); });
  await pg.evaluate(() => openAiPanel('online')); await pg.selectOption('.ai-sec select', 'openrouter');
  await Promise.all([pg.waitForNavigation(), pg.click('.ai-sec button:has-text("Connect OpenRouter")')]); await pg.waitForTimeout(1500);
  if (!swapped) bad.push('no key swap');
  if (/code=/.test(pg.url())) bad.push('code left in the address: ' + pg.url());
  if (!(await pg.locator('dialog.ai-dlg[open] .ai-pick').count())) bad.push('no models after OpenRouter connect: ' + (await pg.locator('.ai-in').innerText().catch(() => '')).slice(0, 300));
  if (errs.length) bad.push('errors: ' + errs.join(' | '));
  console.log(bad.length ? 'FAIL t78\n' + bad.join('\n') : 'PASS t78');
  await b.close(); await mine.close();
})();
