// Sagome disegnate in un riquadro 100 x 100 (formato "path" SVG).
// Ogni esercizio ha: id unico, nome, emoji, tipo ("trace" = ricalca, "color" = colora),
// percorso, livello (1 facile → 3 difficile) e se fa parte della serie di Halloween.

const P = {
  linea: 'M12 50 L88 50',
  onda: 'M10 50 Q20 25 30 50 T50 50 T70 50 T90 50',
  zigzag: 'M10 65 L26 35 L42 65 L58 35 L74 65 L90 35',
  cerchio: 'M50 15 A35 35 0 1 1 49.9 15 Z',
  quadrato: 'M20 20 L80 20 L80 80 L20 80 Z',
  triangolo: 'M50 15 L86 82 L14 82 Z',
  cuore: 'M50 84 C22 64 8 46 20 28 C30 14 46 18 50 32 C54 18 70 14 80 28 C92 46 78 64 50 84 Z',
  stella: 'M50 16 L59.4 41.1 L86.1 42.3 L65.2 58.9 L72.3 84.7 L50 70 L27.7 84.7 L34.8 58.9 L13.9 42.3 L40.6 41.1 Z',
  casa: 'M20 86 L20 46 L50 16 L80 46 L80 86 Z M42 86 L42 64 L58 64 L58 86',
  nuvola: 'M26 70 C10 70 10 48 26 49 C25 33 46 28 53 41 C60 28 82 32 79 50 C93 50 93 70 78 70 Z',
  mela: 'M50 32 C36 22 16 30 18 54 C20 74 34 88 50 82 C66 88 80 74 82 54 C84 30 64 22 50 32 Z M50 32 C50 24 52 18 56 13',
  pesce: 'M14 50 C28 26 58 24 72 50 C58 76 28 74 14 50 Z M72 50 L90 34 L90 66 Z',
  gatto: 'M24 56 C24 42 27 36 30 33 L26 12 L44 26 C48 25 52 25 56 26 L74 12 L70 33 C73 36 76 42 76 56 C76 72 64 84 50 84 C36 84 24 72 24 56 Z',
  fiore: 'M50 21 A11 11 0 1 1 66.2 32.7 A11 11 0 1 1 60 51.8 A11 11 0 1 1 40 51.8 A11 11 0 1 1 33.8 32.7 A11 11 0 1 1 50 21 Z M50 31 A7 7 0 1 1 49.9 31 Z M50 67 L50 92 M50 82 C58 72 68 72 72 74 C66 82 58 84 50 82',
  // Halloween
  zucca: 'M50 30 C22 26 10 48 16 66 C22 84 40 88 50 83 C60 88 78 84 84 66 C90 48 78 26 50 30 Z M46 30 L47 17 L55 17 L54 30',
  fantasma: 'M28 86 L28 46 C28 16 72 16 72 46 L72 86 L64 78 L57 86 L50 78 L43 86 L36 78 Z',
  luna: 'M62 14 A36 36 0 1 0 62 86 A45 45 0 0 1 62 14 Z',
  pipistrello: 'M50 44 L45 34 L44 44 C38 36 22 32 8 40 C16 46 18 54 16 62 C24 56 32 58 36 66 C40 58 46 58 50 64 C54 58 60 58 64 66 C68 58 76 56 84 62 C82 54 84 46 92 40 C78 32 62 36 56 44 L55 34 Z',
  cappello: 'M12 80 C32 72 68 72 88 80 C68 88 32 88 12 80 Z M30 76 C38 56 46 34 60 14 C60 36 64 56 70 76',
  ragno: 'M50 42 A16 16 0 1 1 49.9 42 Z M50 28 A8 8 0 1 1 49.9 28 Z M50 28 L50 6 M36 52 L22 42 L14 50 M35 60 L18 58 L10 66 M38 67 L26 76 L20 86 M64 52 L78 42 L86 50 M65 60 L82 58 L90 66 M62 67 L74 76 L80 86',
};

