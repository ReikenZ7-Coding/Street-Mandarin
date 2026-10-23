// Pinyin and English switches (as in Unscripted) replace the help dial, and work the same in every part
const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [], bad = [];
  const pg = await b.newPage({ viewport: { width: 1300, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.addInitScript(() => { localStorage.setItem('sm-said', '3'); localStorage.setItem('sm-done', JSON.stringify({ noodles: 1, sim: 1 })); if (!localStorage.getItem('sm-prefs')) localStorage.setItem('sm-prefs', JSON.stringify({ py: true, hint: false, listen: false, how: 'pick' })); });
  await pg.goto(require('./pw').APP); await pg.waitForTimeout(1200);
  const vis = sel => pg.evaluate(s => [...document.querySelectorAll(s)].filter(n => n.offsetParent || getComputedStyle(n).display !== 'none' && n.getClientRects().length).length, sel);
  const btns = await pg.evaluate(() => [...document.querySelectorAll('#help-seg button')].map(x => x.textContent + ':' + x.getAttribute('aria-pressed')));
  if (btns.join() !== '拼音 Pinyin:true,English:false') bad.push('switches: ' + btns);
  if (await pg.evaluate(() => !!document.querySelector('.help-label, .help-desc'))) bad.push('old label still there');
  // a place: pinyin shows, English waits behind "What does that mean?"
  await pg.evaluate(() => start('noodles')); await pg.waitForTimeout(600);
  const s1 = { py: await vis('#log .row.npc .py'), en: await vis('#log .row.npc .en-line'), optEn: await vis('#move .opt .en-line') };
  if (!s1.py || s1.en || s1.optEn) bad.push('place, English off: ' + JSON.stringify(s1));
  await pg.click('#log .row.npc .reveal'); await pg.waitForTimeout(100);
  if (!(await vis('#log .row.npc .en-line'))) bad.push('"What does that mean?" shows nothing');
  await pg.click('#help-seg button:has-text("English")'); await pg.waitForTimeout(300);
  const s2 = { en: await vis('#log .row.npc .en-line'), optEn: await vis('#move .opt .en-line') };
  if (!s2.en || !s2.optEn) bad.push('place, English on: ' + JSON.stringify(s2));
  await pg.click('#help-seg button:has-text("Pinyin")'); await pg.waitForTimeout(300);
  if (await vis('#move .opt .py')) bad.push('pinyin off but still shown');
  await pg.screenshot({ path: 't71-place.png' });
  // the pocket's every line: English on shows it, off hides it, a tap on the line shows both
  await pg.evaluate(() => { trip.ids = ['noodles']; trip.day = dayKey(); tripEditing = false; startPhrasebook(); }); await pg.waitForTimeout(500);
  const p1 = { py: await vis('#log .pb-row .py'), en: await vis('#log .pb-row .en-line') };
  if (p1.py || !p1.en) bad.push('pocket, py off en on: ' + JSON.stringify(p1));
  await pg.click('#help-seg button:has-text("English")'); await pg.waitForTimeout(300);
  if (await vis('#log .pb-row .en-line')) bad.push('pocket, English off but shown');
  await pg.click('#log .pb-row .han >> nth=0'); await pg.waitForTimeout(100);
  const p2 = { py: await vis('#log .pb-row .py'), en: await vis('#log .pb-row .en-line') };
  if (p2.py !== 1 || p2.en !== 1) bad.push('pocket tap reveal: ' + JSON.stringify(p2));
  await pg.screenshot({ path: 't71-pocket.png' });
  // the day page's words for today follow the switches too
  await pg.evaluate(() => startHome()); await pg.waitForTimeout(400);
  const d = { py: await vis('.daily-card .dc-py'), en: await vis('.daily-card .dc-en'), shown: await pg.evaluate(() => getComputedStyle($('#help-seg')).display !== 'none') };
  if (d.py || d.en || !d.shown) bad.push('day page: ' + JSON.stringify(d));
  // and they stick after a reload
  await pg.reload(); await pg.waitForFunction(() => document.querySelectorAll('#help-seg button').length === 2); await pg.waitForTimeout(300);
  const b2 = await pg.evaluate(() => [...document.querySelectorAll('#help-seg button')].map(x => x.getAttribute('aria-pressed')).join());
  if (b2 !== 'false,false') bad.push('not kept: ' + b2);
  if (errs.length) bad.push('errors: ' + errs.join(' | '));
  console.log(bad.length ? 'FAIL t71\n' + bad.join('\n') : 'PASS t71'); await b.close();
})();
