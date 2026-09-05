import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { CharacterData, DerivedCharacterStats } from '../types/character';
import { calculateDerivedStats } from '../engine/statsCalculator';
import { getAllCharacters, saveCharacter, getCharacter, deleteCharacter, duplicateCharacter } from '../storage/db';

export function createDefaultCharacter(): CharacterData {
  return {
    id: 'char_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    version: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    name: 'Valerius of the Ember Watch',
    concept: 'A former garrison sentry searching for an ancient relic that vanished during a forgotten siege.',
    pronouns: 'He/Him',
    alignment: 'Neutral Good',
    deity: '',
    portraitUrl: 'warrior-knight',
    classId: 'fighter',
    classFeatureChoices: {
      'Fighting Style': 'Defense'
    },
    weaponMasteryChoices: ['longsword', 'greatsword', 'crossbow-light'],
    speciesId: 'human',
    lineageId: undefined,
    speciesTraitChoices: {},
    backgroundId: 'guard',
    asiSelection: {
      mode: '2/1',
      plusTwo: 'str',
      plusOnes: ['con']
    },
    abilityMethod: 'standard',
    baseAbilities: {
      str: 15,
      dex: 13,
      con: 14,
      int: 10,
      wis: 12,
      cha: 8
    },
    selectedClassSkills: ['Athletics', 'Perception'],
    selectedOriginFeatSkills: [],
    selectedHumanBonusSkill: 'Insight',
    expertiseSkills: [],
    selectedOriginFeatId: 'alert',
    equipmentOption: 'optionA',
    inventory: [
      { id: 'chain-mail', name: 'Chain Mail', category: 'Heavy Armor', quantity: 1, weight: 55, costGold: 75, equipped: true },
      { id: 'longsword', name: 'Longsword', category: 'Martial Melee', quantity: 1, weight: 3, costGold: 15, equipped: true },
      { id: 'shield', name: 'Shield', category: 'Shield', quantity: 1, weight: 6, costGold: 10, equipped: true },
      { id: 'crossbow-light', name: 'Light Crossbow', category: 'Simple Ranged', quantity: 1, weight: 5, costGold: 25, equipped: true },
      { id: 'bolts-20', name: 'Crossbow Bolts (20)', category: 'Ammunition', quantity: 1, weight: 1.5, costGold: 1 },
      { id: 'dungeoneers-pack', name: "Dungeoneer's Pack", category: 'Pack', quantity: 1, weight: 61, costGold: 12 }
    ],
    equippedArmorId: 'chain-mail',
    equippedShieldId: 'shield',
    gold: 11,
    chosenCantrips: [],
    chosenL1Spells: []
  };
}

export type AppView = 'roster' | 'wizard' | 'sheet' | 'print';

export interface DiceRollResult {
  title: string;
  expression: string;
  dice: number[];
  modifier: number;
  total: number;
  advantage?: 'adv' | 'dis' | 'normal';
  details?: string;
}

interface CharacterContextType {
  character: CharacterData;
  setCharacter: React.Dispatch<React.SetStateAction<CharacterData>>;
  updateCharacter: (updates: Partial<CharacterData>) => void;
  derivedStats: DerivedCharacterStats;
  savedCharacters: CharacterData[];
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  wizardStep: number;
  setWizardStep: (step: number) => void;
  isCompendiumOpen: boolean;
  setIsCompendiumOpen: (open: boolean) => void;
  compendiumSearch: string;
  setCompendiumSearch: (s: string) => void;
  activeRoll: DiceRollResult | null;
  triggerRoll: (title: string, diceCount: number, diceSides: number, modifier: number, details?: string, rollType?: 'adv' | 'dis' | 'normal') => void;
  closeRollModal: () => void;
  saveCurrentCharacter: () => Promise<void>;
  loadSavedCharacters: () => Promise<void>;
  loadCharacter: (id: string) => Promise<void>;
  startNewCharacter: () => void;
  deleteCharacterAndRefresh: (id: string) => Promise<void>;
  duplicateCharacterAndRefresh: (id: string) => Promise<void>;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [character, setCharacter] = useState<CharacterData>(createDefaultCharacter);
  const [savedCharacters, setSavedCharacters] = useState<CharacterData[]>([]);
  const [activeView, setActiveView] = useState<AppView>('wizard');
  const [wizardStep, setWizardStep] = useState<number>(0);
  const [isCompendiumOpen, setIsCompendiumOpen] = useState<boolean>(false);
  const [compendiumSearch, setCompendiumSearch] = useState<string>('');
  const [activeRoll, setActiveRoll] = useState<DiceRollResult | null>(null);

