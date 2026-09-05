import { AbilityScoreKey } from '../types/dnd';
import { AbilityScores } from '../types/character';

export const STANDARD_ARRAY: number[] = [15, 14, 13, 12, 10, 8];

export const POINT_BUY_TOTAL = 27;

export const POINT_BUY_COSTS: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9
};

export const ABILITY_KEYS: AbilityScoreKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

export const ABILITY_NAMES: Record<AbilityScoreKey, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma'
};

export const ABILITY_DESCRIPTIONS: Record<AbilityScoreKey, string> = {
  str: 'Natural athleticism, physical power, and melee weapon force.',
  dex: 'Agility, reflexes, balance, and finesse or ranged combat precision.',
  con: 'Health, stamina, vital force, and resilience against exhaustion or toxins.',
  int: 'Mental acuity, information recall, analytical skill, and arcane study.',
  wis: 'Perceptiveness, intuition, willpower, and communion with primal or divine forces.',
  cha: 'Confidence, eloquence, force of personality, and leadership presence.'
};

export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

export function roll4d6DropLowest(): { dice: number[]; dropped: number; total: number } {
  const dice = [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1
  ];
  const sorted = [...dice].sort((a, b) => a - b);
  const dropped = sorted[0];
  const total = sorted[1] + sorted[2] + sorted[3];
  return { dice, dropped, total };
}

export function calculatePointBuySpent(abilities: AbilityScores): number {
  return ABILITY_KEYS.reduce((sum, key) => {
    const val = abilities[key];
    return sum + (POINT_BUY_COSTS[val] ?? 0);
  }, 0);
}
