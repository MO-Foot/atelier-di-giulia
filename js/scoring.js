// Calcolo del punteggio (0-3 stelle).
// Le sagome sono definite in un riquadro 100x100 che viene scalato sulla tela (size x size pixel).

const SVGNS = 'http://www.w3.org/2000/svg';

/** Restituisce n punti equidistanti lungo il percorso, in pixel della tela. */
export function samplePath(d, size, n = 260) {
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
  svg.style.position = 'absolute'; svg.style.visibility = 'hidden';
  const path = document.createElementNS(SVGNS, 'path');
  path.setAttribute('d', d);
  svg.appendChild(path);
  document.body.appendChild(svg);
  const total = path.getTotalLength();
  const k = size / 100;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const p = path.getPointAtLength((total * i) / n);
    pts.push({ x: p.x * k, y: p.y * k });
  }
  svg.remove();
  return pts;
}

/** Infittisce i tratti in modo che i punti disegnati siano al massimo `step` pixel l'uno dall'altro. */
function densify(strokes, step) {
  const out = [];
  for (const s of strokes) {
    for (let i = 0; i < s.length; i++) {
      const a = s[i];
      out.push(a);
      const b = s[i + 1];
      if (!b) continue;
      const dist = Math.hypot(b.x - a.x, b.y - a.y);
      const m = Math.floor(dist / step);
      for (let j = 1; j < m; j++) out.push({ x: a.x + ((b.x - a.x) * j) / m, y: a.y + ((b.y - a.y) * j) / m });
    }
  }
  return out;
}

/** Griglia spaziale per cercare velocemente "c'è un punto vicino?". */
function makeGrid(points, cell) {
  const g = new Map();
  for (const p of points) {
    const key = `${Math.floor(p.x / cell)},${Math.floor(p.y / cell)}`;
    let arr = g.get(key);
    if (!arr) g.set(key, (arr = []));
    arr.push(p);
  }
  return (p, r) => {
    const cx = Math.floor(p.x / cell), cy = Math.floor(p.y / cell);
    const span = Math.ceil(r / cell);
    const r2 = r * r;
    for (let dx = -span; dx <= span; dx++)
      for (let dy = -span; dy <= span; dy++) {
        const arr = g.get(`${cx + dx},${cy + dy}`);
        if (!arr) continue;
        for (const q of arr) if ((q.x - p.x) ** 2 + (q.y - p.y) ** 2 <= r2) return true;
      }
    return false;
  };
}

/**
 * Ricalco.
 * - copertura: quanta parte della sagoma è stata ripassata
 * - precisione: quanta parte di ciò che ha disegnato sta vicino alla sagoma
 * Il punteggio moltiplica le due cose, così scarabocchiare dappertutto non paga.
 */
export function scoreTrace(target, strokes, size, tolerancePct = 5) {
  const T = (size * tolerancePct) / 100;
  const drawn = densify(strokes, size / 150);
  if (drawn.length < 5) return { stars: 0, score: 0, coverage: 0, accuracy: 0 };

  const nearDrawn = makeGrid(drawn, T);
  const covered = target.filter(p => nearDrawn(p, T)).length;
  const coverage = covered / target.length;

  const nearTarget = makeGrid(target, T);
  const ok = drawn.filter(p => nearTarget(p, T * 1.2)).length;
  const accuracy = ok / drawn.length;

  const score = coverage * (0.25 + 0.75 * accuracy);
  return { stars: starsFor(score, [0.45, 0.68, 0.84]), score, coverage, accuracy };
}

/**
 * Colorare dentro i bordi.
 * - copertura: quanta parte dell'interno è colorata
 * - sbavature: quanto colore è finito fuori (con un piccolo margine di tolleranza sul bordo)
 */
export function scoreColor(d, paintCanvas, marginPct = 3.5) {
  const R = 160;
  const path = new Path2D(d);

  const inside = document.createElement('canvas');
  inside.width = inside.height = R;
  const ic = inside.getContext('2d', { willReadFrequently: true });
  ic.scale(R / 100, R / 100);
  ic.fill(path);

  const allowed = document.createElement('canvas');
  allowed.width = allowed.height = R;
  const ac = allowed.getContext('2d', { willReadFrequently: true });
  ac.scale(R / 100, R / 100);
  ac.fill(path);
  ac.lineWidth = marginPct * 2;
  ac.lineJoin = ac.lineCap = 'round';
  ac.stroke(path);

  const paint = document.createElement('canvas');
  paint.width = paint.height = R;
  const pc = paint.getContext('2d', { willReadFrequently: true });
  pc.drawImage(paintCanvas, 0, 0, R, R);

  const I = ic.getImageData(0, 0, R, R).data;
  const A = ac.getImageData(0, 0, R, R).data;
  const Pd = pc.getImageData(0, 0, R, R).data;

  let insideN = 0, paintedIn = 0, paintedOut = 0;
  for (let i = 3; i < I.length; i += 4) {
    const isIn = I[i] > 128;
    const painted = Pd[i] > 60;
    if (isIn) { insideN++; if (painted) paintedIn++; }
    else if (painted && A[i] < 128) paintedOut++;
  }
  const coverage = insideN ? paintedIn / insideN : 0;
  const spill = paintedOut / Math.max(paintedIn, 1);
  const score = Math.max(0, coverage - 1.5 * spill);
  return { stars: starsFor(score, [0.4, 0.62, 0.8]), score, coverage, spill };
}

function starsFor(score, [one, two, three]) {
  return score >= three ? 3 : score >= two ? 2 : score >= one ? 1 : 0;
}
