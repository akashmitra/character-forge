import { AbilityScoreKey, SkillKey } from './dnd';

export type AbilityGenerationMethod = 'manual' | 'standard' | 'pointbuy' | 'roll';

export interface AbilityScores {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface AbilityScoreIncreaseSelection {
  mode: '2/1' | '1/1/1';
  plusTwo?: AbilityScoreKey;
  plusOnes: AbilityScoreKey[];
}

export interface CharacterItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  weight: number;
  costGold: number;
  equipped?: boolean;
}

export interface CharacterWeaponAttack {
  name: string;
  attackBonus: number;
  damage: string;
  damageType: string;
  range?: string;
  mastery?: string;
  properties: string[];
}

export interface CharacterData {
  id: string;
  version: number; // 1
  createdAt: number;
  updatedAt: number;
  
  // Concept
  name: string;
  concept: string;
  pronouns?: string;
  alignment?: string;
  deity?: string;
  portraitUrl?: string; // Data URL or preset key
  
  // Core Choices
  classId: string;
  classFeatureChoices?: Record<string, string>; // e.g. Divine Order: Protector / Thaumaturge
  weaponMasteryChoices: string[]; // selected weapon IDs
  
  speciesId: string;
  lineageId?: string;
  speciesTraitChoices?: Record<string, string>;
  
  backgroundId: string;
  asiSelection: AbilityScoreIncreaseSelection;
  
  // Ability Scores
  abilityMethod: AbilityGenerationMethod;
  baseAbilities: AbilityScores;
  rolledSets?: {
    rolls: { id: string; dice: number[]; total: number }[];
    assignments: Record<AbilityScoreKey, string>; // abilityKey -> rollId
  };
  
  // Skills & Tools
  selectedClassSkills: SkillKey[];
  selectedOriginFeatSkills?: SkillKey[];
  selectedHumanBonusSkill?: SkillKey;
  expertiseSkills?: SkillKey[]; // e.g. Rogue expertise
  
  // Feats & Choices
  selectedOriginFeatId?: string; // Human bonus origin feat
  magicInitiateChoices?: {
    spellList: 'Cleric' | 'Druid' | 'Wizard';
    cantrips: string[];
    l1Spell: string;
  };
  
  // Equipment
  equipmentOption: 'optionA' | 'optionB';
  inventory: CharacterItem[];
  equippedArmorId?: string;
  equippedShieldId?: string;
  gold: number;
  
  // Spells
  chosenCantrips: string[];
  chosenL1Spells: string[];
  
  // Notes
  notes?: string;
}

export interface DerivedCharacterStats {
  level: number;
  proficiencyBonus: number;
  finalAbilities: AbilityScores;
  modifiers: Record<AbilityScoreKey, number>;
  savingThrows: Record<AbilityScoreKey, { proficient: boolean; bonus: number }>;
  skills: Record<SkillKey, { proficient: boolean; expertise: boolean; bonus: number; source: string }>;
  
  maxHp: number;
  currentHp: number;
  tempHp: number;
  hitDice: {
    total: number;
    die: number;
    used: number;
  };
  
  armorClass: number;
  armorClassBreakdown: string;
  initiative: number;
  speed: number;
  size: string;
  
  passivePerception: number;
  passiveInvestigation: number;
  passiveInsight: number;
  
  spellcasting?: {
    ability: AbilityScoreKey;
    spellSaveDC: number;
    spellAttackModifier: number;
    cantripsKnown: number;
    spellsPrepared: number;
    slotsTotal: { [level: number]: number };
    slotsExpended: { [level: number]: number };
  };
  
  weaponAttacks: CharacterWeaponAttack[];
  totalWeight: number;
}

