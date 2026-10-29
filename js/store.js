// Salvataggio dati: Firebase (Firestore + login Google) oppure, se la configurazione
// è vuota, "modalità prova" con salvataggio solo nel browser (localStorage).
//
// Struttura in Firestore:
//   users/{uid}                    → { collection: {idAnimale: quanti}, eggStars, pumpkinStars, best: {idEsercizio: stelle} }
//   users/{uid}/days/{AAAA-MM-GG}  → { seconds }            (tempo usato quel giorno)
//   users/{uid}/drawings/{id}      → { img, exerciseId, kind, stars, createdAt }   (galleria)

import { firebaseConfig } from './config.js';

const EMPTY_PROFILE = () => ({ collection: {}, eggStars: 0, pumpkinStars: 0, best: {} });

export const isDemo = !firebaseConfig.apiKey;

/* ---------------- Modalità prova (solo questo dispositivo) ---------------- */
function demoStore() {
  const K = 'disegno-giulia-demo';
  const read = () => { try { return JSON.parse(localStorage.getItem(K)) || {}; } catch { return {}; } };
  const write = v => { try { localStorage.setItem(K, JSON.stringify(v)); } catch (e) { console.warn(e); } };
  let userCb = () => {};
  return {
    mode: 'demo',
    async init() {},
    onUser(cb) { userCb = cb; const s = read(); cb(s.signedIn ? { uid: 'demo', displayName: 'Prova', email: 'modalità prova' } : null); },
    async signIn() { const s = read(); s.signedIn = true; write(s); userCb({ uid: 'demo', displayName: 'Prova', email: 'modalità prova' }); },
    async signOut() { const s = read(); s.signedIn = false; write(s); userCb(null); },
    async loadProfile() { return { ...EMPTY_PROFILE(), ...(read().profile || {}) }; },
    async saveProfile(p) { const s = read(); s.profile = p; write(s); },
    async getSeconds(day) { return (read().days || {})[day] || 0; },
    async addSeconds(day, n) { const s = read(); s.days = s.days || {}; s.days[day] = (s.days[day] || 0) + n; write(s); },
    async addDrawing(d) {
      const s = read(); s.drawings = s.drawings || [];
      s.drawings.unshift({ id: String(Date.now()), ...d, createdAt: Date.now() });
      s.drawings = s.drawings.slice(0, 40); // il browser ha poco spazio
      write(s);
    },
    async listDrawings(max = 60) { return (read().drawings || []).slice(0, max); },
    async deleteDrawing(id) { const s = read(); s.drawings = (s.drawings || []).filter(x => x.id !== id); write(s); },
    async resetAll() { const s = read(); delete s.profile; delete s.drawings; delete s.days; write(s); },
  };
}

/* ---------------- Firebase ---------------- */
function firebaseStore() {
  let fb, auth, db, user = null;
  const userDoc = () => fb.doc(db, 'users', user.uid);
  return {
    mode: 'firebase',
    async init() {
      fb = await import('./firebase-bundle.js');
      const app = fb.initializeApp(firebaseConfig);
      auth = fb.getAuth(app);
      await fb.setPersistence(auth, fb.browserLocalPersistence);
      db = fb.initializeFirestore(app, {
        localCache: fb.persistentLocalCache({ tabManager: fb.persistentMultipleTabManager() }),
      });
      try { await fb.getRedirectResult(auth); } catch (e) { console.warn('redirect', e); }
    },
    onUser(cb) { fb.onAuthStateChanged(auth, u => { user = u; cb(u); }); },
    async signIn() {
      const provider = new fb.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      try { await fb.signInWithPopup(auth, provider); }
      catch (e) {
        if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment'].includes(e.code))
          await fb.signInWithRedirect(auth, provider);
        else throw e;
      }
    },
    async signOut() { await fb.signOut(auth); },
    async loadProfile() {
      const snap = await fb.getDoc(userDoc());
      return { ...EMPTY_PROFILE(), ...(snap.exists() ? snap.data() : {}) };
    },
    async saveProfile(p) {
      await fb.setDoc(userDoc(), { ...p, updatedAt: fb.serverTimestamp() });
    },
    async getSeconds(day) {
      const snap = await fb.getDoc(fb.doc(db, 'users', user.uid, 'days', day));
      return snap.exists() ? snap.data().seconds || 0 : 0;
    },
    async addSeconds(day, n) {
      await fb.setDoc(fb.doc(db, 'users', user.uid, 'days', day), { seconds: fb.increment(n) }, { merge: true });
    },
    async addDrawing(d) {
      await fb.addDoc(fb.collection(db, 'users', user.uid, 'drawings'), { ...d, createdAt: Date.now() });
    },
    async listDrawings(max = 60) {
      const q = fb.query(fb.collection(db, 'users', user.uid, 'drawings'), fb.orderBy('createdAt', 'desc'), fb.limit(max));
      const res = await fb.getDocs(q);
      return res.docs.map(x => ({ id: x.id, ...x.data() }));
    },
    async deleteDrawing(id) { await fb.deleteDoc(fb.doc(db, 'users', user.uid, 'drawings', id)); },
    async resetAll() { await fb.setDoc(userDoc(), { ...EMPTY_PROFILE(), updatedAt: fb.serverTimestamp() }); },
  };
}

export const store = isDemo ? demoStore() : firebaseStore();
