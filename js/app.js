import { store, isDemo } from './store.js';
import { SETTINGS } from './config.js';
import { EXERCISES } from './shapes.js';
import { ANIMALS, REGULAR, SPECIAL, byId } from './animals.js';
import { samplePath, scoreTrace, scoreColor } from './scoring.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const pad = n => String(n).padStart(2, '0');

const COLORS = ['#e63946', '#ff7b00', '#ffd23f', '#52b788', '#2ec4b6', '#3a86ff', '#7b5cff', '#ff5d8f', '#8d5524', '#2b2d42'];
const CHILD_SCREENS = ['home', 'pick', 'draw', 'collection', 'gallery'];
const LIMIT = SETTINGS.dailyMinutes * 60;

const state = {
  user: null, profile: null, screen: 'login',
  day: null, used: 0, pending: 0, timeUp: false, warned: false,
  kind: 'trace', ex: null, strokes: [], current: null, pointerId: null,
  color: COLORS[6], size: 'big', eraser: false, size100: 0,
};
const targetCache = new Map();

/* ======================= Utilità ======================= */
function today() { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

export function isHalloween(d = new Date()) {
  const md = `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const { from, to } = SETTINGS.halloween;
  return from <= to ? md >= from && md <= to : md >= from || md <= to;
}

function speak(text) {
  if (!SETTINGS.voice || !('speechSynthesis' in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'it-IT'; u.rate = 0.95; u.pitch = 1.15;
    const v = speechSynthesis.getVoices().find(v => v.lang && v.lang.toLowerCase().startsWith('it'));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch { /* nessuna voce disponibile */ }
}

let audio;
function chime(notes = [660, 880, 1100]) {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    notes.forEach((f, i) => {
      const o = audio.createOscillator(), g = audio.createGain();
      o.type = 'triangle'; o.frequency.value = f;
      const t = audio.currentTime + i * 0.14;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.25, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      o.connect(g).connect(audio.destination); o.start(t); o.stop(t + 0.4);
    });
  } catch { /* audio non disponibile */ }
}

let toastTimer;
function toast(msg, ms = 2600) {
  const t = $('#toast'); t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.add('hidden'), ms);
}

function confetti(list = ['⭐', '🎉', '✨', '🌈', '💖']) {
  const box = $('#confetti');
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('span');
    s.textContent = list[i % list.length];
    s.style.left = Math.random() * 100 + 'vw';
    s.style.animationDuration = 1.8 + Math.random() * 1.6 + 's';
    s.style.animationDelay = Math.random() * 0.5 + 's';
    box.appendChild(s);
    setTimeout(() => s.remove(), 4200);
  }
}

const starsText = n => '⭐'.repeat(n) + '☆'.repeat(3 - n);

/* ======================= Schermate ======================= */
function show(name) {
  state.screen = name;
  $$('.screen').forEach(s => s.classList.add('hidden'));
  $('#screen-' + name).classList.remove('hidden');
  $('#topbar').classList.toggle('hidden', !CHILD_SCREENS.includes(name));
  window.scrollTo(0, 0);
}

function go(where) {
  if (where === 'home') { renderHome(); show('home'); }
  else if (where === 'trace' || where === 'color') { state.kind = where; renderPick(); show('pick'); }
  else if (where === 'collection') { renderCollection(); show('collection'); }
  else if (where === 'gallery') { renderGallery(); show('gallery'); }
}

function renderHome() {
  const hw = isHalloween();
  document.body.classList.toggle('halloween', hw);
  $('#halloween-banner').classList.toggle('hidden', !hw);
  renderMeters();
}

function renderMeters() {
  const p = state.profile; if (!p) return;
  const dots = (n, max) => Array.from({ length: max }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('');
  $('#egg-dots').innerHTML = dots(p.eggStars, SETTINGS.starsPerEgg);
  $('#pumpkin-dots').innerHTML = dots(p.pumpkinStars, SETTINGS.starsPerPumpkin);
  $('#pumpkin-box').classList.toggle('hidden', !isHalloween());
}

/* ---------- Scelta esercizio ---------- */
function shapeSvg(ex) {
  const trace = ex.kind === 'trace';
  return `<svg viewBox="0 0 100 100" aria-hidden="true">
    <path d="${ex.path}" fill="${trace ? 'none' : (ex.suggest || '#eee') + '55'}" stroke="${trace ? '#9a8aa8' : '#3b2c4a'}"
      stroke-width="${trace ? 3 : 3}" stroke-dasharray="${trace ? '5 4' : ''}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function renderPick() {
  const hw = isHalloween();
  $('#pick-title').textContent = state.kind === 'trace' ? '✏️ Ricalca' : '🖍️ Colora';
  const list = EXERCISES.filter(e => e.kind === state.kind && (!e.halloween || hw))
    .sort((a, b) => (hw ? (b.halloween ? 1 : 0) - (a.halloween ? 1 : 0) : 0) || a.level - b.level);
  const best = state.profile.best || {};
  $('#pick-grid').innerHTML = list.map(e => `
    <button class="card ${e.halloween ? 'hw' : ''}" data-ex="${e.id}" aria-label="${e.name}">
      <span class="card-emoji">${e.emoji}</span>
      <span class="card-level">${'●'.repeat(e.level)}</span>
      ${shapeSvg(e)}
      <span class="card-stars">${best[e.id] ? starsText(best[e.id]) : ''}</span>
    </button>`).join('');
}

/* ======================= Disegno ======================= */
const cvPaint = $('#cv-paint'), cvTop = $('#cv-top');
const ctxP = cvPaint.getContext('2d'), ctxT = cvTop.getContext('2d');

function openExercise(id) {
  state.ex = EXERCISES.find(e => e.id === id);
  state.strokes = []; state.current = null; state.eraser = false;
  const isColor = state.ex.kind === 'color';
  state.color = isColor ? (state.ex.suggest || COLORS[0]) : COLORS[6];
  state.size = 'big';
  $('#draw-title').textContent = `${state.ex.emoji} ${state.ex.name}`;
  $('#size-row').classList.toggle('hidden', !isColor);
  renderPalette();
  show('draw');
  layoutStage();
  sayInstruction();
}

function sayInstruction() {
  const ex = state.ex;
  speak(ex.kind === 'trace'
    ? `Ripassa ${ex.name.toLowerCase()} seguendo la linea tratteggiata. Parti dal pallino verde!`
    : `Colora ${ex.name.toLowerCase()} restando dentro i bordi!`);
}

function renderPalette() {
  $('#palette').innerHTML = COLORS.map(c => `<button class="swatch ${c === state.color && !state.eraser ? 'on' : ''}" data-color="${c}" style="background:${c}" aria-label="colore"></button>`).join('');
  $$('#size-row .size').forEach(b => b.classList.toggle('on', b.dataset.size === state.size && !state.eraser));
  $('#btn-eraser').classList.toggle('on', state.eraser);
}

function layoutStage() {
  const landscape = window.innerWidth > window.innerHeight && window.innerWidth > 760;
  const top = $('#topbar').offsetHeight + $('#screen-draw .screen-head').offsetHeight + 40;
  const w = window.innerWidth - 36 - (landscape ? 204 : 0);
  const h = window.innerHeight - top - (landscape ? 0 : $('.tools').offsetHeight + 24);
  const S = Math.max(260, Math.min(w, h, 900));
  const stage = $('#stage');
  stage.style.width = stage.style.height = S + 'px';
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  for (const [cv, ctx] of [[cvPaint, ctxP], [cvTop, ctxT]]) {
    cv.width = cv.height = Math.round(S * dpr);
    cv.style.width = cv.style.height = S + 'px';
    ctx.setTransform(cv.width / 100, 0, 0, cv.height / 100, 0, 0); // si disegna in unità 0-100
  }
  redrawAll();
}

function drawGuide(ctx) {
  const ex = state.ex, path = new Path2D(ex.path);
  ctx.save();
  ctx.lineCap = ctx.lineJoin = 'round';
  if (ex.kind === 'trace') {
    ctx.strokeStyle = ex.halloween ? '#ffe2c8' : '#fff0c9'; ctx.lineWidth = 8; ctx.stroke(path);
    ctx.strokeStyle = '#9a8aa8'; ctx.lineWidth = 1.1; ctx.setLineDash([2.6, 2.4]); ctx.stroke(path);
    ctx.setLineDash([]);
    const start = startPoint(ex.path);
    ctx.fillStyle = '#2bb673'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.arc(start.x, start.y, 2.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else {
    ctx.strokeStyle = '#2b2d42'; ctx.lineWidth = 1.6; ctx.stroke(path);
  }
  ctx.restore();
}

function startPoint(d) { const m = d.match(/M\s*([\d.]+)[ ,]+([\d.]+)/); return { x: +m[1], y: +m[2] }; }

const brush = () => state.ex.kind === 'trace' ? 2.6 : state.size === 'big' ? 8 : 3.5;

function drawStroke(ctx, s, from = 0) {
  ctx.save();
  ctx.lineCap = ctx.lineJoin = 'round';
  ctx.lineWidth = s.width;
  ctx.strokeStyle = s.color; ctx.fillStyle = s.color;
  ctx.globalCompositeOperation = s.erase ? 'destination-out' : 'source-over';
  const p = s.pts;
  if (p.length === 1 || from >= p.length - 1) {
    if (p.length === 1) { ctx.beginPath(); ctx.arc(p[0].x, p[0].y, s.width / 2, 0, Math.PI * 2); ctx.fill(); }
  } else {
    ctx.beginPath(); ctx.moveTo(p[Math.max(0, from)].x, p[Math.max(0, from)].y);
    for (let i = Math.max(1, from + 1); i < p.length; i++) ctx.lineTo(p[i].x, p[i].y);
    ctx.stroke();
  }
  ctx.restore();
}

function redrawAll() {
  ctxP.clearRect(0, 0, 100, 100); ctxT.clearRect(0, 0, 100, 100);
  if (!state.ex) return;
  if (state.ex.kind === 'trace') {
    drawGuide(ctxP);
    state.strokes.forEach(s => drawStroke(ctxP, s));
  } else {
    state.strokes.forEach(s => drawStroke(ctxP, s));
    drawGuide(ctxT);
  }
}

function toUnits(e) {
  const r = cvPaint.getBoundingClientRect();
  return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 };
}

cvPaint.addEventListener('pointerdown', e => {
  if (state.pointerId !== null || state.timeUp) return;
  e.preventDefault();
  state.pointerId = e.pointerId;
  cvPaint.setPointerCapture(e.pointerId);
  const s = { color: state.color, width: brush(), erase: state.eraser && state.ex.kind === 'color', pts: [toUnits(e)] };
  state.current = s; state.strokes.push(s);
  drawStroke(ctxP, s);
});
cvPaint.addEventListener('pointermove', e => {
  if (e.pointerId !== state.pointerId || !state.current) return;
  e.preventDefault();
  const s = state.current, from = s.pts.length - 1;
  const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
  for (const ev of (evs.length ? evs : [e])) s.pts.push(toUnits(ev));
  drawStroke(ctxP, s, from);
});
const endStroke = e => {
  if (e.pointerId !== state.pointerId) return;
  state.pointerId = null; state.current = null;
};
cvPaint.addEventListener('pointerup', endStroke);
cvPaint.addEventListener('pointercancel', endStroke);
cvPaint.addEventListener('contextmenu', e => e.preventDefault());

$('#palette').addEventListener('click', e => {
  const b = e.target.closest('.swatch'); if (!b) return;
  state.color = b.dataset.color; state.eraser = false; renderPalette();
});
$('#size-row').addEventListener('click', e => {
  const b = e.target.closest('.size'); if (!b) return;
  state.size = b.dataset.size; state.eraser = false; renderPalette();
});
$('#btn-eraser').onclick = () => { state.eraser = !state.eraser; renderPalette(); };
$('#btn-undo').onclick = () => { state.strokes.pop(); redrawAll(); };
$('#btn-clear').onclick = () => { state.strokes = []; redrawAll(); };
$('#btn-say').onclick = sayInstruction;
$('#draw-back').onclick = () => go(state.ex.kind);

/* ---------- Finito! ---------- */
$('#btn-done').onclick = finishDrawing;

async function finishDrawing() {
  const ex = state.ex;
  if (!state.strokes.some(s => !s.erase)) { toast('Prima disegna! ✏️'); speak('Prima disegna!'); return; }

  let res;
  if (ex.kind === 'trace') {
    if (!targetCache.has(ex.id)) targetCache.set(ex.id, samplePath(ex.path, 100));
    res = scoreTrace(targetCache.get(ex.id), state.strokes.map(s => s.pts), 100, SETTINGS.traceTolerance);
  } else {
    res = scoreColor(ex.path, cvPaint);
  }
  const stars = res.stars;
  const p = state.profile;
  p.best = p.best || {};
  if (stars > (p.best[ex.id] || 0)) p.best[ex.id] = stars;
  const prize = award(ex, stars);

  showResult(ex, res, prize);

  // salvataggi (non bloccano il gioco)
  store.saveProfile(p).catch(err => console.warn('profilo', err));
  const img = snapshot();
  store.addDrawing({ img, exerciseId: ex.id, kind: ex.kind, stars }).catch(err => console.warn('disegno', err));
}

function award(ex, stars) {
  if (!stars) return null;
  const p = state.profile;
  const points = stars + (ex.level === 3 && stars >= 2 ? 1 : 0);
  const hw = !!ex.halloween && isHalloween();
  const key = hw ? 'pumpkinStars' : 'eggStars';
  const need = hw ? SETTINGS.starsPerPumpkin : SETTINGS.starsPerEgg;
  p[key] = (p[key] || 0) + points;
  if (p[key] < need) return null;
  p[key] -= need;
  const pool = hw ? SPECIAL : REGULAR;
  const missing = pool.filter(a => !p.collection[a.id]);
  const pickFrom = missing.length ? missing : pool;
  const animal = pickFrom[Math.floor(Math.random() * pickFrom.length)];
  const isNew = !p.collection[animal.id];
  p.collection[animal.id] = (p.collection[animal.id] || 0) + 1;
  return { animal, hw, isNew };
}

function snapshot() {
  const N = 512, c = document.createElement('canvas'); c.width = c.height = N;
  const x = c.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, N, N);
  x.drawImage(cvPaint, 0, 0, N, N);
  x.drawImage(cvTop, 0, 0, N, N);
  return c.toDataURL('image/jpeg', 0.72);
}

function feedback(ex, res) {
  const s = res.stars;
  const head = ['Riprova, ce la puoi fare! 💪', 'Bene! 👍', 'Molto brava! 🎉', 'Fantastico! 🌟'][s];
  let tip = '';
  if (s < 3) {
    if (ex.kind === 'trace') tip = res.coverage < 0.75 ? 'Ripassa tutta la linea, fino alla fine.' : 'Cerca di stare sopra la linea tratteggiata.';
    else tip = res.spill > 0.12 ? 'Cerca di restare dentro i bordi.' : 'Colora tutto il disegno, senza lasciare buchi.';
  }
  return { head, tip };
}

function showResult(ex, res, prize) {
  const { head, tip } = feedback(ex, res);
  $('#res-stars').innerHTML = [0, 1, 2].map(i => `<span class="${i < res.stars ? '' : 'off'}" style="animation-delay:${i * 0.25}s">⭐</span>`).join('');
  $('#res-msg').innerHTML = head + (tip ? `<br><small style="font-weight:600;font-size:1.2rem">${tip}</small>` : '');
  const box = $('#res-prize');
  if (prize) {
    const a = prize.animal;
    box.className = 'prize' + (prize.hw ? ' hw' : '');
    box.innerHTML = `<div class="p-title">${prize.hw ? '🎃 La zucca magica si è aperta!' : '🥚 Si è schiuso l\'uovo!'}</div>
      <div class="p-animal">${a.emoji}${a.costume ? `<span class="a-costume">${a.costume}</span>` : ''}</div>
      <div class="p-name">${a.name}${prize.isNew ? ' — nuovo!' : ' — ne hai un altro!'}</div>`;
  } else box.className = 'prize hidden';
  $('#overlay-result').classList.remove('hidden');
  renderMeters();

  if (res.stars) chime(res.stars === 3 ? [660, 880, 1100, 1320] : [660, 880]);
  if (prize) {
    setTimeout(() => { chime([523, 659, 784, 1047]); confetti(prize.hw ? ['🎃', '🦇', '👻', '🍬', '⭐'] : undefined); }, 700);
    speak(`${head.replace(/[^\p{L}\p{N} ,!.']/gu, '')} Hai vinto: ${prize.animal.name}!`);
  } else {
    speak(`${head.replace(/[^\p{L}\p{N} ,!.']/gu, '')} ${tip}`);
  }
}

$('#res-again').onclick = () => { $('#overlay-result').classList.add('hidden'); state.strokes = []; redrawAll(); };
$('#res-next').onclick = () => { $('#overlay-result').classList.add('hidden'); go(state.ex.kind); };

/* ======================= Collezione e galleria ======================= */
function animalCard(a, count) {
  return `<div class="animal ${a.halloween ? 'hw' : ''} ${count ? '' : 'locked'}">
    ${count > 1 ? `<span class="a-count">×${count}</span>` : ''}
    <span class="a-emoji">${a.emoji}</span>${a.costume ? `<span class="a-costume">${a.costume}</span>` : ''}
    <span class="a-name">${a.name}</span></div>`;
}

function renderCollection() {
  const c = state.profile.collection || {};
  $('#coll-grid').innerHTML = REGULAR.map(a => animalCard(a, c[a.id] || 0)).join('');
  const ownedHw = SPECIAL.some(a => c[a.id]);
  $('#coll-hw-wrap').classList.toggle('hidden', !(isHalloween() || ownedHw));
  $('#coll-hw').innerHTML = SPECIAL.map(a => animalCard(a, c[a.id] || 0)).join('');
  const have = ANIMALS.filter(a => c[a.id]).length;
  $('#coll-count').textContent = `${have} / ${isHalloween() || ownedHw ? ANIMALS.length : REGULAR.length}`;
}

async function renderGallery(target = '#gallery-grid', withDelete = false) {
  const grid = $(target);
  grid.innerHTML = '<p class="empty">⏳</p>';
  let items = [];
  try { items = await store.listDrawings(60); } catch (e) { console.warn(e); }
  if (target === '#gallery-grid') $('#gallery-empty').classList.toggle('hidden', items.length > 0);
  grid.innerHTML = items.map(d => `
    <div class="thumb" data-id="${d.id}">
      <img src="${d.img}" alt="" loading="lazy">
      <span class="t-stars">${'⭐'.repeat(d.stars || 0)}</span>
      ${withDelete ? '<button class="t-del" aria-label="Elimina">✖</button>' : ''}
    </div>`).join('');
}

$('#gallery-grid').addEventListener('click', e => {
  const t = e.target.closest('.thumb'); if (!t) return;
  $('#photo-big').src = t.querySelector('img').src;
  $('#overlay-photo').classList.remove('hidden');
});
$('#overlay-photo').onclick = () => $('#overlay-photo').classList.add('hidden');

/* ======================= Area genitori ======================= */
let gateAnswer = 0, gateTyped = '';
function openGate() {
  const a = 3 + Math.floor(Math.random() * 7), b = 3 + Math.floor(Math.random() * 7);
  gateAnswer = a * b; gateTyped = '';
  $('#gate-q').textContent = `${a} × ${b}`;
  $('#gate-input').textContent = '';
  $('#overlay-gate').classList.remove('hidden');
}
$('#gate-keys').innerHTML = [1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, 'OK'].map(k => `<button data-k="${k}">${k}</button>`).join('');
$('#gate-keys').addEventListener('click', e => {
  const k = e.target.dataset.k; if (k === undefined) return;
  if (k === '⌫') gateTyped = gateTyped.slice(0, -1);
  else if (k === 'OK') {
    if (+gateTyped === gateAnswer) { $('#overlay-gate').classList.add('hidden'); openParent(); }
    else { gateTyped = ''; toast('Risposta sbagliata'); }
  } else if (gateTyped.length < 3) gateTyped += k;
  $('#gate-input').textContent = gateTyped;
});
$('#gate-cancel').onclick = () => $('#overlay-gate').classList.add('hidden');
$('#btn-parent').onclick = openGate;
$('#timeup-parent').onclick = openGate;

function openParent() {
  flushTime();
  $('#overlay-timeup').classList.add('hidden');
  const m = Math.floor(state.used / 60), s = state.used % 60;
  $('#p-today').textContent = `Tempo usato oggi: ${m} min ${pad(s)} s su ${SETTINGS.dailyMinutes} min.`;
  $('#p-account').textContent = isDemo ? 'Modalità prova (Firebase non configurato): dati salvati solo su questo dispositivo.'
    : `Account: ${state.user.email || state.user.displayName}`;
  const c = state.profile.collection || {};
  const have = ANIMALS.filter(a => c[a.id]).length;
  $('#p-coll').textContent = `${have} animaletti su ${ANIMALS.length} (${SPECIAL.filter(a => c[a.id]).length} di Halloween). Stelle nell'uovo: ${state.profile.eggStars}/${SETTINGS.starsPerEgg}, nella zucca: ${state.profile.pumpkinStars}/${SETTINGS.starsPerPumpkin}.`;
  renderGallery('#p-gallery', true);
  show('parent');
}

$('#p-gallery').addEventListener('click', async e => {
  const del = e.target.closest('.t-del'); if (!del) return;
  if (!confirm('Eliminare questo disegno?')) return;
  const id = del.closest('.thumb').dataset.id;
  try { await store.deleteDrawing(id); del.closest('.thumb').remove(); } catch (err) { alert('Errore: ' + err.message); }
});

$('#btn-reset').onclick = async () => {
  if (!confirm('Azzerare collezione, stelle e record? I disegni salvati restano.')) return;
  state.profile = { collection: {}, eggStars: 0, pumpkinStars: 0, best: {} };
  try { await store.resetAll(); } catch (err) { alert('Errore: ' + err.message); }
  openParent();
};
$('#btn-logout').onclick = async () => {
  if (!confirm("Uscire dall'account? Servirà di nuovo l'accesso Google.")) return;
  flushTime();
  await store.signOut();
};

/* ======================= Timer giornaliero ======================= */
const localKey = day => `dg-time-${day}`;
function localUsed(day) { try { return +localStorage.getItem(localKey(day)) || 0; } catch { return 0; } }
function setLocalUsed(day, v) { try { localStorage.setItem(localKey(day), String(v)); } catch { /* */ } }

async function startDay() {
  state.day = today(); state.pending = 0; state.warned = false; state.timeUp = false;
  let remote = 0;
  try { remote = await store.getSeconds(state.day); } catch (e) { console.warn('tempo', e); }
  state.used = Math.max(remote, localUsed(state.day));
  updateTimeUI();
  checkLimit(true);
}

function flushTime() {
  if (!state.pending || !state.user) return;
  const n = state.pending, day = state.day; state.pending = 0;
  store.addSeconds(day, n).catch(e => { console.warn('tempo', e); state.pending += n; });
}

function updateTimeUI() {
  const left = Math.max(0, LIMIT - state.used);
  const fill = $('#time-fill');
  fill.style.width = (left / LIMIT) * 100 + '%';
  fill.classList.toggle('low', left <= 120);
  $('.timebox').title = `Tempo rimasto: ${Math.ceil(left / 60)} min`;
}

function checkLimit(silent = false) {
  const left = LIMIT - state.used;
  if (left <= 0) {
    if (!state.timeUp) {
      state.timeUp = true; flushTime();
      $('#overlay-result').classList.add('hidden');
      $('#overlay-timeup').classList.remove('hidden');
      if (!silent) speak('Per oggi basta disegnare. Hai lavorato benissimo! Ci vediamo domani.');
    }
  } else if (left <= SETTINGS.warningSeconds && !state.warned) {
    state.warned = true;
    if (!silent) { toast('⏳ Ancora un minuto!', 4000); speak('Ancora un minuto!'); }
  }
}

setInterval(() => {
  if (!state.user) return;
  if (today() !== state.day) { flushTime(); startDay(); $('#overlay-timeup').classList.add('hidden'); return; }
  const counting = CHILD_SCREENS.includes(state.screen) && document.visibilityState === 'visible'
    && !state.timeUp && $('#overlay-gate').classList.contains('hidden');
  if (!counting) return;
  state.used++; state.pending++;
  setLocalUsed(state.day, state.used);
  if (state.pending >= 10) flushTime();
  updateTimeUI();
  checkLimit();
}, 1000);

document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushTime(); });
window.addEventListener('pagehide', flushTime);

