import { useEffect, lazy, Suspense } from 'react'
import { initSmoothScroll, scrollToTarget } from '../utils/smoothScroll'
import SpaceBackground from '../components/SpaceBackground'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AboutTeaser from '../components/AboutTeaser'
import EventsSection from '../components/EventsSection'

const TeamSection = lazy(() => import('../components/TeamSection'))
const GallerySection = lazy(() => import('../components/GallerySection'))
const Footer = lazy(() => import('../components/Footer'))

function LazySectionFallback({ id, minHeight = 'min-h-[400px]', label = 'Loading section...' }) {
  return (
    <section id={id} className={`relative w-full ${minHeight} flex items-center justify-center py-20 text-center`}>
      <div className="flex flex-col items-center gap-3 opacity-30">
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-[11px] uppercase tracking-widest text-sky-200 font-mono">{label}</span>
      </div>
    </section>
  )
}

export default function Home() {
  // Initialize Lenis buttery-smooth scrolling with GSAP ScrollTrigger synchronization
  useEffect(() => {
    const lenis = initSmoothScroll()
    if (window.location.hash) {
      const hash = window.location.hash
      setTimeout(() => {
        scrollToTarget(hash)
      }, 150)
    }
    return () => {
      if (lenis) lenis.destroy()
    }
  }, [])

  return (
    <div className="relative w-full max-w-full min-h-screen overflow-x-clip bg-[#050B18] text-[#F8FAFC] selection:bg-sky-500/30 selection:text-sky-200">
      {/* ── Persistent Cosmic Planet Backdrop ── */}
      <SpaceBackground />

      {/* ── Fixed Floating Island Navigation ── */}
      <Navbar />

      {/* ── Main Content Flow ── */}
      <main className="relative w-full max-w-full overflow-x-clip" style={{ zIndex: 1 }}>
        <Hero />
        <AboutTeaser />
        <EventsSection />
        <Suspense fallback={<LazySectionFallback id="team" minHeight="min-h-[600px]" label="Loading crew & domains..." />}>
          <TeamSection />
        </Suspense>
        <Suspense fallback={<LazySectionFallback id="gallery" minHeight="min-h-[500px]" label="Loading community memories..." />}>
          <GallerySection />
        </Suspense>
      </main>

      {/* ── Polished Community Footer ── */}
      <Suspense fallback={<LazySectionFallback id="footer" minHeight="min-h-[280px]" label="Loading footer..." />}>
        <Footer />
      </Suspense>
    </div>
  )
}
