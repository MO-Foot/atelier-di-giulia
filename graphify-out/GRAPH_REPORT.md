# Graph Report - disegno-giulia  (2026-11-15)

## Corpus Check
- 14 files · ~19,807 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 1, .rules 1, .css 1)

## Summary
- 187 nodes · 370 edges · 15 communities
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- app.js
- letters.js
- go
- manifest.json
- activeSeason
- finishDrawing
- store.js
- L'atelier di Giulia
- teatro.js
- checkLimit
- openExercise
- themes.js
- animals.js
- startDay
- activeSeason

## God Nodes (most connected - your core abstractions)
1. `finishDrawing()` - 10 edges
2. `go()` - 9 edges
3. `stopAll()` - 9 edges
4. `openExercise()` - 8 edges
5. `showResult()` - 8 edges
6. `openParent()` - 8 edges
7. `setSpeaker()` - 8 edges
8. `activeSeason()` - 7 edges
9. `say()` - 7 edges
10. `playRecite()` - 7 edges

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

## Communities (15 total, 0 thin omitted)

### Community 0 - "app.js"
Cohesion: 0.12
Nodes (14): CHILD_SCREENS, COLORS, ctxP, ctxT, cvPaint, cvTop, FAKE_DATE, renderPick() (+6 more)

### Community 1 - "letters.js"
Cohesion: 0.50
Nodes (4): ALPHABET, LETTER_EXERCISES, LETTER_MIN_STARS, LEVEL()

### Community 2 - "go"
Cohesion: 0.13
Nodes (19): Atelier di Giulia — contesto per riprendere il lavoro, Decisioni prese, In sospeso, Pubblicazione, Regola di lavoro (chiesta da Mo), Storico, owned(), animalCard() (+11 more)

### Community 3 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, display, icons, name, orientation, scope, short_name, start_url (+1 more)

### Community 4 - "activeSeason"
Cohesion: 0.24
Nodes (10): currentAlbum(), announceNewAlbum(), award(), chime(), confetti(), pickRandom(), sayInstruction(), showResult() (+2 more)

### Community 5 - "finishDrawing"
Cohesion: 0.39
Nodes (8): finishDrawing(), snapshot(), densify(), makeGrid(), samplePath(), scoreColor(), scoreTrace(), starsFor()

### Community 6 - "store.js"
Cohesion: 0.22
Nodes (5): firebaseConfig, SETTINGS, ./firebase-bundle.js?v=20261115b, isDemo, store

### Community 7 - "L'atelier di Giulia"
Cohesion: 0.25
Nodes (7): 1. Firebase (circa 10 minuti), 2. GitHub Pages, 3. Sul tablet, Area genitori, File, L'atelier di Giulia, Personalizzare (`js/config.js`)

### Community 8 - "teatro.js"
Cohesion: 0.13
Nodes (34): addSuccess(), canListen, celebrate(), ADA_LINES, CAST, MOMENTS, ROLE, TITLE (+26 more)

### Community 9 - "checkLimit"
Cohesion: 0.47
Nodes (6): addFiveMinutes(), checkLimit(), flushTime(), limit(), toast(), updateTimeUI()

### Community 10 - "openExercise"
Cohesion: 0.16
Nodes (15): brush(), drawGuide(), drawLetterGuide(), drawStroke(), feedback(), findEx(), layoutStage(), openExercise() (+7 more)

### Community 11 - "themes.js"
Cohesion: 0.11
Nodes (17): BASE_CATS, CATEGORIES, LIBRARY, libraryExercises(), EXERCISES, P, SHAPE_PATHS, circle() (+9 more)

### Community 12 - "animals.js"
Cohesion: 0.33
Nodes (5): ALBUM_ITEMS, ALBUMS, ALL_ITEMS, SEASON_ITEMS, SEASONS

### Community 13 - "startDay"
Cohesion: 0.33
Nodes (6): localKey(), localUsed(), pad(), setLocalUsed(), startDay(), today()

### Community 14 - "activeSeason"
Cohesion: 0.67
Nodes (4): activeSeason(), applySeasonTheme(), renderHome(), renderMeters()

## Knowledge Gaps
- **1 isolated node(s):** `./firebase-bundle.js?v=20261115b`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 54 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `itemSvg()` connect `go` to `app.js`, `themes.js`, `activeSeason`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `./firebase-bundle.js?v=20261115b` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11695906432748537 - nodes in this community are weakly interconnected._
- **Should `go` be split into smaller, more focused modules?**
  _Cohesion score 0.12631578947368421 - nodes in this community are weakly interconnected._
- **Should `teatro.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13063063063063063 - nodes in this community are weakly interconnected._
- **Should `themes.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11255411255411256 - nodes in this community are weakly interconnected._