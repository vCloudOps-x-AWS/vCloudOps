import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import MobileUfoEvents from './MobileUfoEvents'
import { getLenis } from '../utils/smoothScroll'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/* ────────────────────────────────────────────────────────
   Active Events (can be freely added, removed, or fetched)
──────────────────────────────────────────────────────── */
const INITIAL_ACTIVE_EVENTS = [
  {
    id: 'commit-to-git',
    title: 'Commit to Git: Hands-On Git & GitHub Workshop',
    collapsedTitle: 'Commit to Git',
    collapsedMeta: 'Hands-On Workshop',
    mode: 'In-Person',
    dateDay: '12',
    dateMonth: 'OCT',
    dateYear: '2026',
    date: '12 Oct 2026',
    locationCode: 'VIT PUNE',
    venue: 'New Seminar Hall, VIT Pune',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vishwakarma+Institute+of+Technology+Bibwewadi+Pune',
    lead: 'From Your First Commit to Your First Pull Request — Learn Git, collaborate, build & deploy.',
    desc: 'An interactive hands-on masterclass taking you through repository management, branching, and real-world team pull requests with on-ground mentor support. Features a live jamming break, an introduction to Cloud & DevOps, and an interactive quiz with exciting prizes!',
    src: '/images/events/github-basics.webp',
    fallbackSrc: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=2076&auto=format&fit=crop',
    category: 'Hands-on Workshop',
  },
  {
    id: 'weekly-aws-workshops',
    title: 'Weekly AWS Builder Workshops',
    collapsedTitle: 'AWS Builder Workshops',
    collapsedMeta: 'Every Sunday',
    mode: 'Online Live',
    dateDay: 'SUN',
    dateMonth: 'EVERY',
    dateYear: 'WEEK',
    date: 'Every Sunday',
    locationCode: null,
    venue: null,
    mapsUrl: null,
    lead: '100% interactive cloud builds deployed live from scratch on AWS.',
    desc: 'Architect serverless APIs with AWS Lambda, connect cloud databases, configure Amazon S3 static hosting with CloudFront CDN, and explore Generative AI deployments on Amazon Bedrock.',
    src: '/images/events/aws-builder.webp',
    fallbackSrc: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
    category: 'Weekly Sprint',
    actionLabel: 'Join Discord Lab',
    actionUrl: 'https://discord.gg/yMZhKMhc2n',
  },
]

/* ────────────────────────────────────────────────────────
   STAY TUNED FOR UPCOMING EVENTS (Terminal Card)
   Guaranteed to ALWAYS reside at the very end of the stack,
   regardless of how many cards precede it.
──────────────────────────────────────────────────────── */
const STAY_TUNED_CARD = {
  id: 'stay-tuned-upcoming-events',
  isTerminalCard: true,
  title: '26 Roadmap: AI & Agentic AI Hackathon',
  collapsedTitle: '26 Roadmap',
  collapsedMeta: 'AI, ML & Agentic AI',
  mode: '26 ROADMAP',
  dateDay: 'TBA',
  dateMonth: 'ANNOUNCING',
  dateYear: 'SOON',
  date: 'Date: To Be Announced (TBA) · Stay Tuned for Updates',
  locationCode: null,
  venue: null,
  mapsUrl: null,
  lead: 'Autonomous Agentic AI, RAG & Machine Learning on AWS. Stay tuned for dates!',
  desc: 'Get ready for our flagship hackathon dedicated to cutting-edge AI! Delve into Artificial Intelligence, Machine Learning, Autonomous Agentic AI orchestration, and production Retrieval-Augmented Generation (RAG) pipelines on AWS. Collaborate with fellow builders, architect intelligent systems, and compete for exclusive AWS credits, prizes, and mentorship. Official dates and venue will be announced soon — stay tuned for updates!',
  src: '/images/events/upcoming-event.webp',
  fallbackSrc: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop',
  category: 'Roadmap Flagship',
}

/**
 * Ensures STAY_TUNED_CARD is guaranteed to be the final card in the stack,
 * deduplicating any legacy entries and seamlessly appending it.
 */
function ensureStayTunedAtEnd(eventsList = []) {
  const filtered = eventsList.filter(
    (item) => item.id !== STAY_TUNED_CARD.id && item.id !== 'upcoming-flagship-event'
  )
  return [...filtered, STAY_TUNED_CARD]
}

