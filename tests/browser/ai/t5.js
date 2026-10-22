const H = require('./h.js');
(async () => {
  const { br, pg, errs, shot, ev, txt } = await H(1300, 900, { 'sm-said': '1' });
  await ev(() => { startLong(); lsPick.pace = 'free'; });
  await pg.click('#move .btn:has-text("Begin the story")'); await pg.waitForTimeout(400);
  const segBtn = n => pg.locator('#help-seg button').nth(n);
  // English off while reading
  await segBtn(1).click(); await pg.waitForTimeout(30);
  console.log('zh note:', await txt('.ls-zh-note'));
  await pg.waitForTimeout(300);
  console.log('zh mode:', await ev(() => [!!document.querySelector('#log .ls-zh'), document.querySelectorAll('#log .ls-zh').length, !!document.querySelector('.ls-zh-note')]));
  console.log('narr first:', (await txt('#log .ls-zh')).slice(0, 120));
  await shot('ls-zh');
  // pinyin off in zh mode
  await segBtn(0).click(); await pg.waitForTimeout(100);
  console.log('zp count (py off):', await ev(() => document.querySelectorAll('#log .zp').length), 'visible py in bubbles:', await ev(() => [...document.querySelectorAll('#log .bubble .py')].filter(e => e.offsetParent).length));
  console.log('moment btn:', await txt('#move'));
  await pg.click('#move .btn:has-text("Your line")'); await pg.waitForTimeout(50);
  console.log('opts visible py/en:', await ev(() => [...document.querySelectorAll('#move .opt .py, #move .opt .en, #move .opt .en-line')].filter(e => e.offsetParent).length));
  // toggle en on while moment open
  await segBtn(1).click(); await pg.waitForTimeout(100);
  console.log('after en on: move', (await txt('#move')).replace(/\s+/g, ' ').slice(0, 150), '| lsReady', await ev(() => lsReady));
  await segBtn(1).click(); await pg.waitForTimeout(100);
  // answer then toggle
  const idx = await ev(() => order.findIndex(o => o.k === 'okay'));
  await pg.locator('#move .opt').nth(idx).click(); await pg.waitForTimeout(100);
  console.log('fb present:', await ev(() => document.querySelectorAll('#log .fb').length), 'me rows', await ev(() => document.querySelectorAll('#log .row.me').length));
  await segBtn(0).click(); await pg.waitForTimeout(100);
  console.log('after toggle py: fb', await ev(() => document.querySelectorAll('#log .fb').length), 'me rows', await ev(() => document.querySelectorAll('#log .row.me').length), 'npc reply rows', await ev(() => document.querySelectorAll('#log .row.npc').length));
  console.log('move:', (await txt('#move')).replace(/\s+/g, ' '));
  await shot('ls-after-toggle');
  // story home words list with py off/en off
  await ev(() => startLong()); await pg.click('.cando-head'); await pg.waitForTimeout(50);
  console.log('prefs', await ev(() => JSON.stringify(prefs)));
  console.log('words visible py/en:', await ev(() => [...document.querySelectorAll('.ls-words .py, .ls-words .en-line')].filter(e => e.offsetParent).length));
  await segBtn(1).click(); await pg.waitForTimeout(50);
  console.log('home after en toggle, words visible py/en:', await ev(() => [...document.querySelectorAll('.ls-words .py, .ls-words .en-line')].filter(e => e.offsetParent).map(e=>e.className).join(',')));
  // person view
  await pg.locator('.ls-person').first().click(); await pg.waitForTimeout(50);
  console.log('person view move:', (await txt('#move')).replace(/\s+/g, ' '), 'rows', await ev(() => document.querySelectorAll('#log .row').length));
  console.log('errs', errs);
  await br.close();
})();
