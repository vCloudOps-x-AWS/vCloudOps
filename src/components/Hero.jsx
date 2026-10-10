import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight } from '@phosphor-icons/react'
import ScrollCue from './ScrollCue'
import ParticleText from './ParticleText'
import { scrollToTarget } from '../utils/smoothScroll'
import { getHasIntroAnimated, markIntroStarted, markIntroCompleted } from '../utils/introState'

const STATS = [
  { num: 40, suffix: '+', label: 'Active Members' },
  { num: 12, suffix: '+', label: 'Sprints & Labs' },
  { num: 6, suffix: '+', label: 'Live Deployments' },
  { num: 100, suffix: '%', label: 'Student-Driven' },
]

export default function Hero() {
  const containerRef = useRef(null)
  const counterRefs = useRef([])

  useGSAP(() => {
    const isFirstTime = !getHasIntroAnimated()

    if (!isFirstTime) {
      // Reveal all hero elements immediately without delay or layout shift
      gsap.set('.main-nav-header', { y: 0, opacity: 1, clearProps: 'transform,opacity' })
      gsap.set('.hero-desc', { y: 0, opacity: 1, filter: 'blur(0px)' })
      gsap.set('.hero-cta', { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' })
      gsap.set('.hero-stat-card', {
        y: 0,
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0 0 0px rgba(0, 0, 0, 0)',
      })
      gsap.set('.hero-scroll', { y: 0, opacity: 1, filter: 'blur(0px)' })

      STATS.forEach((stat, i) => {
        const el = counterRefs.current[i]
        if (el) el.textContent = `${stat.num}${stat.suffix}`
      })
      return
    }

    markIntroStarted()
    // ─── Initial States with Optical Blur & Subtle Physical Offsets ───
    gsap.set('.main-nav-header', { y: -24, opacity: 0 })
    gsap.set('.hero-desc', { y: 18, opacity: 0, filter: 'blur(8px)' })
    gsap.set('.hero-cta', {
      y: 26,
      opacity: 0,
      scale: 0.92,
      filter: 'blur(10px)',
    })
    gsap.set('.hero-stat-card', {
      y: 32,
      opacity: 0,
      scale: 0.88,
      filter: 'blur(12px)',
    })
    gsap.set('.hero-scroll', { y: 15, opacity: 0, filter: 'blur(6px)' })

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        markIntroCompleted()
      },
    })

    // Step 1: Particles gather first over ~1.6s
    // Step 2: Navbar glides down right as headline particles settle
    tl.to('.main-nav-header', {
      y: 0,
      opacity: 1,
      duration: 0.7,
      delay: 1.75,
      clearProps: 'transform,opacity',
    })
      // Step 3: Tagline fades and clears blur
      .to(
        '.hero-desc',
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.65,
        },
        '-=0.4'
      )
      // Step 4: CTA buttons spring into focus with tactile bloom
      .to(
        '.hero-cta',
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.75,
          stagger: 0.1,
          ease: 'back.out(1.18)',
        },
        '-=0.3'
      )
      // Radiant energy bloom on primary CTA button
      .fromTo(
        '.hero-cta-primary',
        {
          boxShadow: '0 0 35px rgba(56, 189, 248, 0.65), 0 4px 20px rgba(255, 255, 255, 0.3)',
        },
        {
          boxShadow: '0 4px 24px rgba(255, 255, 255, 0.2)',
          duration: 0.85,
          ease: 'power2.out',
        },
        '<0.1'
      )
      // Step 5: Stat cards cascade in with spring overshoot
      .to(
        '.hero-stat-card',
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.8,
          stagger: 0.08,
          ease: 'back.out(1.25)',
        },
        '-=0.45'
      )
      // Flash card borders with electric cyan glow that resolves to sleek dark glass
      .fromTo(
        '.hero-stat-card',
        {
          borderColor: 'rgba(56, 189, 248, 0.55)',
          boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)',
        },
        {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 0 0px rgba(0, 0, 0, 0)',
          duration: 0.9,
          stagger: 0.08,
          ease: 'power2.out',
        },
        '<'
      )

    // Synchronized dynamic rolling counters for each stat card
    STATS.forEach((stat, i) => {
      const el = counterRefs.current[i]
      if (!el) return
      const obj = { val: 0 }
      tl.to(
        obj,
        {
          val: stat.num,
          duration: 1.25,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${Math.round(obj.val)}${stat.suffix}`
          },
        },
        `<${0.08 * i}`
      )
    })

    // Step 6: Scroll cue appears softly
    tl.to(
      '.hero-scroll',
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.6,
      },
      '-=0.4'
    )
  })

  const handleNav = (e, href) => {
    e.preventDefault()
    scrollToTarget(href, -85)
  }

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative flex flex-col items-center justify-start sm:justify-center text-center min-h-[100dvh] pt-24 pb-8 sm:pt-24 sm:pb-12 md:pt-28 md:pb-16 px-4 sm:px-6 md:px-8 scroll-mt-24 overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {/* Subtle Ethereal Ambient Radial Glows */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-30"
        style={{ transform: 'translateZ(0)' }}
      >
        <div
          className="w-[320px] sm:w-[500px] md:w-[700px] h-[320px] sm:h-[500px] md:h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, rgba(56, 189, 248, 0.08) 45%, transparent 70%)',
          }}
        />
        <div
          className="w-[240px] sm:w-[380px] md:w-[500px] h-[240px] sm:h-[380px] md:h-[500px] rounded-full translate-y-20"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(99, 102, 241, 0.05) 45%, transparent 70%)',
          }}
        />
      </div>

      {/* Subtle Text Contrast Shield: ensures blue & white particles pop against any background elements */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <div
          className="w-[90vw] max-w-4xl h-[340px] rounded-full opacity-65"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(3, 8, 20, 0.72) 0%, rgba(3, 8, 20, 0.3) 55%, transparent 75%)',
            transform: 'translateY(10px)',
          }}
        />
      </div>

      {/* Fluid Dynamic Particle Headline with whole-screen scatter & crisp white/blue colors */}
      <ParticleText
        text={"Architect the Cloud.\nDeploy the Future."}
        particleSize={2.6}
        density={4}
        color="#ffffff"
        highlightColor="#0088ff"
        gatherDuration={1600}
        stagger={420}
        pointerRepel={45}
        repelRadius={120}
        idleDrift={0.8}
        trigger="mount"
        fontSize="clamp(1.65rem, 5.8vw, 4.4rem)"
        fontWeight={800}
        fontFamily="'Plus Jakarta Sans', sans-serif"
        glow
        className="w-full max-w-4xl mx-auto mt-2 sm:mt-0 mb-3 sm:mb-5"
      />

      {/* Tagline */}
      <p className="hero-desc max-w-2xl text-[13px] sm:text-base md:text-lg leading-relaxed text-slate-200/90 font-medium mb-5 sm:mb-7 px-3 sm:px-2">
        Where student engineers build, deploy, and scale — real cloud infrastructure, real CI/CD pipelines, real community.
      </p>

      {/* Responsive CTAs (Touch & Mobile Friendly) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto mb-5 sm:mb-8 px-4 sm:px-0">
        {/* Primary CTA */}
        <a
          href="#events"
          onClick={(e) => handleNav(e, '#events')}
          className="hero-cta hero-cta-primary group relative w-full sm:w-auto max-w-[270px] sm:max-w-none inline-flex items-center justify-center gap-3 pl-5 pr-2 py-2 rounded-full font-bold text-xs sm:text-sm md:text-base text-slate-950 bg-gradient-to-r from-white via-slate-100 to-sky-100 shadow-[0_4px_24px_rgba(255,255,255,0.2)] hover:shadow-[0_4px_30px_rgba(56,189,248,0.4)] transition-[box-shadow,transform] duration-300 hover:scale-[1.03] active:scale-[0.98]"
        >
          <span>Explore Workshops</span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-950/10 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight weight="bold" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950" />
          </div>
        </a>

        {/* Secondary CTA */}
        <a
          href="#about"
          onClick={(e) => handleNav(e, '#about')}
          className="hero-cta hero-cta-secondary group w-full sm:w-auto max-w-[270px] sm:max-w-none inline-flex items-center justify-center p-0.5 rounded-full bg-white/10 hover:bg-white/20 transition-[background-color,transform] duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="w-full sm:w-auto inline-flex items-center justify-center px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#050B18]/80 text-white font-semibold text-xs sm:text-sm md:text-base border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:border-sky-400/40 group-hover:bg-[#071126] transition-all">
            About the Club
          </div>
        </a>
      </div>

      {/* Responsive Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4 w-full max-w-3xl px-3 sm:px-2 mb-4 sm:mb-6">
        {STATS.map(({ suffix, label }, index) => (
          <div
            key={label}
            className="hero-stat-card p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md contain-paint transition-[border-color,box-shadow,transform] duration-300 hover:border-sky-400/40 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(56,189,248,0.12)] will-change-transform"
          >
            <div className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 py-3 sm:py-4 px-2 sm:px-3 rounded-[calc(1rem-2px)] bg-[#050505]/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
              <span
                ref={(el) => (counterRefs.current[index] = el)}
                className="text-2xl sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.18)] font-mono tabular-nums"
              >
                0{suffix}
              </span>
              <span className="text-[10px] sm:text-xs tracking-wider uppercase font-bold text-slate-300 text-center">
                {label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Scroll Cue */}
      <div className="hero-scroll">
        <ScrollCue />
      </div>
    </section>
  )
}
