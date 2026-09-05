# ⚔️ Character Forge — 2024 Player's Handbook Edition ⚔️

[![Ruleset: D&D 2024 (5.24e)](https://img.shields.io/badge/Ruleset-2024%20PHB%20(5.24e)-6E1B1B?style=for-the-badge&logo=dungeonsanddragons&logoColor=DFC068)](https://dndbeyond.com)
[![PWA: Offline Ready](https://img.shields.io/badge/PWA-100%25%20Offline%20Ready-3E522D?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![TypeScript: Strict](https://img.shields.io/badge/TypeScript-Strict%20Checked-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-C29336?style=for-the-badge)](LICENSE)

> *"Welcome, Dungeon Master and brave Adventurers, to the Character Forge. Within these illuminated pages lies the arcane machinery to forge, calculate, and chronicle Level 1 heroes according to the revised 2024 Player's Handbook rules."*

---

## 📜 Table of Contents

- [The Tome's Features](#-the-tomes-features)
- [System Requirements](#-system-requirements)
- [Quickstart: Summoning the Forge](#-quickstart-summoning-the-forge)
- [Adventurer's Guide: How to Forge a Hero](#-adventurers-guide-how-to-forge-a-hero)
- [Tabletop Sheet & Live Dice Rolling](#-tabletop-sheet--live-dice-rolling)
- [2024 Rules Engine & Mechanics](#-2024-rules-engine--mechanics)
- [PWA & Offline Installation](#-pwa--offline-installation)
- [Architecture & File Structure](#-architecture--file-structure)
- [Compendium & Data Verification](#-compendium--data-verification)
- [Expanding the Tome (Custom Content & Homebrew)](#-expanding-the-tome-custom-content--homebrew)

---

## 🔮 The Tome's Features

- **🏰 Authentic D&D 2024 Aesthetic**:
  Illuminated vellum parchment textures, deep crimson banners (`#6E1B1B`), antique gold borders (`#C29336`), wax seals, and medieval typography (`Cinzel`, `Spectral`).
- **🛡️ Complete Core Content Layer (2024 PHB)**:
  - **All 12 Classes**: Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard — including Level 1 features (*Divine Order, Primal Order, Fighting Styles, Invocations, etc.*).
  - **All 10 Species**: Human (with *Resourceful*, *Skillful*, *Versatile* feat choices), Elf (Drow, High, Wood), Dwarf, Halfling, Dragonborn, Gnome, Orc, Tiefling (Abyssal, Chthonic, Infernal), Aasimar, and Goliath (Giant ancestries).
  - **All 16 Backgrounds**: With +2/+1 or +1/+1/+1 Ability Score allocations, Origin Feats, tool and skill proficiencies, starting equipment packages, and gold.
  - **Origin Feats**: Complete mechanical breakdowns for *Alert, Crafter, Healer, Lucky, Magic Initiate (Cleric/Druid/Wizard), Musician, Savage Attacker, Skilled, Tavern Brawler, and Tough*.
  - **Weapon Masteries**: Full 2024 tactical mastery mechanics (*Cleave, Graze, Nick, Push, Sap, Slow, Topple, Vex*).
  - **Spells**: All 2024 Cantrips and 1st-level spells tagged with schools, components (V/S/M), concentration, and ritual status.
- **🎲 3 Ability Score Generation Methods**:
  - *Standard Array* (`15, 14, 13, 12, 10, 8`).
  - *Point Buy* (27-point budget with standard cost curve and live balance counters).
  - *Roll 4d6 Drop Lowest* (interactive animated dice pool with breakdown and rerolls).
- **⚔️ Live Tabletop Character Sheet**:
  - Click any ability score, saving throw, skill, or weapon attack to roll live d20s with critical hit/miss indicators and modifier breakdowns.
  - Hit Points tracker with `+` / `-` buttons, Hit Dice expenditure, and Spell Slot tracking.
  - **Long Rest** button that instantly restores HP, hit dice, and spell slots.
- **📄 Printable / PDF Sheet**:
  - Dedicated high-contrast monochrome paper layout formatted for A4 / US Letter printing and PDF export (`Ctrl + P`).
- **📖 Slide-out PHB 2024 Reference Compendium**:
  - Search any rule, spell, feat, weapon mastery, or background at any moment with direct `[PHB p. XX]` page references.
- **💾 100% Client-Side Persistence & Portability**:
  - Automatically saves characters locally in **IndexedDB**.
  - Export and import characters as standalone `.json` files for device-to-device migration.

---

## 💻 System Requirements

- **Node.js**: `v18.0.0` or higher (tested on Node 20 & 24)
- **Package Manager**: `npm` (v9+), `pnpm`, or `yarn`
- **Modern Browser**: Chrome, Edge, Firefox, Safari, or Brave (supporting ES2020 & IndexedDB).

---

## ⚡ Quickstart: Summoning the Forge

Clone or download the repository into your local sanctum:

```bash
# 1. Navigate to the project directory
cd character-forge

# 2. Install dependencies
npm install

# 3. Launch the development server
npm run dev
```

Once launched, open your web browser and navigate to `http://localhost:5173/`.

### Building for Production & Tabletop Play

```bash
# Compile and build production PWA bundle
npm run build

# Preview the production build locally
npm run preview
```

---

## 🧙 Adventurer's Guide: How to Forge a Hero

The Creation Wizard guides you through 9 intuitive steps:

```
[1. Concept] ➔ [2. Class] ➔ [3. Species] ➔ [4. Background] ➔ [5. Abilities]
                                                                    ↓
[9. Review] ➔ [8. Spells] ➔ [7. Equipment] ➔ [6. Skills] ⟵⟵⟵⟵⟵⟵⟵⟵
```

1. **Concept & Portrait**: Name your character, define pronouns, alignment, deity, write a backstory pitch, and choose a heraldic crest or upload custom portrait artwork.
2. **Class**: Select from all 12 classes. Configure Level 1 sub-choices (e.g. Cleric *Divine Order: Protector vs Thaumaturge*, Fighter *Fighting Style*, Warlock *Invocations*) and choose your Weapon Masteries.
3. **Species & Heritage**: Choose your species and lineage (e.g., Wood Elf fleet of foot, Abyssal Tiefling poison resistance, Storm Goliath).
4. **Background & ASI**: Assign your +2/+1 or +1/+1/+1 background ability modifiers and configure your Origin Feat.
5. **Ability Scores**: Select Standard Array, Point Buy (27 points), or roll 4d6 (drop lowest) with live interactive assignment.
6. **Skills & Proficiencies**: Pick class skills (background proficiencies are automatically locked and tracked to prevent waste) and select Rogue Expertise.
7. **Equipment**: Choose between your class's curated **Option A Starting Package** or **Option B Starting Gold** to buy from the merchant armory.
8. **Spells**: Prepare cantrips and 1st-level spells for spellcasters (Bard, Cleric, Druid, Paladin, Ranger, Sorcerer, Warlock, Wizard).
9. **Review & Finalize**: Inspect your complete stat block and open the interactive sheet!

---

## 🎲 Tabletop Sheet & Live Dice Rolling

Once forged, switch between views using the top navigation ribbon:

- **Interactive Sheet**: Click on any stat to trigger the live dice rolling modal. Roll attacks to see to-hit modifiers and damage formulas. Adjust HP on the fly during combat encounters.
- **Print / PDF**: Click **Print Sheet** to generate a clean, printer-friendly character sheet ready for the gaming table.
- **Roster**: Manage your party of characters, duplicate heroes for backups, export to JSON, or import characters shared by friends.
- **PHB Reference Drawer**: Click the **PHB 2024 Reference** button in the header (or click any `[PHB p. XX]` badge) to slide out the search drawer mid-game.

---

## ⚙️ 2024 Rules Engine & Mechanics

All calculations run in pure TypeScript functions under [`src/engine/`](file:///c:/Workspace/akashmitra/character-forge/src/engine):

- **Derived AC Calculation**: Accurately computes unarmored base ($10 + \text{Dex}$), armor with Dex caps (e.g. Medium armor max +2), shields, Barbarian Unarmored Defense ($10 + \text{Dex} + \text{Con}$), Monk Unarmored Defense ($10 + \text{Dex} + \text{Wis}$), and the Fighter Defense Fighting Style ($+1\text{ AC}$).
- **Hit Point Computation**: Max Hit Die at Level 1 + Constitution Modifier + Hill Dwarf bonus ($+1$) + Tough Origin Feat ($+2$).
- **2024 Spells Revision**: Features revised rules such as $2\text{d}8$ *Cure Wounds*, reaction *Blade Ward* and *Guidance*, and Level 1 *Paladin/Ranger* spellcasting.

---

## 📱 PWA & Offline Installation

This forge is built as a **Progressive Web Application (PWA)**:

- **Desktop (Chrome/Edge/Brave)**: Click the **Install** icon in your browser's address bar to install it as a standalone tabletop app.
- **Android**: Tap the browser menu (`⋮`) and select **"Add to Home screen"** or **"Install App"**.
- **iOS (Safari)**: Tap the **Share** button (`⎋`) and choose **"Add to Home Screen"**.

Once installed, the Forge works **100% offline** in basements, conventions, and cabins without internet connectivity!

---

## 📂 Architecture & File Structure

```
character-forge/
├── docs/
│   ├── plan.md                 # Original project roadmap & exit criteria
│   └── system_architecture.md  # Detailed system architecture document
├── scripts/
│   └── validateData.ts         # Automated test script for dataset verification
├── public/
│   ├── favicon.svg             # Stylized d20 gold crest
│   └── manifest.webmanifest    # PWA configuration
├── src/
│   ├── data/                   # 2024 PHB JSON datasets (with mandatory phbPage)
│   │   ├── classes.json        # 12 classes & features
│   │   ├── species.json        # 10 species & lineages
│   │   ├── backgrounds.json    # 16 backgrounds & ASI triads
│   │   ├── feats.json          # 10 Origin feats
│   │   ├── equipment.json      # Weapons, armor, masteries, packs
│   │   ├── spells.json         # Cantrips & Level 1 spells
│   │   └── portraits.json      # Preset heraldic avatars
│   ├── engine/                 # Deterministic D&D 2024 rules calculators
│   │   ├── abilityScores.ts    # Point buy curves, standard array, 4d6 roll
│   │   ├── statsCalculator.ts  # Derived AC, HP, saves, skills, passive scores
│   │   ├── weaponMastery.ts    # 2024 weapon mastery mechanics
│   │   └── spellcasting.ts     # Spell slots & DC resolvers
│   ├── storage/                # Client-side persistence
│   │   ├── db.ts               # IndexedDB wrapper (idb)
│   │   └── exportImport.ts     # JSON file exporter and importer
│   ├── state/
│   │   └── CharacterContext.tsx# Central creation & active sheet state
│   ├── components/
│   │   ├── common/             # Header, ParchmentCard, PHBBadge, DiceRollModal
│   │   ├── wizard/             # 9-step character creation wizard
│   │   ├── sheet/              # Interactive & printable character sheets
│   │   ├── roster/             # Character manager & gallery
│   │   └── compendium/         # PHB 2024 search drawer
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css               # Parchment styling & print stylesheets
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🧪 Compendium & Data Verification

To run the automated rulebook dataset verification script:

```bash
npm test
```

This validates that all 12 classes, 10 species, 16 backgrounds, Origin feats, 35 weapons, armors, and spells strictly adhere to their JSON schemas and include verified `phbPage` references.

---

## 🛠️ Expanding the Tome (Custom Content & Homebrew)

Adding new homebrew classes, species, origin feats, or spells is as simple as adding a JSON record to [`src/data/`](file:///c:/Workspace/akashmitra/character-forge/src/data):

```json
{
  "id": "homebrew-spell",
  "name": "Eldritch Starlight",
  "level": 1,
  "school": "Evocation",
  "classes": ["Sorcerer", "Wizard"],
  "castingTime": "1 action",
  "range": "60 feet",
  "components": { "verbal": true, "somatic": true, "material": false },
  "duration": "Instantaneous",
  "concentration": false,
  "ritual": false,
  "description": "A dazzling ray of astral light illuminates your enemies.",
  "phbPage": 999
}
```

---

## 📜 License

Created for tabletop gamers and Dungeon Masters. Released under the [ISC License](LICENSE).  
*Dungeons & Dragons, D&D, and Player's Handbook are trademarks of Wizards of the Coast LLC.*

