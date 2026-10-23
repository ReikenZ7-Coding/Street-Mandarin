const H = require('./h.js');
(async () => {
  const { br, pg, errs, shot, ev, txt } = await H(1300, 900, { 'sm-said': '1' });
  await ev(() => startChats()); await pg.waitForTimeout(100);
  console.log('list:', (await txt('#log')).replace(/\s+/g, ' ').slice(0, 400));
  console.log('list move:', await txt('#move'));
  await shot('chat-list');
  await pg.locator('.chat-row').first().click(); await pg.waitForTimeout(100);
  console.log('who', await ev(() => chatWho), 'head', (await txt('.scene-head')).replace(/\s+/g, ' ').slice(0, 150));
  console.log('chat log:', (await txt('#log')).replace(/\s+/g, ' '));
  console.log('chat move:', (await txt('#move')).replace(/\s+/g, ' '));
  await shot('chat-open');
  // starter
  await pg.locator('.chat-starters .chip').first().click();
  console.log('input after starter:', await ev(() => $('#chat-input').value), 'draft', await ev(() => chatDraft));
  await pg.click('#move .btn:has-text("Send")'); await pg.waitForTimeout(20);
  console.log('pending log tail:', (await txt('#log')).replace(/\s+/g, ' ').slice(-120));
  console.log('pending move:', (await txt('#move')).replace(/\s+/g, ' '));
  await pg.waitForTimeout(1200);
  console.log('after reply log:', (await txt('#log')).replace(/\s+/g, ' ').slice(-400));
  console.log('after reply move:', (await txt('#move')).replace(/\s+/g, ' '));
  await shot('chat-reply');
  // English message
  await pg.fill('#chat-input', 'I am fine thanks'); await pg.press('#chat-input', 'Enter'); await pg.waitForTimeout(1200);
  console.log('after eng log:', (await txt('#log')).replace(/\s+/g, ' ').slice(-400));
  console.log('notebook', await ev(() => notebook.map(n => n.sid + ':' + n.kind + ':' + n.said).join(',')));
  // How do I say
  await pg.click('#move .linkish:has-text("How do I say")'); await pg.waitForTimeout(50);
  console.log('how focused:', await ev(() => document.activeElement.id));
  await pg.fill('#how-input', 'I will come tomorrow'); await pg.press('#how-input', 'Enter'); await pg.waitForTimeout(20);
  console.log('how busy move:', (await txt('#move')).replace(/\s+/g, ' '));
  await pg.waitForTimeout(200);
  console.log('how result move:', (await txt('#move')).replace(/\s+/g, ' '));
  await shot('chat-how');
  await pg.locator('.how-opt .chip').first().click(); await pg.waitForTimeout(50);
  console.log('after use: input', await ev(() => $('#chat-input').value), 'focus', await ev(() => document.activeElement.id));
  // reset
  await pg.click('.chat-reset'); console.log('reset confirm:', await txt('.chat-bar'));
  await pg.click('.chat-reset'); await pg.waitForTimeout(100);
  console.log('after reset log:', (await txt('#log')).replace(/\s+/g, ' '), '| about', await ev(() => CHATS[chatWho].about));
  await pg.click('.chat-bar .linkish:has-text("All chats")'); await pg.waitForTimeout(100);
  console.log('list after:', (await txt('#log')).replace(/\s+/g, ' ').slice(0, 300));
  console.log('errs', errs);
  await br.close();
})();
