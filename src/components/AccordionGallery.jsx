import { useState, useRef, useEffect } from 'react'
import {
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

              {/* ── Expanded Content Layer (Modern Swiss Editorial Poster) ── */}
              <div className="accordion-expanded-content">
                <div className="accordion-expanded-inner">
                  <div className="flex flex-col md:flex-row h-full w-full gap-2 sm:gap-4 md:gap-6 items-stretch justify-between">
                    {/* ── Left Rail: Swiss Date & Location Block ── */}
                    <div className="flex md:flex-col justify-between items-center md:items-start shrink-0 pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-white/10 md:pr-6 md:w-36">
                      <div className="flex items-baseline md:block gap-2 sm:gap-3">
                        {/* Index Indicator */}
                        <div className="text-[10px] sm:text-[11px] font-mono font-bold text-sky-400/90 tracking-widest uppercase md:mb-1">
                          // {itemNumber}
                        </div>
                        {/* Big Typography Date */}
                        <div className="font-mono font-black text-white text-2xl sm:text-3xl md:text-5xl tracking-tighter leading-none">
                          {item.dateDay || '13'}
                        </div>
                        <div className="text-[11px] sm:text-xs md:text-sm font-mono font-bold tracking-widest text-sky-400 uppercase md:mt-1">
                          {item.dateMonth || 'OCT'} {item.dateYear || '2026'}
                        </div>
                      </div>

                      {/* Location / Venue Indicator (only rendered when venue or maps link exists) */}
                      {(item.venue || item.mapsUrl) && (
                        <div className="pt-0 md:pt-4 md:border-t border-white/10 w-auto md:w-full flex flex-col items-end md:items-start text-right md:text-left">
                          <span className="hidden md:inline-block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                            VENUE
                          </span>
                          {item.mapsUrl ? (
                            <a
                              href={item.mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-mono font-bold text-sky-300 hover:text-white underline underline-offset-4 decoration-sky-400/40 hover:decoration-sky-300 transition-colors"
                              title="Open Location in Google Maps"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span>{item.locationCode || item.venue || 'CAMPUS'}</span>
                              <ArrowSquareOut className="w-3 h-3 text-sky-400" />
                            </a>
                          ) : (
                            <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-300">
                              {item.locationCode || item.venue}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* ── Right Rail: Editorial Typography & Story ── */}
                    <div className="flex-1 flex flex-col justify-between py-0.5 sm:py-1 min-w-0">
                      <div>
                        {/* Mode / Category Tag */}
                        <div className="inline-flex items-center gap-2 mb-1">
                          <span className="text-[9px] sm:text-[10px] md:text-[11px] font-mono font-semibold uppercase tracking-widest text-slate-400">
                            {item.mode || item.category}
                          </span>
                        </div>

                        {/* Main Editorial Title */}
                        <h3 className="text-base sm:text-xl md:text-3xl font-extrabold text-white tracking-tight leading-snug sm:leading-tight">
                          {item.title}
                        </h3>

                        {/* Strong Lead Statement */}
                        {item.lead && (
                          <p className="text-[11px] sm:text-xs md:text-[15px] font-semibold text-sky-100/90 mt-1 sm:mt-1.5 md:mt-2 leading-snug">
                            {item.lead}
                          </p>
                        )}
                      </div>

                      {/* Crisp Body Description */}
                      <p className="text-[11px] sm:text-xs md:text-[13px] text-slate-300/85 leading-relaxed text-justify max-w-xl mt-1.5 md:mt-0">
                        {item.desc}
                      </p>
                    </div>
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