/* ======================= Avvio ======================= */
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]'); if (g) go(g.dataset.go);
  const c = e.target.closest('[data-ex]'); if (c) openExercise(c.dataset.ex);
});
$('#egg-box').onclick = () => { $('#egg-box').classList.add('wiggle'); setTimeout(() => $('#egg-box').classList.remove('wiggle'), 1600); speak(`Raccogli ${SETTINGS.starsPerEgg} stelle per far schiudere l'uovo!`); };
$('#pumpkin-box').onclick = () => { $('#pumpkin-box').classList.add('wiggle'); setTimeout(() => $('#pumpkin-box').classList.remove('wiggle'), 1600); speak('Fai i disegni di Halloween per aprire la zucca magica!'); };

let resizeT;
window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(() => { if (state.screen === 'draw') layoutStage(); }, 150); });

$$('.child-name').forEach(el => (el.textContent = SETTINGS.childName));
document.title = `L'atelier di ${SETTINGS.childName}`;

$('#btn-login').onclick = async () => {
  $('#login-error').classList.add('hidden');
  try { await store.signIn(); }
  catch (e) {
    $('#login-error').textContent = 'Accesso non riuscito: ' + (e.code || e.message);
    $('#login-error').classList.remove('hidden');
  }
};

async function boot() {
  if (isDemo) { $('#login-demo-note').classList.remove('hidden'); $('#btn-login').textContent = 'Entra (prova)'; }
  try { await store.init(); }
  catch (e) {
    $('#login-error').textContent = 'Errore di configurazione Firebase: ' + e.message;
    $('#login-error').classList.remove('hidden');
    show('login'); return;
  }
  store.onUser(async u => {
    state.user = u;
    if (!u) { $('#overlay-timeup').classList.add('hidden'); show('login'); return; }
    try { state.profile = await store.loadProfile(); }
    catch (e) { console.warn('profilo', e); state.profile = { collection: {}, eggStars: 0, pumpkinStars: 0, best: {} }; }
    await startDay();
    go('home');
  });
}
boot();

// per i test automatici
window.__dg = { state, isHalloween, scoreTrace, scoreColor, samplePath };
