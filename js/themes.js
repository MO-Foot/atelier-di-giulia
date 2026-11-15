// Due serie originali con album propri:
//  - Spiritelli degli elementi (creature inventate, una per elemento)
//  - Fatine (fatine inventate, ognuna con il suo potere)
// Ogni personaggio ha il suo disegno, da ricalcare e da colorare.
// Si vince il personaggio facendo bene (almeno THEME_MIN_STARS stelle) il SUO disegno.
// Se lo si ha già, il disegno dà stelle all'uovo come gli altri.
//
// path = disegno completo (con faccia/dettagli); area = parte da colorare.

export const THEME_MIN_STARS = 2;

const circle = (cx, cy, r) => `M${cx} ${cy - r} A${r} ${r} 0 1 1 ${cx - 0.1} ${cy - r} Z`;
const face = (cx, cy, gap = 9, r = 3.6) =>
  `${circle(cx - gap, cy, r)} ${circle(cx + gap, cy, r)} M${cx - 6} ${cy + 9} C${cx - 3} ${cy + 13} ${cx + 3} ${cy + 13} ${cx + 6} ${cy + 9}`;

// ---------- Spiritelli ----------
const spirit = (id, name, emoji, color, body, extra, fx, fy, level, gap, r) => ({
  id: `sp-${id}`, name, emoji, color, level,
  area: body, path: `${body} ${extra} ${face(fx, fy, gap, r)}`.trim(),
});

const SPIRITS = [
  spirit('fiammella', 'Fiammella', '🔥', '#ff8c42',
    'M50 8 C58 22 74 30 74 56 C74 74 64 86 50 86 C36 86 26 74 26 56 C26 42 34 36 38 26 C42 34 44 38 46 40 C46 30 46 20 50 8 Z',
    '', 50, 60, 2),
  spirit('goccina', 'Goccina', '💧', '#4ea8de',
    'M50 10 C40 30 24 44 24 62 C24 78 36 88 50 88 C64 88 76 78 76 62 C76 44 60 30 50 10 Z',
    'M24 64 L13 57 M76 64 L87 57', 50, 62, 1),
  spirit('fogliolina', 'Fogliolina', '🍃', '#52b788',
    `${circle(50, 60, 26)} M50 34 C42 20 50 8 64 10 C64 22 58 32 50 34 Z`,
    'M50 34 L57 20', 50, 60, 2),
  spirit('saetta', 'Saetta', '⚡', '#b9a0ff',
    circle(50, 58, 25),
    'M52 33 L44 21 L55 21 L46 7 M22 42 L15 37 M78 42 L85 37 M20 56 L12 56 M80 56 L88 56', 50, 58, 2),
  spirit('sassolino', 'Sassolino', '🪨', '#a3a9b5',
    'M24 46 L38 28 L64 30 L78 46 L80 72 L66 86 L34 86 L20 70 Z',
    '', 50, 58, 2),
  spirit('nuvolino', 'Nuvolino', '☁️', '#cfe8ff',
    'M26 76 C10 76 10 52 26 54 C24 36 46 30 54 44 C60 30 84 34 80 54 C94 54 94 76 78 76 Z',
    '', 52, 60, 1),
  spirit('cubetto', 'Cubetto', '❄️', '#a8e6ff',
    'M30 28 L70 28 C76 28 78 30 78 36 L78 76 C78 82 76 84 70 84 L30 84 C24 84 22 82 22 76 L22 36 C22 30 24 28 30 28 Z',
    'M30 38 L30 48 M42 20 L42 12 M58 20 L58 12 M38 16 L46 16 M54 16 L62 16', 50, 58, 2),
  spirit('stellina', 'Stellina', '⭐', '#ffd23f',
    'M50 8 L60 35 L89 37 L66 55 L74 84 L50 68 L26 84 L34 55 L11 37 L40 35 Z',
    '', 50, 50, 3, 7, 3),
];

// ---------- Fatine ----------
const FAIRY_AREA =
  `${circle(50, 24, 9)} M45 34 L55 34 L66 70 C56 75 44 75 34 70 Z ` +
  'M45 40 C32 24 14 28 16 42 C18 52 34 52 45 46 Z M45 50 C34 54 24 66 30 70 C36 74 44 62 46 54 Z ' +
  'M55 40 C68 24 86 28 84 42 C82 52 66 52 55 46 Z M55 50 C66 54 76 66 70 70 C64 74 56 62 54 54 Z';
const FAIRY_LINES = 'M45 74 L44 88 M55 74 L56 88 M56 38 L66 30 L77 20 M43 17 L46 12 L50 16 L54 12 L57 17';

