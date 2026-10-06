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
    title: 'GitHub Basics & GitOps',
    collapsedTitle: 'GitHub Basics',
    collapsedMeta: 'Offline Workshop',
    command: 'git checkout -b feat/gitops-mastery',
    mode: 'In-Person Lab',
    date: '13 Oct 2026',
    venue: 'VIT Bibwewadi Campus',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vishwakarma+Institute+of+Technology+Bibwewadi+Pune',
    desc: 'Hands-on code-along masterclass on campus. Master core terminal Git workflows, atomic commits, conflict resolution, and collaborative pull requests with live 1-on-1 mentor debugging.',
    highlights: [
      { num: '01', title: 'Core Plumbing', detail: 'Staging areas, commit trees & remote origins' },
      { num: '02', title: 'Branch Isolation', detail: 'Conflict resolution & clean merge pipelines' },
      { num: '03', title: 'Team GitOps', detail: 'PR review etiquette & automated repo actions' },
    ],
    src: '/images/events/github-basics.jpg',
    fallbackSrc: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=2076&auto=format&fit=crop',
    category: 'Hands-on Lab',
  },
  {
    id: 'weekly-aws-workshops',
    title: 'Weekly AWS Builder Workshops',
    collapsedTitle: 'AWS Builder Workshops',
    collapsedMeta: 'Every Sunday',
    command: 'aws cloudformation deploy --stack live',
    mode: 'Online Live',
    date: 'Every Sunday',
    desc: 'Interactive live cloud architecture builds from scratch. Deploy serverless backends, connect cloud databases, and explore GenAI pipelines pushed directly to your portfolio.',
    highlights: [
      { num: '01', title: 'Serverless APIs', detail: 'Lambda, API Gateway & DynamoDB backends' },
      { num: '02', title: 'Cloud Storage', detail: 'S3 static hosting & CloudFront global CDN' },
      { num: '03', title: 'GenAI Deployments', detail: 'Bedrock foundational model integrations' },
    ],
    src: '/images/events/aws-builder.jpg',
    fallbackSrc: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
    category: 'Weekly Sprint',
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
  title: 'Upcoming Flagship Events',
  collapsedTitle: 'Upcoming Events',
  collapsedMeta: 'Semester Roadmap',
  command: 'vcloudops init --next-hackathon',
  mode: 'Roadmap 2026–27',
  date: 'Semester Roadmap',
  desc: 'Collaborate in teams to architect scalable cloud solutions for real-world problems. Earn AWS credits, win badges and swag, and walk away with production-ready resume projects.',
  highlights: [
    { num: '01', title: 'Cloud Hackathons', detail: 'Multi-track builds with cash prizes & AWS credits' },
    { num: '02', title: 'Deep Dive Sprints', detail: 'Advanced DevOps, Kubernetes & Security bootcamps' },
    { num: '03', title: 'Industry Connect', detail: 'Direct access to cloud architects & tech leaders' },
  ],
  src: '/images/events/upcoming-event.jpg',
  fallbackSrc: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
  category: 'Roadmap',
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

      // Vertical distance dynamically scaled to the number of cards
      const getPinDistance = () =>
        Math.max(1400, window.innerHeight * Math.max(1.6, totalCards * 0.65))

      const step = 1 / totalCards
      const deadband = Math.min(0.025, step * 0.12)

      const trigger = ScrollTrigger.create({
        trigger: section,
        pin: pinWrapper,
        start: 'top top',
        end: () => `+=${getPinDistance()}`,
        scrub: 0.8,
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
        className="w-full h-screen min-h-[620px] max-h-[1080px] flex flex-col justify-between overflow-hidden relative select-none"
        style={{
          paddingTop: 'clamp(5.25rem, 6.5vh + 1.25rem, 6rem)',
          paddingBottom: 'clamp(1rem, 2.5vh, 2rem)',
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
