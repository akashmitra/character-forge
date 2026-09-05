# D&D Character Forge — Project Plan

**Scope:** Level 1 character creation, 2024 Player's Handbook rules, deep and complete on core content.
**Stack:** React + Vite, PWA (installable, offline).
**Storage:** On-device only — IndexedDB for character data, no backend, no cloud sync.
**Out of scope for v1:** leveling past 1, multiclassing, subclasses beyond what's chosen at level 1, full spell list beyond cantrips/1st level.

---

## Phase 0 — Architecture & Data Schema

Before any UI work, lock the shapes everything else builds on. Getting this wrong costs the most later.

**Deliverables**
- Repo scaffolded with Vite + React + `vite-plugin-pwa`.
- Folder structure: `/src/data` (content JSON), `/src/features` (creation flow), `/src/state` (app state), `/src/storage` (IndexedDB layer), `/public/portraits` (bundled art).
- JSON schema defined for each content type (class, species, background, feat, skill, equipment item), with a mandatory `phbPage` field on every entry.
- JSON schema defined for `portraits.json` (the image config file).
- Decision recorded: images bundled locally vs referenced by URL, and whether portraits are keyed by species/class/background or by saved character.

**Exit criteria:** empty React app running locally, PWA plugin configured (even with a blank manifest), one sample JSON file per content type validated against its schema.

---

## Phase 1 — Content Data Layer

The actual D&D content, structured as data rather than hardcoded into components — this is what makes "deep and complete" maintainable instead of a wall of if-statements.

**Deliverables**
- `classes.json` — all 12 classes: hit die, saves, skill choices, armor/weapon proficiencies, starting equipment options, level-1 class features, each with a `phbPage`.
- `species.json` — all 10 species: size, speed, full trait text, sub-choices (lineages, ancestries, legacies), `phbPage` per trait.
- `backgrounds.json` — all 16 backgrounds: ability score triads, Origin Feat, skills, tool proficiency, starting equipment package, `phbPage`.
- `feats.json` — the 10 Origin Feats in full mechanical detail, `phbPage` each.
- `equipment.json` — weapons, armor, adventuring gear, and packs with cost/weight, `phbPage`.
- `spells-cantrips-l1.json` — cantrips and 1st-level spells only (matches v1 scope), tagged by class list, `phbPage`.

**Exit criteria:** every JSON file complete and cross-checked against the physical PHB page-by-page; a small script or test asserts no entry is missing a `phbPage`.

---

## Phase 2 — Core Character Creation Engine

Port and deepen the wizard logic from the prototype into real React state, expanded to cover everything Phase 1 now has data for.

**Deliverables**
- Step flow: Concept → Class → Species → Background → Ability Scores → Skills → Equipment → Spells (if applicable) → Summary.
- Ability score generation: Standard Array, Point Buy, and 4d6-drop-lowest, all three selectable.
- Derived stats computed live: AC, HP, initiative, passive scores, save bonuses, skill bonuses.
- Starting equipment selection (Option A package vs Option B gold) pulled from `equipment.json`.
- Cantrip/1st-level spell selection for casting classes, pulled from `spells-cantrips-l1.json`.
- State management approach chosen (React Context + reducer is likely enough at this scope; avoid pulling in a heavier library unless the form state gets unwieldy).

**Exit criteria:** a full character can be built end-to-end for at least one class of each type (martial, half-caster, full-caster) with correct derived numbers.

---

## Phase 3 — PWA Shell & Mobile Shell

Make it installable and make it work like an app on a phone, not a webpage that happens to be responsive.

**Deliverables**
- `manifest.json`: name, icons (multiple sizes), theme color, standalone display mode.
- Service worker via `vite-plugin-pwa`: precache the app shell and content JSON, so creation works fully offline after first load.
- Install prompt handling (the "Add to Home Screen" flow on Android; documented workaround note for iOS Safari, which doesn't support the standard install prompt).
- Mobile-first layout pass: touch target sizing, one-handed thumb reach for primary actions, no hover-dependent UI.

**Exit criteria:** app installs on an Android device from Chrome, opens in standalone mode, and completes a full character creation with the network disabled.

---

## Phase 4 — Persistence Layer

Characters need to survive closing the app.

**Deliverables**
- IndexedDB wrapper (e.g. via the `idb` library) with a `characters` store.
- Save / load / duplicate / delete a character.
- A roster/home screen listing saved characters (name, class, species, portrait thumbnail) as the app's landing view once at least one character exists.
- JSON export/import per character, so a character can be backed up or moved between devices manually.

**Exit criteria:** create two characters, close the app fully, reopen, both are present and editable.

---

## Phase 5 — Image & Config System

**Deliverables**
- `portraits.json` consumed at runtime to map species/class/background art and/or per-character portraits, per the schema locked in Phase 0.
- UI for assigning or uploading a portrait to a saved character (stored as a data URL in IndexedDB alongside the character, since v1 has no backend to host uploaded files).
- Fallback art for any entry with no configured image, so the config being incomplete never breaks the UI.

**Exit criteria:** adding a new image is a config/file change only, no code change required.

---

## Phase 6 — PHB Cross-Reference Surface

**Deliverables**
- Every feature, trait, and feat shown in the creation flow displays its `phbPage` inline (e.g. "PHB p.47").
- A simple searchable reference view (separate from the creation flow) listing every data entry with its page number, for quick lookup mid-session at the table.

**Exit criteria:** every screen in the creation flow has zero content items missing a visible page reference.

---

## Phase 7 — Polish, QA & Deployment

**Deliverables**
- Accessibility pass: focus states, sufficient contrast, screen-reader labels on icon-only controls.
- Edge case handling: incomplete character abandoned mid-flow, storage quota errors, duplicate character names.
- Cross-device test pass: at least one Android phone and one iPhone.
- Deployment to a static host (GitHub Pages or Vercel — your call, both are free and work fine for a PWA with no backend).
- README covering how to add new content JSON, new portraits, and how to redeploy.

**Exit criteria:** installed app, tested on your own phone, building a full character start to finish, offline, with a portrait and every page reference visible.

---

## Post-v1 Backlog (not scheduled)

- Leveling past 1, subclass selection at higher levels, multiclassing.
- Full spell list (2nd level and beyond) for casters that outlevel v1.
- Cloud sync / multi-device support.
- Party view (multiple characters grouped by campaign).
