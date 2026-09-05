import React from 'react';
import { useCharacter } from '../../state/CharacterContext';
import { DndClass, DndSpell } from '../../types/dnd';
import classesData from '../../data/classes.json';
import spellsData from '../../data/spells.json';
import { ParchmentCard } from '../common/ParchmentCard';
import { PHBBadge } from '../common/PHBBadge';
import { Sparkles, Flame, Check } from 'lucide-react';

const CLASSES = classesData as DndClass[];
const ALL_SPELLS = spellsData as DndSpell[];

export const StepSpells: React.FC = () => {
  const { character, updateCharacter, derivedStats } = useCharacter();
  const cls = CLASSES.find(c => c.id === character.classId) || CLASSES[0];

  const isSpellcaster = cls.spellcasterType && cls.spellcasterType !== 'none';
  const cantripsLimit = cls.cantripsKnownL1 || 0;
  const spellsLimit = cls.spellsPreparedL1 || 0;

  const currentCantrips = character.chosenCantrips || [];
  const currentL1Spells = character.chosenL1Spells || [];

  const availableCantrips = ALL_SPELLS.filter(
    s => s.level === 0 && s.classes.some(c => c.toLowerCase() === cls.name.toLowerCase())
  );
  const availableL1Spells = ALL_SPELLS.filter(
    s => s.level === 1 && s.classes.some(c => c.toLowerCase() === cls.name.toLowerCase())
  );

  const toggleCantrip = (spellId: string) => {
    if (currentCantrips.includes(spellId)) {
      updateCharacter({ chosenCantrips: currentCantrips.filter(id => id !== spellId) });
    } else if (currentCantrips.length < cantripsLimit) {
      updateCharacter({ chosenCantrips: [...currentCantrips, spellId] });
    }
  };

  const toggleL1Spell = (spellId: string) => {
    if (currentL1Spells.includes(spellId)) {
      updateCharacter({ chosenL1Spells: currentL1Spells.filter(id => id !== spellId) });
    } else if (currentL1Spells.length < spellsLimit) {
      updateCharacter({ chosenL1Spells: [...currentL1Spells, spellId] });
    }
  };

  if (!isSpellcaster) {
    return (
      <div className="space-y-6 animate-in fade-in">
        <ParchmentCard
          title={`${cls.name} Spellcasting`}
          subtitle="Non-spellcasting martial archetype"
        >
          <div className="py-8 text-center space-y-2">
            <Flame className="w-10 h-10 mx-auto text-dnd-crimson opacity-60" />
            <h3 className="font-cinzel text-lg font-bold text-parchment">
              No Spellcasting at Level 1
            </h3>
            <p className="text-xs font-sans text-parchment-dim max-w-md mx-auto">
              As a Level 1 {cls.name}, your prowess comes from weapons, armor, and tactical physical features. Proceed to the final character summary!
            </p>
          </div>
        </ParchmentCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div>
        <h2 className="font-cinzel text-xl font-bold text-parchment tracking-wide mb-1">
          {cls.name} Spellcasting &amp; Prepared Spells
        </h2>
        <p className="text-xs font-sans text-parchment-dim">
          In 2024 D&amp;D rules, spellcasters prepare a flexible list of spells each day. Your spellcasting ability is <strong className="text-dnd-gold uppercase">{cls.spellcastingAbility}</strong>.
        </p>
      </div>

      {/* Spellcasting Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded bg-ink-pure/80 border border-dnd-gold/40 text-xs font-sans">
        <div>
          <span className="text-parchment-dim block text-[10px] uppercase">Spell Save DC:</span>
          <span className="font-bold text-dnd-gold text-base">
            {derivedStats.spellcasting?.spellSaveDC || 13}
          </span>
        </div>
        <div>
          <span className="text-parchment-dim block text-[10px] uppercase">Spell Attack Mod:</span>
          <span className="font-bold text-dnd-gold text-base">
            +{derivedStats.spellcasting?.spellAttackModifier || 5}
          </span>
        </div>
        <div>
          <span className="text-parchment-dim block text-[10px] uppercase">Cantrips Known:</span>
          <span className={`font-bold text-base ${currentCantrips.length === cantripsLimit ? 'text-dnd-moss-light' : 'text-dnd-gold'}`}>
            {currentCantrips.length} / {cantripsLimit}
          </span>
        </div>
        <div>
          <span className="text-parchment-dim block text-[10px] uppercase">1st-Level Prepared:</span>
          <span className={`font-bold text-base ${currentL1Spells.length === spellsLimit ? 'text-dnd-moss-light' : 'text-dnd-gold'}`}>
            {currentL1Spells.length} / {spellsLimit}
          </span>
        </div>
      </div>

      {/* Cantrips Selection */}
      {cantripsLimit > 0 && (
        <ParchmentCard
          title={`Choose ${cantripsLimit} Cantrips (Level 0)`}
          subtitle="Cantrips are minor spells cast at will without expending spell slots."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {availableCantrips.map((sp) => {
              const isSelected = currentCantrips.includes(sp.id);
              return (
                <div
                  key={sp.id}
                  onClick={() => toggleCantrip(sp.id)}
                  className={`p-3 rounded border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-dnd-gold bg-dnd-gold/20 shadow-sm ring-1 ring-dnd-gold'
                      : 'border-parchment-border/25 bg-ink-pure/60 hover:border-parchment-border hover:bg-ink-light/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-cinzel text-sm font-bold text-parchment-light flex items-center gap-1.5">
                      {isSelected && <Check className="w-3.5 h-3.5 text-dnd-gold" />}
                      {sp.name}
                    </span>
                    <PHBBadge page={sp.phbPage} topic={sp.name} />
                  </div>
                  <div className="text-[10px] font-sans text-parchment-dim mb-1">
                    {sp.castingTime} · {sp.range} · {sp.school}
                  </div>
                  <p className="text-xs font-sans text-parchment-dark/80 line-clamp-2">
                    {sp.description}
                  </p>
                </div>
              );
            })}
          </div>
        </ParchmentCard>
      )}

      {/* 1st Level Prepared Spells */}
      {spellsLimit > 0 && (
        <ParchmentCard
          title={`Prepare ${spellsLimit} Level 1 Spells`}
          subtitle={`Slots: ${cls.spellSlotsL1?.['1'] || 2} Level-1 Slots per Long Rest.`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {availableL1Spells.map((sp) => {
              const isSelected = currentL1Spells.includes(sp.id);
              return (
                <div
                  key={sp.id}
                  onClick={() => toggleL1Spell(sp.id)}
                  className={`p-3 rounded border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-dnd-gold bg-dnd-gold/20 shadow-sm ring-1 ring-dnd-gold'
                      : 'border-parchment-border/25 bg-ink-pure/60 hover:border-parchment-border hover:bg-ink-light/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-cinzel text-sm font-bold text-parchment-light flex items-center gap-1.5">
                      {isSelected && <Check className="w-3.5 h-3.5 text-dnd-gold" />}
                      {sp.name}
                    </span>
                    <PHBBadge page={sp.phbPage} topic={sp.name} />
                  </div>
                  <div className="text-[10px] font-sans text-parchment-dim mb-1">
                    {sp.castingTime} · {sp.range} · {sp.school}{sp.concentration ? ' · Concentration' : ''}{sp.ritual ? ' · Ritual' : ''}
                  </div>
                  <p className="text-xs font-sans text-parchment-dark/80 line-clamp-2">
                    {sp.description}
                  </p>
                </div>
              );
            })}
          </div>
        </ParchmentCard>
      )}
    </div>
  );
};

