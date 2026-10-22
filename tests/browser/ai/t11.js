const H = require('./h.js');
(async () => {
  const { br, pg, errs, shot, ev, txt } = await H(1300, 900, { 'sm-said': '1' });
  await ev(() => { startChat('chen'); window.__delay = 800; }); await pg.waitForTimeout(100);
  await pg.fill('#chat-input', '你好老板'); await pg.press('#chat-input', 'Enter'); await pg.waitForTimeout(100);
  await pg.locator('.chat-starters .chip').nth(1).click();
  console.log('during pending input:', await ev(() => $('#chat-input').value));
  await pg.waitForTimeout(1800);
  console.log('after reply input:', JSON.stringify(await ev(() => $('#chat-input').value)));
  console.log('errs', errs);
  await br.close();
})();
