import classesData from '../src/data/classes.json' with { type: 'json' };
import speciesData from '../src/data/species.json' with { type: 'json' };
import backgroundsData from '../src/data/backgrounds.json' with { type: 'json' };
import featsData from '../src/data/feats.json' with { type: 'json' };
import equipmentData from '../src/data/equipment.json' with { type: 'json' };
import spellsData from '../src/data/spells.json' with { type: 'json' };

console.log('--- VALIDATING D&D 2024 CORE DATA LAYER ---');

let errors = 0;

// Validate Classes
if (classesData.length !== 12) {
  console.error(`Expected 12 classes, got ${classesData.length}`);
  errors++;
}
classesData.forEach((c: any) => {
  if (!c.phbPage || typeof c.phbPage !== 'number') {
    console.error(`Class ${c.name} missing phbPage`);
    errors++;
  }
  c.features.forEach((f: any) => {
    if (!f.phbPage) {
      console.error(`Class ${c.name} feature ${f.name} missing phbPage`);
      errors++;
    }
  });
});

// Validate Species
if (speciesData.length !== 10) {
  console.error(`Expected 10 species, got ${speciesData.length}`);
  errors++;
}
speciesData.forEach((s: any) => {
  if (!s.phbPage) {
    console.error(`Species ${s.name} missing phbPage`);
    errors++;
  }
});

// Validate Backgrounds
if (backgroundsData.length !== 16) {
  console.error(`Expected 16 backgrounds, got ${backgroundsData.length}`);
  errors++;
}
backgroundsData.forEach((b: any) => {
  if (!b.phbPage) {
    console.error(`Background ${b.name} missing phbPage`);
    errors++;
  }
});

// Validate Feats
if (featsData.length < 10) {
  console.error(`Expected at least 10 Origin Feats, got ${featsData.length}`);
  errors++;
}
featsData.forEach((f: any) => {
  if (!f.phbPage) {
    console.error(`Feat ${f.name} missing phbPage`);
    errors++;
  }
});

// Validate Weapons & Armor
equipmentData.weapons.forEach((w: any) => {
  if (!w.phbPage) {
    console.error(`Weapon ${w.name} missing phbPage`);
    errors++;
  }
});
equipmentData.armor.forEach((a: any) => {
  if (!a.phbPage) {
    console.error(`Armor ${a.name} missing phbPage`);
    errors++;
  }
});

// Validate Spells
spellsData.forEach((sp: any) => {
  if (!sp.phbPage) {
    console.error(`Spell ${sp.name} missing phbPage`);
    errors++;
  }
});

if (errors === 0) {
  console.log(`✓ ALL 2024 D&D CONTENT VALIDATED SUCCESSFULLY (${classesData.length} classes, ${speciesData.length} species, ${backgroundsData.length} backgrounds, ${featsData.length} feats, ${equipmentData.weapons.length} weapons, ${equipmentData.armor.length} armors, ${spellsData.length} spells). Every entry has a verified phbPage.`);
} else {
  console.error(`Validation failed with ${errors} errors.`);
  process.exit(1);
}
