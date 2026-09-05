import React from 'react';
import { useCharacter } from '../../state/CharacterContext';
import { SkillKey, DndClass, DndBackground } from '../../types/dnd';
import classesData from '../../data/classes.json';
import backgroundsData from '../../data/backgrounds.json';
import { SKILL_ABILITY_MAP } from '../../engine/statsCalculator';
import { formatModifier } from '../../engine/abilityScores';
import { ParchmentCard } from '../common/ParchmentCard';
import { Award, Star, Check } from 'lucide-react';

const CLASSES = classesData as DndClass[];
const BACKGROUNDS = backgroundsData as DndBackground[];

export const StepSkills: React.FC = () => {
  const { character, updateCharacter, derivedStats } = useCharacter();
  const cls = CLASSES.find(c => c.id === character.classId) || CLASSES[0];
  const bg = BACKGROUNDS.find(b => b.id === character.backgroundId) || BACKGROUNDS[0];

  const classSkillPool = cls.skillChoices.options;
  const maxClassSkills = cls.skillChoices.count;
  const currentClassSkills = character.selectedClassSkills || [];
  const backgroundSkills = bg.skills || [];

  const handleToggleClassSkill = (skill: SkillKey) => {
    if (backgroundSkills.includes(skill)) return; // Locked by background

    if (currentClassSkills.includes(skill)) {
      updateCharacter({
        selectedClassSkills: currentClassSkills.filter(s => s !== skill)
      });
    } else {
      if (currentClassSkills.length < maxClassSkills) {
        updateCharacter({
          selectedClassSkills: [...currentClassSkills, skill]
        });
      }
    }
  };

  const handleToggleExpertise = (skill: SkillKey) => {
    const currentExp = character.expertiseSkills || [];
    if (currentExp.includes(skill)) {
      updateCharacter({
        expertiseSkills: currentExp.filter(s => s !== skill)
      });
    } else {
      if (currentExp.length < 2) {
        updateCharacter({
          expertiseSkills: [...currentExp, skill]
        });
      }
    }
  };

  const isRogue = cls.id === 'rogue';

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div>
        <h2 className="font-cinzel text-xl font-bold text-parchment tracking-wide mb-1">
          Skill &amp; Tool Proficiencies
        </h2>
        <p className="text-xs font-sans text-parchment-dim">
          Proficiency adds your Proficiency Bonus (+2) to checks. In the 2024 rules, backgrounds grant 2 fixed skills, while your class offers a customized selection pool.
        </p>
      </div>

      {/* Class Skill Selection Status Bar */}
      <div className="p-3.5 rounded bg-ink-pure/80 border border-dnd-gold/40 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
        <div>
          <span className="text-dnd-gold font-bold font-cinzel text-sm">
            {cls.name} Skills Selection:
          </span>
          <span className="text-parchment ml-2">
            Choose <strong className="text-dnd-gold-light">{maxClassSkills}</strong> skills from your class list.
          </span>
        </div>
        <div className={`font-bold ${currentClassSkills.length === maxClassSkills ? 'text-dnd-moss-light' : 'text-dnd-gold-light'}`}>
          {currentClassSkills.length} / {maxClassSkills} Picked
        </div>
      </div>

      {/* Rogue Expertise Section (if Rogue) */}
      {isRogue && (
        <ParchmentCard
          title="Rogue Expertise (Level 1 Feature)"
          subtitle="Choose two of your proficiencies. Your Proficiency Bonus is doubled (+4) on checks made with them."
        >
          <div className="mt-3">
            <span className="text-xs font-sans font-bold text-dnd-gold block mb-2">
              Select 2 Skills for Expertise ({character.expertiseSkills?.length || 0} / 2):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(derivedStats.skills)
                .filter(([_, data]) => data.proficient)
                .map(([skillName]) => {
                  const sk = skillName as SkillKey;
                  const isExp = character.expertiseSkills?.includes(sk);
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => handleToggleExpertise(sk)}
                      className={`p-2 rounded border text-left text-xs font-sans transition-all flex items-center justify-between ${
                        isExp
                          ? 'border-dnd-gold bg-dnd-gold/20 text-parchment font-bold ring-1 ring-dnd-gold'
                          : 'border-parchment-border/30 bg-ink-pure/60 text-parchment-dim hover:text-parchment'
                      }`}
                    >
                      <span>{sk}</span>
                      {isExp && <Star className="w-3.5 h-3.5 text-dnd-gold fill-dnd-gold" />}
                    </button>
                  );
                })}
            </div>
          </div>
        </ParchmentCard>
      )}

      {/* All 18 Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {(Object.keys(SKILL_ABILITY_MAP) as SkillKey[]).map((skillName) => {
          const abilityKey = SKILL_ABILITY_MAP[skillName];
          const skillData = derivedStats.skills[skillName];
          const isFromClass = currentClassSkills.includes(skillName);
          const isFromBg = backgroundSkills.includes(skillName);
          const isAvailableForClass = classSkillPool.includes(skillName);

          return (
            <div
              key={skillName}
              onClick={() => isAvailableForClass && !isFromBg && handleToggleClassSkill(skillName)}
              className={`p-3 rounded border text-left transition-all ${
                isFromBg
                  ? 'border-dnd-moss/60 bg-dnd-moss/10'
                  : isFromClass
                  ? 'border-dnd-gold bg-dnd-gold/20 shadow-sm cursor-pointer'
                  : isAvailableForClass
                  ? 'border-parchment-border/30 bg-ink-pure/60 hover:border-parchment-border/70 hover:bg-ink-light/40 cursor-pointer'
                  : 'border-parchment-border/15 bg-ink-pure/30 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                    skillData.expertise
                      ? 'bg-dnd-gold text-ink-pure font-bold'
                      : skillData.proficient
                      ? 'bg-dnd-moss text-parchment font-bold'
                      : 'border border-parchment-border/30 bg-ink-pure text-transparent'
                  }`}>
                    {skillData.proficient && <Check className="w-3 h-3" />}
                  </div>
                  <div>
                    <span className="font-serif font-bold text-xs sm:text-sm text-parchment-light block leading-none">
                      {skillName}
                    </span>
                    <span className="text-[10px] font-sans text-parchment-dim uppercase">
                      {abilityKey}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`font-cinzel text-sm font-bold ${skillData.proficient ? 'text-dnd-gold' : 'text-parchment-dim'}`}>
                    {formatModifier(skillData.bonus)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-sans pt-1 border-t border-parchment-border/15">
                <span className="text-parchment-dim">
                  {isFromBg
                    ? 'Background locked'
                    : isFromClass
                    ? 'Class chosen'
                    : isAvailableForClass
                    ? 'Available in class pool'
                    : 'Not in class pool'}
                </span>
                {skillData.expertise && (
                  <span className="text-dnd-gold font-bold uppercase flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-dnd-gold" /> Expertise
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

