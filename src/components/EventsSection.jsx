import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import AccordionGallery from './AccordionGallery'
import { getLenis } from '../utils/smoothScroll'

gsap.registerPlugin(ScrollTrigger)

/* ────────────────────────────────────────────────────────
   Active Events (can be freely added, removed, or fetched)
──────────────────────────────────────────────────────── */
const INITIAL_ACTIVE_EVENTS = [
  {
    id: 'github-basics',
    title: 'GitHub Basics',
    collapsedTitle: 'GitHub Basics',
    collapsedMeta: 'Offline Workshop',
    tagline: 'Version Control, Branching & GitOps Foundations',
    mode: 'Offline Workshop',
    date: '13th Oct, 2026',
    venue: 'VIT Bibwewadi College, Pune',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vishwakarma+Institute+of+Technology+Bibwewadi+Pune',
    desc: 'Hands-on code-along workshop on campus. Get direct CLI and console experience, master core Git workflows, branch lifecycle strategies, conflict resolution, collaborative pull requests, and automated repository actions with live in-person mentor debugging.',
    src: '/images/events/github-basics.webp',
    fallbackSrc: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=2076&auto=format&fit=crop',
    tags: ['Git CLI', 'Branching & Merge', 'PR Review', 'Campus Offline'],
    category: 'Hands-on Lab',
    actionLabel: 'Open Venue Map',
  },
  {
    id: 'weekly-aws-workshops',
    title: 'Weekly AWS Builder Workshops',
    collapsedTitle: 'AWS Builder Workshops',
    collapsedMeta: 'Every Sunday',
    tagline: '100% Interactive Cloud Architecture Builds',
    mode: 'Online Live',
    date: 'Every Sunday',
    venue: 'Discord Voice & AWS Console',
    mapsUrl: null,
    desc: 'Interactive live builds from scratch. Deploy live static websites on Amazon S3, architect serverless APIs with AWS Lambda & API Gateway, spin up cloud databases, and explore Generative AI deployments with Amazon Bedrock — every project is pushed directly to your GitHub portfolio.',
    src: '/images/events/aws-builder.webp',
    fallbackSrc: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
    tags: ['AWS Lambda', 'Amazon S3', 'Bedrock GenAI', 'Serverless'],
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
  title: 'Stay Tuned for Upcoming Events',
  collapsedTitle: 'Stay Tuned',
  collapsedMeta: 'Upcoming Events',
  tagline: 'Hackathons, Deep Dives & Cloud Sprints',
  mode: 'Upcoming Events',
  date: 'Semester Roadmap · 2026–27',
  venue: 'Hybrid · Campus & Global',
  mapsUrl: null,
  desc: 'Collaborate in teams to design and deploy innovative, practical, and scalable cloud solutions solving real-world challenges, earn AWS credits, win badges and swag, and walk away with working demos that elevate your engineering resume.',
  src: '/images/events/upcoming-event.webp',
  fallbackSrc: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
  tags: ['Agentic AI', 'Cloud Hackathon', 'AWS Credits', 'Swag & Badges'],
  category: 'Upcoming Events',
  actionLabel: 'Stay Tuned for Updates',
  actionUrl: '/join',
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

  // GSAP ScrollTrigger Pinned Accordion Setup
  useGSAP(
    () => {
      const section = sectionRef.current
      const pinWrapper = pinWrapperRef.current
      if (!section || !pinWrapper) return

      // Clean up previous trigger if re-running
      if (stRef.current) {
        stRef.current.kill()
        stRef.current = null
      }

      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

      // Vertical distance dynamically scaled to the number of cards
      const getPinDistance = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
          // On mobile: balanced pin scroll so swiping advances through cards smoothly without excessive dragging
          return Math.max(750, window.innerHeight * Math.max(1.2, totalCards * 0.55))
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
        scrub: isMobile ? 0.35 : 0.8,
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

      const timeout = setTimeout(() => {
        ScrollTrigger.refresh()
      }, 250)

      return () => {
        clearTimeout(timeout)
        trigger.kill()
      }
    },
    { scope: sectionRef, dependencies: [totalCards] }
  )

  // Listen to window resize to keep ScrollTrigger measurements pristine
  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle horizontal trackpad scroll translation to vertical scroll
  const handleWheel = (e) => {
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
      className="relative w-full z-20"
      aria-label="Events and Workshops Section"
    >
      {/* ── Pinned Full-Viewport Container ── */}
      <div
        ref={pinWrapperRef}
        onWheel={handleWheel}
        className="w-full h-screen min-h-[560px] sm:min-h-[620px] max-h-[1080px] flex flex-col justify-between overflow-hidden relative select-none"
        style={{
          paddingTop: 'clamp(4.5rem, 5.5vh + 1.25rem, 6rem)',
          paddingBottom: 'clamp(0.75rem, 2vh, 2rem)',
        }}
      >
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 left-1/4 w-[650px] h-[380px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/3 right-1/4 w-[550px] h-[340px] bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />

        {/* ── Section Header ── */}
        <div className="events-header flex flex-col items-center text-center px-4 sm:px-6 shrink-0 mb-2 sm:mb-3">
          <h2
            className="font-extrabold text-white leading-tight tracking-tight mb-1 sm:mb-2"
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
          >
            Level Up Your Cloud Craft
          </h2>

          <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-2xl px-2">
            Don&apos;t just learn the cloud — code it live. From hands-on Git essentials at VIT campus to weekly cloud builds and hackathon sprints.
          </p>
        </div>

        {/* ── Controlled Accordion Gallery Container ── */}
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 my-auto flex-1 flex flex-col justify-center">
          <AccordionGallery
            items={events}
            activeIndex={activeIndex}
            onSelect={scrollToCard}
          />
        </div>
      </div>
    </section>
  )
}
