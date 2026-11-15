# Graph Report - disegno-giulia  (2026-11-15)

## Corpus Check
- 12 files · ~16,447 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 1, .rules 1, .css 1)

## Summary
- 148 nodes · 274 edges · 16 communities
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.86)
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
- renderPick
- Atelier di Giulia — contesto per riprendere il lavoro
- traceLike
- themes.js
- animals.js
- openExercise
- drawGuide
- showResult

## God Nodes (most connected - your core abstractions)
1. `finishDrawing()` - 10 edges
2. `go()` - 8 edges
3. `openExercise()` - 8 edges
4. `showResult()` - 8 edges
5. `openParent()` - 8 edges
6. `activeSeason()` - 7 edges
7. `L'atelier di Giulia` - 7 edges
8. `currentAlbum()` - 6 edges
9. `traceLike()` - 6 edges
10. `speak()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Decisioni prese` --references--> `normalizeProfile()`  [INFERRED]
  CONTESTO.md → js/app.js
- `openParent()` --calls--> `currentAlbum()`  [EXTRACTED]
  js/app.js → js/animals.js
- `renderCollection()` --calls--> `currentAlbum()`  [EXTRACTED]
  js/app.js → js/animals.js
- `strokePoints()` --calls--> `samplePath()`  [EXTRACTED]
  js/app.js → js/scoring.js
- `announceNewAlbum()` --calls--> `currentAlbum()`  [EXTRACTED]
  js/app.js → js/animals.js

## Import Cycles
- None detected.

## Communities (16 total, 0 thin omitted)

### Community 0 - "app.js"
Cohesion: 0.12
Nodes (14): CHILD_SCREENS, COLORS, ctxP, ctxT, cvPaint, cvTop, FAKE_DATE, localKey() (+6 more)

### Community 1 - "letters.js"
Cohesion: 0.50
Nodes (4): ALPHABET, LETTER_EXERCISES, LETTER_MIN_STARS, LEVEL()

### Community 2 - "go"
Cohesion: 0.18
Nodes (17): owned(), activeSeason(), applySeasonTheme(), boot(), EMPTY_PROFILE(), go(), normalizeProfile(), openParent() (+9 more)

### Community 3 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, display, icons, name, orientation, scope, short_name, start_url (+1 more)

### Community 4 - "activeSeason"
Cohesion: 0.21
Nodes (13): currentAlbum(), addFiveMinutes(), announceNewAlbum(), award(), checkLimit(), flushTime(), limit(), pickRandom() (+5 more)

### Community 5 - "finishDrawing"
Cohesion: 0.39
Nodes (8): finishDrawing(), snapshot(), densify(), makeGrid(), samplePath(), scoreColor(), scoreTrace(), starsFor()

### Community 6 - "store.js"
Cohesion: 0.22
Nodes (5): firebaseConfig, SETTINGS, ./firebase-bundle.js?v=20261115, isDemo, store

### Community 7 - "L'atelier di Giulia"
Cohesion: 0.25
Nodes (7): 1. Firebase (circa 10 minuti), 2. GitHub Pages, 3. Sul tablet, Area genitori, File, L'atelier di Giulia, Personalizzare (`js/config.js`)

### Community 8 - "renderPick"
Cohesion: 0.67
Nodes (3): renderPick(), shapeSvg(), starsText()

### Community 9 - "Atelier di Giulia — contesto per riprendere il lavoro"
Cohesion: 0.33
Nodes (5): Atelier di Giulia — contesto per riprendere il lavoro, Decisioni prese, Pubblicazione, Regola di lavoro (chiesta da Mo), Storico

### Community 10 - "traceLike"
Cohesion: 0.33
Nodes (6): brush(), drawStroke(), feedback(), layoutStage(), redrawAll(), traceLike()

### Community 11 - "themes.js"
Cohesion: 0.11
Nodes (17): BASE_CATS, CATEGORIES, LIBRARY, libraryExercises(), EXERCISES, P, SHAPE_PATHS, circle() (+9 more)

### Community 12 - "animals.js"
Cohesion: 0.33
Nodes (5): ALBUM_ITEMS, ALBUMS, ALL_ITEMS, SEASON_ITEMS, SEASONS

### Community 13 - "openExercise"
Cohesion: 0.50
Nodes (5): findEx(), openExercise(), playDemo(), renderPalette(), stopDemo()

### Community 14 - "drawGuide"
Cohesion: 0.50
Nodes (4): drawGuide(), drawLetterGuide(), startPoint(), strokePoints()

### Community 15 - "showResult"
Cohesion: 0.40
Nodes (5): animalCard(), chime(), confetti(), showResult(), itemSvg()

## Knowledge Gaps
- **1 isolated node(s):** `./firebase-bundle.js?v=20261115`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 48 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `normalizeProfile()` connect `go` to `app.js`, `Atelier di Giulia — contesto per riprendere il lavoro`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **What connects `./firebase-bundle.js?v=20261115` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11695906432748537 - nodes in this community are weakly interconnected._
- **Why does `Decisioni prese` connect `Atelier di Giulia — contesto per riprendere il lavoro` to `go`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `themes.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11255411255411256 - nodes in this community are weakly interconnected._