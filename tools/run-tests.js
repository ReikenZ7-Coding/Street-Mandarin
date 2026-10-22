// Runs the browser tests: node tools/run-tests.js [t72 t73 ...] [--ai] [--server]
//   no names: every tests/browser/t*.js, three at a time
//   --ai:     also the tests that play Unscripted and Long Story against a mock Claude (tests/browser/ai)
//   --server: also t62-t64, which need `node server/test/e2e-server.js 8799` running
// A test fails if it exits with an error, prints a FAIL line, or reports page errors.
// Failures are re-run once on their own, since a few timing tests are touchy when the machine is busy.
// Screenshots land in tests/browser/shots/.
const { spawn } = require('child_process'), fs = require('fs'), path = require('path');
const dir = path.resolve(__dirname, '../tests/browser'), shots = path.join(dir, 'shots');
const args = process.argv.slice(2), flags = new Set(args.filter(a => a.startsWith('--')));
const named = args.filter(a => !a.startsWith('--')).map(a => a.replace(/\.js$/, ''));
const NEEDS_SERVER = ['t62', 't63', 't64'];
let tests = named.length ? named.map(n => n.includes('/') ? n : (fs.existsSync(path.join(dir, n + '.js')) ? n : 'ai/' + n))
  : fs.readdirSync(dir).filter(f => /^t\d+\.js$/.test(f)).map(f => f.slice(0, -3))
      .filter(t => flags.has('--server') || !NEEDS_SERVER.includes(t))
      .concat(flags.has('--ai') ? fs.readdirSync(path.join(dir, 'ai')).filter(f => /^t\d+\.js$/.test(f)).map(f => 'ai/' + f.slice(0, -3)) : []);
tests.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
fs.mkdirSync(shots, { recursive: true });

const run = t => new Promise(done => {
  const p = spawn(process.execPath, [path.join(dir, t + '.js')], { cwd: shots });
  let out = ''; p.stdout.on('data', d => out += d); p.stderr.on('data', d => out += d);
  const timer = setTimeout(() => { p.kill(); out += '\nTIMEOUT after 150s'; }, 150000);
  p.on('close', code => {
    clearTimeout(timer);
    const lines = out.trim().split('\n');
    const why = lines.filter(l => /^FAIL|TIMEOUT|^\s*at .*\.js:\d+|Error:/.test(l) || /^(ERRORS|errs|BAD) \[(?!\])/.test(l.trim()));
    done({ t, ok: code === 0 && !why.length, why: why.slice(0, 6), tail: lines.slice(-4) });
  });
});
const pool = async (list, n) => { const res = [], q = [...list]; await Promise.all(Array.from({ length: n }, async () => { while (q.length) { const t = q.shift(); const r = await run(t); res.push(r); process.stdout.write(r.ok ? '.' : 'x'); } })); return res; };

(async () => {
  console.log(`Running ${tests.length} browser tests`);
  const first = await pool(tests, 3); console.log();
  const failed = first.filter(r => !r.ok), still = [];
  for (const r of failed) { const again = await run(r.t); (again.ok ? console.log(`${r.t}: passed when run on its own (timing)`) : still.push(again)); }
  for (const r of still) console.log(`\nFAIL ${r.t}\n  ${(r.why.length ? r.why : r.tail).join('\n  ')}`);
  console.log(`\n${tests.length - still.length} of ${tests.length} passed${failed.length - still.length ? ` (${failed.length - still.length} only on a second, solo run)` : ''}. Screenshots: ${shots}`);
  process.exit(still.length ? 1 : 0);
})();
