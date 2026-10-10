import { useState, useEffect } from 'react'
import DistantGalaxy from './DistantGalaxy'
import TerrestrialPlanet from './TerrestrialPlanet'
import OrbitalProbe from './OrbitalProbe'
import ChronosGasGiant from './ChronosGasGiant'
import ClosePassPlanet from './ClosePassPlanet'
import BinaryStars from './BinaryStars'

/**
 * SpaceJourneyCanvas — Modular Multi-Layer Parallax Orchestrator
 *
 * Coordinates the 3-layer parallax journey as the user scrolls downwards through the page:
 *   - Far Background (z = -300px to -500px / 0.02x–0.05x): Distant Galaxy & Nebula Dust
 *   - Midground (z = -100px to -200px / 0.10x–0.25x): Terrestrial World, Probe, Gas Giant, Binary Stars
 *   - Near Foreground (z = 0 to +100px / 0.35x–0.60x): Close-Pass Planetoid
 *
 * Responsive Budget:
 *   - On mobile/tablet (<768px), drops object counts by 50% and scales down radii to prevent text collisions.
 */
export default function SpaceJourneyCanvas({ scrollYProgress, reduced = false }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      style={{
        contain: 'paint',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {/* ════════════════════════════════════════════════════════════════════════
          LAYER 1: FAR BACKGROUND (z = -300px to -500px / Speed: 0.02x–0.05x)
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <DistantGalaxy progress={scrollYProgress} reduced={reduced} />
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          LAYER 2: MIDGROUND (z = -100px to -200px / Speed: 0.10x–0.25x)
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        {/* Phase 2: Inner System & Orbital Probe (15% - 45%) */}
        <TerrestrialPlanet progress={scrollYProgress} reduced={reduced} />
        <OrbitalProbe progress={scrollYProgress} reduced={reduced} />

        {/* Phase 3: Deep Void & Chronos Gas Giant (32% - 58%) */}
        <ChronosGasGiant progress={scrollYProgress} isMobile={isMobile} reduced={reduced} />

        {/* Phase 5: Outer Frontier Binary Stars (82% - 100%) */}
        <BinaryStars progress={scrollYProgress} reduced={reduced} />
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          LAYER 3: NEAR FOREGROUND (z = 0 to +100px / Speed: 0.35x–0.60x)
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
        {/* Phase 4: Close-Pass Skimming Celestial Body (60% - 86%) */}
        <ClosePassPlanet progress={scrollYProgress} isMobile={isMobile} reduced={reduced} />
      </div>
    </div>
  )
}
