import { WeaponMasteryProperty } from '../types/dnd';

export interface MasteryDetail {
  property: WeaponMasteryProperty;
  name: string;
  summary: string;
  rule: string;
  phbPage: number;
}

export const WEAPON_MASTERIES: Record<WeaponMasteryProperty, MasteryDetail> = {
  Cleave: {
    property: 'Cleave',
    name: 'Cleave',
    summary: 'Hit a second adjacent enemy on a melee strike.',
    rule: 'If you hit a creature with a melee attack roll using this weapon, you can make a melee attack roll with the weapon against a second creature within 5 feet of the first that is also within your reach. On a hit, the second creature takes the weapon\'s damage (without ability modifier, unless negative). Usable once per turn.',
    phbPage: 214
  },
  Graze: {
    property: 'Graze',
    name: 'Graze',
    summary: 'Deal damage equal to your ability modifier even on a miss.',
    rule: 'If your attack roll with this weapon misses a creature, you can deal damage to that creature equal to the ability modifier you used to make the attack roll. This damage is the same type dealt by the weapon, and it cannot be increased in any way.',
    phbPage: 214
  },
  Nick: {
    property: 'Nick',
    name: 'Nick',
    summary: 'Make the extra Light weapon attack as part of the Attack action instead of a Bonus Action.',
    rule: 'When you make the extra attack of the Light weapon property, you can make it as part of the Attack action instead of as a Bonus Action. You can make this extra attack only once per turn.',
    phbPage: 214
  },
  Push: {
    property: 'Push',
    name: 'Push',
    summary: 'Push a hit target straight back up to 10 feet.',
    rule: 'If you hit a creature with this weapon, you can push the creature up to 10 feet straight away from you if it is Large or smaller.',
    phbPage: 214
  },
  Sap: {
    property: 'Sap',
    name: 'Sap',
    summary: 'Impose Disadvantage on the target\'s next attack roll.',
    rule: 'If you hit a creature with this weapon, that creature has Disadvantage on its next attack roll before the start of your next turn.',
    phbPage: 214
  },
  Slow: {
    property: 'Slow',
    name: 'Slow',
    summary: 'Reduce the target\'s speed by 10 feet on hit.',
    rule: 'If you hit a creature with this weapon and deal damage, you can reduce its speed by 10 feet until the start of your next turn. If you hit the creature more than once with this property, the speed reduction does not stack.',
    phbPage: 214
  },
  Topple: {
    property: 'Topple',
    name: 'Topple',
    summary: 'Force the hit target to make a Con save or fall Prone.',
    rule: 'If you hit a creature with this weapon, you can force the creature to make a Constitution saving throw with a DC equal to 8 + your Proficiency Bonus + the ability modifier used for the attack. On a failed save, the creature falls Prone.',
    phbPage: 214
  },
  Vex: {
    property: 'Vex',
    name: 'Vex',
    summary: 'Gain Advantage on your next attack roll against the target.',
    rule: 'If you hit a creature with this weapon and deal damage, you have Advantage on your next attack roll against that creature before the end of your next turn.',
    phbPage: 214
  }
};

