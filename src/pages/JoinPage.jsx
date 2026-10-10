import { useState, useEffect } from 'react'
import {
  DeviceMobile,
  Globe,
  Cloud,
  ShieldCheck,
  Brain,
  Terminal,
  Gear,
  CurrencyDollar,
  Palette,
  Megaphone,
  ArrowUpRight,
  DiscordLogo,
  Compass,
} from '@phosphor-icons/react'
import { initSmoothScroll, scrollToTarget } from '../utils/smoothScroll'
import SpaceBackground from '../components/SpaceBackground'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const DOMAINS = [
  {
    id: 'app-dev',
    name: 'App Dev',
    icon: DeviceMobile,
    accentColor: '#818CF8', // Cosmic Indigo
    glowRgba: 'rgba(129, 140, 248, 0.22)',
    borderHover: 'hover:border-indigo-400/40',
    category: 'technical',
    description: 'Native iOS and Android apps with real-time cloud sync.',
  },
  {
    id: 'web-dev',
    name: 'Web Dev',
    icon: Globe,
    accentColor: '#22C55E', // Aurora Jade
    glowRgba: 'rgba(34, 197, 94, 0.22)',
    borderHover: 'hover:border-emerald-400/40',
    category: 'technical',
    description: 'Modern full-stack web platforms and cloud-native services.',
  },
  {
    id: 'cloud',
    name: 'Cloud',
    icon: Cloud,
    accentColor: '#F59E0B', // Solar Gold
    glowRgba: 'rgba(245, 158, 11, 0.22)',
    borderHover: 'hover:border-amber-400/40',
    category: 'technical',
    description: 'Automated CI/CD pipelines, Kubernetes, and cloud infra.',
  },
  {
    id: 'cloud-security',
    name: 'Cloud Security',
    icon: ShieldCheck,
    accentColor: '#F43F5E', // Stellar Rose
    glowRgba: 'rgba(244, 63, 94, 0.22)',
    borderHover: 'hover:border-rose-400/40',
    category: 'security',
    description: 'Zero-trust architecture, threat defense, and security audits.',
  },
  {
    id: 'aiml',
    name: 'AIML',
    icon: Brain,
    accentColor: '#F97316', // Supernova Orange
    glowRgba: 'rgba(249, 115, 22, 0.22)',
    borderHover: 'hover:border-orange-400/40',
    category: 'security',
    description: 'Generative models, neural networks, and scalable MLOps.',
  },
  {
    id: 'comp-prog',
    name: 'Comp Prog',
    icon: Terminal,
    accentColor: '#38BDF8', // Electric Cyan
    glowRgba: 'rgba(56, 189, 248, 0.22)',
    borderHover: 'hover:border-sky-400/40',
    category: 'technical',
    description: 'Advanced algorithms, data structures, and ICPC prep.',
  },
  {
    id: 'operations',
    name: 'Operations',
    icon: Gear,
    accentColor: '#A855F7', // Deep Nebula Violet
    glowRgba: 'rgba(168, 85, 247, 0.22)',
    borderHover: 'hover:border-purple-400/40',
    category: 'operations',
    description: 'Sprint roadmaps, hackathon logistics, and team execution.',
  },
  {
    id: 'finance-spons',
    name: 'Finance & Spons',
    icon: CurrencyDollar,
    accentColor: '#10B981', // Emerald Mint
    glowRgba: 'rgba(16, 185, 129, 0.22)',
    borderHover: 'hover:border-emerald-400/40',
    category: 'operations',
    description: 'Corporate partnerships, cloud credits, and grant funding.',
  },
  {
    id: 'multi-media',
    name: 'Multi media',
    icon: Palette,
    accentColor: '#60A5FA', // Celestial Azure
    glowRgba: 'rgba(96, 165, 250, 0.22)',
    borderHover: 'hover:border-blue-400/40',
    category: 'creative',
    description: 'UI/UX design systems, 3D assets, and motion graphics.',
  },
  {
    id: 'publicity-outreach',
    name: 'Publicity and Outreach',
    icon: Megaphone,
    accentColor: '#0EA5E9', // Deep Ocean Blue
    glowRgba: 'rgba(14, 165, 233, 0.22)',
    borderHover: 'hover:border-sky-500/40',
    category: 'creative',
    description: 'Campus brand growth, developer outreach, and media campaigns.',
  },
]

const CATEGORIES = [
  { id: 'all', label: 'All Domains' },
  { id: 'technical', label: 'Technical' },
  { id: 'security', label: 'AI & Security' },
  { id: 'operations', label: 'Operations' },
  { id: 'creative', label: 'Creative' },
]

