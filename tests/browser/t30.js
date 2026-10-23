const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1300, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.addInitScript(() => {
    window.__prompts = [];
    window.claude = { use: async () => ({ json: async (p) => {
      window.__prompts.push(p);
      if (p.includes('Invent ONE new')) return { after: 0, what: "the cook asks if you want it spicy", turn: { npc: ["要辣吗？","Yào là ma?","Want it spicy?"], prompt: "Say a little spicy", opts: [
        { h: "微辣。", p: "Wēi là.", e: "Mildly spicy.", k: "good", note: "微辣 wēi là = mild.", b: "微辣|。" },
        { h: "很辣。", p: "Hěn là.", e: "Very spicy.", k: "okay", note: "很辣 is very spicy.", r: ["好嘞！","Hǎo lei!","Sure!"], fix: ["微辣。","Wēi là."], tag: "words" },
        { h: "热。", p: "Rè.", e: "Hot.", k: "wrong", note: "热 is temperature.", r: ["啊？","Á?","Huh?"], fix: ["微辣。","Wēi là."], tag: "nonsense" } ] } };
      if (p.includes('fresh, unscripted version')) return { place_hanzi: '包子铺', place_pinyin: 'bāozi pù', place_english: 'Baozi stall', who_hanzi: '阿姨', who_english: 'the auntie', goal: 'Buy two pork buns to take away.', intro: "It's breakfast and the steamers are going.", twist: "the shop has run out of beef", opening_hanzi: "牛肉没了，要别的吗？", opening_pinyin: "Niúròu méi le, yào bié de ma?", opening_english: "Beef's gone, want something else?" };
      if (p.includes('You are role-playing')) return { npc_hanzi: "好的，鸡蛋面。", npc_pinyin: "Hǎo de, jīdàn miàn.", npc_english: "OK, egg noodles.", verdict: "good", note: "Nice.", better_hanzi: "", better_pinyin: "", consequence: "", goal_reached: true };
      return {};
    } }) };
  });
  await pg.goto(require('./pw').APP);
  await pg.waitForTimeout(300);
  // play noodles through, always picking the good option
  const playThrough = async () => {
    for (let i = 0; i < 30; i++) {
      if (await pg.locator('#move .endcard').count()) break;
      const h = await pg.evaluate(() => { const t = scriptedTurn(cur, cur.turns[turn]) || cur.turns[turn]; return t && t.opts ? t.opts.find(o => o.k === 'good').h : null; });
      const o = h && pg.locator('.opt', { hasText: h });
      if (o && await o.count()) await o.first().click(); await pg.waitForTimeout(700);
    }
  };
  await pg.locator('.scn', { hasText: 'noodle' }).first().click().catch(async () => { await pg.evaluate(() => start(S[0])); });
  await playThrough();
  await pg.waitForTimeout(500);
  console.log('END1:', (await pg.locator('#move').innerText()).replace(/\n+/g,' | ').slice(0, 600));
  console.log('TWISTS stored:', await pg.evaluate(() => JSON.stringify(Object.keys(twists).map(k => [k, twists[k].map(x => x.turn.opts[2].tag)]))));
  // force replay with 2 surprises including the generated one
  await pg.evaluate(() => { Math.random = () => 0.01; });
  await pg.locator('.again .chip', { hasText: 'Normally' }).click();
  await pg.waitForTimeout(400);
  console.log('SURPRISES:', await pg.evaluate(() => JSON.stringify(surprises.map(x => x.key))), 'turns:', await pg.evaluate(() => cur.turns.length));
  await playThrough();
  console.log('END2:', (await pg.locator('#move').innerText()).replace(/\n+/g,' | ').slice(0, 600));
  // live
  await pg.locator('.again .chip', { hasText: 'Live' }).click();
  await pg.waitForTimeout(500);
  console.log('LIVE head:', await pg.locator('#place').innerText(), await pg.locator('#scene .scene-head').innerText().then(t=>t.replace(/\n+/g,' | ')));
  console.log('LIVE log:', (await pg.locator('#log').innerText()).replace(/\n+/g,' | '));
  await pg.fill('#move textarea, #move input', '鸡蛋面吧'); await pg.keyboard.press('Enter');
  await pg.waitForTimeout(600);
  console.log('LIVE prompt has twist:', await pg.evaluate(() => __prompts.filter(p => p.includes('private twist')).length));
  console.log('LIVE end:', (await pg.locator('#move').innerText()).replace(/\n+/g,' | ').slice(0, 300));
  await pg.screenshot({ path: 'live.png' });
  console.log('ERRORS', errs); await b.close();
})();
