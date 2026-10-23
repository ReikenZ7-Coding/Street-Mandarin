const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [];
  const pg = await b.newPage({ viewport: { width: 1300, height: 1000 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.addInitScript(() => {
    Math.random = () => 0.99;
    window.__say = ['我要一碗牛肉面'];
    window.SpeechRecognition = window.webkitSpeechRecognition = class { start() { setTimeout(() => { const alts = window.__say.map(t => ({ transcript: t })); this.onresult({ results: [alts] }); this.onend && this.onend(); }, 50); } };
    speechSynthesis.speak = () => { window.__spoke = (window.__spoke || 0) + 1; };
  });
  await pg.goto(require('./pw').APP);
  await pg.locator('#move .opt', { hasText: '我是牛肉面' }).click();
  await pg.waitForTimeout(300);
  console.log('row:', await pg.locator('#log .say-back').last().innerText());
  await pg.locator('#log .say-back .linkish', { hasText: 'Hear it' }).last().click();
  await pg.locator('#log .say-back .linkish', { hasText: 'Say it back' }).last().click(); await pg.waitForTimeout(200);
  console.log('dbg', await pg.evaluate(() => [micBroken, document.querySelectorAll('#log .say-back').length, document.querySelectorAll('#log .say-back')[0].outerHTML]));
  console.log('errs so far', errs); console.log('good:', await pg.locator('#log .sb-out').last().innerText());
  await pg.evaluate(() => { window.__say = ['我要一万牛肉', '我要一万']; });
  await pg.locator('#log .say-back .linkish', { hasText: 'Say it back' }).last().click(); await pg.waitForTimeout(200);
  console.log('bad:', await pg.locator('#log .sb-out').last().innerText(), '| spoke', await pg.evaluate(() => window.__spoke));
  await pg.screenshot({ path: 'sayback.png' });
  console.log('ERRORS', errs); await b.close();
})();
