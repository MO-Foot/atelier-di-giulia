// Teatro: Giulia (Ada) ascolta la scena, ripete le sue battute a pezzi e poi le recita.
// Le voci sono quelle sintetiche del tablet; il riconoscimento vocale usa quello di Safari (Siri).
import { TITLE, CAST, MOMENTS, ADA_LINES, ROLE } from './teatro-copione.js?v=20261115d';

const LEARNED_AT = 3;     // una battuta è "imparata" (biglietto 🎟️) dopo 3 prove riuscite
const OK_SCORE = 0.7;     // parole giuste (in ordine) per dire "giusta"
const ALMOST = 0.45;

let ctx;                  // { $, getProfile, saveProfile, show, toast, confetti, chime }
let run = 0;              // cambia quando si interrompe: le sequenze in corso si fermano
let slow = false;
let current = null;       // momento aperto
let waiters = [];

/* ---------------- Voci ---------------- */
let itVoices = [];
function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  itVoices = speechSynthesis.getVoices().filter(v => (v.lang || '').toLowerCase().startsWith('it'));
}
const FEMALE = /alice|federica|paola|emma|elsa|silvia|chiara|martina|isabella|sara|giulia|marta|alessandra|elena|anna/i;
const MALE = /luca|diego|cosimo|giorgio|enrico|roberto|marco|paolo|andrea|carlo|matteo/i;
function voiceFor(who) {
  if (!itVoices.length) loadVoices();
  if (!itVoices.length) return null;
  const c = CAST[who];
  const want = c.voice === 'm' ? itVoices.filter(v => MALE.test(v.name)) : itVoices.filter(v => FEMALE.test(v.name));
  const pool = want.length ? want : itVoices;
  // personaggi diversi → voci diverse quando possibile
  const idx = Object.keys(CAST).indexOf(who);
  return pool[idx % pool.length];
}
export function voicesInfo() {
  loadVoices();
  return itVoices.map(v => v.name);
}

// Safari su iPad: le frasi vanno tenute in memoria, altrimenti "onend" può non arrivare mai
const alive = new Set();
let missedEnds = 0;
function status(msg) { const el = document.getElementById('th-status'); if (el) el.textContent = msg; }

function say(who, text, myRun) {
  return new Promise(resolve => {
    if (myRun !== run || !('speechSynthesis' in window)) return resolve();
    const c = CAST[who];
    status(`🔊 ${c.name} parla…`);
    const u = new SpeechSynthesisUtterance(text.replace(/[«»]/g, ''));
    u.lang = 'it-IT';
    const v = voiceFor(who); if (v) { try { u.voice = v; } catch { /* voce non valida: si usa quella predefinita */ } }
    u.pitch = c.pitch; u.rate = c.rate * (slow ? 0.8 : 1);
    let done = false;
    const finish = fromTimer => {
      if (done) return; done = true; alive.delete(u);
      if (fromTimer === true) {
        // la voce si è "incantata": dopo due volte si riavvia il motore delle voci
        if (++missedEnds >= 2) { try { speechSynthesis.cancel(); } catch { /* */ } missedEnds = 0; }
      } else missedEnds = 0;
      resolve();
    };
    u.onend = () => finish(false); u.onerror = () => finish(false);
    alive.add(u);
    // sicurezza: se "onend" non arriva si prosegue lo stesso
    setTimeout(() => finish(true), 2500 + text.length * (slow ? 120 : 95));
    try { if (speechSynthesis.paused) speechSynthesis.resume(); } catch { /* */ }
    speechSynthesis.speak(u);
  });
}
const pause = (ms, myRun) => new Promise(r => setTimeout(r, myRun === run ? ms : 0));

/* ---------------- Riconoscimento vocale ---------------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
export const canListen = !!SR;

const NUM = { 0: 'zero', 1: 'uno', 2: 'due', 3: 'tre', 4: 'quattro', 5: 'cinque', 6: 'sei', 7: 'sette', 8: 'otto', 9: 'nove', 10: 'dieci' };
function words(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\d+/g, d => NUM[d] || d).replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean);
}
/** Parte delle parole attese dette nell'ordine giusto (0-1). */
export function similarity(expected, heard) {
  const a = words(expected), b = words(heard);
  if (!a.length) return 0;
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[a.length][b.length] / a.length;
}

