// Turns raw clips (from ComfyUI on your laptop, see notes/films) into the app's filmed world.
//   node tools/make-films.js <folder with the raw .mp4 clips> [--credit "who made them"]
// Clips are recognised by name: grove (the bamboo pass), dawn (a new day), and peaks-1 … peaks-N (behind the page).
// Each one becomes a small VP9 .webm and a poster frame in films/, and films.js lists them for the app.
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const args = process.argv.slice(2), ci = args.indexOf("--credit");
const credit = ci >= 0 ? args.splice(ci, 2)[1] : "";
const src = args[0];
if (!src || !fs.existsSync(src)) { console.error("Usage: node tools/make-films.js <folder with the raw clips> [--credit \"…\"]"); process.exit(1); }
// the time of day each shot of the peaks belongs to (the prompts in notes/films/make-clips.md); others suit any time
const TIMES = { "peaks-1": "morning", "peaks-2": "out", "peaks-3": "evening", "peaks-4": "out" };
const out = path.join(root, "films");
fs.mkdirSync(out, { recursive: true });

// the clip's average brightness (0 to 255), sampled from about one frame a second
const meanLuma = f => {
  const o = execFileSync("ffmpeg", ["-hide_banner", "-i", f, "-vf", "fps=1,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-", "-f", "null", "-"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  const v = [...o.matchAll(/YAVG=([\d.]+)/g)].map(m => +m[1]);
  return v.length ? v.reduce((a, b) => a + b) / v.length : 130;
};
const ff = (...a) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...a], { stdio: "inherit" });
const raw = fs.readdirSync(src).filter(f => /\.(mp4|webm|mov|mkv)$/i.test(f)).sort();
const films = { peaks: [], grove: null, dawn: null, credit };
for (const f of raw) {
  const m = f.toLowerCase().match(/^(grove|dawn|peaks-\d+)/);
  if (!m) { console.log(`skipped ${f} (name it grove, dawn or peaks-1, peaks-2 …)`); continue; }
  const name = m[1], inp = path.join(src, f);
  // no sound, at most 1280 wide, 24 frames a second, quality over size (each is a few megabytes)
  ff("-i", inp, "-an", "-vf", "scale='min(1280,iw)':-2:flags=lanczos,fps=24,format=yuv420p", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "32",
    "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", path.join(out, name + ".webm"));
  ff("-ss", "1", "-i", inp, "-frames:v", "1", "-vf", "scale='min(1280,iw)':-2", "-q:v", "4", path.join(out, name + ".jpg"));
  const shot = { src: `films/${name}.webm`, poster: `films/${name}.jpg` };
  // clips come out of the generator lighter or darker than each other; a gain evens the shots of the peaks and the dawn out
  if (name !== "grove") { const g = Math.min(1.7, Math.max(0.85, Math.sqrt(130 / meanLuma(inp)))); if (Math.abs(g - 1) > 0.03) shot.gain = +g.toFixed(2); }
  if (name === "grove") films.grove = shot;
  else if (name === "dawn") films.dawn = { ...shot, time: "morning" };
  else films.peaks.push(TIMES[name] ? { ...shot, time: TIMES[name] } : shot);
  console.log(`${name}: ${(fs.statSync(path.join(out, name + ".webm")).size / 1e6).toFixed(1)} MB`);
}
if (!films.peaks.length) { console.error("No peaks clips found, so the app keeps its drawn world. Name at least one clip peaks-1."); process.exit(1); }
fs.writeFileSync(path.join(root, "films.js"), `// The filmed world's clips, made by tools/make-films.js. Remove the files and set this to null to go back to the world drawn in code.\nwindow.FILMS = ${JSON.stringify(films, null, 1)};\n`);
console.log(`films.js lists ${films.peaks.length} shot(s) of the peaks${films.grove ? ", the grove" : ""}${films.dawn ? ", the dawn" : ""}.`);
