// The Android app (a stand-in for Capacitor's native bridge): Your AI offers only online AIs, Claude among them,
// keeps the key on the phone, and the app's voice goes to the phone's own text-to-speech, line after line
const { chromium } = require('./pw');
const M = require('./ai/standin-model.js');
(async () => {
  const paid = await M.serve(0, { key: 'sk-phone', models: ['deepseek-chat'] });
  const b = await chromium.launch(); const errs = [], bad = [];
  const pg = await b.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  pg.on('pageerror', e => errs.push(e.message)); await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.addInitScript(() => {
    window.__said = [];
    // what Android's native bridge provides; capacitor.js builds registerPlugin on top of it
    window.androidBridge = { postMessage() {} };
    window.Capacitor = { PluginHeaders: [{ name: 'TextToSpeech', methods: ['speak', 'stop'] }, { name: 'WebView', methods: ['setServerBasePath', 'getServerBasePath', 'persistServerBasePath', 'setServerAssetPath'] },
      { name: 'Filesystem', methods: ['writeFile', 'copy', 'mkdir', 'rmdir', 'readdir', 'getUri', 'readFile', 'deleteFile', 'stat'] }].map(h => ({ name: h.name, methods: h.methods.map(name => ({ name, rtype: 'promise' })) })), nativeCallback() {},
      nativePromise: (name, op, o) => name !== 'TextToSpeech' ? Promise.reject(new Error('not here')) : op === 'speak' ? (window.__said.push(o.text + '|' + o.lang), new Promise(r => setTimeout(r, 30))) : Promise.resolve() };
    if (!sessionStorage.getItem('__init')) { sessionStorage.setItem('__init', '1'); localStorage.setItem('sm-said', '1'); }
  });
  await pg.addInitScript({ path: require.resolve('@capacitor/core/dist/capacitor.js', { paths: [require('path').resolve(__dirname, '../../android-app')] }) });
  await pg.addInitScript({ path: require('path').resolve(__dirname, '../../android-app/app-shim.js') });
  await pg.goto(require('./pw').APP); await pg.waitForTimeout(1000);
  if (!/on this phone only/.test(await pg.locator('#foot').innerText())) bad.push('footer still says browser');
  // the phone's voice, in order, with the page's start and end events
  await pg.evaluate(() => speak('你好'));
  await pg.evaluate(() => { const done = []; ['一', '二'].forEach(t => { const u = new SpeechSynthesisUtterance(t); u.lang = 'zh-CN'; u.onend = () => done.push(t); speechSynthesis.speak(u); }); window.__done = done; });
  await pg.waitForTimeout(300);
  const said = await pg.evaluate(() => [window.__said.join(), window.__done.join()]);
  if (said[0] !== '你好|zh-CN,一|zh-CN,二|zh-CN' || said[1] !== '一,二') bad.push('voice ' + said);
  // Your AI: online only, Claude in the list, and the key stays on the phone
  await pg.click('#ai-btn'); await pg.waitForTimeout(200);
  if (await pg.locator('.ai-tabs:not([hidden])').count()) bad.push('tabs shown in the app');
  const opts = await pg.locator('.ai-sec select option').allTextContents();
  for (const n of ['Claude (Anthropic)', 'ChatGPT (OpenAI)', 'Gemini (Google)', 'DeepSeek', 'OpenRouter']) if (!opts.includes(n)) bad.push('no ' + n + ' in ' + opts.join(', '));
  await pg.selectOption('.ai-sec select', 'anthropic');
  if (!/kept on this phone only/.test(await pg.locator('.ai-sec').innerText())) bad.push('key note');
  // an AI of its own choosing works end to end (the stand-in, at its own address)
  await pg.selectOption('.ai-sec select', 'other');
  await pg.fill('.ai-sec input[type=url]', `http://localhost:${paid.port}/v1`); await pg.fill('.ai-sec input[type=password]', 'sk-phone');
  await pg.click('.ai-sec button:has-text("Find models")'); await pg.waitForTimeout(400);
  await pg.click('.ai-pick button:has-text("Use it")'); await pg.waitForTimeout(1500);
  if (!/Now using DeepSeek\. Everything passed/.test(await pg.locator('.ai-outcome').innerText())) bad.push('online: ' + await pg.locator('.ai-outcome').innerText());
  await pg.screenshot({ path: 't79-app.png' });
  if (errs.length) bad.push('errors: ' + errs.join(' | '));
  console.log(bad.length ? 'FAIL t79\n' + bad.join('\n') : 'PASS t79');
  await b.close(); await paid.close();
})();
