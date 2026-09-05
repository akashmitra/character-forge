import React from 'react';
import { useCharacter } from '../../state/CharacterContext';
import { WizardNav } from './WizardNav';
import { StepConcept } from './StepConcept';
import { StepClass } from './StepClass';
import { StepSpecies } from './StepSpecies';
import { StepBackground } from './StepBackground';
import { StepAbilities } from './StepAbilities';
import { StepSkills } from './StepSkills';
import { StepEquipment } from './StepEquipment';
import { StepSpells } from './StepSpells';
import { StepSummary } from './StepSummary';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export const CreationWizard: React.FC = () => {
  const { wizardStep, setWizardStep, character } = useCharacter();

  const handleNext = () => {
    if (wizardStep < 8) {
      setWizardStep(wizardStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (wizardStep > 0) {
      setWizardStep(wizardStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Wizard Step Breadcrumbs */}
      <WizardNav />

      {/* Step Content */}
      <div className="mb-8">
        {wizardStep === 0 && <StepConcept />}
        {wizardStep === 1 && <StepClass />}
        {wizardStep === 2 && <StepSpecies />}
        {wizardStep === 3 && <StepBackground />}
        {wizardStep === 4 && <StepAbilities />}
        {wizardStep === 5 && <StepSkills />}
        {wizardStep === 6 && <StepEquipment />}
        {wizardStep === 7 && <StepSpells />}
        {wizardStep === 8 && <StepSummary />}
      </div>

      {/* Wizard Bottom Navigation Buttons */}
      <div className="flex items-center justify-between border-t border-parchment-border/30 pt-4">
        <button
          type="button"
          disabled={wizardStep === 0}
          onClick={handleBack}
          className="flex items-center gap-1.5 px-4 py-2 rounded border border-parchment-border/40 text-xs font-sans font-semibold text-parchment hover:border-parchment-border hover:bg-ink-light disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous Step</span>
        </button>

        {wizardStep < 8 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2 rounded bg-dnd-crimson hover:bg-dnd-crimson-light text-parchment font-cinzel font-bold text-xs tracking-wider border border-dnd-gold/60 shadow-md transition-all"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

