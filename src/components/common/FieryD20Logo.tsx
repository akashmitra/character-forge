import React from 'react';

interface FieryD20LogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export const FieryD20Logo: React.FC<FieryD20LogoProps> = ({
  className = '',
  size = 42,
  animated = true
}) => {
  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 group ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-[0_0_12px_rgba(255,85,0,0.65)] ${
          animated ? 'hover:scale-105 transition-transform duration-300' : ''
        }`}
      >
        <defs>
          {/* Flame gradient */}
          <linearGradient id="flameGrad" x1="60" y1="5" x2="60" y2="115" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF275" />
            <stop offset="25%" stopColor="#FF9900" />
            <stop offset="55%" stopColor="#E63900" />
            <stop offset="85%" stopColor="#990000" />
            <stop offset="100%" stopColor="#4A0000" />
          </linearGradient>

          {/* Core Lava Die Gradient */}
          <radialGradient id="lavaCore" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#FFA62B" />
            <stop offset="35%" stopColor="#D9381E" />
            <stop offset="70%" stopColor="#7A1313" />
            <stop offset="100%" stopColor="#2E0808" />
          </radialGradient>

          {/* Facet Shader 1 */}
          <linearGradient id="facetTop" x1="60" y1="26" x2="60" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF8000" />
            <stop offset="100%" stopColor="#A31C1C" />
          </linearGradient>

          {/* Facet Shader 2 */}
          <linearGradient id="facetLeft" x1="28" y1="46" x2="52" y2="82" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9E1B1B" />
            <stop offset="100%" stopColor="#4D0B0B" />
          </linearGradient>

          {/* Facet Shader 3 */}
          <linearGradient id="facetRight" x1="92" y1="46" x2="68" y2="82" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#BF2C15" />
            <stop offset="100%" stopColor="#5E0F0F" />
          </linearGradient>

          {/* Gold Outline Stroke */}
          <linearGradient id="goldEdge" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="40%" stopColor="#DFC068" />
            <stop offset="80%" stopColor="#9A7124" />
            <stop offset="100%" stopColor="#5E4310" />
          </linearGradient>

          {/* Flame Glow Filter */}
          <filter id="fireGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Outer Dancing Flames Halo */}
        <g filter="url(#fireGlow)" opacity="0.9">
          {/* Main flame crown */}
          <path
            d="M60 4 C64 16, 74 18, 79 12 C82 24, 94 28, 98 22 C101 35, 112 42, 110 58 C116 50, 118 64, 112 78 C118 88, 108 102, 96 108 C102 112, 88 116, 76 114 C70 118, 50 118, 44 114 C32 116, 18 112, 24 108 C12 102, 2 88, 8 78 C2 64, 4 50, 10 58 C8 42, 19 35, 22 22 C26 28, 38 24, 41 12 C46 18, 56 16, 60 4 Z"
            fill="url(#flameGrad)"
            className={animated ? 'animate-pulse' : ''}
          />
        </g>

        {/* 2. Inner Flame Tendrils */}
        <g opacity="0.85">
          <path
            d="M60 10 C62 20, 70 22, 73 17 C76 27, 85 30, 88 26 C90 37, 98 42, 96 54 C100 48, 102 58, 97 70 C101 78, 94 88, 84 94 C76 98, 44 98, 36 94 C26 88, 19 78, 23 70 C18 58, 20 48, 24 54 C22 42, 30 37, 32 26 C35 30, 44 27, 47 17 C50 22, 58 20, 60 10 Z"
            fill="#FFAA00"
          />
        </g>

        {/* 3. Outer d20 Hexagonal Base */}
        <polygon
          points="60,22 96,42 96,82 60,102 24,82 24,42"
          fill="url(#lavaCore)"
          stroke="url(#goldEdge)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* 4. d20 Facets & Geometry */}
        {/* Top-Center Triangle */}
        <polygon
          points="60,34 84,78 36,78"
          fill="url(#facetTop)"
          stroke="url(#goldEdge)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Top-Left Facet */}
        <polygon
          points="60,22 60,34 36,78 24,42"
          fill="url(#facetLeft)"
          stroke="url(#goldEdge)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Top-Right Facet */}
        <polygon
          points="60,22 60,34 84,78 96,42"
          fill="url(#facetRight)"
          stroke="url(#goldEdge)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Bottom-Center Facet */}
        <polygon
          points="36,78 84,78 60,102"
          fill="#3D0808"
          stroke="url(#goldEdge)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Bottom-Left Facet */}
        <polygon
          points="24,42 36,78 24,82"
          fill="#4A0C0C"
          stroke="url(#goldEdge)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <polygon
          points="36,78 24,82 60,102"
          fill="#2B0505"
          stroke="url(#goldEdge)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Bottom-Right Facet */}
        <polygon
          points="96,42 84,78 96,82"
          fill="#5C1010"
          stroke="url(#goldEdge)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <polygon
          points="84,78 96,82 60,102"
          fill="#2B0505"
          stroke="url(#goldEdge)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Top Spine Lines */}
        <line x1="60" y1="22" x2="60" y2="34" stroke="url(#goldEdge)" strokeWidth="1.8" />
        <line x1="24" y1="42" x2="36" y2="78" stroke="url(#goldEdge)" strokeWidth="1.5" />
        <line x1="96" y1="42" x2="84" y2="78" stroke="url(#goldEdge)" strokeWidth="1.5" />
        <line x1="60" y1="102" x2="36" y2="78" stroke="url(#goldEdge)" strokeWidth="1.5" />
        <line x1="60" y1="102" x2="84" y2="78" stroke="url(#goldEdge)" strokeWidth="1.5" />

        {/* 5. Center Number "20" with Radiant Ember Glow */}
        <text
          x="60"
          y="65"
          fontFamily="'Cinzel', 'Spectral SC', serif"
          fontWeight="900"
          fontSize="23"
          fill="#FFF9D2"
          textAnchor="middle"
          dominantBaseline="central"
          filter="drop-shadow(0 0 4px #FF4500)"
          letterSpacing="-0.05em"
        >
          20
        </text>

        {/* 6. Sparks & Embers */}
        <circle cx="28" cy="18" r="1.8" fill="#FFF275" opacity="0.9" />
        <circle cx="92" cy="16" r="1.5" fill="#FF9900" opacity="0.85" />
        <circle cx="106" cy="38" r="1.6" fill="#FF5500" opacity="0.9" />
        <circle cx="14" cy="40" r="1.4" fill="#FFD700" opacity="0.8" />
        <circle cx="50" cy="8" r="1.2" fill="#FFF" opacity="0.95" />
      </svg>
    </div>
  );
};

