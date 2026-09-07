import React, { useState } from 'react';
import { useCharacter } from '../../state/CharacterContext';
import { AbilityScoreKey } from '../../types/dnd';
import { AbilityScores } from '../../types/character';
import {
  STANDARD_ARRAY,
  POINT_BUY_TOTAL,
  POINT_BUY_COSTS,
  ABILITY_KEYS,
  ABILITY_NAMES,
  ABILITY_DESCRIPTIONS,
  getAbilityModifier,
  formatModifier,
  roll4d6DropLowest,
  calculatePointBuySpent
} from '../../engine/abilityScores';
import { ParchmentCard } from '../common/ParchmentCard';
import { Dices, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export const StepAbilities: React.FC = () => {
  const { character, updateCharacter, derivedStats } = useCharacter();
  const [selectedDieId, setSelectedDieId] = useState<string | null>(null);

  const setMethod = (method: 'manual' | 'pointbuy' | 'roll') => {
    if (method === 'manual') {
      updateCharacter({
        abilityMethod: 'manual'
      });
    } else if (method === 'pointbuy') {
      updateCharacter({
        abilityMethod: 'pointbuy',
        baseAbilities: { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 }
      });
    } else if (method === 'roll') {
      // Roll fresh 6 sets
      const newRolls = [1, 2, 3, 4, 5, 6].map(i => {
        const r = roll4d6DropLowest();
        return {
          id: 'roll_' + i + '_' + Date.now(),
          dice: r.dice,
          total: r.total
        };
      });
      const initialAssign: Record<AbilityScoreKey, string> = {
        str: newRolls[0].id,
        dex: newRolls[1].id,
        con: newRolls[2].id,
        int: newRolls[3].id,
        wis: newRolls[4].id,
        cha: newRolls[5].id
      };
      const newBase: AbilityScores = {
        str: newRolls[0].total,
        dex: newRolls[1].total,
        con: newRolls[2].total,
        int: newRolls[3].total,
        wis: newRolls[4].total,
        cha: newRolls[5].total
      };

      updateCharacter({
        abilityMethod: 'roll',
        baseAbilities: newBase,
        rolledSets: {
          rolls: newRolls,
          assignments: initialAssign
        }
      });
    }
  };

  // Point Buy handlers
  const handlePointBuyChange = (ability: AbilityScoreKey, delta: number) => {
    const current = character.baseAbilities[ability];
    const target = current + delta;
    if (target < 8 || target > 15) return;

    const newAbilities = { ...character.baseAbilities, [ability]: target };
    const spent = calculatePointBuySpent(newAbilities);
    if (spent <= POINT_BUY_TOTAL) {
      updateCharacter({ baseAbilities: newAbilities });
    }
  };

  // Roll Re-roll All
  const handleRerollAll = () => {
    const newRolls = [1, 2, 3, 4, 5, 6].map(i => {
      const r = roll4d6DropLowest();
      return {
        id: 'roll_' + i + '_' + Date.now(),
        dice: r.dice,
        total: r.total
      };
    });
    const newAssign: Record<AbilityScoreKey, string> = {
      str: newRolls[0].id,
      dex: newRolls[1].id,
      con: newRolls[2].id,
      int: newRolls[3].id,
      wis: newRolls[4].id,
      cha: newRolls[5].id
    };
    const newBase: AbilityScores = {
      str: newRolls[0].total,
      dex: newRolls[1].total,
      con: newRolls[2].total,
      int: newRolls[3].total,
      wis: newRolls[4].total,
      cha: newRolls[5].total
    };
    updateCharacter({
      baseAbilities: newBase,
      rolledSets: {
        rolls: newRolls,
        assignments: newAssign
      }
    });
  };

  // Assign rolled die to slot
  const handleSlotClick = (targetAbility: AbilityScoreKey) => {
    if (!selectedDieId || !character.rolledSets) return;

    const currentAssignments = { ...(character.rolledSets.assignments || {}) };
    const roll = character.rolledSets.rolls.find(r => r.id === selectedDieId);
    if (!roll) return;

    // Check if another ability already had this rollId, swap or clear it
    const previousAbility = (Object.keys(currentAssignments) as AbilityScoreKey[]).find(
      k => currentAssignments[k] === selectedDieId
    );

    if (previousAbility && previousAbility !== targetAbility) {
      const existingTargetRollId = currentAssignments[targetAbility];
      currentAssignments[previousAbility] = existingTargetRollId;
      const prevRoll = character.rolledSets.rolls.find(r => r.id === existingTargetRollId);
      if (prevRoll) {
        character.baseAbilities[previousAbility] = prevRoll.total;
      }
    }

    currentAssignments[targetAbility] = selectedDieId;
    const newBaseAbilities = {
      ...character.baseAbilities,
      [targetAbility]: roll.total
    };

    updateCharacter({
      baseAbilities: newBaseAbilities,
      rolledSets: {
        ...character.rolledSets,
        assignments: currentAssignments
      }
    });
    setSelectedDieId(null);
  };

  const pointBuySpent = calculatePointBuySpent(character.baseAbilities);
  const pointBuyRemaining = POINT_BUY_TOTAL - pointBuySpent;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header & Generation Mode Tabs */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div>
            <h2 className="font-cinzel text-xl font-bold text-parchment tracking-wide">
              Ability Scores Generation
            </h2>
            <p className="text-xs font-sans text-parchment-dim">
              Determine your 6 core ability scores: Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma.
            </p>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1 bg-ink-pure p-1 rounded border border-parchment-border/40 text-xs font-sans">
            <button
              type="button"
              onClick={() => setMethod('manual')}
              className={`px-3 py-1.5 rounded transition-all ${
                character.abilityMethod === 'manual' || character.abilityMethod === 'standard'
                  ? 'bg-dnd-gold text-ink-pure font-bold shadow-sm'
                  : 'text-parchment-dim hover:text-parchment'
              }`}
            >
              Manual Entry
            </button>
            <button
              type="button"
              onClick={() => setMethod('pointbuy')}
              className={`px-3 py-1.5 rounded transition-all ${
                character.abilityMethod === 'pointbuy'
                  ? 'bg-dnd-gold text-ink-pure font-bold shadow-sm'
                  : 'text-parchment-dim hover:text-parchment'
              }`}
            >
              Point Buy (27 pts)
            </button>
            <button
              type="button"
              onClick={() => setMethod('roll')}
              className={`px-3 py-1.5 rounded transition-all ${
                character.abilityMethod === 'roll'
                  ? 'bg-dnd-crimson text-parchment font-bold shadow-sm'
                  : 'text-parchment-dim hover:text-parchment'
              }`}
            >
              Roll 4d6 Drop Lowest
            </button>
          </div>
        </div>
      </div>

      {/* Manual Entry Helper Banner */}
      {(character.abilityMethod === 'manual' || character.abilityMethod === 'standard') && (
        <div className="p-3 rounded bg-ink-pure/80 border border-parchment-border/40 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-dnd-gold" />
            <span>
              Manual Input Mode: <span className="text-parchment-light">Type custom scores (1–30) or use the preset shortcuts.</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-parchment-dim text-[11px]">Presets:</span>
            <button
              type="button"
              onClick={() => updateCharacter({ baseAbilities: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 } })}
              className="px-2.5 py-1 rounded bg-ink-light border border-parchment-border/40 hover:border-dnd-gold text-parchment text-[11px] font-medium transition-colors"
            >
              Standard (15, 14, 13, 12, 10, 8)
            </button>
            <button
              type="button"
              onClick={() => updateCharacter({ baseAbilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 } })}
              className="px-2.5 py-1 rounded bg-ink-light border border-parchment-border/40 hover:border-dnd-gold text-parchment text-[11px] font-medium transition-colors"
            >
              All 10s
            </button>
          </div>
        </div>
      )}

      {/* Point Buy Status Bar */}
      {character.abilityMethod === 'pointbuy' && (
        <div className="p-3 rounded bg-ink-pure/80 border border-dnd-gold/40 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-dnd-gold" />
            <span>
              Point Buy Pool: <strong className="text-parchment font-bold">{pointBuySpent} / 27 Points Spent</strong>
            </span>
          </div>
          <div className={`font-bold ${pointBuyRemaining === 0 ? 'text-dnd-moss-light' : 'text-dnd-gold-light'}`}>
            {pointBuyRemaining === 0 ? '✓ All 27 Points Allocated' : `${pointBuyRemaining} Points Remaining`}
          </div>
        </div>
      )}

      {/* 4d6 Dice Pool Display */}
      {character.abilityMethod === 'roll' && character.rolledSets && (
        <div className="p-3.5 rounded bg-ink-pure/80 border border-dnd-crimson/50 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-dnd-gold">
              <Dices className="w-4 h-4" />
              <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider">
                Rolled 4d6 Dice Pool (Drop Lowest)
              </h4>
            </div>
            <button
              type="button"
              onClick={handleRerollAll}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-dnd-crimson hover:bg-dnd-crimson-light text-parchment font-sans text-xs font-semibold transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reroll All Six</span>
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {character.rolledSets.rolls.map((r, idx) => {
              const isSelected = selectedDieId === r.id;
              const assignedAbility = (Object.keys(character.rolledSets?.assignments || {}) as AbilityScoreKey[]).find(
                k => character.rolledSets?.assignments[k] === r.id
              );

              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedDieId(r.id)}
                  className={`p-2 rounded border text-center transition-all ${
                    isSelected
                      ? 'border-dnd-gold bg-dnd-gold/30 shadow-dnd-glow ring-2 ring-dnd-gold'
                      : 'border-parchment-border/30 bg-ink-pure/90 hover:border-parchment-border'
                  }`}
                >
                  <div className="font-cinzel text-2xl font-black text-parchment-light">
                    {r.total}
                  </div>
                  <div className="text-[10px] font-sans text-parchment-dim">
                    [{r.dice.join(', ')}]
                  </div>
                  {assignedAbility && (
                    <div className="text-[10px] font-sans font-bold text-dnd-gold uppercase mt-1">
                      → {assignedAbility}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] font-sans text-parchment-dim italic">
            {selectedDieId ? 'Now click an ability slot below to assign this rolled score.' : 'Click a rolled number above, then click an ability card below to assign it.'}
          </p>
        </div>
      )}

      {/* 6 Ability Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ABILITY_KEYS.map((key) => {
          const base = character.baseAbilities[key];
          const finalScore = derivedStats.finalAbilities[key];
          const mod = derivedStats.modifiers[key];
          const isPlusTwo = character.asiSelection.plusTwo === key;
          const isPlusOne = character.asiSelection.plusOnes.includes(key);
          const bonusAmt = isPlusTwo ? 2 : isPlusOne ? 1 : 0;

          return (
            <div
              key={key}
              onClick={() => character.abilityMethod === 'roll' && selectedDieId && handleSlotClick(key)}
              className={`p-4 rounded border text-left transition-all ${
                character.abilityMethod === 'roll' && selectedDieId
                  ? 'border-dnd-gold/60 bg-ink-light/40 cursor-pointer hover:ring-2 hover:ring-dnd-gold'
                  : 'border-parchment-border/30 bg-gradient-to-b from-[#241F18] to-[#16130F]'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-parchment-border/20 pb-2 mb-3">
                <div>
                  <span className="text-[10px] font-sans uppercase font-bold text-dnd-gold tracking-wider">
                    {key.toUpperCase()}
                  </span>
                  <h3 className="font-cinzel text-base font-bold text-parchment-light">
                    {ABILITY_NAMES[key]}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="font-cinzel text-xl font-bold text-dnd-gold">
                    {formatModifier(mod)}
                  </span>
                  <span className="block text-[10px] font-sans text-parchment-dim">Modifier</span>
                </div>
              </div>

              {/* Big Score Display */}
              <div className="flex items-center justify-between p-2.5 rounded bg-ink-pure/60 border border-parchment-border/20 mb-3">
                <div>
                  <span className="text-[10px] font-sans text-parchment-dim block">Final Score</span>
                  <span className="font-cinzel text-3xl font-black text-parchment-light">
                    {finalScore}
                  </span>
                </div>
                <div className="text-right text-xs font-sans text-parchment-dim space-y-0.5">
                  <div>Base: <strong className="text-parchment">{base}</strong></div>
                  {bonusAmt > 0 && (
                    <div className="text-dnd-gold font-bold">
                      +{bonusAmt} Background
                    </div>
                  )}
                </div>
              </div>

              {/* Mode-specific controls */}
              {(character.abilityMethod === 'manual' || character.abilityMethod === 'standard') && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-sans text-parchment-dim">
                    <span>Base Score:</span>
                    <span className="text-[10px] text-dnd-gold font-medium">1 – 30</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const val = Math.max(1, base - 1);
                        updateCharacter({
                          baseAbilities: { ...character.baseAbilities, [key]: val }
                        });
                      }}
                      className="w-8 h-8 rounded border border-parchment-border/40 bg-ink-pure hover:bg-ink-light font-bold text-sm text-parchment flex items-center justify-center transition-colors shadow-inner"
                      title="Decrease base score"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={base || ''}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === '') {
                          updateCharacter({
                            baseAbilities: { ...character.baseAbilities, [key]: 10 }
                          });
                          return;
                        }
                        const parsed = parseInt(raw, 10);
                        if (!isNaN(parsed)) {
                          const val = Math.min(30, Math.max(1, parsed));
                          updateCharacter({
                            baseAbilities: { ...character.baseAbilities, [key]: val }
                          });
                        }
                      }}
                      className="w-full text-center py-1.5 px-2 rounded bg-ink-pure border border-parchment-border/50 text-parchment font-cinzel text-base font-bold focus:outline-none focus:border-dnd-gold focus:ring-1 focus:ring-dnd-gold transition-all"
                      placeholder="10"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = Math.min(30, base + 1);
                        updateCharacter({
                          baseAbilities: { ...character.baseAbilities, [key]: val }
                        });
                      }}
                      className="w-8 h-8 rounded border border-parchment-border/40 bg-ink-pure hover:bg-ink-light font-bold text-sm text-parchment flex items-center justify-center transition-colors shadow-inner"
                      title="Increase base score"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {character.abilityMethod === 'pointbuy' && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-sans text-parchment-dim">
                    Cost: {POINT_BUY_COSTS[base]} pts
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={base <= 8}
                      onClick={() => handlePointBuyChange(key, -1)}
                      className="w-7 h-7 rounded border border-parchment-border/40 bg-ink-pure hover:bg-ink-light disabled:opacity-30 font-bold text-sm text-parchment flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-xs font-sans text-parchment">{base}</span>
                    <button
                      type="button"
                      disabled={base >= 15 || (POINT_BUY_COSTS[base + 1] - POINT_BUY_COSTS[base] > pointBuyRemaining)}
                      onClick={() => handlePointBuyChange(key, 1)}
                      className="w-7 h-7 rounded border border-parchment-border/40 bg-ink-pure hover:bg-ink-light disabled:opacity-30 font-bold text-sm text-parchment flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {character.abilityMethod === 'roll' && (
                <div className="text-[11px] font-sans text-parchment-dim">
                  {selectedDieId ? (
                    <span className="text-dnd-gold font-semibold animate-pulse">Click here to slot die</span>
                  ) : (
                    <span>Assigned from roll pool</span>
                  )}
                </div>
              )}

              <p className="text-[11px] font-sans text-parchment-dark/70 mt-3 pt-2 border-t border-parchment-border/15 line-clamp-2">
                {ABILITY_DESCRIPTIONS[key]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
