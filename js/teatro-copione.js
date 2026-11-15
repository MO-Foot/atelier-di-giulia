// Recita "Sotto l'albero c'è posto per due" — Giulia è ADA.
// Trascritto dalle foto del copione mandate da Mo (pagine 6, 10, 13, 14, 15): solo i pezzi dove parla Ada,
// con le battute degli altri che servono da "attacco". N = indicazioni di scena (lette dal narratore).

export const TITLE = "Sotto l'albero c'è posto per due";
export const ROLE = 'ADA';

// Personaggi: emoji, voce (f = femminile, m = maschile se disponibile), tono e velocità
export const CAST = {
  ADA:      { name: 'Ada',       emoji: '👧', voice: 'f', pitch: 1.25, rate: 0.95 },
  LEO:      { name: 'Leo',       emoji: '👦', voice: 'f', pitch: 1.55, rate: 1.0 },
  TEDDY:    { name: 'Teddy',     emoji: '🧸', voice: 'm', pitch: 0.8,  rate: 0.9 },
  ASTRO:    { name: 'Astro',     emoji: '🤖', voice: 'm', pitch: 1.05, rate: 0.85 },
  NINA:     { name: 'Nina',      emoji: '🪆', voice: 'f', pitch: 1.15, rate: 1.0 },
  CAPITANO: { name: 'Capitano',  emoji: '💂', voice: 'm', pitch: 0.65, rate: 0.95 },
  DINO:     { name: 'Dino',      emoji: '🦕', voice: 'm', pitch: 0.75, rate: 0.8 },
  MOLLA:    { name: 'Molla',     emoji: '🌀', voice: 'm', pitch: 1.45, rate: 1.2 },
  VERA:     { name: 'Vera',      emoji: '👗', voice: 'f', pitch: 1.0,  rate: 0.9 },
  PIUMA:    { name: 'Piuma',     emoji: '🪶', voice: 'm', pitch: 1.2,  rate: 0.95 },
  ZIP:      { name: 'Mago Zip',  emoji: '🎩', voice: 'm', pitch: 0.9,  rate: 1.1 },
  RULLO:    { name: 'Rullo',     emoji: '🚗', voice: 'm', pitch: 1.1,  rate: 1.15 },
  BRICIOLA: { name: 'Briciola',  emoji: '🐶', voice: 'm', pitch: 1.3,  rate: 1.05 },
  N:        { name: 'Narratore', emoji: '📖', voice: 'f', pitch: 1.0,  rate: 0.95 },
};

