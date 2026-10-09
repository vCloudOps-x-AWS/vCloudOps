import CelestialObject from './CelestialObject'

/**
 * BinaryStars — Outer Frontier Stellar Pair (z = -150px / Speed: 0.08x / Active: 75% - 100%)
 *
 * Luminous binary star system in mutual gravitational orbit, shimmering with diffraction
 * spikes and radiant stellar halos as the user arrives at the final section and footer.
 */
export default function BinaryStars({ progress, reduced = false }) {
  return (
    <CelestialObject
      progress={progress}
      range={[0.82, 0.88, 0.98, 1.0]}
      yRange={[140, 20, -30, -50]}
      xRange={[30, 0, -10, -20]}
      opacityRange={[0, 0.9, 0.9, 0.85]}
      scaleRange={[0.9, 1, 1, 1]}
      className="absolute top-[80%] right-[5%] sm:right-[10%] md:right-[14%]"
      reduced={reduced}
    >
      <div
        className="relative"
        style={{
          animation: reduced ? 'none' : 'twinkleGlow 6s ease-in-out infinite',
          willChange: 'transform, opacity',
        }}
      >
        <svg
          viewBox="0 0 160 120"
          className="w-24 h-18 sm:w-32 sm:h-24 md:w-36 md:h-28"
          style={{
            filter: 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.45))',
            transform: 'translateZ(0)',
          }}
        >
          <defs>
            {/* Primary Star Cyan Glow */}
            <radialGradient id="star1Grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#BAE6FD" />
              <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            {/* Companion Amber Star Glow */}
            <radialGradient id="star2Grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="35%" stopColor="#FDE68A" />
              <stop offset="75%" stopColor="#F59E0B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* ── Primary Cyan Star ── */}
          <g transform="translate(60, 50)">
            {/* Soft Ambient Halo */}
            <circle cx="0" cy="0" r="32" fill="url(#star1Grad)" opacity="0.6" />

            {/* Diffraction Spikes */}
            <line x1="-36" y1="0" x2="36" y2="0" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.85" />
            <line x1="0" y1="-36" x2="0" y2="36" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.85" />
            <line x1="-16" y1="-16" x2="16" y2="16" stroke="#BAE6FD" strokeWidth="0.8" opacity="0.6" />
            <line x1="-16" y1="16" x2="16" y2="-16" stroke="#BAE6FD" strokeWidth="0.8" opacity="0.6" />

            {/* Dense Stellar Core */}
            <circle cx="0" cy="0" r="10" fill="#E0F2FE" />
            <circle cx="0" cy="0" r="5" fill="#FFFFFF" />
          </g>

          {/* ── Secondary Amber Companion ── */}
          <g transform="translate(105, 75)">
            {/* Soft Ambient Halo */}
            <circle cx="0" cy="0" r="22" fill="url(#star2Grad)" opacity="0.65" />

            {/* Diffraction Spikes */}
            <line x1="-22" y1="0" x2="22" y2="0" stroke="#FEF3C7" strokeWidth="1" opacity="0.8" />
            <line x1="0" y1="-22" x2="0" y2="22" stroke="#FEF3C7" strokeWidth="1" opacity="0.8" />

            {/* Dense Stellar Core */}
            <circle cx="0" cy="0" r="6" fill="#FDE68A" />
            <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
          </g>

          {/* Mutual Gravitational Barycenter Filament */}
          <line
            x1="60"
            y1="50"
            x2="105"
            y2="75"
            stroke="rgba(186, 230, 253, 0.25)"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
        </svg>
      </div>
    </CelestialObject>
  )
}
