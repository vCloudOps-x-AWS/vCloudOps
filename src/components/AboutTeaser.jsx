import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Cloud, GitBranch, UsersThree, CaretDown } from '@phosphor-icons/react'
import { scrollToTarget } from '../utils/smoothScroll'

gsap.registerPlugin(ScrollTrigger)

const MISSION_WORDS = [
  { text: 'We', accent: false },
  { text: "don't", accent: false },
  { text: 'just', accent: false },
  { text: 'learn', accent: true },
  { text: 'the', accent: false },
  { text: 'cloud', accent: true },
  { text: '—', accent: false },
  { text: 'we', accent: false },
  { text: 'build', accent: true },
  { text: 'it.', accent: false },
]

const PILLARS = [
  {
    icon: Cloud,
    tag: 'Architecture',
    title: 'Cloud Systems',
    desc: 'High-availability AWS infrastructure, multi-region setups, and secure serverless microservices.',
  },
  {
    icon: GitBranch,
    tag: 'DevOps & GitOps',
    title: 'Automated Delivery',
    desc: 'Production CI/CD pipelines, containerized workloads with Docker, and automated Kubernetes orchestration.',
  },
  {
    icon: UsersThree,
    tag: 'Open Collective',
    title: 'Student Community',
    desc: 'Hands-on campus lab sprints, hackathons, and real-world production engineering mentorship.',
  },
]

export default function AboutTeaser() {
  const containerRef = useRef(null)

  useGSAP(() => {
    // Mission Label
    gsap.from('.mission-label', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      clearProps: 'opacity,transform',
      scrollTrigger: { trigger: '.mission-label', start: 'top 85%', once: true },
    })

    // Words
    gsap.from('.mission-word', {
      y: 24,
      opacity: 0,
      duration: 0.85,
      stagger: 0.04,
      ease: 'power3.out',
      clearProps: 'opacity,transform',
      scrollTrigger: { trigger: '.mission-word-container', start: 'top 82%', once: true },
    })

    // Sub-copy
    gsap.from('.about-sub', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      delay: 0.15,
      ease: 'power3.out',
      clearProps: 'opacity,transform',
      scrollTrigger: { trigger: '.mission-word-container', start: 'top 82%', once: true },
    })

    // Pillars cards
    gsap.from('.about-pillar', {
      y: 28,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      delay: 0.25,
      ease: 'power3.out',
      clearProps: 'opacity,transform',
      scrollTrigger: { trigger: '.about-pillars-grid', start: 'top 88%', once: true },
    })
  }, { scope: containerRef })

  const handleScrollToEvents = (e) => {
    e.preventDefault()
    scrollToTarget('#events')
  }

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-between text-center px-4 sm:px-6 md:px-8 pt-16 pb-6 sm:pt-28 sm:pb-10 md:pt-32 md:pb-12 z-10 overflow-hidden"
    >
      {/* Ambient background glow to ground the full-screen view */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
        <div className="w-[500px] sm:w-[700px] h-[340px] sm:h-[460px] rounded-full bg-sky-500/10 blur-[130px]" />
        <div className="w-[400px] sm:w-[550px] h-[280px] sm:h-[380px] rounded-full bg-indigo-500/10 blur-[140px] translate-y-24" />
      </div>

      {/* Main Centered Mission Presentation */}
      <div className="flex flex-col items-center max-w-5xl my-auto w-full">
        {/* Mission Label */}
        <div className="mission-label mb-3 sm:mb-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/5 border border-sky-400/20 backdrop-blur-xl shadow-[0_0_20px_rgba(56,189,248,0.15)]">
            <img
              src="/Logo/aws-logo-white.png"
              alt="AWS SBG"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain drop-shadow-[0_0_8px_rgba(255,153,0,0.5)]"
            />
            <span className="text-[10px] sm:text-xs tracking-[0.22em] uppercase font-bold text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
              Our Core Mission
            </span>
          </div>
        </div>

        {/* Large Mission Statement */}
        <h2
          className="mission-word-container max-w-4xl leading-[1.25] mb-3 sm:mb-5 font-extrabold tracking-tight px-1 sm:px-2"
          style={{ fontSize: 'clamp(1.35rem, 4vw, 3.75rem)' }}
        >
          {MISSION_WORDS.map((w, i) => (
            <span
              key={i}
              className={`mission-word inline-block whitespace-nowrap mr-[0.22em] ${
                w.accent
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-sky-400 to-sky-600 drop-shadow-[0_0_24px_rgba(56,189,248,0.3)]'
                  : 'text-white'
              }`}
            >
              {w.text}
            </span>
          ))}
        </h2>

        {/* Sub-copy */}
        <p className="about-sub max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-slate-200/90 font-medium px-1 sm:px-2 mb-5 sm:mb-8">
          AWS SBG is a student-led engineering collective bridging the gap between university coursework and production engineering. From self-healing Kubernetes clusters to immutable infrastructure — we ship real systems with measurable impact.
        </p>

        {/* Core Pillars Grid */}
        <div className="about-pillars-grid grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 md:gap-5 w-full max-w-4xl px-1 sm:px-2">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon
            return (
              <div
                key={i}
                className="about-pillar group relative p-3.5 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl transition-all duration-300 hover:border-sky-400/40 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(56,189,248,0.15)] text-left flex flex-row sm:flex-col sm:justify-between items-start gap-3 sm:gap-0"
              >
                {/* Pillar Icon */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 group-hover:bg-sky-500/20 group-hover:scale-105 transition-all shrink-0 mt-0.5 sm:mb-3">
                  <Icon weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Pillar Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5 mb-1 sm:mb-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight group-hover:text-sky-200 transition-colors">
                      {pillar.title}
                    </h3>
                    <span className="text-[9px] sm:text-[10px] font-mono font-semibold uppercase tracking-wider text-sky-400 bg-sky-500/15 px-2 py-0.5 rounded-full border border-sky-400/25 shrink-0">
                      {pillar.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300/90 leading-relaxed font-normal">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Subtle Scroll Cue at the bottom of the About section */}
      <a
        href="#events"
        onClick={handleScrollToEvents}
        className="group inline-flex items-center gap-2 mt-4 text-xs font-mono uppercase tracking-widest text-slate-300 hover:text-sky-300 transition-colors cursor-pointer py-1 px-3 rounded-full hover:bg-white/5"
      >
        <span>Explore Workshops & Events</span>
        <CaretDown weight="bold" className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5 text-sky-400" />
      </a>
    </section>
  )
}
