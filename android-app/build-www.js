// Puts the app's own files into www/ for the Android app: the same page as everywhere else, plus app-shim.js,
// which gives it the phone's own voice. Run from android-app/: node build-www.js
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..'), www = path.join(__dirname, 'www');
fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(path.join(www, 'films'), { recursive: true });
let page = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const at = '<script src="ai.js"></script>';
if (page.split(at).length !== 2) throw new Error('expected one ai.js script tag in index.html');
page = page.replace(at, '<script src="app-shim.js"></script>\n' + at);
fs.writeFileSync(path.join(www, 'index.html'), page);
const scripts = ['ai.js', 'scenes.js', 'why.js', 'voices.js', 'daily.js', 'journey.js', 'people.js', 'films.js'];
for (const f of scripts) fs.copyFileSync(path.join(root, f), path.join(www, f));
fs.copyFileSync(path.join(__dirname, 'app-shim.js'), path.join(www, 'app-shim.js'));
const films = fs.readdirSync(path.join(root, 'films')).filter(f => /\.(webm|jpg)$/.test(f));
for (const f of films) fs.copyFileSync(path.join(root, 'films', f), path.join(www, 'films', f));
console.log(`www/: index.html, app-shim.js, ${scripts.length} scripts, ${films.length} film files`);
