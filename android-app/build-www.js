// Puts the app's own files into www/ for the Android app: the same page as everywhere else, plus capacitor.js
// (Capacitor's own runtime, which lets the page reach the phone's plugins) and app-shim.js, which gives it the
// phone's own voice and keeps it up to date. Run from android-app/: node build-www.js
// SM_WEB_V is the version number (GitHub sets it to the build number). web.json lists every file with its
// SHA-256, so a phone only downloads what changed; "native" changes only with the Android side (plugins, settings),
// and a phone takes an update only when it matches, otherwise it asks for the new APK.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.resolve(__dirname, '..');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const native = () => sha(['package-lock.json', 'capacitor.config.json'].map(f => fs.readFileSync(path.join(__dirname, f), 'utf8')).join('\n')).slice(0, 12);

function build(www = path.join(__dirname, 'www'), v = Number(process.env.SM_WEB_V) || 0) {
  fs.rmSync(www, { recursive: true, force: true });
  fs.mkdirSync(path.join(www, 'films'), { recursive: true });
  let page = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const at = '<script src="ai.js"></script>';
  if (page.split(at).length !== 2) throw new Error('expected one ai.js script tag in index.html');
  page = page.replace(at, '<script src="capacitor.js"></script>\n<script src="app-shim.js"></script>\n' + at);
  fs.writeFileSync(path.join(www, 'index.html'), page);
  const scripts = ['ai.js', 'scenes.js', 'why.js', 'voices.js', 'daily.js', 'journey.js', 'people.js', 'films.js', 'street.js'];
  for (const f of scripts) fs.copyFileSync(path.join(root, f), path.join(www, f));
  fs.mkdirSync(path.join(www, 'vendor')); fs.copyFileSync(path.join(root, 'vendor/three-street.js'), path.join(www, 'vendor/three-street.js'));
  fs.copyFileSync(require.resolve('@capacitor/core/dist/capacitor.js', { paths: [__dirname] }), path.join(www, 'capacitor.js'));
  const films = fs.readdirSync(path.join(root, 'films')).filter(f => /\.(webm|jpg)$/.test(f));
  for (const f of films) fs.copyFileSync(path.join(root, 'films', f), path.join(www, 'films', f));
  return manifest(www, v);
}

// app-shim.js learns its own version and web.json is written; also used by the tests after changing a file
function manifest(www, v, nat = native()) {
  const shim = fs.readFileSync(path.join(__dirname, 'app-shim.js'), 'utf8');
  const mark = /\/\*WEB\*\/.*?\/\*WEB\*\//;
  if (!mark.test(shim)) throw new Error('app-shim.js has no /*WEB*/ mark');
  fs.writeFileSync(path.join(www, 'app-shim.js'), shim.replace(mark, `/*WEB*/{ v: ${v}, native: "${nat}" }/*WEB*/`));
  const files = {};
  const walk = d => fs.readdirSync(path.join(www, d)).sort().forEach(n => {
    const f = d ? d + '/' + n : n;
    if (fs.statSync(path.join(www, f)).isDirectory()) walk(f); else if (f !== 'web.json') files[f] = sha(fs.readFileSync(path.join(www, f)));
  });
  walk('');
  const web = { v, native: nat, files };
  fs.writeFileSync(path.join(www, 'web.json'), JSON.stringify(web, null, 1));
  return web;
}

module.exports = { build, manifest };
if (require.main === module) {
  const web = build();
  console.log(`www/: version ${web.v}, native ${web.native}, ${Object.keys(web.files).length} files`);
}
