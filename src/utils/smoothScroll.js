import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance = null

/**
 * Initialize Lenis smooth scroll and connect with GSAP ScrollTrigger
 */
export function initSmoothScroll() {
  if (typeof window === 'undefined') return null

  // Destroy existing instance if any
  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }

  // Check user prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    return null
  }

  lenisInstance = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    smoothTouch: false,
    syncTouch: false,
    touchMultiplier: 1.0,
    wheelMultiplier: 0.95,
    infinite: false,
  })

  // Synchronize Lenis scroll with GSAP ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update)

  const onTick = (time) => {
    if (lenisInstance) {
      lenisInstance.raf(time * 1000)
    }
  }

  gsap.ticker.add(onTick)
  gsap.ticker.lagSmoothing(500, 33)

  return lenisInstance
}

export function getLenis() {
  return lenisInstance
}

/**
 * Smoothly scroll to a specific target (selector or DOM element)
 * Automatically accounts for sticky/fixed navigation offset
 */
export function scrollToTarget(target, customOffset = -80) {
  if (!target) return

  const isHome = target === '#home' || (typeof target === 'object' && target?.id === 'home')

  if (isHome) {
    if (lenisInstance) {
      lenisInstance.scrollTo(0, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    return
  }

  const isAbout = target === '#about' || (typeof target === 'object' && target?.id === 'about')
  if (isAbout) {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (el) {
      const targetY = el.getBoundingClientRect().top + window.scrollY
      if (lenisInstance) {
        lenisInstance.scrollTo(targetY, {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        })
      } else {
        window.scrollTo({
          top: targetY,
          behavior: 'smooth',
        })
      }
      return
    }
  }

  const isEvents = target === '#events' || (typeof target === 'object' && target?.id === 'events')
  if (isEvents) {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (el) {
      const targetY = el.getBoundingClientRect().top + window.scrollY
      if (lenisInstance) {
        lenisInstance.scrollTo(targetY, {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        })
      } else {
        window.scrollTo({
          top: targetY,
          behavior: 'smooth',
        })
      }
      return
    }
  }

  // Uniform offset across standard sections: aligns header directly under the floating navbar
  const effectiveOffset = (customOffset === -80 || customOffset === -85) ? 15 : customOffset

  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset: effectiveOffset,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
  } else {
    // Fallback if Lenis is disabled or reduced motion
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 75
      window.scrollTo({
        top: Math.max(0, top),
        behavior: 'smooth',
      })
    }
  }
}
