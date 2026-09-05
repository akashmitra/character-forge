import React from 'react';
import { useCharacter } from '../../state/CharacterContext';
import { BookOpen, Users, Wand2, FileText, Printer, PlusCircle, Save } from 'lucide-react';
import { FieryD20Logo } from './FieryD20Logo';

export const Header: React.FC = () => {
  const {
    character,
    activeView,
    setActiveView,
    setIsCompendiumOpen,
    startNewCharacter,
    saveCurrentCharacter
  } = useCharacter();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-parchment-border/40 bg-[#191510]/95 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Logo and App Title */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveView('roster')}>
          <FieryD20Logo size={42} />
          <div>
            <h1 className="font-cinzel font-black text-base sm:text-lg text-parchment tracking-wider uppercase leading-none hover:text-dnd-gold-light transition-colors">
              D&amp;D Character Forge
            </h1>
            <span className="text-[11px] font-sans text-dnd-gold font-medium tracking-wide">
              2024 Player's Handbook Edition
            </span>
          </div>
        </div>

        {/* View Switchers */}
        <nav className="flex items-center gap-1 sm:gap-1.5 bg-ink-pure/80 p-1 rounded-md border border-parchment-border/30">
          <button
            type="button"
            onClick={() => setActiveView('roster')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-sans font-semibold transition-all ${
              activeView === 'roster'
                ? 'bg-dnd-crimson text-parchment shadow-sm border border-dnd-gold/40'
                : 'text-parchment-dim hover:text-parchment hover:bg-ink-light/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Roster</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('wizard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-sans font-semibold transition-all ${
              activeView === 'wizard'
                ? 'bg-dnd-crimson text-parchment shadow-sm border border-dnd-gold/40'
                : 'text-parchment-dim hover:text-parchment hover:bg-ink-light/50'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Forge Wizard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('sheet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-sans font-semibold transition-all ${
              activeView === 'sheet'
                ? 'bg-dnd-crimson text-parchment shadow-sm border border-dnd-gold/40'
                : 'text-parchment-dim hover:text-parchment hover:bg-ink-light/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Character Sheet</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('print')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-sans font-semibold transition-all ${
              activeView === 'print'
                ? 'bg-dnd-crimson text-parchment shadow-sm border border-dnd-gold/40'
                : 'text-parchment-dim hover:text-parchment hover:bg-ink-light/50'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
        </nav>

        {/* Action Controls: Compendium, Save, New */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCompendiumOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-sans font-semibold bg-ink-card border border-dnd-gold/50 text-dnd-gold hover:bg-dnd-gold hover:text-ink-pure transition-all shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">PHB 2024 Reference</span>
            <span className="md:hidden">PHB</span>
          </button>

          <button
            type="button"
            onClick={saveCurrentCharacter}
            title="Save character to IndexedDB"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-sans font-semibold bg-dnd-moss border border-dnd-moss-light text-parchment hover:bg-dnd-moss-light transition-all shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            type="button"
            onClick={startNewCharacter}
            title="Start creating a fresh character"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-sans font-semibold bg-ink-light/60 border border-parchment-border/40 text-parchment hover:bg-ink-light hover:border-parchment-border transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">New Hero</span>
          </button>
        </div>
      </div>
    </header>
  );
};

