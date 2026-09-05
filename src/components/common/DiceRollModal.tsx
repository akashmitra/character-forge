import React, { useEffect, useState } from 'react';
import { useCharacter } from '../../state/CharacterContext';
import { Dices, Sparkles, X, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

export const DiceRollModal: React.FC = () => {
  const { activeRoll, closeRollModal } = useCharacter();
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (activeRoll) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 400);

      // Trigger confetti on Nat 20
      if (activeRoll.dice.length === 1 && activeRoll.dice[0] === 20) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#DFC068', '#C29336', '#932828']
        });
      }

      return () => clearTimeout(timer);
    }
  }, [activeRoll]);

  if (!activeRoll) return null;

  const isD20 = activeRoll.expression.includes('d20');
  const d20Val = isD20 && activeRoll.dice.length > 0 ? activeRoll.dice[0] : null;
  const isNat20 = isD20 && d20Val === 20;
  const isNat1 = isD20 && d20Val === 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-lg border-2 border-dnd-gold bg-gradient-to-b from-[#2A231B] to-[#16130F] p-6 shadow-2xl text-center">
        {/* Close Button */}
        <button
          onClick={closeRollModal}
          className="absolute top-3 right-3 text-parchment-dim hover:text-parchment transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-2 text-dnd-gold font-cinzel text-lg font-bold">
          <Dices className="w-5 h-5 text-dnd-gold animate-bounce" />
          <span>{activeRoll.title}</span>
        </div>
        <div className="text-xs font-sans text-parchment-dark/70 tracking-wider uppercase mb-4">
          {activeRoll.expression}
        </div>

        {/* Big Total Box */}
        <div className={`my-4 p-5 rounded-md border ${
          isNat20
            ? 'border-dnd-gold bg-dnd-gold/20 shadow-dnd-glow'
            : isNat1
            ? 'border-dnd-crimson bg-dnd-crimson/20'
            : 'border-parchment-border/40 bg-ink-pure/60'
        }`}>
          <div className={`font-cinzel text-5xl font-black transition-transform duration-200 ${
            animating ? 'scale-125 rotate-3' : 'scale-100'
          } ${
            isNat20 ? 'text-dnd-gold-light' : isNat1 ? 'text-red-400' : 'text-parchment-light'
          }`}>
            {activeRoll.total}
          </div>

          {isNat20 && (
            <div className="flex items-center justify-center gap-1.5 mt-2 text-xs font-bold text-dnd-gold-light font-cinzel tracking-wider animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>NATURAL 20! CRITICAL SUCCESS!</span>
            </div>
          )}

          {isNat1 && (
            <div className="flex items-center justify-center gap-1.5 mt-2 text-xs font-bold text-red-400 font-cinzel tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>NATURAL 1! CRITICAL MISS!</span>
            </div>
          )}
        </div>

        {/* Breakdown */}
        <div className="text-xs font-sans text-parchment-dim space-y-1 mb-5">
          <div className="flex justify-between border-b border-parchment-border/20 py-1">
            <span>Dice Result{activeRoll.dice.length > 1 ? 's' : ''}:</span>
            <span className="font-semibold text-parchment">[{activeRoll.dice.join(', ')}]</span>
          </div>
          <div className="flex justify-between border-b border-parchment-border/20 py-1">
            <span>Modifier:</span>
            <span className="font-semibold text-parchment">{activeRoll.modifier >= 0 ? `+${activeRoll.modifier}` : activeRoll.modifier}</span>
          </div>
          {activeRoll.details && (
            <div className="text-[11px] text-parchment-dark/70 pt-1 italic text-left">
              {activeRoll.details}
            </div>
          )}
        </div>

        {/* Action button */}
        <button
          onClick={closeRollModal}
          className="w-full py-2 px-4 rounded bg-dnd-crimson hover:bg-dnd-crimson-light text-parchment font-cinzel font-bold text-sm tracking-wide border border-dnd-gold/40 transition-colors shadow-md"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

