# Atelier di Giulia — contesto per riprendere il lavoro

Leggere questo file e `graphify-out/GRAPH_REPORT.md` all'inizio di ogni sessione, invece di ricostruire tutta la chat.

## Regola di lavoro (chiesta da Mo)
- Dopo **ogni** modifica al codice: `graphify update .` nella cartella del progetto (aggiorna `graphify-out/`), poi aggiornare questo file se è cambiata una decisione.
- Per orientarsi nel codice: `graphify explain "<funzione>"`, `graphify query "<domanda>"`, `graphify affected "<funzione>"`, `graphify god-nodes`.
- Se Graphify non è installato (sessione nuova): `pip install --break-system-packages graphifyy && graphify install --platform claude`.
- `.graphifyignore` esclude `js/firebase-bundle.js` (SDK minificato) e `icons/`.

## Pubblicazione
- Codice: GitHub `MO-Foot/atelier-di-giulia` (pubblico), GitHub Pages da `main` / root → https://mo-foot.github.io/atelier-di-giulia/
- Firebase: progetto `atelier-di-giulia`, login Google, Firestore (regole in `firestore.rules`, accesso solo all'email di Mo). Dominio `mo-foot.github.io` autorizzato.
- Dal 15.11.2026 Claude pubblica direttamente: clone in `/home/claude/atelier-di-giulia`, si copiano i file e si fa commit + push su `main` (GitHub Pages si aggiorna in 1–2 min). Prima di allora Mo caricava a mano: l'ultima versione caricata era quella del 3.11 ore 17:02 (lettere, +5 min e libreria non erano mai andati online).

## Decisioni prese
- Uso: tablet, dito (niente pennino), bambina di 6 anni. Voce in italiano.
- Esercizi: ricalco con punteggio + colorare dentro i bordi. 0–3 stelle (`js/scoring.js`). Tolleranza ricalco `traceTolerance: 5`.
- Ricalco: penalità per scarabocchi se la linea è > 6× la sagoma (misurata a passi di 4 unità, minimo 100 unità). Testato: ricalchi realistici = 3 stelle su tutte le sagome, scarabocchi = 0.
- Timer: 15 min al giorno, salvato in Firestore `users/{uid}/days/{AAAA-MM-GG}` (`seconds`, `bonus`) + localStorage; area genitori (moltiplicazione) non conta tempo. Pulsante **+5 minuti oggi** nell'area genitori (campo `bonus`, vale solo per quel giorno). La finestra della moltiplicazione sta sopra la schermata "tempo finito" (z-index 45).
- Galleria: immagini JPEG compresse dentro Firestore, **non** Cloud Storage (dal 3.2.2026 Storage richiede il piano Blaze).
- Premi: uovo = **8 stelle**, dà un animaletto dell'album in corso. Album in sequenza: Animaletti (24) → Fattoria e bosco → Il mare → Dinosauri → Creature magiche (12 ciascuno). Finiti tutti: doppioni.
- Stagioni (`SETTINGS.seasons`): Halloween 15.10–10.11, zucca 5 stelle, 10 animaletti; Natale 1.12–6.1, pacco regalo 6 stelle, 10 animaletti + 7 sagome ricalco e 5 da colorare.
- `?data=AAAA-MM-GG` nell'URL simula la data solo per le stagioni.
- Gli `id` dei collezionabili non vanno mai cambiati (sono salvati su Firebase). `normalizeProfile()` converte il vecchio `pumpkinStars` in `seasonStars.halloween`.
- Lettere (`js/letters.js`): 26 lettere (con J K W X Y), maiuscolo e minuscolo in stampatello, tratti in ordine con numeri, frecce e animazione 👀 all'apertura. Righe quaderno a 20/48/80/96. Parola + emoji per lettera ("A come Ape"). Album dell'alfabeto in `profile.letters`: una lettera entra quando maiuscola e minuscola hanno ≥2 stelle. Le lettere NON danno stelle all'uovo. Esercizi `L-<lettera>-up` / `L-<lettera>-lo`. L'ordine dei tratti è mostrato ma non valutato.
- Libreria disegni (`js/library.js`): 33 disegni in categorie (Forme, Animali, Casa e giochi, Natura, Mezzi), ognuno in ricalca e (se chiuso) in colora; campo `area` = parte da colorare se diversa dal disegno. I disegni di base hanno la categoria da `BASE_CATS`. Nella scelta esercizi ci sono chip di categoria (`state.cat`, si azzera passando tra Ricalca e Colora).
- Personaggi protetti (Pokémon, Winx, Toy Story): Mo li ha chiesti per uso privato; non si disegnano né si nominano. Al loro posto due serie originali in `js/themes.js`: **Spiritelli degli elementi** (8: Fiammella, Goccina, Fogliolina, Saetta, Sassolino, Nuvolino, Cubetto, Stellina — oggetti con faccina, nessun tratto da Pokémon) e **Fatine** (8, fatina generica con simbolo diverso sulla bacchetta). Ogni personaggio ha disegno ricalca+colora (chip ✨/🧚); il personaggio si vince facendo il SUO disegno con ≥2 stelle; se già posseduto, il disegno dà stelle all'uovo. Le carte dell'album mostrano il disegno colorato (`itemSvg`).
- Emoji: solo fino a Emoji 13 per compatibilità tablet.
- Cache: tutti i file JS/CSS sono richiamati con `?v=AAAAMMGG` (index.html, import in app.js e store.js). **A ogni modifica cambiare il numero di versione ovunque**, altrimenti il tablet può mescolare file vecchi e nuovi.
- `$()` in app.js non restituisce mai null (elemento finto + avviso in console). Se l'app non parte entro 12 s o va in errore all'avvio, index.html mostra la schermata "L'app si sta aggiornando" con pulsante Ricarica.

## Teatro (recita di Giulia)
- Recita scolastica "Sotto l'albero c'è posto per due"; Giulia è **Ada** e dice tutte le battute evidenziate (12, pagine 6, 10, 13, 14, 15: Mo conferma che non ce ne sono altre). Testo trascritto dalle foto in `js/teatro-copione.js` (con le battute degli altri che fanno da attacco e le indicazioni di scena lette dal narratore).
- `js/teatro.js`: modalità **Ascolta** (tutta la scena con voci diverse), **A pezzi** (Ada dice un pezzo, Giulia ripete, poi tutta), **Recita** (attacco degli altri → "Tocca a te!" → microfono → valutazione). Riconoscimento: `webkitSpeechRecognition` di Safari (serve Siri attivo), avviato dentro il tocco sul 🎤; giusta se ≥70% delle parole in ordine; il genitore può sempre premere ✅/🔁/⏭️; "senza microfono" per saltare il riconoscimento.
- Voci: quelle italiane del tablet (sull'iPad di solito più di una) + tono/velocità diversi per personaggio; pulsante 🐢 per voci più lente. Opzione futura: voci registrate dalla famiglia.
- 3 prove riuscite = battuta imparata = biglietto 🎟️ (`profile.theater`). Il teatro NON consuma i 15 minuti ed è raggiungibile anche dalla schermata "tempo finito".
- Personaggi mostrati con emoji (nessuna immagine di Toy Story).

## Storico
- 2026-10-29: prima versione online.
- 2026-11-02: Giulia ha completato i 24 animaletti → aggiunti 4 album, serie di Natale, uovo a 8 stelle, penalità scarabocchi.
- 2026-11-03: introdotto Graphify per il grafo del progetto.
- 2026-11-03: dopo l'upload delle 17:02 l'app non era cliccabile. Il codice su GitHub era corretto (testato); causa più probabile: tablet con index.html e app.js di versioni diverse dalla cache (riprodotto: errore "Cannot set properties of null"). Aggiunti versioni `?v=20261103`, `$()` sicuro e schermata Ricarica.
- 2026-11-05: lettere dell'alfabeto + album dell'alfabeto, pulsante +5 minuti, corretta finestra genitori nascosta sotto "tempo finito". Versione `?v=20261105`.
- 2026-11-15: libreria di 33 nuovi disegni con categorie (fuori stagione: ricalca da 13 a 46, colora da 8 a 37). Versione `?v=20261115`.
- 2026-11-15: Spiritelli e Fatine (serie originali con album) + prima pubblicazione automatica su GitHub.
- 2026-11-15: Teatro per le prove di Ada. Versione `?v=20261115b`.
