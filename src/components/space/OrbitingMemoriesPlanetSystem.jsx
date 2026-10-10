import { memo } from 'react'

/**
 * OrbitingMemoriesPlanetSystem — Featured Celestial System for the Orbiting Memories (Gallery) section.
 *
 * Consists of:
 *   1. "Celestia" — Majestic Sapphire & Azure ringed gas giant with chromatic cloud belts,
 *      terminator shading, Cassini division rings, and ambient Rayleigh scattering aura.
 *   2. "Frost-Crater Moon" (Upper-Left) — Cratered lunar companion world at distance.
 *   3. "Amber Solar Dwarf" (Far Right) — Luminous golden-amber dwarf planet at distance.
 *   4. "Amethyst Ringed World" (Lower-Left) — Lavender gas dwarf with tilted micro-rings at distance.
 *   5. "Teal Moonlet" (Lower-Right) — Distant crystalline cyan satellite.
 *   6. Concentric orbital path trajectories tying the celestial family together.
 */
function OrbitingMemoriesPlanetSystem({ reduced = false, className = '' }) {
  return (
    <div
      className={`relative pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* ── Concentric Orbital Trajectory Traces (reinforcing "Orbiting Memories") ── */}
      <svg
        viewBox="0 0 620 520"
        className="absolute -top-14 -left-16 w-[480px] sm:w-[580px] md:w-[680px] lg:w-[740px] pointer-events-none opacity-40"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* Inner Elliptical Orbit Track */}
        <ellipse
          cx="310"
          cy="260"
          rx="210"
          ry="110"
          fill="none"
          stroke="rgba(56, 189, 248, 0.22)"
          strokeWidth="1.2"
          strokeDasharray="4 8"
          transform="rotate(-12 310 260)"
        />
        {/* Outer Elliptical Orbit Track */}
        <ellipse
          cx="310"
          cy="260"
          rx="290"
          ry="155"
          fill="none"
          stroke="rgba(168, 85, 247, 0.16)"
          strokeWidth="1"
          strokeDasharray="3 9"
          transform="rotate(-16 310 260)"
        />
      </svg>

      {/* ══════════════════════════════════════════════════════════════════
          1. MAIN FEATURED PLANET: "Celestia" (Azure/Sapphire Ringed Giant)
         ══════════════════════════════════════════════════════════════════ */}
      <div
        className="relative"
        style={{
          animation: reduced ? 'none' : 'planetFloatSlow 16s ease-in-out infinite',
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 480 360"
          className="w-48 h-36 sm:w-64 sm:h-48 md:w-80 md:h-60 lg:w-[380px] lg:h-[285px]"
          style={{
            filter: 'drop-shadow(0 0 32px rgba(56, 189, 248, 0.32))',
            transform: 'translateZ(0)',
          }}
        >
          <defs>
            <clipPath id="celestiaGlobeClip">
              <circle cx="240" cy="180" r="115" />
            </clipPath>

            {/* Spherical Gas Giant Base Gradient */}
            <radialGradient id="celestiaBase" cx="30%" cy="28%" r="75%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="22%" stopColor="#7DD3FC" />
              <stop offset="48%" stopColor="#0284C7" />
              <stop offset="76%" stopColor="#1E1B4B" />
              <stop offset="92%" stopColor="#0B0E23" />
              <stop offset="100%" stopColor="#040612" />
            </radialGradient>

            {/* Deep Terminator Shadow Gradient */}
            <linearGradient id="celestiaTerminator" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="42%" stopColor="transparent" />
              <stop offset="78%" stopColor="#040716" stopOpacity="0.82" />
              <stop offset="100%" stopColor="#02040C" stopOpacity="0.98" />
            </linearGradient>

            {/* Shadow of planet globe cast onto rear rings */}
            <radialGradient id="celestiaRearRingShadow" cx="50%" cy="50%" r="50%">
              <stop offset="55%" stopColor="#02040C" stopOpacity="0.94" />
              <stop offset="90%" stopColor="#040716" stopOpacity="0.6" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            {/* Chromatic Ring Gradient (Outer to Inner) */}
            <linearGradient id="celestiaRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.88" />
              <stop offset="22%" stopColor="#818CF8" stopOpacity="0.65" />
              <stop offset="48%" stopColor="#C084FC" stopOpacity="0.85" />
              <stop offset="75%" stopColor="#67E8F9" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.5" />
            </linearGradient>

            {/* Translucent Ring Highlights */}
            <linearGradient id="celestiaRingSheen" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="35%" stopColor="#BAE6FD" stopOpacity="0.3" />
              <stop offset="70%" stopColor="transparent" />
            </linearGradient>

            {/* Storm Vortex Gradient */}
            <radialGradient id="celestiaVortex" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#1E1B4B" />
              <stop offset="100%" stopColor="#0B0F2A" />
            </radialGradient>
          </defs>

          {/* ── 1. REAR RINGS (Behind Globe) ── */}
          <g transform="rotate(-15 240 180)">
            {/* Outer Ring A (Rear Half) */}
            <path
              d="M 40 180 A 200 48 0 0 1 440 180"
              fill="none"
              stroke="url(#celestiaRingGrad)"
              strokeWidth="18"
              strokeLinecap="round"
              opacity="0.7"
            />
            {/* Cassini Division Gap */}
            <path
              d="M 62 180 A 178 40 0 0 1 418 180"
              fill="none"
              stroke="#040612"
              strokeWidth="3.5"
              opacity="0.9"
            />
            {/* Inner Ring B (Rear Half) */}
            <path
              d="M 80 180 A 160 34 0 0 1 400 180"
              fill="none"
              stroke="url(#celestiaRingGrad)"
              strokeWidth="24"
              opacity="0.85"
            />
            {/* Innermost Crepe Ring C (Rear Half) */}
            <path
              d="M 115 180 A 125 24 0 0 1 365 180"
              fill="none"
              stroke="#67E8F9"
              strokeWidth="8"
              opacity="0.35"
            />
            {/* Planet Globe Cast Shadow on Rear Rings */}
            <ellipse
              cx="240"
              cy="165"
              rx="118"
              ry="45"
              fill="url(#celestiaRearRingShadow)"
            />
          </g>

          {/* ── 2. PLANET GLOBE BODY ── */}
          <g clipPath="url(#celestiaGlobeClip)">
            {/* Base Gas Sphere */}
            <circle cx="240" cy="180" r="115" fill="url(#celestiaBase)" />

            {/* Cloud Band 1: Northern Polar Belt */}
            <path
              d="M 140 100 Q 240 85 340 102 L 350 118 Q 240 100 130 116 Z"
              fill="#38BDF8"
              opacity="0.3"
            />

            {/* Cloud Band 2: North Temperate Zone */}
            <path
              d="M 126 128 Q 240 112 354 130 L 358 144 Q 240 126 122 142 Z"
              fill="#818CF8"
              opacity="0.38"
            />

            {/* Cloud Band 3: Bright Equatorial Zone (Cyan/White) */}
            <path
              d="M 124 162 Q 240 148 356 164 L 356 182 Q 240 166 124 180 Z"
              fill="#BAE6FD"
              opacity="0.32"
            />

            {/* Cloud Band 4: South Equatorial Belt (Deep Violet) */}
            <path
              d="M 128 196 Q 240 184 352 200 L 348 218 Q 240 200 132 214 Z"
              fill="#4338CA"
              opacity="0.5"
            />

            {/* Cloud Band 5: South Tropical Band */}
            <path
              d="M 138 230 Q 240 216 342 232 L 336 248 Q 240 230 144 246 Z"
              fill="#312E81"
              opacity="0.6"
            />

            {/* Great Oval Storm Vortex */}
            <g transform="translate(290, 215) rotate(-8)">
              <ellipse cx="0" cy="0" rx="22" ry="12" fill="url(#celestiaVortex)" />
              <ellipse cx="-1" cy="0" rx="16" ry="8" fill="#1E1B4B" />
              <ellipse cx="-2" cy="-1" rx="10" ry="4" fill="#67E8F9" opacity="0.75" />
              <circle cx="-1" cy="-1" r="2.5" fill="#FFFFFF" opacity="0.9" />
            </g>

            {/* Day/Night Terminator Shadow */}
            <circle cx="240" cy="180" r="115" fill="url(#celestiaTerminator)" />

            {/* Specular Limb Crescent Highlight (Upper Left) */}
            <path
              d="M 130 140 A 115 115 0 0 1 240 65 A 115 115 0 0 0 142 165 Z"
              fill="#FFFFFF"
              opacity="0.45"
            />
          </g>

          {/* ── 3. ATMOSPHERIC AURA HALO ── */}
          <circle cx="240" cy="180" r="117" fill="none" stroke="rgba(56, 189, 248, 0.65)" strokeWidth="2.5" />
          <circle cx="240" cy="180" r="121" fill="none" stroke="rgba(125, 211, 252, 0.28)" strokeWidth="3" />
          <circle cx="240" cy="180" r="125" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="4.5" />

          {/* ── 4. FRONT RINGS (In Front of Globe) ── */}
          <g transform="rotate(-15 240 180)">
            {/* Innermost Crepe Ring C (Front Half) */}
            <path
              d="M 115 180 A 125 24 0 0 0 365 180"
              fill="none"
              stroke="#67E8F9"
              strokeWidth="8"
              opacity="0.45"
            />
            {/* Inner Ring B (Front Half) */}
            <path
              d="M 80 180 A 160 34 0 0 0 400 180"
              fill="none"
              stroke="url(#celestiaRingGrad)"
              strokeWidth="24"
              opacity="0.92"
            />
            {/* Cassini Division Gap (Front Half) */}
            <path
              d="M 62 180 A 178 40 0 0 0 418 180"
              fill="none"
              stroke="#040612"
              strokeWidth="3.5"
              opacity="0.95"
            />
            {/* Outer Ring A (Front Half) */}
            <path
              d="M 40 180 A 200 48 0 0 0 440 180"
              fill="none"
              stroke="url(#celestiaRingGrad)"
              strokeWidth="18"
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* Ring Surface Sunlight Specular Sheen */}
            <path
              d="M 70 180 A 170 38 0 0 0 240 218"
              fill="none"
              stroke="url(#celestiaRingSheen)"
              strokeWidth="12"
              opacity="0.75"
            />
          </g>
        </svg>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          2. COMPANION SATELLITE WORLDS (Positioned Around at Distance)
         ══════════════════════════════════════════════════════════════════ */}

      {/* ── Moon 1: Frost Crater World (Upper Left, at distance) ── */}
      <div
        className="absolute -top-10 -left-14 sm:-top-16 sm:-left-20 md:-top-20 md:-left-28"
        style={{
          animation: reduced ? 'none' : 'floatOrbit1 14s ease-in-out infinite',
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 80 80"
          className="w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13"
          style={{
            filter: 'drop-shadow(0 0 12px rgba(125, 211, 252, 0.45))',
            transform: 'translateZ(0)',
          }}
        >
          <defs>
            <clipPath id="frostMoonClip">
              <circle cx="40" cy="40" r="36" />
            </clipPath>
            <radialGradient id="frostMoonBase" cx="32%" cy="30%" r="72%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#BAE6FD" />
              <stop offset="65%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#031A38" />
            </radialGradient>
            <linearGradient id="frostMoonShadow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="45%" stopColor="transparent" />
              <stop offset="85%" stopColor="#020B1A" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#01060E" stopOpacity="0.98" />
            </linearGradient>
          </defs>

          {/* Atmospheric Rim */}
          <circle cx="40" cy="40" r="37.5" fill="none" stroke="rgba(186, 230, 253, 0.55)" strokeWidth="1.2" />

          {/* Moon Body */}
          <g clipPath="url(#frostMoonClip)">
            <circle cx="40" cy="40" r="36" fill="url(#frostMoonBase)" />

            {/* Crater 1 (Top Center) */}
            <ellipse cx="32" cy="24" rx="7" ry="6" fill="#031E40" />
            <path d="M 26 23 A 6 5 0 0 0 38 22" fill="none" stroke="#E0F2FE" strokeWidth="1.2" />

            {/* Crater 2 (Lower Right) */}
            <ellipse cx="50" cy="46" rx="9" ry="8" fill="#02142B" />
            <path d="M 42 45 A 8 7 0 0 0 58 44" fill="none" stroke="#7DD3FC" strokeWidth="1.2" />

            {/* Micro Craters */}
            <circle cx="22" cy="42" r="3" fill="#073B6C" />
            <circle cx="44" cy="28" r="2.5" fill="#073B6C" />

            {/* Shadow Overlay */}
            <circle cx="40" cy="40" r="36" fill="url(#frostMoonShadow)" />
          </g>
        </svg>
      </div>

      {/* ── Moon 2: Amber Solar Dwarf (Far Right / Upper Right, at distance) ── */}
      <div
        className="absolute top-10 -right-12 sm:top-8 sm:-right-20 md:top-6 md:-right-24"
        style={{
          animation: reduced ? 'none' : 'floatOrbit2 16s ease-in-out infinite',
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 70 70"
          className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11"
          style={{
            filter: 'drop-shadow(0 0 14px rgba(245, 158, 11, 0.55))',
            transform: 'translateZ(0)',
          }}
        >
          <defs>
            <clipPath id="amberDwarfClip">
              <circle cx="35" cy="35" r="30" />
            </clipPath>
            <radialGradient id="amberDwarfBase" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="35%" stopColor="#FDE68A" />
              <stop offset="68%" stopColor="#F59E0B" />
              <stop offset="90%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#451A03" />
            </radialGradient>
          </defs>

          {/* Amber Outer Halo */}
          <circle cx="35" cy="35" r="31.5" fill="none" stroke="rgba(253, 230, 138, 0.65)" strokeWidth="1.2" />
          <circle cx="35" cy="35" r="34" fill="none" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="2" />

          {/* Planet Body */}
          <g clipPath="url(#amberDwarfClip)">
            <circle cx="35" cy="35" r="30" fill="url(#amberDwarfBase)" />
            {/* Solar Surface Spots */}
            <circle cx="26" cy="24" r="4.5" fill="#78350F" opacity="0.65" />
            <circle cx="42" cy="40" r="5" fill="#451A03" opacity="0.55" />
            <circle cx="38" cy="20" r="2.8" fill="#92400E" opacity="0.6" />
            {/* Sunward Crescent Sheen */}
            <path d="M 8 35 A 30 30 0 0 1 35 8 A 30 30 0 0 0 14 30 Z" fill="#FFFBEB" opacity="0.65" />
          </g>
        </svg>
      </div>

      {/* ── Moon 3: Amethyst Mini-Ringed World (Lower Left, at distance) ── */}
      <div
        className="absolute -bottom-10 -left-6 sm:-bottom-16 sm:-left-12 md:-bottom-20 md:-left-16"
        style={{
          animation: reduced ? 'none' : 'floatOrbit3 18s ease-in-out infinite',
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 110 80"
          className="w-12 h-9 sm:w-16 sm:h-12 md:w-20 md:h-14"
          style={{
            filter: 'drop-shadow(0 0 14px rgba(168, 85, 247, 0.45))',
            transform: 'translateZ(0)',
          }}
        >
          <defs>
            <clipPath id="amethystMiniClip">
              <circle cx="55" cy="40" r="24" />
            </clipPath>
            <radialGradient id="amethystMiniBase" cx="30%" cy="30%" r="72%">
              <stop offset="0%" stopColor="#FAF5FF" />
              <stop offset="30%" stopColor="#E9D5FF" />
              <stop offset="65%" stopColor="#9333EA" />
              <stop offset="90%" stopColor="#4C1D95" />
              <stop offset="100%" stopColor="#1E0A38" />
            </radialGradient>
            <linearGradient id="amethystMiniRings" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#C084FC" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#7E22CE" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Rear Ring Half */}
          <g transform="rotate(-18 55 40)">
            <ellipse cx="55" cy="40" rx="46" ry="10" fill="none" stroke="url(#amethystMiniRings)" strokeWidth="3.5" opacity="0.6" />
          </g>

          {/* Planet Sphere */}
          <g clipPath="url(#amethystMiniClip)">
            <circle cx="55" cy="40" r="24" fill="url(#amethystMiniBase)" />
            {/* Atmospheric cloud swirl */}
            <path d="M 35 34 Q 55 28 75 36" fill="none" stroke="#FAF5FF" strokeWidth="2.5" opacity="0.4" />
            <path d="M 37 46 Q 55 40 73 48" fill="none" stroke="#581C87" strokeWidth="3" opacity="0.65" />
          </g>

          {/* Atmospheric Rim */}
          <circle cx="55" cy="40" r="25" fill="none" stroke="rgba(233, 213, 255, 0.6)" strokeWidth="1" />

          {/* Front Ring Half */}
          <g transform="rotate(-18 55 40)">
            <path
              d="M 12 40 A 46 10 0 0 0 98 40"
              fill="none"
              stroke="url(#amethystMiniRings)"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.9"
            />
          </g>
        </svg>
      </div>

      {/* ── Moon 4: Crystalline Teal Moonlet (Lower Right, at distance) ── */}
      <div
        className="absolute -bottom-8 right-2 sm:-bottom-12 sm:right-4 md:-bottom-16 md:right-8"
        style={{
          animation: reduced ? 'none' : 'floatOrbit4 13s ease-in-out infinite',
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 60 60"
          className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
          style={{
            filter: 'drop-shadow(0 0 10px rgba(45, 212, 191, 0.55))',
            transform: 'translateZ(0)',
          }}
        >
          <defs>
            <radialGradient id="tealMoonletBase" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#F0FDFA" />
              <stop offset="35%" stopColor="#5EEAD4" />
              <stop offset="70%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#042F2E" />
            </radialGradient>
          </defs>
          <circle cx="30" cy="30" r="23" fill="none" stroke="rgba(94, 234, 212, 0.55)" strokeWidth="1.2" />
          <circle cx="30" cy="30" r="22" fill="url(#tealMoonletBase)" />
          {/* Specular Starlight Glint */}
          <circle cx="22" cy="20" r="3.5" fill="#FFFFFF" opacity="0.8" />
        </svg>
      </div>
    </div>
  )
}

export default memo(OrbitingMemoriesPlanetSystem)
