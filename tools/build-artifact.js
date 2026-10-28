// Builds the claude.ai artifact version of the app: node tools/build-artifact.js [out-dir]
// Publish out-dir/street-mandarin.html with the files beside it (the scene scripts and films/).
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..'), out = path.resolve(process.argv[2] || path.join(root, 'dist-artifact'));
let s = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
s = s.slice(s.indexOf('<title>'));
if (s.split('</head>\n<body>\n').length !== 2) throw new Error('expected one "</head><body>" line in index.html');
s = s.replace('</head>\n<body>\n', '').trimEnd();
if (s.endsWith('</html>')) s = s.slice(0, -'</html>'.length).trimEnd();
if (!s.endsWith('</body>')) throw new Error('index.html should end with </body></html>');
s = s.slice(0, -'</body>'.length).trimEnd() + '\n';
fs.mkdirSync(path.join(out, 'films'), { recursive: true });
fs.writeFileSync(path.join(out, 'street-mandarin.html'), s);
const scripts = ['ai.js', 'scenes.js', 'why.js', 'voices.js', 'daily.js', 'journey.js', 'people.js', 'films.js', 'street.js'];
for (const f of scripts) fs.copyFileSync(path.join(root, f), path.join(out, f));
fs.mkdirSync(path.join(out, 'vendor'), { recursive: true }); fs.copyFileSync(path.join(root, 'vendor/three-street.js'), path.join(out, 'vendor/three-street.js'));
for (const f of fs.readdirSync(path.join(out, 'films'))) fs.unlinkSync(path.join(out, 'films', f));
const films = fs.readdirSync(path.join(root, 'films')).filter(f => /\.(webm|jpg)$/.test(f));
for (const f of films) fs.copyFileSync(path.join(root, 'films', f), path.join(out, 'films', f));
console.log(`${path.join(out, 'street-mandarin.html')} (${s.length} chars), ${scripts.length} scripts, ${films.length} film files`);
