import { useState, useRef, useEffect } from 'react'
import {
  Calendar,
  MapPin,
  ArrowSquareOut,
  CaretRight,
  CaretDown,
} from '@phosphor-icons/react'
import './AccordionGallery.css'

export default function AccordionGallery({
  items = [],
  activeIndex = 0,
  onSelect = () => {},
  className = '',
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const galleryRef = useRef(null)

  // Subtle 3D tilt tracking for expanded card on desktop
  const handleMouseMove = (e, index) => {
    if (index !== activeIndex || window.innerWidth < 768) return
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: x * 6, y: -y * 6 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (galleryRef.current && galleryRef.current.contains(document.activeElement)) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault()
          onSelect(Math.min(items.length - 1, activeIndex + 1))
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault()
          onSelect(Math.max(0, activeIndex - 1))
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, items.length, onSelect])

  if (!items || items.length === 0) return null

  return (
    <div
      ref={galleryRef}
      className={`accordion-gallery-container ${className}`}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      role="region"
      aria-label="Interactive Events Accordion Gallery"
    >
      {/* ── Main Accordion Track ── */}
      <div className="accordion-gallery-track">
        {items.map((item, index) => {
          const isExpanded = index === activeIndex
          const itemNumber = String(index + 1).padStart(2, '0')

          return (
            <div
              key={item.id || index}
              className={`accordion-panel ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
              onClick={() => onSelect(index)}
              onMouseMove={(e) => handleMouseMove(e, index)}
              style={
                isExpanded && typeof window !== 'undefined' && window.innerWidth >= 768
                  ? {
                      transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
                    }
                  : undefined
              }
              role="tab"
              aria-selected={isExpanded}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(index)
                }
              }}
            >
              {/* Top ambient glow accent line */}
              <div className="accordion-glow-accent" />

              {/* Background Image with Fallback handling */}
              <img
                src={item.src}
                alt={item.title}
                className="accordion-bg-img"
                loading="lazy"
                onError={(e) => {
                  if (item.fallbackSrc && e.currentTarget.src !== item.fallbackSrc) {
                    e.currentTarget.src = item.fallbackSrc
                  }
                }}
              />

              {/* Dark Gradient Glass Overlay */}
              <div className="accordion-overlay" />

              {/* ── Collapsed Content Layer (Permanently in DOM for smooth GPU cross-fade) ── */}
              <div className="accordion-collapsed-content">
                {/* Top: Item Index Circle */}
                <div className="flex items-center justify-center pt-0.5">
                  <span className="font-mono text-xs font-bold text-sky-300 bg-sky-950/80 border border-sky-400/30 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm">
                    {itemNumber}
                  </span>
                </div>

                {/* Center: Vertical Rotated Title in pure white */}
                <div className="accordion-vertical-title-wrap">
                  <div className="accordion-vertical-title">
                    <span className="font-bold text-white text-sm sm:text-[0.95rem] tracking-wide whitespace-nowrap">
                      {item.collapsedTitle || item.title}
                    </span>
                  </div>
                </div>

                {/* Bottom: Micro expand indicator */}
                <div className="flex items-center justify-center pb-0.5 text-slate-400">
                  <div className="hidden md:flex w-7 h-7 rounded-full bg-white/5 border border-white/10 items-center justify-center text-sky-400/70 hover:border-sky-400/40 hover:bg-sky-500/10 transition-all">
                    <CaretRight weight="bold" className="w-3.5 h-3.5" />
                  </div>
                  <div className="md:hidden flex items-center gap-1 text-xs text-sky-400/80 font-mono">
                    <span>Tap to view</span>
                    <CaretDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* ── Expanded Content Layer (Permanently in DOM with stable inner width) ── */}
              <div className="accordion-expanded-content">
                <div className="accordion-expanded-inner">
                  {/* Top Bar: Minimalist Developer Ticket Header */}
                  <div className="flex items-center justify-between gap-3 pb-2.5 sm:pb-3 border-b border-white/10 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sky-400 tracking-wider">
                        // {itemNumber}
                      </span>
                      <span className="text-white/20">/</span>
                      <span className="text-slate-300 font-semibold uppercase tracking-wider text-[11px] sm:text-xs">
                        {item.mode || item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 text-slate-300 text-[11px] sm:text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar weight="duotone" className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>{item.date}</span>
                      </div>

                      {item.venue && (
                        <>
                          <span className="text-white/20">·</span>
                          <div className="flex items-center gap-1.5">
                            <MapPin weight="duotone" className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            {item.mapsUrl ? (
                              <a
                                href={item.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sky-300 hover:text-white underline underline-offset-4 decoration-sky-400/50 hover:decoration-sky-300 transition-colors"
                                title="Open Venue in Google Maps"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span>{item.venue}</span>
                                <ArrowSquareOut className="w-3 h-3 text-sky-400" />
                              </a>
                            ) : (
                              <span>{item.venue}</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Main Grid: 2-Column Blueprint on Desktop, Clean Stack on Mobile */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-5 my-auto pt-2.5 sm:pt-3.5">
                    {/* Left Column: Title, CLI Command Hook, Narrative Brief */}
                    <div className="md:col-span-6 flex flex-col justify-between gap-2.5">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                          {item.title}
                        </h3>
                        {item.command && (
                          <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-black/40 border border-white/10 text-[11px] sm:text-xs font-mono text-emerald-400 backdrop-blur-md">
                            <span className="text-slate-500 select-none font-bold">$</span>
                            <span className="truncate">{item.command}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs sm:text-[13px] text-slate-300/90 leading-relaxed max-w-md">
                        {item.desc}
                      </p>
                    </div>

                    {/* Right Column: Structured Session Blueprint Highlights */}
                    {item.highlights && item.highlights.length > 0 && (
                      <div className="md:col-span-6 flex flex-col justify-center gap-1.5 sm:gap-2 border-t md:border-t-0 md:border-l border-white/10 pt-2.5 md:pt-0 md:pl-4">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold mb-0.5">
                          Session Blueprint
                        </div>
                        {item.highlights.map((hl) => (
                          <div
                            key={hl.num}
                            className="flex items-start gap-2.5 p-1.5 sm:p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/15 transition-all"
                          >
                            <span className="text-[11px] font-mono font-bold text-sky-400 bg-sky-950/70 border border-sky-400/20 px-1.5 py-0.5 rounded shrink-0">
                              {hl.num}
                            </span>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white tracking-tight">
                                {hl.title}
                              </h4>
                              <p className="text-[11px] text-slate-300/80 leading-snug">
                                {hl.detail}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