/** Va chiamato direttamente dal tocco sul microfono (richiesta di Safari). */
function listen(expected, myRun) {
  return new Promise(resolve => {
    if (!SR) return resolve({ text: '', score: null, error: 'non-supportato' });
    const rec = new SR();
    status('👂 Ti ascolto… parla adesso');
    rec.lang = 'it-IT'; rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 3;
    let best = '', bestScore = 0, finished = false;
    const end = error => {
      if (finished) return; finished = true;
      clearTimeout(t);
      try { rec.abort(); } catch { /* */ }
      if (error && error !== 'no-speech' && error !== 'aborted') status(`⚠️ Microfono: ${error}`);
      // su iPad il microfono deve "liberare" l'audio prima che le voci ripartano
      setTimeout(() => resolve({ text: best, score: best ? bestScore : 0, error }), 450);
    };
    rec.onresult = e => {
      let joined = '';
      for (let i = 0; i < e.results.length; i++) joined += ' ' + e.results[i][0].transcript;
      const alts = [joined];
      const last = e.results[e.results.length - 1];
      for (let k = 1; k < last.length; k++) alts.push(joined.replace(last[0].transcript, last[k].transcript));
      for (const t of alts) { const s = similarity(expected, t); if (s >= bestScore) { bestScore = s; best = t.trim(); } }
      ctx.$('#th-heard').textContent = best;
      if (bestScore >= 0.95) end();
    };
    rec.onerror = e => end(e.error);
    rec.onend = () => end();
    // tempo massimo: abbastanza per una battuta lunga detta piano
    const t = setTimeout(() => end(), 4000 + words(expected).length * 700);
    try { rec.start(); } catch (e) { end('start'); }
    if (myRun !== run) end('stop');
  });
}

/* ---------------- Progressi ---------------- */
const progress = () => (ctx.getProfile().theater = ctx.getProfile().theater || {});
const learned = id => (progress()[id] || 0) >= LEARNED_AT;
function addSuccess(id) {
  const p = progress();
  const was = learned(id);
  p[id] = (p[id] || 0) + 1;
  ctx.saveProfile();
  return !was && learned(id);
}

/* ---------------- Interfaccia ---------------- */
function stopAll() {
  run++;
  status('');
  pendingMic = null; pendingJudge = null;
  try { speechSynthesis.cancel(); } catch { /* */ }
  waiters.forEach(w => w(null)); waiters = [];
  ctx.$('#th-turn').classList.add('hidden');
  setSpeaker(null);
  ctx.$('#th-controls').classList.remove('busy');
}

function setSpeaker(line) {
  const face = ctx.$('#th-face'), bubble = ctx.$('#th-bubble'), who = ctx.$('#th-who');
  ctx.$('#th-cast').querySelectorAll('.th-actor').forEach(el => el.classList.toggle('on', !!line && el.dataset.who === line.who));
  if (!line) { face.textContent = '🎭'; who.textContent = ''; bubble.textContent = ''; ctx.$('#th-stage').className = 'th-stage'; return; }
  const c = CAST[line.who];
  face.textContent = c.emoji; who.textContent = c.name; bubble.textContent = line.text;
  ctx.$('#th-stage').className = 'th-stage' + (line.who === ROLE ? ' ada' : line.who === 'N' ? ' narr' : '');
}

function renderList() {
  const p = progress();
  const total = ADA_LINES.filter(l => learned(l.id)).length;
  ctx.$('#th-count').textContent = `🎟️ ${total} / ${ADA_LINES.length}`;
  ctx.$('#th-list').innerHTML = MOMENTS.map(m => {
    const mine = m.lines.filter(l => l.id);
    return `<button class="th-card" data-moment="${m.id}">
      <span class="th-card-icon">${m.icon}</span>
      <span class="th-card-title">${m.title}</span>
      <span class="th-card-tix">${mine.map(l => `<i class="${learned(l.id) ? 'on' : ''}">🎟️</i>`).join('')}</span>
    </button>`;
  }).join('') + `<button class="th-card th-all" data-moment="tutto"><span class="th-card-icon">🎭</span>
      <span class="th-card-title">Tutte le battute di Ada, una dopo l'altra</span></button>`;
  ctx.$('#th-list').classList.remove('hidden');
  ctx.$('#th-moment').classList.add('hidden');
  void p;
}