export default function EventsSection({ customEvents }) {
  const sectionRef = useRef(null)
  const pinWrapperRef = useRef(null)
  const stRef = useRef(null)

  // Assembles events guaranteed to have STAY_TUNED_CARD as the terminal card
  const events = useMemo(() => {
    return ensureStayTunedAtEnd(customEvents || INITIAL_ACTIVE_EVENTS)
  }, [customEvents])

  const totalCards = events.length
  const [activeIndex, setActiveIndex] = useState(0)

  // Scroll to a specific card smoothly via Lenis
  const scrollToCard = useCallback((index) => {
    const st = stRef.current
    if (!st || totalCards <= 1) return

    let targetProgress = 0
    if (index === 0) {
      targetProgress = 0.0
    } else if (index === totalCards - 1) {
      // Comfortably inside the terminal card zone
      targetProgress = 0.88
    } else {
      targetProgress = (index + 0.5) / totalCards
    }

    const targetY = st.start + targetProgress * (st.end - st.start)
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(targetY, {
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' })
    }
  }, [totalCards])

  // GSAP ScrollTrigger Responsive Accordion Setup via matchMedia
  useGSAP(
    () => {
      const section = sectionRef.current
      const pinWrapper = pinWrapperRef.current
      if (!section || !pinWrapper) return

      // Enable pin-hijacked scroll on both mobile and desktop/laptop screens
      const getPinDistance = () => {
        const isMob = typeof window !== 'undefined' && window.innerWidth < 768
        if (isMob) {
          // Mobile touch scroll: calibrated so each card gets ~350-450px of smooth scroll
          return Math.max(900, window.innerHeight * Math.max(1.3, totalCards * 0.55))
        }
        return Math.max(1400, window.innerHeight * Math.max(1.6, totalCards * 0.65))
      }

      const step = 1 / totalCards
      const deadband = Math.min(0.02, step * 0.1)

      const trigger = ScrollTrigger.create({
        trigger: section,
        pin: pinWrapper,
        start: 'top top',
        end: () => `+=${getPinDistance()}`,
        scrub: typeof window !== 'undefined' && window.innerWidth < 768 ? 0.4 : 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress

          // Dynamic hysteresis state machine supporting ANY number of cards:
          setActiveIndex((currentIdx) => {
            if (totalCards <= 1) return 0

            // Forward transition: advancing to next card
            if (currentIdx < totalCards - 1) {
              const forwardBoundary = (currentIdx + 1) * step + deadband
              if (p >= forwardBoundary) {
                let target = currentIdx + 1
                while (target < totalCards - 1 && p >= (target + 1) * step + deadband) {
                  target++
                }
                return target
              }
            }

            // Backward transition: retreating to previous card
            if (currentIdx > 0) {
              const backwardBoundary = currentIdx * step - deadband
              if (p < backwardBoundary) {
                let target = currentIdx - 1
                while (target > 0 && p < target * step - deadband) {
                  target--
                }
                return target
              }
            }

            return currentIdx
          })
        },
      })

      stRef.current = trigger

      return () => {
        trigger.kill()
        stRef.current = null
      }
    },
    { scope: sectionRef, dependencies: [totalCards] }
  )

  // Track desktop vs mobile screen
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  )

  // Listen to window resize to keep ScrollTrigger measurements pristine and track desktop
  // In Chrome on mobile devices, vertical scrolling collapses/expands the browser URL bar,
  // which fires window resize events with changing innerHeight.
  // We only re-calculate & refresh ScrollTrigger if the viewport WIDTH changes (e.g., orientation or window resize).
  useEffect(() => {
    let lastWidth = typeof window !== 'undefined' ? window.innerWidth : 0

    const handleResize = () => {
      if (typeof window === 'undefined') return
      const currentWidth = window.innerWidth
      if (currentWidth !== lastWidth) {
        lastWidth = currentWidth
        setIsDesktop(currentWidth >= 768)
        ScrollTrigger.refresh()
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle horizontal trackpad scroll translation to vertical scroll (Desktop only)
  const handleWheel = (e) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 8) {
      const lenis = getLenis()
      if (lenis) {
        lenis.scrollTo(lenis.scroll + e.deltaX * 1.5, { immediate: false })
      } else {
        window.scrollBy({ top: e.deltaX * 1.5 })
      }
    }
  }

  return (
    <section
      id="events"
      ref={sectionRef}
      className="relative w-full max-w-full overflow-x-clip z-20"
      aria-label="Events and Workshops Section"
    >
      {/* ── Pinned Full-Viewport Container ── */}
      <div
        ref={pinWrapperRef}
        onWheel={handleWheel}
        className="w-full h-[100dvh] max-h-[100dvh] md:max-h-[1080px] flex flex-col justify-start items-center gap-1 sm:gap-2 overflow-visible relative select-none"
        style={{
          paddingTop: isDesktop
            ? 'clamp(7.5rem, 10vh + 2rem, 9.2rem)'
            : 'clamp(4.25rem, 6vh + 1rem, 5.5rem)',
          paddingBottom: 'clamp(0.5rem, 1vh, 1rem)',
        }}
      >
        {/* Ambient atmospheric glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/4 left-1/4 w-[min(650px,90vw)] h-[380px] bg-sky-500/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[min(550px,85vw)] h-[340px] bg-indigo-500/10 rounded-full blur-[130px]" />
        </div>

        {/* ── Section Header ── */}
        <div className="events-header flex flex-col items-center text-center px-4 sm:px-6 shrink-0 mt-0 sm:mt-1 mb-1">

          <h2
            className="font-extrabold tracking-tight leading-[1.2] mb-1 sm:mb-1.5 px-2"
            style={{ fontSize: 'clamp(1.45rem, 3.4vw, 2.85rem)' }}
          >
            <span className="text-white">Level Up Your </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-sky-400 to-sky-600 drop-shadow-[0_0_24px_rgba(56,189,248,0.3)]">
              Cloud Craft
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-200/90 font-medium leading-relaxed max-w-2xl px-2">
            Don&apos;t just learn the cloud — code it live. From hands-on Git essentials at VIT campus to weekly cloud builds and hackathon sprints.
          </p>
        </div>

        {/* ── UFO Beam Events Showcase (Scroll & Touch Synchronized) ── */}
        <div className="w-full flex flex-col justify-start items-center mt-1 sm:mt-1.5">
          <MobileUfoEvents
            items={events}
            activeIndex={activeIndex}
            onSelect={(idx) => {
              setActiveIndex(idx)
              scrollToCard(idx)
            }}
          />
        </div>
      </div>
    </section>
  )
}
