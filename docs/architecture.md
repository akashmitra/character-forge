# D&D 2024 Character Forge — System Architecture Specification

**Document Version:** 1.1.0  
**Ruleset Standard:** 2024 Dungeons & Dragons Player's Handbook (Revision 5.24e)  
**System Scope:** Level 1 Character Creation, Interactive Tabletop Sheet, Client-Side PDF Form Filling & Embedded Reader, Searchable PHB Compendium, and Offline PWA.

---

## 1. Executive Summary & Core Design Principles

The **D&D 2024 Character Forge** is an offline-first, client-side Progressive Web Application (PWA) engineered to provide deep, rule-accurate, and information-dense Level 1 character creation adhering to the revised 2024 core rules.

```
                  ┌─────────────────────────────────────────┐
                  │       D&D 2024 Character Forge          │
                  │  Level 1 Creator · Sheet · PDF · PWA    │
                  └────────────────────┬────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│ True Offline     │         │ Deterministic    │         │ Client-Side PDF  │
│ Zero-Backend     │         │ Rules Engine     │         │ AcroForm Engine  │
│ IndexedDB (idb)  │         │ Pure TypeScript  │         │ pdf-lib in-page  │
└──────────────────┘         └──────────────────┘         └──────────────────┘
```

### Core Architectural Principles

1. **Zero-Backend Dependency (True Offline-First)**:
   - All character storage is persisted client-side in the browser's **IndexedDB** storage engine via `idb`.
   - All rule content (classes, species, backgrounds, feats, equipment, spells) is packaged as static JSON datasets precached via Service Workers.
2. **Client-Side PDF Form Population & Embedded Reader (`pdf-lib`)**:
   - The official 2024 D&D character sheet PDF template (`template/charactersheet.pdf`) is loaded and populated dynamically in the browser, providing an in-page embedded PDF reader, direct PDF downloads, and native print without sending any data over a network.
3. **Deterministic Rules Calculation Engine**:
   - Derived character attributes (Armor Class, Hit Points, Saving Throws, Skills, Spell DCs, Attacks, Weapon Masteries) are dynamically computed from base state via pure functions without mutating raw source inputs.
4. **Information Density & Rules Traceability**:
   - Every mechanical option displays an inline `phbPage` reference badge connecting directly to an in-app slide-out compendium drawer for tabletop verification.
5. **Data Portability**:
   - Complete character state can be exported and imported as standalone `.json` files for device-to-device migration or backup.

---

## 2. System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                 User Interface                                    |
|   +-------------------+  +-------------------+  +-------------------------------+  |
|   |  Creation Wizard  |  | Character Sheet   |  |   Embedded PDF Reader / Print |  |
|   |  (9 Step Flow)    |  | (Live Dice Table) |  |   (Auto-Populated AcroForm)   |  |
|   +---------+---------+  +---------+---------+  +---------------+---------------+  |
|             |                      |                            |                 |
+-------------|----------------------|----------------------------|-----------------+
              |                      |                            |
              v                      v                            v
+-----------------------------------------------------------------------------------+
|                        Application State & Context Layer                          |
|                            (CharacterContext.tsx)                                 |
|   - Active Character State                   - Active Roll Triggers               |
|   - Saved Characters Cache                   - View Routing State                 |
+---------------------+-----------------------------------+-------------------------+
                      |                                   |
                      v                                   v
+-------------------------------------+  +------------------------------------------+
|        2024 D&D Rules Engine        |  |            Persistence Layer             |
|        (Pure Math & Logic)          |  |               (IndexedDB)                |
|  - abilityScores.ts (Point Buy/4d6) |  |  - db.ts (idb ObjectStore)               |
|  - statsCalculator.ts (AC/HP/Saves) |  |  - exportImport.ts (JSON I/O)            |
|  - weaponMastery.ts (2024 Rules)    |  +------------------------------------------+
|  - spellcasting.ts (DC/Slots/Prep)  |  |           PDF Generation Engine          |
|  - pdfFiller.ts (pdf-lib AcroForm)  |  |  - template/charactersheet.pdf           |
+---------------------+---------------+  +------------------------------------------+
                      |                                                   
                      v                                                   
