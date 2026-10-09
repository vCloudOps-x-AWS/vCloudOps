import CelestialObject from './CelestialObject'

/**
 * ClosePassPlanet — Near Foreground Monumental Amethyst World (z = +50px / Speed: 0.45x / Active: 45% - 74%)
 *
 * Cinematic deep-space Amethyst & Neon Violet exoplanet skimming the viewport edge. Features
 * rich volumetric spherical shading in cosmic purple and lavender, flowing atmospheric cloud wisps,
 * signature vCloudOps stepped retro bands, realistically shadowed impact crater basins, and a
 * delicate specular starlight crescent horizon.
 */
export default function ClosePassPlanet({ progress, isMobile = false, reduced = false }) {
  return (
    <CelestialObject
      progress={progress}
      range={[0.60, 0.68, 0.78, 0.86]}
      yRange={isMobile ? [220, 30, -40, -220] : [340, 40, -60, -320]}
      xRange={isMobile ? [15, 0, -8, -15] : [30, 0, -15, -35]}
      opacityRange={[0, 0.95, 0.95, 0]}
      scaleRange={[0.95, 1, 1, 0.95]}
      className="absolute top-[58%] -right-10 sm:-right-16 md:-right-24 lg:-right-28"
      reduced={reduced}
    >
      <div
        className="relative pointer-events-none select-none"
        style={{
          animation: reduced ? 'none' : 'planetFloatSlow 18s ease-in-out infinite',
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 460 460"
          className="w-52 h-52 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px] lg:w-[480px] lg:h-[480px]"
          style={{
            filter: 'drop-shadow(0 0 28px rgba(168, 85, 247, 0.35))',
            transform: 'translateZ(0)',
          }}
        >
          <defs>
            <clipPath id="closePassClip">
              <circle cx="230" cy="230" r="220" />
            </clipPath>

            {/* Rich Volumetric Spherical Amethyst Base Gradient */}
            <radialGradient id="amethystPlanetBase" cx="32%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#FAF5FF" />
              <stop offset="20%" stopColor="#E9D5FF" />
              <stop offset="42%" stopColor="#C084FC" />
              <stop offset="68%" stopColor="#9333EA" />
              <stop offset="85%" stopColor="#6B21A8" />
              <stop offset="95%" stopColor="#3B0764" />
              <stop offset="100%" stopColor="#160424" />
            </radialGradient>

            {/* Crater Depth Gradient */}
            <radialGradient id="amethystCraterDark" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#6B21A8" />
              <stop offset="65%" stopColor="#3B0764" />
              <stop offset="100%" stopColor="#160424" />
            </radialGradient>

            {/* Smooth Day/Night Terminator Shadow Gradient */}
            <linearGradient id="amethystShadow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="38%" stopColor="transparent" />
              <stop offset="72%" stopColor="#1A052E" stopOpacity="0.80" />
              <stop offset="95%" stopColor="#0F021B" stopOpacity="0.96" />
              <stop offset="100%" stopColor="#06010C" stopOpacity="0.99" />
            </linearGradient>
          </defs>

          {/* Ambient Atmospheric Outer Halo in Radiant Lavender / Violet */}
          <circle
            cx="230"
            cy="230"
            r="224"
            fill="none"
            stroke="rgba(233, 213, 255, 0.45)"
            strokeWidth="2.5"
          />
          <circle
            cx="230"
            cy="230"
            r="228"
            fill="none"
            stroke="rgba(168, 85, 247, 0.22)"
            strokeWidth="4"
          />

          {/* Planet Sphere */}
          <g clipPath="url(#closePassClip)">
            {/* Base Celestial Surface */}
            <circle cx="230" cy="230" r="220" fill="url(#amethystPlanetBase)" />

            {/* ── Signature Stepped Retro Bands (Amethyst / Imperial Violet) ── */}
            <path
              d="M 0 140 Q 210 95 460 150 L 460 185 Q 230 130 0 175 Z"
              fill="#A855F7"
              opacity="0.25"
            />
            <path
              d="M 0 210 Q 240 160 460 230 L 460 270 Q 220 195 0 250 Z"
              fill="#7E22CE"
              opacity="0.30"
            />
            <path
              d="M 0 290 Q 250 240 460 310 L 460 365 Q 230 285 0 340 Z"
              fill="#4C1D95"
              opacity="0.42"
            />

            {/* ── Flowing Atmospheric Cloud Wisps ── */}
            <path
              d="M 30 170 Q 140 140 250 165 Q 330 185 410 160"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.30"
            />
            <path
              d="M 80 270 Q 180 245 280 275 Q 350 290 420 265"
              fill="none"
              stroke="#F3E8FF"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.25"
            />
            <path
              d="M 120 110 Q 220 85 320 110"
              fill="none"
              stroke="#E9D5FF"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.35"
            />

            {/* ── Authentic Volumetric Crater Formations ── */}
            {/* Crater 1 (Major basin on upper sunlit flank) */}
            <g transform="translate(150, 130)">
              <ellipse cx="0" cy="0" rx="36" ry="30" fill="#160424" />
              <ellipse cx="-2" cy="-2" rx="32" ry="26" fill="url(#amethystCraterDark)" />
              <ellipse cx="-5" cy="-5" rx="25" ry="20" fill="#9333EA" opacity="0.38" />
              {/* Sunlit illuminated rim highlight */}
              <path
                d="M -28 10 A 34 28 0 0 0 32 0"
                fill="none"
                stroke="#E9D5FF"
                strokeWidth="3"
                opacity="0.85"
              />
              <circle cx="-3" cy="-3" r="5" fill="#3B0764" />
            </g>

            {/* Crater 2 (Mid-right basin) */}
            <g transform="translate(290, 185)">
              <ellipse cx="0" cy="0" rx="42" ry="34" fill="#0F0318" />
              <ellipse cx="-3" cy="-3" rx="37" ry="29" fill="url(#amethystCraterDark)" />
              <ellipse cx="-7" cy="-5" rx="28" ry="22" fill="#7E22CE" opacity="0.35" />
              <path
                d="M -34 10 A 40 32 0 0 0 38 0"
                fill="none"
                stroke="#C084FC"
                strokeWidth="3"
                opacity="0.75"
              />
              <circle cx="-4" cy="-4" r="5" fill="#2E0854" />
            </g>

            {/* Crater 3 (Lower basin) */}
            <g transform="translate(120, 260)">
              <ellipse cx="0" cy="0" rx="26" ry="21" fill="#0F0318" />
              <ellipse cx="-2" cy="-2" rx="23" ry="18" fill="url(#amethystCraterDark)" />
              <path
                d="M -22 7 A 24 19 0 0 0 23 0"
                fill="none"
                stroke="#E9D5FF"
                strokeWidth="2.2"
                opacity="0.8"
              />
            </g>

            {/* Micro-crater cluster */}
            {!isMobile && (
              <>
                <ellipse cx="80" cy="105" rx="14" ry="11" fill="#4C1D95" />
                <ellipse cx="220" cy="80" rx="16" ry="13" fill="#4C1D95" />
                <ellipse cx="195" cy="210" rx="13" ry="10" fill="#3B0764" />
                <ellipse cx="330" cy="115" rx="16" ry="13" fill="#4C1D95" />
              </>
            )}

            {/* Smooth Spherical Terminator Shadow Overlay */}
            <circle cx="230" cy="230" r="220" fill="url(#amethystShadow)" />

            {/* Specular Starlight Rim Crescent */}
            <path
              d="M 12 230 A 220 220 0 0 1 230 12 A 220 220 0 0 0 40 185 Z"
              fill="#FFFFFF"
              opacity="0.38"
            />
          </g>
        </svg>
      </div>
    </CelestialObject>
  )
}
