// Animaletti collezionabili.
// Quelli "halloween" si vincono solo durante il periodo di Halloween
// (date in config.js) colorando o ricalcando i disegni di Halloween.
// Una volta vinti restano per sempre nella collezione.

export const ANIMALS = [
  { id: 'cane',      name: 'Cagnolino',   emoji: '🐶' },
  { id: 'gatto',     name: 'Gattino',     emoji: '🐱' },
  { id: 'coniglio',  name: 'Coniglietto', emoji: '🐰' },
  { id: 'criceto',   name: 'Criceto',     emoji: '🐹' },
  { id: 'volpe',     name: 'Volpe',       emoji: '🦊' },
  { id: 'orso',      name: 'Orsetto',     emoji: '🐻' },
  { id: 'panda',     name: 'Panda',       emoji: '🐼' },
  { id: 'koala',     name: 'Koala',       emoji: '🐨' },
  { id: 'tigre',     name: 'Tigre',       emoji: '🐯' },
  { id: 'leone',     name: 'Leone',       emoji: '🦁' },
  { id: 'mucca',     name: 'Mucca',       emoji: '🐮' },
  { id: 'maiale',    name: 'Maialino',    emoji: '🐷' },
  { id: 'rana',      name: 'Ranocchia',   emoji: '🐸' },
  { id: 'scimmia',   name: 'Scimmietta',  emoji: '🐵' },
  { id: 'pulcino',   name: 'Pulcino',     emoji: '🐥' },
  { id: 'pinguino',  name: 'Pinguino',    emoji: '🐧' },
  { id: 'unicorno',  name: 'Unicorno',    emoji: '🦄' },
  { id: 'ape',       name: 'Ape',         emoji: '🐝' },
  { id: 'farfalla',  name: 'Farfalla',    emoji: '🦋' },
  { id: 'tartaruga', name: 'Tartaruga',   emoji: '🐢' },
  { id: 'polpo',     name: 'Polpo',       emoji: '🐙' },
  { id: 'delfino',   name: 'Delfino',     emoji: '🐬' },
  { id: 'giraffa',   name: 'Giraffa',     emoji: '🦒' },
  { id: 'elefante',  name: 'Elefante',    emoji: '🐘' },

  // --- Speciali di Halloween (costume = piccolo emoji sopra l'animale) ---
  { id: 'h-pipistrello', name: 'Pipistrello vampiro', emoji: '🦇', costume: '🧛', halloween: true },
  { id: 'h-gatto-nero',  name: 'Gatto nero',          emoji: '🐈‍⬛', costume: '🧙', halloween: true },
  { id: 'h-gufo',        name: 'Gufo della notte',    emoji: '🦉', costume: '🌙', halloween: true },
  { id: 'h-ragnetto',    name: 'Ragnetto simpatico',  emoji: '🕷️', costume: '🕸️', halloween: true },
  { id: 'h-lupo',        name: 'Lupetto della luna',  emoji: '🐺', costume: '🌕', halloween: true },
  { id: 'h-coniglio',    name: 'Coniglio fantasma',   emoji: '🐰', costume: '👻', halloween: true },
  { id: 'h-orso',        name: 'Orsetto zucca',       emoji: '🐻', costume: '🎃', halloween: true },
  { id: 'h-rana',        name: 'Rana strega',         emoji: '🐸', costume: '🧙', halloween: true },
  { id: 'h-volpe',       name: 'Volpe mascherata',    emoji: '🦊', costume: '🎭', halloween: true },
  { id: 'h-unicorno',    name: 'Unicorno caramella',  emoji: '🦄', costume: '🍬', halloween: true },
];

export const REGULAR = ANIMALS.filter(a => !a.halloween);
export const SPECIAL = ANIMALS.filter(a => a.halloween);
export const byId = id => ANIMALS.find(a => a.id === id);
