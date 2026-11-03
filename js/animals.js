// Collezionabili.
//
// ALBUM: si completano uno dopo l'altro. L'uovo dà sempre un animaletto dell'album in corso;
// quando l'album è completo si apre il successivo. Finiti tutti, l'uovo dà doppioni (×2, ×3…).
//
// SERIE STAGIONALI: si vincono solo nel loro periodo (date in config.js), con i disegni di quella stagione.
// Una volta vinti restano per sempre nella collezione.
//
// Campi: emoji = animaletto, costume = piccolo emoji sopra (facoltativo),
//        filter = cambio di colore CSS (facoltativo, es. 'hue-rotate(160deg)').
// Gli id non vanno mai cambiati: sono quelli salvati su Firebase.

export const ALBUMS = [
  {
    id: 'animali', name: 'Animaletti', icon: '🐾',
    items: [
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
    ],
  },
  {
    id: 'fattoria', name: 'Fattoria e bosco', icon: '🌻',
    items: [
      { id: 'f-cavallo',    name: 'Cavallino',  emoji: '🐴' },
      { id: 'f-pecora',     name: 'Pecorella',  emoji: '🐑' },
      { id: 'f-capra',      name: 'Capretta',   emoji: '🐐' },
      { id: 'f-gallo',      name: 'Gallo',      emoji: '🐓' },
      { id: 'f-anatra',     name: 'Anatra',     emoji: '🦆' },
      { id: 'f-riccio',     name: 'Riccio',     emoji: '🦔' },
      { id: 'f-cervo',      name: 'Cervo',      emoji: '🦌' },
      { id: 'f-scoiattolo', name: 'Scoiattolo', emoji: '🐿️' },
      { id: 'f-gufo',       name: 'Gufo',       emoji: '🦉' },
      { id: 'f-tasso',      name: 'Tasso',      emoji: '🦡' },
      { id: 'f-lumaca',     name: 'Lumachina',  emoji: '🐌' },
      { id: 'f-coccinella', name: 'Coccinella', emoji: '🐞' },
    ],
  },
  {
    id: 'mare', name: 'Il mare', icon: '🐚',
    items: [
      { id: 'm-balena',      name: 'Balena',           emoji: '🐳' },
      { id: 'm-balenottera', name: 'Balenottera',      emoji: '🐋' },
      { id: 'm-squalo',      name: 'Squalo',           emoji: '🦈' },
      { id: 'm-tropicale',   name: 'Pesce tropicale',  emoji: '🐠' },
      { id: 'm-palla',       name: 'Pesce palla',      emoji: '🐡' },
      { id: 'm-granchio',    name: 'Granchio',         emoji: '🦀' },
      { id: 'm-aragosta',    name: 'Aragosta',         emoji: '🦞' },
      { id: 'm-gambero',     name: 'Gamberetto',       emoji: '🦐' },
      { id: 'm-calamaro',    name: 'Calamaro',         emoji: '🦑' },
      { id: 'm-foca',        name: 'Foca',             emoji: '🦭' },
      { id: 'm-lontra',      name: 'Lontra',           emoji: '🦦' },
      { id: 'm-arcobaleno',  name: 'Pesce arcobaleno', emoji: '🐟', costume: '🌈' },
    ],
  },
  {
    id: 'dinosauri', name: 'Dinosauri', icon: '🦴',
    items: [
      { id: 'd-trex',       name: 'T-rex',                 emoji: '🦖' },
      { id: 'd-collolungo', name: 'Dinosauro collo lungo', emoji: '🦕' },
      { id: 'd-cucciolo',   name: 'Cucciolo di dino',      emoji: '🦖', costume: '🥚' },
      { id: 'd-foglie',     name: 'Dino mangiafoglie',     emoji: '🦕', costume: '🌿' },
      { id: 'd-vulcano',    name: 'Dino del vulcano',      emoji: '🦖', costume: '🌋' },
      { id: 'd-blu',        name: 'Dino blu',              emoji: '🦕', filter: 'hue-rotate(150deg)' },
      { id: 'd-viola',      name: 'Dino viola',            emoji: '🦖', filter: 'hue-rotate(200deg)' },
      { id: 'd-re',         name: 'Re dei dinosauri',      emoji: '🦖', costume: '👑' },
      { id: 'd-notte',      name: 'Dino della notte',      emoji: '🦕', costume: '🌙' },
      { id: 'd-stella',     name: 'Dino stellato',         emoji: '🦖', costume: '⭐' },
      { id: 'd-coccodrillo',name: 'Coccodrillo',           emoji: '🐊' },
      { id: 'd-lucertola',  name: 'Lucertola',             emoji: '🦎' },
    ],
  },
  {
    id: 'magia', name: 'Creature magiche', icon: '🔮',
    items: [
      { id: 'g-drago',     name: 'Drago',               emoji: '🐉' },
      { id: 'g-draghetto', name: 'Draghetto',           emoji: '🐲' },
      { id: 'g-fata',      name: 'Fatina',              emoji: '🧚' },
      { id: 'g-sirena',    name: 'Sirena',              emoji: '🧜‍♀️' },
      { id: 'g-genio',     name: 'Genio della lampada', emoji: '🧞' },
      { id: 'g-unicorno',  name: 'Unicorno arcobaleno', emoji: '🦄', costume: '🌈' },
      { id: 'g-farfalla',  name: 'Farfalla fatata',     emoji: '🦋', costume: '✨' },
      { id: 'g-principe',  name: 'Principe ranocchio',  emoji: '🐸', costume: '👑' },
      { id: 'g-ghiaccio',  name: 'Drago di ghiaccio',   emoji: '🐉', costume: '❄️', filter: 'hue-rotate(170deg)' },
      { id: 'g-cigno',     name: 'Cigno incantato',     emoji: '🦢', costume: '✨' },
      { id: 'g-pavone',    name: 'Pavone magico',       emoji: '🦚' },
      { id: 'g-gatto',     name: 'Gatto mago',          emoji: '🐱', costume: '🪄' },
    ],
  },
];

