import React from 'react';
import { CharacterProvider, useCharacter } from './state/CharacterContext';
import { Header } from './components/common/Header';
import { CreationWizard } from './components/wizard/CreationWizard';
import { CharacterSheet } from './components/sheet/CharacterSheet';
import { PrintableSheet } from './components/sheet/PrintableSheet';
import { CharacterRoster } from './components/roster/CharacterRoster';
import { CompendiumDrawer } from './components/compendium/CompendiumDrawer';
import { DiceRollModal } from './components/common/DiceRollModal';

const AppContent: React.FC = () => {
  const { activeView } = useCharacter();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {activeView === 'roster' && <CharacterRoster />}
        {activeView === 'wizard' && <CreationWizard />}
        {activeView === 'sheet' && <CharacterSheet />}
        {activeView === 'print' && <PrintableSheet />}
      </main>

      {/* Global Compendium Quick-Reference Slideout */}
      <CompendiumDrawer />

      {/* Interactive Tabletop Dice Roll Result Modal */}
      <DiceRollModal />
    </div>
  );
};

export function App() {
  return (
    <CharacterProvider>
      <AppContent />
    </CharacterProvider>
  );
}

export default App;

