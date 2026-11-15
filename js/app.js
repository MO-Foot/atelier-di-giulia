import { store, isDemo } from './store.js?v=20261115';
import { SETTINGS } from './config.js?v=20261115';
import { EXERCISES } from './shapes.js?v=20261115';
import { ALBUMS, SEASONS, ALBUM_ITEMS, ALL_ITEMS, currentAlbum, owned } from './animals.js?v=20261115';
import { samplePath, scoreTrace, scoreColor } from './scoring.js?v=20261115';
import { ALPHABET, LETTER_EXERCISES, letterInfo, LETTER_MIN_STARS } from './letters.js?v=20261115';
import { CATEGORIES } from './library.js?v=20261115';
import { THEMES, THEME_ITEMS, THEME_MIN_STARS, itemSvg } from './themes.js?v=20261115';

// Se un elemento manca (es. file vecchi rimasti in cache) l'app non deve bloccarsi:
// $() restituisce un elemento finto invece di null.
const $ = s => document.querySelector(s) || (console.warn('elemento mancante:', s), document.createElement('div'));
const $$ = s => [...document.querySelectorAll(s)];
const pad = n => String(n).padStart(2, '0');

const COLORS = ['#e63946', '#ff7b00', '#ffd23f', '#52b788', '#2ec4b6', '#3a86ff', '#7b5cff', '#ff5d8f', '#8d5524', '#2b2d42'];
const CHILD_SCREENS = ['home', 'pick', 'draw', 'collection', 'gallery', 'letters'];
const BASE_LIMIT = SETTINGS.dailyMinutes * 60;
const limit = () => BASE_LIMIT + (state.bonus || 0);   // + minuti extra del genitore

const state = {
  user: null, profile: null, screen: 'login',
  day: null, used: 0, bonus: 0, pending: 0, timeUp: false, warned: false,
  kind: 'trace', ex: null, strokes: [], current: null, pointerId: null,
  color: COLORS[6], size: 'big', eraser: false, size100: 0,
};
const targetCache = new Map();

