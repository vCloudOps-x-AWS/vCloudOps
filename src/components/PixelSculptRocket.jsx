import { useRef, useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

export default function PixelSculptRocket({ speed = 14 }) {
  const containerRef = useRef(null)
  
  // Create a grid of pixels for the sculpt effect
  const rows = 12
  const cols = 12
  const pixels = Array.from({ length: rows * cols })

  // The oscillation amplitude depends on the speed prop
  // Default speed is 14. We'll map speed to amplitude.
  const amplitude = Math.max(10, speed * 1.5)
  const duration = Math.max(0.5, 40 / speed)

  const rocketAnimation = {
    y: [-amplitude, amplitude, -amplitude],
    transition: {
      repeat: Infinity,
      duration: duration,
      ease: "easeInOut"
    }
  }

  return (
    <motion.div 
      className="relative w-32 h-40 sm:w-48 sm:h-56 cursor-crosshair group z-50"
      animate={rocketAnimation}
    >
      {/* The Rocket Image - Using mix-blend-mode to try to remove the solid blue background 
          or just using CSS clip-path/brightness tricks. Since we can't perfectly remove it in CSS without 
          affecting the rocket, we'll give it a cool glowing filter. */}
      <img 
        src="/rocket.png" 
        alt="Rocket" 
        className="absolute inset-0 w-full h-full object-cover rounded-3xl"
        style={{ filter: 'drop-shadow(0px 0px 20px rgba(56, 189, 248, 0.5))' }}
      />

      {/* Pixel Sculpt Overlay Effect */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-0 overflow-hidden rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {pixels.map((_, i) => (
          <motion.div
            key={i}
            className="w-full h-full bg-slate-900/40 backdrop-blur-md border-[0.5px] border-sky-400/10"
            whileHover={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  )
}