export const EXERCISES = [
  // --- Ricalca ---
  { id: 't-linea',     kind: 'trace', name: 'La linea',      emoji: '➖', path: P.linea,      level: 1 },
  { id: 't-onda',      kind: 'trace', name: "L'onda",        emoji: '🌊', path: P.onda,       level: 1 },
  { id: 't-zigzag',    kind: 'trace', name: 'Lo zig-zag',    emoji: '⚡', path: P.zigzag,     level: 1 },
  { id: 't-cerchio',   kind: 'trace', name: 'Il sole',       emoji: '☀️', path: P.cerchio,    level: 1 },
  { id: 't-quadrato',  kind: 'trace', name: 'Il quadrato',   emoji: '🟦', path: P.quadrato,   level: 1 },
  { id: 't-triangolo', kind: 'trace', name: 'Il triangolo',  emoji: '🔺', path: P.triangolo,  level: 2 },
  { id: 't-cuore',     kind: 'trace', name: 'Il cuore',      emoji: '❤️', path: P.cuore,      level: 2 },
  { id: 't-stella',    kind: 'trace', name: 'La stella',     emoji: '⭐', path: P.stella,     level: 2 },
  { id: 't-casa',      kind: 'trace', name: 'La casetta',    emoji: '🏠', path: P.casa,       level: 2 },
  { id: 't-nuvola',    kind: 'trace', name: 'La nuvola',     emoji: '☁️', path: P.nuvola,     level: 2 },
  { id: 't-pesce',     kind: 'trace', name: 'Il pesce',      emoji: '🐟', path: P.pesce,      level: 3 },
  { id: 't-gatto',     kind: 'trace', name: 'Il gatto',      emoji: '🐱', path: P.gatto,      level: 3 },
  { id: 't-fiore',     kind: 'trace', name: 'Il fiore',      emoji: '🌸', path: P.fiore,      level: 3 },
  { id: 'th-zucca',    kind: 'trace', name: 'La zucca',      emoji: '🎃', path: P.zucca,      level: 2, halloween: true },
  { id: 'th-fantasma', kind: 'trace', name: 'Il fantasma',   emoji: '👻', path: P.fantasma,   level: 2, halloween: true },
  { id: 'th-luna',     kind: 'trace', name: 'La luna',       emoji: '🌙', path: P.luna,       level: 2, halloween: true },
  { id: 'th-cappello', kind: 'trace', name: 'Il cappello della strega', emoji: '🧙', path: P.cappello, level: 3, halloween: true },
  { id: 'th-ragno',    kind: 'trace', name: 'Il ragnetto',   emoji: '🕷️', path: P.ragno,      level: 3, halloween: true },
  { id: 'th-pipistrello', kind: 'trace', name: 'Il pipistrello', emoji: '🦇', path: P.pipistrello, level: 3, halloween: true },

  // --- Colora (restando dentro i bordi) ---
  { id: 'c-cerchio',   kind: 'color', name: 'Il sole',       emoji: '☀️', path: P.cerchio,    level: 1, suggest: '#ffd23f' },
  { id: 'c-cuore',     kind: 'color', name: 'Il cuore',      emoji: '❤️', path: P.cuore,      level: 1, suggest: '#ff4d6d' },
  { id: 'c-mela',      kind: 'color', name: 'La mela',       emoji: '🍎', path: P.mela,       level: 1, suggest: '#e63946' },
  { id: 'c-nuvola',    kind: 'color', name: 'La nuvola',     emoji: '☁️', path: P.nuvola,     level: 1, suggest: '#7ec8ff' },
  { id: 'c-casa',      kind: 'color', name: 'La casetta',    emoji: '🏠', path: P.casa,       level: 2, suggest: '#f4a261' },
  { id: 'c-pesce',     kind: 'color', name: 'Il pesce',      emoji: '🐟', path: P.pesce,      level: 2, suggest: '#3a86ff' },
  { id: 'c-stella',    kind: 'color', name: 'La stella',     emoji: '⭐', path: P.stella,     level: 3, suggest: '#ffd23f' },
  { id: 'c-gatto',     kind: 'color', name: 'Il gatto',      emoji: '🐱', path: P.gatto,      level: 3, suggest: '#f77f00' },
  { id: 'ch-zucca',    kind: 'color', name: 'La zucca',      emoji: '🎃', path: P.zucca,      level: 1, suggest: '#ff7b00', halloween: true },
  { id: 'ch-fantasma', kind: 'color', name: 'Il fantasma',   emoji: '👻', path: P.fantasma,   level: 1, suggest: '#c9b6ff', halloween: true },
  { id: 'ch-luna',     kind: 'color', name: 'La luna',       emoji: '🌙', path: P.luna,       level: 2, suggest: '#ffe066', halloween: true },
  { id: 'ch-pipistrello', kind: 'color', name: 'Il pipistrello', emoji: '🦇', path: P.pipistrello, level: 3, suggest: '#6a4c93', halloween: true },
];

export const SHAPE_PATHS = P;
