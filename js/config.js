// ==========================================================
//  CONFIGURAZIONE — l'unico file da modificare
// ==========================================================

// 1) Incolla qui i dati del tuo progetto Firebase
//    (Console Firebase → Impostazioni progetto → Le tue app → App web → "Configurazione").
//    Finché apiKey è vuota l'app funziona in "modalità prova": salva tutto solo su questo dispositivo.
export const firebaseConfig = {
  apiKey: 'AIzaSyB2pP0hFMM3eSblUAt-5EXTIIPs9b1If2g',
  authDomain: 'atelier-di-giulia.firebaseapp.com',
  projectId: 'atelier-di-giulia',
  storageBucket: 'atelier-di-giulia.firebasestorage.app',
  messagingSenderId: '464278404371',
  appId: '1:464278404371:web:d0243d2a0a04dba7572ee6',
};

// 2) Impostazioni dell'app
export const SETTINGS = {
  childName: 'Giulia',
  dailyMinutes: 15,          // minuti di gioco al giorno
  warningSeconds: 60,        // avviso "ancora un minuto"
  starsPerEgg: 8,            // stelle per far schiudere un uovo (animaletto dell'album in corso)
  // Serie stagionali: periodo (mese-giorno, ogni anno) e stelle per aprire la zucca / il pacco regalo
  seasons: {
    halloween: { from: '10-15', to: '11-10', stars: 5 },
    natale:    { from: '12-01', to: '01-06', stars: 6 },
  },
  traceTolerance: 5,         // ricalco: quanto si può uscire dalla linea (4 = più difficile, 7 = più facile)
  voice: true,               // istruzioni lette ad alta voce
};
