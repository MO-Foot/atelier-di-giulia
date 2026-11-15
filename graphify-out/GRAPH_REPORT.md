# Graph Report - disegno-giulia  (2026-11-15)

## Corpus Check
- 14 files · ~20,154 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 1, .rules 1, .css 1)

## Summary
- 189 nodes · 377 edges · 8 communities
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- app.js
- go
- manifest.json
- finishDrawing
- store.js
- L'atelier di Giulia
- teatro.js
- themes.js

## God Nodes (most connected - your core abstractions)
1. `finishDrawing()` - 10 edges
2. `stopAll()` - 10 edges
3. `go()` - 9 edges
4. `openExercise()` - 8 edges
5. `showResult()` - 8 edges
6. `openParent()` - 8 edges
7. `say()` - 8 edges
8. `setSpeaker()` - 8 edges
9. `initTheater()` - 8 edges
10. `activeSeason()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Decisioni prese` --references--> `normalizeProfile()`  [INFERRED]
  CONTESTO.md → js/app.js
- `Decisioni prese` --references--> `itemSvg()`  [INFERRED]
  CONTESTO.md → js/themes.js
- `openParent()` --calls--> `currentAlbum()`  [EXTRACTED]
  js/app.js → js/animals.js
- `renderCollection()` --calls--> `currentAlbum()`  [EXTRACTED]
  js/app.js → js/animals.js
- `showResult()` --calls--> `itemSvg()`  [EXTRACTED]
  js/app.js → js/themes.js

## Import Cycles
- None detected.

## Communities (8 total, 0 thin omitted)

### Community 0 - "app.js"
Cohesion: 0.07
Nodes (38): ALBUM_ITEMS, ALBUMS, ALL_ITEMS, SEASON_ITEMS, SEASONS, brush(), CHILD_SCREENS, COLORS (+30 more)

### Community 2 - "go"
Cohesion: 0.08
Nodes (34): Atelier di Giulia — contesto per riprendere il lavoro, Decisioni prese, Pubblicazione, Regola di lavoro (chiesta da Mo), Storico, Teatro (recita di Giulia), owned(), activeSeason() (+26 more)

### Community 3 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, display, icons, name, orientation, scope, short_name, start_url (+1 more)

### Community 4 - "finishDrawing"
Cohesion: 0.16
Nodes (19): currentAlbum(), announceNewAlbum(), award(), chime(), confetti(), finishDrawing(), pickRandom(), sayInstruction() (+11 more)

### Community 6 - "store.js"
Cohesion: 0.22
Nodes (5): firebaseConfig, SETTINGS, ./firebase-bundle.js?v=20261115c, isDemo, store

### Community 7 - "L'atelier di Giulia"
Cohesion: 0.25
Nodes (7): 1. Firebase (circa 10 minuti), 2. GitHub Pages, 3. Sul tablet, Area genitori, File, L'atelier di Giulia, Personalizzare (`js/config.js`)

### Community 8 - "teatro.js"
Cohesion: 0.13
Nodes (36): addSuccess(), alive, canListen, celebrate(), ADA_LINES, CAST, MOMENTS, ROLE (+28 more)

### Community 11 - "themes.js"
Cohesion: 0.11
Nodes (17): BASE_CATS, CATEGORIES, LIBRARY, libraryExercises(), EXERCISES, P, SHAPE_PATHS, circle() (+9 more)

## Knowledge Gaps
- **1 isolated node(s):** `./firebase-bundle.js?v=20261115c`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 55 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `itemSvg()` connect `go` to `app.js`, `themes.js`, `finishDrawing`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `./firebase-bundle.js?v=20261115c` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07171717171717172 - nodes in this community are weakly interconnected._
- **Should `go` be split into smaller, more focused modules?**
  _Cohesion score 0.08067226890756303 - nodes in this community are weakly interconnected._
- **Should `teatro.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12685560053981107 - nodes in this community are weakly interconnected._
- **Should `themes.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11255411255411256 - nodes in this community are weakly interconnected._