export const MOMENTS = [
  {
    id: 'scena3', title: 'Scena 3 — Una scatola di troppo', icon: '📦',
    lines: [
      ['N', 'Nella sala della raccolta. Ada controlla un elenco. Leo arriva.'],
      ['ADA', 'Ciao, Leo! Questa è la tua scatola?'],
      ['LEO', 'Sì. I giochi sono tutti interi. Credo. Uno forse ha perso una ruota, ma potrebbe essere una moto.'],
      ['ADA', 'Li controllerò. Li portiamo alle famiglie domani mattina. Quelli già pronti sono sul carrello; questi li guardiamo prima di chiudere.'],
      ['LEO', 'Se trovo altri giochi, posso tornare?'],
      ['ADA', "Certo. Prendi il sacco blu vicino alla porta. Io intanto cerco le etichette nell'altra stanza."],
      ['LEO', 'Va bene. Buona vigilia!'],
      ['N', 'Leo esce verso la cameretta. Ada esce dalla parte opposta.'],
    ],
  },
  {
    id: 'scena5', title: 'Scena 5 — Nuovi vecchi amici', icon: '🎒',
    lines: [
      ['N', 'Ada entra e riceve il sacco da Leo.'],
      ['LEO', 'Ada, dentro ci sono anche dei giochi che devo controllare. Mi aspetti? Chiedo alla mamma quali avevamo scelto, così sono sicuro.'],
      ['ADA', 'Certo. Metto il sacco tra le cose da controllare. Nessuno lo porta via. Torna prima che chiudiamo.'],
      ['LEO', 'Grazie! Ho portato anche una confezione.'],
      ['N', 'Leo appoggia la confezione ed esce. Ada sistema il cartello «Da controllare», poi esce con la cartellina.'],
    ],
  },
  {
    id: 'calzino', title: 'Il calzino', icon: '🧦',
    lines: [
      ['ASTRO', 'Usa il calzino. Ada lo vedrà e si fermerà a raccoglierlo.'],
      ['ZIP', 'Un trucco con un obiettivo raggiungibile. Non ci avevo mai pensato.'],
      ['CAPITANO', 'Ada in avvicinamento!'],
      ['BRICIOLA', 'È lei. Ho visto la sciarpa. Fermi!'],
      ['N', 'Tutti si immobilizzano. Ada entra, vede il calzino e si ferma.'],
      ['ADA', 'Un calzino? Non raccogliamo vestiti qui. Da dove sei saltato fuori? Vado a metterti nella scatola giusta.'],
      ['N', 'Lo raccoglie ed esce.'],
      ['ZIP', 'Ha funzionato! Non so se ridere o cambiare mestiere!'],
    ],
  },
  {
    id: 'cartoncini', title: 'I cartoncini', icon: '🎫',
    lines: [
      ['LEO', 'Ma mostri gentili. E stasera tutti nella foto. Nessuno dietro i mandarini.'],
      ['ADA', 'Vieni, chiediamo i cartoncini per i biglietti.'],
      ['N', 'Leo e Ada escono. I giocattoli aspettano, poi si animano.'],
      ['VERA', 'Nessuno dietro i mandarini. Finalmente una decisione sensata.'],
    ],
  },
  {
    id: 'scena7', title: "Scena 7 — Due posti vicino all'albero", icon: '🎄',
    lines: [
      ['N', 'Ada entra con Leo.'],
      ['LEO', 'Eccomi! La mamma dice che avevamo scelto soltanto la scatola piccola. Ho portato quella grande per sbaglio.'],
      ['ADA', "Infatti c'è qualcosa da controllare. Guarda qui."],
      ['LEO', 'Teddy! Astro! Ma come siete arrivati? E la stella! Vi ho messi io nella scatola? Non mi ricordo…'],
      ['ADA', 'Meno male che abbiamo guardato prima di far partire i pacchi. Questi li riporti a casa.'],
      ['LEO', 'Ci sono anche Nina e gli altri nel sacco! Ho proprio fatto confusione.'],
      ['ADA', 'Capita quando si fanno troppe cose insieme. Torniamo a casa e ricontrolliamo con calma. Ti accompagno: questa scatola è molto grande.'],
      ['N', 'Leo osserva Piuma, Zip e Rullo.'],
      ['LEO', 'E loro?'],
      ['ADA', 'Loro erano già qui. Aspettano di essere regalati domani.'],
      ['LEO', 'Possono venire anche loro stasera? Voglio preparargli dei biglietti. Così chi li riceve sa come si chiamano. Domani li riportiamo, promesso.'],
      ['ADA', 'Va bene, con il permesso dei tuoi. Passo a ritirarli alle nove. Ricordiamoci di scrivere i nomi sulle etichette, non sui giocattoli.'],
      ['LEO', 'Sì! Questo sembra un mago. Lo chiamerei Zip.'],
      ['N', 'Zip resta immobile, ma gli occhi si allargano.'],
      ['ADA', "C'è proprio scritto Zip sotto il cappello."],
      ['LEO', 'Ah. E io che pensavo di avere avuto un\'idea bellissima.'],
    ],
  },
];

// id stabile per ogni battuta di Ada (es. "scena7-3"), usato per salvare i progressi
MOMENTS.forEach(m => {
  let k = 0;
  m.lines = m.lines.map(([who, text]) => ({ who, text, id: who === ROLE ? `${m.id}-${++k}` : null }));
});
export const ADA_LINES = MOMENTS.flatMap(m => m.lines.filter(l => l.id));
