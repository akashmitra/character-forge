import { PDFDocument } from 'pdf-lib';
import { CharacterData, DerivedCharacterStats } from '../types/character';
import { formatModifier } from './abilityScores';
import classesData from '../data/classes.json';
import speciesData from '../data/species.json';
import backgroundsData from '../data/backgrounds.json';
import featsData from '../data/feats.json';

export async function generateFilledCharacterPdf(
  character: CharacterData,
  derivedStats: DerivedCharacterStats,
  templateUrl: string = '/template/charactersheet.pdf'
): Promise<{ pdfBytes: Uint8Array; blobUrl: string }> {
  // 1. Fetch template PDF
  const response = await fetch(templateUrl);
  if (!response.ok) {
    throw new Error(`Failed to load PDF template from ${templateUrl}: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();

  // 2. Load PDFDocument with pdf-lib
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const form = pdfDoc.getForm();

  const cls = classesData.find(c => c.id === character.classId);
  const sp = speciesData.find(s => s.id === character.speciesId);
  const bg = backgroundsData.find(b => b.id === character.backgroundId);
  const originFeat = featsData.find(f => f.id === bg?.featId);

  // Safe field setter helper
  const setTextField = (name: string, value: string | number | undefined) => {
    try {
      if (value === undefined || value === null) return;
      const field = form.getTextField(name);
      if (field) {
        field.setText(String(value));
      }
    } catch (e) {
      // Ignore field if missing in schema
    }
  };

  const setCheckbox = (name: string, checked: boolean) => {
    try {
      const field = form.getCheckBox(name);
      if (field) {
        if (checked) field.check();
        else field.uncheck();
      }
    } catch (e) {}
  };

  // --- 1. HEADER SECTION ---
  setTextField('Text1', character.name || 'Unnamed Adventurer');
  setTextField('Text6', `${cls?.name || 'Fighter'} 1`);
  setTextField('Text7', bg?.name || 'Guard');
  setTextField('Text8', sp?.name || 'Human');
  setTextField('Text9', character.lineageId || character.alignment || 'Neutral Good');

  // --- 2. COMBAT VITALS & PASSIVES ---
  setTextField('Text11', derivedStats.armorClass); // AC
  setTextField('Text12', formatModifier(derivedStats.initiative)); // Initiative
  setTextField('Text13', `${derivedStats.speed} ft`); // Speed
  setTextField('Text14', derivedStats.maxHp); // HP Max
  setTextField('Text20', derivedStats.currentHp); // HP Current
  setTextField('Text18', `+${derivedStats.proficiencyBonus}`); // PB (+2)
  setTextField('Text19', `1d${cls?.hitDie || 10}`); // Hit Dice
  setTextField('Text15', derivedStats.passivePerception); // Passive Perception
  setTextField('Text16', derivedStats.passiveInvestigation); // Passive Investigation
  setTextField('Text17', derivedStats.passiveInsight); // Passive Insight

  // --- 3. ABILITY SCORES & MODIFIERS ---
  // Strength
  setTextField('Text21', derivedStats.finalAbilities.str);
  setTextField('Text64', formatModifier(derivedStats.modifiers.str));

  // Dexterity
  setTextField('Text22', derivedStats.finalAbilities.dex);
  setTextField('Text66', formatModifier(derivedStats.modifiers.dex));

  // Constitution
  setTextField('Text23', derivedStats.finalAbilities.con);
  setTextField('Text65', formatModifier(derivedStats.modifiers.con));

  // Intelligence
  setTextField('Text24', derivedStats.finalAbilities.int);
  setTextField('Text67', formatModifier(derivedStats.modifiers.int));

  // Wisdom
  setTextField('Text25', derivedStats.finalAbilities.wis);
  setTextField('Text68', formatModifier(derivedStats.modifiers.wis));

  // Charisma
  setTextField('Text26', derivedStats.finalAbilities.cha);
  setTextField('Text27', formatModifier(derivedStats.modifiers.cha));

  // --- 4. SAVING THROWS & SKILLS SUMMARY ---
  const savesText = Object.entries(derivedStats.savingThrows)
    .map(([k, s]) => `${k.toUpperCase()}: ${formatModifier(s.bonus)}${s.proficient ? ' (Proficient)' : ''}`)
    .join('\n');

  const skillsText = Object.entries(derivedStats.skills)
    .map(([name, s]) => `${name}: ${formatModifier(s.bonus)}${s.expertise ? ' (Expertise)' : s.proficient ? ' (Proficient)' : ''}`)
    .join('\n');

  // --- 5. WEAPON ATTACKS (Rows 1 to 6) ---
  const attacks = derivedStats.weaponAttacks;
  const attackFieldSets = [
    { name: 'Text30', hit: 'Text31', dmg: 'Text32', notes: 'Text33' },
    { name: 'Text34', hit: 'Text35', dmg: 'Text36', notes: 'Text37' },
    { name: 'Text38', hit: 'Text39', dmg: 'Text40', notes: 'Text41' },
    { name: 'Text42', hit: 'Text43', dmg: 'Text44', notes: 'Text45' },
    { name: 'Text46', hit: 'Text47', dmg: 'Text48', notes: 'Text49' },
    { name: 'Text50', hit: 'Text51', dmg: 'Text52', notes: 'Text53' },
  ];

  attackFieldSets.forEach((set, idx) => {
    const atk = attacks[idx];
    if (atk) {
      setTextField(set.name, atk.name);
      setTextField(set.hit, `+${atk.attackBonus}`);
      setTextField(set.dmg, `${atk.damage} ${atk.damageType}`);
      const notes = [
        atk.mastery ? `Mastery: ${atk.mastery}` : '',
        atk.range ? `Range: ${atk.range}` : '',
        atk.properties.join(', ')
      ].filter(Boolean).join(' | ');
      setTextField(set.notes, notes);
    }
  });

  // --- 6. EQUIPMENT, INVENTORY & GOLD ---
  const inventoryList = character.inventory
    .map(i => `${i.name}${i.quantity > 1 ? ` (×${i.quantity})` : ''} - ${i.weight * i.quantity} lb`)
    .join('\n');
  const equipBlock = `EQUIPMENT & GEAR:\n${inventoryList || 'None'}\n\nTotal Carrying Weight: ${derivedStats.totalWeight} lbs\nArmor: ${derivedStats.armorClassBreakdown}`;
  setTextField('Text54', equipBlock);
  setTextField('Text60', `Gold (GP): ${character.gold} GP`);

  // --- 7. FEATURES & TRAITS ---
  const classFeaturesText = cls?.features.map(f => `• ${f.name} (PHB p.${f.phbPage}): ${f.description}`).join('\n\n') || '';
  const originFeatText = originFeat ? `\n\nORIGIN FEAT: ${originFeat.name} (PHB p.${originFeat.phbPage})\n${originFeat.description}\n${originFeat.bullets.map(b => `  - ${b}`).join('\n')}` : '';
  const speciesTraitsText = sp?.traits.map(t => `• ${t.name}: ${t.description}`).join('\n\n') || '';

  const allFeaturesBlock = `CLASS FEATURES:\n${classFeaturesText}\n\nSPECIES TRAITS (${sp?.name}):\n${speciesTraitsText}${originFeatText}`;
  setTextField('Text55', allFeaturesBlock);

  // --- 8. PROFICIENCIES & TRAINING ---
  const profBlock = `ARMOR TRAINING:\n${cls?.armorTraining.join(', ') || 'None'}\n\nWEAPON TRAINING:\n${cls?.weaponTraining.join(', ')}\n\nTOOL PROFICIENCIES:\n${bg?.toolProficiency || 'None'}\n\nSAVING THROWS:\n${savesText}\n\nALL SKILLS:\n${skillsText}`;
  setTextField('Text57', profBlock);

  // --- 9. NOTES & CONCEPT ---
  const notesBlock = `CONCEPT & BACKGROUND:\n${character.concept || 'None specified.'}\n\nALIGNMENT: ${character.alignment || 'Neutral Good'}\nDEITY/FAITH: ${character.deity || 'None'}\nPRONOUNS: ${character.pronouns || 'Not specified'}`;
  setTextField('Text58', notesBlock);

  // --- 10. SPELLCASTING (PAGE 2 & SUMMARY) ---
  if (derivedStats.spellcasting) {
    const spellSummary = `SPELLCASTING: ${cls?.name}\nAbility: ${cls?.spellcastingAbility?.toUpperCase()} | Spell Save DC: ${derivedStats.spellcasting.spellSaveDC} | Attack Bonus: +${derivedStats.spellcasting.spellAttackModifier}\n\nCANTRIPS:\n${character.chosenCantrips.join(', ') || 'None'}\n\n1ST-LEVEL PREPARED SPELLS:\n${character.chosenL1Spells.join(', ') || 'None'}`;
    setTextField('Text59', spellSummary);
  }

  // 3. Save the modified PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);

  return { pdfBytes, blobUrl };
}
