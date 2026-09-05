import React, { useState, useMemo } from 'react';
import { useCharacter } from '../../state/CharacterContext';
import { X, Search, BookOpen, Shield, Sword, Sparkles, User, Award } from 'lucide-react';
import classesData from '../../data/classes.json';
import speciesData from '../../data/species.json';
import backgroundsData from '../../data/backgrounds.json';
import featsData from '../../data/feats.json';
import equipmentData from '../../data/equipment.json';
import spellsData from '../../data/spells.json';
import { WEAPON_MASTERIES } from '../../engine/weaponMastery';
import { PHBBadge } from '../common/PHBBadge';

type CompendiumTab = 'all' | 'spells' | 'feats' | 'masteries' | 'classes' | 'species' | 'backgrounds' | 'equipment';

export const CompendiumDrawer: React.FC = () => {
  const { isCompendiumOpen, setIsCompendiumOpen, compendiumSearch, setCompendiumSearch } = useCharacter();
  const [activeTab, setActiveTab] = useState<CompendiumTab>('all');

  const filteredResults = useMemo(() => {
    const q = compendiumSearch.toLowerCase().trim();

    const results: {
      type: string;
      title: string;
      subtitle?: string;
      body: string;
      bullets?: string[];
      phbPage: number;
      category: CompendiumTab;
    }[] = [];

    // Spells
    if (activeTab === 'all' || activeTab === 'spells') {
      spellsData.forEach(s => {
        if (!q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.classes.some(c => c.toLowerCase().includes(q))) {
          results.push({
            type: `Spell (Level ${s.level === 0 ? 'Cantrip' : '1'} ${s.school})`,
            title: s.name,
            subtitle: `${s.castingTime} · ${s.range} · ${s.duration}${s.concentration ? ' (Conc)' : ''}${s.ritual ? ' (Ritual)' : ''}`,
            body: `${s.description} — Classes: ${s.classes.join(', ')}`,
            phbPage: s.phbPage,
            category: 'spells'
          });
        }
      });
    }

    // Feats
    if (activeTab === 'all' || activeTab === 'feats') {
      featsData.forEach(f => {
        if (!q || f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)) {
          results.push({
            type: `${f.category} Feat`,
            title: f.name,
            subtitle: f.description,
            body: '',
            bullets: f.bullets,
            phbPage: f.phbPage,
            category: 'feats'
          });
        }
      });
    }

    // Weapon Masteries
    if (activeTab === 'all' || activeTab === 'masteries') {
      Object.values(WEAPON_MASTERIES).forEach(m => {
        if (!q || m.name.toLowerCase().includes(q) || m.rule.toLowerCase().includes(q)) {
          results.push({
            type: 'Weapon Mastery Property',
            title: m.name,
            subtitle: m.summary,
            body: m.rule,
            phbPage: m.phbPage,
            category: 'masteries'
          });
        }
      });
    }

    // Classes
    if (activeTab === 'all' || activeTab === 'classes') {
      classesData.forEach(c => {
        if (!q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) {
          results.push({
            type: 'Class',
            title: c.name,
            subtitle: `Hit Die d${c.hitDie} · Saves: ${c.savingThrows.join(', ').toUpperCase()} · Armor: ${c.armorTraining.join(', ') || 'None'}`,
            body: `${c.description} Features: ${c.features.map(f => f.name).join(', ')}`,
            phbPage: c.phbPage,
            category: 'classes'
          });
        }
      });
    }

    // Species
    if (activeTab === 'all' || activeTab === 'species') {
      speciesData.forEach(s => {
        if (!q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)) {
          results.push({
            type: 'Species',
            title: s.name,
            subtitle: `Size: ${s.size} · Speed: ${s.speed} ft`,
            body: `${s.description} Traits: ${s.traits.map(t => `${t.name}: ${t.description}`).join(' ')}`,
            phbPage: s.phbPage,
            category: 'species'
          });
        }
      });
    }

    // Backgrounds
    if (activeTab === 'all' || activeTab === 'backgrounds') {
      backgroundsData.forEach(b => {
        if (!q || b.name.toLowerCase().includes(q) || b.flavor.toLowerCase().includes(q)) {
          results.push({
            type: 'Background',
            title: b.name,
            subtitle: `Abilities: ${b.abilityScoreOptions.join(', ').toUpperCase()} · Feat: ${b.featId}`,
            body: `${b.flavor} Skills: ${b.skills.join(', ')} · Tool: ${b.toolProficiency}`,
            phbPage: b.phbPage,
            category: 'backgrounds'
          });
        }
      });
    }

    // Equipment (Weapons & Armor)
    if (activeTab === 'all' || activeTab === 'equipment') {
      equipmentData.weapons.forEach(w => {
        if (!q || w.name.toLowerCase().includes(q) || w.mastery.toLowerCase().includes(q)) {
          results.push({
            type: `Weapon (${w.category})`,
            title: w.name,
            subtitle: `${w.damage} ${w.damageType} · Mastery: ${w.mastery} · Cost: ${w.costGold} GP · Weight: ${w.weight} lb`,
            body: `Properties: ${w.properties.join(', ') || 'None'}`,
            phbPage: w.phbPage,
            category: 'equipment'
          });
        }
      });
      equipmentData.armor.forEach(a => {
        if (!q || a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)) {
          results.push({
            type: `Armor (${a.category})`,
            title: a.name,
            subtitle: `Base AC: ${a.baseAC} · Dex: ${a.dexBonusType} · Cost: ${a.costGold} GP · Weight: ${a.weight} lb`,
            body: `Stealth Disadvantage: ${a.stealthDisadvantage ? 'Yes' : 'No'}${a.strengthRequirement ? ` · Req Str: ${a.strengthRequirement}` : ''}`,
            phbPage: a.phbPage,
            category: 'equipment'
          });
        }
      });
    }

    return results;
  }, [compendiumSearch, activeTab]);

  if (!isCompendiumOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl h-full bg-[#1A1612] border-l border-dnd-gold shadow-2xl flex flex-col">
        {/* Compendium Header */}
        <div className="p-4 sm:p-5 border-b border-parchment-border/30 bg-[#221D17]">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 text-dnd-gold">
              <BookOpen className="w-6 h-6" />
              <h2 className="font-cinzel text-lg sm:text-xl font-bold text-parchment tracking-wide">
                PHB 2024 Tabletop Reference
              </h2>
            </div>
            <button
              onClick={() => setIsCompendiumOpen(false)}
              className="p-1.5 rounded text-parchment-dim hover:text-parchment hover:bg-ink-light transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dnd-gold/70" />
            <input
              type="text"
              placeholder="Search spells, origin feats, weapon masteries, classes, rules..."
              value={compendiumSearch}
              onChange={(e) => setCompendiumSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded bg-ink-pure/80 border border-parchment-border/40 text-sm font-sans text-parchment placeholder:text-parchment-dim/50 focus:outline-none focus:border-dnd-gold focus:ring-1 focus:ring-dnd-gold"
            />
            {compendiumSearch && (
              <button
                onClick={() => setCompendiumSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-parchment-dim hover:text-parchment"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar text-xs font-sans">
            {[
              { id: 'all', label: 'All', icon: Sparkles },
              { id: 'spells', label: 'Spells', icon: Sparkles },
              { id: 'masteries', label: 'Masteries', icon: Sword },
              { id: 'feats', label: 'Origin Feats', icon: Award },
              { id: 'classes', label: 'Classes', icon: Shield },
              { id: 'species', label: 'Species', icon: User },
              { id: 'equipment', label: 'Weapons & Armor', icon: Sword }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as CompendiumTab)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-dnd-gold text-ink-pure font-bold'
                      : 'bg-ink-pure/60 text-parchment-dim hover:text-parchment hover:bg-ink-light'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-parchment-border/15">
          {filteredResults.length === 0 ? (
            <div className="text-center py-12 text-parchment-dim/60 font-serif">
              <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-30 text-dnd-gold" />
              <p>No entries found matching "{compendiumSearch}".</p>
            </div>
          ) : (
            filteredResults.map((item, idx) => (
              <div key={idx} className="pt-3 first:pt-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-dnd-gold">
                      {item.type}
                    </span>
                    <h3 className="font-cinzel text-base font-bold text-parchment-light">
                      {item.title}
                    </h3>
                  </div>
                  <PHBBadge page={item.phbPage} />
                </div>

                {item.subtitle && (
                  <p className="text-xs font-sans text-parchment-dim italic mb-1.5">
                    {item.subtitle}
                  </p>
                )}

                {item.body && (
                  <p className="text-xs font-sans text-parchment-dark/80 leading-relaxed">
                    {item.body}
                  </p>
                )}

                {item.bullets && (
                  <ul className="list-disc list-inside text-xs font-sans text-parchment-dark/80 space-y-1 mt-1">
                    {item.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

