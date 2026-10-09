import CelestialObject from './CelestialObject'

/**
 * ChronosGasGiant — Midground Ringed Gas Giant: "Chronos"
 * (z = -180px / Speed: 0.15x / Active: 45% - 75%)
 *
 * Grand ringed gas giant with chromatic banded clouds, great oval storm vortex,
 * planetary cast shadow across the rear rings, translucent front rings with Cassini Division,
 * atmospheric Rayleigh back-glow, and an orbiting companion moon ("Hyperion").
 */
export default function ChronosGasGiant({ progress, isMobile = false, reduced = false }) {
  return (
    <CelestialObject
      progress={progress}
      range={[0.32, 0.40, 0.50, 0.58]}
      yRange={isMobile ? [160, 20, -30, -180] : [240, 30, -50, -250]}
      xRange={isMobile ? [-15, 0, 8, 15] : [-30, 0, 15, 35]}
      opacityRange={[0, 0.96, 0.96, 0]}
      rotateRange={[-4, -1, 2, 5]}
      scaleRange={[0.92, 1, 1, 0.94]}
      className="absolute top-[34%] sm:top-[35%] left-[12%] sm:left-[16%] md:left-[20%] lg:left-[24%] xl:left-[26%]"
      reduced={reduced}
    >
      <div
        className="relative"
        style={{
          animation: reduced ? 'none' : 'planetFloatSlow 16s ease-in-out infinite',
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 540 380"
          className="w-56 h-40 sm:w-[420px] sm:h-[300px] md:w-[500px] md:h-[350px] lg:w-[560px] lg:h-[390px]"
          style={{
            filter: 'drop-shadow(0 0 28px rgba(56, 189, 248, 0.28))',
            transform: 'translateZ(0)',
          }}
        >
          <defs>
            <clipPath id="chronosGlobeClip">
              <circle cx="270" cy="190" r="145" />
            </clipPath>

            {/* Spherical Gas Base */}
            <radialGradient id="chronosBase" cx="30%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#C7D2FE" />
              <stop offset="25%" stopColor="#818CF8" />
              <stop offset="55%" stopColor="#3730A3" />
              <stop offset="85%" stopColor="#1E1B4B" />
              <stop offset="100%" stopColor="#08071A" />
            </radialGradient>

            {/* Deep Terminator Shadow */}
            <linearGradient id="chronosTerminator" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="42%" stopColor="transparent" />
              <stop offset="80%" stopColor="#050814" stopOpacity="0.82" />
              <stop offset="100%" stopColor="#02040A" stopOpacity="0.98" />
            </linearGradient>

            {/* Rear Ring Shadow Cast (Planet globe blocks sunlight onto rear rings) */}
            <linearGradient id="rearRingShadow" x1="45%" y1="0%" x2="75%" y2="100%">
              <stop offset="0%" stopColor="rgba(2, 6, 23, 0.95)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>

            {/* Multi-Band Atmosphere Gradients */}
            <linearGradient id="bandGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#67E8F9" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.55" />
            </linearGradient>

            <linearGradient id="bandGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#C084FC" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* ── 1. REAR RINGS (Passing Behind Globe) ── */}
          <g transform="rotate(-20 270 190)">
            {/* Outer Ring D (Faint dust fringe) */}
            <ellipse
              cx="270"
              cy="190"
              rx="250"
              ry="46"
              fill="none"
              stroke="rgba(56, 189, 248, 0.22)"
              strokeWidth="10"
            />
            {/* Main Ring A */}
            <ellipse
              cx="270"
              cy="190"
              rx="235"
              ry="42"
              fill="none"
              stroke="rgba(186, 230, 253, 0.55)"
              strokeWidth="18"
            />
            {/* Cassini Division gap */}
            <ellipse
              cx="270"
              cy="190"
              rx="218"
              ry="38"
              fill="none"
              stroke="#020612"
              strokeWidth="4"
            />
            {/* Inner Ring B (Dense brilliant ring) */}
            <ellipse
              cx="270"
              cy="190"
              rx="205"
              ry="35"
              fill="none"
              stroke="rgba(125, 211, 252, 0.75)"
              strokeWidth="22"
            />
            {/* Crepe Ring C (Translucent inner veil) */}
            <ellipse
              cx="270"
              cy="190"
              rx="180"
              ry="30"
              fill="none"
              stroke="rgba(99, 102, 241, 0.35)"
              strokeWidth="14"
            />

            {/* Globe Shadow Wedge on Rear Ring (right side) */}
            <path
              d="M 270 144 Q 340 144 380 185 L 340 215 Q 290 170 270 155 Z"
              fill="url(#rearRingShadow)"
              opacity="0.9"
            />
          </g>

          {/* ── 2. Atmospheric Back-Glow Outer Halo ── */}
          <circle
            cx="270"
            cy="190"
            r="149"
            fill="none"
            stroke="rgba(56, 189, 248, 0.55)"
            strokeWidth="3.5"
          />
          <circle
            cx="270"
            cy="190"
            r="154"
            fill="none"
            stroke="rgba(99, 102, 241, 0.25)"
            strokeWidth="5"
          />

          {/* ── 3. PLANET GLOBE ── */}
          <g clipPath="url(#chronosGlobeClip)">
            {/* Base Gas Giant Sphere */}
            <circle cx="270" cy="190" r="145" fill="url(#chronosBase)" />

            {/* Chromatic Zonal Cloud Bands */}
            <path
              d="M 120 120 Q 270 145 420 120 L 420 145 Q 270 170 120 145 Z"
              fill="url(#bandGrad1)"
            />
            <path
              d="M 120 155 Q 270 180 420 155 L 420 182 Q 270 205 120 182 Z"
              fill="url(#bandGrad2)"
            />
            <path
              d="M 120 195 Q 270 220 420 195 L 420 220 Q 270 245 120 220 Z"
              fill="url(#bandGrad1)"
            />
            <path
              d="M 120 235 Q 270 260 420 235 L 420 265 Q 270 288 120 265 Z"
              fill="url(#bandGrad2)"
            />

            {/* Great Oval Storm: "The Azure Eye" */}
            <g transform="translate(230, 215)">
              <ellipse cx="0" cy="0" rx="34" ry="18" fill="#1E1B4B" />
              <ellipse cx="-2" cy="-1" rx="29" ry="14" fill="#0284C7" />
              <ellipse cx="-4" cy="-2" rx="20" ry="9" fill="#38BDF8" opacity="0.85" />
              <circle cx="-5" cy="-2" r="3" fill="#FFFFFF" />
            </g>

            {/* Hexagonal Polar Storm (North Pole) */}
            <polygon
              points="270,52 284,60 284,76 270,84 256,76 256,60"
              fill="#38BDF8"
              opacity="0.4"
            />
            <circle cx="270" cy="68" r="4" fill="#BAE6FD" opacity="0.75" />

            {/* Deep Terminator Night Shadow */}
            <circle cx="270" cy="190" r="145" fill="url(#chronosTerminator)" />

            {/* Specular Limb Crescent Reflection */}
            <path
              d="M 126 190 A 145 145 0 0 1 270 45 A 145 145 0 0 0 145 150 Z"
              fill="#FFFFFF"
              opacity="0.38"
            />
          </g>

          {/* ── 4. FRONT RINGS (Passing in Front of Globe) ── */}
          <g transform="rotate(-20 270 190)">
            {/* Front of Main Ring A */}
            <path
              d="M 35 190 A 235 42 0 0 0 505 190"
              fill="none"
              stroke="rgba(186, 230, 253, 0.72)"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Cassini Division gap */}
            <path
              d="M 52 190 A 218 38 0 0 0 488 190"
              fill="none"
              stroke="rgba(5, 11, 24, 0.9)"
              strokeWidth="4"
            />
            {/* Front of Inner Ring B */}
            <path
              d="M 65 190 A 205 35 0 0 0 475 190"
              fill="none"
              stroke="rgba(125, 211, 252, 0.9)"
              strokeWidth="22"
              strokeLinecap="round"
            />
            {/* Crepe Ring translucent inner edge */}
            <path
              d="M 90 190 A 180 30 0 0 0 450 190"
              fill="none"
              stroke="rgba(167, 139, 250, 0.55)"
              strokeWidth="14"
            />
            {/* Starlight refraction highlights along ring crest */}
            <path
              d="M 120 198 A 205 35 0 0 0 420 198"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              opacity="0.8"
            />
          </g>

          {/* ── 5. Escort Moon: "Hyperion" (Synchronous Orbit) ── */}
          <g
            transform="translate(485, 130)"
            style={{
              animation: reduced ? 'none' : 'moonOrbit 12s ease-in-out infinite',
              willChange: 'transform',
            }}
          >
            <circle
              cx="14"
              cy="14"
              r="13"
              fill="#A5B4FC"
              stroke="rgba(199, 210, 254, 0.5)"
              strokeWidth="1"
            />
            <ellipse cx="14" cy="14" rx="13" ry="13" fill="#1E1B4B" opacity="0.6" />
            <circle cx="10" cy="10" r="2.5" fill="#312E81" />
            <circle cx="16" cy="15" r="3" fill="#312E81" />
            <path
              d="M 2 14 A 12 12 0 0 1 14 2 A 12 12 0 0 0 5 11 Z"
              fill="#FFFFFF"
              opacity="0.55"
            />
          </g>
        </svg>
      </div>
    </CelestialObject>
  )
}