/* ======================= Utilità ======================= */
function today() { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

// ?data=2026-12-05 nell'indirizzo permette ai grandi di provare in anticipo una stagione (non tocca il timer)
const FAKE_DATE = new URLSearchParams(location.search).get('data');
function seasonDate() { return FAKE_DATE ? new Date(FAKE_DATE + 'T12:00:00') : new Date(); }

/** Stagione attiva ('halloween', 'natale') oppure null. */
export function activeSeason(d = seasonDate()) {
  const md = `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  for (const [id, { from, to }] of Object.entries(SETTINGS.seasons || {})) {
    if (!SEASONS[id]) continue;
    if (from <= to ? md >= from && md <= to : md >= from || md <= to) return id;
  }
  return null;
}

const EMPTY_PROFILE = () => ({ collection: {}, eggStars: 0, seasonStars: {}, best: {}, seenAlbum: null, letters: {} });
const findEx = id => EXERCISES.find(e => e.id === id) || LETTER_EXERCISES.find(e => e.id === id);
const traceLike = ex => ex.kind !== 'color';   // ricalco e lettere si valutano allo stesso modo

/** Aggiorna un profilo salvato con la versione precedente dell'app. */
function normalizeProfile(p) {
  const out = { ...EMPTY_PROFILE(), ...p };
  out.collection = out.collection || {};
  out.seasonStars = { ...(out.seasonStars || {}) };
  if (out.pumpkinStars && out.seasonStars.halloween === undefined) out.seasonStars.halloween = out.pumpkinStars;
  delete out.pumpkinStars;
  out.best = out.best || {};
  out.letters = out.letters || {};
  return out;
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
  else if (where === 'trace' || where === 'color') { if (state.kind !== where) state.cat = 'tutti'; state.kind = where; renderPick(); show('pick'); }
  else if (where === 'collection') { renderCollection(); show('collection'); }
  else if (where === 'letters') { renderLetters(); show('letters'); }
  else if (where === 'gallery') { renderGallery(); show('gallery'); }
}

function applySeasonTheme() {
  const se = activeSeason();
  for (const id of Object.keys(SEASONS)) document.body.classList.toggle('season-' + id, se === id);
  return se;
}

function renderHome() {
  const se = applySeasonTheme();
  const banner = $('#season-banner');
  banner.classList.toggle('hidden', !se);
  if (se) { banner.textContent = SEASONS[se].banner; banner.className = 'hw-banner ' + se; }
  renderMeters();
  announceNewAlbum();
}

/** La prima volta che si apre un nuovo album (anche dopo l'aggiornamento dell'app) lo annuncia. */
function announceNewAlbum() {
  const p = state.profile, alb = currentAlbum(p.collection);
  if (!alb || p.seenAlbum === alb.id) return;
  const first = p.seenAlbum === null && alb.id === ALBUMS[0].id;
  p.seenAlbum = alb.id;
  store.saveProfile(p).catch(err => console.warn('profilo', err));
  if (first) return;
  setTimeout(() => {
    toast(`${alb.icon} Nuovo album: ${alb.name}!`, 4500);
    speak(`Nuovo album! ${alb.name}. Fai i disegni per far schiudere le uova!`);
    confetti([alb.icon, '⭐', '✨', '🎉']);
  }, 500);
}

function renderMeters() {
  const p = state.profile; if (!p) return;
  const dots = (n, max) => Array.from({ length: max }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('');
  $('#egg-dots').innerHTML = dots(Math.min(p.eggStars, SETTINGS.starsPerEgg), SETTINGS.starsPerEgg);
  const se = activeSeason();
  $('#season-box').classList.toggle('hidden', !se);
  if (se) {
    const need = SETTINGS.seasons[se].stars;
    $('#season-icon').textContent = SEASONS[se].box;
    $('#season-dots').innerHTML = dots(Math.min(p.seasonStars[se] || 0, need), need);
  }
}

/* ---------- Scelta esercizio ---------- */
function shapeSvg(ex) {
  const trace = ex.kind === 'trace';
  return `<svg viewBox="0 0 100 100" aria-hidden="true">
    ${!trace && ex.area ? `<path d="${ex.area}" fill="${(ex.suggest || '#eee') + '55'}"/>` : ''}
    <path d="${ex.path}" fill="${trace || ex.area ? 'none' : (ex.suggest || '#eee') + '55'}" stroke="${trace ? '#9a8aa8' : '#3b2c4a'}"
      stroke-width="${trace ? 3 : 3}" stroke-dasharray="${trace ? '5 4' : ''}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function renderPick() {
  const se = activeSeason();
  $('#pick-title').textContent = state.kind === 'trace' ? '✏️ Ricalca' : '🖍️ Colora';
  const all = EXERCISES.filter(e => e.kind === state.kind && (!e.season || e.season === se));
  // categorie (chip): Tutti, stagione attiva, poi le categorie della libreria
  const chips = [{ id: 'tutti', name: 'Tutti', icon: '🌈' }];
  if (se && all.some(e => e.season === se)) chips.push({ id: 'season', name: SEASONS[se].name, icon: SEASONS[se].badge });
  chips.push(...Object.entries(THEMES).map(([id, t]) => ({ id, name: t.short, icon: t.icon })));
  chips.push(...CATEGORIES.filter(c => all.some(e => e.cat === c.id)));
  if (!chips.some(c => c.id === state.cat)) state.cat = 'tutti';
  $('#pick-cats').innerHTML = chips.map(c => `<button class="chip ${c.id === state.cat ? 'on' : ''}" data-cat="${c.id}">${c.icon} ${c.name}</button>`).join('');
  const list = all.filter(e => state.cat === 'tutti' || (state.cat === 'season' ? e.season : e.cat === state.cat))
    .sort((a, b) => (b.season ? 1 : 0) - (a.season ? 1 : 0) || a.level - b.level);
  const best = state.profile.best || {};
  $('#pick-grid').innerHTML = list.map(e => `
    <button class="card ${e.season ? 'season ' + e.season : ''}" data-badge="${e.season ? SEASONS[e.season].badge : ''}" data-ex="${e.id}" aria-label="${e.name}">
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
  stopDemo();
  state.ex = findEx(id);
  state.strokes = []; state.current = null; state.eraser = false;
  const isColor = state.ex.kind === 'color';
  state.color = isColor ? (state.ex.suggest || COLORS[0]) : COLORS[6];
  state.size = 'big';
  $('#draw-title').textContent = `${state.ex.emoji} ${state.ex.name}`;
  $('#size-row').classList.toggle('hidden', !isColor);
  $('#btn-demo').classList.toggle('hidden', state.ex.kind !== 'letter');
  renderPalette();
  show('draw');
  layoutStage();
  sayInstruction();
  if (state.ex.kind === 'letter') setTimeout(() => playDemo(), 900);
}

function sayInstruction() {
  const ex = state.ex;
  if (ex.kind === 'letter') {
    const a = letterInfo(ex.letter);
    speak(`Questa è la ${a.say} ${ex.case === 'up' ? 'maiuscola' : 'minuscola'}. ${a.say}, come ${a.word}! Guarda come si scrive, poi ripassala partendo dal numero uno.`);
    return;
  }
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
  if (ex.kind === 'letter') { drawLetterGuide(ctx, ex); }
  else if (ex.kind === 'trace') {
    ctx.strokeStyle = ex.season ? '#ffe2c8' : '#fff0c9'; ctx.lineWidth = 8; ctx.stroke(path);
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

const brush = () => traceLike(state.ex) ? 2.6 : state.size === 'big' ? 8 : 3.5;

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
  if (traceLike(state.ex)) {
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
  stopDemo();
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

$('#pick-cats').addEventListener('click', e => {
  const b = e.target.closest('[data-cat]'); if (!b) return;
  state.cat = b.dataset.cat; renderPick();
});
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
$('#draw-back').onclick = () => { stopDemo(); go(state.ex.kind === 'letter' ? 'letters' : state.ex.kind); };
$('#btn-demo').onclick = () => playDemo();

/* ---------- Finito! ---------- */
$('#btn-done').onclick = finishDrawing;

async function finishDrawing() {
  const ex = state.ex;
  if (!state.strokes.some(s => !s.erase)) { toast('Prima disegna! ✏️'); speak('Prima disegna!'); return; }

  let res;
  if (traceLike(ex)) {
    if (!targetCache.has(ex.id)) targetCache.set(ex.id, samplePath(ex.path, 100));
    res = scoreTrace(targetCache.get(ex.id), state.strokes.map(s => s.pts), 100, SETTINGS.traceTolerance);
  } else {
    res = scoreColor(ex.area || ex.path, cvPaint);
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

const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];

function award(ex, stars) {
  if (!stars) return null;
  const p = state.profile;
  if (ex.kind === 'letter') {
    // Album dell'alfabeto: la lettera entra quando maiuscola e minuscola hanno almeno LETTER_MIN_STARS stelle
    p.letters = p.letters || {};
    const up = p.best[`L-${ex.letter}-up`] || 0, lo = p.best[`L-${ex.letter}-lo`] || 0;
    if (p.letters[ex.letter] || up < LETTER_MIN_STARS || lo < LETTER_MIN_STARS) return null;
    p.letters[ex.letter] = 1;
    return { letter: letterInfo(ex.letter), allLetters: ALPHABET.every(a => p.letters[a.l]) };
  }
  const points = stars + (ex.level === 3 && stars >= 2 ? 1 : 0);
  const se = ex.season && ex.season === activeSeason() ? ex.season : null;

  if (se) {
    // Zucca / pacco regalo della stagione
    const need = SETTINGS.seasons[se].stars;
    p.seasonStars[se] = (p.seasonStars[se] || 0) + points;
    if (p.seasonStars[se] < need) return null;
    p.seasonStars[se] -= need;
    const pool = SEASONS[se].items;
    const missing = pool.filter(a => !p.collection[a.id]);
    const animal = pickRandom(missing.length ? missing : pool);
    const isNew = !p.collection[animal.id];
    p.collection[animal.id] = (p.collection[animal.id] || 0) + 1;
    return { animal, season: se, isNew };
  }

  // Spiritelli e fatine: il disegno di un personaggio fa vincere quel personaggio (se non lo si ha già)
  if (ex.prize && !p.collection[ex.prize] && stars >= THEME_MIN_STARS) {
    const item = THEME_ITEMS.find(i => i.id === ex.prize);
    p.collection[item.id] = 1;
    const t = THEMES[item.theme];
    return { animal: item, theme: item.theme, isNew: true, themeDone: t.items.every(i => p.collection[i.id]) };
  }

  // Uovo dell'album in corso
  p.eggStars = (p.eggStars || 0) + points;
  if (p.eggStars < SETTINGS.starsPerEgg) return null;
  p.eggStars -= SETTINGS.starsPerEgg;
  const album = currentAlbum(p.collection);
  const animal = album ? pickRandom(album.items.filter(a => !p.collection[a.id])) : pickRandom(ALBUM_ITEMS);
  const isNew = !p.collection[animal.id];
  p.collection[animal.id] = (p.collection[animal.id] || 0) + 1;
  let albumDone = null, nextAlbum = null;
  if (album && !album.items.some(a => !p.collection[a.id])) {
    albumDone = album;
    nextAlbum = currentAlbum(p.collection);
    p.seenAlbum = nextAlbum ? nextAlbum.id : p.seenAlbum;
  }
  return { animal, season: null, isNew, albumDone, nextAlbum };
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
    if (traceLike(ex)) tip = res.coverage < 0.75 ? 'Ripassa tutta la linea, fino alla fine.' : 'Cerca di stare sopra la linea tratteggiata.';
    else tip = res.spill > 0.12 ? 'Cerca di restare dentro i bordi.' : 'Colora tutto il disegno, senza lasciare buchi.';
  }
  return { head, tip };
}

function showResult(ex, res, prize) {
  const { head, tip } = feedback(ex, res);
  $('#res-stars').innerHTML = [0, 1, 2].map(i => `<span class="${i < res.stars ? '' : 'off'}" style="animation-delay:${i * 0.25}s">⭐</span>`).join('');
  $('#res-msg').innerHTML = head + (tip ? `<br><small style="font-weight:600;font-size:1.2rem">${tip}</small>` : '');
  const box = $('#res-prize');
  if (prize && prize.letter) {
    const L = prize.letter;
    box.className = 'prize letter';
    box.innerHTML = `<div class="p-title">📖 Nuova lettera nel tuo album!</div>
      <div class="p-letter">${L.l} ${L.l.toLowerCase()}</div>
      <div class="p-name">${L.l} come ${L.word} ${L.emoji}</div>` +
      (prize.allLetters ? '<div class="p-album">🏆 Hai imparato tutto l\'alfabeto! 👑</div>' : '');
  } else if (prize && prize.theme) {
    const a = prize.animal, T = THEMES[prize.theme];
    box.className = 'prize theme';
    box.innerHTML = `<div class="p-title">${T.won}</div>
      <div class="p-svg">${itemSvg(a)}</div>
      <div class="p-name">${a.name}!</div>` +
      (prize.themeDone ? `<div class="p-album">🏆 Album «${T.name}» completo!</div>` : '');
  } else if (prize) {
    const a = prize.animal;
    box.className = 'prize' + (prize.season ? ' special ' + prize.season : '');
    let extra = '';
    if (prize.albumDone) {
      extra = `<div class="p-album">🏆 Album «${prize.albumDone.name}» completo!` +
        (prize.nextAlbum ? `<br>Si apre un nuovo album: ${prize.nextAlbum.icon} ${prize.nextAlbum.name}!` : '<br>Hai completato tutti gli album! 👑') + '</div>';
    }
    box.innerHTML = `<div class="p-title">${prize.season ? SEASONS[prize.season].opened : '🥚 Si è schiuso l\'uovo!'}</div>
      <div class="p-animal"><span class="a-emoji" style="${a.filter ? `--f:${a.filter}` : ''}">${a.emoji}</span>${a.costume ? `<span class="a-costume">${a.costume}</span>` : ''}</div>
      <div class="p-name">${a.name}${prize.isNew ? ' — nuovo!' : ' — ne hai un altro!'}</div>${extra}`;
  } else box.className = 'prize hidden';
  $('#overlay-result').classList.remove('hidden');
  renderMeters();

  if (res.stars) chime(res.stars === 3 ? [660, 880, 1100, 1320] : [660, 880]);
  // pulsante "avanti": dopo la maiuscola si passa alla minuscola della stessa lettera
  $('#res-next').textContent = ex.kind === 'letter' && ex.case === 'up' ? `Ora la ${ex.letter.toLowerCase()} piccola ➡️`
    : ex.kind === 'letter' ? 'Altre lettere ➡️' : 'Altro disegno ➡️';
  if (prize && prize.letter) {
    setTimeout(() => { chime([523, 659, 784, 1047, 1319]); confetti([prize.letter.l, prize.letter.l.toLowerCase(), prize.letter.emoji, '⭐', '✨']); }, 700);
    speak(`${head.replace(/[^\p{L}\p{N} ,!.']/gu, '')} La ${prize.letter.say} entra nel tuo album! ${prize.letter.say} come ${prize.letter.word}!` + (prize.allLetters ? ' Hai imparato tutto l\'alfabeto!' : ''));
  } else if (prize && prize.theme) {
    setTimeout(() => { chime([523, 659, 784, 1047, 1319]); confetti([prize.animal.emoji, '✨', '⭐', THEMES[prize.theme].icon, '💖']); }, 700);
    speak(`${head.replace(/[^\p{L}\p{N} ,!.']/gu, '')} ${prize.animal.name} entra nel tuo album!` + (prize.themeDone ? ` Hai completato l'album ${THEMES[prize.theme].name}!` : ''));
  } else if (prize) {
    setTimeout(() => {
      chime(prize.albumDone ? [523, 659, 784, 1047, 1319, 1568] : [523, 659, 784, 1047]);
      confetti(prize.season ? SEASONS[prize.season].confetti : prize.albumDone ? ['🏆', '⭐', '🎉', '👑', '✨'] : undefined);
    }, 700);
    let msg = `${head.replace(/[^\p{L}\p{N} ,!.']/gu, '')} Hai vinto: ${prize.animal.name}!`;
    if (prize.albumDone) msg += ` Hai completato l'album ${prize.albumDone.name}!` + (prize.nextAlbum ? ` Adesso si apre l'album ${prize.nextAlbum.name}!` : '');
    speak(msg);
  } else {
    speak(`${head.replace(/[^\p{L}\p{N} ,!.']/gu, '')} ${tip}`);
  }
}

$('#res-again').onclick = () => { $('#overlay-result').classList.add('hidden'); state.strokes = []; redrawAll(); };
$('#res-next').onclick = () => {
  $('#overlay-result').classList.add('hidden');
  const ex = state.ex;
  if (ex.kind === 'letter') ex.case === 'up' ? openExercise(`L-${ex.letter}-lo`) : go('letters');
  else go(ex.kind);
};

/* ======================= Collezione e galleria ======================= */
function animalCard(a, count) {
  return `<div class="animal ${a.season ? 'special ' + a.season : ''} ${count ? '' : 'locked'}">
    ${count > 1 ? `<span class="a-count">×${count}</span>` : ''}
    ${a.theme ? `<span class="a-emoji a-svg">${itemSvg(a)}</span>`
      : `<span class="a-emoji" style="${a.filter ? `--f:${a.filter}` : ''}">${a.emoji}</span>`}${a.costume ? `<span class="a-costume">${a.costume}</span>` : ''}
    <span class="a-name">${a.name}</span></div>`;
}

function renderCollection() {
  const c = state.profile.collection || {};
  const se = activeSeason();
  const cur = currentAlbum(c);
  const curIdx = cur ? ALBUMS.indexOf(cur) : ALBUMS.length;
  let html = '', shown = [];

  // Spiritelli e fatine (sempre visibili)
  for (const T of Object.values(THEMES)) {
    shown.push(...T.items);
    const done = owned(T.items, c) === T.items.length;
    html += `<h3 class="sub-title">${T.icon} ${T.name} <span class="pill ${done ? 'done' : ''}">${done ? '🏆 ' : ''}${owned(T.items, c)} / ${T.items.length}</span></h3>
      <p class="theme-hint">Fai bene il disegno di un personaggio (in Ricalca o Colora) per farlo entrare nell'album.</p>
      <div class="coll-grid">${T.items.map(a => animalCard(a, c[a.id] || 0)).join('')}</div>`;
  }

  // Serie stagionali: quella attiva per prima, le altre solo se ne ha già almeno uno
  const seasonIds = Object.keys(SEASONS).sort((a, b) => (b === se) - (a === se));
  for (const id of seasonIds) {
    const S = SEASONS[id];
    if (id !== se && !owned(S.items, c)) continue;
    shown.push(...S.items);
    html += `<h3 class="sub-title special-title ${id}">${S.badge} ${S.name} <span class="pill">${owned(S.items, c)} / ${S.items.length}</span></h3>
      <div class="coll-grid">${S.items.map(a => animalCard(a, c[a.id] || 0)).join('')}</div>`;
  }

  // Album: quelli aperti (dal più recente) e poi un lucchetto per il prossimo
  const open = ALBUMS.slice(0, curIdx + 1).reverse();
  for (const A of open) {
    shown.push(...A.items);
    const done = owned(A.items, c) === A.items.length;
    html += `<h3 class="sub-title">${A.icon} ${A.name} <span class="pill ${done ? 'done' : ''}">${done ? '🏆 ' : ''}${owned(A.items, c)} / ${A.items.length}</span></h3>
      <div class="coll-grid">${A.items.map(a => animalCard(a, c[a.id] || 0)).join('')}</div>`;
  }
  const locked = ALBUMS.slice(curIdx + 1);
  if (locked.length) {
    html += `<div class="locked-albums">${locked.map((A, i) => `<div class="locked-album"><span class="la-icon">🔒</span>
      <span>${i === 0 ? `Il prossimo album si apre quando completi «${cur.name}»` : 'Album segreto'}</span></div>`).join('')}</div>`;
  }
  $('#coll-sections').innerHTML = html;
  $('#coll-count').textContent = `${owned(shown, c)} / ${shown.length}`;
}

/* ======================= Lettere ======================= */
function renderLetters() {
  const p = state.profile, best = p.best || {}, got = p.letters || {};
  const mark = n => (n ? '⭐'.repeat(n) : '');
  $('#letters-grid').innerHTML = ALPHABET.map(a => `
    <div class="lcard ${got[a.l] ? 'done' : ''}">
      <div class="l-pair">
        <button class="l-btn" data-ex="L-${a.l}-up" aria-label="${a.l} maiuscola">${a.l}<small>${mark(best[`L-${a.l}-up`])}</small></button>
        <button class="l-btn" data-ex="L-${a.l}-lo" aria-label="${a.l.toLowerCase()} minuscola">${a.l.toLowerCase()}<small>${mark(best[`L-${a.l}-lo`])}</small></button>
      </div>
      <span class="l-word"><span class="l-emoji">${a.emoji}</span> <span>${got[a.l] ? a.word : '?'}</span></span>
    </div>`).join('');
  $('#letters-count').textContent = `📖 ${ALPHABET.filter(a => got[a.l]).length} / ${ALPHABET.length}`;
}

const STROKE_COLORS = ['#e63946', '#2a9d8f', '#3a86ff', '#ff7b00'];
const strokeCache = new Map();
function strokePoints(d) {
  if (!strokeCache.has(d)) strokeCache.set(d, samplePath(d, 100, 60));
  return strokeCache.get(d);
}

/** Righe del quaderno + lettera tratteggiata + numeri e frecce per l'ordine dei tratti. */
function drawLetterGuide(ctx, ex) {
  ctx.save();
  ctx.lineCap = ctx.lineJoin = 'round';
  // righe
  const line = (y, color, dash) => { ctx.beginPath(); ctx.setLineDash(dash || []); ctx.strokeStyle = color; ctx.lineWidth = 0.5; ctx.moveTo(4, y); ctx.lineTo(96, y); ctx.stroke(); };
  line(20, '#d9cde6'); line(48, '#c9b8da', [2, 2]); line(80, '#9a8aa8'); line(96, '#eee6f4');
  ctx.setLineDash([]);
  // lettera
  ex.strokes.forEach(d => {
    const path = new Path2D(d);
    ctx.strokeStyle = '#e4f1ff'; ctx.lineWidth = 8; ctx.stroke(path);
    ctx.strokeStyle = '#9a8aa8'; ctx.lineWidth = 1.1; ctx.setLineDash([2.6, 2.4]); ctx.stroke(path); ctx.setLineDash([]);
  });
  // numeri e frecce
  ex.strokes.forEach((d, i) => {
    const pts = strokePoints(d), c = STROKE_COLORS[i % STROKE_COLORS.length];
    const a = pts[0];
    let b = pts[Math.min(pts.length - 1, 12)];
    for (const p of pts) { if (Math.hypot(p.x - a.x, p.y - a.y) >= 9) { b = p; break; } }
    const ang = Math.atan2(b.y - a.y, b.x - a.x);
    // freccia
    ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(a.x + Math.cos(ang) * 3.5, a.y + Math.sin(ang) * 3.5); ctx.lineTo(b.x, b.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(b.x + Math.cos(ang) * 2.2, b.y + Math.sin(ang) * 2.2);
    ctx.lineTo(b.x + Math.cos(ang + 2.5) * 2.6, b.y + Math.sin(ang + 2.5) * 2.6);
    ctx.lineTo(b.x + Math.cos(ang - 2.5) * 2.6, b.y + Math.sin(ang - 2.5) * 2.6); ctx.closePath(); ctx.fill();
    // numero
    ctx.beginPath(); ctx.arc(a.x, a.y, 3.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 4.2px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), a.x, a.y + 0.2);
  });
  ctx.restore();
}

/** Animazione: una manina disegna i tratti uno dopo l'altro (sul livello superiore, che non riceve tocchi). */
let demoRaf = null;
function stopDemo() {
  if (demoRaf) cancelAnimationFrame(demoRaf);
  demoRaf = null;
  if (state.ex && traceLike(state.ex)) ctxT.clearRect(0, 0, 100, 100);
}
function playDemo() {
  const ex = state.ex;
  if (!ex || ex.kind !== 'letter' || state.screen !== 'draw') return;
  stopDemo();
  const strokes = ex.strokes.map(strokePoints);
  const perStroke = 1100, pause = 250;
  const t0 = performance.now();
  const frame = now => {
    const t = now - t0;
    ctxT.clearRect(0, 0, 100, 100);
    ctxT.save(); ctxT.lineCap = ctxT.lineJoin = 'round'; ctxT.lineWidth = 3;
    let hand = null;
    strokes.forEach((pts, i) => {
      const start = i * (perStroke + pause);
      const f = Math.max(0, Math.min(1, (t - start) / perStroke));
      if (f <= 0) return;
      const n = Math.max(1, Math.round(f * (pts.length - 1)));
      ctxT.strokeStyle = STROKE_COLORS[i % STROKE_COLORS.length];
      ctxT.beginPath(); ctxT.moveTo(pts[0].x, pts[0].y);
      for (let k = 1; k <= n; k++) ctxT.lineTo(pts[k].x, pts[k].y);
      ctxT.stroke();
      if (f < 1) hand = pts[n];
    });
    if (hand) { ctxT.font = '9px sans-serif'; ctxT.textAlign = 'left'; ctxT.textBaseline = 'top'; ctxT.fillText('☝️', hand.x - 1.5, hand.y - 0.5); }
    ctxT.restore();
    const total = strokes.length * (perStroke + pause) + 700;
    if (t < total) demoRaf = requestAnimationFrame(frame);
    else { demoRaf = null; ctxT.clearRect(0, 0, 100, 100); }
  };
  demoRaf = requestAnimationFrame(frame);
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

async function addFiveMinutes() {
  // 5 minuti in più da adesso (se il tempo era già scaduto da qualche secondo, si recupera anche quello)
  const extra = 5 * 60 + Math.max(0, state.used - limit());
  state.bonus += extra;
  try { await store.addBonus(state.day, extra); } catch (e) { console.warn('bonus', e); }
  state.timeUp = false; state.warned = false;
  $('#overlay-timeup').classList.add('hidden');
  updateTimeUI();
  openParent();
  toast('⏳ +5 minuti!');
}
$('#btn-plus5').onclick = addFiveMinutes;

function openParent() {
  flushTime();
  $('#overlay-timeup').classList.add('hidden');
  const m = Math.floor(state.used / 60), s = state.used % 60;
  const extraMin = Math.round((state.bonus || 0) / 60);
  $('#p-today').textContent = `Tempo usato oggi: ${m} min ${pad(s)} s su ${SETTINGS.dailyMinutes} min` + (extraMin ? ` + ${extraMin} min extra.` : '.');
  $('#p-account').textContent = isDemo ? 'Modalità prova (Firebase non configurato): dati salvati solo su questo dispositivo.'
    : `Account: ${state.user.email || state.user.displayName}`;
  const c = state.profile.collection || {};
  const cur = currentAlbum(c);
  const lines = ALBUMS.map(A => `${A.icon} ${A.name}: ${owned(A.items, c)}/${A.items.length}`)
    .concat(Object.values(THEMES).map(T => `${T.icon} ${T.name}: ${owned(T.items, c)}/${T.items.length}`))
    .concat(Object.entries(SEASONS).map(([id, S]) => `${S.badge} ${S.name}: ${owned(S.items, c)}/${S.items.length} (stelle ${state.profile.seasonStars[id] || 0}/${SETTINGS.seasons[id]?.stars ?? '-'})`));
  const nLet = ALPHABET.filter(a => (state.profile.letters || {})[a.l]).length;
  $('#p-coll').innerHTML = `Alfabeto: <b>${nLet}/${ALPHABET.length}</b> lettere nell'album<br>Album in corso: <b>${cur ? cur.name : 'tutti completi'}</b> · stelle nell'uovo ${state.profile.eggStars}/${SETTINGS.starsPerEgg}<br>` + lines.join('<br>');
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
  state.profile = EMPTY_PROFILE();
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
  state.bonus = 0;
  try { state.bonus = await store.getBonus(state.day); } catch (e) { console.warn('bonus', e); }
  updateTimeUI();
  checkLimit(true);
}

function flushTime() {
  if (!state.pending || !state.user) return;
  const n = state.pending, day = state.day; state.pending = 0;
  store.addSeconds(day, n).catch(e => { console.warn('tempo', e); state.pending += n; });
}

function updateTimeUI() {
  const left = Math.max(0, limit() - state.used);
  const fill = $('#time-fill');
  fill.style.width = Math.min(100, (left / BASE_LIMIT) * 100) + '%';
  fill.classList.toggle('low', left <= 120);
  $('.timebox').title = `Tempo rimasto: ${Math.ceil(left / 60)} min`;
}

function checkLimit(silent = false) {
  const left = limit() - state.used;
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
$('#egg-box').onclick = () => { $('#egg-box').classList.add('wiggle'); setTimeout(() => $('#egg-box').classList.remove('wiggle'), 1600); const alb = currentAlbum(state.profile.collection); speak(`Raccogli ${SETTINGS.starsPerEgg} stelle per far schiudere l'uovo!` + (alb ? ` Album: ${alb.name}.` : '')); };
$('#season-box').onclick = () => {
  const se = activeSeason(); if (!se) return;
  $('#season-box').classList.add('wiggle'); setTimeout(() => $('#season-box').classList.remove('wiggle'), 1600);
  speak(SEASONS[se].hint);
};

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
    try { state.profile = normalizeProfile(await store.loadProfile()); }
    catch (e) { console.warn('profilo', e); state.profile = EMPTY_PROFILE(); }
    await startDay();
    go('home');
  });
}
boot();

// per i test automatici
window.__dgReady = true;
window.__dg = { state, activeSeason, scoreTrace, scoreColor, samplePath, award, normalizeProfile, go };
