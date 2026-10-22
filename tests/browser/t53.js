const { chromium } = require('./pw');
const fs = require('fs');
const bible = JSON.parse(fs.readFileSync(__dirname + '/fixtures/long-story/bible.json', 'utf8')), ch = JSON.parse(fs.readFileSync(__dirname + '/fixtures/long-story/ch-1.1.json', 'utf8'));
const chap = () => ({ title_en: ch.title_english, title_zh: ch.title_hanzi, blocks: ch.blocks, moment: { prompt: ch.moment.prompt, npc: null, opts: ch.moment.opts }, summary: ch.summary, words: ch.new_words, counted: true });
const said = { h: '还没吃呢。', p: '', e: '', k: 'good', note: '', r: null };
const st = { bible: Object.assign({}, bible, { answer: 'The cat was the old tenant\'s, and she wanted you to have it.', cast: bible.cast.map(c => Object.assign({ address: c.name_hanzi }, c)) }), n: 1, name: '马修', pace: 'free', chapters: {
  '1.1': Object.assign(chap(), { said }), '1.2': Object.assign(chap(), { said }), '1.3': Object.assign(chap(), { said: Object.assign({}, said, { k: 'wrong' }) }), '1.4': chap() }, words: { 小区: { p: 'xiǎoqū', e: 'housing compound', seen: 2, tapped: 1 }, 物业: { p: 'wùyè', e: 'property office', seen: 5, tapped: 0 } }, doneOn: {}, lastAt: 0 };
(async () => {
  const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1200, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.addInitScript(st => { localStorage.setItem('sm-long', JSON.stringify(st)); localStorage.setItem('sm-said', '9'); localStorage.setItem('sm-done', JSON.stringify({ noodles: true })); window.claude = { use: async () => ({ json: async () => ({}) }) }; }, st);
  await pg.goto(require('./pw').APP); await pg.waitForTimeout(600);
  console.log('MORNING WORD', (await pg.locator('.daily-card').first().innerText()).replace(/\n+/g, ' | '));
  console.log('TONIGHT', (await pg.locator('.today-card', { hasText: "Tonight" }).innerText()).replace(/\n+/g, ' | '));
  await pg.locator('#tool-long').click();
  console.log('PEOPLE', (await pg.locator('.ls-cast').innerText()).replace(/\n+/g, ' | ').slice(0, 250));
  await pg.locator('button.ls-person:not([disabled])').first().click();
  console.log('PERSON', (await pg.locator('#scene .scene-head').innerText()).replace(/\n+/g, ' | '), '| lines', await pg.locator('#log .row.npc').count());
  await pg.locator('#move .btn', { hasText: 'Story home' }).click();
  await pg.locator('#move .btn', { hasText: 'Continue' }).click();
  console.log('PREVIOUSLY', await pg.locator('.ls-prev').count(), '| listen btn', await pg.locator('.ls-chap-row .linkish').count(), '| rewrite', await pg.locator('.ls-chap-row .linkish', { hasText: 'Rewrite' }).count());
  await pg.locator('#move .btn', { hasText: 'Your line' }).click();
  await pg.locator('#move .opt', { hasText: '还没吃呢' }).click();
  await pg.locator('#move .btn', { hasText: 'The end' }).click();
  console.log('END', (await pg.locator('#log').innerText()).replace(/\n+/g, ' | '));
  console.log('END MOVE', await pg.locator('#move').innerText());
  console.log('ERRORS', errs); await b.close();
})();
