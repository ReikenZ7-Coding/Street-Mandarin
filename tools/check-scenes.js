// Sanity-checks scenes.js: run `node tools/check-scenes.js` after adding or editing a place.
global.window = {};
require("../scenes.js");
const S = window.SCENES, ids = new Set(), problems = [];
const strip = h => h.replace(/[，。！？、,.!?…“”"'：:；;（）() ]/g, "");
const line = (x, where) => { if (!Array.isArray(x) || x.length !== 3 || x.some(v => typeof v !== "string")) problems.push(`${where}: expected [hanzi, pinyin, English]`); };
function checkTurn(t, where, flags) {
  if (!t.prompt) problems.push(`${where}: missing prompt`);
  if (t.npc) line(t.npc, where + " npc");
  if (!Array.isArray(t.opts) || !t.opts.length) return problems.push(`${where}: no options`);
  if (!t.opts.some(o => o.k === "good")) problems.push(`${where}: no good option`);
  if (!t.opts.some(o => o.k === "good" && o.b)) problems.push(`${where}: no good option has build tiles (b)`);
  t.opts.forEach((o, i) => {
    const w = `${where} option ${i + 1} (${o.h})`;
    for (const f of ["h", "p", "e", "k", "note"]) if (!o[f]) problems.push(`${w}: missing ${f}`);
    if (!["good", "okay", "wrong"].includes(o.k)) problems.push(`${w}: k must be good, okay or wrong`);
    if (o.k !== "good" && !o.r && !o.quiet) problems.push(`${w}: not good but has no reaction (r)`);
    if (o.r) line(o.r, w + " r");
    if (o.fix && (!Array.isArray(o.fix) || o.fix.length !== 2)) problems.push(`${w}: fix should be [hanzi, pinyin]`);
    if (o.b && o.b.split("|").join("") !== strip(o.h)) problems.push(`${w}: tiles "${o.b}" don't spell the line`);
    if (o.flag) flags.add(o.flag);
  });
}
for (const s of S) {
  const where = `[${s.id}]`;
  if (ids.has(s.id)) problems.push(`${where}: duplicate id`); ids.add(s.id);
  for (const f of ["place", "placePy", "en", "who", "whoEn", "goal", "intro", "endNote"]) if (!s[f]) problems.push(`${where}: missing ${f}`);
  line(s.end, where + " end");
  const flags = new Set();
  s.turns.forEach((t, i) => checkTurn(t, `${where} turn ${i + 1}`, flags));
  (s.curveballs || []).forEach((c, i) => {
    if (c.flag) flags.add(c.flag);
    if (typeof c.after !== "number" || c.after < 0 || c.after >= s.turns.length) problems.push(`${where} curveball ${i + 1}: 'after' out of range`);
    checkTurn(c.turn, `${where} curveball ${i + 1}`, flags);
  });
  s.turns.forEach((t, i) => Object.keys(t.npcAlt || {}).forEach(f => { if (!flags.has(f)) problems.push(`${where} turn ${i + 1}: npcAlt "${f}" is never set by any option`); }));
  Object.keys(s.endAlt || {}).forEach(f => { if (!flags.has(f)) problems.push(`${where}: endAlt "${f}" is never set by any option`); });
}
if (problems.length) { console.log(problems.join("\n")); process.exit(1); }
console.log(`${S.length} places look fine.`);
