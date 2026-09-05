import React, { useRef } from 'react';
import { useCharacter } from '../../state/CharacterContext';
import { ParchmentCard } from '../common/ParchmentCard';
import portraitsData from '../../data/portraits.json';
import { Upload, UserCheck, Sparkles } from 'lucide-react';

const ALIGNMENTS = [
  'Lawful Good', 'Neutral Good', 'Chaotic Good',
  'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
  'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'
];

export const StepConcept: React.FC = () => {
  const { character, updateCharacter } = useCharacter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        updateCharacter({ portraitUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <ParchmentCard
        title="Who is this Adventurer?"
        subtitle="The spark of an idea. The rules and mechanics will bring your concept to life."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          {/* Character Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-sans font-semibold text-dnd-gold tracking-wide uppercase">
              Character Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Valerius of the Ember Watch"
              value={character.name}
              onChange={(e) => updateCharacter({ name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded bg-ink-pure border border-parchment-border/40 font-serif text-base text-parchment placeholder:text-parchment-dim/40 focus:outline-none focus:border-dnd-gold focus:ring-1 focus:ring-dnd-gold"
            />
          </div>

          {/* Pronouns */}
          <div className="space-y-1.5">
            <label className="block text-xs font-sans font-semibold text-parchment-dim tracking-wide uppercase">
              Pronouns
            </label>
            <input
              type="text"
              placeholder="e.g. He/Him, She/Her, They/Them"
              value={character.pronouns || ''}
              onChange={(e) => updateCharacter({ pronouns: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded bg-ink-pure border border-parchment-border/40 font-sans text-sm text-parchment placeholder:text-parchment-dim/40 focus:outline-none focus:border-dnd-gold"
            />
          </div>

          {/* Character Concept / Backstory Pitch */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-sans font-semibold text-dnd-gold tracking-wide uppercase">
              Concept &amp; Core Motivation (One or Two Sentences)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. A disgraced knight seeking redemption through heroic deeds across the frontier."
              value={character.concept}
              onChange={(e) => updateCharacter({ concept: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded bg-ink-pure border border-parchment-border/40 font-serif text-sm text-parchment placeholder:text-parchment-dim/40 focus:outline-none focus:border-dnd-gold"
            />
          </div>

          {/* Alignment */}
          <div className="space-y-1.5">
            <label className="block text-xs font-sans font-semibold text-parchment-dim tracking-wide uppercase">
              Alignment
            </label>
            <select
              value={character.alignment || 'Neutral Good'}
              onChange={(e) => updateCharacter({ alignment: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded bg-ink-pure border border-parchment-border/40 font-sans text-sm text-parchment focus:outline-none focus:border-dnd-gold"
            >
              {ALIGNMENTS.map(align => (
                <option key={align} value={align}>{align}</option>
              ))}
            </select>
          </div>

          {/* Deity or Faith */}
          <div className="space-y-1.5">
            <label className="block text-xs font-sans font-semibold text-parchment-dim tracking-wide uppercase">
              Deity / Patron / Philosophy
            </label>
            <input
              type="text"
              placeholder="e.g. Lathander, Selûne, Corellon, The Raven Queen"
              value={character.deity || ''}
              onChange={(e) => updateCharacter({ deity: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded bg-ink-pure border border-parchment-border/40 font-serif text-sm text-parchment placeholder:text-parchment-dim/40 focus:outline-none focus:border-dnd-gold"
            />
          </div>
        </div>
      </ParchmentCard>

      {/* Portrait Selection */}
      <ParchmentCard
        title="Adventurer's Crest & Portrait"
        subtitle="Select a heraldic sigil or upload your custom character artwork."
      >
        <div className="mt-4">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-4">
            {portraitsData.map((p) => {
              const isSelected = character.portraitUrl === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => updateCharacter({ portraitUrl: p.id })}
                  className={`group relative flex flex-col items-center p-2 rounded border transition-all ${
                    isSelected
                      ? 'border-dnd-gold bg-dnd-gold/20 shadow-dnd-glow ring-2 ring-dnd-gold/60'
                      : 'border-parchment-border/30 bg-ink-pure/60 hover:border-parchment-border hover:bg-ink-light'
                  }`}
                >
                  <div
                    className="w-12 h-12 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: p.iconSvg }}
                  />
                  <span className="text-[10px] font-sans text-parchment-dim truncate w-full text-center mt-1">
                    {p.name.split(' ')[0]}
                  </span>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-dnd-gold text-ink-pure flex items-center justify-center text-[10px]">
                      <UserCheck className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom Upload */}
          <div className="pt-3 border-t border-parchment-border/20 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {character.portraitUrl?.startsWith('data:') && (
                <div className="w-12 h-12 rounded-full overflow-hidden border border-dnd-gold shadow-md">
                  <img src={character.portraitUrl} alt="Custom Portrait" className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <p className="text-xs font-sans text-parchment font-semibold">Custom Character Art</p>
                <p className="text-[11px] font-sans text-parchment-dim">Upload a portrait from your device (saved locally in IndexedDB).</p>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCustomImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-parchment-border/50 text-xs font-sans font-medium text-parchment hover:border-dnd-gold hover:text-dnd-gold transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Custom Art</span>
            </button>
          </div>
        </div>
      </ParchmentCard>
    </div>
  );
};

