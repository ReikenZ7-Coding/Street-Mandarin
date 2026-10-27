// Your AI, in a copy opened from a file (the page talks to the AI itself): a model on this computer is found,
// tested and used for chats; a model that calls wrong answers right isn't switched on; one that botches Long Story
// gets everything but Long Story; a model that won't let the page in is explained; an online AI takes a key
const { chromium } = require('./pw');
const M = require('./ai/standin-model.js');
(async () => {
  const good = await M.serve(0, { models: ['qwen3.5-9b', 'qwen-lax-1b', 'qwen-small-3b'] });
  const shut = await M.serve(0, { cors: false });
  const paid = await M.serve(0, { key: 'sk-or-right', models: ['deepseek/deepseek-chat'] });
  const b = await chromium.launch(); const errs = [], bad = [];
  for (const [w, look] of [[1300, null], [390, 'paper']]) {
    const pg = await b.newPage({ viewport: { width: w, height: w > 600 ? 900 : 844 }, reducedMotion: 'reduce' });
    pg.on('pageerror', e => errs.push(e.message));
    await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
    await pg.addInitScript(look => { if (sessionStorage.getItem('__init')) return; sessionStorage.setItem('__init', '1'); localStorage.setItem('sm-said', '1'); if (look) localStorage.setItem('sm-look', look); }, look);
    await pg.goto(require('./pw').APP); await pg.waitForTimeout(1000);
    // no AI yet: the footer says so, and chats point at Your AI
    if ((await pg.locator('#ai-btn').innerText()) !== 'none yet') bad.push(w + ' footer: ' + await pg.locator('#ai-btn').innerText());
    await pg.evaluate(() => startChats()); await pg.waitForTimeout(200);
    const note = await pg.locator('#log .ls-note').first().innerText();
    if (!/needs an AI.*Pick one in Your AI/.test(note) || /Claude/.test(note)) bad.push(w + ' chat note: ' + note);
    await pg.locator('#log .ls-note button', { hasText: 'Your AI' }).first().click(); await pg.waitForTimeout(200);
    if (!(await pg.locator('dialog.ai-dlg[open]').count())) { bad.push(w + ' note button opens no panel'); continue; }
    if (!/No AI yet/.test(await pg.locator('.ai-now').innerText())) bad.push(w + ' panel now-line');
    // on this computer, at its own address: found, tested, used
    const pick = async (url, model) => {
      await pg.locator('.ai-tabs button', { hasText: 'On this computer' }).click();
      await pg.locator('.ai-other summary').click();
      await pg.fill('.ai-other input', url); await pg.locator('.ai-other button', { hasText: 'Look there' }).click(); await pg.waitForTimeout(600);
      if (model) { await pg.selectOption('.ai-found select', model); await pg.locator('.ai-found button', { hasText: 'Use it' }).click(); await pg.waitForTimeout(1500); }
    };
    await pick(`http://localhost:${good.port}/v1`, 'qwen-lax-1b');
    const lax = await pg.locator('.ai-outcome').innerText();
    if (!/Not switched/.test(lax) || !/called a wrong one right/.test(lax)) bad.push(w + ' lax model: ' + lax);
    if (await pg.evaluate(() => !!sample)) bad.push(w + ' lax model switched on');
    await pg.selectOption('.ai-found select', 'qwen-small-3b'); await pg.locator('.ai-found button', { hasText: 'Use it' }).click(); await pg.waitForTimeout(1500);
    const small = await pg.locator('.ai-outcome').innerText();
    if (!/Now using Qwen\. Long Story stays off/.test(small)) bad.push(w + ' small model: ' + small);
    await pg.screenshot({ path: `t77-panel-${w}.png` });
    await pg.keyboard.press('Escape');
    const can = await pg.evaluate(() => [aiCan('check'), aiCan('chat'), aiCan('long'), AI_NAME, document.querySelector('#ai-btn').textContent]);
    if (can.join() !== 'true,true,false,Qwen,Qwen') bad.push(w + ' small model can ' + can);
    await pg.evaluate(() => startLong()); await pg.waitForTimeout(200);
    const ln = await pg.locator('#log .ls-note').first().innerText();
    if (!/Qwen didn't pass the Long Story test \(the scene came back out of shape\)/.test(ln)) bad.push(w + ' long note: ' + ln);
    // a chat goes to the model, with the house rules and the chat's shape
    await pg.evaluate(() => startChat('chen')); await pg.waitForTimeout(300);
    const n0 = good.seen.length;
    await pg.fill('#chat-input', '明天见'); await pg.press('#chat-input', 'Enter');
    await pg.locator('text=好啊，明天见').first().waitFor({ timeout: 8000 }).catch(() => bad.push(w + ' no chat reply'));
    const sent = good.seen.slice(n0).find(x => /They just sent/.test(x.messages[1].content));
    if (!sent || !/ONE valid JSON object/.test(sent.messages[0].content) || !sent.response_format || sent.model !== 'qwen-small-3b') bad.push(w + ' chat request ' + JSON.stringify(sent && { m: sent.model, rf: !!sent.response_format }));
    // it stays after a reload, and lives outside what's synced or copied
    await pg.reload(); await pg.waitForTimeout(1000);
    if (await pg.evaluate(() => AI_NAME) !== 'Qwen') bad.push(w + ' not kept after reload');
    if (await pg.evaluate(() => progressCode().length && JSON.stringify(JSON.parse(decodeURIComponent(escape(atob(progressCode().slice(4)))))).includes('smai'))) bad.push(w + ' AI in the progress code');
    // a model that won't let the page in is explained
    await pg.evaluate(() => openAiPanel()); await pick(`http://localhost:${shut.port}/v1`);
    if (!/isn't letting this page in/.test(await pg.locator('.ai-in').innerText())) bad.push(w + ' blocked model not explained');
    // online, with a key: a wrong key is refused, the right one lists models, and it's used
    await pg.locator('.ai-tabs button', { hasText: 'Online' }).click();
    await pg.selectOption('.ai-sec select', 'other');
    await pg.fill('.ai-sec input[type=url]', `http://localhost:${paid.port}/v1`);
    await pg.fill('.ai-sec input[type=password]', 'sk-or-wrong'); await pg.locator('.ai-sec button', { hasText: 'Find models' }).click(); await pg.waitForTimeout(500);
    if (!/didn't accept that key/.test(await pg.locator('.ai-err').innerText().catch(() => ''))) bad.push(w + ' wrong key not refused');
    await pg.fill('.ai-sec input[type=password]', 'sk-or-right'); await pg.locator('.ai-sec button', { hasText: 'Find models' }).click(); await pg.waitForTimeout(500);
    await pg.locator('.ai-pick button', { hasText: 'Use it' }).click(); await pg.waitForTimeout(1500);
    const on = await pg.locator('.ai-outcome').innerText();
    if (!/Now using DeepSeek\. Everything passed/.test(on)) bad.push(w + ' online: ' + on);
    if (!/online with your key/.test(await pg.locator('.ai-now').innerText())) bad.push(w + ' now-line online');
    // and back to none
    await pg.keyboard.press('Escape'); await pg.evaluate(() => openAiPanel()); await pg.waitForTimeout(100);
    await pg.locator('.ai-row button', { hasText: 'Stop using it' }).click(); await pg.waitForTimeout(300);
    if (await pg.evaluate(() => !!sample || localStorage.getItem('smai-conn'))) bad.push(w + ' stop left it on');
    await pg.close();
  }
  if (errs.length) bad.push('errors: ' + errs.join(' | '));
  console.log(bad.length ? 'FAIL t77\n' + bad.join('\n') : 'PASS t77');
  await b.close(); await good.close(); await shut.close(); await paid.close();
})();