function openMoment(id) {
  stopAll();
  current = id === 'tutto'
    ? { id: 'tutto', title: "Tutte le battute di Ada", icon: '🎭', lines: MOMENTS.flatMap(m => m.lines) }
    : MOMENTS.find(m => m.id === id);
  ctx.$('#th-mtitle').textContent = `${current.icon} ${current.title}`;
  const who = [...new Set(current.lines.map(l => l.who).filter(w => w !== 'N'))];
  ctx.$('#th-cast').innerHTML = who.map(w => `<span class="th-actor ${w === ROLE ? 'me' : ''}" data-who="${w}">${CAST[w].emoji}<small>${w === ROLE ? 'Tu!' : CAST[w].name}</small></span>`).join('');
  renderTickets();
  setSpeaker(null);
  ctx.$('#th-list').classList.add('hidden');
  ctx.$('#th-moment').classList.remove('hidden');
}

function renderTickets() {
  const mine = current.lines.filter(l => l.id);
  ctx.$('#th-tickets').innerHTML = mine.map(l => {
    const n = progress()[l.id] || 0;
    return `<span class="th-tix ${learned(l.id) ? 'on' : ''}" title="${l.text}">🎟️<b>${'●'.repeat(Math.min(n, LEARNED_AT))}${'○'.repeat(Math.max(0, LEARNED_AT - n))}</b></span>`;
  }).join('');
}

/* ---- 1) Ascolta: tutta la scena ---- */
async function playListen() {
  stopAll(); const my = run;
  ctx.$('#th-controls').classList.add('busy');
  for (const line of current.lines) {
    if (my !== run) return;
    setSpeaker(line);
    await say(line.who, line.text, my);
    await pause(line.who === ROLE ? 700 : 350, my);
  }
  if (my === run) { setSpeaker(null); ctx.$('#th-controls').classList.remove('busy'); }
}

/* Attesa del turno di Giulia: grande microfono, poi valutazione */
function waitTap(sel) {
  return new Promise(resolve => { waiters.push(resolve); ctx.$(sel).dataset.wait = '1'; });
}

/**
 * Turno di Giulia per un testo (battuta intera o pezzo).
 * Restituisce true se è andata bene (riconoscimento o ✓ del genitore).
 */
