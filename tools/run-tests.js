// Runs the browser tests: node tools/run-tests.js [t72 t73 ...] [--ai] [--server]
//   no names: every tests/browser/t*.js, three at a time
//   --ai:     also the tests that play Unscripted and Long Story against a mock Claude (tests/browser/ai)
//   --server: also the tests of the real server (t62-t64, t78), after the other tests: it starts the website with
//             stand-ins for Claude and the online AIs on 8799, and solo mode on 8798 with a stand-in model on 18234
// A test fails if it exits with an error, prints a FAIL line, or reports page errors.
// Failures are re-run once on their own, since a few timing tests are touchy when the machine is busy.
// Screenshots land in tests/browser/shots/.
const { spawn } = require('child_process'), fs = require('fs'), path = require('path');
const dir = path.resolve(__dirname, '../tests/browser'), shots = path.join(dir, 'shots');
const args = process.argv.slice(2), flags = new Set(args.filter(a => a.startsWith('--')));
const named = args.filter(a => !a.startsWith('--')).map(a => a.replace(/\.js$/, ''));
const NEEDS_SERVER = ['t62', 't63', 't64', 't78'];
let tests = named.length ? named.map(n => n.includes('/') ? n : (fs.existsSync(path.join(dir, n + '.js')) ? n : 'ai/' + n))
  : fs.readdirSync(dir).filter(f => /^t\d+\.js$/.test(f)).map(f => f.slice(0, -3))
      .filter(t => flags.has('--server') || !NEEDS_SERVER.includes(t))
      .concat(flags.has('--ai') ? fs.readdirSync(path.join(dir, 'ai')).filter(f => /^t\d+\.js$/.test(f)).map(f => 'ai/' + f.slice(0, -3)) : []);
tests.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
fs.mkdirSync(shots, { recursive: true });

const root = path.resolve(__dirname, '..'), env = { ...process.env };
const run = t => new Promise(done => {
  const p = spawn(process.execPath, [path.join(dir, t + '.js')], { cwd: shots, env });
  let out = ''; p.stdout.on('data', d => out += d); p.stderr.on('data', d => out += d);
  const timer = setTimeout(() => { p.kill(); out += '\nTIMEOUT after 150s'; }, 150000);
  p.on('close', code => {
    clearTimeout(timer);
    const lines = out.trim().split('\n');
    const fi = lines.findIndex(l => /^FAIL t\d+/.test(l)); // a test's own FAIL line is followed by its reasons
    const why = fi >= 0 ? lines.slice(fi, fi + 6) : lines.filter(l => /^FAIL|TIMEOUT|^\s*at .*\.js:\d+|Error:/.test(l) || /^(ERRORS|errs|BAD) \[(?!\])/.test(l.trim()));
    done({ t, ok: code === 0 && !why.length, why: why.slice(0, 6), tail: lines.slice(-4) });
  });
});
const pool = async (list, n) => { const res = [], q = [...list]; await Promise.all(Array.from({ length: n }, async () => { while (q.length) { const t = q.shift(); const r = await run(t); res.push(r); process.stdout.write(r.ok ? '.' : 'x'); } })); return res; };

// The servers the server tests need, started here and stopped at the end
const kids = [];
const start = (args, opts = {}) => new Promise(ok => {
  const p = spawn(process.execPath, args, { cwd: opts.cwd || root, env: { ...process.env, ...opts.env }, stdio: ['ignore', 'pipe', 'pipe'] });
  kids.push(p); let said = false; const go = () => { if (!said) { said = true; ok(p); } };
  p.stdout.on('data', go); setTimeout(go, 4000);
});
// t64 stops the stand-in model to see an offline model explained, so it gets a fresh one each run
const model = async () => { const p = await start(['tests/browser/ai/standin-model.js', '18234', '--models', 'qwen3.5-9b-defiant-fable']); env.FAKE_PID = String(p.pid); };
async function servers() {
  await start(['test/e2e-server.js', '8799'], { cwd: path.join(root, 'server') });
  await model();
  await start(['src/solo.js'], { cwd: path.join(root, 'server'), env: { PORT: '8798', LOCAL_AI_URL: 'http://localhost:18234/v1', DATABASE_URL: 'memory' } }); // in memory: never your own solo progress
  env.SM_MODEL_URL = 'http://localhost:18234/v1';
}

(async () => {
  console.log(`Running ${tests.length} browser tests`);
  const serverTests = tests.filter(t => NEEDS_SERVER.includes(t)), plain = tests.filter(t => !NEEDS_SERVER.includes(t));
  const first = await pool(plain, 3);
  if (serverTests.length) { await servers(); for (const t of serverTests) { const r = await run(t); first.push(r); process.stdout.write(r.ok ? '.' : 'x'); } }
  console.log();
  const failed = first.filter(r => !r.ok), still = [];
  for (const r of failed) { if (r.t === 't64') await model(); const again = await run(r.t); (again.ok ? console.log(`${r.t}: passed when run on its own (timing)`) : still.push(again)); }
  kids.forEach(p => { try { p.kill(); } catch {} });
  for (const r of still) console.log(`\nFAIL ${r.t}\n  ${(r.why.length ? r.why : r.tail).join('\n  ')}`);
  console.log(`\n${tests.length - still.length} of ${tests.length} passed${failed.length - still.length ? ` (${failed.length - still.length} only on a second, solo run)` : ''}. Screenshots: ${shots}`);
  process.exit(still.length ? 1 : 0);
})();
