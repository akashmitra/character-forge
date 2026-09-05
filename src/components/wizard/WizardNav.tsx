import React from 'react';
import { useCharacter } from '../../state/CharacterContext';
import { Check } from 'lucide-react';

const STEPS = [
  'Concept',
  'Class',
  'Species',
  'Background',
  'Abilities',
  'Skills',
  'Equipment',
  'Spells',
  'Review'
];

export const WizardNav: React.FC = () => {
  const { wizardStep, setWizardStep } = useCharacter();

  return (
    <div className="w-full mb-6">
      {/* Step Trail */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
        {STEPS.map((name, index) => {
          const isDone = index < wizardStep;
          const isActive = index === wizardStep;

          return (
            <button
              key={name}
              type="button"
              onClick={() => setWizardStep(index)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-sans whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'border-dnd-gold bg-dnd-gold/20 text-dnd-gold-light font-bold shadow-dnd-glow ring-1 ring-dnd-gold/50'
                  : isDone
                  ? 'border-dnd-moss text-dnd-moss-light bg-dnd-moss/10 hover:bg-dnd-moss/20'
                  : 'border-parchment-border/30 text-parchment-dim/60 hover:text-parchment-dim hover:border-parchment-border/60'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                isActive
                  ? 'bg-dnd-gold text-ink-pure font-bold'
                  : isDone
                  ? 'bg-dnd-moss text-parchment font-bold'
                  : 'bg-ink-light text-parchment-dim'
              }`}>
                {isDone ? <Check className="w-2.5 h-2.5" /> : index + 1}
              </span>
              <span>{name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

