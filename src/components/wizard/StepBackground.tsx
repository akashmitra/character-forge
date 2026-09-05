import React from 'react';
import { useCharacter } from '../../state/CharacterContext';
import { DndBackground, AbilityScoreKey, SkillKey, DndFeat } from '../../types/dnd';
import backgroundsData from '../../data/backgrounds.json';
import featsData from '../../data/feats.json';
import spellsData from '../../data/spells.json';
import { ABILITY_NAMES } from '../../engine/abilityScores';
import { SKILL_ABILITY_MAP } from '../../engine/statsCalculator';
import { ParchmentCard } from '../common/ParchmentCard';
import { PHBBadge } from '../common/PHBBadge';
import { Award, Sparkles, Check } from 'lucide-react';

const BACKGROUNDS = backgroundsData as DndBackground[];
const ALL_FEATS = featsData as DndFeat[];
const ALL_SKILLS = Object.keys(SKILL_ABILITY_MAP) as SkillKey[];

export const StepBackground: React.FC = () => {
  const { character, updateCharacter } = useCharacter();
  const selectedBg = BACKGROUNDS.find(b => b.id === character.backgroundId) || BACKGROUNDS[0];
  const originFeat = ALL_FEATS.find(f => f.id === selectedBg.featId);

  const handleSelectBackground = (bg: DndBackground) => {
    // Set default ASI to +2 to first, +1 to second
    updateCharacter({
      backgroundId: bg.id,
      asiSelection: {
        mode: '2/1',
        plusTwo: bg.abilityScoreOptions[0],
        plusOnes: [bg.abilityScoreOptions[1]]
      },
      selectedOriginFeatSkills: []
    });
  };

  const handleAsiModeChange = (mode: '2/1' | '1/1/1') => {
    if (mode === '2/1') {
      updateCharacter({
        asiSelection: {
          mode: '2/1',
          plusTwo: selectedBg.abilityScoreOptions[0],
          plusOnes: [selectedBg.abilityScoreOptions[1]]
        }
      });
    } else {
      updateCharacter({
        asiSelection: {
          mode: '1/1/1',
          plusTwo: undefined,
          plusOnes: [...selectedBg.abilityScoreOptions]
        }
      });
    }
  };

  const handlePlusTwoChange = (ability: AbilityScoreKey) => {
    // Remaining abilities in background triad
    const remaining = selectedBg.abilityScoreOptions.filter(a => a !== ability);
    const currentPlusOne = character.asiSelection.plusOnes[0];
    const newPlusOne = remaining.includes(currentPlusOne) ? currentPlusOne : remaining[0];

    updateCharacter({
      asiSelection: {
        mode: '2/1',
        plusTwo: ability,
        plusOnes: [newPlusOne]
      }
    });
  };

  const handlePlusOneChange = (ability: AbilityScoreKey) => {
    updateCharacter({
      asiSelection: {
        ...character.asiSelection,
        plusOnes: [ability]
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Background Selection Grid */}
      <div>
        <h2 className="font-cinzel text-xl font-bold text-parchment tracking-wide mb-1">
          Choose a Background
        </h2>
        <p className="text-xs font-sans text-parchment-dim mb-4">
          In 2024 D&amp;D rules, your Background determines your +2/+1 or +1/+1/+1 Ability Score Increases, your Origin Feat, 2 Skill Proficiencies, Tool Proficiency, and Starting Gold.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {BACKGROUNDS.map((bg) => {
            const isSelected = character.backgroundId === bg.id;
            return (
              <button
                key={bg.id}
                type="button"
                onClick={() => handleSelectBackground(bg)}
                className={`p-3 rounded border text-left transition-all ${
                  isSelected
                    ? 'border-dnd-gold bg-gradient-to-b from-[#352518] to-[#1E1914] shadow-dnd-glow ring-1 ring-dnd-gold/60'
                    : 'border-parchment-border/30 bg-ink-pure/70 hover:border-parchment-border/70 hover:bg-ink-light/50'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-cinzel text-sm font-bold text-parchment-light">
                    {bg.name}
                  </span>
                  <span className="text-[10px] font-sans font-semibold text-dnd-gold uppercase">
                    {bg.abilityScoreOptions.join('/')}
                  </span>
                </div>
                <p className="text-[11px] font-sans text-parchment-dim line-clamp-2 leading-snug">
                  {bg.flavor}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Background Breakdown */}
      <ParchmentCard
        title={`${selectedBg.name} — Background Features & Origin Feat`}
        subtitle={selectedBg.flavor}
        badge={<PHBBadge page={selectedBg.phbPage} topic={selectedBg.name} />}
      >
        <div className="space-y-5 mt-3">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded bg-ink-pure/60 border border-parchment-border/20 text-xs font-sans">
            <div>
              <span className="text-parchment-dim block text-[10px] uppercase">Background Skills:</span>
              <span className="font-bold text-parchment-light">{selectedBg.skills.join(', ')}</span>
            </div>
            <div>
              <span className="text-parchment-dim block text-[10px] uppercase">Tool Proficiency:</span>
              <span className="font-medium text-parchment-light">{selectedBg.toolProficiency}</span>
            </div>
            <div>
              <span className="text-parchment-dim block text-[10px] uppercase">Starting Package Gold:</span>
              <span className="font-bold text-dnd-gold">{selectedBg.startingGold} GP</span>
            </div>
          </div>

          {/* Ability Score Increases Allocation */}
          <div className="p-3.5 rounded bg-ink-pure/50 border border-dnd-gold/30">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="font-cinzel text-xs font-bold text-dnd-gold uppercase tracking-wider">
                  Ability Score Increase (Background ASI)
                </h4>
                <p className="text-[11px] font-sans text-parchment-dim">
                  Choose either +2 to one ability and +1 to another, or +1 to all three triad abilities: {selectedBg.abilityScoreOptions.map(a => ABILITY_NAMES[a]).join(', ')}.
                </p>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center gap-1 bg-ink-pure p-1 rounded border border-parchment-border/30 text-xs font-sans">
                <button
                  type="button"
                  onClick={() => handleAsiModeChange('2/1')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    character.asiSelection.mode === '2/1'
                      ? 'bg-dnd-gold text-ink-pure font-bold'
                      : 'text-parchment-dim hover:text-parchment'
                  }`}
                >
                  +2 / +1 Split
                </button>
                <button
                  type="button"
                  onClick={() => handleAsiModeChange('1/1/1')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    character.asiSelection.mode === '1/1/1'
                      ? 'bg-dnd-gold text-ink-pure font-bold'
                      : 'text-parchment-dim hover:text-parchment'
                  }`}
                >
                  +1 / +1 / +1 Split
                </button>
              </div>
            </div>

            {character.asiSelection.mode === '2/1' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                <div>
                  <label className="block text-parchment-dim font-semibold mb-1">
                    Grant <span className="text-dnd-gold font-bold">+2 Bonus</span> to:
                  </label>
                  <select
                    value={character.asiSelection.plusTwo}
                    onChange={(e) => handlePlusTwoChange(e.target.value as AbilityScoreKey)}
                    className="w-full px-2.5 py-1.5 rounded bg-ink-pure border border-parchment-border/40 text-parchment focus:border-dnd-gold"
                  >
                    {selectedBg.abilityScoreOptions.map(a => (
                      <option key={a} value={a}>{ABILITY_NAMES[a]} ({a.toUpperCase()})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-parchment-dim font-semibold mb-1">
                    Grant <span className="text-dnd-moss-light font-bold">+1 Bonus</span> to:
                  </label>
                  <select
                    value={character.asiSelection.plusOnes[0]}
                    onChange={(e) => handlePlusOneChange(e.target.value as AbilityScoreKey)}
                    className="w-full px-2.5 py-1.5 rounded bg-ink-pure border border-parchment-border/40 text-parchment focus:border-dnd-gold"
                  >
                    {selectedBg.abilityScoreOptions
                      .filter(a => a !== character.asiSelection.plusTwo)
                      .map(a => (
                        <option key={a} value={a}>{ABILITY_NAMES[a]} ({a.toUpperCase()})</option>
                      ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded bg-ink-pure/70 border border-parchment-border/20 text-xs font-sans text-parchment-dim flex items-center gap-2">
                <Check className="w-4 h-4 text-dnd-moss-light flex-shrink-0" />
                <span>
                  +1 added to each triad ability: <strong className="text-parchment-light">{selectedBg.abilityScoreOptions.map(a => ABILITY_NAMES[a]).join(', ')}</strong>.
                </span>
              </div>
            )}
          </div>

          {/* Origin Feat Detailed Box */}
          {originFeat && (
            <div className="p-3.5 rounded bg-ink-pure/40 border border-parchment-border/25">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-dnd-gold" />
                  <span className="font-cinzel text-sm font-bold text-parchment-light">
                    Origin Feat: {originFeat.name}
                  </span>
                </div>
                <PHBBadge page={originFeat.phbPage} topic={originFeat.name} />
              </div>

              <p className="text-xs font-sans text-parchment-dim mb-2 italic">
                {originFeat.description}
              </p>

              <ul className="list-disc list-inside text-xs font-sans text-parchment-dark/85 space-y-1">
                {originFeat.bullets.map((b, bIdx) => (
                  <li key={bIdx}>{b}</li>
                ))}
              </ul>

              {/* Skilled Feat 3 Skills Custom Selection */}
              {originFeat.id === 'skilled' && (
                <div className="mt-3 pt-2.5 border-t border-parchment-border/20">
                  <span className="block text-xs font-sans font-semibold text-dnd-gold mb-1.5 uppercase">
                    Choose 3 Bonus Proficiencies (Skilled Feat):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs font-sans">
                    {ALL_SKILLS.filter(sk => !selectedBg.skills.includes(sk)).slice(0, 9).map(sk => {
                      const isPicked = character.selectedOriginFeatSkills?.includes(sk);
                      return (
                        <button
                          key={sk}
                          type="button"
                          onClick={() => {
                            const cur = character.selectedOriginFeatSkills || [];
                            if (isPicked) {
                              updateCharacter({ selectedOriginFeatSkills: cur.filter(x => x !== sk) });
                            } else if (cur.length < 3) {
                              updateCharacter({ selectedOriginFeatSkills: [...cur, sk] });
                            }
                          }}
                          className={`p-1.5 rounded border text-left text-[11px] ${
                            isPicked
                              ? 'border-dnd-gold bg-dnd-gold/20 text-parchment font-semibold'
                              : 'border-parchment-border/20 text-parchment-dim'
                          }`}
                        >
                          {sk}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ParchmentCard>
    </div>
  );
};