  const derivedStats = useMemo(() => {
    return calculateDerivedStats(character);
  }, [character]);

  const loadSavedCharactersList = async () => {
    try {
      const list = await getAllCharacters();
      setSavedCharacters(list);
      // If there are existing characters and we just initialized, show roster
      if (list.length > 0 && activeView === 'wizard' && wizardStep === 0 && !localStorage.getItem('forge_has_initialized')) {
        setActiveView('roster');
      }
      localStorage.setItem('forge_has_initialized', 'true');
    } catch (err) {
      console.error('Failed to load characters from IndexedDB:', err);
    }
  };

  useEffect(() => {
    loadSavedCharactersList();
  }, []);

  const updateCharacter = (updates: Partial<CharacterData>) => {
    setCharacter(prev => ({
      ...prev,
      ...updates,
      updatedAt: Date.now()
    }));
  };

  const saveCurrent = async () => {
    await saveCharacter(character);
    await loadSavedCharactersList();
  };

  const loadCharacterById = async (id: string) => {
    const found = await getCharacter(id);
    if (found) {
      setCharacter(found);
      setActiveView('sheet');
    }
  };

  const startNew = () => {
    const fresh = createDefaultCharacter();
    fresh.name = '';
    fresh.concept = '';
    setCharacter(fresh);
    setWizardStep(0);
    setActiveView('wizard');
  };

  const deleteCharacterAction = async (id: string) => {
    await deleteCharacter(id);
    await loadSavedCharactersList();
  };

  const duplicateCharacterAction = async (id: string) => {
    const clone = await duplicateCharacter(id);
    await loadSavedCharactersList();
    if (clone) {
      setCharacter(clone);
      setActiveView('sheet');
    }
  };

  const triggerRoll = (
    title: string,
    diceCount: number,
    diceSides: number,
    modifier: number,
    details?: string,
    rollType: 'adv' | 'dis' | 'normal' = 'normal'
  ) => {
    const dice: number[] = [];
    let total = modifier;

    if (diceSides === 20 && rollType !== 'normal') {
      const d1 = Math.floor(Math.random() * 20) + 1;
      const d2 = Math.floor(Math.random() * 20) + 1;
      dice.push(d1, d2);
      const chosen = rollType === 'adv' ? Math.max(d1, d2) : Math.min(d1, d2);
      total += chosen;
    } else {
      for (let i = 0; i < diceCount; i++) {
        const val = Math.floor(Math.random() * diceSides) + 1;
        dice.push(val);
        total += val;
      }
    }

    const modSign = modifier >= 0 ? `+${modifier}` : `${modifier}`;
    const expression = rollType === 'adv' ? `2d20 (Advantage) ${modSign}` : rollType === 'dis' ? `2d20 (Disadvantage) ${modSign}` : `${diceCount}d${diceSides} ${modSign}`;

    setActiveRoll({
      title,
      expression,
      dice,
      modifier,
      total,
      advantage: rollType,
      details
    });
  };

  const closeRollModal = () => {
    setActiveRoll(null);
  };

  return (
    <CharacterContext.Provider
      value={{
        character,
        setCharacter,
        updateCharacter,
        derivedStats,
        savedCharacters,
        activeView,
        setActiveView,
        wizardStep,
        setWizardStep,
        isCompendiumOpen,
        setIsCompendiumOpen,
        compendiumSearch,
        setCompendiumSearch,
        activeRoll,
        triggerRoll,
        closeRollModal,
        saveCurrentCharacter: saveCurrent,
        loadSavedCharacters: loadSavedCharactersList,
        loadCharacter: loadCharacterById,
        startNewCharacter: startNew,
        deleteCharacterAndRefresh: deleteCharacterAction,
        duplicateCharacterAndRefresh: duplicateCharacterAction
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};