// simboli sulla bacchetta, centrati in (X, Y) sopra l'ala destra
const X = 80, Y = 11;
const SYMBOLS = {
  fiore: { area: `${circle(X, Y - 4, 3.5)} ${circle(X + 4, Y, 3.5)} ${circle(X, Y + 4, 3.5)} ${circle(X - 4, Y, 3.5)}`, lines: '' },
  neve: { area: '', lines: `M${X} ${Y - 9} L${X} ${Y + 7} M${X - 8} ${Y - 5} L${X + 8} ${Y + 4} M${X - 8} ${Y + 4} L${X + 8} ${Y - 5}` },
  stelle: { area: `M${X} ${Y - 9} L${X + 3} ${Y - 2} L${X + 10} ${Y - 2} L${X + 4} ${Y + 2} L${X + 6} ${Y + 9} L${X} ${Y + 5} L${X - 6} ${Y + 9} L${X - 4} ${Y + 2} L${X - 10} ${Y - 2} L${X - 3} ${Y - 2} Z`, lines: '' },
  arcobaleno: { area: '', lines: `M${X - 12} ${Y + 6} A12 12 0 0 1 ${X + 12} ${Y + 6} M${X - 7} ${Y + 6} A7 7 0 0 1 ${X + 7} ${Y + 6}` },
  mare: { area: '', lines: `M${X - 11} ${Y} C${X - 8} ${Y - 7} ${X - 3} ${Y - 7} ${X} ${Y} C${X + 3} ${Y + 7} ${X + 8} ${Y + 7} ${X + 11} ${Y}` },
  sole: { area: circle(X, Y, 5), lines: `M${X} ${Y - 10} L${X} ${Y - 7} M${X - 11} ${Y} L${X - 8} ${Y} M${X + 8} ${Y} L${X + 11} ${Y} M${X - 8} ${Y - 7} L${X - 6} ${Y - 5} M${X + 8} ${Y - 7} L${X + 6} ${Y - 5}` },
  luna: { area: `M${X + 4} ${Y - 10} A10 10 0 1 0 ${X + 4} ${Y + 10} A8 8 0 1 1 ${X + 4} ${Y - 10} Z`, lines: '' },
  cuore: { area: `M${X} ${Y + 9} C${X - 8} ${Y + 3} ${X - 10} ${Y - 3} ${X - 5} ${Y - 6} C${X - 2} ${Y - 8} ${X} ${Y - 5} ${X} ${Y - 3} C${X} ${Y - 5} ${X + 2} ${Y - 8} ${X + 5} ${Y - 6} C${X + 10} ${Y - 3} ${X + 8} ${Y + 3} ${X} ${Y + 9} Z`, lines: '' },
};
const fairy = (id, name, emoji, color, sym, level = 3) => ({
  id: `fa-${id}`, name, emoji, color, level,
  area: `${FAIRY_AREA} ${SYMBOLS[sym].area}`.trim(),
  path: `${FAIRY_AREA} ${FAIRY_LINES} ${SYMBOLS[sym].area} ${SYMBOLS[sym].lines}`.trim(),
});

const FAIRIES = [
  fairy('fiori', 'Fatina dei fiori', '🌸', '#ff9ec7', 'fiore'),
  fairy('neve', 'Fatina della neve', '❄️', '#a8e6ff', 'neve'),
  fairy('stelle', 'Fatina delle stelle', '⭐', '#ffe066', 'stelle'),
  fairy('arcobaleno', "Fatina dell'arcobaleno", '🌈', '#c3a6ff', 'arcobaleno'),
  fairy('mare', 'Fatina del mare', '🌊', '#7fd1c7', 'mare'),
  fairy('sole', 'Fatina del sole', '☀️', '#ffb347', 'sole'),
  fairy('luna', 'Fatina della luna', '🌙', '#9fa8ff', 'luna'),
  fairy('cuori', 'Fatina dei cuori', '💗', '#ff7aa2', 'cuore'),
];

export const THEMES = {
  spiritelli: { name: 'Spiritelli degli elementi', short: 'Spiritelli', icon: '✨', items: SPIRITS,
    won: '✨ Hai trovato uno spiritello!' },
  fatine: { name: 'Fatine', short: 'Fatine', icon: '🧚', items: FAIRIES,
    won: '🧚 Una nuova fatina!' },
};
for (const [k, t] of Object.entries(THEMES)) t.items.forEach(i => (i.theme = k));
export const THEME_ITEMS = Object.values(THEMES).flatMap(t => t.items);

/** Esercizi ricalca + colora per ogni personaggio (categoria = nome del tema). */
export function themeExercises() {
  return THEME_ITEMS.flatMap(i => [
    { id: `t-${i.id}`, kind: 'trace', name: i.name, emoji: i.emoji, path: i.path, level: i.level, cat: i.theme, prize: i.id },
    { id: `c-${i.id}`, kind: 'color', name: i.name, emoji: i.emoji, path: i.path, area: i.area, level: i.level, cat: i.theme, prize: i.id, suggest: i.color },
  ]);
}

/** Disegno colorato del personaggio, per l'album e per il premio. */
export function itemSvg(i, size = '100%') {
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">
    <path d="${i.area}" fill="${i.color}" fill-rule="nonzero"/>
    <path d="${i.path}" fill="none" stroke="#3b2c4a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
