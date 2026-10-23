const H = require('./h.js');
(async () => {
  const { br, pg, errs, shot, ev, txt } = await H(1300, 900, { 'sm-said': '1' });
  await ev(() => startChat('lin')); await pg.waitForTimeout(100);
  await pg.locator('.chat-starters .chip').nth(1).click();
  console.log('input', await ev(() => $('#chat-input').value));
  await pg.locator('#help-seg button').nth(0).click(); await pg.waitForTimeout(50);
  console.log('after pinyin toggle input:', JSON.stringify(await ev(() => $('#chat-input').value)));
  await pg.locator('.chat-starters .chip').nth(1).click();
  await pg.click('#move .linkish:has-text("How do I say")'); await pg.waitForTimeout(50);
  await pg.click('.chat-how .linkish:has-text("Close")'); await pg.waitForTimeout(50);
  console.log('after how open/close input:', JSON.stringify(await ev(() => $('#chat-input').value)));
  // failure + retry
  await ev(() => { window.__fail = /texting on WeChat/; window.__failN = 1; });
  await pg.fill('#chat-input', '你好'); await pg.press('#chat-input', 'Enter'); await pg.waitForTimeout(300);
  console.log('fail move:', (await txt('#move')).replace(/\s+/g, ' ').slice(0, 150), '| ! btns', await ev(() => document.querySelectorAll('.chat-fail').length));
  await shot('chat-fail');
  await pg.click('.chat-fail'); await pg.waitForTimeout(1200);
  console.log('after retry log tail:', (await txt('#log')).replace(/\s+/g, ' ').slice(-250), '| err', await ev(() => JSON.stringify(chatErrs)));
  // switches: py off, en off
  await pg.locator('#help-seg button').nth(1).click(); await pg.waitForTimeout(50);
  console.log('prefs', await ev(() => JSON.stringify(prefs)));
  console.log('visible py/en in chat:', await ev(() => [...document.querySelectorAll('#log .py, #log .en-line')].filter(e => e.offsetParent).length));
  console.log('starters visible py/en:', await ev(() => [...document.querySelectorAll('#move .py, #move .en-line')].filter(e => e.offsetParent).length));
  await pg.locator('#log .row.npc .bubble').last().click(); await pg.waitForTimeout(50);
  console.log('after tap: visible py/en in last bubble:', await ev(() => [...document.querySelectorAll('#log .row.npc')].pop().innerText));
  // How: py off
  await pg.click('#move .linkish:has-text("How do I say")'); await pg.fill('#how-input', 'see you'); await pg.press('#how-input', 'Enter'); await pg.waitForTimeout(200);
  console.log('how opts visible py:', await ev(() => [...document.querySelectorAll('.how-opt .py')].filter(e => e.offsetParent).length), 'how-note:', await txt('.how-note'));
  await shot('chat-off');
  // text size
  for (let i = 0; i < 6; i++) await pg.click('#ts-seg [data-d="1"]').catch(() => {});
  console.log('zoom', await ev(() => $('#scene').style.zoom));
  await shot('chat-big');
  console.log('overflow x', await ev(() => [document.documentElement.scrollWidth, innerWidth]));
  console.log('move rect', await ev(() => JSON.stringify($('#move').getBoundingClientRect())));
  console.log('errs', errs);
  await br.close();
})();
