import React from 'react';
import { useCharacter } from '../../state/CharacterContext';
import { DndClass } from '../../types/dnd';
import classesData from '../../data/classes.json';
import equipmentData from '../../data/equipment.json';
import { WEAPON_MASTERIES } from '../../engine/weaponMastery';
import { ParchmentCard } from '../common/ParchmentCard';
import { PHBBadge } from '../common/PHBBadge';
import { Shield, Heart, Sparkles, Sword } from 'lucide-react';

const CLASSES = classesData as DndClass[];

export const StepClass: React.FC = () => {
  const { character, updateCharacter } = useCharacter();
  const selectedClass = CLASSES.find(c => c.id === character.classId) || CLASSES[0];

  const handleSelectClass = (cls: DndClass) => {
    // Reset class skills if class changed
    const newMasteries = cls.weaponMasteryCount > 0 ? ['longsword', 'greatsword', 'crossbow-light'].slice(0, cls.weaponMasteryCount) : [];
    updateCharacter({
      classId: cls.id,
      selectedClassSkills: [],
      weaponMasteryChoices: newMasteries,
      classFeatureChoices: {}
    });
  };

  const handleFeatureChoice = (featureName: string, choiceName: string) => {
    updateCharacter({
      classFeatureChoices: {
        ...(character.classFeatureChoices || {}),
        [featureName]: choiceName
      }
    });
  };

  const toggleWeaponMastery = (weaponId: string) => {
    const current = character.weaponMasteryChoices || [];
    if (current.includes(weaponId)) {
      updateCharacter({
        weaponMasteryChoices: current.filter(id => id !== weaponId)
      });
    } else {
      if (current.length < selectedClass.weaponMasteryCount) {
        updateCharacter({
          weaponMasteryChoices: [...current, weaponId]
        });
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Class Selection Grid */}
      <div>
        <h2 className="font-cinzel text-xl font-bold text-parchment tracking-wide mb-1">
          Choose a Class
        </h2>
        <p className="text-xs font-sans text-parchment-dim mb-4">
          Your class is the primary definition of what your character can do in combat, exploration, and spellcasting.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CLASSES.map((cls) => {
            const isSelected = character.classId === cls.id;
            return (
              <button
                key={cls.id}
                type="button"
                onClick={() => handleSelectClass(cls)}
                className={`p-3 rounded border text-left transition-all ${
                  isSelected
                    ? 'border-dnd-gold bg-gradient-to-b from-[#352518] to-[#1E1914] shadow-dnd-glow ring-1 ring-dnd-gold/60'
                    : 'border-parchment-border/30 bg-ink-pure/70 hover:border-parchment-border/70 hover:bg-ink-light/50'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-cinzel text-sm sm:text-base font-bold text-parchment-light">
                    {cls.name}
                  </span>
                  <span className="text-[11px] font-sans font-semibold text-dnd-gold">
                    d{cls.hitDie}
                  </span>
                </div>
                <p className="text-[11px] font-sans text-parchment-dim line-clamp-2 leading-snug">
                  {cls.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Class Deep-Dive Details */}
      <ParchmentCard
        title={`${selectedClass.name} — Class Features & Mechanics`}
        subtitle={selectedClass.tagline}
        badge={<PHBBadge page={selectedClass.phbPage} topic={selectedClass.name} />}
      >
        <div className="space-y-5 mt-3">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded bg-ink-pure/60 border border-parchment-border/20 text-xs font-sans">
            <div>
              <span className="text-parchment-dim block text-[10px] uppercase">Hit Die:</span>
              <span className="font-bold text-parchment-light text-sm flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-dnd-crimson-light" />
                1d{selectedClass.hitDie} per level
              </span>
            </div>
            <div>
              <span className="text-parchment-dim block text-[10px] uppercase">Saving Throws:</span>
              <span className="font-bold text-dnd-gold uppercase text-sm">
                {selectedClass.savingThrows.join(', ')}
              </span>
            </div>
            <div>
              <span className="text-parchment-dim block text-[10px] uppercase">Armor Training:</span>
              <span className="font-medium text-parchment-light">
                {selectedClass.armorTraining.join(', ') || 'None'}
              </span>
            </div>
            <div>
              <span className="text-parchment-dim block text-[10px] uppercase">Weapon Training:</span>
              <span className="font-medium text-parchment-light">
                {selectedClass.weaponTraining.join(', ')}
              </span>
            </div>
          </div>

          {/* Level 1 Class Features */}
          <div>
            <h4 className="font-cinzel text-sm font-bold text-dnd-gold mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-dnd-gold" />
              <span>Level 1 Class Features</span>
            </h4>

            <div className="space-y-3">
              {selectedClass.features.map((feat, fIdx) => (
                <div key={fIdx} className="p-3 rounded bg-ink-pure/40 border border-parchment-border/25">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-cinzel text-sm font-bold text-parchment-light">
                      {feat.name}
                    </span>
                    <PHBBadge page={feat.phbPage} topic={feat.name} />
                  </div>
                  <p className="text-xs font-sans text-parchment-dark/85 leading-relaxed">
                    {feat.description}
                  </p>

                  {/* Feature Sub-choices (e.g. Divine Order, Primal Order, Fighting Styles, Invocations) */}
                  {feat.choices && feat.choices.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-parchment-border/20">
                      <span className="block text-[11px] font-sans font-semibold text-dnd-gold mb-2 uppercase tracking-wide">
                        Choose your {feat.name}:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {feat.choices.map((choice) => {
                          const isChosen = character.classFeatureChoices?.[feat.name] === choice.name || (!character.classFeatureChoices?.[feat.name] && choice === feat.choices?.[0]);
                          return (
                            <button
                              key={choice.name}
                              type="button"
                              onClick={() => handleFeatureChoice(feat.name, choice.name)}
                              className={`p-2 rounded border text-left transition-all ${
                                isChosen
                                  ? 'border-dnd-gold bg-dnd-gold/20 text-parchment shadow-sm ring-1 ring-dnd-gold/50'
                                  : 'border-parchment-border/30 bg-ink-pure/60 text-parchment-dim hover:border-parchment-border hover:text-parchment'
                              }`}
                            >
                              <span className="font-cinzel text-xs font-bold block text-parchment-light">
                                {choice.name}
                              </span>
                              <span className="text-[11px] font-sans text-parchment-dim/80 block mt-0.5">
                                {choice.description}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Weapon Masteries Choice (if class grants mastery) */}
          {selectedClass.weaponMasteryCount > 0 && (
            <div className="p-3 rounded bg-ink-pure/50 border border-dnd-gold/30">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Sword className="w-4 h-4 text-dnd-gold" />
                  <h4 className="font-cinzel text-sm font-bold text-dnd-gold">
                    Weapon Mastery Selection
                  </h4>
                </div>
                <span className="text-xs font-sans font-bold text-parchment">
                  {character.weaponMasteryChoices?.length || 0} / {selectedClass.weaponMasteryCount} Selected
                </span>
              </div>
              <p className="text-xs font-sans text-parchment-dim mb-3">
                In the 2024 rules, martial classes unlock special tactical mastery properties (Cleave, Graze, Nick, Push, Sap, Slow, Topple, Vex) on chosen weapons.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {equipmentData.weapons.map((w) => {
                  const isSelected = character.weaponMasteryChoices?.includes(w.id);
                  const masteryInfo = WEAPON_MASTERIES[w.mastery as keyof typeof WEAPON_MASTERIES];
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => toggleWeaponMastery(w.id)}
                      className={`p-2 rounded border text-left transition-all ${
                        isSelected
                          ? 'border-dnd-gold bg-dnd-gold/25 text-parchment ring-1 ring-dnd-gold'
                          : 'border-parchment-border/25 bg-ink-pure/60 text-parchment-dim hover:border-parchment-border hover:text-parchment'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-xs text-parchment-light truncate">
                          {w.name}
                        </span>
                        <span className="text-[10px] px-1 py-0.2 rounded bg-ink-pure text-dnd-gold font-sans font-semibold">
                          {w.mastery}
                        </span>
                      </div>
                      <span className="text-[10px] font-sans text-parchment-dim block truncate mt-0.5" title={masteryInfo?.summary}>
                        {masteryInfo?.summary}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </ParchmentCard>
    </div>
  );
};
