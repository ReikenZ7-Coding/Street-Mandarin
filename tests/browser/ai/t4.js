const H = require('./h.js');
(async () => {
  const { br, pg, errs, shot, ev, txt } = await H(1300, 900, { 'sm-said': '1' });
  await ev(() => { startLong(); lsPick.pace = 'free'; });
  // plan failure
  await ev(() => { window.__fail = /planning a light novel/; window.__failN = 1; });
  await pg.click('#move .btn:has-text("Begin the story")'); await pg.waitForTimeout(300);
  console.log('plan fail move:', (await txt('#move')).replace(/\s+/g, ' '), '| setup busy?', await ev(() => document.querySelector('.ls-setup').className));
  await pg.click('#move .btn:has-text("Begin the story")'); await pg.waitForTimeout(400);
  console.log('after retry view', await ev(() => lsView));
  // Rewrite chapter 1
  await pg.click('.ls-rewrite'); console.log('rewrite label:', await txt('.ls-rewrite'));
  await pg.click('.ls-rewrite'); await pg.waitForTimeout(20);
  console.log('rewriting move:', (await txt('#move')).replace(/\s+/g, ' '), '| head', (await txt('#goal')));
  await pg.waitForTimeout(300);
  console.log('after rewrite view', await ev(() => [lsView, Object.keys(LS.words).map(k => k + LS.words[k].seen).join(',')]));
  // chapter failure on ch2
  await pg.click('#move .btn:has-text("Your line")');
  await ev(() => { window.__fail = /You are writing chapter/; window.__failN = 99; });
  const idx = await ev(() => order.findIndex(o => o.k === 'good'));
  await pg.locator('#move .opt').nth(idx).click(); await pg.waitForTimeout(400);
  await pg.click('#move .btn:has-text("Chapter 2")'); await pg.waitForTimeout(400);
  console.log('fail view', await ev(() => [lsView, lsErr, lsWaiting]));
  console.log('fail move:', (await txt('#move')).replace(/\s+/g, ' '), '| goal', await txt('#goal'));
  await shot('ls-fail');
  await ev(() => { window.__failN = 0; });
  await pg.click('#move .btn:has-text("Try again")'); await pg.waitForTimeout(400);
  console.log('after try again', await ev(() => [lsView, lsErr, JSON.stringify(lsAt)]));
  // Leave while writing: go home mid-write, come back
  await pg.click('#move .btn:has-text("Your line")');
  const i2 = await ev(() => order.findIndex(o => o.k === 'good'));
  await ev(() => { window.__delay = 1500; });
  await pg.locator('#move .opt').nth(i2).click(); await pg.waitForTimeout(50);
  await pg.click('#move .btn:has-text("Chapter 3")'); await pg.waitForTimeout(50);
  console.log('waiting move:', (await txt('#move')).replace(/\s+/g, ' '));
  await ev(() => startLong()); await pg.waitForTimeout(50);
  console.log('story home during write move:', (await txt('#move')).replace(/\s+/g, ' '));
  await pg.click('#move .btn:has-text("Continue")'); await pg.waitForTimeout(50);
  console.log('continue during write:', await ev(() => [lsView, lsWaiting]), (await txt('#move')).replace(/\s+/g, ' '));
  await pg.waitForTimeout(1700);
  console.log('after wait:', await ev(() => [lsView, lsWaiting]), (await txt('#move')).replace(/\s+/g, ' '));
  await ev(() => { window.__delay = 30; });
  // own words
  await pg.click('#move .btn:has-text("Your line")');
  await pg.click('#move .chip:has-text("Type")'); await pg.waitForTimeout(50);
  await pg.fill('#type-input', '给我小份吧'); await pg.press('#type-input', 'Enter'); await pg.waitForTimeout(200);
  console.log('own words log tail:', (await txt('#log')).replace(/\s+/g, ' ').slice(-250));
  console.log('own words move:', (await txt('#move')).replace(/\s+/g, ' '));
  await pg.waitForTimeout(300);
  await pg.click('#move .btn:has-text("Chapter 4")'); await pg.waitForTimeout(300);
  console.log('ch4 top:', (await txt('#log')).replace(/\s+/g, ' ').slice(0, 250));
  console.log('notebook', await ev(() => notebook.map(n => n.sid + ':' + n.kind + ':' + n.said).join(',')));
  // start new story (delete)
  await ev(() => startLong());
  await pg.click('#move .btn:has-text("Start a new story")'); console.log('confirm:', (await txt('#move')).replace(/\s+/g, ' '));
  await pg.click('#move .btn:has-text("Yes, start a new story")'); await pg.waitForTimeout(100);
  console.log('after delete:', await ev(() => [LS, lsView, localStorage.getItem('sm-long')]), (await txt('#move')).replace(/\s+/g, ' '));
  console.log('errs', errs);
  await br.close();
})();
