import React from 'react';
import { useCharacter } from '../../state/CharacterContext';
import { DndSpecies, SkillKey } from '../../types/dnd';
import speciesData from '../../data/species.json';
import featsData from '../../data/feats.json';
import { SKILL_ABILITY_MAP } from '../../engine/statsCalculator';
import { ParchmentCard } from '../common/ParchmentCard';
import { PHBBadge } from '../common/PHBBadge';
import { Sparkles, User, Shield } from 'lucide-react';

const SPECIES = speciesData as DndSpecies[];
const ALL_SKILLS = Object.keys(SKILL_ABILITY_MAP) as SkillKey[];
const ORIGIN_FEATS = featsData.filter(f => f.category === 'Origin');

export const StepSpecies: React.FC = () => {
  const { character, updateCharacter } = useCharacter();
  const selectedSpecies = SPECIES.find(s => s.id === character.speciesId) || SPECIES[0];

  const handleSelectSpecies = (sp: DndSpecies) => {
    const defaultLineage = sp.lineages?.[0]?.id;
    updateCharacter({
      speciesId: sp.id,
      lineageId: defaultLineage,
      selectedHumanBonusSkill: sp.id === 'human' ? 'Insight' : undefined,
      selectedOriginFeatId: sp.id === 'human' ? 'alert' : undefined
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Species Selection Grid */}
      <div>
        <h2 className="font-cinzel text-xl font-bold text-parchment tracking-wide mb-1">
          Choose a Species
        </h2>
        <p className="text-xs font-sans text-parchment-dim mb-4">
          In 2024 D&amp;D rules, species provides physical traits, senses (like Darkvision), innate magical bloodlines, and unique survival gifts.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SPECIES.map((sp) => {
            const isSelected = character.speciesId === sp.id;
            return (
              <button
                key={sp.id}
                type="button"
                onClick={() => handleSelectSpecies(sp)}
                className={`p-3 rounded border text-left transition-all ${
                  isSelected
                    ? 'border-dnd-gold bg-gradient-to-b from-[#352518] to-[#1E1914] shadow-dnd-glow ring-1 ring-dnd-gold/60'
                    : 'border-parchment-border/30 bg-ink-pure/70 hover:border-parchment-border/70 hover:bg-ink-light/50'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-cinzel text-sm font-bold text-parchment-light">
                    {sp.name}
                  </span>
                  <span className="text-[10px] font-sans font-semibold text-parchment-dim">
                    {sp.speed}ft
                  </span>
                </div>
                <p className="text-[11px] font-sans text-parchment-dim line-clamp-2 leading-snug">
                  {sp.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Species Details */}
      <ParchmentCard
        title={`${selectedSpecies.name} — Traits & Heritage`}
        subtitle={selectedSpecies.tagline}
        badge={<PHBBadge page={selectedSpecies.phbPage} topic={selectedSpecies.name} />}
      >
        <div className="space-y-5 mt-3">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded bg-ink-pure/60 border border-parchment-border/20 text-xs font-sans">
            <div>
              <span className="text-parchment-dim block text-[10px] uppercase">Creature Size:</span>
              <span className="font-bold text-parchment-light text-sm">{selectedSpecies.size}</span>
            </div>
            <div>
              <span className="text-parchment-dim block text-[10px] uppercase">Speed:</span>
              <span className="font-bold text-dnd-gold text-sm">{selectedSpecies.speed} feet</span>
            </div>
            <div>
              <span className="text-parchment-dim block text-[10px] uppercase">Special Senses:</span>
              <span className="font-medium text-parchment-light">
                {selectedSpecies.traits.find(t => t.name.includes('Darkvision')) ? 'Darkvision' : 'Standard'}
              </span>
            </div>
          </div>

          {/* Lineage / Ancestry Selection (if applicable) */}
          {selectedSpecies.lineages && selectedSpecies.lineages.length > 0 && (
            <div className="p-3.5 rounded bg-ink-pure/50 border border-dnd-gold/30">
              <span className="block text-xs font-cinzel font-bold text-dnd-gold mb-2 uppercase tracking-wide">
                Select {selectedSpecies.lineageTitle || 'Heritage / Lineage'}:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {selectedSpecies.lineages.map((lin) => {
                  const isLinSelected = character.lineageId === lin.id || (!character.lineageId && lin === selectedSpecies.lineages?.[0]);
                  return (
                    <button
                      key={lin.id}
                      type="button"
                      onClick={() => updateCharacter({ lineageId: lin.id })}
                      className={`p-2.5 rounded border text-left transition-all ${
                        isLinSelected
                          ? 'border-dnd-gold bg-dnd-gold/20 text-parchment shadow-sm ring-1 ring-dnd-gold'
                          : 'border-parchment-border/30 bg-ink-pure/60 text-parchment-dim hover:border-parchment-border hover:text-parchment'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-cinzel text-xs font-bold text-parchment-light">
                          {lin.name}
                        </span>
                        <PHBBadge page={lin.phbPage} />
                      </div>
                      <p className="text-[11px] font-sans text-parchment-dim leading-snug">
                        {lin.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Human Versatile & Skillful Choices */}
          {selectedSpecies.id === 'human' && (
            <div className="p-3.5 rounded bg-ink-pure/50 border border-dnd-moss/40 space-y-3">
              <div className="flex items-center gap-2 text-dnd-moss-light">
                <Sparkles className="w-4 h-4" />
                <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider">
                  Human Versatile &amp; Skillful Customization
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                <div>
                  <label className="block text-parchment-dim font-semibold mb-1">
                    Bonus Skill Proficiency (Skillful trait):
                  </label>
                  <select
                    value={character.selectedHumanBonusSkill || 'Insight'}
                    onChange={(e) => updateCharacter({ selectedHumanBonusSkill: e.target.value as SkillKey })}
                    className="w-full px-2.5 py-1.5 rounded bg-ink-pure border border-parchment-border/40 text-parchment focus:border-dnd-gold"
                  >
                    {ALL_SKILLS.map(sk => (
                      <option key={sk} value={sk}>{sk}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-parchment-dim font-semibold mb-1">
                    Bonus Origin Feat (Versatile trait):
                  </label>
                  <select
                    value={character.selectedOriginFeatId || 'alert'}
                    onChange={(e) => updateCharacter({ selectedOriginFeatId: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded bg-ink-pure border border-parchment-border/40 text-parchment focus:border-dnd-gold"
                  >
                    {ORIGIN_FEATS.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Species Traits List */}
          <div>
            <h4 className="font-cinzel text-sm font-bold text-dnd-gold mb-2.5 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-dnd-gold" />
              <span>Innate Species Traits</span>
            </h4>
            <div className="space-y-2.5">
              {selectedSpecies.traits.map((trait, tIdx) => (
                <div key={tIdx} className="p-3 rounded bg-ink-pure/40 border border-parchment-border/25">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-cinzel text-xs sm:text-sm font-bold text-parchment-light">
                      {trait.name}
                    </span>
                    <PHBBadge page={trait.phbPage} topic={trait.name} />
                  </div>
                  <p className="text-xs font-sans text-parchment-dark/85 leading-relaxed">
                    {trait.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ParchmentCard>
    </div>
  );
};

