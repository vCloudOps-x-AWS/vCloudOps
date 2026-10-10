const WHEEL_RESET_GAP_MS = 60
const WHEEL_DISTANCE_FIRST = 10
const WHEEL_DISTANCE_REPEAT = 22
const WHEEL_REPEAT_INTERVAL_MS = 140

export function wheelGestureDirection(state, deltaY, now, deltaX = 0) {
  const newGesture = now - state.lastAt >= WHEEL_RESET_GAP_MS
  if (newGesture || !state.axis) state.axis = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y'
  const delta = state.axis === 'x' ? deltaX : deltaY
  const direction = Math.sign(delta)
  state.lastAt = now
  if (!direction) return 0

  if (newGesture || direction !== state.direction) {
    state.direction = direction
    state.distance = 0
    state.lastStepAt = 0
    state.consumed = false
  }

  state.distance += Math.abs(delta)
  const isFirst = !state.lastStepAt
  const threshold = isFirst ? WHEEL_DISTANCE_FIRST : WHEEL_DISTANCE_REPEAT
  const elapsed = now - (state.lastStepAt || 0)

  if (state.distance >= threshold && (isFirst || elapsed >= WHEEL_REPEAT_INTERVAL_MS)) {
    state.distance = 0
    state.lastStepAt = now
    state.consumed = true
    return direction
  }

  return 0
}
