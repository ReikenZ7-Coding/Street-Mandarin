/* Street Mandarin on its own website: connects the app to the server.
   - Account: sign up or sign in. (Which AI writes the AI parts is chosen in the app's Your AI panel,
     which reaches the server through window.SM_HOST below.)
   - Sync: everything the app saves (the same keys the progress code copies) follows you to any device.
   - AI: the app asks for Claude through sample.json(prompt), the same call it makes inside a Claude
     artifact, so this file provides that call and sends it to the server.
   Loaded only by the server (it adds this file to the page), before the app's own scripts. */
(() => {
  "use strict";
  const META = "sm-sync-meta"; // when each key last changed on this device
  const synced = k => typeof k === "string" && k.startsWith("sm-") && !k.startsWith("sm-sync");
  const ls = window.localStorage;
  const rawSet = Storage.prototype.setItem, rawRemove = Storage.prototype.removeItem;
  let meta = {}; try { meta = JSON.parse(ls.getItem(META) || "{}") || {}; } catch {}
  let applying = false, dirty = new Set(), pushTimer = null, account = null, syncState = "";

  const api = async (method, url, body) => {
    const r = await fetch(url, { method, credentials: "same-origin", headers: body ? { "content-type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined });
    let j = {}; try { j = await r.json(); } catch {}
    if (!r.ok) { const e = new Error(j.error || "Something went wrong."); e.code = j.code || "http_" + r.status; e.status = r.status; throw e; }
    return j;
  };
  const saveMeta = () => { try { rawSet.call(ls, META, JSON.stringify(meta)); } catch {} };

  /* ---------- noticing what the app saves ---------- */
  Storage.prototype.setItem = function (k, v) {
    rawSet.call(this, k, v);
    if (this === ls && synced(k) && !applying) changed(k);
  };
  Storage.prototype.removeItem = function (k) {
    rawRemove.call(this, k);
    if (this === ls && synced(k) && !applying) changed(k);
  };
  function changed(k) {
    meta[k] = Math.max(Date.now(), (meta[k] || 0) + 1); saveMeta();
    if (!account || !account.signedIn) return;
    dirty.add(k); clearTimeout(pushTimer); pushTimer = setTimeout(push, 2500);
  }
  const localKeys = () => { const out = []; for (let i = 0; i < ls.length; i++) { const k = ls.key(i); if (synced(k)) out.push(k); } return out; };

  async function push(keepalive) {
    if (!dirty.size || !account || !account.signedIn) return;
    const keys = {}, sending = [...dirty];
    sending.forEach(k => { keys[k] = { v: ls.getItem(k), t: meta[k] || 1 }; });
    // As the page closes there's only time for a beacon; the keys stay marked, so if it didn't
    // get through they go again next time (saving the same change twice is harmless)
    if (keepalive) { if (navigator.sendBeacon) navigator.sendBeacon("/api/progress-beacon", new Blob([JSON.stringify({ keys })], { type: "application/json" })); return; }
    dirty.clear(); setSync("Saving…");
    try {
      await api("PUT", "/api/progress", { keys });
      setSync(account && account.solo ? "Saved on this computer" : "Saved to your account");
    } catch (e) {
      sending.forEach(k => dirty.add(k));
      setSync(e.code === "too_big" ? e.message : "Not saved yet. It will try again.");
      if (e.code !== "too_big") { clearTimeout(pushTimer); pushTimer = setTimeout(push, 20000); }
    }
  }

  // Bring in what changed on other devices; returns true if anything here changed
  async function pull() {
    const { keys } = await api("GET", "/api/progress");
    let changedHere = false;
    applying = true;
    try {
      for (const [k, x] of Object.entries(keys)) {
        if (!synced(k)) continue;
        if (x.t > (meta[k] || 0)) {
          if (x.v === null) rawRemove.call(ls, k); else rawSet.call(ls, k, x.v);
          meta[k] = x.t; changedHere = true;
        }
      }
    } finally { applying = false; }
    saveMeta();
    // Anything newer here, or never sent, goes up
    localKeys().forEach(k => { if (!keys[k] || (meta[k] || 1) > keys[k].t) { if (!meta[k]) meta[k] = 1; dirty.add(k); } });
    Object.keys(keys).forEach(k => { if (ls.getItem(k) === null && keys[k].v !== null && (meta[k] || 0) > keys[k].t) dirty.add(k); });
    saveMeta();
    await push();
    return changedHere;
  }

  /* ---------- the AI connection, shaped like the artifact runtime's ---------- */
  const sample = {
    async json(prompt, opts = {}) {
      try {
        const j = await api("POST", "/api/ai", { prompt, tier: opts.modelTier || "", cache: !!opts.cache, ...(opts.shape ? { shape: opts.shape } : {}) });
        return j.result;
      } catch (e) {
        const why = e.code;
        if (["needs_key", "bad_key", "no_credit", "allowance", "budget", "signed_out", "model_offline", "too_big"].includes(why)) banner(e.message, why === "signed_out" ? "account" : "ai");
        // The app already knows these two codes: one says "no access", the other "try again soon"
        e.code = why === "rate_limited" || why === "allowance" || why === "budget" ? "rate_limited"
          : why === "needs_key" || why === "signed_out" || why === "bad_key" || why === "no_credit" ? "not_granted" : why;
        throw e;
      }
    },
  };
  let ready;
  const accountReady = new Promise(r => { ready = r; });
  // Read the account as it is now: Your AI can change it after the page has started
  window.claude = { use: async cap => { await accountReady; const a = account; return cap === "sample" && a && a.signedIn && a.canUseAi ? sample : null; } };
  // What the Your AI panel needs from the server: who you are, and its routes
  window.SM_HOST = {
    ready: accountReady,
    get account() { return account; },
    get kind() { return account && account.solo ? "solo" : "website"; },
    api,
    async refresh() { try { account = await api("GET", "/api/account"); } catch {} drawButton(); return account; },
    signIn: () => openAccount(),
  };

  /* ---------- starting up ---------- */
  const hide = document.createElement("style");
  hide.textContent = "body{visibility:hidden}";
  async function start() {
    try { account = await api("GET", "/api/account"); } catch { account = null; }
    if (account && account.signedIn) {
      document.head.append(hide);
      const showAnyway = setTimeout(() => hide.remove(), 3000);
      try {
        const changedHere = await pull();
        const last = Number(sessionStorage.getItem("sm-sync-reload") || 0);
        if (changedHere && Date.now() - last > 15000) { sessionStorage.setItem("sm-sync-reload", String(Date.now())); location.reload(); return; }
        setSync(account && account.solo ? "Saved on this computer" : "Saved to your account");
      } catch { setSync(account && account.solo ? "Couldn't reach the app's server. Progress is kept in this browser for now." : "Couldn't reach your account. Progress is kept on this device for now."); }
      clearTimeout(showAnyway); hide.remove();
    }
    ready(account);
  }
  start();

  addEventListener("pagehide", () => push(true));
  let lastPull = Date.now();
  document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "hidden") { push(true); return; }
    if (!account || !account.signedIn || Date.now() - lastPull < 60000) return;
    lastPull = Date.now();
    try { if (await pull()) location.reload(); } catch {}
  });

  /* ---------- the Account button and dialog ---------- */
  const css = `
.top-tools { display: flex; gap: 8px; align-self: center; }
.top-tools .notes-btn { position: static; }
.acct-btn { display: inline-flex; align-items: baseline; gap: 6px; border: 1px solid var(--line); background: var(--surface); border-radius: 10px; padding: 7px 12px; font-weight: 600; font-size: 14px; color: var(--fg); }
.acct-btn .han { font-size: 16px; color: var(--jade); }
.acct-btn.in { border-color: var(--jade); }
@media (max-width: 760px) { .top-tools { position: absolute; top: 0; right: 0; } .brand { padding-right: 196px; } .acct-btn .en { display: none; } }
dialog.acct { border: 1px solid var(--line); border-radius: 12px; background: var(--surface); color: var(--fg); padding: 0; width: min(440px, calc(100vw - 32px)); box-shadow: 0 20px 60px rgba(0,0,0,.25); }
dialog.acct::backdrop { background: rgba(10, 20, 16, .45); }
.acct-in { padding: 20px 22px 22px; display: grid; gap: 14px; }
.acct-head { display: flex; align-items: baseline; gap: 8px; }
.acct-head .han { font-size: 22px; color: var(--jade); font-weight: 700; }
.acct-head h2 { margin: 0; font-size: 18px; }
.acct-head .linkish { margin-left: auto; }
.acct label { display: grid; gap: 4px; font-size: 13px; font-weight: 600; color: var(--muted); }
.acct input { font: inherit; font-size: 15px; padding: 9px 11px; border: 1px solid var(--line); border-radius: 8px; background: var(--bg); color: var(--fg); }
.acct input:focus { outline: 2px solid var(--jade); outline-offset: 1px; }
.acct p { margin: 0; font-size: 14px; line-height: 1.5; }
.acct .muted { color: var(--muted); font-size: 13px; }
.acct .err { color: var(--cinnabar, #b3412e); font-size: 13px; font-weight: 600; min-height: 1em; }
.acct .row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.acct .sec { border-top: 1px dashed var(--line); padding-top: 14px; display: grid; gap: 10px; }
.acct .sec h3 { margin: 0; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
.acct .switch { display: flex; gap: 4px; }
.acct .switch button { border: 1px solid var(--line); background: transparent; color: var(--fg); border-radius: 8px; padding: 6px 12px; font-weight: 600; font-size: 13px; }
.acct .switch button[aria-pressed="true"] { background: var(--jade-soft); border-color: var(--jade); }
.acct .danger { color: var(--cinnabar, #b3412e); }
.acct a { color: var(--jade); font-weight: 600; }
`;
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  let btn, dlg, view = "signin", busy = false, err = "", confirmDelete = false;

  function setSync(s) { syncState = s; const n = document.getElementById("acct-sync"); if (n) n.textContent = s; }

  function banner(text, go) {
    document.querySelectorAll(".sm-banner").forEach(b => b.remove());
    const b = el("div", "sm-banner"); b.setAttribute("role", "status");
    b.append(el("p", null, text));
    const ai = go === "ai" && window.SM_openAi;
    if (go) { const o = el("button", "btn small", ai ? "Your AI" : "Account"); o.onclick = () => { b.remove(); ai ? window.SM_openAi() : openAccount(); }; b.append(o); }
    const x = el("button", "linkish", "Close"); x.onclick = () => b.remove(); b.append(x);
    document.body.append(b);
  }

  function drawButton() {
    if (!btn) return;
    const inn = account && account.signedIn;
    btn.className = "acct-btn" + (inn ? " in" : "");
    btn.textContent = "";
    const solo = account && account.solo;
    btn.append(el("span", "han", inn ? "我" : "登录"), el("span", "en", solo ? " You" : inn ? " Account" : " Sign in"));
    btn.title = solo ? "Your copy of the app, and your AI" : inn ? `Signed in as ${account.email}` : "Sign in to keep your progress on every device";
  }

  function field(label, type, name, auto) {
    const l = el("label", null, label), i = el("input"); i.type = type; i.name = name; i.autocomplete = auto; i.required = true;
    l.append(i); return [l, i];
  }

  function draw() {
    const box = dlg.querySelector(".acct-in"); box.textContent = "";
    const head = el("div", "acct-head");
    const close = el("button", "linkish", "Close"); close.type = "button"; close.onclick = () => dlg.close();
    const inn = account && account.signedIn;
    head.append(el("span", "han", inn ? "我" : "登录"), el("h2", null, account && account.solo ? "Just you" : inn ? "Your account" : view === "signup" ? "Create an account" : "Sign in"), close);
    box.append(head);

    if (!inn) {
      const sw = el("div", "switch");
      [["signin", "Sign in"], ["signup", "Create an account"]].forEach(([v, t]) => {
        const b = el("button", null, t); b.type = "button"; b.setAttribute("aria-pressed", String(view === v));
        b.onclick = () => { view = v; err = ""; draw(); }; sw.append(b);
      });
      box.append(sw);
      box.append(el("p", "muted", "Your progress, chats, notes and stories follow you to any device. Anything you've already done on this device comes with you."));
      const form = el("form"); form.style.display = "grid"; form.style.gap = "12px";
      const [le, email] = field("Email", "email", "email", "email");
      const [lp, pw] = field("Password" + (view === "signup" ? " (at least 8 characters)" : ""), "password", "password", view === "signup" ? "new-password" : "current-password");
      if (view === "signup") pw.minLength = 8;
      const e = el("p", "err", err); e.setAttribute("role", "alert");
      const go = el("button", "btn", busy ? "…" : view === "signup" ? "Create account" : "Sign in"); go.type = "submit"; go.disabled = busy;
      form.append(le, lp, e, go);
      form.onsubmit = async ev => {
        ev.preventDefault(); if (busy) return;
        busy = true; err = ""; draw();
        try {
          await api("POST", view === "signup" ? "/api/auth/signup" : "/api/auth/login", { email: email.value, password: pw.value });
          // Everything on this device is sent up as new, then the page restarts with your account
          localKeys().forEach(k => { if (!meta[k]) meta[k] = 1; }); saveMeta();
          account = await api("GET", "/api/account");
          await pull();
          sessionStorage.setItem("sm-sync-reload", String(Date.now()));
          location.reload();
        } catch (x) { busy = false; err = x.message; draw(); }
      };
      box.append(form);
      setTimeout(() => email.focus(), 0);
      return;
    }

    if (account.solo) {
      box.append(el("p", null, "Solo mode: this copy of Street Mandarin is just for you, on this computer. Everything you do is saved here as well as in the browser, so clearing the browser loses nothing."));
      const s = el("p", "muted", syncState || "Saved"); s.id = "acct-sync"; box.append(s);
    } else {
      box.append(el("p", null, `Signed in as ${account.email}`));
      const s = el("p", "muted", syncState || (account.solo ? "Saved on this computer" : "Saved to your account")); s.id = "acct-sync"; box.append(s);
    }

    // Which AI writes the AI parts lives in Your AI, one place for every way of running the app
    const aiSec = el("div", "sec"); aiSec.append(el("h3", null, "The AI parts"));
    const aiP = el("p", null, account.ai && account.ai.kind !== "claude" ? `Written by ${account.ai.name}. ` : account.hasKey ? "Written by Claude, with your key. " : "Not set up yet. ");
    if (window.SM_openAi) { const go = el("button", "linkish", "Your AI"); go.type = "button"; go.onclick = () => { dlg.close(); window.SM_openAi(); }; aiP.append(go); }
    aiSec.append(aiP); box.append(aiSec);
    if (account.solo) return;

    const sec2 = el("div", "sec");
    const row = el("div", "row");
    const out = el("button", "btn ghost small", "Sign out"); out.type = "button";
    out.onclick = async () => {
      await push();
      try { await api("POST", "/api/auth/logout", {}); } catch {}
      // Your progress stays in your account; this device is cleared so the next person starts fresh
      applying = true; localKeys().forEach(k => rawRemove.call(ls, k)); applying = false;
      rawRemove.call(ls, META); location.reload();
    };
    const del = el("button", "linkish danger", confirmDelete ? "Yes, delete my account and everything in it" : "Delete account"); del.type = "button";
    del.onclick = async () => {
      if (!confirmDelete) { confirmDelete = true; draw(); return; }
      try { await api("DELETE", "/api/account"); } catch (x) { err = x.message; draw(); return; }
      applying = true; localKeys().forEach(k => rawRemove.call(ls, k)); applying = false;
      rawRemove.call(ls, META); location.reload();
    };
    row.append(out, del); sec2.append(row);
    if (confirmDelete) sec2.append(el("p", "muted", "This deletes your progress, chats, notes and saved key from the server. It can't be undone."));
    if (err) { const e = el("p", "err", err); e.setAttribute("role", "alert"); sec2.append(e); }
    box.append(sec2);
  }

  function openAccount() { err = ""; confirmDelete = false; draw(); if (!dlg.open) dlg.showModal(); }
  window.SM_openAccount = openAccount;

  document.addEventListener("DOMContentLoaded", () => {
    const st = el("style"); st.textContent = css; document.head.append(st);
    const notes = document.getElementById("notes-btn");
    btn = el("button"); btn.type = "button"; btn.id = "acct-btn"; btn.onclick = openAccount;
    if (notes) { const g = el("div", "top-tools"); notes.replaceWith(g); g.append(notes, btn); }
    else document.body.prepend(btn);
    dlg = el("dialog", "acct"); dlg.setAttribute("aria-label", "Your account"); dlg.append(el("div", "acct-in"));
    dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
    document.body.append(dlg);
    drawButton();
    accountReady.then(() => drawButton());
  });
})();
