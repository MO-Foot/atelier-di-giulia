# L'atelier di Giulia

Webapp per tablet per imparare a disegnare (6 anni): **ricalcare** sagome tratteggiate e **colorare restando dentro i bordi**.
Ogni disegno riceve da 0 a 3 stelle; le stelle fanno schiudere un **uovo** (animaletto normale, 6 stelle) o, nel periodo di Halloween, aprire la **zucca magica** (animaletto mascherato, 5 stelle, solo con i disegni di Halloween).
Limite di **15 minuti al giorno**, salvato su Firebase così vale anche se si ricarica la pagina o si cambia dispositivo.

Funziona subito in **modalità prova** (dati solo sul dispositivo) finché `js/config.js` è vuoto.

## 1. Firebase (circa 10 minuti)

1. [console.firebase.google.com](https://console.firebase.google.com) → crea un progetto (Analytics non serve).
2. **Aggiungi app → Web** (icona `</>`), un nome qualsiasi, *senza* Firebase Hosting. Copia i valori di `firebaseConfig` in `js/config.js`.
3. **Authentication → Inizia → Metodo di accesso → Google → Attiva**.
4. **Firestore Database → Crea database** → modalità produzione, località europea (es. `europe-west6` Zurigo).
5. **Firestore → Regole**: incolla il contenuto di `firestore.rules`, sostituisci `TUA_EMAIL@gmail.com` con la tua email Google e **Pubblica**.

Basta il piano gratuito (Spark). I disegni della galleria sono salvati come immagini compresse direttamente in Firestore: Cloud Storage non è usato perché dal 2026 richiede il piano a pagamento Blaze.

## 2. GitHub Pages

1. Crea un repository (es. `disegno-giulia`) e carica **tutti i file di questa cartella** (anche `js/` e `icons/`): *Add file → Upload files*.
2. **Settings → Pages → Build and deployment**: *Deploy from a branch*, branch `main`, cartella `/ (root)` → Save.
3. Dopo 1–2 minuti l'app è su `https://TUO-UTENTE.github.io/disegno-giulia/`.
4. Torna su Firebase: **Authentication → Impostazioni → Domini autorizzati → Aggiungi dominio** → `TUO-UTENTE.github.io`.

## 3. Sul tablet

- Apri l'indirizzo, premi **Entra con Google** (una volta sola) e poi *Aggiungi a schermata Home*.
- Se dall'icona sulla schermata Home l'accesso Google non si chiude correttamente, usa l'app come normale scheda/segnalibro del browser.
- Su iPad: *Accesso Guidato* (Impostazioni → Accessibilità) blocca il tablet dentro l'app.

## Area genitori

Il pulsante ⚙️ chiede una moltiplicazione (es. 7 × 8). Da lì: tempo usato oggi, collezione, eliminazione disegni, azzeramento, uscita dall'account. Nell'area genitori il tempo non viene conteggiato.

## Personalizzare (`js/config.js`)

| Impostazione | Default | Cosa fa |
|---|---|---|
| `dailyMinutes` | 15 | Minuti al giorno |
| `starsPerEgg` / `starsPerPumpkin` | 6 / 5 | Stelle per vincere un animaletto |
| `halloween` | 15 ottobre – 10 novembre | Periodo dei disegni e animaletti di Halloween |
| `traceTolerance` | 5 | Ricalco: 4 = più severo, 7 = più facile |
| `voice` | true | Istruzioni lette ad alta voce |

Nuove sagome: `js/shapes.js` (percorsi SVG in un riquadro 100×100). Nuovi animaletti: `js/animals.js`.

## File

```
index.html, style.css, manifest.json, icons/
js/app.js          interfaccia, timer, premi
js/scoring.js      punteggio ricalco e colorare
js/shapes.js       sagome
js/animals.js      collezione
js/store.js        Firebase / modalità prova
js/firebase-bundle.js  SDK Firebase 13.1.0 (incluso, nessun CDN)
js/config.js       ← da compilare
firestore.rules    ← da incollare in Firebase
```
