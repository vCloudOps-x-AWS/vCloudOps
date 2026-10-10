// Tracks whether the initial hero entrance and particle assembly animation has played
// Guaranteed to play on:
// 1. First visit to website (nav type: 'navigate')
// 2. Every browser refresh (Ctrl+R, F5, reload button - nav type: 'reload')
// Persists ONLY during SPA in-app navigation (e.g. clicking Home in navbar or returning from /join)

let hasIntroAnimated = false
let introTimer = null

export function isPageReload() {
  if (typeof window === 'undefined') return false
  try {
    const navEntries = window.performance?.getEntriesByType?.('navigation')
    if (navEntries && navEntries.length > 0) {
      return navEntries[0].type === 'reload'
    }
    return window.performance?.navigation?.type === 1
  } catch {
    return false
  }
}

// On fresh page load or reload, ensure scroll position starts at top for hero visibility
if (typeof window !== 'undefined') {
  try {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    if (isPageReload()) {
      hasIntroAnimated = false
      window.scrollTo(0, 0)
    }
  } catch {}
}

export function getHasIntroAnimated() {
  return hasIntroAnimated
}

export function markIntroCompleted() {
  if (introTimer) {
    clearTimeout(introTimer)
    introTimer = null
  }
  hasIntroAnimated = true
}

export function markIntroStarted() {
  if (!introTimer && !hasIntroAnimated) {
    introTimer = setTimeout(() => {
      hasIntroAnimated = true
      introTimer = null
    }, 3500)
  }
}

export function setHasIntroAnimated(val = true) {
  if (introTimer) {
    clearTimeout(introTimer)
    introTimer = null
  }
  hasIntroAnimated = val
}

export function resetIntroAnimated() {
  if (introTimer) {
    clearTimeout(introTimer)
    introTimer = null
  }
  hasIntroAnimated = false
}
