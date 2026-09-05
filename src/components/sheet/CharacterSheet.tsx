import React, { useState } from 'react';
import { useCharacter } from '../../state/CharacterContext';
import { DndClass, DndSpecies, DndBackground, DndFeat, AbilityScoreKey, SkillKey } from '../../types/dnd';
import classesData from '../../data/classes.json';
import speciesData from '../../data/species.json';
import backgroundsData from '../../data/backgrounds.json';
import featsData from '../../data/feats.json';
import portraitsData from '../../data/portraits.json';
import { exportCharacterToJson } from '../../storage/exportImport';
import { formatModifier } from '../../engine/abilityScores';
import { ParchmentCard } from '../common/ParchmentCard';
import { PHBBadge } from '../common/PHBBadge';
import {
  Shield, Heart, Zap, Award, Sparkles, Sword, Dices, Plus, Minus,
  RotateCcw, Download, Printer, Edit, BookOpen, Flame, Check
} from 'lucide-react';

const CLASSES = classesData as DndClass[];
const SPECIES = speciesData as DndSpecies[];
const BACKGROUNDS = backgroundsData as DndBackground[];
const ALL_FEATS = featsData as DndFeat[];

export const CharacterSheet: React.FC = () => {
  const {
    character,
    updateCharacter,
    derivedStats,
    setActiveView,
    triggerRoll,
    saveCurrentCharacter
  } = useCharacter();

  const [currentHp, setCurrentHp] = useState<number>(derivedStats.maxHp);
  const [tempHp, setTempHp] = useState<number>(0);
  const [hitDiceUsed, setHitDiceUsed] = useState<number>(0);
  const [expendedSlots, setExpendedSlots] = useState<Record<number, number>>({});

  const cls = CLASSES.find(c => c.id === character.classId) || CLASSES[0];
  const species = SPECIES.find(s => s.id === character.speciesId) || SPECIES[0];
  const bg = BACKGROUNDS.find(b => b.id === character.backgroundId) || BACKGROUNDS[0];
  const originFeat = ALL_FEATS.find(f => f.id === bg.featId);
  const portraitPreset = portraitsData.find(p => p.id === character.portraitUrl);

  const handleHpChange = (delta: number) => {
    setCurrentHp(prev => Math.min(derivedStats.maxHp, Math.max(0, prev + delta)));
  };

  const handleLongRest = () => {
    setCurrentHp(derivedStats.maxHp);
    setTempHp(0);
    setHitDiceUsed(0);
    setExpendedSlots({});
  };

  const handleToggleSlot = (level: number, slotIndex: number) => {
    const current = expendedSlots[level] || 0;
    if (slotIndex < current) {
      setExpendedSlots(prev => ({ ...prev, [level]: Math.max(0, current - 1) }));
    } else {
      setExpendedSlots(prev => ({ ...prev, [level]: current + 1 }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in">
      {/* Sheet Top Banner */}
      <div className="rounded-md border border-dnd-gold bg-gradient-to-r from-[#2A1E15] via-[#1E1712] to-[#14100C] p-4 sm:p-5 shadow-dnd-card">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-5">
          {/* Avatar & Core Bio */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-dnd-gold shadow-dnd-glow overflow-hidden bg-ink-pure flex-shrink-0 flex items-center justify-center">
              {character.portraitUrl?.startsWith('data:') ? (
                <img src={character.portraitUrl} alt={character.name} className="w-full h-full object-cover" />
              ) : portraitPreset ? (
                <div
                  className="w-20 h-20 flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: portraitPreset.iconSvg }}
                />
              ) : (
                <Shield className="w-12 h-12 text-dnd-gold" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-parchment-light">
                  {character.name || 'Unnamed Adventurer'}
                </h1>
                {character.pronouns && (
                  <span className="text-xs font-sans text-parchment-dim bg-ink-pure/60 px-2 py-0.5 rounded border border-parchment-border/30">
                    {character.pronouns}
                  </span>
                )}
              </div>

              <div className="text-xs sm:text-sm font-sans text-dnd-gold font-semibold flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span>Level 1 {species.name} {cls.name}</span>
                <span>•</span>
                <span>{bg.name}</span>
                <span>•</span>
                <span>{character.alignment || 'Neutral Good'}</span>
              </div>

              {character.concept && (
                <p className="text-xs font-serif text-parchment-dim italic mt-1.5 line-clamp-2 max-w-2xl">
                  "{character.concept}"
                </p>
              )}
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleLongRest}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-ink-pure border border-parchment-border/40 text-xs font-sans font-semibold text-dnd-moss-light hover:bg-dnd-moss/20 hover:border-dnd-moss transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Long Rest</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('print')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-ink-pure border border-parchment-border/40 text-xs font-sans font-semibold text-parchment hover:border-dnd-gold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sheet</span>
            </button>
            <button
              type="button"
              onClick={() => exportCharacterToJson(character)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-ink-pure border border-parchment-border/40 text-xs font-sans font-semibold text-parchment hover:border-dnd-gold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('wizard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-dnd-crimson hover:bg-dnd-crimson-light text-parchment text-xs font-cinzel font-bold border border-dnd-gold/60 shadow-sm transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Hero</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 6 Ability Scores & Saves & Skills (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* 6 Ability Scores List */}
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 gap-2">
            {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map((key) => {
              const score = derivedStats.finalAbilities[key];
              const mod = derivedStats.modifiers[key];
              const save = derivedStats.savingThrows[key];

              return (
                <div
                  key={key}
                  onClick={() => triggerRoll(`${key.toUpperCase()} Ability Check`, 1, 20, mod, `1d20 + ${mod}`)}
                  className="p-2.5 rounded border border-parchment-border/30 bg-ink-pure/80 text-center cursor-pointer hover:border-dnd-gold hover:bg-ink-light transition-all group"
                  title="Click to roll Ability Check"
                >
                  <span className="text-[10px] font-sans uppercase font-bold text-dnd-gold tracking-wider block">
                    {key.toUpperCase()}
                  </span>
                  <div className="font-cinzel text-xl font-black text-parchment-light">
                    {score}
                  </div>
                  <div className="font-cinzel text-xs font-bold text-dnd-gold group-hover:scale-110 transition-transform">
                    {formatModifier(mod)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Saving Throws Block */}
          <ParchmentCard title="Saving Throws" subtitle="Proficiency adds +2 PB">
            <div className="space-y-1 mt-2 text-xs font-sans">
              {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map((key) => {
                const save = derivedStats.savingThrows[key];
                return (
                  <div
                    key={key}
                    onClick={() => triggerRoll(`${key.toUpperCase()} Saving Throw`, 1, 20, save.bonus, `1d20 + ${save.bonus}`)}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-ink-light cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] ${
                        save.proficient
                          ? 'border-dnd-moss bg-dnd-moss text-parchment font-bold'
                          : 'border-parchment-border/40 bg-ink-pure text-transparent'
                      }`}>
                        {save.proficient && '✓'}
                      </div>
                      <span className="font-semibold text-parchment-light uppercase">{key} Save</span>
                    </div>
                    <span className={`font-cinzel font-bold ${save.proficient ? 'text-dnd-gold' : 'text-parchment-dim'}`}>
                      {formatModifier(save.bonus)}
                    </span>
                  </div>
                );
              })}
            </div>
          </ParchmentCard>

          {/* Skills Block */}
          <ParchmentCard title="Skills" subtitle="Click any skill to roll d20 check">
            <div className="space-y-1 mt-2 text-xs font-sans max-h-96 overflow-y-auto pr-1">
              {(Object.keys(derivedStats.skills) as SkillKey[]).map((skillName) => {
                const sData = derivedStats.skills[skillName];
                return (
                  <div
                    key={skillName}
                    onClick={() => triggerRoll(`${skillName} Check`, 1, 20, sData.bonus, `1d20 + ${sData.bonus}`)}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-ink-light cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center text-[8px] flex-shrink-0 ${
                        sData.expertise
                          ? 'border-dnd-gold bg-dnd-gold text-ink-pure font-bold'
                          : sData.proficient
                          ? 'border-dnd-moss bg-dnd-moss text-parchment font-bold'
                          : 'border-parchment-border/40 bg-ink-pure text-transparent'
                      }`}>
                        {sData.proficient && '✓'}
                      </div>
                      <span className="truncate text-parchment-light font-medium">{skillName}</span>
                    </div>
                    <span className={`font-cinzel font-bold ml-2 ${sData.proficient ? 'text-dnd-gold' : 'text-parchment-dim'}`}>
                      {formatModifier(sData.bonus)}
                    </span>
                  </div>
                );
              })}
            </div>
          </ParchmentCard>
        </div>

        {/* Center / Right Column: Combat Vitals, Attacks, Spellcasting, Inventory, Features (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Combat Vitals Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Armor Class */}
            <div className="p-3.5 rounded border border-dnd-gold/60 bg-ink-pure/90 text-center">
              <span className="text-[10px] font-sans text-parchment-dim uppercase block">Armor Class</span>
              <span className="font-cinzel text-3xl font-black text-parchment-light">{derivedStats.armorClass}</span>
              <span className="text-[10px] font-sans text-parchment-dim block truncate">{derivedStats.armorClassBreakdown}</span>
            </div>

            {/* Initiative */}
            <div
              onClick={() => triggerRoll('Initiative Roll', 1, 20, derivedStats.initiative, `1d20 + ${derivedStats.initiative}`)}
              className="p-3.5 rounded border border-parchment-border/40 bg-ink-pure/90 text-center cursor-pointer hover:border-dnd-gold transition-colors"
              title="Click to roll Initiative"
            >
              <span className="text-[10px] font-sans text-parchment-dim uppercase block">Initiative</span>
              <span className="font-cinzel text-3xl font-black text-dnd-gold">{formatModifier(derivedStats.initiative)}</span>
              <span className="text-[10px] font-sans text-parchment-dim block">Speed {derivedStats.speed} ft</span>
            </div>

            {/* Hit Points Tracker */}
            <div className="p-3.5 rounded border border-dnd-crimson/60 bg-ink-pure/90 text-center col-span-2 sm:col-span-2">
              <span className="text-[10px] font-sans text-parchment-dim uppercase block">Current Hit Points</span>
              <div className="flex items-center justify-center gap-3 my-1">
                <button
                  type="button"
                  onClick={() => handleHpChange(-1)}
                  className="w-7 h-7 rounded bg-dnd-crimson text-parchment font-bold hover:bg-dnd-crimson-dark flex items-center justify-center text-sm"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-cinzel text-3xl font-black text-dnd-crimson-light">
                  {currentHp} <span className="text-sm font-sans font-normal text-parchment-dim">/ {derivedStats.maxHp}</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleHpChange(1)}
                  className="w-7 h-7 rounded bg-dnd-moss text-parchment font-bold hover:bg-dnd-moss-dark flex items-center justify-center text-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[10px] font-sans text-parchment-dim block">
                Hit Die: 1d{cls.hitDie} · PB +{derivedStats.proficiencyBonus}
              </span>
            </div>
          </div>

          {/* Weapon Attacks & Actions */}
          <ParchmentCard
            title="Weapon Attacks &amp; Actions"
            subtitle="Click any attack to roll d20 to-hit with damage formula"
          >
            <div className="space-y-2 mt-3">
              {derivedStats.weaponAttacks.map((atk, idx) => (
                <div
                  key={idx}
                  onClick={() => triggerRoll(`${atk.name} Attack`, 1, 20, atk.attackBonus, `To Hit: 1d20 + ${atk.attackBonus} | Damage: ${atk.damage} ${atk.damageType}`)}
                  className="p-3 rounded bg-ink-pure/70 border border-parchment-border/25 hover:border-dnd-gold cursor-pointer transition-all flex flex-wrap items-center justify-between gap-3 text-xs font-sans"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-parchment-light text-sm">{atk.name}</span>
                      {atk.mastery && (
                        <span className="px-1.5 py-0.2 rounded bg-dnd-gold/20 text-dnd-gold text-[10px] font-bold">
                          Mastery: {atk.mastery}
                        </span>
                      )}
                    </div>
                    {atk.range && <span className="text-parchment-dim text-[11px]">Range: {atk.range}</span>}
                  </div>

                  <div className="text-right">
                    <span className="font-cinzel font-bold text-dnd-gold text-base mr-3">
                      +{atk.attackBonus} to hit
                    </span>
                    <span className="font-bold text-parchment">
                      {atk.damage} {atk.damageType}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ParchmentCard>

          {/* Spellcasting & Slots (if caster) */}
          {derivedStats.spellcasting && (
            <ParchmentCard
              title={`${cls.name} Spellcasting`}
              subtitle={`Spell Save DC ${derivedStats.spellcasting.spellSaveDC} · Spell Attack +${derivedStats.spellcasting.spellAttackModifier}`}
            >
              <div className="space-y-4 mt-3">
                {/* Spell Slot Tracker */}
                <div className="flex items-center gap-3 p-2.5 rounded bg-ink-pure/70 border border-parchment-border/25 text-xs font-sans">
                  <span className="font-bold text-parchment-light">Level 1 Spell Slots:</span>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: derivedStats.spellcasting.slotsTotal['1'] || 2 }).map((_, sIdx) => {
                      const isUsed = sIdx < (expendedSlots[1] || 0);
                      return (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => handleToggleSlot(1, sIdx)}
                          className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                            isUsed
                              ? 'border-parchment-border/30 bg-ink-pure text-transparent'
                              : 'border-dnd-gold bg-dnd-gold/30 text-dnd-gold font-bold'
                          }`}
                        >
                          {!isUsed && '★'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Prepared Spells / Cantrips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                  {character.chosenCantrips.map((cId) => (
                    <div key={cId} className="p-2 rounded bg-ink-pure/60 border border-parchment-border/20 flex justify-between items-center">
                      <span className="font-serif font-bold text-parchment-light">{cId}</span>
                      <span className="text-[10px] text-dnd-gold font-semibold uppercase">Cantrip</span>
                    </div>
                  ))}
                  {character.chosenL1Spells.map((sId) => (
                    <div key={sId} className="p-2 rounded bg-ink-pure/60 border border-parchment-border/20 flex justify-between items-center">
                      <span className="font-serif font-bold text-parchment-light">{sId}</span>
                      <span className="text-[10px] text-dnd-moss-light font-semibold uppercase">Level 1</span>
                    </div>
                  ))}
                </div>
              </div>
            </ParchmentCard>
          )}

          {/* Class Features & Traits */}
          <ParchmentCard title="Features, Traits &amp; Feats">
            <div className="space-y-3 mt-3">
              {cls.features.map((feat, fIdx) => (
                <div key={fIdx} className="p-2.5 rounded bg-ink-pure/50 border border-parchment-border/20 text-xs font-sans">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-cinzel text-xs font-bold text-parchment-light">{feat.name}</span>
                    <PHBBadge page={feat.phbPage} topic={feat.name} />
                  </div>
                  <p className="text-parchment-dark/80">{feat.description}</p>
                </div>
              ))}

              {originFeat && (
                <div className="p-2.5 rounded bg-ink-pure/50 border border-dnd-gold/30 text-xs font-sans">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-cinzel text-xs font-bold text-dnd-gold">Origin Feat: {originFeat.name}</span>
                    <PHBBadge page={originFeat.phbPage} topic={originFeat.name} />
                  </div>
                  <p className="text-parchment-dark/80">{originFeat.description}</p>
                </div>
              )}
            </div>
          </ParchmentCard>
        </div>
      </div>
    </div>
  );
};

