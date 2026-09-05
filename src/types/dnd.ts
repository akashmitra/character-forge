export type AbilityScoreKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export type SkillKey =
  | 'Acrobatics'
  | 'Animal Handling'
  | 'Arcana'
  | 'Athletics'
  | 'Deception'
  | 'History'
  | 'Insight'
  | 'Intimidation'
  | 'Investigation'
  | 'Medicine'
  | 'Nature'
  | 'Perception'
  | 'Performance'
  | 'Persuasion'
  | 'Religion'
  | 'Sleight of Hand'
  | 'Stealth'
  | 'Survival';

export interface ClassFeature {
  name: string;
  level: number;
  description: string;
  phbPage: number;
  choices?: {
    name: string;
    description: string;
  }[];
}

export interface StartingEquipmentChoice {
  label: string;
  items: {
    name: string;
    quantity: number;
  }[];
  goldValueEquivalent?: number;
}

export interface DndClass {
  id: string;
  name: string;
  tagline: string;
  description: string;
  hitDie: 6 | 8 | 10 | 12;
  primaryAbility: AbilityScoreKey[];
  savingThrows: AbilityScoreKey[];
  armorTraining: string[];
  weaponTraining: string[];
  toolProficiencies?: string[];
  skillChoices: {
    count: number;
    options: SkillKey[];
  };
  weaponMasteryCount: number;
  spellcasterType?: 'full' | 'half' | 'pact' | 'none';
  spellcastingAbility?: AbilityScoreKey;
  cantripsKnownL1?: number;
  spellsPreparedL1?: number;
  spellSlotsL1?: { [level: number]: number };
  features: ClassFeature[];
  startingEquipmentOptions: {
    optionA: {
      name: string;
      items: string[];
      description: string;
    };
    optionBGold: number;
  };
  phbPage: number;
}

export interface SpeciesLineage {
  id: string;
  name: string;
  description: string;
  traits: {
    name: string;
    description: string;
    phbPage: number;
  }[];
  spellsGranted?: string[];
  phbPage: number;
}

export interface DndSpecies {
  id: string;
  name: string;
  tagline: string;
  description: string;
  size: 'Medium' | 'Small' | 'Medium or Small';
  speed: number;
  traits: {
    name: string;
    description: string;
    phbPage: number;
  }[];
  lineageTitle?: string;
  lineages?: SpeciesLineage[];
  specialOriginFeatChoice?: boolean; // For Human (Versatile)
  specialSkillChoice?: boolean; // For Human (Skillful)
  phbPage: number;
}

export interface DndBackground {
  id: string;
  name: string;
  flavor: string;
  abilityScoreOptions: AbilityScoreKey[];
  featId: string;
  skills: SkillKey[];
  toolProficiency: string;
  equipmentPackage: string[];
  startingGold: number;
  phbPage: number;
}

export interface DndFeat {
  id: string;
  name: string;
  category: 'Origin' | 'General' | 'Fighting Style' | 'Epic Boon';
  prerequisite?: string;
  description: string;
  bullets: string[];
  phbPage: number;
  grantsSpellsChoice?: {
    spellList: 'Cleric' | 'Druid' | 'Wizard';
    cantripCount: number;
    l1Count: number;
  };
  grantsSkillChoicesCount?: number;
}

export type WeaponMasteryProperty =
  | 'Cleave'
  | 'Graze'
  | 'Nick'
  | 'Push'
  | 'Sap'
  | 'Slow'
  | 'Topple'
  | 'Vex';

export interface WeaponItem {
  id: string;
  name: string;
  category: 'Simple Melee' | 'Simple Ranged' | 'Martial Melee' | 'Martial Ranged';
  damage: string;
  damageType: 'Bludgeoning' | 'Piercing' | 'Slashing';
  properties: string[];
  mastery: WeaponMasteryProperty;
  weight: number;
  costGold: number;
  range?: string;
  phbPage: number;
}

export interface ArmorItem {
  id: string;
  name: string;
  category: 'Light' | 'Medium' | 'Heavy' | 'Shield';
  baseAC: number;
  dexBonusType: 'Full' | 'Max2' | 'None';
  strengthRequirement?: number;
  stealthDisadvantage: boolean;
  weight: number;
  costGold: number;
  phbPage: number;
}

export interface GeneralItem {
  id: string;
  name: string;
  category: 'Adventuring Gear' | 'Tool' | 'Pack' | 'Focus' | 'Ammunition';
  description?: string;
  contents?: string[];
  weight: number;
  costGold: number;
  phbPage: number;
}

export interface DndSpell {
  id: string;
  name: string;
  level: 0 | 1;
  school: 'Abjuration' | 'Conjuration' | 'Divination' | 'Enchantment' | 'Evocation' | 'Illusion' | 'Necromancy' | 'Transmutation';
  classes: string[];
  castingTime: string;
  range: string;
  components: {
    verbal: boolean;
    somatic: boolean;
    material: boolean;
    materialText?: string;
  };
  duration: string;
  concentration: boolean;
  ritual: boolean;
  description: string;
  higherLevels?: string;
  phbPage: number;
}

