import { useRef } from 'react'
import { Sparkle } from '@phosphor-icons/react'
import CircularCarousel from './CircularCarousel'
import PixelSculpt from './PixelSculpt'

const GALLERY_ITEMS = [
  { src: '/gallery/real-1.png', alt: 'Community Event', title: 'Community', subtitle: 'Team Event' },
  { src: '/gallery/event-2.jpg', alt: 'Hackathon Sprint', title: 'Sprint', subtitle: 'Hacksprint 2026' },
  { src: '/gallery/real-2.png', alt: 'Match Action', title: 'Action', subtitle: 'Sports Event' },
  { src: '/gallery/event-4.jpg', alt: 'DevSecOps Session', title: 'DevSecOps', subtitle: 'Security Clinic' },
  { src: '/gallery/real-3.png', alt: 'Group Photo', title: 'Group', subtitle: 'Team Building' },
  { src: '/gallery/event-6.jpg', alt: 'Tech Networking', title: 'Networking', subtitle: 'Student Engineers' },
  { src: '/gallery/real-4.png', alt: 'Team Cheer', title: 'Cheer', subtitle: 'Celebration' },
  { src: '/gallery/event-8.jpg', alt: 'AWS Deployment', title: 'AWS', subtitle: 'Cloud Architecture' },
  { src: '/gallery/real-5.png', alt: 'Team Kneel', title: 'Formation', subtitle: 'Strategy' },
  { src: '/gallery/event-10.jpg', alt: 'Tech Talk', title: 'Tech Talk', subtitle: 'Industry Leaders' },
]

export default function GallerySection() {
  const containerRef = useRef(null)

  return (
    <section
      id="gallery"
      ref={containerRef}
      className="relative py-20 sm:py-28 md:py-36 px-4 flex flex-col items-center text-center overflow-hidden z-10"
    >
      {/* Header */}
      <div className="gallery-header flex flex-col items-center max-w-3xl mb-12 sm:mb-16 relative z-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-sky-400/20 backdrop-blur-xl mb-6">
          <Sparkle weight="fill" className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[10px] sm:text-xs tracking-[0.22em] uppercase font-bold text-sky-400">
            Community Moments
          </span>
        </div>
        <h2
          className="font-extrabold text-white leading-tight tracking-tight mb-4"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
        >
          Orbiting Memories
        </h2>
        <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
          Explore snapshots from our recent hacksprints, cloud workshops, and community meetups.
        </p>
      </div>

      {/* Orbit System */}
      <div className="relative w-full max-w-[1200px] mx-auto h-[700px] flex items-center justify-center">
        
        {/* The React Bits Circular Carousel wrapping the UFO in 3D */}
        <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 10 }}>
          <CircularCarousel
            items={GALLERY_ITEMS}
            preset="cylinder"
            intro="rise"
            cardWidth={220}
            aspectRatio={1}
            speed={14}
            fadeColor="#050B18"
            captions={true}
          >
            <div className="w-[450px] h-[450px] sm:w-[700px] sm:h-[700px]">
              <PixelSculpt 
                src="/ufo.png"
                pixelSize={5}
                hoverRadius={90}
                speed={14}
              />
            </div>
          </CircularCarousel>
        </div>
      </div>
    </section>
  )
}
