import { AbilityScoreKey, SkillKey, DndClass, DndSpecies, DndBackground, DndFeat } from '../types/dnd';
import { CharacterData, DerivedCharacterStats, CharacterWeaponAttack } from '../types/character';
import { getAbilityModifier, ABILITY_KEYS } from './abilityScores';
import classesData from '../data/classes.json';
import speciesData from '../data/species.json';
import backgroundsData from '../data/backgrounds.json';
import featsData from '../data/feats.json';
import equipmentData from '../data/equipment.json';

const ALL_CLASSES = classesData as DndClass[];
const ALL_SPECIES = speciesData as DndSpecies[];
const ALL_BACKGROUNDS = backgroundsData as DndBackground[];
const ALL_FEATS = featsData as DndFeat[];

export const SKILL_ABILITY_MAP: Record<SkillKey, AbilityScoreKey> = {
  Acrobatics: 'dex',
  'Animal Handling': 'wis',
  Arcana: 'int',
  Athletics: 'str',
  Deception: 'cha',
  History: 'int',
  Insight: 'wis',
  Intimidation: 'cha',
  Investigation: 'int',
  Medicine: 'wis',
  Nature: 'int',
  Perception: 'wis',
  Performance: 'cha',
  Persuasion: 'cha',
  Religion: 'int',
  'Sleight of Hand': 'dex',
  Stealth: 'dex',
  Survival: 'wis'
};

