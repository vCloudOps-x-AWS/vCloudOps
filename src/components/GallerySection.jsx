import { ArrowLeft, ArrowRight, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import CircularCarousel from './CircularCarousel'
import './GallerySection.css'

const EVENT_PHOTOS = [
  { src: '/gallery/real-1.png', alt: 'Community members at a team event', title: 'Community', subtitle: 'Team Event' },
  { src: '/gallery/real-2.png', alt: 'Players celebrating after a match', title: 'Game day', subtitle: 'Sports Event' },
  { src: '/gallery/real-3.png', alt: 'The community gathered for a group photo', title: 'Together', subtitle: 'Team Building' },
  { src: '/gallery/real-4.png', alt: 'A team cheering together', title: 'The big cheer', subtitle: 'Celebration' },
  { src: '/gallery/real-5.png', alt: 'A team huddled together before an event', title: 'In formation', subtitle: 'Community' },
]

const makePlaceholder = (slot) => {
  const constellation = [
    [72, 78], [518, 92], [115, 331], [487, 300], [315, 57],
  ][(slot - 1) % 5]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#16466c"/><stop offset="1" stop-color="#0a2443"/></linearGradient>
      <radialGradient id="glow"><stop stop-color="#2ab7ff" stop-opacity=".3"/><stop offset="1" stop-color="#1599ed" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="600" height="420" fill="url(#bg)"/>
    <ellipse cx="300" cy="210" rx="252" ry="158" fill="url(#glow)"/>
    <ellipse cx="300" cy="210" rx="222" ry="78" fill="none" stroke="#73dcff" stroke-opacity=".34" transform="rotate(-16 300 210)"/>
    <circle cx="${constellation[0]}" cy="${constellation[1]}" r="3" fill="#b8efff"/>
    <circle cx="${600-constellation[0]}" cy="${420-constellation[1]}" r="2" fill="#54cfff"/>
    <g fill="none" stroke="#70d7ff" stroke-opacity=".58" stroke-width="3" stroke-linecap="round">
      <path d="M236 142v-18h26M364 142v-18h-26M236 278v18h26M364 278v18h-26"/>
    </g>
    <circle cx="300" cy="188" r="25" fill="#123f65" stroke="#79dcff" stroke-opacity=".86" stroke-width="2"/>
    <path d="M300 176v24m-12-12h24" stroke="#a6edff" stroke-width="2" stroke-linecap="round"/>
    <text x="300" y="246" fill="#d4efff" font-family="Arial,sans-serif" font-size="19" font-weight="600" letter-spacing="3" text-anchor="middle">NEXT MOMENT</text>
    <text x="300" y="274" fill="#76a8d2" font-family="Arial,sans-serif" font-size="12" letter-spacing="2" text-anchor="middle">YOUR STORY GOES HERE</text>
  </svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const GALLERY_ITEMS = EVENT_PHOTOS.flatMap((photo, index) => [
  photo,
  {
    src: makePlaceholder(index + 1),
    alt: 'Placeholder card for a future community moment',
    title: 'Next moment',
    subtitle: 'Your story goes here',
  },
])

export default function GallerySection() {
  const carouselRef = useRef(null)
  const rocketRef = useRef(null)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  const updateRocketLift = (rotationSpeed) => {
    const lift = Math.min(150, Math.max(0, (rotationSpeed - 12) * 0.65))
    rocketRef.current?.style.setProperty('--rocket-rise', `${-lift}px`)
  }

  useEffect(() => {
    if (!selectedPhoto) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setSelectedPhoto(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [selectedPhoto])

  return (
    <section id="gallery" className="gallery-section relative py-20 sm:py-28 md:py-36 px-4 flex flex-col items-center text-center overflow-hidden z-10">
      <div className="gallery-header flex flex-col items-center max-w-3xl mb-8 sm:mb-10 relative z-20">
        <h2 className="font-extrabold tracking-tight leading-[1.2] mb-3 sm:mb-4 px-2" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)' }}>
          <span className="text-white">Moments in </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-sky-400 to-sky-600 drop-shadow-[0_0_24px_rgba(56,189,248,0.3)]">
            Orbit
          </span>
        </h2>
        <p className="max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-slate-200/90 font-medium px-1 sm:px-2">
          The people, ideas, and memories that bring our community together.
        </p>
      </div>

      <div className="gallery-carousel-shell relative w-full max-w-[1200px] mx-auto">
        <CircularCarousel
          ref={carouselRef}
          className="gallery-carousel"
          items={GALLERY_ITEMS}
          preset="helix"
          helixPitch={typeof window !== 'undefined' && window.innerWidth < 768 ? 24 : 36}
          intro="rise"
          cardWidth={typeof window !== 'undefined' && window.innerWidth < 768 ? 165 : 205}
          aspectRatio={1.42}
          gap={10}
          autoplay="drift"
          speed={typeof window !== 'undefined' && window.innerWidth < 768 ? 8 : 12}
          interval={4}
          pauseOnHover={false}
          tilt={-5}
          fadeColor="#071329"
          innerShade={1}
          depthFade={0.25}
          tiltOnDrag
          cornerRadius={12}
          captions
          onVelocityChange={updateRocketLift}
          onItemClick={(item) => setSelectedPhoto(item)}
          style={{ height: 'clamp(380px, 46vw, 590px)' }}
        >
          <div
            ref={rocketRef}
            className="gallery-rocket-center"
            role="img"
            aria-label="Rocket at the center of the community photo carousel"
            onClick={(event) => event.stopPropagation()}
          >
            <img src="/gallery/rocket-clean.png" alt="" draggable={false} />
          </div>
        </CircularCarousel>
      </div>
      <div className="gallery-carousel-footer">
        <button className="gallery-rotate" type="button" aria-label="Rotate carousel left" onClick={() => carouselRef.current?.previous()}>
          <ArrowLeft weight="bold" aria-hidden="true" />
        </button>
        <p className="gallery-interaction-hint">Drag sideways to rotate · drag vertically to tilt · click a photo to view it</p>
        <button className="gallery-rotate" type="button" aria-label="Rotate carousel right" onClick={() => carouselRef.current?.next()}>
          <ArrowRight weight="bold" aria-hidden="true" />
        </button>
      </div>
      {selectedPhoto && createPortal((
        <div
          className="gallery-photo-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.title || selectedPhoto.alt}
          onClick={() => setSelectedPhoto(null)}
        >
          <button className="gallery-photo-close" type="button" aria-label="Close image" onClick={() => setSelectedPhoto(null)}>
            <X weight="bold" aria-hidden="true" />
          </button>
          <figure className="gallery-photo-figure" onClick={(event) => event.stopPropagation()}>
            <img src={selectedPhoto.src} alt={selectedPhoto.alt} />
            <figcaption>
              <strong>{selectedPhoto.title || selectedPhoto.alt}</strong>
              {selectedPhoto.subtitle && <span>{selectedPhoto.subtitle}</span>}
            </figcaption>
          </figure>
        </div>
      ), document.body)}
    </section>
  )
}
