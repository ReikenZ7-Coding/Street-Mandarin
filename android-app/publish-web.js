// For GitHub's build: which of www/'s files the android-latest release still needs. Each file goes up under a name
// made from its SHA-256 (w-<16 hex><ext>), so a phone fetches only what changed. Reads the release's asset names
// on stdin; copies the missing files into up/ and writes the names this version uses to want.txt.
const fs = require('fs'), path = require('path');
const www = path.join(__dirname, 'www'), web = JSON.parse(fs.readFileSync(path.join(www, 'web.json'), 'utf8'));
const have = new Set(fs.readFileSync(0, 'utf8').split('\n')), want = [];
fs.mkdirSync('up', { recursive: true });
for (const [f, sha] of Object.entries(web.files)) {
  const n = 'w-' + sha.slice(0, 16) + ((f.match(/\.\w+$/) || [''])[0]);
  want.push(n);
  if (!have.has(n)) fs.copyFileSync(path.join(www, f), path.join('up', n));
}
fs.writeFileSync('want.txt', want.join('\n') + '\n');
console.log(`version ${web.v}: ${fs.readdirSync('up').length} of ${want.length} files to upload`);