// Serie stagionali (le date sono in config.js)
export const SEASONS = {
  halloween: {
    name: 'Halloween', box: '🎃', boxName: 'la zucca magica', badge: '🎃',
    opened: '🎃 La zucca magica si è aperta!',
    banner: '🦇 È Halloween! Disegni speciali e animaletti mascherati! 🎃',
    hint: 'Fai i disegni di Halloween per aprire la zucca magica!',
    confetti: ['🎃', '🦇', '👻', '🍬', '⭐'],
    items: [
      { id: 'h-pipistrello', name: 'Pipistrello vampiro', emoji: '🦇', costume: '🧛' },
      { id: 'h-gatto-nero',  name: 'Gatto nero',          emoji: '🐈‍⬛', costume: '🧙' },
      { id: 'h-gufo',        name: 'Gufo della notte',    emoji: '🦉', costume: '🌙' },
      { id: 'h-ragnetto',    name: 'Ragnetto simpatico',  emoji: '🕷️', costume: '🕸️' },
      { id: 'h-lupo',        name: 'Lupetto della luna',  emoji: '🐺', costume: '🌕' },
      { id: 'h-coniglio',    name: 'Coniglio fantasma',   emoji: '🐰', costume: '👻' },
      { id: 'h-orso',        name: 'Orsetto zucca',       emoji: '🐻', costume: '🎃' },
      { id: 'h-rana',        name: 'Rana strega',         emoji: '🐸', costume: '🧙' },
      { id: 'h-volpe',       name: 'Volpe mascherata',    emoji: '🦊', costume: '🎭' },
      { id: 'h-unicorno',    name: 'Unicorno caramella',  emoji: '🦄', costume: '🍬' },
    ],
  },
  natale: {
    name: 'Natale', box: '🎁', boxName: 'il pacco regalo', badge: '🎄',
    opened: '🎁 Il pacco regalo si è aperto!',
    banner: '🎄 È Natale! Disegni speciali e animaletti della neve! ⛄',
    hint: 'Fai i disegni di Natale per aprire il pacco regalo!',
    confetti: ['❄️', '🎄', '⭐', '🎁', '🔔'],
    items: [
      { id: 'n-renna',       name: 'Renna dei regali',        emoji: '🦌', costume: '🔔' },
      { id: 'n-pinguino',    name: 'Pinguino della neve',     emoji: '🐧', costume: '❄️' },
      { id: 'n-orso-polare', name: 'Orso polare con sciarpa', emoji: '🐻‍❄️', costume: '🧣' },
      { id: 'n-gattino',     name: 'Gattino regalo',          emoji: '🐱', costume: '🎁' },
      { id: 'n-cagnolino',   name: "Cagnolino dell'albero",   emoji: '🐶', costume: '🎄' },
      { id: 'n-volpe',       name: 'Volpe della neve',        emoji: '🦊', costume: '⛄' },
      { id: 'n-coniglio',    name: 'Coniglio stella cometa',  emoji: '🐰', costume: '🌟' },
      { id: 'n-criceto',     name: 'Criceto biscotto',        emoji: '🐹', costume: '🍪' },
      { id: 'n-gufo',        name: 'Gufo della candela',      emoji: '🦉', costume: '🕯️' },
      { id: 'n-panda',       name: 'Panda col fiocco',        emoji: '🐼', costume: '🎀' },
    ],
  },
};

// Elenchi comodi
for (const a of ALBUMS) a.items.forEach(i => (i.album = a.id));
for (const [k, s] of Object.entries(SEASONS)) s.items.forEach(i => (i.season = k));

export const ALBUM_ITEMS = ALBUMS.flatMap(a => a.items);
export const SEASON_ITEMS = Object.values(SEASONS).flatMap(s => s.items);
export const ALL_ITEMS = [...ALBUM_ITEMS, ...SEASON_ITEMS];

/** Primo album non ancora completo (null se sono tutti completi). */
export function currentAlbum(collection) {
  return ALBUMS.find(a => a.items.some(i => !collection[i.id])) || null;
}
export const owned = (items, collection) => items.filter(i => collection[i.id]).length;
