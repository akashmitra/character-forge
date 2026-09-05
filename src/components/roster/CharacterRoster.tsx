import React, { useRef } from 'react';
import { useCharacter } from '../../state/CharacterContext';
import { exportCharacterToJson, importCharacterFromJson } from '../../storage/exportImport';
import portraitsData from '../../data/portraits.json';
import classesData from '../../data/classes.json';
import speciesData from '../../data/species.json';
import { Plus, Upload, Trash2, Copy, Play, Shield, Users, Download } from 'lucide-react';
import { CharacterData } from '../../types/character';

export const CharacterRoster: React.FC = () => {
  const {
    savedCharacters,
    loadCharacter,
    startNewCharacter,
    deleteCharacterAndRefresh,
    duplicateCharacterAndRefresh,
    setCharacter,
    setActiveView
  } = useCharacter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imported = await importCharacterFromJson(file);
        setCharacter(imported);
        setActiveView('sheet');
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to import character');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-parchment-border/30 pb-6">
        <div>
          <div className="flex items-center gap-2 text-dnd-gold mb-1">
            <Users className="w-5 h-5" />
            <span className="font-cinzel text-xs font-bold uppercase tracking-widest">
              Adventurers Roster
            </span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-parchment-light">
            Your Forged Heroes
          </h1>
          <p className="text-xs font-sans text-parchment-dim mt-1">
            Saved on this device via IndexedDB. Fully usable offline.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded border border-parchment-border/40 text-xs font-sans font-semibold text-parchment hover:border-dnd-gold hover:text-dnd-gold transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Import JSON</span>
          </button>

          <button
            type="button"
            onClick={startNewCharacter}
            className="flex items-center gap-1.5 px-5 py-2 rounded bg-dnd-crimson hover:bg-dnd-crimson-light text-parchment font-cinzel font-bold text-xs tracking-wider border border-dnd-gold/60 shadow-dnd-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Forge New Hero</span>
          </button>
        </div>
      </div>

      {/* Roster Cards Grid */}
      {savedCharacters.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-parchment-border/30 rounded-lg p-8 space-y-4">
          <Shield className="w-16 h-16 mx-auto text-dnd-gold/40" />
          <h3 className="font-cinzel text-xl font-bold text-parchment">
            No Heroes in the Roster Yet
          </h3>
          <p className="text-xs font-sans text-parchment-dim max-w-md mx-auto leading-relaxed">
            Begin your journey with the 2024 D&amp;D rules wizard to craft your first Level 1 adventurer.
          </p>
          <button
            type="button"
            onClick={startNewCharacter}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-dnd-crimson text-parchment font-cinzel font-bold text-xs tracking-wider border border-dnd-gold/60 shadow-md hover:bg-dnd-crimson-light transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Forge Your First Character</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedCharacters.map((char: CharacterData) => {
            const cls = classesData.find(c => c.id === char.classId);
            const sp = speciesData.find(s => s.id === char.speciesId);
            const portraitPreset = portraitsData.find(p => p.id === char.portraitUrl);

            return (
              <div
                key={char.id}
                className="group relative rounded-md border border-parchment-border/30 bg-gradient-to-b from-[#241F18] via-[#1D1914] to-[#15120E] p-4 shadow-dnd-card hover:border-dnd-gold transition-all duration-200"
              >
                {/* Ornate corner accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-dnd-gold/40" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-dnd-gold/40" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-dnd-gold/40" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-dnd-gold/40" />

                <div className="flex items-start gap-3 mb-3">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full border border-dnd-gold/60 overflow-hidden bg-ink-pure flex-shrink-0 flex items-center justify-center">
                    {char.portraitUrl?.startsWith('data:') ? (
                      <img src={char.portraitUrl} alt={char.name} className="w-full h-full object-cover" />
                    ) : portraitPreset ? (
                      <div
                        className="w-12 h-12 flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: portraitPreset.iconSvg }}
                      />
                    ) : (
                      <Shield className="w-8 h-8 text-dnd-gold" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-cinzel text-lg font-bold text-parchment-light truncate group-hover:text-dnd-gold-light transition-colors">
                      {char.name || 'Unnamed Adventurer'}
                    </h3>
                    <p className="text-xs font-sans text-dnd-gold font-semibold truncate">
                      {sp?.name || 'Human'} {cls?.name || 'Fighter'}
                    </p>
                    <p className="text-[11px] font-sans text-parchment-dim truncate">
                      Background: {char.backgroundId}
                    </p>
                  </div>
                </div>

                {char.concept && (
                  <p className="text-xs font-serif text-parchment-dim italic line-clamp-2 mb-3 bg-ink-pure/50 p-2 rounded border border-parchment-border/15">
                    "{char.concept}"
                  </p>
                )}

                {/* Card Controls */}
                <div className="pt-2 border-t border-parchment-border/20 flex items-center justify-between gap-1 text-xs font-sans">
                  <button
                    type="button"
                    onClick={() => loadCharacter(char.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-dnd-moss hover:bg-dnd-moss-light text-parchment font-semibold transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-parchment" />
                    <span>Open Sheet</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => duplicateCharacterAndRefresh(char.id)}
                      title="Duplicate character"
                      className="p-1.5 rounded text-parchment-dim hover:text-parchment hover:bg-ink-light"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => exportCharacterToJson(char)}
                      title="Export JSON"
                      className="p-1.5 rounded text-parchment-dim hover:text-parchment hover:bg-ink-light"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete ${char.name || 'this character'}?`)) {
                          deleteCharacterAndRefresh(char.id);
                        }
                      }}
                      title="Delete character"
                      className="p-1.5 rounded text-parchment-dim hover:text-red-400 hover:bg-ink-light"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

