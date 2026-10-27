/* The Android app only. Android's web view has no voice of its own, so the page's speechSynthesis calls are
   handed to the phone's text-to-speech (the Text-to-Speech plugin), one line after another, with the same
   start and end events the page uses to follow along. Loaded before the app's scripts. */
(() => {
  const C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform() || !C.registerPlugin) return;
  const TTS = C.registerPlugin("TextToSpeech");
  let queue = [], run = 0, playing = false;
  class Utterance {
    constructor(text) { this.text = String(text || ""); this.lang = "zh-CN"; this.rate = 1; this.voice = null; this.onstart = this.onend = this.onerror = null; }
  }
  async function play() {
    if (playing) return;
    playing = true; const mine = run;
    while (queue.length && mine === run) {
      const u = queue.shift();
      try {
        if (u.onstart) u.onstart();
        await TTS.speak({ text: u.text, lang: u.lang || "zh-CN", rate: u.rate || 1, category: "playback" });
        if (mine === run && u.onend) u.onend();
      } catch (e) { if (u.onerror) u.onerror(e); }
    }
    if (mine === run) playing = false;
  }
  window.SpeechSynthesisUtterance = Utterance;
  Object.defineProperty(window, "speechSynthesis", {
    configurable: true,
    value: {
      speak(u) { queue.push(u); play(); },
      cancel() { run++; queue = []; playing = false; TTS.stop().catch(() => {}); },
      getVoices: () => [],
      get speaking() { return playing; },
    },
  });
})();

/* Updates by themselves. Every build puts the app's files on GitHub (the android-latest release) with a list of
   them, web.json. A while after the app opens it checks that list; when there's a newer version it downloads only
   the files that changed (copying the rest), checks each one, and keeps them on the phone. The next time the app
   opens, it switches to them before anything shows. A version is kept only once it has started properly: if it
   doesn't, the app goes back to the one before and never tries it again. When a version needs a new APK (the
   Android side changed), the app asks for that instead. Progress isn't touched: it lives in the same place. */
(() => {
  const C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform() || !C.registerPlugin) return;
  const WEB = window.SM_APP = /*WEB*/{ v: 0, native: "" }/*WEB*/; // filled in by build-www.js
  const BASE = "https://github.com/ReikenZ7-Coding/Street-Mandarin/releases/download/android-latest/";
  const FS = C.registerPlugin("Filesystem"), WV = C.registerPlugin("WebView"), D = "DATA";
  const get = k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
  const set = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  // A version that was being tried and isn't this one never started properly: don't try it again
  const trying = get("sm-web-trying");
  if (trying && trying.v !== WEB.v) { set("sm-web-bad", trying.v); set("sm-web-trying", null); }
  function apply() {
    const next = get("sm-web-next");
    if (!next || !(next.v > WEB.v) || next.v === get("sm-web-bad")) return false;
    set("sm-web-next", null); set("sm-web-trying", next);
    WV.setServerBasePath({ path: next.path }); try { window.stop(); } catch {}
    return true;
  }
  if (apply()) return;

  function banner(text, label, go) {
    const b = document.createElement("div"); b.className = "sm-banner"; b.setAttribute("role", "status");
    const p = document.createElement("p"); p.textContent = text; b.append(p);
    if (label) { const g = document.createElement("button"); g.className = "btn small"; g.textContent = label; g.onclick = () => { b.remove(); go(); }; b.append(g); }
    const x = document.createElement("button"); x.className = "linkish"; x.textContent = label ? "Later" : "Close"; x.onclick = () => b.remove(); b.append(x);
    document.querySelectorAll(".sm-banner").forEach(o => o.remove()); document.body.append(b);
    if (!label) setTimeout(() => b.remove(), 6000);
  }
  const hex = async buf => [...new Uint8Array(await crypto.subtle.digest("SHA-256", buf))].map(x => x.toString(16).padStart(2, "0")).join("");
  function b64(buf) {
    const u = new Uint8Array(buf); let s = "";
    for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
    return btoa(s);
  }
  const fetchBuf = async url => { const r = await fetch(url, { cache: "no-store" }); if (!r.ok) throw new Error(url + " " + r.status); return r.arrayBuffer(); };

  let checking = false, lastCheck = 0;
  async function check() {
    if (checking) return; checking = true; lastCheck = Date.now();
    try {
      const list = await fetchBuf(BASE + "web.json?t=" + Date.now()), up = JSON.parse(new TextDecoder().decode(list));
      const next = get("sm-web-next");
      if (!(up.v > WEB.v) || up.v === get("sm-web-bad") || (next && next.v >= up.v)) return;
      if (up.native !== WEB.native) {
        if (get("sm-web-asked") !== up.v) { set("sm-web-asked", up.v); banner("A new version of the app is ready, and this one needs installing.", "Get it", () => { location.href = BASE + "street-mandarin.apk"; }); }
        return;
      }
      const mine = JSON.parse(new TextDecoder().decode(await fetchBuf("web.json")));
      const onDisk = /^\//.test((await WV.getServerBasePath()).path || ""); // a downloaded version, in web/<v>
      const dir = "web/" + up.v;
      await FS.rmdir({ path: dir, directory: D, recursive: true }).catch(() => {});
      for (const sub of new Set(Object.keys(up.files).map(f => dir + "/" + f.replace(/\/?[^/]*$/, "")))) await FS.mkdir({ path: sub, directory: D, recursive: true }).catch(() => {});
      for (const [f, sha] of Object.entries(up.files)) {
        const to = dir + "/" + f;
        if (mine.files[f] === sha) {
          if (onDisk) await FS.copy({ from: "web/" + WEB.v + "/" + f, to, directory: D, toDirectory: D });
          else await FS.writeFile({ path: to, data: b64(await fetchBuf(f)), directory: D, recursive: true });
          continue;
        }
        const buf = await fetchBuf(BASE + "w-" + sha.slice(0, 16) + (f.match(/\.\w+$/) || [""])[0]);
        if (await hex(buf) !== sha) throw new Error("download didn't match: " + f);
        await FS.writeFile({ path: to, data: b64(buf), directory: D, recursive: true });
      }
      await FS.writeFile({ path: dir + "/web.json", data: b64(list), directory: D, recursive: true }); // its own list, for the next update
      const { uri } = await FS.getUri({ path: dir, directory: D });
      set("sm-web-next", { v: up.v, path: decodeURIComponent(uri.replace(/^file:\/\//, "")) });
      // older downloads aren't needed any more
      const { files } = await FS.readdir({ path: "web", directory: D });
      for (const e of files) { const n = e.name || e; if (n !== String(WEB.v) && n !== String(up.v)) await FS.rmdir({ path: "web/" + n, directory: D, recursive: true }).catch(() => {}); }
    } catch (e) { console.warn("Update check:", e && e.message || e); }
    finally { checking = false; }
  }

  addEventListener("load", () => setTimeout(async () => {
    if (typeof startHome !== "function" || !document.getElementById("foot")) return; // didn't start properly: not kept
    const t = get("sm-web-trying");
    if (t && t.v === WEB.v) {
      set("sm-web-trying", null);
      try { await WV.persistServerBasePath(); } catch {}
      banner("Street Mandarin updated itself to the newest version.");
    }
    check();
  }, 2500));
  // back after a while: switch to a version that's waiting (progress is saved as you go), or look for one
  let hidden = 0;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { hidden = Date.now(); return; }
    if (hidden && Date.now() - hidden > 30 * 60e3 && apply()) return;
    if (Date.now() - lastCheck > 6 * 3600e3) check();
  });
})();
