// `area` (facoltativo) = la parte da colorare, se diversa dal disegno (es. senza manico o filo).
// Libreria di disegni aggiuntivi, divisi per categoria.
// Riquadro 100x100. Ogni voce: id base, nome, emoji, categoria, percorso, livello,
// colore suggerito (per "colora") e se va anche in "colora" (solo forme chiuse).

export const CATEGORIES = [
  { id: 'forme',   name: 'Forme',      icon: '🔷' },
  { id: 'animali', name: 'Animali',    icon: '🐾' },
  { id: 'casa',    name: 'Casa e giochi', icon: '🎈' },
  { id: 'natura',  name: 'Natura',     icon: '🌳' },
  { id: 'mezzi',   name: 'Mezzi',      icon: '🚗' },
];

const circle = (cx, cy, r) => `M${cx} ${cy - r} A${r} ${r} 0 1 1 ${cx - 0.1} ${cy - r} Z`;

export const LIBRARY = [
  // ---------- Animali ----------
  { id: 'coniglio', name: 'Il coniglietto', emoji: '🐰', cat: 'animali', level: 2, suggest: '#f2e8df', color: true,
    path: 'M40 43 C30 30 30 10 38 10 C46 10 48 28 46 41 Z M54 41 C52 28 54 10 62 10 C70 10 70 30 60 43 Z M50 40 C30 40 24 56 24 64 C24 80 36 88 50 88 C64 88 76 80 76 64 C76 56 70 40 50 40 Z' },
  { id: 'tartaruga', name: 'La tartaruga', emoji: '🐢', cat: 'animali', level: 2, suggest: '#52b788', color: true,
    path: 'M18 66 C18 34 82 34 82 66 Z M82 60 C84 50 96 50 95 59 C94 67 86 68 82 66 Z M26 66 L26 78 L37 78 L37 66 Z M63 66 L63 78 L74 78 L74 66 Z' },
  { id: 'uccellino', name: "L'uccellino", emoji: '🐦', cat: 'animali', level: 2, suggest: '#3a86ff', color: true,
    area: 'M22 60 C22 40 42 32 56 38 C60 24 80 24 82 38 L93 43 L82 48 C80 66 66 78 46 78 C32 78 22 72 22 60 Z',
    path: 'M22 60 C22 40 42 32 56 38 C60 24 80 24 82 38 L93 43 L82 48 C80 66 66 78 46 78 C32 78 22 72 22 60 Z M38 56 C44 46 58 46 62 58 C54 63 45 63 38 56 Z M48 78 L46 90 M60 78 L62 90' },
  { id: 'balena', name: 'La balena', emoji: '🐳', cat: 'animali', level: 2, suggest: '#4ea8de', color: true,
    area: 'M12 58 C12 38 38 30 60 36 C74 40 80 48 83 56 L93 42 L94 72 L84 63 C78 78 60 84 40 82 C22 80 12 72 12 58 Z',
    path: 'M12 58 C12 38 38 30 60 36 C74 40 80 48 83 56 L93 42 L94 72 L84 63 C78 78 60 84 40 82 C22 80 12 72 12 58 Z M44 32 C44 22 38 17 32 20 M44 32 C44 22 50 17 56 20' },
  { id: 'farfalla', name: 'La farfalla', emoji: '🦋', cat: 'animali', level: 3, suggest: '#ff5d8f', color: true,
    area: 'M50 50 C40 26 14 20 15 38 C16 52 34 55 50 50 Z M50 50 C60 26 86 20 85 38 C84 52 66 55 50 50 Z M50 53 C40 62 22 68 25 80 C29 90 44 78 50 57 Z M50 53 C60 62 78 68 75 80 C71 90 56 78 50 57 Z',
    path: 'M50 50 C40 26 14 20 15 38 C16 52 34 55 50 50 Z M50 50 C60 26 86 20 85 38 C84 52 66 55 50 50 Z M50 53 C40 62 22 68 25 80 C29 90 44 78 50 57 Z M50 53 C60 62 78 68 75 80 C71 90 56 78 50 57 Z M50 36 L50 74 M50 37 L42 22 M50 37 L58 22' },
  { id: 'chiocciola', name: 'La chiocciola', emoji: '🐌', cat: 'animali', level: 3, suggest: '#f4a261', color: true,
    area: `M10 80 C10 72 18 70 26 72 L78 72 L80 54 C82 46 92 48 90 56 L88 80 Z ${circle(50, 48, 23)}`,
    path: `M10 80 C10 72 18 70 26 72 L78 72 L80 54 C82 46 92 48 90 56 L88 80 Z ${circle(50, 48, 23)} M50 48 C50 42 58 42 58 48 C58 56 44 58 42 48 C40 36 60 32 66 44` },
  { id: 'pulcino', name: 'Il pulcino', emoji: '🐥', cat: 'animali', level: 1, suggest: '#ffd23f', color: true,
    path: 'M50 26 C36 26 30 36 32 46 C20 50 18 76 34 84 C44 90 60 90 68 84 C82 76 80 52 68 46 C70 36 64 26 50 26 Z M62 38 L74 42 L62 46 Z' },
  { id: 'maialino', name: 'Il maialino', emoji: '🐷', cat: 'animali', level: 2, suggest: '#ffb3c8', color: true,
    path: `M30 34 L24 14 L44 26 Z M70 34 L76 14 L56 26 Z ${circle(50, 54, 30)} M40 58 C40 50 60 50 60 58 C60 68 40 68 40 58 Z` },

  // ---------- Casa e giochi ----------
  { id: 'palloncino', name: 'Il palloncino', emoji: '🎈', cat: 'casa', level: 1, suggest: '#e63946', color: true,
    area: 'M50 12 C32 12 26 28 26 38 C26 54 40 64 50 66 C60 64 74 54 74 38 C74 28 68 12 50 12 Z M46 72 L50 66 L54 72 Z',
    path: 'M50 12 C32 12 26 28 26 38 C26 54 40 64 50 66 C60 64 74 54 74 38 C74 28 68 12 50 12 Z M46 72 L50 66 L54 72 Z M50 72 C44 78 56 84 50 92' },
  { id: 'ombrello', name: "L'ombrello", emoji: '☂️', cat: 'casa', level: 2, suggest: '#7b5cff', color: true,
    area: 'M12 52 C12 24 88 24 88 52 C82 45 75 45 69 52 C63 45 56 45 50 52 C44 45 37 45 31 52 C25 45 18 45 12 52 Z',
    path: 'M12 52 C12 24 88 24 88 52 C82 45 75 45 69 52 C63 45 56 45 50 52 C44 45 37 45 31 52 C25 45 18 45 12 52 Z M50 52 L50 82 C50 91 39 91 39 82' },
  { id: 'gelato', name: 'Il gelato', emoji: '🍦', cat: 'casa', level: 1, suggest: '#ffb3c8', color: true,
    path: 'M34 48 L50 90 L66 48 Z M30 48 C24 28 40 18 50 20 C60 18 76 28 70 48 Z' },
  { id: 'tazza', name: 'La tazza', emoji: '☕', cat: 'casa', level: 1, suggest: '#2ec4b6', color: true,
    area: 'M22 30 L68 30 L64 82 L26 82 Z',
    path: 'M22 30 L68 30 L64 82 L26 82 Z M67 40 C86 40 86 68 64 66' },
  { id: 'lampadina', name: 'La lampadina', emoji: '💡', cat: 'casa', level: 2, suggest: '#ffd23f', color: true,
    area: 'M50 12 C32 12 24 26 26 38 C28 50 38 56 40 66 L60 66 C62 56 72 50 74 38 C76 26 68 12 50 12 Z',
    path: 'M50 12 C32 12 24 26 26 38 C28 50 38 56 40 66 L60 66 C62 56 72 50 74 38 C76 26 68 12 50 12 Z M40 73 L60 73 M42 80 L58 80 M45 87 L55 87' },
  { id: 'libro', name: 'Il libro', emoji: '📖', cat: 'casa', level: 2, suggest: '#3a86ff', color: true,
    path: 'M12 26 C28 20 44 22 50 30 C56 22 72 20 88 26 L88 80 C72 74 56 76 50 84 C44 76 28 74 12 80 Z M50 30 L50 84' },
  { id: 'matita', name: 'La matita', emoji: '✏️', cat: 'casa', level: 2, suggest: '#ffd23f', color: true,
    path: 'M22 72 L66 28 L78 40 L34 84 Z M22 72 L14 92 L34 84 M60 34 L72 46' },
  { id: 'pallone', name: 'Il pallone', emoji: '⚽', cat: 'casa', level: 2, suggest: '#ffffff', color: false,
    path: `${circle(50, 50, 36)} M50 38 L61 46 L57 59 L43 59 L39 46 Z M50 38 L50 14 M61 46 L84 40 M57 59 L70 80 M43 59 L30 80 M39 46 L16 40` },
  { id: 'trenino-cubi', name: 'Le costruzioni', emoji: '🧱', cat: 'casa', level: 1, suggest: '#f77f00', color: true,
    path: 'M14 86 L14 60 L46 60 L46 86 Z M54 86 L54 60 L86 60 L86 86 Z M30 60 L30 32 L70 32 L70 60 Z M42 32 L50 16 L58 32 Z' },

  // ---------- Natura ----------
  { id: 'albero', name: "L'albero", emoji: '🌳', cat: 'natura', level: 2, suggest: '#52b788', color: true,
    path: 'M50 10 C34 10 26 20 28 30 C16 34 16 54 30 56 C32 64 44 66 50 60 C56 66 68 64 70 56 C84 54 84 34 72 30 C74 20 66 10 50 10 Z M44 61 L42 90 L58 90 L56 61 Z' },
  { id: 'foglia', name: 'La foglia', emoji: '🍃', cat: 'natura', level: 1, suggest: '#52b788', color: true,
    path: 'M18 82 C18 42 48 16 84 16 C84 52 58 82 18 82 Z M18 82 L62 38' },
  { id: 'fungo', name: 'Il fungo', emoji: '🍄', cat: 'natura', level: 1, suggest: '#e63946', color: true,
    path: 'M12 52 C12 22 88 22 88 52 Z M38 52 L36 86 L64 86 L62 52 Z' },
  { id: 'arcobaleno', name: "L'arcobaleno", emoji: '🌈', cat: 'natura', level: 1, color: false,
    path: 'M12 78 A38 38 0 0 1 88 78 M24 78 A26 26 0 0 1 76 78 M36 78 A14 14 0 0 1 64 78' },
  { id: 'montagna', name: 'La montagna', emoji: '🏔️', cat: 'natura', level: 2, suggest: '#8d99ae', color: true,
    path: 'M8 84 L38 28 L52 52 L64 38 L92 84 Z M29 45 L38 28 L47 45 L42 49 L38 44 L34 49 Z' },
  { id: 'tulipano', name: 'Il tulipano', emoji: '🌷', cat: 'natura', level: 2, suggest: '#ff5d8f', color: true,
    area: 'M34 18 L42 30 L50 16 L58 30 L66 18 L66 38 C66 52 34 52 34 38 Z',
    path: 'M34 18 L42 30 L50 16 L58 30 L66 18 L66 38 C66 52 34 52 34 38 Z M50 48 L50 90 M50 76 C42 62 30 62 26 66 C32 76 42 78 50 76' },
  { id: 'goccia', name: 'La goccia', emoji: '💧', cat: 'natura', level: 1, suggest: '#4ea8de', color: true,
    path: 'M50 10 C38 32 26 46 26 62 C26 76 38 86 50 86 C62 86 74 76 74 62 C74 46 62 32 50 10 Z' },
  { id: 'sole-raggi', name: 'Il sole con i raggi', emoji: '🌞', cat: 'natura', level: 2, color: false,
    path: `${circle(50, 50, 18)} M50 8 L50 22 M50 78 L50 92 M8 50 L22 50 M78 50 L92 50 M20 20 L30 30 M70 70 L80 80 M80 20 L70 30 M30 70 L20 80` },

  // ---------- Mezzi ----------
  { id: 'macchina', name: 'La macchina', emoji: '🚗', cat: 'mezzi', level: 2, suggest: '#e63946', color: true,
    path: `M10 66 L10 52 L26 49 L36 32 L66 32 L78 49 L90 53 L90 66 Z ${circle(30, 68, 9)} ${circle(70, 68, 9)}` },
  { id: 'barca', name: 'La barca a vela', emoji: '⛵', cat: 'mezzi', level: 2, suggest: '#3a86ff', color: true,
    path: 'M12 62 L88 62 L76 82 L24 82 Z M48 12 L48 56 L18 56 Z M54 20 L54 56 L78 56 Z' },
  { id: 'razzo', name: 'Il razzo', emoji: '🚀', cat: 'mezzi', level: 2, suggest: '#e5e5e5', color: true,
    area: 'M50 8 C64 20 66 44 62 70 L38 70 C34 44 36 20 50 8 Z M38 54 L24 76 L38 70 Z M62 54 L76 76 L62 70 Z',
    path: `M50 8 C64 20 66 44 62 70 L38 70 C34 44 36 20 50 8 Z M38 54 L24 76 L38 70 Z M62 54 L76 76 L62 70 Z ${circle(50, 36, 7)} M42 72 L50 90 L58 72` },
  { id: 'treno', name: 'Il treno', emoji: '🚂', cat: 'mezzi', level: 3, suggest: '#2a9d8f', color: true,
    path: `M12 74 L12 42 L22 42 L22 28 L46 28 L46 42 L88 42 L88 74 Z M60 42 L60 26 L74 26 L74 42 ${circle(30, 78, 9)} ${circle(70, 78, 9)}` },
  { id: 'aereo', name: "L'aereo", emoji: '✈️', cat: 'mezzi', level: 3, suggest: '#8ecae6', color: true,
    path: 'M10 54 C10 46 20 44 30 44 L76 44 C86 44 92 48 92 51 C92 55 86 58 76 58 L30 58 C20 58 10 60 10 54 Z M44 44 L58 20 L67 20 L61 44 Z M44 58 L58 82 L67 82 L61 58 Z M14 47 L10 28 L20 28 L28 44 Z' },
  { id: 'bicicletta', name: 'La bicicletta', emoji: '🚲', cat: 'mezzi', level: 3, color: false,
    path: `${circle(26, 64, 16)} ${circle(74, 64, 16)} M26 64 L42 38 L66 38 L74 64 M42 38 L54 64 L66 38 M26 64 L54 64 M38 32 L48 32 M66 38 L64 28 L72 28` },
  { id: 'camion', name: 'Il camion', emoji: '🚚', cat: 'mezzi', level: 2, suggest: '#f77f00', color: true,
    path: `M8 70 L8 32 L58 32 L58 70 Z M58 46 L76 46 L90 58 L90 70 L58 70 Z ${circle(26, 74, 8)} ${circle(74, 74, 8)}` },
  { id: 'mongolfiera', name: 'La mongolfiera', emoji: '🎈', cat: 'mezzi', level: 2, suggest: '#ff7b00', color: true,
    area: 'M50 8 C26 8 20 28 24 42 C28 54 40 60 44 64 L56 64 C60 60 72 54 76 42 C80 28 74 8 50 8 Z M42 74 L58 74 L56 88 L44 88 Z',
    path: 'M50 8 C26 8 20 28 24 42 C28 54 40 60 44 64 L56 64 C60 60 72 54 76 42 C80 28 74 8 50 8 Z M42 74 L58 74 L56 88 L44 88 Z M44 64 L42 74 M56 64 L58 74' },
];

// Categoria dei disegni che c'erano già (id base → categoria)
export const BASE_CATS = {
  linea: 'forme', onda: 'forme', zigzag: 'forme', cerchio: 'forme', quadrato: 'forme', triangolo: 'forme',
  cuore: 'forme', stella: 'forme', casa: 'casa', nuvola: 'natura', mela: 'natura', fiore: 'natura',
  pesce: 'animali', gatto: 'animali',
};

/** Trasforma la libreria in esercizi "ricalca" e "colora". */
export function libraryExercises() {
  return LIBRARY.flatMap(d => [
    { id: `t-${d.id}`, kind: 'trace', name: d.name, emoji: d.emoji, path: d.path, level: d.level, cat: d.cat },
    ...(d.color ? [{ id: `c-${d.id}`, kind: 'color', name: d.name, emoji: d.emoji, path: d.path, area: d.area, level: d.level, cat: d.cat, suggest: d.suggest }] : []),
  ]);
}
