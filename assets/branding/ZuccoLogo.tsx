import React from 'react';

export interface ZuccoLogoProps extends React.SVGProps<SVGSVGElement> {
  variant?: 'primary' | 'white' | 'symbol';
  size?: number | string;
  className?: string;
}

/**
 * Zucco Platform Official Logo Component
 * Fits both light and dark backgrounds.
 */
export const ZuccoLogo: React.FC<ZuccoLogoProps> = ({
  variant = 'primary',
  size = 40,
  className = '',
  ...props
}) => {
  const isWhite = variant === 'white';
  const isSymbolOnly = variant === 'symbol';

  if (isSymbolOnly) {
    return (
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...props}
      >
        <defs>
          <linearGradient id="symTop" x1="18" y1="20" x2="82" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isWhite ? '#10B981' : '#0E543F'} />
            <stop offset="100%" stopColor={isWhite ? '#34D399' : '#146B52'} />
          </linearGradient>
          <linearGradient id="symDiag" x1="82" y1="24" x2="18" y2="76" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isWhite ? '#34D399' : '#146B52'} />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor={isWhite ? '#10B981' : '#059669'} />
          </linearGradient>
          <linearGradient id="symBtm" x1="18" y1="62" x2="82" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor={isWhite ? '#6EE7B7' : '#34D399'} />
          </linearGradient>
        </defs>
        <path d="M 18 20 L 76 20 C 80.4 20 84 23.6 84 28 L 84 38 L 36 38 C 30 38 25 34 23 29 L 18 20 Z" fill="url(#symTop)" />
        <path d="M 84 20 L 84 38 L 44 80 L 26 80 L 74 32 C 78 28 80.8 24 84 20 Z" fill="url(#symDiag)" />
        <path d="M 26 80 L 82 80 C 86.4 80 90 76.4 90 72 L 90 62 L 42 62 C 36 62 31 66 29 71 L 26 80 Z" fill="url(#symBtm)" />
      </svg>
    );
  }

  // Full Horizontal Lockup
  return (
    <svg
      viewBox="0 0 460 120"
      height={size}
      style={{ width: 'auto' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="lockupTop" x1="20" y1="20" x2="100" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isWhite ? '#10B981' : '#0E543F'} />
          <stop offset="100%" stopColor={isWhite ? '#34D399' : '#146B52'} />
        </linearGradient>
        <linearGradient id="lockupDiag" x1="100" y1="26" x2="20" y2="94" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isWhite ? '#34D399' : '#146B52'} />
          <stop offset="60%" stopColor="#10B981" />
          <stop offset="100%" stopColor={isWhite ? '#10B981' : '#059669'} />
        </linearGradient>
        <linearGradient id="lockupBtm" x1="20" y1="78" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor={isWhite ? '#6EE7B7' : '#34D399'} />
        </linearGradient>
      </defs>

      {/* Symbol */}
      <g>
        <path d="M 24 22 L 96 22 C 101.5 22 106 26.5 106 32 L 106 42 L 46 42 C 38 42 32 37 30 31 L 24 22 Z" fill="url(#lockupTop)" />
        <path d="M 106 22 L 106 42 L 56 98 L 34 98 L 94 36 C 99 31 102.5 26 106 22 Z" fill="url(#lockupDiag)" />
        <path d="M 34 98 L 102 98 C 107.5 98 112 93.5 112 88 L 112 78 L 52 78 C 44 78 39 83 37 89 L 34 98 Z" fill="url(#lockupBtm)" />
      </g>

      {/* Wordmark */}
      <text
        x="145"
        y="85"
        fill={isWhite ? '#FFFFFF' : '#1E2B24'}
        fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="700"
        fontSize="68"
        letterSpacing="-2"
      >
        zucco
      </text>
    </svg>
  );
};

export default ZuccoLogo;