export default function JoinPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = initSmoothScroll()
    window.scrollTo(0, 0)
    return () => {
      if (lenis) lenis.destroy()
    }
  }, [])

  // Smooth single-scroll transition from Hero to Domains
  useEffect(() => {
    let isTransitioning = false

    const handleWheel = (e) => {
      const scrollY = window.scrollY
      const heroThreshold = window.innerHeight * 0.45

      // If viewing the Hero screen and user scrolls down even a single tick
      if (scrollY < heroThreshold && e.deltaY > 15) {
        if (!isTransitioning) {
          isTransitioning = true
          scrollToTarget('#domains-grid', -75)
          setTimeout(() => {
            isTransitioning = false
          }, 1100)
        }
      }
    }

    let touchStartY = 0
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }
    const handleTouchMove = (e) => {
      const currentY = e.touches[0].clientY
      const diff = touchStartY - currentY
      const scrollY = window.scrollY
      const heroThreshold = window.innerHeight * 0.45

      if (scrollY < heroThreshold && diff > 30) {
        if (!isTransitioning) {
          isTransitioning = true
          scrollToTarget('#domains-grid', -75)
          setTimeout(() => {
            isTransitioning = false
          }, 1100)
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  const handleScrollToDomains = (e) => {
    e.preventDefault()
    scrollToTarget('#domains-grid', -75)
  }

  const filteredDomains =
    selectedCategory === 'all'
      ? DOMAINS
      : DOMAINS.filter((d) => d.category === selectedCategory)

  return (
    <div className="relative min-h-screen bg-[#050B18] text-[#F8FAFC] selection:bg-sky-500/30 selection:text-sky-200">
      {/* ── Persistent Cosmic Planet Backdrop ── */}
      <SpaceBackground />

      {/* ── Fixed Floating Island Navigation ── */}
      <Navbar />

      {/* ── Main Content Container ── */}
      <main className="relative px-4 sm:px-6 md:px-8 max-w-7xl mx-auto" style={{ zIndex: 1 }}>
        {/* ── Hero Announcement (Full Viewport Height: nothing below is visible initially) ── */}
        <section className="relative flex flex-col items-center justify-center text-center min-h-[100dvh] pt-20 pb-16 max-w-3xl mx-auto">
          {/* Subtle Ambient Cosmic Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[560px] md:w-[720px] h-[300px] sm:h-[420px] pointer-events-none opacity-35 -z-10"
            style={{
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(99, 102, 241, 0.1) 45%, transparent 70%)',
            }}
          />

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1] drop-shadow-[0_2px_16px_rgba(255,255,255,0.15)]">
            Applications <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-300">Opening Soon</span>
          </h1>

          {/* User Requested Body Text */}
          <div className="space-y-4 max-w-2xl mx-auto mb-9">
            <p className="text-base sm:text-lg md:text-xl font-medium text-slate-200 leading-relaxed">
              We haven&apos;t kicked off our recruitment drive just yet, but the doors are opening shortly.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-slate-400 leading-relaxed font-normal">
              We’re looking for tech-driven minds ready to build, break, and scale impactful projects alongside a focused team of peers. Whether you write low-level code, architect cloud systems, or build slick interfaces, keep your eyes on this page.
            </p>
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleScrollToDomains}
              className="group inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-sky-400 to-sky-200 text-slate-950 font-bold text-xs sm:text-sm transition-all duration-300 hover:shadow-[0_0_28px_rgba(56,189,248,0.5)] hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto cursor-pointer"
            >
              <Compass weight="bold" className="w-4 h-4 text-slate-950" />
              <span>Explore Available Domains</span>
              <ArrowUpRight weight="bold" className="w-3.5 h-3.5 text-slate-950 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <a
              href="https://discord.gg/yMZhKMhc2n"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/12 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm transition-all duration-300 hover:border-sky-400/40 w-full sm:w-auto shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
            >
              <DiscordLogo weight="fill" className="w-4 h-4 text-sky-400" />
              <span>Join Discord Community</span>
            </a>
          </div>

          {/* Minimalist Space Scroll Cue */}
          <button
            type="button"
            onClick={handleScrollToDomains}
            aria-label="Scroll down to domains"
            className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 hover:text-sky-400 transition-colors group cursor-pointer"
          >
            <span className="text-[10px] font-mono tracking-widest uppercase font-semibold">
              Scroll to Explore
            </span>
            <div className="w-5 h-8 rounded-full border border-white/20 group-hover:border-sky-400/50 flex items-start justify-center p-1 transition-colors">
              <div className="w-1 h-2 rounded-full bg-sky-400 animate-bounce" />
            </div>
          </button>
        </section>

        {/* ── Domains Showcase (Smoothly scrolled to on a single scroll) ── */}
        <section id="domains-grid" className="scroll-mt-24 pt-8 pb-24">
          {/* Centered Minimalist Space Filter Bar */}
          <div className="flex items-center justify-center mb-12">
            <div className="inline-flex items-center p-1 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                      active
                        ? 'bg-sky-400 text-slate-950 font-bold shadow-[0_0_16px_rgba(56,189,248,0.45)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Ultra-Minimalist Space Domain Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredDomains.map((domain) => {
              const IconComponent = domain.icon
              return (
                <div
                  key={domain.id}
                  className={`group relative p-[1px] rounded-3xl bg-gradient-to-b from-white/12 via-white/[0.03] to-transparent border border-white/10 transition-all duration-500 hover:-translate-y-1.5 hover:border-white/25 hover:shadow-[0_20px_40px_rgba(0,0,0,0.7)] ${domain.borderHover}`}
                >
                  {/* Subtle Localized Nebula Backlight on Hover */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${domain.glowRgba} 0%, transparent 70%)`,
                    }}
                  />

                  {/* Inner Obsidian Glass Core */}
                  <div className="relative h-full flex flex-col justify-start rounded-[calc(1.5rem-1px)] bg-[#040814]/85 backdrop-blur-2xl p-6 sm:p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
                    {/* Top Row: Floating Celestial Icon Pod */}
                    <div className="mb-5">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 border border-white/10 bg-white/[0.04] group-hover:scale-110 group-hover:border-white/20"
                        style={{
                          color: domain.accentColor,
                          boxShadow: `0 0 20px ${domain.accentColor}25`,
                        }}
                      >
                        <IconComponent weight="duotone" className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Domain Title */}
                    <h3 className="text-xl font-bold tracking-tight text-white mb-2 group-hover:text-sky-200 transition-colors">
                      {domain.name}
                    </h3>

                    {/* Concise 1-Line Description */}
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                      {domain.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      {/* ── Polished Community Footer ── */}
      <Footer />
    </div>
  )
}
