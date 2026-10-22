// Full stack in a browser: sign up, add a key, chat, then a second device signs in and has it all
const { chromium } = require('./pw');
const URL = process.env.SM_URL || 'http://localhost:8799/';
(async () => {
  const b = await chromium.launch(); const errs = [], bad = [];
  const dev = async () => { const ctx = await b.newContext({ viewport: { width: 1300, height: 900 } }); const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(e.message)); await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort()); return pg; };
  const email = `e2e${Date.now()}@example.com`;
  // Device 1: some progress before signing up
  const a = await dev();
  await a.goto(URL); await a.waitForTimeout(800);
  if (!(await a.locator('#acct-btn').innerText()).includes('Sign in')) bad.push('no sign-in button');
  await a.evaluate(() => { openNotes(noteNew('牛肉面 niúròu miàn beef noodles').id); }); await a.waitForTimeout(300);
  await a.evaluate(() => closeNotes());
  await a.evaluate(() => startChats()); await a.waitForTimeout(300);
  const note1 = await a.locator('#log, #scene').first().innerText();
  if (!note1.includes('Sign in and add your Claude key to chat')) bad.push('signed-out chat hint: ' + note1.slice(0, 200));
  // Sign up
  await a.click('#acct-btn'); await a.click('dialog.acct .switch button:has-text("Create an account")');
  await a.fill('dialog.acct input[name=email]', email); await a.fill('dialog.acct input[name=password]', 'longenough1');
  await Promise.all([a.waitForNavigation(), a.click('dialog.acct button[type=submit]')]); await a.waitForTimeout(1000);
  if (!(await a.locator('#acct-btn').innerText()).includes('Account')) bad.push('not signed in after sign-up');
  const notesKept = await a.evaluate(() => localStorage.getItem('sm-notes') || '');
  if (!notesKept.includes('牛肉面')) bad.push('local note lost on sign-up');
  await a.evaluate(() => startChats()); await a.waitForTimeout(300);
  if (!(await a.locator('#scene').innerText()).includes('Add your Claude key in Account to chat')) bad.push('no add-key hint');
  // Add a key
  await a.click('#acct-btn');
  await a.fill('dialog.acct input[name=key]', 'sk-ant-api03-wrong-000000000000000000000');
  await a.click('dialog.acct button:has-text("Save key")'); await a.waitForTimeout(500);
  const errText = await a.locator('dialog.acct .err').first().innerText();
  if (!errText.includes("didn't accept")) bad.push('bad key not refused: ' + errText);
  await a.fill('dialog.acct input[name=key]', 'sk-ant-api03-good-000000000000000000000');
  await Promise.all([a.waitForNavigation(), a.click('dialog.acct button:has-text("Save key")')]); await a.waitForTimeout(1000);
  // Chat
  await a.evaluate(() => startChat('chen')); await a.waitForTimeout(400);
  const inp = a.locator('#move input[type=text]').first();
  await inp.fill('明天见'); await inp.press('Enter');
  await a.locator('text=好啊，明天见').waitFor({ timeout: 8000 });
  await a.waitForTimeout(3500); // the debounced save
  // Device 2
  const c = await dev();
  await c.goto(URL); await c.waitForTimeout(600);
  await c.click('#acct-btn');
  await c.fill('dialog.acct input[name=email]', email); await c.fill('dialog.acct input[name=password]', 'longenough1');
  await Promise.all([c.waitForNavigation(), c.click('dialog.acct button[type=submit]')]); await c.waitForTimeout(1500);
  const chats = await c.evaluate(() => localStorage.getItem('sm-chats') || '');
  if (!chats.includes('好啊，明天见')) bad.push('chat not synced');
  if (!(await c.evaluate(() => localStorage.getItem('sm-notes') || '')).includes('牛肉面')) bad.push('note not synced');
  await c.evaluate(() => startChat('chen')); await c.waitForTimeout(400);
  if (!(await c.locator('#log').innerText()).includes('好啊，明天见')) bad.push('chat not shown on device 2');
  // A change on device 2 reaches device 1 when it comes back
  await c.evaluate(() => { const n = JSON.parse(localStorage.getItem('sm-notes')); n.unshift({ id: 'z', body: '从第二台设备', t: Date.now() }); localStorage.setItem('sm-notes', JSON.stringify(n)); });
  await c.waitForTimeout(3500);
  await a.reload(); await a.waitForTimeout(1500);
  if (!(await a.evaluate(() => localStorage.getItem('sm-notes') || '')).includes('从第二台设备')) bad.push('device 2 note not on device 1 after reload');
  // Sign out clears the device
  await c.click('#acct-btn');
  await Promise.all([c.waitForNavigation(), c.click('dialog.acct button:has-text("Sign out")')]); await c.waitForTimeout(800);
  const left = await c.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('sm-') && !['sm-prefs'].includes(k)));
  if (left.some(k => ['sm-notes', 'sm-chats'].includes(k))) bad.push('sign-out left data: ' + left.join(','));
  if (!(await c.locator('#acct-btn').innerText()).includes('Sign in')) bad.push('still signed in');
  await c.screenshot({ path: 'fs-signedout.png' });
  console.log('BAD', bad);
  console.log('ERRORS', errs.concat(bad)); await b.close();
})();
