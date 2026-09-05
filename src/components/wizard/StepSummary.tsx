import React from 'react';
import { useCharacter } from '../../state/CharacterContext';
import { DndClass, DndSpecies, DndBackground } from '../../types/dnd';
import classesData from '../../data/classes.json';
import speciesData from '../../data/species.json';
import backgroundsData from '../../data/backgrounds.json';
import portraitsData from '../../data/portraits.json';
import { exportCharacterToJson } from '../../storage/exportImport';
import { formatModifier } from '../../engine/abilityScores';
import { ParchmentCard } from '../common/ParchmentCard';
import { PHBBadge } from '../common/PHBBadge';
import { Shield, Heart, Zap, Award, Sparkles, Download, FileText, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const CLASSES = classesData as DndClass[];
const SPECIES = speciesData as DndSpecies[];
const BACKGROUNDS = backgroundsData as DndBackground[];

export const StepSummary: React.FC = () => {
  const { character, derivedStats, setActiveView, saveCurrentCharacter } = useCharacter();
  const cls = CLASSES.find(c => c.id === character.classId) || CLASSES[0];
  const species = SPECIES.find(s => s.id === character.speciesId) || SPECIES[0];
  const bg = BACKGROUNDS.find(b => b.id === character.backgroundId) || BACKGROUNDS[0];
  const portraitPreset = portraitsData.find(p => p.id === character.portraitUrl);

  const handleFinalize = async () => {
    await saveCurrentCharacter();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setActiveView('sheet');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Hero Overview Banner */}
      <ParchmentCard className="border-dnd-gold bg-gradient-to-r from-[#2F2117] via-[#221A14] to-[#17130F]">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          {/* Portrait */}
          <div className="w-20 h-20 rounded-full border-2 border-dnd-gold shadow-dnd-glow overflow-hidden bg-ink-pure flex-shrink-0 flex items-center justify-center">
            {character.portraitUrl?.startsWith('data:') ? (
              <img src={character.portraitUrl} alt={character.name} className="w-full h-full object-cover" />
            ) : portraitPreset ? (
              <div
                className="w-16 h-16 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: portraitPreset.iconSvg }}
              />
            ) : (
              <Shield className="w-10 h-10 text-dnd-gold" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="font-cinzel text-xl sm:text-2xl font-black text-parchment-light">
                {character.name || 'Unnamed Adventurer'}
              </h2>
              {character.pronouns && (
                <span className="text-xs font-sans text-parchment-dim bg-ink-pure/60 px-2 py-0.5 rounded border border-parchment-border/30">
                  {character.pronouns}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-sans text-dnd-gold font-semibold mb-2">
              Level 1 {species.name} {cls.name} · {bg.name} Background
            </p>
            {character.concept && (
              <p className="text-xs font-serif text-parchment-dim italic">
                "{character.concept}"
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleFinalize}
              className="flex items-center gap-1.5 px-4 py-2 rounded bg-dnd-crimson hover:bg-dnd-crimson-light text-parchment font-cinzel font-bold text-xs tracking-wider border border-dnd-gold/60 shadow-dnd-glow transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Open Sheet</span>
            </button>
            <button
              type="button"
              onClick={() => exportCharacterToJson(character)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-parchment-border/40 text-xs font-sans text-parchment-dim hover:text-parchment hover:border-parchment-border transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </ParchmentCard>

      {/* Primary Stat Block Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map((k) => {
          const score = derivedStats.finalAbilities[k];
          const mod = derivedStats.modifiers[k];
          const save = derivedStats.savingThrows[k];

          return (
            <div key={k} className="p-3 rounded border border-parchment-border/30 bg-ink-pure/80 text-center">
              <span className="text-[10px] font-sans uppercase font-bold text-dnd-gold tracking-wider block">
                {k.toUpperCase()}
              </span>
              <div className="font-cinzel text-2xl font-black text-parchment-light">
                {score}
              </div>
              <div className="font-cinzel text-xs font-bold text-dnd-gold">
                {formatModifier(mod)}
              </div>
              <div className="text-[10px] font-sans text-parchment-dim mt-1 pt-1 border-t border-parchment-border/15">
                Save: <strong className={save.proficient ? 'text-dnd-moss-light' : 'text-parchment'}>{formatModifier(save.bonus)}</strong>
                {save.proficient && ' ★'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Combat Vitals Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded border border-parchment-border/30 bg-ink-card text-center">
          <span className="text-[10px] font-sans text-parchment-dim uppercase block">Armor Class</span>
          <span className="font-cinzel text-2xl font-black text-parchment-light">{derivedStats.armorClass}</span>
          <span className="text-[10px] font-sans text-parchment-dim block truncate">{derivedStats.armorClassBreakdown}</span>
        </div>

        <div className="p-3 rounded border border-parchment-border/30 bg-ink-card text-center">
          <span className="text-[10px] font-sans text-parchment-dim uppercase block">Hit Points</span>
          <span className="font-cinzel text-2xl font-black text-dnd-crimson-light">{derivedStats.maxHp}</span>
          <span className="text-[10px] font-sans text-parchment-dim block">1d{cls.hitDie} Hit Die</span>
        </div>

        <div className="p-3 rounded border border-parchment-border/30 bg-ink-card text-center">
          <span className="text-[10px] font-sans text-parchment-dim uppercase block">Initiative</span>
          <span className="font-cinzel text-2xl font-black text-dnd-gold">{formatModifier(derivedStats.initiative)}</span>
          <span className="text-[10px] font-sans text-parchment-dim block">Speed {derivedStats.speed} ft</span>
        </div>

        <div className="p-3 rounded border border-parchment-border/30 bg-ink-card text-center">
          <span className="text-[10px] font-sans text-parchment-dim uppercase block">Passive Perception</span>
          <span className="font-cinzel text-2xl font-black text-parchment-light">{derivedStats.passivePerception}</span>
          <span className="text-[10px] font-sans text-parchment-dim block">Prof. Bonus +{derivedStats.proficiencyBonus}</span>
        </div>
      </div>

      {/* Weapon Attacks Summary */}
      <ParchmentCard title="Weapon Strikes &amp; Masteries">
        <div className="space-y-2 mt-2">
          {derivedStats.weaponAttacks.map((atk, idx) => (
            <div key={idx} className="p-2.5 rounded bg-ink-pure/60 border border-parchment-border/20 flex items-center justify-between text-xs font-sans">
              <div>
                <span className="font-bold text-parchment-light text-sm">{atk.name}</span>
                {atk.mastery && (
                  <span className="ml-2 px-1.5 py-0.2 rounded bg-dnd-gold/20 text-dnd-gold text-[10px] font-bold">
                    Mastery: {atk.mastery}
                  </span>
                )}
                {atk.range && <span className="text-parchment-dim text-[11px] ml-2">Range {atk.range}</span>}
              </div>
              <div className="text-right">
                <span className="font-cinzel font-bold text-dnd-gold text-sm mr-3">
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

      {/* Finalize Action Button */}
      <div className="pt-4 flex items-center justify-center">
        <button
          type="button"
          onClick={handleFinalize}
          className="flex items-center gap-2 px-8 py-3.5 rounded bg-dnd-moss hover:bg-dnd-moss-light text-parchment font-cinzel font-black text-base tracking-widest uppercase border-2 border-dnd-gold shadow-dnd-glow transition-all"
        >
          <CheckCircle2 className="w-5 h-5 text-dnd-gold-light" />
          <span>Forge &amp; Open Character Sheet</span>
        </button>
      </div>
    </div>
  );
};

