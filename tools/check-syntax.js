// Checks every inline <script> in index.html for syntax errors: node tools/check-syntax.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
let m, n = 0, bad = 0;
while ((m = re.exec(html))) {
  n++;
  const line = html.slice(0, m.index).split('\n').length;
  try { new vm.Script(m[1], { filename: `index.html (script starting on line ${line})`, lineOffset: line - 1 }); }
  catch (e) { bad++; console.log(e.stack.split('\n').slice(0, 5).join('\n')); }
}
console.log(bad ? `${bad} of ${n} scripts have syntax errors` : `${n} scripts, no syntax errors`);
process.exit(bad ? 1 : 0);
