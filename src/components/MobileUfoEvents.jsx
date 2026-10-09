import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  CaretLeft,
  CaretRight,
  ArrowSquareOut,
  MapPin,
  Sparkle,
  X,
} from '@phosphor-icons/react'
import './MobileUfoEvents.css'

// Theme palettes calibrated for each active event
const EVENT_THEMES = [
  {
    id: 'commit-to-git',
    name: 'cyan',
    accent: '#00F2FE',
    secondary: '#4FACFE',
    textGlow: 'rgba(0, 242, 254, 0.85)',
    beamColor: '0, 242, 254',
    badgeText: '#67E8F9',
    glowFilter: 'drop-shadow(0 0 16px rgba(0, 242, 254, 0.55))',
    ufoLight: '#38BDF8',
  },
  {
    id: 'weekly-aws-workshops',
    name: 'amber',
    accent: '#FFB800',
    secondary: '#FF7700',
    textGlow: 'rgba(255, 184, 0, 0.85)',
    beamColor: '255, 165, 0',
    badgeText: '#FDE047',
    glowFilter: 'drop-shadow(0 0 16px rgba(255, 184, 0, 0.55))',
    ufoLight: '#FBBF24',
  },
  {
    id: 'stay-tuned-upcoming-events',
    name: 'violet',
    accent: '#C084FC',
    secondary: '#E879F9',
    textGlow: 'rgba(192, 132, 252, 0.85)',
    beamColor: '192, 132, 252',
    badgeText: '#E879F9',
    glowFilter: 'drop-shadow(0 0 16px rgba(192, 132, 252, 0.55))',
    ufoLight: '#C084FC',
  },
]

