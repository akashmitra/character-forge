import React, { ReactNode } from 'react';
import clsx from 'clsx';

interface ParchmentCardProps {
  children: ReactNode;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
  hoverable?: boolean;
  title?: string;
  subtitle?: string;
  badge?: ReactNode;
  headerAction?: ReactNode;
}

export const ParchmentCard: React.FC<ParchmentCardProps> = ({
  children,
  className = '',
  selected = false,
  onClick,
  hoverable = false,
  title,
  subtitle,
  badge,
  headerAction
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'relative rounded-sm border p-4 transition-all duration-200 text-left',
        'bg-gradient-to-b from-[#251F18] via-[#1E1914] to-[#17130F]',
        selected
          ? 'border-dnd-gold shadow-dnd-glow ring-1 ring-dnd-gold/60'
          : 'border-parchment-border/30 hover:border-parchment-border/70',
        hoverable && !selected && 'hover:bg-ink-light/40 cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Ornate corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-dnd-gold/40" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-dnd-gold/40" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-dnd-gold/40" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-dnd-gold/40" />

      {(title || subtitle || badge || headerAction) && (
        <div className="flex items-start justify-between gap-2 pb-3 mb-3 border-b border-parchment-border/20">
          <div>
            {title && (
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-parchment-light tracking-wide flex items-center gap-2">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs font-sans text-parchment-dark/75 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {badge}
            {headerAction}
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

