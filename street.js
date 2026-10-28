// 夜城's street: your ten days as one rainy neon street, live in 3D behind the page.
// One block a day; every place in the story is a sign on it. A sign is dark until you've done that place, glows once
// you have, and stutters while a mistake from there is still waiting in your notebook. The blocks ahead stay dark
// until you reach them. The camera stands where you are: in front of the place you're in, or at the edge of what
// you've lit. Loaded by index.html only for the Cyberpunk theme, on a device with a real graphics chip.
import * as THREE from "./vendor/three-street.js";

const STREET = 9, BLOCK = 24, NEON = ["#ff2bd6", "#00e5ff", "#ffb347", "#f4ff52", "#ff4f8b", "#7cf9ff", "#b388ff"];
const DARK = .07, LIT = 1.5;

// days: [[dayHan, [{ id, place }]]]; state(): { done: Set of scene ids, tripped: Set of scene ids }
export function startStreet(canvas, { days, state, still = false }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
  const DPR = Math.min(devicePixelRatio || 1, 1.25);
  renderer.setPixelRatio(DPR); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .95;
  const scene = new THREE.Scene(), FOG = new THREE.Color("#120a22");
  scene.background = FOG; scene.fog = new THREE.FogExp2(FOG, .02);
  const camera = new THREE.PerspectiveCamera(60, 1, .1, 300);
  scene.add(new THREE.HemisphereLight("#4a3a8a", "#0a0612", .35));
  let seed = 1234567; const R = () => ((seed = Math.imul(seed ^ seed >>> 15, 2246822507) + 0x9E3779B9 | 0) >>> 0) / 4294967296;
  const pick = a => a[Math.floor(R() * a.length)];
  const own = []; // everything to free when the theme changes
  const keep = x => (own.push(x), x);

  // ---------- textures, drawn once ----------
  function facade() { // real flats: mostly dark, a few warm rooms, the odd cold screen, lit in runs rather than confetti
    const c = document.createElement("canvas"); c.width = 128; c.height = 256; const x = c.getContext("2d");
    x.fillStyle = pick(["#14121c", "#18141f", "#101018", "#1a1620"]); x.fillRect(0, 0, 128, 256);
    const lit = .08 + R() * .16, warm = ["#ffc27a", "#ffd9a0", "#ffb066", "#fff1d6", "#ffc27a", "#a8dcff"];
    for (let y = 6; y < 256; y += 16) {
      x.globalAlpha = 1; x.fillStyle = "#0c0b12"; x.fillRect(0, y + 11, 128, 2);
      let run = 0, tone = pick(warm);
      for (let wx = 5; wx < 124; wx += 16) {
        if (run > 0 || R() < lit) { if (run <= 0) { run = 1 + Math.floor(R() * 3); tone = pick(warm); } run--; x.fillStyle = tone; x.globalAlpha = .45 + R() * .4; }
        else { x.fillStyle = "#06050a"; x.globalAlpha = 1; }
        x.fillRect(wx, y, 11, 9);
      }
    }
    const t = keep(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.NearestFilter;
    return t;
  }
  const FACADES = Array.from({ length: 6 }, facade);
  const FONT = '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif';
  function signTexture(text, color, vertical) {
    const n = [...text].length, cell = 96, pad = 22;
    const w = vertical ? cell + pad * 2 : n * cell + pad * 2, h = vertical ? n * cell + pad * 2 : cell + pad * 2;
    const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d");
    x.fillStyle = "#05030a"; x.fillRect(0, 0, w, h);
    x.strokeStyle = color; x.lineWidth = 5; x.shadowColor = color; x.shadowBlur = 18; x.strokeRect(8, 8, w - 16, h - 16);
    x.font = `900 ${cell * .82}px ${FONT}`; x.textAlign = "center"; x.textBaseline = "middle";
    [...text].forEach((ch, i) => {
      const cx = vertical ? w / 2 : pad + cell * (i + .5), cy = vertical ? pad + cell * (i + .5) : h / 2;
      x.shadowBlur = 26; x.fillStyle = color; x.fillText(ch, cx, cy); x.shadowBlur = 0; x.fillStyle = "#fff"; x.globalAlpha = .65; x.fillText(ch, cx, cy); x.globalAlpha = 1;
    });
    const t = keep(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    return { t, aspect: w / h };
  }
  function puddles() {
    const c = document.createElement("canvas"); c.width = c.height = 512; const x = c.getContext("2d");
    x.fillStyle = "#fff"; x.fillRect(0, 0, 512, 512); // white = rough asphalt, black = standing water
    for (let i = 0; i < 70; i++) {
      const px = R() * 512, py = R() * 512, r = 14 + R() * 60, g = x.createRadialGradient(px, py, 0, px, py, r);
      g.addColorStop(0, "rgba(0,0,0,.95)"); g.addColorStop(.7, "rgba(0,0,0,.6)"); g.addColorStop(1, "rgba(0,0,0,0)");
      x.fillStyle = g; x.beginPath(); x.ellipse(px, py, r, r * (.4 + R() * .5), R() * 3, 0, Math.PI * 2); x.fill();
    }
    const t = keep(new THREE.CanvasTexture(c)); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 36); return t;
  }

  // ---------- the street ----------
  const box = keep(new THREE.BoxGeometry(1, 1, 1)), mats = [], signs = [], dayBlocks = [];
  function tower(side, near, block) {
    const w = 6 + R() * 8, d = 5 + R() * 10, h = near ? 10 + R() * 26 : 40 + R() * 70, tex = keep(pick(FACADES).clone());
    tex.needsUpdate = true; tex.repeat.set(Math.max(1, Math.round(d / 8)), Math.max(1, Math.round(h / 16)));
    const m = keep(new THREE.MeshStandardMaterial({ color: "#2a2635", map: tex, emissive: "#ffffff", emissiveMap: tex, emissiveIntensity: 1.1, roughness: .85, metalness: .1 }));
    m.userData.block = block; mats.push(m);
    const mesh = new THREE.Mesh(box, m); mesh.scale.set(w, h, d);
    mesh.position.set(side * (STREET + (near ? w / 2 : 14 + w / 2 + R() * 20)), h / 2, 0);
    return mesh;
  }
  function sign(side, z, text, color, info) {
    const vertical = [...text].length <= 3 || R() < .5, { t, aspect } = signTexture(text, color, vertical);
    const h = vertical ? 1.2 + [...text].length * 1.1 : 1.7, w = h * aspect;
    const mat = keep(new THREE.MeshBasicMaterial({ map: t, toneMapped: false, color: new THREE.Color(DARK, DARK, DARK) }));
    const m = new THREE.Mesh(keep(new THREE.PlaneGeometry(w, h)), mat);
    m.position.set(side * (STREET - (vertical ? w / 2 + .2 : -.05)), vertical ? 4 + R() * 5 : 3.4 + R() * 2.5, z);
    if (!vertical) m.rotation.y = -side * Math.PI / 2; // shop-front boards face the street
    Object.assign(m.userData, info, { hum: R() * 6, side, level: DARK, on: null, since: 0 });
    signs.push(m); return m;
  }
  const lampMat = keep(new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 2.1, 1.2), toneMapped: false }));
  const poleMat = keep(new THREE.MeshStandardMaterial({ color: "#1b1a22", roughness: .6 }));
  const poleGeo = keep(new THREE.CylinderGeometry(.06, .08, 6, 6)), headGeo = keep(new THREE.BoxGeometry(.9, .12, .3));
  function lamp(side, z) {
    const g = new THREE.Group(), pole = new THREE.Mesh(poleGeo, poleMat), head = new THREE.Mesh(headGeo, lampMat);
    pole.position.y = 3; head.position.set(-side * .45, 6, 0); g.add(pole, head); g.position.set(side * (STREET - .6), 0, z); return g;
  }
  // block -1 stands behind you at the start; the last two are the city beyond the story, always dark
  for (let i = -1; i < days.length + 2; i++) {
    const g = new THREE.Group();
    for (const side of [-1, 1]) {
      for (let z = 0; z < BLOCK;) { const t = tower(side, true, i); const d = t.scale.z; t.position.z = -z - d / 2; g.add(t); z += d + .3; }
      for (let k = 0; k < 2; k++) { const t = tower(side, false, i); t.position.z = -R() * BLOCK; g.add(t); }
      if (R() < .7) g.add(lamp(side, -R() * BLOCK));
    }
    const day = days[i];
    if (day) { // the day's name in gold where its block begins, then its places on alternate sides
      g.add(sign(-1, -1.5, day[0], "#ffd36b", { day: i }));
      day[1].forEach((p, k) => g.add(sign(k % 2 ? -1 : 1, -6 - k * (BLOCK - 8) / day[1].length, p.place, NEON[(i * 3 + k) % NEON.length], { day: i, id: p.id })));
    }
    g.position.z = -i * BLOCK; scene.add(g); dayBlocks.push(g);
  }
  scene.updateMatrixWorld(true);
  // coloured light from the signs just ahead, walking with the camera: cheap, and enough to tint the wet street
  const near = [["#ff2bd6", -1, 10], ["#00e5ff", 1, 18], ["#ffb070", -1, 30], ["#b388ff", 1, 40]].map(([c, side, ahead]) => {
    const l = new THREE.PointLight(c, 60, 34, 1.5); l.userData.at = [side * (STREET - 1.5), ahead]; scene.add(l); return l;
  });
  // the wet road: a true mirror under rough asphalt with standing water
  const LEN = (days.length + 4) * BLOCK, mid = -LEN / 2 + 2 * BLOCK;
  const refl = new THREE.Reflector(keep(new THREE.PlaneGeometry(STREET * 2, LEN)), { color: "#6a6880", textureWidth: 512, textureHeight: 512, clipBias: .003 });
  refl.rotation.x = -Math.PI / 2; refl.position.z = mid; scene.add(refl);
  const asphalt = new THREE.Mesh(keep(new THREE.PlaneGeometry(STREET * 2, LEN)), keep(new THREE.MeshStandardMaterial({ color: "#0b0a10", roughness: .95, transparent: true, alphaMap: puddles(), opacity: .92, depthWrite: false })));
  asphalt.rotation.x = -Math.PI / 2; asphalt.position.set(0, .01, mid); scene.add(asphalt);
  const kerb = new THREE.Mesh(keep(new THREE.PlaneGeometry(80, LEN)), keep(new THREE.MeshStandardMaterial({ color: "#0d0c12", roughness: .9 })));
  kerb.rotation.x = -Math.PI / 2; kerb.position.set(0, -.02, mid); scene.add(kerb);
  // light rain, falling around the camera
  const DROPS = 700, rainPos = new Float32Array(DROPS * 6), rainSpeed = new Float32Array(DROPS);
  for (let i = 0; i < DROPS; i++) { const x = (R() - .5) * 26, y = R() * 18, z = -R() * 50; rainPos.set([x, y, z, x + .05, y + .5, z], i * 6); rainSpeed[i] = 14 + R() * 8; }
  const rainGeo = keep(new THREE.BufferGeometry()); rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPos, 3));
  const rain = new THREE.LineSegments(rainGeo, keep(new THREE.LineBasicMaterial({ color: "#a9b8ff", transparent: true, opacity: .2 })));
  scene.add(rain);
  // bright things bloom, as they do through a lens in the rain
  const composer = new THREE.EffectComposer(renderer);
  composer.addPass(new THREE.RenderPass(scene, camera));
  const bloom = new THREE.UnrealBloomPass(new THREE.Vector2(256, 256), .8, .55, .72);
  composer.addPass(bloom); composer.addPass(new THREE.OutputPass());

  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false); composer.setPixelRatio(DPR); composer.setSize(w, h); bloom.resolution.set(w / 2, h / 2);
    camera.aspect = w / h; camera.fov = w < h ? 72 : 58; camera.updateProjectionMatrix(); dirty = true;
  }

  // ---------- what the street knows about you ----------
  let reach = -1, focusId = null; // reach: the last day you've got to
  function read(first) {
    const { done, tripped } = state(), now = performance.now();
    const ids = days.flatMap(d => d[1].map(p => p.id)), next = ids.findIndex(id => !done.has(id));
    reach = next < 0 ? days.length - 1 : days.findIndex(d => d[1].some(p => p.id === ids[next]));
    for (const s of signs) {
      const u = s.userData, on = u.id ? done.has(u.id) : u.day <= reach;
      if (u.on === false && on && !first) u.since = now; // it has just come on: it buzzes into life
      u.on = on; u.trip = !!u.id && on && tripped.has(u.id);
    }
    for (const m of mats) m.emissiveIntensity = m.userData.block >= 0 && m.userData.block <= reach || m.userData.block < 0 ? 1.1 : .12;
    dirty = true;
  }
  // where the camera stands: before the sign of the place you're in, or at the edge of what you've lit
  const at = { z: 6, x: 0, look: 0 }, from = { ...at }; let to = { ...at }, moveAt = 0;
  function aim(first) {
    let s = focusId && signs.find(x => x.userData.id === focusId);
    if (!s) s = signs.find(x => x.userData.id && !x.userData.on) || signs[signs.length - 1];
    const z = s.getWorldPosition(new THREE.Vector3()).z;
    to = { z: z + 16, x: -s.userData.side * 1.5, look: s.userData.side * 1.8 };
    if (first || still) Object.assign(at, to); else { Object.assign(from, at); moveAt = performance.now(); }
    dirty = true;
  }

  // ---------- drawing: 30 frames a second at most, nothing while hidden ----------
  let dirty = true, last = performance.now(), raf = 0, stopped = false;
  const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  function frame(now) {
    if (stopped) return;
    raf = requestAnimationFrame(frame);
    if (document.hidden || (!dirty && still) || now - last < 31) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now; dirty = false;
    if (moveAt) { const k = Math.min(1, (now - moveAt) / 1800), e = ease(k); for (const key in at) at[key] = from[key] + (to[key] - from[key]) * e; if (k >= 1) moveAt = 0; }
    const sway = still ? 0 : 1;
    camera.position.set(at.x + Math.sin(now / 6000) * .35 * sway, 2.2 + Math.sin(now / 2300) * .04 * sway, at.z);
    camera.lookAt(at.x + at.look + Math.sin(now / 9000) * .6 * sway, 3.4, at.z - 30);
    for (const l of near) l.position.set(l.userData.at[0], 4.5, at.z - l.userData.at[1]);
    for (const s of signs) {
      const u = s.userData; let v = u.on ? LIT + .1 * Math.sin(now / 400 + u.hum) * sway : DARK;
      if (u.on && u.trip && sway && Math.sin(now / 1500 + u.hum) > .82 && Math.sin(now / 55 + u.hum) > -.2) v = .35; // a stutter, now and then
      if (u.since) { const k = (now - u.since) / 1400; if (k >= 1) u.since = 0; else v = k < .7 && Math.sin(k * 60) > 0 ? DARK + k * .6 : v; }
      s.material.color.setScalar(v);
    }
    rain.visible = !still;
    if (!still) {
      for (let i = 0; i < DROPS; i++) {
        const o = i * 6; let y = rainPos[o + 1] - rainSpeed[i] * dt;
        if (y < 0 || rainPos[o + 2] > at.z + 2 || rainPos[o + 2] < at.z - 52) { y = 16 + R() * 4; rainPos[o + 2] = rainPos[o + 5] = at.z - R() * 50; }
        rainPos[o + 1] = y; rainPos[o + 4] = y + .5;
      }
      rainGeo.attributes.position.needsUpdate = true;
    }
    composer.render();
  }
  const onResize = () => resize();
  addEventListener("resize", onResize, { passive: true });
  resize(); read(true); aim(true); raf = requestAnimationFrame(frame);

  return {
    refresh() { read(false); if (!focusId) aim(false); },
    focus(id) { if (id === focusId) return; focusId = id || null; aim(false); },
    signs: () => Object.fromEntries(signs.filter(s => s.userData.id).map(s => [s.userData.id, s.userData.on ? s.userData.trip ? "tripped" : "lit" : "dark"])),
    where: () => ({ z: Math.round(to.z), reach }),
    stop() {
      stopped = true; cancelAnimationFrame(raf); removeEventListener("resize", onResize);
      own.forEach(x => x.dispose && x.dispose()); refl.dispose && refl.dispose(); composer.dispose && composer.dispose(); renderer.dispose();
    },
  };
}