+-----------------------------------------------------------------------------------+
|                         Core Content Layer (/src/data)                            |
|   - classes.json       - species.json        - backgrounds.json                   |
|   - feats.json         - equipment.json      - spells.json                        |
|   - portraits.json                                                                |
+-----------------------------------------------------------------------------------+
|                         PWA & Caching Layer (Workbox)                             |
|   - Service Worker precaches app shell, fonts, assets, and data JSONs             |
+-----------------------------------------------------------------------------------+
```

---

## 3. Layer Breakdown

### 3.1 Content Data Layer (`src/data/`)

The content layer decouples D&D 5.24e rules and statistics from React presentation components:

| File | Content Model | Key Attributes |
| :--- | :--- | :--- |
| `classes.json` | 12 Classes | `hitDie`, `savingThrows`, `armorTraining`, `weaponTraining`, `weaponMasteryCount`, `features`, `startingEquipmentOptions`, `phbPage` |
| `species.json` | 10 Species | `size`, `speed`, `traits`, `lineages`, `lineageTitle`, `specialOriginFeatChoice`, `phbPage` |
| `backgrounds.json` | 16 Backgrounds | `abilityScoreOptions` (triads), `featId`, `skills`, `toolProficiency`, `startingGold`, `phbPage` |
| `feats.json` | Origin Feats | `id`, `name`, `category`, `description`, `bullets`, `grantsSpellsChoice`, `phbPage` |
| `equipment.json` | Weapons & Armor | `damage`, `damageType`, `properties`, `mastery`, `baseAC`, `dexBonusType`, `costGold`, `weight`, `phbPage` |
| `spells.json` | Cantrips & L1 Spells | `level`, `school`, `classes`, `castingTime`, `range`, `components`, `concentration`, `ritual`, `phbPage` |
| `portraits.json` | Heraldic Sigils | `id`, `name`, `tags`, `iconSvg` |

### 3.2 Rules Engine & Mathematical Formulas (`src/engine/`)

The calculation engine is composed of deterministic helper functions:

#### 1. Ability Score Increases (Background ASI)
Under 2024 rules, backgrounds grant ability adjustments to a three-ability triad via two distinct modes:
$$\text{Mode 2/1: } \text{Ability}_A + 2, \quad \text{Ability}_B + 1$$
$$\text{Mode 1/1/1: } \text{Ability}_A + 1, \quad \text{Ability}_B + 1, \quad \text{Ability}_C + 1$$

#### 2. Ability Modifiers
$$\text{Modifier} = \left\lfloor \frac{\text{Score} - 10}{2} \right\rfloor$$

#### 3. Point Buy Allocation
Point cost follows the official 2024 non-linear progression for base values between 8 and 15 (27 points total):
$$\text{Cost}(8)=0, \, \text{Cost}(9)=1, \, \text{Cost}(10)=2, \, \text{Cost}(11)=3, \, \text{Cost}(12)=4, \, \text{Cost}(13)=5, \, \text{Cost}(14)=7, \, \text{Cost}(15)=9$$

#### 4. Armor Class (AC) Resolution Matrix
The AC computation handles situational modifiers hierarchically:
- **Unarmored**: $10 + \text{Mod}_{\text{Dex}}$
- **Barbarian Unarmored Defense**: $10 + \text{Mod}_{\text{Dex}} + \text{Mod}_{\text{Con}} + \text{Shield}$
- **Monk Unarmored Defense**: $10 + \text{Mod}_{\text{Dex}} + \text{Mod}_{\text{Wis}}$ *(wielding no armor or shield)*
- **Light Armor**: $\text{BaseAC}_{\text{Armor}} + \text{Mod}_{\text{Dex}} + \text{Shield}$
- **Medium Armor**: $\text{BaseAC}_{\text{Armor}} + \min(2, \text{Mod}_{\text{Dex}}) + \text{Shield}$
- **Heavy Armor**: $\text{BaseAC}_{\text{Armor}} + \text{Shield}$
- **Defense Fighting Style**: $+1 \text{ AC if wearing armor}$

#### 5. Hit Points (Max HP at Level 1)
$$\text{Max HP} = \text{HitDie}_{\text{Class}} + \text{Mod}_{\text{Con}} + \text{Bonus}_{\text{Dwarf}} (+1) + \text{Bonus}_{\text{Tough}} (+2)$$

#### 6. Weapon Mastery Mechanics
The engine supports all 8 2024 mastery traits:
- **Cleave**: Secondary strike to adjacent enemy within reach.
- **Graze**: Deal ability modifier damage on missed attack roll.
- **Nick**: Perform extra light weapon attack as part of the Attack action.
- **Push**: Repel hit target up to 10 feet straight back.
- **Sap**: Impose Disadvantage on target's next attack roll.
- **Slow**: Reduce target movement speed by 10 feet until next turn.
- **Topple**: Target must make Con save ($\text{DC} = 8 + \text{PB} + \text{Mod}$) or fall Prone.
- **Vex**: Gain Advantage on next attack roll against the target.

### 3.3 Client-Side PDF Generation Engine (`src/engine/pdfFiller.ts`)

The PDF subsystem provides pure client-side PDF form filling:
- **AcroForm Mapping**: Loads `template/charactersheet.pdf` into a `pdf-lib` document instance.
- **Dynamic Field Population**: Sets text fields (`Text1`, `Text6`, `Text21`...`Text68`) and checkboxes (`Check Box5`, `Check Box24`...) corresponding to:
  - Header data (Name, Class & Level, Background, Species, Alignment, Deity, Pronouns).
  - Ability scores and calculated $\pm$ modifiers.
  - Senses & Passives (Perception, Investigation, Insight).
  - Combat Vitals (AC, Initiative, Speed, Maximum HP, Hit Dice).
  - Weapon attacks table (rows 1–6 with to-hit bonuses, damage formulas, and mastery notes).
  - Features, Traits, and full Origin Feat mechanics with PHB citations.
  - Equipment, inventory weights, and Gold (GP).
  - Spellcasting DC, attack bonus, cantrips, and prepared spells.
- **Blob Object URL Creation**: Generates a fast `Blob` URL passed to `<iframe />` viewer elements for instant in-page preview.

---

## 4. State Management & Storage Architecture

### 4.1 React Context (`CharacterContext.tsx`)
A unified `CharacterProvider` exposes reactive states:
- `character`: The mutable working draft `CharacterData`.
- `derivedStats`: Memoized output of `calculateDerivedStats(character)`.
- `savedCharacters`: Array of persisted characters retrieved from IndexedDB.
- `activeView`: Routing enum (`'roster' | 'wizard' | 'sheet' | 'print'`).
- `wizardStep`: Integer index (0 to 8) tracking creation progress.
- `activeRoll`: Tabletop dice roll payload triggering animated modal feedback.

### 4.2 IndexedDB Layer (`storage/db.ts`)
Built upon the `idb` Promise-based client:
- **Database**: `dnd-character-forge-db` (v1)
- **Object Store**: `characters` with `keyPath: 'id'`
- **Index**: `by-updated` indexed on `updatedAt` timestamp for chronological sorting.
- **Data URL Art Storage**: Custom image uploads are encoded as data URLs directly inside `CharacterData.portraitUrl`, preserving offline portability without requiring external image hosting.

---

## 5. User Interface & View Layer

| View / Component | Purpose & Functionality |
| :--- | :--- |
| **Header & Fiery d20** | Top navigation bar with animated molten fiery d20 die, character overview, quick actions, and compendium toggle. |
| **Creation Wizard** | 9-step guided walkthrough with real-time validation, background ASI toggles, Point Buy math, and 4d6 dice rolling. |
| **Character Sheet** | Interactive tabletop interface with clickable ability checks, saving throws, weapon attacks, HP +/- counters, and spell slot toggles. |
| **Embedded PDF Reader & Print** | Pre-populates the official 2024 D&D PDF template client-side via `pdf-lib`, featuring an in-page embedded PDF reader, direct PDF download, and native print. |
| **Character Roster** | Hero gallery grid displaying saved characters with quick stats, duplicate, delete, and JSON import/export. |
| **PHB Compendium** | Slide-out quick-lookup drawer allowing real-time keyword search across all 2024 rules, feats, masteries, and spells. |

---

## 6. Progressive Web App (PWA) & Offline Strategy

The application utilizes `vite-plugin-pwa` with Google Workbox:
- **Service Worker Lifecycle**: Automated registration and background updates (`registerType: 'autoUpdate'`).
- **Precache Manifest**: Precaches all transpiled JavaScript, CSS, HTML, SVG icons, and JSON data.
- **Font Caching**: Google Fonts (`Cinzel`, `Spectral`, `Inter`) and GStatic font files are cached with a `CacheFirst` strategy and 1-year expiration.
- **Standalone Manifest**: Supports installation on Android (Add to Home screen), iOS Safari, and Desktop Chrome/Edge as an app window.

---

## 7. Quality Assurance & Verification

The architecture includes automated verification:
- **`scripts/validateData.ts`**: Verifies schema integrity across all classes, species, backgrounds, feats, equipment, and spells, enforcing that no content item is missing a `phbPage` reference.
- **TypeScript Strict Checking**: Enforces type safety for character choices and derived calculations.
