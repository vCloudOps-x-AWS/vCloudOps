// Tracks whether the initial hero entrance and particle assembly animation has played
// Resets naturally upon browser refresh or first visit, but persists during in-app navigation
let hasIntroAnimated = false
let introTimer = null

export function getHasIntroAnimated() {
  return hasIntroAnimated
}

export function markIntroStarted() {
  // Allow intro animation to complete before locking it for the session
  // This ensures async font-loading and React StrictMode don't prematurely lock the state
  if (!introTimer && !hasIntroAnimated) {
    introTimer = setTimeout(() => {
      hasIntroAnimated = true
      introTimer = null
    }, 2400)
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