async function myTurn(text, my, label = 'Tocca a te!') {
  const turn = ctx.$('#th-turn');
  turn.classList.remove('hidden');
  turn.scrollIntoView({ behavior: 'smooth', block: 'center' });
  ctx.$('#th-turn-label').textContent = label;
  ctx.$('#th-heard').textContent = '';
  ctx.$('#th-result').textContent = '';
  ctx.$('#th-judge').classList.add('hidden');
  ctx.$('#th-mic').classList.remove('hidden');
  ctx.$('#th-mic').classList.add('pulse');
  ctx.$('#th-hint').classList.add('hidden');
  ctx.$('#th-skipmic').classList.toggle('hidden', !canListen);
  status('🎤 Tocca il microfono e parla!');
  if (!micExplained) { micExplained = true; await say('N', "Tocca il microfono e di' la tua battuta!", my); }

  // aspetta il tocco sul microfono (o "salta microfono")
  const tap = await new Promise(resolve => { pendingMic = { resolve, text, my }; waiters.push(() => resolve(null)); });
  if (tap === null || my !== run) return false;
  ctx.$('#th-mic').classList.remove('pulse');

  let verdict;
  if (tap.score === null) verdict = 'manual';
  else if (tap.score >= OK_SCORE) verdict = 'ok';
  else if (tap.score >= ALMOST) verdict = 'almost';
  else verdict = tap.error === 'no-speech' || !tap.text ? 'silent' : 'retry';

  const msg = { ok: 'Bravissima! 🌟', almost: 'Quasi! Ascolta ancora…', retry: 'Riproviamo insieme…', silent: 'Non ti ho sentita… ascolta:', manual: 'Ascolta com\'è:' }[verdict];
  ctx.$('#th-result').textContent = msg;
  ctx.$('#th-mic').classList.add('hidden');
  if (verdict === 'ok') { ctx.chime([660, 880, 1100]); await say('N', 'Bravissima!', my); }
  else {
    await say('N', msg.replace(/[^\p{L} '.,!…]/gu, ''), my);
    ctx.$('#th-hint').textContent = text; ctx.$('#th-hint').classList.remove('hidden');
    setSpeaker({ who: ROLE, text });
    await say(ROLE, text, my);
  }
  if (my !== run) return false;
  // il genitore può sempre correggere
  // se è andata bene si prosegue da soli dopo un attimo (il genitore può ancora premere 🔁)
  ctx.$('#th-judge').classList.remove('hidden');
  const judged = new Promise(resolve => { pendingJudge = resolve; waiters.push(() => resolve(null)); });
  const j = verdict === 'ok'
    ? await Promise.race([judged, new Promise(r => setTimeout(() => r('ok'), 1800))])
    : await judged;
  pendingJudge = null;
  turn.classList.add('hidden');
  if (j === null || my !== run) return false;
  lastJudge = j;
  return j === 'ok';
}
let pendingMic = null, pendingJudge = null, micExplained = false;

async function cueBefore(lines, idx, my, howMany = 2) {
  const cue = [];
  for (let i = idx - 1; i >= 0 && cue.length < howMany; i--) {
    if (lines[i].who === ROLE) break;
    cue.unshift(lines[i]);
  }
  for (const l of cue) { setSpeaker(l); await say(l.who, l.text, my); await pause(250, my); }
}

/* ---- 2) Recita: le battute degli altri, poi tocca a Giulia ---- */
async function playRecite() {
  stopAll(); const my = run;
  ctx.$('#th-controls').classList.add('busy');
  const lines = current.lines;
  for (let i = 0; i < lines.length; i++) {
    if (my !== run) return;
    const l = lines[i];
    if (l.who !== ROLE) continue;
    await cueBefore(lines, i, my);
    if (my !== run) return;
    setSpeaker({ who: ROLE, text: '…' });
    let ok = await myTurn(l.text, my);
    while (!ok && my === run && lastJudge === 'again') ok = await myTurn(l.text, my, 'Ancora una volta!');
    if (my !== run) return;
    if (ok) await celebrate(l);
  }
  if (my === run) {
    setSpeaker(null); ctx.$('#th-controls').classList.remove('busy');
    await say('N', 'Fine della scena. Applausi!', my);
    ctx.confetti(['👏', '🎭', '⭐', '🎟️', '✨']);
  }
}
let lastJudge = null;

async function celebrate(l) {
  const newTicket = addSuccess(l.id);
  renderTickets();
  if (newTicket) {
    ctx.confetti(['🎟️', '⭐', '🎭', '✨']);
    ctx.toast('🎟️ Battuta imparata!', 3000);
  }
}

/* ---- 3) A pezzi: Ada dice un pezzo, Giulia ripete ---- */
export function pieces(text) {
  const parts = text.match(/[^.!?;:]+[.!?;:…]*/g).map(s => s.trim()).filter(Boolean);
  // i pezzi di 1-2 parole si uniscono al pezzo che segue (o, se sono gli ultimi, a quello prima)
  const out = [];
  let carry = '';
  for (const p of parts) {
    const piece = carry ? `${carry} ${p}` : p;
    if (piece.split(' ').length < 3) { carry = piece; continue; }
    out.push(piece); carry = '';
  }
  if (carry) out.length ? (out[out.length - 1] += ' ' + carry) : out.push(carry);
  return out;
}
async function playPieces() {
  // Come la recita: la scena va avanti in ordine, così Giulia sa cosa succede prima.
  // Quando tocca ad Ada: Ada dice la battuta a pezzi e Giulia ripete ogni pezzo;
  // poi si riascolta l'attacco e Giulia dice la battuta intera da sola.
  stopAll(); const my = run;
  ctx.$('#th-controls').classList.add('busy');
  const lines = current.lines;
  for (let i = 0; i < lines.length; i++) {
    if (my !== run) return;
    const l = lines[i];
    if (l.who !== ROLE) {
      setSpeaker(l);
      await say(l.who, l.text, my);
      await pause(300, my);
      continue;
    }
    const parts = pieces(l.text);
    // 1) impara i pezzi
    await say('N', parts.length > 1 ? 'Tocca ad Ada! Impariamo la battuta a pezzi.' : 'Tocca ad Ada! Ascolta e ripeti.', my);
    for (const p of parts) {
      if (my !== run) return;
      setSpeaker({ who: ROLE, text: p });
      await say(ROLE, p, my);
      let ok = await myTurn(p, my, 'Ripeti!');
      while (!ok && my === run && lastJudge === 'again') {
        setSpeaker({ who: ROLE, text: p });
        await say(ROLE, p, my);
        ok = await myTurn(p, my, 'Ancora!');
      }
    }
    if (my !== run) return;
    // 2) di nuovo l'attacco, poi la battuta intera senza aiuto
    const cue = [...lines.slice(0, i)].reverse().find(x => x.who !== ROLE && x.who !== 'N') || lines[i - 1];
    await say('N', 'Adesso tutta da sola, come alla recita!', my);
    let ok = false;
    do {
      if (cue) { setSpeaker(cue); await say(cue.who, cue.text, my); await pause(250, my); }
      if (my !== run) return;
      setSpeaker({ who: ROLE, text: '…' });
      ok = await myTurn(l.text, my, ok === false && lastJudge === 'again' ? 'Ancora una volta!' : 'Tocca a te!');
    } while (!ok && my === run && lastJudge === 'again');
    if (my !== run) return;
    if (ok) await celebrate(l);
  }
  if (my === run) {
    setSpeaker(null); ctx.$('#th-controls').classList.remove('busy');
    await say('N', 'Fine della scena. Applausi!', my);
    ctx.confetti(['👏', '🎭', '⭐', '🎟️', '✨']);
  }
}

/* ---------------- Avvio ---------------- */
export function initTheater(c) {
  ctx = c;
  if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.addEventListener?.('voiceschanged', loadVoices); }
  const $ = ctx.$;
  $('#th-title').textContent = TITLE;
  $('#th-list').addEventListener('click', e => { const b = e.target.closest('[data-moment]'); if (b) openMoment(b.dataset.moment); });
  $('#th-back').onclick = () => {
    if (!$('#th-moment').classList.contains('hidden')) { stopAll(); renderList(); }
    else { stopAll(); ctx.go('home'); }
  };
  $('#th-listen').onclick = playListen;
  $('#th-recite').onclick = playRecite;
  $('#th-pieces').onclick = playPieces;
  $('#th-stop').onclick = () => { stopAll(); try { speechSynthesis.cancel(); } catch { /* */ } };
  // qualsiasi errore nel teatro si vede sullo schermo (utile per capire cosa succede sul tablet)
  window.addEventListener('error', e => { if (!$('#screen-theater').classList.contains('hidden')) status('⚠️ ' + e.message); });
  window.addEventListener('unhandledrejection', e => { if (!$('#screen-theater').classList.contains('hidden')) status('⚠️ ' + (e.reason?.message || e.reason)); });
  $('#th-slow').onclick = () => { slow = !slow; $('#th-slow').classList.toggle('on', slow); ctx.toast(slow ? '🐢 Voci più lente' : '🐇 Voci normali'); };
  // microfono: il riconoscimento DEVE partire dentro il tocco
  $('#th-mic').onclick = async () => {
    if (!pendingMic) return;
    const pm = pendingMic; pendingMic = null;
    $('#th-mic').classList.add('listening');
    $('#th-result').textContent = canListen ? '👂 Ti ascolto…' : '';
    const r = canListen ? await listen(pm.text, pm.my) : { text: '', score: null };
    $('#th-mic').classList.remove('listening');
    pm.resolve(r);
  };
  $('#th-skipmic').onclick = () => { if (!pendingMic) return; const pm = pendingMic; pendingMic = null; pm.resolve({ text: '', score: null }); };
  $('#th-ok').onclick = () => { lastJudge = 'ok'; pendingJudge?.('ok'); pendingJudge = null; };
  $('#th-again').onclick = () => { lastJudge = 'again'; pendingJudge?.('again'); pendingJudge = null; };
  $('#th-next').onclick = () => { lastJudge = 'next'; pendingJudge?.('next'); pendingJudge = null; };
}

export function openTheater() {
  stopAll();
  renderList();
  ctx.show('theater');
}
export function leaveTheater() { stopAll(); }
export { LEARNED_AT };
