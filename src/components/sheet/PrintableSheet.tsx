import React, { useState, useEffect } from 'react';
import { useCharacter } from '../../state/CharacterContext';
import { generateFilledCharacterPdf } from '../../engine/pdfFiller';
import { formatModifier } from '../../engine/abilityScores';
import { SkillKey, DndClass, DndSpecies, DndBackground, DndFeat } from '../../types/dnd';
import classesData from '../../data/classes.json';
import speciesData from '../../data/species.json';
import backgroundsData from '../../data/backgrounds.json';
import featsData from '../../data/feats.json';
import {
  Printer, Download, ExternalLink, RefreshCw, ArrowLeft,
  FileText, Eye, AlertCircle, Sparkles
} from 'lucide-react';

const CLASSES = classesData as DndClass[];
const SPECIES = speciesData as DndSpecies[];
const BACKGROUNDS = backgroundsData as DndBackground[];
const ALL_FEATS = featsData as DndFeat[];

export const PrintableSheet: React.FC = () => {
  const { character, derivedStats, setActiveView } = useCharacter();
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'pdf' | 'html'>('pdf');

  const cls = CLASSES.find(c => c.id === character.classId) || CLASSES[0];
  const species = SPECIES.find(s => s.id === character.speciesId) || SPECIES[0];
  const bg = BACKGROUNDS.find(b => b.id === character.backgroundId) || BACKGROUNDS[0];
  const originFeat = ALL_FEATS.find(f => f.id === bg.featId);

  const generatePdf = async () => {
    setLoading(true);
    setError(null);
    try {
      const { blobUrl } = await generateFilledCharacterPdf(character, derivedStats);
      setPdfBlobUrl(blobUrl);
    } catch (err) {
      console.error('Error generating filled PDF:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generatePdf();
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [character, derivedStats]);

  const handleDownload = () => {
    if (!pdfBlobUrl) return;
    const a = document.createElement('a');
    a.href = pdfBlobUrl;
    const cleanName = (character.name || 'character').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.download = `${cleanName}-official-sheet-2024.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handlePrint = () => {
    if (viewMode === 'pdf') {
      const iframe = document.getElementById('pdf-frame') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.print();
      } else {
        window.print();
      }
    } else {
      window.print();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5 animate-in fade-in">
      {/* Control Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-md border border-dnd-gold/50 bg-gradient-to-r from-[#2A1E15] via-[#1E1712] to-[#14100C] shadow-lg">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveView('sheet')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-parchment-border/40 text-xs font-sans text-parchment hover:border-dnd-gold hover:text-dnd-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Interactive Sheet</span>
          </button>
          <div>
            <h2 className="font-cinzel text-lg font-bold text-parchment-light">
              Official 2024 Character Sheet PDF
            </h2>
            <p className="text-[11px] font-sans text-dnd-gold">
              Auto-populated in the official D&amp;D template with all scores, saves, attacks &amp; features.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-ink-pure p-1 rounded border border-parchment-border/30 text-xs font-sans mr-2">
            <button
              type="button"
              onClick={() => setViewMode('pdf')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                viewMode === 'pdf'
                  ? 'bg-dnd-gold text-ink-pure font-bold'
                  : 'text-parchment-dim hover:text-parchment'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF Reader</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('html')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                viewMode === 'html'
                  ? 'bg-dnd-gold text-ink-pure font-bold'
                  : 'text-parchment-dim hover:text-parchment'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Web Sheet</span>
            </button>
          </div>

          <button
            type="button"
            onClick={generatePdf}
            title="Re-populate PDF"
            className="p-2 rounded border border-parchment-border/40 text-parchment-dim hover:text-parchment hover:bg-ink-light transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {pdfBlobUrl && (
            <a
              href={pdfBlobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-parchment-border/40 text-xs font-sans text-parchment hover:border-dnd-gold hover:text-dnd-gold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open New Tab</span>
            </a>
          )}

          <button
            type="button"
            onClick={handleDownload}
            disabled={!pdfBlobUrl}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-dnd-moss hover:bg-dnd-moss-light text-parchment font-sans font-semibold text-xs transition-colors shadow-sm disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Filled PDF</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-dnd-crimson hover:bg-dnd-crimson-light text-parchment font-cinzel font-bold text-xs tracking-wider border border-dnd-gold/60 shadow-md transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* Embedded PDF Viewer Mode */}
      {viewMode === 'pdf' && (
        <div className="relative w-full rounded-lg border-2 border-dnd-gold/60 bg-[#16130F] overflow-hidden shadow-2xl">
          {loading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-ink-pure/80 backdrop-blur-sm gap-3">
              <Sparkles className="w-8 h-8 text-dnd-gold animate-bounce" />
              <p className="font-cinzel text-sm font-bold text-parchment tracking-wider">
                Populating Official 2024 Character Sheet PDF...
              </p>
            </div>
          )}

          {error && (
            <div className="p-8 text-center space-y-3">
              <AlertCircle className="w-10 h-10 mx-auto text-red-400" />
              <h3 className="font-cinzel text-lg font-bold text-parchment">Failed to Populate PDF</h3>
              <p className="text-xs font-sans text-parchment-dim">{error}</p>
              <button
                type="button"
                onClick={generatePdf}
                className="px-4 py-2 rounded bg-dnd-crimson text-parchment text-xs font-bold"
              >
                Retry Generation
              </button>
            </div>
          )}

          {pdfBlobUrl && !error && (
            <iframe
              id="pdf-frame"
              src={`${pdfBlobUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              title="Official Filled D&D Character Sheet PDF"
              className="w-full h-[880px] bg-white border-0"
            />
          )}
        </div>
      )}

      {/* Fallback / Alternative HTML Web Sheet Mode */}
      {viewMode === 'html' && (
        <div className="p-6 bg-[#FCF9F2] text-[#1B1712] border-2 border-[#1B1712] rounded font-serif shadow-2xl print:shadow-none print:p-0 print:border-none">
          {/* Header Block */}
          <div className="border-b-2 border-[#1B1712] pb-4 mb-4 flex flex-wrap justify-between items-end gap-3">
            <div>
              <h1 className="font-cinzel text-3xl font-black tracking-wider text-[#58180D]">
                {character.name || 'Unnamed Adventurer'}
              </h1>
              <p className="text-sm font-sans font-semibold text-[#66543A]">
                Level 1 {species.name} {cls.name} · {bg.name} · {character.alignment || 'Neutral Good'}
              </p>
            </div>
            <div className="text-right text-xs font-sans">
              <span className="font-bold block uppercase tracking-widest text-[#58180D]">2024 Player's Handbook</span>
              <span className="text-gray-600">Proficiency Bonus: +{derivedStats.proficiencyBonus}</span>
            </div>
          </div>

          {/* 3 Columns Layout */}
          <div className="grid grid-cols-12 gap-4">
            {/* Col 1: Abilities & Saving Throws (3 cols) */}
            <div className="col-span-3 space-y-3">
              <div className="space-y-2">
                {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map((key) => {
                  const score = derivedStats.finalAbilities[key];
                  const mod = derivedStats.modifiers[key];
                  const save = derivedStats.savingThrows[key];

                  return (
                    <div key={key} className="border border-[#1B1712] rounded p-2 text-center bg-white">
                      <span className="text-[10px] font-sans font-bold uppercase text-[#58180D] block">
                        {key.toUpperCase()}
                      </span>
                      <div className="font-cinzel text-xl font-bold">{score}</div>
                      <div className="text-xs font-bold text-[#58180D] font-sans">{formatModifier(mod)}</div>
                      <div className="text-[9px] font-sans text-gray-600 mt-0.5 border-t pt-0.5">
                        Save: <strong>{formatModifier(save.bonus)}</strong> {save.proficient && '★'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Senses & Passives */}
              <div className="border border-[#1B1712] rounded p-2 text-xs font-sans bg-white space-y-1">
                <span className="font-bold text-[10px] uppercase text-[#58180D] block">Passive Scores</span>
                <div>Perception: <strong>{derivedStats.passivePerception}</strong></div>
                <div>Investigation: <strong>{derivedStats.passiveInvestigation}</strong></div>
                <div>Insight: <strong>{derivedStats.passiveInsight}</strong></div>
              </div>
            </div>

            {/* Col 2: Skills & Combat Vitals (4 cols) */}
            <div className="col-span-4 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-sans">
                <div className="border border-[#1B1712] rounded p-2 bg-white">
                  <span className="text-[9px] uppercase font-bold text-[#58180D] block">AC</span>
                  <span className="font-cinzel text-xl font-black">{derivedStats.armorClass}</span>
                </div>
                <div className="border border-[#1B1712] rounded p-2 bg-white">
                  <span className="text-[9px] uppercase font-bold text-[#58180D] block">HP</span>
                  <span className="font-cinzel text-xl font-black">{derivedStats.maxHp}</span>
                </div>
                <div className="border border-[#1B1712] rounded p-2 bg-white">
                  <span className="text-[9px] uppercase font-bold text-[#58180D] block">Init</span>
                  <span className="font-cinzel text-xl font-black">{formatModifier(derivedStats.initiative)}</span>
                </div>
              </div>

              {/* Skills List */}
              <div className="border border-[#1B1712] rounded p-2 text-xs font-sans bg-white">
                <span className="font-bold text-[10px] uppercase text-[#58180D] block mb-1 border-b pb-0.5">
                  Skills
                </span>
                <div className="space-y-0.5 max-h-[460px] overflow-hidden text-[11px]">
                  {(Object.keys(derivedStats.skills) as SkillKey[]).map((sk) => {
                    const s = derivedStats.skills[sk];
                    return (
                      <div key={sk} className="flex justify-between items-center py-0.2 border-b border-gray-100">
                        <span className={s.proficient ? 'font-bold text-black' : 'text-gray-700'}>
                          {s.proficient ? '● ' : '○ '} {sk}
                        </span>
                        <span className="font-semibold">{formatModifier(s.bonus)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Col 3: Attacks, Features, Spells & Gear (5 cols) */}
            <div className="col-span-5 space-y-3 text-xs font-sans">
              <div className="border border-[#1B1712] rounded p-2 bg-white">
                <span className="font-bold text-[10px] uppercase text-[#58180D] block mb-1 border-b pb-0.5">
                  Attacks &amp; Masteries
                </span>
                <div className="space-y-1">
                  {derivedStats.weaponAttacks.map((atk, idx) => (
                    <div key={idx} className="flex justify-between border-b pb-1">
                      <div>
                        <strong className="text-black">{atk.name}</strong>
                        {atk.mastery && <span className="text-[10px] text-gray-600 ml-1">({atk.mastery})</span>}
                      </div>
                      <div>
                        <span className="font-bold mr-2">+{atk.attackBonus}</span>
                        <span>{atk.damage} {atk.damageType}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-[#1B1712] rounded p-2 bg-white space-y-1.5">
                <span className="font-bold text-[10px] uppercase text-[#58180D] block border-b pb-0.5">
                  Features &amp; Feats
                </span>
                {cls.features.map((f, i) => (
                  <div key={i} className="text-[11px]">
                    <strong>{f.name}:</strong> <span className="text-gray-700">{f.description}</span>
                  </div>
                ))}
                {originFeat && (
                  <div className="text-[11px] pt-1 border-t">
                    <strong>Origin Feat ({originFeat.name}):</strong> <span className="text-gray-700">{originFeat.description}</span>
                  </div>
                )}
              </div>

              <div className="border border-[#1B1712] rounded p-2 bg-white text-[11px]">
                <div className="flex justify-between font-bold text-[10px] uppercase text-[#58180D] border-b pb-0.5">
                  <span>Equipment</span>
                  <span>Gold: {character.gold} GP</span>
                </div>
                <p className="mt-1 text-gray-700">
                  {character.inventory.map(i => `${i.name}${i.quantity > 1 ? ` (×${i.quantity})` : ''}`).join(', ') || 'No equipment listed.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
