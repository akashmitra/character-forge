import React from 'react';
import { BookOpen } from 'lucide-react';
import { useCharacter } from '../../state/CharacterContext';

interface PHBBadgeProps {
  page: number;
  className?: string;
  topic?: string;
}

export const PHBBadge: React.FC<PHBBadgeProps> = ({ page, className = '', topic }) => {
  const { setIsCompendiumOpen, setCompendiumSearch } = useCharacter();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (topic) {
      setCompendiumSearch(topic);
    }
    setIsCompendiumOpen(true);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`Click to look up "${topic || `PHB p.${page}`}" in Reference Compendium`}
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-sans font-medium border border-parchment-border/40 bg-ink-pure/60 text-dnd-gold hover:text-dnd-gold-light hover:border-dnd-gold/60 transition-colors shadow-sm ${className}`}
    >
      <BookOpen className="w-3 h-3 text-dnd-gold/80" />
      <span>PHB p.{page}</span>
    </button>
  );
};

