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