export function calculateDerivedStats(character: CharacterData): DerivedCharacterStats {
  const cls = ALL_CLASSES.find(c => c.id === character.classId) || ALL_CLASSES[0];
  const species = ALL_SPECIES.find(s => s.id === character.speciesId) || ALL_SPECIES[0];
  const bg = ALL_BACKGROUNDS.find(b => b.id === character.backgroundId) || ALL_BACKGROUNDS[0];
  const originFeat = ALL_FEATS.find(f => f.id === bg.featId);
  const bonusHumanFeat = character.selectedOriginFeatId ? ALL_FEATS.find(f => f.id === character.selectedOriginFeatId) : undefined;

  const pb = 2; // Level 1 PB

  // 1. Calculate Final Abilities
  const finalAbilities = { ...character.baseAbilities };
  if (character.asiSelection.mode === '2/1') {
    if (character.asiSelection.plusTwo) {
      finalAbilities[character.asiSelection.plusTwo] += 2;
    }
    character.asiSelection.plusOnes.forEach(a => {
      finalAbilities[a] += 1;
    });
  } else if (character.asiSelection.mode === '1/1/1') {
    character.asiSelection.plusOnes.forEach(a => {
      finalAbilities[a] += 1;
    });
  }

  // 2. Calculate Modifiers
  const modifiers = ABILITY_KEYS.reduce((acc, k) => {
    acc[k] = getAbilityModifier(finalAbilities[k]);
    return acc;
  }, {} as Record<AbilityScoreKey, number>);

  // 3. Saving Throws
  const savingThrows = ABILITY_KEYS.reduce((acc, k) => {
    const isProf = cls.savingThrows.includes(k);
    acc[k] = {
      proficient: isProf,
      bonus: modifiers[k] + (isProf ? pb : 0)
    };
    return acc;
  }, {} as Record<AbilityScoreKey, { proficient: boolean; bonus: number }>);

  // 4. Skills Compilation
  const backgroundSkills = bg.skills || [];
  const classSkills = character.selectedClassSkills || [];
  const speciesSkills: SkillKey[] = [];
  if (species.id === 'elf') speciesSkills.push('Perception');
  if (species.id === 'human' && character.selectedHumanBonusSkill) {
    speciesSkills.push(character.selectedHumanBonusSkill);
  }
  const featSkills = character.selectedOriginFeatSkills || [];

  const expertiseList = character.expertiseSkills || [];

  const skills = (Object.keys(SKILL_ABILITY_MAP) as SkillKey[]).reduce((acc, skillName) => {
    const ability = SKILL_ABILITY_MAP[skillName];
    const mod = modifiers[ability];

    let proficient = false;
    let source = '';

    if (backgroundSkills.includes(skillName)) {
      proficient = true;
      source = 'Background';
    } else if (speciesSkills.includes(skillName)) {
      proficient = true;
      source = 'Species';
    } else if (classSkills.includes(skillName)) {
      proficient = true;
      source = 'Class';
    } else if (featSkills.includes(skillName)) {
      proficient = true;
      source = 'Feat';
    }

    const isExpertise = isProficientAndExpertise(proficient, skillName, expertiseList);
    let bonus = mod;
    if (isExpertise) {
      bonus += pb * 2;
    } else if (proficient) {
      bonus += pb;
    }

    acc[skillName] = {
      proficient,
      expertise: isExpertise,
      bonus,
      source
    };
    return acc;
  }, {} as Record<SkillKey, { proficient: boolean; expertise: boolean; bonus: number; source: string }>);

  // 5. HP Calculation
  let baseHp = cls.hitDie + modifiers.con;
  // Dwarven Toughness: +1 HP per level
  if (species.id === 'dwarf') {
    baseHp += 1;
  }
  // Tough Feat: +2 HP per level
  if (originFeat?.id === 'tough' || bonusHumanFeat?.id === 'tough') {
    baseHp += 2;
  }
  const maxHp = Math.max(1, baseHp);

  // 6. AC Calculation
  const equippedArmor = equipmentData.armor.find(a => a.id === character.equippedArmorId);
  const equippedShield = equipmentData.armor.find(a => a.id === character.equippedShieldId);
  const shieldBonus = equippedShield ? 2 : 0;

  let armorClass = 10 + modifiers.dex;
  let acBreakdown = '10 + Dex mod';

  // Check Barbarian Unarmored Defense (10 + Dex + Con)
  if (!equippedArmor && cls.id === 'barbarian') {
    armorClass = 10 + modifiers.dex + modifiers.con + shieldBonus;
    acBreakdown = `Unarmored Defense (10 + Dex ${modifiers.dex} + Con ${modifiers.con}${shieldBonus ? ' + Shield 2' : ''})`;
  }
  // Check Monk Unarmored Defense (10 + Dex + Wis, no shield)
  else if (!equippedArmor && !equippedShield && cls.id === 'monk') {
    armorClass = 10 + modifiers.dex + modifiers.wis;
    acBreakdown = `Unarmored Defense (10 + Dex ${modifiers.dex} + Wis ${modifiers.wis})`;
  }
  // Armor equipped
  else if (equippedArmor) {
    if (equippedArmor.dexBonusType === 'Full') {
      armorClass = equippedArmor.baseAC + modifiers.dex + shieldBonus;
      acBreakdown = `${equippedArmor.name} (${equippedArmor.baseAC}) + Dex (${modifiers.dex})${shieldBonus ? ' + Shield (2)' : ''}`;
    } else if (equippedArmor.dexBonusType === 'Max2') {
      const cappedDex = Math.min(2, modifiers.dex);
      armorClass = equippedArmor.baseAC + cappedDex + shieldBonus;
      acBreakdown = `${equippedArmor.name} (${equippedArmor.baseAC}) + Dex capped (${cappedDex})${shieldBonus ? ' + Shield (2)' : ''}`;
    } else {
      armorClass = equippedArmor.baseAC + shieldBonus;
      acBreakdown = `${equippedArmor.name} (${equippedArmor.baseAC})${shieldBonus ? ' + Shield (2)' : ''}`;
    }
  } else if (shieldBonus) {
    armorClass = 10 + modifiers.dex + shieldBonus;
    acBreakdown = `10 + Dex (${modifiers.dex}) + Shield (2)`;
  }

  // Fighter Defense Fighting Style (+1 in armor)
  if (equippedArmor && character.classFeatureChoices?.['Fighting Style'] === 'Defense') {
    armorClass += 1;
    acBreakdown += ' + Defense Fighting Style (1)';
  }

  // 7. Initiative (Dex mod + Alert Feat)
  let initiative = modifiers.dex;
  if (originFeat?.id === 'alert' || bonusHumanFeat?.id === 'alert') {
    initiative += pb;
  }

  // 8. Speed
  let speed = species.speed || 30;
  if (species.id === 'elf' && character.lineageId === 'wood-elf') {
    speed = 35;
  }

  // 9. Passive Scores
  const passivePerception = 10 + skills['Perception'].bonus;
  const passiveInvestigation = 10 + skills['Investigation'].bonus;
  const passiveInsight = 10 + skills['Insight'].bonus;

  // 10. Spellcasting
  let spellcasting: DerivedCharacterStats['spellcasting'] = undefined;
  if (cls.spellcasterType && cls.spellcasterType !== 'none' && cls.spellcastingAbility) {
    const castingMod = modifiers[cls.spellcastingAbility];
    const spellSaveDC = 8 + pb + castingMod;
    const spellAttackModifier = pb + castingMod;

    spellcasting = {
      ability: cls.spellcastingAbility,
      spellSaveDC,
      spellAttackModifier,
      cantripsKnown: cls.cantripsKnownL1 || 0,
      spellsPrepared: cls.spellsPreparedL1 || 0,
      slotsTotal: cls.spellSlotsL1 || { 1: 2 },
      slotsExpended: {}
    };
  }

  // 11. Weapon Attacks
  const weaponAttacks: CharacterWeaponAttack[] = [];
  const inventoryWeapons = character.inventory
    .map(inv => {
      const match = equipmentData.weapons.find(w => w.name.toLowerCase() === inv.name.toLowerCase() || w.id === inv.id);
      return match;
    })
    .filter((w): w is (typeof equipmentData.weapons)[0] => !!w);

  // If no weapons, add Unarmed Strike
  if (inventoryWeapons.length === 0) {
    const isMonk = cls.id === 'monk';
    const hasTavernBrawler = originFeat?.id === 'tavern-brawler' || bonusHumanFeat?.id === 'tavern-brawler';
    const monkOrFinesseMod = isMonk ? Math.max(modifiers.str, modifiers.dex) : modifiers.str;
    const dmgDice = isMonk ? '1d6' : hasTavernBrawler ? '1d4' : '1';

    weaponAttacks.push({
      name: 'Unarmed Strike',
      attackBonus: pb + monkOrFinesseMod,
      damage: `${dmgDice} + ${monkOrFinesseMod}`,
      damageType: 'Bludgeoning',
      properties: isMonk ? ['Monk Martial Arts'] : []
    });
  }

  inventoryWeapons.forEach(w => {
    const isFinesse = w.properties.some(p => p.toLowerCase().includes('finesse'));
    const isRanged = w.category.includes('Ranged');
    const isMonk = cls.id === 'monk' && (w.category.includes('Simple') || w.name === 'Shortsword');

    let abilityMod = modifiers.str;
    if (isRanged) {
      abilityMod = modifiers.dex;
    } else if (isFinesse || isMonk) {
      abilityMod = Math.max(modifiers.str, modifiers.dex);
    }

    let attackBonus = pb + abilityMod;
    // Archery Fighting Style
    if (isRanged && character.classFeatureChoices?.['Fighting Style'] === 'Archery') {
      attackBonus += 2;
    }

    let damageBonus = abilityMod;
    // Dueling Fighting Style (+2 damage if 1-handed melee and no other weapons)
    if (!isRanged && !w.properties.includes('Two-Handed') && character.classFeatureChoices?.['Fighting Style'] === 'Dueling') {
      damageBonus += 2;
    }

    const masteryName = character.weaponMasteryChoices.includes(w.id) ? w.mastery : undefined;

    weaponAttacks.push({
      name: w.name,
      attackBonus,
      damage: `${w.damage} ${damageBonus >= 0 ? '+' : ''}${damageBonus}`,
      damageType: w.damageType,
      range: w.range,
      mastery: masteryName,
      properties: w.properties
    });
  });

  // 12. Total Weight
  const totalWeight = character.inventory.reduce((sum, item) => sum + item.weight * item.quantity, 0);

  return {
    level: 1,
    proficiencyBonus: pb,
    finalAbilities,
    modifiers,
    savingThrows,
    skills,
    maxHp,
    currentHp: maxHp,
    tempHp: 0,
    hitDice: {
      total: 1,
      die: cls.hitDie,
      used: 0
    },
    armorClass,
    armorClassBreakdown: acBreakdown,
    initiative,
    speed,
    size: species.size,
    passivePerception,
    passiveInvestigation,
    passiveInsight,
    spellcasting,
    weaponAttacks,
    totalWeight
  };
}

function isProficientAndExpertise(proficient: boolean, skill: SkillKey, expertiseList: SkillKey[]): boolean {
  return proficient && expertiseList.includes(skill);
}