export default function MobileUfoEvents({
  items = [],
  activeIndex: controlledIndex,
  onSelect,
}) {
  const [currentIndex, setCurrentIndex] = useState(controlledIndex ?? 0)
  const [touchStartX, setTouchStartX] = useState(null)
  const [touchDeltaX, setTouchDeltaX] = useState(0)
  const [tiltAngle, setTiltAngle] = useState(0)
  const [isFlyingIn, setIsFlyingIn] = useState(true)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const containerRef = useRef(null)

  const total = items.length
  const currentItem = items[currentIndex] || items[0]
  const theme = EVENT_THEMES[currentIndex % EVENT_THEMES.length] || EVENT_THEMES[0]

  // Sync with controlled activeIndex from parent (GSAP ScrollTrigger or external selection)
  useEffect(() => {
    if (
      controlledIndex !== undefined &&
      controlledIndex !== currentIndex &&
      controlledIndex >= 0 &&
      controlledIndex < total
    ) {
      const direction = controlledIndex > currentIndex ? 1 : -1
      setTiltAngle(direction * 7)
      setCurrentIndex(controlledIndex)
      const timer = setTimeout(() => setTiltAngle(0), 400)
      return () => clearTimeout(timer)
    }
  }, [controlledIndex, currentIndex, total])

  // UFO Fly-in sequence trigger when mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlyingIn(false)
    }, 900)
    return () => clearTimeout(timer)
  }, [])

  // Close modal on Escape and prevent background scroll while modal is active
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDetailsOpen(false)
      }
    }
    if (isDetailsOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isDetailsOpen])

  // Navigation handlers
  const goToIndex = useCallback(
    (index) => {
      if (index === currentIndex || index < 0 || index >= total) return
      const direction = index > currentIndex ? 1 : -1
      // Tilt UFO dynamically during transition
      setTiltAngle(direction * 7)
      setCurrentIndex(index)
      setTimeout(() => setTiltAngle(0), 400)
      if (onSelect) {
        onSelect(index)
      }
    },
    [currentIndex, total, onSelect]
  )

  const handlePrev = useCallback(() => {
    goToIndex(Math.max(0, currentIndex - 1))
  }, [currentIndex, goToIndex])

  const handleNext = useCallback(() => {
    goToIndex(Math.min(total - 1, currentIndex + 1))
  }, [currentIndex, total, goToIndex])

  // Keyboard navigation support for desktop/laptop
  useEffect(() => {
    const handleKeyNav = (e) => {
      if (isDetailsOpen) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goToIndex(Math.min(total - 1, currentIndex + 1))
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goToIndex(Math.max(0, currentIndex - 1))
      }
    }
    window.addEventListener('keydown', handleKeyNav)
    return () => window.removeEventListener('keydown', handleKeyNav)
  }, [currentIndex, goToIndex, isDetailsOpen, total])

  // Touch Swipe Handlers for tactile mobile gestures
  const onTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX)
    setTouchDeltaX(0)
  }

  const onTouchMove = (e) => {
    if (touchStartX === null) return
    const currentX = e.touches[0].clientX
    const delta = currentX - touchStartX
    setTouchDeltaX(delta)
    // Dynamic tilt feedback while dragging
    const clampedTilt = Math.max(-10, Math.min(10, -delta * 0.12))
    setTiltAngle(clampedTilt)
  }

  const onTouchEnd = () => {
    if (touchStartX === null) return
    if (touchDeltaX < -40 && currentIndex < total - 1) {
      handleNext()
    } else if (touchDeltaX > 40 && currentIndex > 0) {
      handlePrev()
    } else {
      setTiltAngle(0)
    }
    setTouchStartX(null)
    setTouchDeltaX(0)
  }

  if (!items || items.length === 0) return null

  const itemNumber = String(currentIndex + 1).padStart(2, '0')

  return (
    <div
      ref={containerRef}
      className={`mobile-ufo-events-container ${isFlyingIn ? 'is-flying-in' : ''}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-label="Mobile UFO Events Experience"
    >
      {/* ── 1. UFO SPACECRAFT AT TOP ── */}
      <div
        className="ufo-craft-anchor"
        style={{
          transform: `translateX(${touchDeltaX * 0.15}px) rotate(${tiltAngle}deg)`,
          transition: touchStartX ? 'none' : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <svg
          viewBox="0 5 200 50"
          className="ufo-svg"
          style={{ filter: theme.glowFilter }}
        >
          <defs>
            {/* Metallic Saucer Gradient */}
            <linearGradient id="ufoMetalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="35%" stopColor="#1E293B" />
              <stop offset="70%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#090D16" />
            </linearGradient>

            {/* Specular Rim Light */}
            <linearGradient id="ufoRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="25%" stopColor="rgba(255,255,255,0.5)" />
              <stop offset="50%" stopColor={theme.accent} />
              <stop offset="75%" stopColor="rgba(255,255,255,0.5)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
            </linearGradient>

            {/* Translucent Glass Dome */}
            <radialGradient id="ufoDomeGrad" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.85" />
              <stop offset="35%" stopColor={theme.accent} stopOpacity="0.5" />
              <stop offset="85%" stopColor="#0B132B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#020617" stopOpacity="1" />
            </radialGradient>

            {/* Plasma Emitter Lens */}
            <radialGradient id="ufoEmitterLens" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="40%" stopColor={theme.accent} stopOpacity="0.95" />
              <stop offset="80%" stopColor={theme.secondary} stopOpacity="0.5" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ── 1. Glass Cockpit Dome ── */}
          <ellipse cx="100" cy="24" rx="34" ry="17" fill="url(#ufoDomeGrad)" />
          {/* Cockpit specular reflection highlight */}
          <path
            d="M 80 15 Q 100 11 120 15"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* ── 2. Upper Hull Disc ── */}
          <ellipse cx="100" cy="38" rx="88" ry="16" fill="url(#ufoMetalGrad)" />
          {/* Specular Edge Highlight Trim */}
          <ellipse
            cx="100"
            cy="38"
            rx="87"
            ry="15.5"
            fill="none"
            stroke="url(#ufoRimGrad)"
            strokeWidth="1.2"
          />

          {/* ── 3. Lower Underbelly Hull ── */}
          <ellipse cx="100" cy="43" rx="66" ry="11" fill="#0B1120" />
          <ellipse
            cx="100"
            cy="44"
            rx="48"
            ry="7.5"
            fill="#030712"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.8"
          />

          {/* ── 4. Glowing Perimeter Nav Beacons ── */}
          <circle cx="28" cy="37" r="2.2" fill={theme.ufoLight} className="ufo-beacon beacon-1" />
          <circle cx="48" cy="42" r="2.4" fill={theme.ufoLight} className="ufo-beacon beacon-2" />
          <circle cx="72" cy="45" r="2.6" fill={theme.ufoLight} className="ufo-beacon beacon-3" />
          <circle cx="100" cy="46" r="2.8" fill="#FFFFFF" className="ufo-beacon beacon-center" />
          <circle cx="128" cy="45" r="2.6" fill={theme.ufoLight} className="ufo-beacon beacon-3" />
          <circle cx="152" cy="42" r="2.4" fill={theme.ufoLight} className="ufo-beacon beacon-2" />
          <circle cx="172" cy="37" r="2.2" fill={theme.ufoLight} className="ufo-beacon beacon-1" />

          {/* ── 5. Plasma Core Emitter Lens ── */}
          <ellipse cx="100" cy="47" rx="22" ry="5.5" fill="url(#ufoEmitterLens)" />
          <circle cx="100" cy="47" r="4" fill="#FFFFFF" opacity="0.9" />
        </svg>

        {/* Thruster Halo Bloom */}
        <div
          className="ufo-thruster-bloom"
          style={{
            background: `radial-gradient(circle, rgba(${theme.beamColor}, 0.8) 0%, rgba(${theme.beamColor}, 0) 70%)`,
          }}
        />
      </div>

      {/* ── 2. THE TRIANGULAR BEAM OF LIGHT WITH SUSPENDED FLOATING INFO ── */}
      <div key={`beam-stage-${currentIndex}`} className="ufo-beam-stage beam-reveal-action">
        {/* Vector SVG Triangular Beam Cone & Floor Ellipse */}
        <svg
          viewBox="0 0 380 470"
          className="triangular-beam-svg"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Volumetric Vertical Gradient for the Triangular Shaft */}
            <linearGradient id={`beamShaftGrad-${currentIndex}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={`rgb(${theme.beamColor})`} stopOpacity="0.48" />
              <stop offset="22%" stopColor={`rgb(${theme.beamColor})`} stopOpacity="0.24" />
              <stop offset="60%" stopColor={`rgb(${theme.beamColor})`} stopOpacity="0.10" />
              <stop offset="92%" stopColor={`rgb(${theme.beamColor})`} stopOpacity="0.03" />
              <stop offset="100%" stopColor={`rgb(${theme.beamColor})`} stopOpacity="0.0" />
            </linearGradient>

            {/* Luminous Edge Ray Gradient for the Angled Beam Borders */}
            <linearGradient id={`beamRayGrad-${currentIndex}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={`rgb(${theme.beamColor})`} stopOpacity="0.9" />
              <stop offset="35%" stopColor={`rgb(${theme.beamColor})`} stopOpacity="0.5" />
              <stop offset="85%" stopColor={`rgb(${theme.beamColor})`} stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>

            {/* Floor Impact Pool Radial Glow */}
            <radialGradient id={`beamFloorGrad-${currentIndex}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={`rgb(${theme.beamColor})`} stopOpacity="0.4" />
              <stop offset="60%" stopColor={`rgb(${theme.beamColor})`} stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* The Conical Triangular Shaft of Light (Anchored precisely to UFO emitter nozzle) */}
          <polygon
            points="125,0 255,0 376,448 4,448"
            fill={`url(#beamShaftGrad-${currentIndex})`}
            stroke={`url(#beamRayGrad-${currentIndex})`}
            strokeWidth="1.5"
            className="beam-polygon"
          />

          {/* Floor Illumination Impact Ring */}
          <ellipse
            cx="190"
            cy="448"
            rx="182"
            ry="18"
            fill={`url(#beamFloorGrad-${currentIndex})`}
            stroke={`rgba(${theme.beamColor}, 0.5)`}
            strokeWidth="1.2"
          />
        </svg>

        {/* Ambient Horizontal Shimmer Scanlines inside the beam */}
        <div
          className="beam-shimmer-lines"
          style={{
            background: `repeating-linear-gradient(
              180deg,
              transparent,
              transparent 7px,
              rgba(${theme.beamColor}, 0.04) 7px,
              rgba(${theme.beamColor}, 0.04) 9px
            )`,
          }}
        />

        {/* Laser Sweeper Beam Leading Edge (Travels top to bottom as beam reveals info) */}
        <div
          className="beam-laser-sweeper"
          style={{
            background: `linear-gradient(90deg, transparent 5%, rgba(${theme.beamColor}, 0.95) 50%, transparent 95%)`,
            boxShadow: `0 0 16px rgba(${theme.beamColor}, 1)`,
          }}
        />

        {/* ── PURE FLOATING INFO (NO CARDS, SUSPENDED IN THE LIGHT BEAM) ── */}
        <div className="beam-floating-content">
          {/* Mode Name (Pure glowing typography — no pill capsule) */}
          {(currentItem.mode || currentItem.category) && (
            <div className="beam-mode-text-row">
              <span
                className="font-mono text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em]"
                style={{
                  color: theme.accent,
                  textShadow: `0 0 14px ${theme.textGlow}, 0 0 28px rgba(${theme.beamColor}, 0.6)`,
                }}
              >
                {currentItem.mode || currentItem.category}
              </span>
            </div>
          )}

          {/* Level 2 (Upper Cone): Big Luminous Holographic Date */}
          <div className="beam-date-row">
            <div className="flex items-baseline justify-center gap-1.5">
              <span
                className="font-mono font-black text-3xl sm:text-4xl tracking-tighter leading-none text-white"
                style={{
                  textShadow: `0 0 25px ${theme.textGlow}, 0 0 50px rgba(${theme.beamColor}, 0.6)`,
                }}
              >
                {currentItem.dateDay || '12'}
              </span>
              <span
                className="font-mono font-extrabold text-[11px] sm:text-xs tracking-wider uppercase"
                style={{
                  color: theme.accent,
                  textShadow: `0 0 12px ${theme.textGlow}`,
                }}
              >
                {currentItem.dateMonth || 'OCT'} {currentItem.dateYear || '2026'}
              </span>
            </div>

            {/* Venue Tag (Only rendered when venue / mapsUrl exists, e.g. Event 1) */}
            {(currentItem.venue || currentItem.mapsUrl) && (
              <div className="mt-1">
                {currentItem.mapsUrl ? (
                  <a
                    href={currentItem.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] font-bold transition-opacity hover:opacity-80"
                    style={{
                      color: theme.accent,
                      textShadow: `0 0 10px ${theme.textGlow}`,
                    }}
                    title="Open Venue in Google Maps"
                  >
                    <MapPin className="w-3 h-3" />
                    <span className="underline underline-offset-2">
                      {currentItem.locationCode || currentItem.venue || 'CAMPUS'}
                    </span>
                    <ArrowSquareOut className="w-2.5 h-2.5" />
                  </a>
                ) : (
                  <span
                    className="font-mono text-[11px] font-semibold text-slate-300"
                    style={{ textShadow: `0 0 8px ${theme.textGlow}` }}
                  >
                    {currentItem.locationCode || currentItem.venue}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Level 3 (Mid Cone): Glowing Event Title */}
          <h3
            className="beam-title"
            style={{
              textShadow: `0 0 20px ${theme.textGlow}, 0 0 40px rgba(${theme.beamColor}, 0.5)`,
            }}
          >
            {currentItem.title}
          </h3>

          {/* Level 4 (Lower Cone): Lead Holographic Statement */}
          {currentItem.lead && (
            <p
              className="beam-lead"
              style={{
                color: theme.badgeText,
                textShadow: `0 0 14px rgba(${theme.beamColor}, 0.6)`,
              }}
            >
              {currentItem.lead}
            </p>
          )}

          {/* ── Level 5: CIRCULAR SHADOW PART OF LIGHT BEAM WITH MORE INFO BUTTON ── */}
          <div className="beam-floor-shadow-dock">
            {/* The Glowing Circular / Elliptical Ground Shadow Pool */}
            <div
              className="beam-floor-shadow-disc"
              style={{
                background: `radial-gradient(ellipse 65% 50% at center, rgba(${theme.beamColor}, 0.5) 0%, rgba(${theme.beamColor}, 0.15) 50%, rgba(0, 0, 0, 0.8) 75%, transparent 100%)`,
              }}
            />

            <button
              type="button"
              onClick={() => setIsDetailsOpen(true)}
              className="beam-more-info-btn"
              style={{
                borderColor: theme.accent,
                boxShadow: `0 0 22px rgba(${theme.beamColor}, 0.45), inset 0 0 12px rgba(${theme.beamColor}, 0.25)`,
                background: `radial-gradient(ellipse at center, rgba(${theme.beamColor}, 0.28) 0%, rgba(10, 15, 29, 0.92) 80%)`,
                color: '#FFFFFF',
                textShadow: `0 0 10px ${theme.textGlow}`,
              }}
              aria-label={`Open details for ${currentItem.title}`}
            >
              <Sparkle weight="fill" className="w-3.5 h-3.5" style={{ color: theme.accent }} />
              <span>More Info</span>
              <ArrowSquareOut weight="bold" className="w-3.5 h-3.5" style={{ color: theme.accent }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. TOUCH NAVIGATION CONTROLS (Pill Tabs & Arrows) ── */}
      <div className="floating-nav-bar">
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`nav-arrow-btn ${currentIndex === 0 ? 'is-disabled' : ''}`}
          aria-label="Previous Event"
        >
          <CaretLeft weight="bold" className="w-4 h-4" />
        </button>

        {/* Pagination Pill Dots */}
        <div className="nav-pills-track">
          {items.map((item, idx) => {
            const isActive = idx === currentIndex
            return (
              <button
                key={item.id || idx}
                onClick={() => goToIndex(idx)}
                className={`nav-pill ${isActive ? 'is-active' : ''}`}
                style={
                  isActive
                    ? {
                        backgroundColor: theme.accent,
                        boxShadow: `0 0 14px ${theme.accent}`,
                        borderColor: '#FFFFFF',
                      }
                    : undefined
                }
                aria-label={`Go to event ${idx + 1}`}
              >
                <span className="font-mono text-[10px] font-bold">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </button>
            )
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          disabled={currentIndex === total - 1}
          className={`nav-arrow-btn ${currentIndex === total - 1 ? 'is-disabled' : ''}`}
          aria-label="Next Event"
        >
          <CaretRight weight="bold" className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Micro-Label */}
      <div className="swipe-hint-label">
        <span className="block md:hidden">← Swipe to explore events →</span>
        <span className="hidden md:block">← Click arrows, scroll, or use keys to explore events →</span>
      </div>

      {/* ── 4. DETAILS CARD MODAL (GLOW-IN-THE-DARK GLASS CHAMBER VIA PORTAL) ── */}
      {isDetailsOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="beam-details-modal-backdrop"
          onClick={() => setIsDetailsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Details for ${currentItem.title}`}
        >
          <div
            className="beam-details-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              borderColor: `rgba(${theme.beamColor}, 0.55)`,
              background: `radial-gradient(ellipse at 50% -10%, rgba(${theme.beamColor}, 0.28) 0%, rgba(9, 15, 30, 0.85) 50%, rgba(3, 7, 18, 0.94) 100%)`,
              boxShadow: `0 0 60px -8px rgba(${theme.beamColor}, 0.45), inset 0 0 35px -8px rgba(${theme.beamColor}, 0.2), 0 30px 60px rgba(0, 0, 0, 0.95)`,
            }}
          >
            {/* Ambient Top Glow Bar */}
            <div
              className="modal-top-glow-bar"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${theme.accent} 50%, transparent 100%)`,
                boxShadow: `0 0 16px ${theme.accent}`,
              }}
            />

            {/* Header: Mode Name & Close Button */}
            <div className="modal-header-row">
              <span
                className="font-mono text-[11px] font-black uppercase tracking-[0.22em]"
                style={{
                  color: theme.accent,
                  textShadow: `0 0 14px ${theme.textGlow}`,
                }}
              >
                {currentItem.mode || currentItem.category}
              </span>

              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                className="modal-close-btn"
                style={{
                  borderColor: `rgba(${theme.beamColor}, 0.4)`,
                  color: theme.accent,
                }}
                aria-label="Close details"
              >
                <X weight="bold" className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Using the Exact Typography & Aesthetic from the Beam (No Dark Boxy Banner) */}
            <div className="modal-body-content">
              {/* Date & Location Telemetry Bar (Matching the Beam Date Row) */}
              <div className="modal-telemetry-row">
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-mono font-black text-3xl sm:text-4xl tracking-tighter leading-none text-white"
                    style={{
                      textShadow: `0 0 20px ${theme.textGlow}, 0 0 40px rgba(${theme.beamColor}, 0.5)`,
                    }}
                  >
                    {currentItem.dateDay || '12'}
                  </span>
                  <span
                    className="font-mono font-extrabold text-xs sm:text-sm tracking-wider uppercase"
                    style={{
                      color: theme.accent,
                      textShadow: `0 0 10px ${theme.textGlow}`,
                    }}
                  >
                    {currentItem.dateMonth || 'OCT'} {currentItem.dateYear || '2026'}
                  </span>
                </div>

                {(currentItem.venue || currentItem.mapsUrl) && (
                  <div>
                    {currentItem.mapsUrl ? (
                      <a
                        href={currentItem.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-xs font-bold transition-opacity hover:opacity-80"
                        style={{
                          color: theme.accent,
                          textShadow: `0 0 10px ${theme.textGlow}`,
                        }}
                      >
                        <MapPin weight="bold" className="w-3.5 h-3.5" />
                        <span className="underline underline-offset-2">
                          {currentItem.locationCode || currentItem.venue || 'CAMPUS'}
                        </span>
                        <ArrowSquareOut className="w-3 h-3" />
                      </a>
                    ) : (
                      <span
                        className="font-mono text-xs font-bold text-slate-300"
                        style={{ textShadow: `0 0 8px ${theme.textGlow}` }}
                      >
                        {currentItem.locationCode || currentItem.venue}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Glowing Event Title (Matching the Beam Title) */}
              <h3
                className="modal-event-title"
                style={{
                  textShadow: `0 0 20px ${theme.textGlow}, 0 0 35px rgba(${theme.beamColor}, 0.4)`,
                }}
              >
                {currentItem.title}
              </h3>

              {/* Lead Statement (Matching the Beam Lead) */}
              {currentItem.lead && (
                <p
                  className="modal-event-lead"
                  style={{
                    color: theme.badgeText,
                    textShadow: `0 0 14px rgba(${theme.beamColor}, 0.6)`,
                  }}
                >
                  {currentItem.lead}
                </p>
              )}

              {/* The Description Chamber (Frosted glass with theme accent bar) */}
              <div
                className="modal-desc-chamber"
                style={{
                  borderLeft: `2.5px solid ${theme.accent}`,
                  borderColor: `rgba(${theme.beamColor}, 0.35)`,
                  background: `rgba(${theme.beamColor}, 0.07)`,
                  boxShadow: `inset 0 0 24px rgba(${theme.beamColor}, 0.08)`,
                }}
              >
                <div
                  className="modal-desc-label font-mono text-[10px] font-black tracking-[0.16em] uppercase mb-2"
                  style={{
                    color: theme.accent,
                    textShadow: `0 0 8px ${theme.textGlow}`,
                  }}
                >
                  // TRANSMISSION & BRIEFING
                </div>
                <p className="modal-desc-text">
                  {currentItem.desc}
                </p>
              </div>

              {/* Bottom Actions: Matching Beam Button Aesthetics */}
              <div className="modal-actions-row">
                {currentItem.mapsUrl && (
                  <a
                    href={currentItem.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-btn-primary"
                    style={{
                      borderColor: theme.accent,
                      boxShadow: `0 0 20px rgba(${theme.beamColor}, 0.45), inset 0 0 10px rgba(${theme.beamColor}, 0.25)`,
                      background: `radial-gradient(ellipse at center, rgba(${theme.beamColor}, 0.28) 0%, rgba(10, 15, 29, 0.92) 80%)`,
                      color: '#FFFFFF',
                      textShadow: `0 0 8px ${theme.textGlow}`,
                    }}
                  >
                    <MapPin weight="bold" className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                    <span>Open in Maps</span>
                    <ArrowSquareOut weight="bold" className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setIsDetailsOpen(false)}
                  className="modal-btn-dismiss"
                  style={{
                    borderColor: `rgba(255, 255, 255, 0.18)`,
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
