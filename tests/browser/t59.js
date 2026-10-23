// Live: a Short Story place played unscripted (replaces the retired Wander tests)
const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1300, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.addInitScript(() => {
    let n = 0;
    window.claude = { use: async () => ({ json: async (p) => {
      if (p.startsWith('Set up')) return { place_hanzi: '包子铺', place_pinyin: 'bāozi pù', place_english: 'Baozi stall', who_hanzi: '老板', who_english: 'the owner', goal: 'Buy two baozi.', intro: 'Steam everywhere.', twist: 'Sold out of pork.', opening_hanzi: '要什么？', opening_pinyin: 'Yào shénme?', opening_english: 'What do you want?' };
      if (!p.startsWith('You are role-playing')) return {};
      n++;
      return n === 1 ? { npc_hanzi: '什么？', npc_pinyin: 'Shénme?', npc_english: 'What?', verdict: 'wrong', note: 'English only.', better_hanzi: '我要两个包子。', better_pinyin: 'Wǒ yào liǎng ge bāozi.', consequence: '', goal_reached: false }
                     : { npc_hanzi: '好，给你。', npc_pinyin: 'Hǎo, gěi nǐ.', npc_english: 'OK here.', verdict: 'good', note: 'Nice.', better_hanzi: '', better_pinyin: '', consequence: '', goal_reached: true };
    } }) };
  });
  await pg.goto(require('./pw').APP);
  await pg.waitForFunction(() => typeof sample !== 'undefined' && sample);
  await pg.evaluate(() => startLive('noodles'));
  await pg.locator('#wander-input:not([disabled])').waitFor();
  console.log('HEAD:', (await pg.locator('.scene-head, header.scene-h, #head').first().innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 120));
  await pg.fill('#wander-input', 'two baozi please'); await pg.press('#wander-input', 'Enter');
  await pg.locator('#wander-input:not([disabled])').waitFor();
  await pg.fill('#wander-input', '我要两个包子'); await pg.press('#wander-input', 'Enter');
  await pg.locator('text=Live again, somewhere new').waitFor();
  const nb = await pg.evaluate(() => JSON.parse(localStorage.getItem('sm-notebook') || '[]'));
  console.log('NB:', nb.length, nb[0] && nb[0].sid, nb[0] && nb[0].fix);
  console.log('LINES:', await pg.evaluate(() => localStorage.getItem('sm-wander-lines')));
  await pg.evaluate(() => openNotebook());
  console.log('LABEL:', (await pg.locator("#scene").innerText()).includes("Live"));
  console.log('ERRORS', errs);
  await b.close();
})();
