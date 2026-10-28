// The Android app updates itself (a stand-in for the phone's files, its web view and the GitHub release): a newer
// version is found, only its changed files are downloaded and checked, and the app switches to it the next time it
// opens, keeping progress; a version that doesn't start is dropped for the one before and never tried again; a
// version that needs a new APK asks for it instead
const { chromium } = require('./pw');
const fs = require('fs'), os = require('os'), path = require('path');
const W = require('../../android-app/build-www.js');
const BASE = 'https://github.com/ReikenZ7-Coding/Street-Mandarin/releases/download/android-latest/';
const DATA = '/data/user/0/com.streetmandarin.app/files/';
(async () => {
  const bad = [], errs = [], tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sm-up-'));
  const read = (dir, f) => fs.readFileSync(path.join(dir, f));
  // the APK's own files (version 5) and what's on the release
  const apk = path.join(tmp, 'apk'); W.build(apk, 5);
  const rel = {}; let fetched = [];
  const publish = (dir, change) => {
    fs.rmSync(dir, { recursive: true, force: true }); fs.cpSync(apk, dir, { recursive: true }); change(dir);
    const web = W.manifest(dir, change.v, change.native);
    for (const [f, sha] of Object.entries(web.files)) rel['w-' + sha.slice(0, 16) + (f.match(/\.\w+$/) || [''])[0]] = read(dir, f);
    rel['web.json'] = read(dir, 'web.json');
  };
  const v6 = Object.assign(d => fs.appendFileSync(path.join(d, 'index.html'), '\n<!-- version 6 -->\n'), { v: 6 });
  publish(path.join(tmp, 'v6'), v6);
  // the phone: its files (kept across launches), and what its web view serves
  const disk = new Map(); let serving = 'public', persisted = 'public', calls = [];
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await ctx.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await ctx.route(BASE + '**', r => {
    const n = new URL(r.request().url()).pathname.split('/').pop(); fetched.push(n);
    rel[n] ? r.fulfill({ body: rel[n], contentType: 'application/octet-stream', headers: { 'access-control-allow-origin': '*' } }) : r.fulfill({ status: 404, body: '' });
  });
  await ctx.route('https://localhost/**', r => {
    const f = decodeURIComponent(new URL(r.request().url()).pathname.slice(1)) || 'index.html';
    const body = serving === 'public' ? (fs.existsSync(path.join(apk, f)) ? read(apk, f) : null) : disk.get(serving.slice(DATA.length) + '/' + f);
    const type = /\.html$/.test(f) ? 'text/html' : /\.js$/.test(f) ? 'text/javascript' : /\.json$/.test(f) ? 'application/json' : 'application/octet-stream';
    body ? r.fulfill({ body, contentType: type }) : r.fulfill({ status: 404, body: '' });
  });
  await ctx.exposeBinding('__native', async (_, plugin, op, a) => {
    calls.push(plugin + '.' + op);
    if (plugin === 'WebView') {
      if (op === 'getServerBasePath') return { path: serving };
      if (op === 'persistServerBasePath') { persisted = serving; return; }
      if (op === 'setServerBasePath') { serving = a.path; setTimeout(() => pg.goto('https://localhost/').catch(() => {}), 50); return; }
    }
    const p = x => x.replace(/\/+$/, '');
    if (op === 'writeFile') return void disk.set(p(a.path), Buffer.from(a.data, 'base64'));
    if (op === 'copy') { if (!disk.has(a.from)) throw new Error('no ' + a.from); return void disk.set(a.to, disk.get(a.from)); }
    if (op === 'mkdir') return;
    if (op === 'rmdir') { for (const k of [...disk.keys()]) if (k.startsWith(p(a.path) + '/')) disk.delete(k); return; }
    if (op === 'readdir') return { files: [...new Set([...disk.keys()].filter(k => k.startsWith(a.path + '/')).map(k => k.slice(a.path.length + 1).split('/')[0]))].map(name => ({ name })) };
    if (op === 'getUri') return { uri: 'file://' + DATA + a.path };
  });
  await ctx.addInitScript(() => {
    // what Android's native bridge provides; capacitor.js (in the app's files) builds registerPlugin on top of it
    window.androidBridge = { postMessage() {} };
    window.Capacitor = { PluginHeaders: [{ name: 'TextToSpeech', methods: ['speak', 'stop'] }, { name: 'WebView', methods: ['setServerBasePath', 'getServerBasePath', 'persistServerBasePath', 'setServerAssetPath'] },
      { name: 'Filesystem', methods: ['writeFile', 'copy', 'mkdir', 'rmdir', 'readdir', 'getUri', 'readFile', 'deleteFile', 'stat'] }].map(h => ({ name: h.name, methods: h.methods.map(name => ({ name, rtype: 'promise' })) })),
      nativePromise: (name, op, a) => name === 'TextToSpeech' ? Promise.resolve() : window.__native(name, op, a), nativeCallback() {} };
    if (!localStorage.getItem('sm-said')) localStorage.setItem('sm-said', '1');
  });
  const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (/Update check/.test(m.text())) errs.push(m.text()); });
  const launch = async () => { serving = persisted; await pg.goto('https://localhost/'); await pg.waitForTimeout(5000); };
  const ls = k => pg.evaluate(k => JSON.parse(localStorage.getItem(k)), k);
  const foot = () => pg.locator('#foot').innerText().catch(() => '');

  // 1. the APK's version finds 6, fetches only what changed, and keeps the rest from its own files
  await launch();
  await pg.evaluate(() => localStorage.setItem('sm-test-progress', '"kept"'));
  if (!/Version 5\./.test(await foot())) bad.push('footer before: ' + await foot());
  const got = fetched.filter(n => n !== 'web.json');
  if (got.length !== 2 || !got.every(n => /^w-[0-9a-f]{16}\.(html|js)$/.test(n))) bad.push('downloaded ' + got.join()); // index.html and the shim (it carries the version)
  const next = await ls('sm-web-next');
  if (!next || next.v !== 6 || next.path !== DATA + 'web/6') bad.push('next ' + JSON.stringify(next));
  const web6 = JSON.parse(rel['web.json']);
  for (const f of Object.keys(web6.files)) if (!disk.has('web/6/' + f) || !disk.get('web/6/' + f).equals(read(path.join(tmp, 'v6'), f))) bad.push('web/6/' + f + ' wrong');
  if (calls.includes('WebView.setServerBasePath')) bad.push('switched while open');
  if (!/Version 6 is ready/.test(await pg.locator('.sm-banner').innerText().catch(() => '')) || !(await pg.locator('.sm-banner button', { hasText: 'Restart now' }).count())) bad.push('no ready note');
  await pg.locator('#foot button', { hasText: 'Check for updates' }).click(); await pg.waitForTimeout(500);
  if (!/Version 6 is ready\. It starts the next time/.test(await foot())) bad.push('check button: ' + await foot());

  // 2. the next launch switches to it before anything shows; once it has started it's kept, and says so
  fetched = []; await launch();
  if (serving !== DATA + 'web/6') bad.push('serving ' + serving);
  if (persisted !== DATA + 'web/6') bad.push('not kept: ' + persisted);
  if (!/Version 6\./.test(await foot())) bad.push('footer after: ' + await foot());
  if (!/updated itself/.test(await pg.locator('.sm-banner').innerText().catch(() => ''))) bad.push('no updated note');
  if (await ls('sm-test-progress') !== 'kept') bad.push('progress lost');
  await pg.locator('#foot button', { hasText: 'Check for updates' }).click(); await pg.waitForTimeout(500);
  if (!/Up to date \(version 6\)/.test(await foot())) bad.push('up to date: ' + await foot());
  if (!/<!-- version 6 -->/.test(await pg.evaluate(() => fetch('index.html').then(r => r.text())))) bad.push('not the new page');
  await pg.screenshot({ path: 't80-updated.png' });

  // 3. version 7 doesn't start: the app goes back to 6 and never tries 7 again
  const v7 = Object.assign(d => { const f = path.join(d, 'index.html'); fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(/function startHome\(/, 'function startHomeX(')); }, { v: 7 });
  publish(path.join(tmp, 'v7'), v7);
  await launch(); // 6 finds 7 and copies its unchanged files from web/6
  if ((await ls('sm-web-next') || {}).v !== 7) bad.push('7 not found');
  if (!disk.has('web/7/films.js')) bad.push('7 not copied');
  await pg.locator('.sm-banner button', { hasText: 'Restart now' }).click(); await pg.waitForTimeout(5000); // switches to 7 now; it never says it started
  errs.length = 0; // (7 is broken on purpose)
  if (serving !== DATA + 'web/7' || persisted !== DATA + 'web/6') bad.push('7 kept: ' + persisted);
  fetched = []; await launch(); // the phone opens what was kept: 6
  if (!/Version 6\./.test(await foot())) bad.push('not back on 6: ' + await foot());
  if (await ls('sm-web-bad') !== 7 || await ls('sm-web-next')) bad.push('7 not dropped');
  if (fetched.some(n => n !== 'web.json')) bad.push('7 fetched again: ' + fetched.join());

  // 4. version 8 changes the Android side: the app asks for the new APK instead
  publish(path.join(tmp, 'v8'), Object.assign(() => {}, { v: 8, native: 'other' }));
  fetched = []; await launch();
  if (fetched.some(n => n !== 'web.json')) bad.push('8 downloaded: ' + fetched.join());
  const ask = await pg.locator('.sm-banner').innerText().catch(() => '');
  if (!/needs installing/.test(ask) || !(await pg.locator('.sm-banner button', { hasText: 'Get it' }).count())) bad.push('no ask for the APK: ' + ask);

  if (errs.length) bad.push('errors: ' + errs.join(' | '));
  console.log(bad.length ? 'FAIL t80\n' + bad.join('\n') : 'PASS t80');
  await b.close(); fs.rmSync(tmp, { recursive: true, force: true });
})();
